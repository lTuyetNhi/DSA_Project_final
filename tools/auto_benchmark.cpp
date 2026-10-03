#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <iomanip>
#include <fstream>
#include <numeric>
#include <algorithm>
#include <random>

#include "src/models/Book.h"
#include "src/models/BorrowRecord.h"
#include "src/models/Reader.h"
#include "src/models/WaitlistEntry.h"
#include "src/persistence/FileStore.h"
#include "include/core/mc1/MC1.h"
#include "include/core/mc2/MC2.h"
#include "include/core/rq1/RQ1.h"
#include "include/core/rq2/RQ2.h"
#include "include/core/rq3/RQ3.h"

using namespace std;

struct BenchmarkRunResult {
    string moduleCode;
    string taskName;
    int dataSize;
    string baselineAlgo;
    double baselineAvgUs;
    string optAlgo;
    double optAvgUs;
    double speedup;
    string theoreticalComplexity;
};

template <typename Func>
void measure(Func&& f, int iterations, int warmup, double& avgUs) {
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
    avgUs = sum / iterations;
}

int main() {
    cout << "======================================================================\n";
    cout << "  HE THONG BENCHMARK VA THUC NGHIEM HIEN THUC HOA (AUTOMATED SUITE)  \n";
    cout << "======================================================================\n\n";

    // 1. KICH BAN 1: DỮ LIỆU THỰC TẾ (N = 10)
    vector<Book> booksReal = FileStore::loadBooks("data/books.json");
    vector<BorrowRecord> borrowReal = FileStore::loadBorrowRecords("data/borrow_records.json");

    MC1 mc1Real(booksReal); mc1Real.build();
    MC2 mc2Real(booksReal); mc2Real.build();
    RQ1 rq1Real(booksReal); rq1Real.build();
    RQ2 rq2Real(borrowReal); rq2Real.build();
    RQ3 rq3Real(booksReal); rq3Real.build();

    const int ITERS = 1000;
    const int WARMUP = 50;

    vector<BenchmarkRunResult> realResults;
    // Real MC1
    {
        string id = booksReal[booksReal.size() / 2].book_id;
        double bAvg, oAvg;
        measure([&]() { return mc1Real.getBaseline().search(booksReal, id); }, ITERS, WARMUP, bAvg);
        measure([&]() { return mc1Real.getFinalSolution().search(id); }, ITERS, WARMUP, oAvg);
        realResults.push_back({"MC1", "Tra cuu Ma Sach", (int)booksReal.size(), "Linear Search", bAvg, "Hash Table DJB2", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(1)"});
    }
    // Real MC2
    {
        double bAvg, oAvg;
        measure([&]() { return mc2Real.getBaseline().findMax(booksReal); }, ITERS, WARMUP, bAvg);
        measure([&]() { return mc2Real.getFinalSolution().getMax(); }, ITERS, WARMUP, oAvg);
        realResults.push_back({"MC2", "Top Sach Muon Nhieu", (int)booksReal.size(), "Linear Max Scan", bAvg, "Max-Heap Floyd", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(1)"});
    }
    // Real RQ1
    {
        string cat = booksReal[0].category;
        double bAvg, oAvg;
        measure([&]() { return rq1Real.getBaseline().search(booksReal, cat); }, ITERS, WARMUP, bAvg);
        measure([&]() { return rq1Real.getFinalSolution().search(cat); }, ITERS, WARMUP, oAvg);
        realResults.push_back({"RQ1", "Loc theo The loai", (int)booksReal.size(), "Linear Scan Filter", bAvg, "Category Hash Table", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(1+K)"});
    }
    // Real RQ2
    {
        string dt = "2026-10-02";
        double bAvg, oAvg;
        measure([&]() { return rq2Real.getBaseline().search(borrowReal, dt); }, ITERS, WARMUP, bAvg);
        measure([&]() { return rq2Real.getFinalSolution().findOverdue(dt); }, ITERS, WARMUP, oAvg);
        realResults.push_back({"RQ2", "Truy vet Muon Qua han", (int)borrowReal.size(), "Linear Scan Records", bAvg, "AVL Tree Range Pruning", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(log N + K)"});
    }
    // Real RQ3
    {
        string kw = "Lap";
        double bAvg, oAvg;
        measure([&]() { return rq3Real.getBaseline().search(booksReal, kw); }, ITERS, WARMUP, bAvg);
        measure([&]() { return rq3Real.getFinalSolution().search(kw); }, ITERS, WARMUP, oAvg);
        realResults.push_back({"RQ3", "Tim kiem Tu khoa Tieu de", (int)booksReal.size(), "Linear Substring Scan", bAvg, "Inverted Index Hash", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N*M) -> O(1+K)"});
    }

    // 2. KICH BAN 2: THỰC NGHIỆM MỞ RỘNG QUY MÔ LỚN (N = 5,000)
    int N_SCALE = 5000;
    vector<Book> booksScale;
    booksScale.reserve(N_SCALE);
    vector<string> cats = {"Lap trinh", "Khoa hoc", "Kinh te", "Van hoc", "Lich su", "Triet hoc"};
    vector<string> titles = {"Lap trinh C++ Nang cao", "Cau truc Du lieu va Giai thuat", "Co so Du lieu Quan he", "He dieu hanh va Kien truc", "Mang may tinh va An ninh", "Tri tue Nhan tao va Ung dung"};

    for (int i = 0; i < N_SCALE; ++i) {
        Book b;
        b.book_id = "BK" + to_string(10000 + i);
        b.title = titles[i % titles.size()] + " Tap " + to_string(i + 1);
        b.author = "Tac gia " + to_string((i % 50) + 1);
        b.category = cats[i % cats.size()];
        b.total_quantity = 10 + (i % 20);
        b.available_quantity = (i % 5);
        b.borrow_count = (i * 37) % 500;
        booksScale.push_back(b);
    }

    vector<BorrowRecord> borrowScale;
    borrowScale.reserve(N_SCALE);
    for (int i = 0; i < N_SCALE; ++i) {
        BorrowRecord br;
        br.borrow_id = "BR" + to_string(10000 + i);
        br.book_id = "BK" + to_string(10000 + (i % N_SCALE));
        br.reader_id = "RD" + to_string(1000 + (i % 500));
        br.borrow_date = "2026-09-01";
        int day = (i % 28) + 1;
        string dayStr = (day < 10 ? "0" : "") + to_string(day);
        br.due_date = "2026-09-" + dayStr;
        br.status = (i % 3 == 0) ? "BORROWING" : "RETURNED";
        borrowScale.push_back(br);
    }

    MC1 mc1Scale(booksScale); mc1Scale.build();
    MC2 mc2Scale(booksScale); mc2Scale.build();
    RQ1 rq1Scale(booksScale); rq1Scale.build();
    RQ2 rq2Scale(borrowScale); rq2Scale.build();
    RQ3 rq3Scale(booksScale); rq3Scale.build();

    vector<BenchmarkRunResult> scaleResults;
    // Scale MC1
    {
        string id = booksScale[N_SCALE - 50].book_id;
        double bAvg, oAvg;
        measure([&]() { return mc1Scale.getBaseline().search(booksScale, id); }, 500, 20, bAvg);
        measure([&]() { return mc1Scale.getFinalSolution().search(id); }, 500, 20, oAvg);
        scaleResults.push_back({"MC1", "Tra cuu Ma Sach", N_SCALE, "Linear Search", bAvg, "Hash Table DJB2", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(1)"});
    }
    // Scale MC2
    {
        double bAvg, oAvg;
        measure([&]() { return mc2Scale.getBaseline().findMax(booksScale); }, 500, 20, bAvg);
        measure([&]() { return mc2Scale.getFinalSolution().getMax(); }, 500, 20, oAvg);
        scaleResults.push_back({"MC2", "Top Sach Muon Nhieu", N_SCALE, "Linear Max Scan", bAvg, "Max-Heap Floyd", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(1)"});
    }
    // Scale RQ1
    {
        string cat = "Lap trinh";
        double bAvg, oAvg;
        measure([&]() { return rq1Scale.getBaseline().search(booksScale, cat); }, 500, 20, bAvg);
        measure([&]() { return rq1Scale.getFinalSolution().search(cat); }, 500, 20, oAvg);
        scaleResults.push_back({"RQ1", "Loc theo The loai", N_SCALE, "Linear Scan Filter", bAvg, "Category Hash Table", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(1+K)"});
    }
    // Scale RQ2
    {
        string dt = "2026-09-15";
        double bAvg, oAvg;
        measure([&]() { return rq2Scale.getBaseline().search(borrowScale, dt); }, 500, 20, bAvg);
        measure([&]() { return rq2Scale.getFinalSolution().findOverdue(dt); }, 500, 20, oAvg);
        scaleResults.push_back({"RQ2", "Truy vet Muon Qua han", N_SCALE, "Linear Scan Records", bAvg, "AVL Tree Range Pruning", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N) -> O(log N + K)"});
    }
    // Scale RQ3
    {
        string kw = "Giai";
        double bAvg, oAvg;
        measure([&]() { return rq3Scale.getBaseline().search(booksScale, kw); }, 500, 20, bAvg);
        measure([&]() { return rq3Scale.getFinalSolution().search(kw); }, 500, 20, oAvg);
        scaleResults.push_back({"RQ3", "Tim kiem Tu khoa Tieu de", N_SCALE, "Linear Substring Scan", bAvg, "Inverted Index Hash", oAvg, (oAvg>0?bAvg/oAvg:1.0), "O(N*M) -> O(1+K)"});
    }

    cout << "\n>>> [1] KET QUA KICH BAN THUC TE (N = 10):\n";
    for (const auto& r : realResults) {
        cout << "  " << left << setw(6) << r.moduleCode
             << setw(26) << r.taskName
             << "Baseline: " << setw(8) << fixed << setprecision(2) << r.baselineAvgUs << " us | "
             << "Opt: " << setw(8) << fixed << setprecision(2) << r.optAvgUs << " us | "
             << "Speedup: " << setw(8) << fixed << setprecision(1) << r.speedup << "x\n";
    }

    cout << "\n>>> [2] KET QUA KICH BAN QUY MO LON (N = 5,000):\n";
    for (const auto& r : scaleResults) {
        cout << "  " << left << setw(6) << r.moduleCode
             << setw(26) << r.taskName
             << "Baseline: " << setw(8) << fixed << setprecision(2) << r.baselineAvgUs << " us | "
             << "Opt: " << setw(8) << fixed << setprecision(2) << r.optAvgUs << " us | "
             << "Speedup: " << setw(8) << fixed << setprecision(1) << r.speedup << "x\n";
    }

    // Ghi vao tap tin du lieu thuc nghiem
    ofstream outReal("BaoCao/data/benchmark_real_10.txt");
    for (const auto& r : realResults) {
        outReal << r.moduleCode << "|" << r.taskName << "|" << r.baselineAvgUs << "|" << r.optAvgUs << "|" << r.speedup << "|" << r.theoreticalComplexity << "\n";
    }
    outReal.close();

    ofstream outScale("BaoCao/data/benchmark_scale_5000.txt");
    for (const auto& r : scaleResults) {
        outScale << r.moduleCode << "|" << r.taskName << "|" << r.baselineAvgUs << "|" << r.optAvgUs << "|" << r.speedup << "|" << r.theoreticalComplexity << "\n";
    }
    outScale.close();

    cout << "\n[OK] Da luu ket qua vao BaoCao/data/!\n";
    return 0;
}
