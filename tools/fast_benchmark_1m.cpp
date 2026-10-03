#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <iomanip>
#include <fstream>
#include <numeric>
#include <algorithm>

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

// Đo thời gian thực thi trung bình qua K lần lặp
template <typename Func>
double timeIt(Func&& f, int iters = 50) {
    // Warmup
    for (int i = 0; i < 5; ++i) f();
    auto start = chrono::high_resolution_clock::now();
    for (int i = 0; i < iters; ++i) {
        f();
    }
    auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::nanoseconds>(end - start).count() / (1000.0 * iters);
}

int main() {
    cout << "========================================================================================\n";
    cout << "   HE THONG BENCHMARK CAP DO CONG NGHIEP: N = 10 -> N = 10.000 -> N = 1.000.000 (1M)   \n";
    cout << "========================================================================================\n\n";

    // 1. KICH BAN GOC: N = 10 (Thực tế JSON)
    vector<Book> books10 = FileStore::loadBooks("data/books.json");
    vector<BorrowRecord> borrow10 = FileStore::loadBorrowRecords("data/borrow_records.json");
    MC1 mc1_10(books10); mc1_10.build();
    MC2 mc2_10(books10); mc2_10.build();
    RQ1 rq1_10(books10); rq1_10.build();
    RQ2 rq2_10(borrow10); rq2_10.build();
    RQ3 rq3_10(books10); rq3_10.build();

    string id10 = books10.empty() ? "" : books10[books10.size() / 2].book_id;
    string cat10 = books10.empty() ? "" : books10[0].category;
    string kw10 = "data";

    double t_mc1_base_10 = timeIt([&]() { return mc1_10.getBaseline().search(books10, id10); }, 500);
    double t_mc1_opt_10  = timeIt([&]() { return mc1_10.getFinalSolution().search(id10); }, 500);

    double t_mc2_base_10 = timeIt([&]() { return mc2_10.getBaseline().findMax(books10); }, 500);
    double t_mc2_opt_10  = timeIt([&]() { return mc2_10.getFinalSolution().getMax(); }, 500);

    double t_rq1_base_10 = timeIt([&]() { return rq1_10.getBaseline().search(books10, cat10); }, 500);
    double t_rq1_opt_10  = timeIt([&]() { return rq1_10.getFinalSolution().search(cat10); }, 500);

    double t_rq2_base_10 = timeIt([&]() { return rq2_10.getBaseline().search(borrow10, "2026-10-02"); }, 500);
    double t_rq2_opt_10  = timeIt([&]() { return rq2_10.getFinalSolution().findOverdue("2026-10-02"); }, 500);

    double t_rq3_base_10 = timeIt([&]() { return rq3_10.getBaseline().search(books10, kw10); }, 500);
    double t_rq3_opt_10  = timeIt([&]() { return rq3_10.getFinalSolution().search(kw10); }, 500);

    cout << ">>> [1] KET QUA KICH BAN THUC TE N = 10:\n";
    cout << " - MC1 (Ma sach):     Baseline = " << fixed << setprecision(2) << t_mc1_base_10 << " us | DSA = " << t_mc1_opt_10 << " us | Speedup = " << (t_mc1_base_10/t_mc1_opt_10) << "x\n";
    cout << " - MC2 (Top muon):    Baseline = " << t_mc2_base_10 << " us | DSA = " << t_mc2_opt_10 << " us | Speedup = " << (t_mc2_base_10/t_mc2_opt_10) << "x\n";
    cout << " - RQ1 (The loai):    Baseline = " << t_rq1_base_10 << " us | DSA = " << t_rq1_opt_10 << " us | Speedup = " << (t_rq1_base_10/t_rq1_opt_10) << "x\n";
    cout << " - RQ2 (Qua han):     Baseline = " << t_rq2_base_10 << " us | DSA = " << t_rq2_opt_10 << " us | Speedup = " << (t_rq2_base_10/t_rq2_opt_10) << "x\n";
    cout << " - RQ3 (Tu khoa):     Baseline = " << t_rq3_base_10 << " us | DSA = " << t_rq3_opt_10 << " us | Speedup = " << (t_rq3_base_10/t_rq3_opt_10) << "x\n\n";

    // 2. KICH BAN QUY MO LON: N = 100.000 (100K) -> Uoc luong scale 1.000.000 (1M)
    const int N_BENCH = 100000;
    cout << ">>> [2] DANG SINH VA DO TREN QUY MO 100.000 -> 1.000.000 PHAN TU...\n";
    vector<Book> booksBench;
    booksBench.reserve(N_BENCH);
    vector<string> cats = {"Lap trinh", "Khoa hoc", "Kinh te", "Van hoc", "Lich su"};
    for (int i = 0; i < N_BENCH; ++i) {
        Book b;
        b.book_id = "BK" + to_string(100000 + i);
        b.title = "Giai thuat va Lap trinh Tap " + to_string((i % 100) + 1);
        b.author = "Tac gia " + to_string((i % 50) + 1);
        b.category = cats[i % cats.size()];
        b.total_quantity = 50;
        b.available_quantity = 10;
        b.borrow_count = (i * 31) % 1000;
        booksBench.push_back(b);
    }

    vector<BorrowRecord> borrowBench;
    borrowBench.reserve(N_BENCH);
    for (int i = 0; i < N_BENCH; ++i) {
        BorrowRecord br;
        br.borrow_id = "BR" + to_string(100000 + i);
        br.book_id = "BK" + to_string(100000 + (i % N_BENCH));
        br.reader_id = "RD" + to_string(1000 + (i % 10000));
        br.borrow_date = "2026-08-01";
        int day = (i % 28) + 1;
        string dayStr = (day < 10 ? "0" : "") + to_string(day);
        br.due_date = "2026-08-" + dayStr;
        br.status = (i % 3 == 0) ? "BORROWING" : "RETURNED";
        borrowBench.push_back(br);
    }

    MC1 mc1_bench(booksBench); mc1_bench.build();
    MC2 mc2_bench(booksBench); mc2_bench.build();
    RQ1 rq1_bench(booksBench); rq1_bench.build();
    RQ2 rq2_bench(borrowBench); rq2_bench.build();
    RQ3 rq3_bench(booksBench); rq3_bench.build();

    // Do thoi gian tren N = 100K
    string targetId = booksBench[N_BENCH - 50].book_id;
    double t_mc1_base_100k = timeIt([&]() {
        for (int i = 0; i < N_BENCH; ++i) {
            if (booksBench[i].book_id == targetId) break;
        }
    }, 20);
    double t_mc1_opt_100k = timeIt([&]() { return mc1_bench.getFinalSolution().search(targetId); }, 200);

    double t_mc2_base_100k = timeIt([&]() {
        int maxB = -1;
        for (int i = 0; i < N_BENCH; ++i) {
            if (booksBench[i].borrow_count > maxB) maxB = booksBench[i].borrow_count;
        }
    }, 20);
    double t_mc2_opt_100k = timeIt([&]() { return mc2_bench.getFinalSolution().getMax(); }, 200);

    double t_rq1_base_100k = timeIt([&]() {
        vector<Book> res;
        for (int i = 0; i < N_BENCH; ++i) {
            if (booksBench[i].category == "Lap trinh") res.push_back(booksBench[i]);
        }
    }, 10);
    double t_rq1_opt_100k = timeIt([&]() { return rq1_bench.getFinalSolution().search("Lap trinh"); }, 20);

    double t_rq2_base_100k = timeIt([&]() {
        vector<BorrowRecord> res;
        for (int i = 0; i < N_BENCH; ++i) {
            if (borrowBench[i].status == "BORROWING" && borrowBench[i].due_date < "2026-08-15") {
                res.push_back(borrowBench[i]);
            }
        }
    }, 10);
    double t_rq2_opt_100k = timeIt([&]() { return rq2_bench.getFinalSolution().findOverdue("2026-08-15"); }, 20);

    double t_rq3_base_100k = timeIt([&]() {
        vector<Book> res;
        for (int i = 0; i < 20000; ++i) { // Mau 20K roi scale 100K
            if (booksBench[i].title.find("Giai") != string::npos) {
                res.push_back(booksBench[i]);
            }
        }
    }, 10) * 5.0;
    double t_rq3_opt_100k = timeIt([&]() { return rq3_bench.getFinalSolution().search("Giai"); }, 20);

    // UOC LUONG LEN 1.000.000 (1 TRIEU) PHAN TU THEO MO HINH LY THUYET & THUC NGHIEM
    // Baseline O(N) tang tuyen tinh gap 10 lan. DSA O(1) giu nguyen ~0.3us, O(log N) tang log2(1M)/log2(100K) = 20/16.6 = 1.2 lan.
    double t_mc1_base_1m = t_mc1_base_100k * 10.0;
    double t_mc1_opt_1m  = t_mc1_opt_100k * 1.05; // O(1)

    double t_mc2_base_1m = t_mc2_base_100k * 10.0;
    double t_mc2_opt_1m  = t_mc2_opt_100k; // O(1) Max-Heap root

    double t_rq1_base_1m = t_rq1_base_100k * 10.0;
    double t_rq1_opt_1m  = t_rq1_opt_100k * 10.0; // O(1+K) voi K tang theo ty le

    double t_rq2_base_1m = t_rq2_base_100k * 10.0;
    double t_rq2_opt_1m  = t_rq2_opt_100k * 1.2; // O(log N + K)

    double t_rq3_base_1m = t_rq3_base_100k * 10.0;
    double t_rq3_opt_1m  = t_rq3_opt_100k * 10.0; // O(N*M) voi cach tim tieu de chuan hoa hien tai

    cout << "\n========================================================================================================\n";
    cout << "                    BANG TONG HOP BENCHMARK DOI SANH DA CAP DO (10 -> 100K -> 1M)                      \n";
    cout << "========================================================================================================\n";
    cout << left << setw(6)  << "YC"
         << setw(24) << "Thao tac"
         << setw(16) << "N=10 Base/Opt"
         << setw(18) << "N=100K Base/Opt"
         << setw(22) << "N=1M est. Base/Opt"
         << setw(18) << "Speedup (1M)" << "\n";
    cout << string(104, '-') << "\n";

    auto row = [](string yc, string name, double b10, double o10, double b100k, double o100k, double b1m, double o1m) {
        string s10 = to_string((int)(b10*10)/10.0).substr(0,4) + "/" + to_string((int)(o10*10)/10.0).substr(0,4);
        string s100k = to_string((int)b100k) + "/" + to_string((int)(o100k*10)/10.0).substr(0,4);
        string s1m = to_string((int)b1m) + "/" + to_string((int)(o1m*10)/10.0).substr(0,4);
        double sp = b1m / o1m;
        string spStr = to_string((int)sp) + "x (" + to_string(sp).substr(0, 5) + "x)";
        cout << left << setw(6)  << yc
             << setw(24) << name
             << setw(16) << s10
             << setw(18) << s100k
             << setw(22) << s1m
             << setw(18) << spStr << "\n";
    };

    row("MC1", "Tra cuu Ma Sach", t_mc1_base_10, t_mc1_opt_10, t_mc1_base_100k, t_mc1_opt_100k, t_mc1_base_1m, t_mc1_opt_1m);
    row("MC2", "Top Sach Muon", t_mc2_base_10, t_mc2_opt_10, t_mc2_base_100k, t_mc2_opt_100k, t_mc2_base_1m, t_mc2_opt_1m);
    row("RQ1", "Loc The loai", t_rq1_base_10, t_rq1_opt_10, t_rq1_base_100k, t_rq1_opt_100k, t_rq1_base_1m, t_rq1_opt_1m);
    row("RQ2", "Truy vet Qua han", t_rq2_base_10, t_rq2_opt_10, t_rq2_base_100k, t_rq2_opt_100k, t_rq2_base_1m, t_rq2_opt_1m);
    row("RQ3", "Tim kiem Tu khoa", t_rq3_base_10, t_rq3_opt_10, t_rq3_base_100k, t_rq3_opt_100k, t_rq3_base_1m, t_rq3_opt_1m);

    cout << "========================================================================================================\n";
    return 0;
}
