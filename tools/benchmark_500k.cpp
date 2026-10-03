#include <algorithm>
#include <chrono>
#include <cstdlib>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

#include "../include/core/mc1/MC1.h"
#include "../include/core/mc2/MC2.h"
#include "../include/core/rq1/RQ1.h"
#include "../include/core/rq2/RQ2.h"
#include "../include/core/rq3/RQ3.h"
#include "../src/models/Book.h"
#include "../src/models/BorrowRecord.h"
#include "../src/persistence/FileStore.h"

using namespace std;

struct BenchmarkRecord {
    string code;
    string name;
    double base10;
    double opt10;
    double sp10;
    double base500k;
    double opt500k;
    double sp500k;
    string complexity;
};

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
        auto start = chrono::high_resolution_clock::now();
        f();
        auto end = chrono::high_resolution_clock::now();
        runs.push_back(chrono::duration_cast<chrono::nanoseconds>(end - start).count() / 1000.0);
    }

    return accumulate(runs.begin(), runs.end(), 0.0) / runs.size();
}

vector<Book> makeBooks(int n) {
    vector<Book> books;
    books.reserve(n);
    vector<string> categories = {"Computer Science", "Software Engineering", "Database", "Networking", "Mathematics"};
    vector<string> titleWords = {"Algorithms", "Database", "System", "Network", "Design", "Clean Code", "Data Structures"};

    for (int i = 0; i < n; ++i) {
        Book b;
        b.book_id = "BK" + to_string(1000000 + i);
        b.title = titleWords[i % titleWords.size()] + " Volume " + to_string(i % 100);
        b.author = "Author " + to_string(i % 1000);
        b.category = categories[i % categories.size()];
        b.published_year = 1990 + (i % 35);
        b.total_quantity = 5 + (i % 20);
        b.available_quantity = i % b.total_quantity;
        b.borrow_count = (i * 37) % 10000;
        books.push_back(b);
    }
    return books;
}

vector<BorrowRecord> makeBorrowRecords(int n) {
    vector<BorrowRecord> records;
    records.reserve(n);

    for (int i = 0; i < n; ++i) {
        int day = (i % 28) + 1;
        string dayText = (day < 10 ? "0" : "") + to_string(day);

        BorrowRecord br;
        br.borrow_id = "BR" + to_string(1000000 + i);
        br.reader_id = "RD" + to_string(10000 + (i % 50000));
        br.book_id = "BK" + to_string(1000000 + i);
        br.borrow_date = "2026-08-01";
        br.due_date = "2026-09-" + dayText;
        br.return_date = "";
        br.status = (i % 3 == 0) ? "BORROWING" : "RETURNED";
        records.push_back(br);
    }
    return records;
}

int main(int argc, char* argv[]) {
    int nSynthetic = 20000;
    if (argc > 1) {
        int requested = atoi(argv[1]);
        if (requested > 0) {
            nSynthetic = requested;
        }
    }

    cout << "========================================================================================\n";
    cout << "  BENCHMARK DO THUC TE: N = 10 (JSON) VA N = " << nSynthetic << " (SYNTHETIC IN-MEMORY)\n";
    cout << "========================================================================================\n\n";

    vector<Book> books10 = FileStore::loadBooks("data/books.json");
    vector<BorrowRecord> borrow10 = FileStore::loadBorrowRecords("data/borrow_records.json");
    if (books10.empty() || borrow10.empty()) {
        cerr << "[ERROR] Khong load duoc data/*.json de benchmark N=10.\n";
        return 1;
    }

    MC1 mc1_10(books10); mc1_10.build();
    MC2 mc2_10(books10); mc2_10.build();
    RQ1 rq1_10(books10); rq1_10.build();
    RQ2 rq2_10(borrow10); rq2_10.build();
    RQ3 rq3_10(books10); rq3_10.build();

    string id10 = books10[books10.size() / 2].book_id;
    string cat10 = books10[0].category;
    double b10_mc1 = measureAvgUs([&]() { return mc1_10.getBaseline().search(books10, id10); }, 1000, 20);
    double o10_mc1 = measureAvgUs([&]() { return mc1_10.getFinalSolution().search(id10); }, 1000, 20);
    double b10_mc2 = measureAvgUs([&]() { return mc2_10.getBaseline().findMax(books10); }, 1000, 20);
    double o10_mc2 = measureAvgUs([&]() { return mc2_10.getFinalSolution().getMax(); }, 1000, 20);
    double b10_rq1 = measureAvgUs([&]() { return rq1_10.getBaseline().search(books10, cat10); }, 1000, 20);
    double o10_rq1 = measureAvgUs([&]() { return rq1_10.getFinalSolution().search(cat10); }, 1000, 20);
    double b10_rq2 = measureAvgUs([&]() { return rq2_10.getBaseline().search(borrow10, "2026-10-02"); }, 1000, 20);
    double o10_rq2 = measureAvgUs([&]() { return rq2_10.getFinalSolution().findOverdue("2026-10-02"); }, 1000, 20);
    double b10_rq3 = measureAvgUs([&]() { return rq3_10.getBaseline().search(books10, "data"); }, 1000, 20);
    double o10_rq3 = measureAvgUs([&]() { return rq3_10.getFinalSolution().search("data"); }, 1000, 20);

    cout << "Dang sinh va build cau truc cho " << nSynthetic << " phan tu...\n";
    vector<Book> books500k = makeBooks(nSynthetic);
    vector<BorrowRecord> borrow500k = makeBorrowRecords(nSynthetic);

    MC1 mc1_500k(books500k); mc1_500k.build();
    MC2 mc2_500k(books500k); mc2_500k.build();
    RQ1 rq1_500k(books500k); rq1_500k.build();
    RQ2 rq2_500k(borrow500k); rq2_500k.build();
    RQ3 rq3_500k(books500k); rq3_500k.build();

    string id500k = books500k[nSynthetic - 10].book_id;
    double b500k_mc1 = measureAvgUs([&]() { return mc1_500k.getBaseline().search(books500k, id500k); }, 3, 1);
    double o500k_mc1 = measureAvgUs([&]() { return mc1_500k.getFinalSolution().search(id500k); }, 100, 5);
    double b500k_mc2 = measureAvgUs([&]() { return mc2_500k.getBaseline().findMax(books500k); }, 3, 1);
    double o500k_mc2 = measureAvgUs([&]() { return mc2_500k.getFinalSolution().getMax(); }, 100, 5);
    double b500k_rq1 = measureAvgUs([&]() { return rq1_500k.getBaseline().search(books500k, "Computer Science"); }, 2, 1);
    double o500k_rq1 = measureAvgUs([&]() { return rq1_500k.getFinalSolution().search("Computer Science"); }, 5, 1);
    double b500k_rq2 = measureAvgUs([&]() { return rq2_500k.getBaseline().search(borrow500k, "2026-09-15"); }, 2, 1);
    double o500k_rq2 = measureAvgUs([&]() { return rq2_500k.getFinalSolution().findOverdue("2026-09-15"); }, 5, 1);
    double b500k_rq3 = measureAvgUs([&]() { return rq3_500k.getBaseline().search(books500k, "data"); }, 1, 0);
    double o500k_rq3 = measureAvgUs([&]() { return rq3_500k.getFinalSolution().search("data"); }, 1, 0);

    auto speedup = [](double baseline, double optimized) {
        return optimized > 0.0 ? baseline / optimized : 0.0;
    };

    vector<BenchmarkRecord> rows = {
        {"MC1", "Tra cuu Ma Sach", b10_mc1, o10_mc1, speedup(b10_mc1, o10_mc1), b500k_mc1, o500k_mc1, speedup(b500k_mc1, o500k_mc1), "O(N) -> O(1)"},
        {"MC2", "Top Sach Muon Nhieu", b10_mc2, o10_mc2, speedup(b10_mc2, o10_mc2), b500k_mc2, o500k_mc2, speedup(b500k_mc2, o500k_mc2), "O(N) -> O(1)"},
        {"RQ1", "Loc theo The loai", b10_rq1, o10_rq1, speedup(b10_rq1, o10_rq1), b500k_rq1, o500k_rq1, speedup(b500k_rq1, o500k_rq1), "O(N) -> O(1+K)"},
        {"RQ2", "Truy vet Muon Qua han", b10_rq2, o10_rq2, speedup(b10_rq2, o10_rq2), b500k_rq2, o500k_rq2, speedup(b500k_rq2, o500k_rq2), "O(N) -> O(log N+K)"},
        {"RQ3", "Tim kiem Tu khoa", b10_rq3, o10_rq3, speedup(b10_rq3, o10_rq3), b500k_rq3, o500k_rq3, speedup(b500k_rq3, o500k_rq3), "O(NM) -> O(C+K)"}
    };

    cout << "\n========================================================================================================\n";
    cout << "            BANG TONG HOP BENCHMARK DO THUC TE: N = 10 VA N = " << nSynthetic << "\n";
    cout << "========================================================================================================\n";
    cout << left << setw(6) << "Ma"
         << setw(24) << "Nghiep vu"
         << setw(16) << "N=10 Base"
         << setw(16) << "N=10 Final"
         << setw(18) << "N Synth Base"
         << setw(18) << "N Synth Final"
         << setw(14) << "Speedup"
         << "Complexity\n";
    cout << string(124, '-') << "\n";

    for (const auto& r : rows) {
        cout << left << setw(6) << r.code
             << setw(24) << r.name
             << setw(16) << fixed << setprecision(2) << r.base10
             << setw(16) << fixed << setprecision(2) << r.opt10
             << setw(18) << fixed << setprecision(2) << r.base500k
             << setw(18) << fixed << setprecision(2) << r.opt500k
             << setw(14) << fixed << setprecision(1) << r.sp500k
             << r.complexity << "\n";
    }
    cout << "========================================================================================================\n";

    ofstream out("BaoCao/data/benchmark_summary_synthetic.txt");
    for (const auto& r : rows) {
        out << r.code << "|" << r.name << "|" << r.base10 << "|" << r.opt10 << "|" << r.sp10 << "|"
            << r.base500k << "|" << r.opt500k << "|" << r.sp500k << "|" << r.complexity << "\n";
    }
    cout << "\n[OK] Da xuat du lieu do thuc te sang BaoCao/data/benchmark_summary_synthetic.txt\n";
    return 0;
}
