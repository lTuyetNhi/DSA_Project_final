#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <iomanip>
#include <fstream>
#include <numeric>
#include <algorithm>
#include <random>

#include "../src/models/Book.h"
#include "../src/models/BorrowRecord.h"
#include "../src/models/Reader.h"
#include "../src/models/WaitlistEntry.h"
#include "../src/persistence/FileStore.h"
#include "../include/core/mc1/MC1.h"
#include "../include/core/mc2/MC2.h"
#include "../include/core/rq1/RQ1.h"
#include "../include/core/rq2/RQ2.h"
#include "../include/core/rq3/RQ3.h"

using namespace std;

template <typename Func>
double measureAvgUs(Func&& f, int iterations, int warmup) {
    if (iterations <= 0) iterations = 1;
    if (warmup < 0) warmup = 0;

    for (int i = 0; i < warmup; ++i) {
        f();
    }
    vector<double> runs;
    runs.reserve(iterations);
    for (int i = 0; i < iterations; ++i) {
        auto t1 = chrono::high_resolution_clock::now();
        f();
        auto t2 = chrono::high_resolution_clock::now();
        double us = chrono::duration_cast<chrono::nanoseconds>(t2 - t1).count() / 1000.0;
        runs.push_back(us);
    }
    double sum = accumulate(runs.begin(), runs.end(), 0.0);
    return sum / iterations;
}

int main() {
    cout << "======================================================================\n";
    cout << "   BENCHMARK STRESS TEST VOI 1.000.000 (1 TRIEU) DU LIEU IN-MEMORY   \n";
    cout << "======================================================================\n";

    const int N_1M = 1000000;
    cout << "[1/4] Dang sinh 1.000.000 cuon sach vao RAM...\n";
    vector<Book> books1M;
    books1M.reserve(N_1M);
    vector<string> cats = {"Lap trinh", "Khoa hoc", "Kinh te", "Van hoc", "Lich su", "Triet hoc", "Tam ly", "Y hoc"};
    vector<string> keywords = {"Algorithms", "Database", "Structure", "Network", "System", "Intelligence", "Security", "Design"};

    for (int i = 0; i < N_1M; ++i) {
        Book b;
        b.book_id = "BK" + to_string(1000000 + i);
        b.title = "Mastering " + keywords[i % keywords.size()] + " Volume " + to_string((i % 100) + 1);
        b.author = "Author " + to_string((i % 500) + 1);
        b.category = cats[i % cats.size()];
        b.total_quantity = 20 + (i % 30);
        b.available_quantity = (i % 10);
        b.borrow_count = (i * 73) % 2000;
        books1M.push_back(b);
    }

    cout << "[2/4] Dang sinh 1.000.000 phieu muon vao RAM...\n";
    vector<BorrowRecord> borrow1M;
    borrow1M.reserve(N_1M);
    for (int i = 0; i < N_1M; ++i) {
        BorrowRecord br;
        br.borrow_id = "BR" + to_string(1000000 + i);
        br.book_id = "BK" + to_string(1000000 + (i % N_1M));
        br.reader_id = "RD" + to_string(10000 + (i % 50000));
        br.borrow_date = "2026-08-15";
        int day = (i % 28) + 1;
        string dayStr = (day < 10 ? "0" : "") + to_string(day);
        br.due_date = "2026-09-" + dayStr;
        br.status = (i % 4 == 0) ? "BORROWING" : "RETURNED";
        borrow1M.push_back(br);
    }

    cout << "[3/4] Dang xay dung cac cau truc (HashTable, MaxHeap, AVL, TitleSearch)...\n";
    auto tBuildStart = chrono::high_resolution_clock::now();
    MC1 mc1(books1M); mc1.build();
    MC2 mc2(books1M); mc2.build();
    RQ1 rq1(books1M); rq1.build();
    RQ2 rq2(borrow1M); rq2.build();
    RQ3 rq3(books1M); rq3.build();
    auto tBuildEnd = chrono::high_resolution_clock::now();
    double buildTimeSec = chrono::duration_cast<chrono::milliseconds>(tBuildEnd - tBuildStart).count() / 1000.0;
    cout << " -> Build xong toan bo 5 cau truc DSA tren 1 trieu phan tu trong: " << buildTimeSec << " giay!\n\n";

    cout << "[4/4] Dang thuc hien do kiem Benchmark doi chung (1.000.000 phan tu)...\n\n";

    // 1. MC1: Tra cuu ma sach
    string targetId = "BK" + to_string(1000000 + N_1M - 100);
    double mc1OptUs = measureAvgUs([&]() { return mc1.getFinalSolution().search(targetId); }, 1000, 50);
    // Baseline do tren 10.000 phan tu roi scale de tranh freeze may do O(N) tren 1M qua lau
    double mc1BaseSample = measureAvgUs([&]() {
        for (int i = 0; i < 50000; ++i) {
            if (books1M[i].book_id == targetId) break;
        }
    }, 50, 5);
    double mc1BaseEstimatedUs = mc1BaseSample * (N_1M / 50000.0);

    // 2. MC2: Top sach muon nhieu nhat
    double mc2OptUs = measureAvgUs([&]() { return mc2.getFinalSolution().getMax(); }, 1000, 50);
    double mc2BaseSample = measureAvgUs([&]() {
        int maxB = -1;
        for (int i = 0; i < 50000; ++i) {
            if (books1M[i].borrow_count > maxB) maxB = books1M[i].borrow_count;
        }
    }, 50, 5);
    double mc2BaseEstimatedUs = mc2BaseSample * (N_1M / 50000.0);

    // 3. RQ1: Loc theo the loai
    string targetCat = "Lap trinh";
    double rq1OptUs = measureAvgUs([&]() { return rq1.getFinalSolution().search(targetCat); }, 100, 10);
    double rq1BaseSample = measureAvgUs([&]() {
        vector<Book> res;
        for (int i = 0; i < 50000; ++i) {
            if (books1M[i].category == targetCat) res.push_back(books1M[i]);
        }
    }, 20, 5);
    double rq1BaseEstimatedUs = rq1BaseSample * (N_1M / 50000.0);

    // 4. RQ2: Truy vet phieu qua han
    string targetDate = "2026-09-10";
    double rq2OptUs = measureAvgUs([&]() { return rq2.getFinalSolution().findOverdue(targetDate); }, 100, 10);
    double rq2BaseSample = measureAvgUs([&]() {
        vector<BorrowRecord> res;
        for (int i = 0; i < 50000; ++i) {
            if (borrow1M[i].status == "BORROWING" && borrow1M[i].due_date < targetDate) {
                res.push_back(borrow1M[i]);
            }
        }
    }, 20, 5);
    double rq2BaseEstimatedUs = rq2BaseSample * (N_1M / 50000.0);

    // 5. RQ3: Tim kiem tu khoa
    string targetKw = "Algorithms";
    double rq3OptUs = measureAvgUs([&]() { return rq3.getFinalSolution().search(targetKw); }, 100, 10);
    double rq3BaseSample = measureAvgUs([&]() {
        vector<Book> res;
        for (int i = 0; i < 20000; ++i) {
            if (books1M[i].title.find(targetKw) != string::npos) {
                res.push_back(books1M[i]);
            }
        }
    }, 10, 2);
    double rq3BaseEstimatedUs = rq3BaseSample * (N_1M / 20000.0);

    cout << "========================================================================================================\n";
    cout << "                        KET QUA BENCHMARK STRESS TEST 1.000.000 PHAN TU                                 \n";
    cout << "========================================================================================================\n";
    cout << left << setw(8) << "Module"
         << setw(26) << "Nghiep vu"
         << setw(20) << "Baseline est. (us)"
         << setw(18) << "DSA Opt (us)"
         << setw(16) << "Speedup"
         << setw(16) << "Do phuc tap" << "\n";
    cout << string(104, '-') << "\n";

    auto printRow = [](string m, string t, double b, double o, string c) {
        double sp = (o > 0.0001) ? (b / o) : 1.0;
        cout << left << setw(8) << m
             << setw(26) << t
             << setw(20) << fixed << setprecision(2) << b
             << setw(18) << fixed << setprecision(2) << o
             << setw(16) << (to_string((int)sp) + "x (" + to_string(sp).substr(0, 5) + "x)")
             << setw(16) << c << "\n";
    };

    printRow("MC1", "Tra cuu Ma Sach", mc1BaseEstimatedUs, mc1OptUs, "O(N) -> O(1)");
    printRow("MC2", "Top Sach Muon Nhieu", mc2BaseEstimatedUs, mc2OptUs, "O(N) -> O(1)");
    printRow("RQ1", "Loc theo The loai", rq1BaseEstimatedUs, rq1OptUs, "O(N) -> O(1+K)");
    printRow("RQ2", "Truy vet Muon Qua han", rq2BaseEstimatedUs, rq2OptUs, "O(N) -> O(log N+K)");
    printRow("RQ3", "Tim kiem Tu khoa", rq3BaseEstimatedUs, rq3OptUs, "O(NM) -> O(C+K)");

    cout << "========================================================================================================\n";
    return 0;
}
