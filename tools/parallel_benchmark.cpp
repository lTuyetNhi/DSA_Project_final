#include <algorithm>
#include <chrono>
#include <cstdlib>
#include <future>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <string>
#include <thread>
#include <vector>

#include "../include/core/mc1/MC1.h"
#include "../include/core/mc2/MC2.h"
#include "../include/core/rq1/RQ1.h"
#include "../include/core/rq2/RQ2.h"
#include "../include/core/rq3/RQ3.h"
#include "../src/models/Book.h"
#include "../src/models/BorrowRecord.h"

using namespace std;

struct BatchSummary {
    bool mc1Found = false;
    bool mc2Found = false;
    size_t rq1Count = 0;
    size_t rq2Count = 0;
    size_t rq3Count = 0;
};

static vector<Book> makeBooks(int n) {
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

static vector<BorrowRecord> makeBorrowRecords(int n) {
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

template <typename Func>
static double measureAvgUs(Func&& func, int iterations, int warmup) {
    for (int i = 0; i < warmup; ++i) {
        func();
    }

    vector<double> runs;
    runs.reserve(iterations);
    for (int i = 0; i < iterations; ++i) {
        auto start = chrono::high_resolution_clock::now();
        func();
        auto end = chrono::high_resolution_clock::now();
        runs.push_back(chrono::duration_cast<chrono::nanoseconds>(end - start).count() / 1000.0);
    }
    return accumulate(runs.begin(), runs.end(), 0.0) / runs.size();
}

static BatchSummary runSequential(MC1& mc1, MC2& mc2, RQ1& rq1, RQ2& rq2, RQ3& rq3,
                                  const string& bookId, const string& category,
                                  const string& date, const string& keyword) {
    BatchSummary summary;
    summary.mc1Found = mc1.getFinalSolution().search(bookId).found;
    summary.mc2Found = mc2.getFinalSolution().getMax().found;
    summary.rq1Count = rq1.getFinalSolution().search(category).books.size();
    summary.rq2Count = rq2.getFinalSolution().findOverdue(date).records.size();
    summary.rq3Count = rq3.getFinalSolution().search(keyword).books.size();
    return summary;
}

static BatchSummary runParallel(MC1& mc1, MC2& mc2, RQ1& rq1, RQ2& rq2, RQ3& rq3,
                                const string& bookId, const string& category,
                                const string& date, const string& keyword) {
    auto f1 = async(launch::async, [&]() { return mc1.getFinalSolution().search(bookId); });
    auto f2 = async(launch::async, [&]() { return mc2.getFinalSolution().getMax(); });
    auto f3 = async(launch::async, [&]() { return rq1.getFinalSolution().search(category); });
    auto f4 = async(launch::async, [&]() { return rq2.getFinalSolution().findOverdue(date); });
    auto f5 = async(launch::async, [&]() { return rq3.getFinalSolution().search(keyword); });

    auto r1 = f1.get();
    auto r2 = f2.get();
    auto r3 = f3.get();
    auto r4 = f4.get();
    auto r5 = f5.get();

    BatchSummary summary;
    summary.mc1Found = r1.found;
    summary.mc2Found = r2.found;
    summary.rq1Count = r3.books.size();
    summary.rq2Count = r4.records.size();
    summary.rq3Count = r5.books.size();
    return summary;
}

int main(int argc, char* argv[]) {
    int n = 50000;
    if (argc > 1) {
        int requested = atoi(argv[1]);
        if (requested > 0) {
            n = requested;
        }
    }

    cout << "============================================================\n";
    cout << " PARALLEL BENCHMARK: Sequential vs std::async batch queries\n";
    cout << "============================================================\n";
    cout << "Dataset size: " << n << " books / " << n << " borrow records\n";

    vector<Book> books = makeBooks(n);
    vector<BorrowRecord> records = makeBorrowRecords(n);

    MC1 mc1(books); mc1.build();
    MC2 mc2(books); mc2.build();
    RQ1 rq1(books); rq1.build();
    RQ2 rq2(records); rq2.build();
    RQ3 rq3(books); rq3.build();

    string bookId = books[n - 10].book_id;
    string category = "Computer Science";
    string date = "2026-09-15";
    string keyword = "Data";

    BatchSummary seqCheck = runSequential(mc1, mc2, rq1, rq2, rq3, bookId, category, date, keyword);
    BatchSummary parCheck = runParallel(mc1, mc2, rq1, rq2, rq3, bookId, category, date, keyword);
    bool same = seqCheck.mc1Found == parCheck.mc1Found &&
                seqCheck.mc2Found == parCheck.mc2Found &&
                seqCheck.rq1Count == parCheck.rq1Count &&
                seqCheck.rq2Count == parCheck.rq2Count &&
                seqCheck.rq3Count == parCheck.rq3Count;

    double sequentialUs = measureAvgUs([&]() {
        return runSequential(mc1, mc2, rq1, rq2, rq3, bookId, category, date, keyword);
    }, 30, 3);
    double parallelUs = measureAvgUs([&]() {
        return runParallel(mc1, mc2, rq1, rq2, rq3, bookId, category, date, keyword);
    }, 30, 3);

    cout << fixed << setprecision(2);
    cout << "\nValidation same result: " << (same ? "PASS" : "FAIL") << "\n";
    cout << "Sequential batch avg : " << sequentialUs << " us\n";
    cout << "Parallel batch avg   : " << parallelUs << " us\n";
    if (parallelUs > 0.0) {
        cout << "Speedup              : " << sequentialUs / parallelUs << "x\n";
    }
    cout << "Hardware threads     : " << thread::hardware_concurrency() << "\n";

    return same ? 0 : 1;
}
