#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include "../src/persistence/FileStore.h"
#include "../include/core/mc1/HashTable.h"
#include "../include/core/mc1/LinearSearch.h"
#include "../include/core/mc2/MaxHeap.h"
#include "../include/core/mc2/LinearMaxScan.h"
#include "../include/core/rq1/CategoryHashTable.h"
#include "../include/core/rq1/LinearCategoryScan.h"
#include "../include/core/rq2/AVLTree.h"
#include "../include/core/rq2/LinearOverdueScan.h"
#include "../include/core/rq3/CategoryTitleSearch.h"
#include "../include/core/rq3/LinearTitleScan.h"

using namespace std;
using namespace std::chrono;

int main() {
    cout << "========================================================\n" << flush;
    cout << "DSA SYSTEM BENCHMARK RUNNER (MULTI-RUN EMPIRICAL TEST)\n" << flush;
    cout << "========================================================\n" << flush;

    // 1. Load actual real dataset (N = 10)
    vector<Book> realBooks = FileStore::loadBooks("data/books.json");
    vector<BorrowRecord> realRecords = FileStore::loadBorrowRecords("data/borrow_records.json");

    cout << "Real Dataset Loaded: " << realBooks.size() << " books, " << realRecords.size() << " borrow records.\n\n" << flush;

    // Benchmark on the real dataset with modest repetitions.
    cout << "--- 1. BENCHMARK ON REAL DATASET [Averaged over 50 runs] ---\n" << flush;
    {
        HashTable ht;
        for (const auto& b : realBooks) ht.insert(b);

        MaxHeap mh;
        mh.build(realBooks);

        CategoryHashTable cht;
        cht.build(realBooks);

        AVLTree avl;
        avl.build(realRecords);

        CategoryTitleSearch cts;
        cts.build(realBooks);

        string searchId = realBooks.empty() ? "" : realBooks[realBooks.size() / 2].book_id;
        string searchCat = realBooks.empty() ? "" : realBooks[0].category;
        string searchKey = "data";
        string curDate = "2026-10-02";

        const int RUNS = 50;

        // MC1
        long long baseMc1Time = 0, finMc1Time = 0;
        for(int i = 0; i < RUNS; ++i) {
            auto r1 = LinearSearch::search(realBooks, searchId);
            baseMc1Time += r1.executionTime;
            auto r2 = ht.search(searchId);
            finMc1Time += r2.executionTime;
        }
        cout << "[MC1 - Book ID Search]:\n"
             << "  Baseline Linear Scan: " << (double)baseMc1Time / RUNS << " ns | Comparisons: " << LinearSearch::search(realBooks, searchId).comparisons << "\n"
             << "  Final Hash Table:     " << (double)finMc1Time / RUNS << " ns | Comparisons: " << ht.search(searchId).comparisons << "\n" << flush;

        // MC2
        long long baseMc2Time = 0, finMc2Time = 0;
        for(int i = 0; i < RUNS; ++i) {
            auto r1 = LinearMaxScan::findMax(realBooks);
            baseMc2Time += r1.executionTime;
            auto r2 = mh.getMax();
            finMc2Time += r2.executionTime;
        }
        cout << "[MC2 - Top Borrowed Book]:\n"
             << "  Baseline Max Scan:    " << (double)baseMc2Time / RUNS << " ns | Comparisons: " << LinearMaxScan::findMax(realBooks).comparisons << "\n"
             << "  Final Max-Heap:       " << (double)finMc2Time / RUNS << " ns | Comparisons: " << mh.getMax().comparisons << "\n" << flush;

        // RQ1
        long long baseRq1Time = 0, finRq1Time = 0;
        for(int i = 0; i < RUNS; ++i) {
            auto r1 = LinearCategoryScan::search(realBooks, searchCat);
            baseRq1Time += r1.executionTime;
            auto r2 = cht.search(searchCat);
            finRq1Time += r2.executionTime;
        }
        cout << "[RQ1 - Category Filter]:\n"
             << "  Baseline Category Scan: " << (double)baseRq1Time / RUNS << " ns | Comparisons: " << LinearCategoryScan::search(realBooks, searchCat).comparisons << "\n"
             << "  Final Category Hash:    " << (double)finRq1Time / RUNS << " ns | Comparisons: " << cht.search(searchCat).comparisons << "\n" << flush;

        // RQ2
        long long baseRq2Time = 0, finRq2Time = 0;
        for(int i = 0; i < RUNS; ++i) {
            auto r1 = LinearOverdueScan::search(realRecords, curDate);
            baseRq2Time += r1.executionTime;
            auto r2 = avl.findOverdue(curDate);
            finRq2Time += r2.executionTime;
        }
        cout << "[RQ2 - Overdue Tracking]:\n"
             << "  Baseline Overdue Scan: " << (double)baseRq2Time / RUNS << " ns | Checks: " << LinearOverdueScan::search(realRecords, curDate).checks << "\n"
             << "  Final AVL Tree Range:  " << (double)finRq2Time / RUNS << " ns | Checks: " << avl.findOverdue(curDate).checks << "\n" << flush;

        // RQ3
        long long baseRq3Time = 0, finRq3Time = 0;
        for(int i = 0; i < RUNS; ++i) {
            auto r1 = LinearTitleScan::search(realBooks, searchKey);
            baseRq3Time += r1.executionTime;
            auto r2 = cts.search(searchKey);
            finRq3Time += r2.executionTime;
        }
        cout << "[RQ3 - Prefix Title Index]:\n"
             << "  Baseline String Scan:  " << (double)baseRq3Time / RUNS << " ns | Checked: " << LinearTitleScan::search(realBooks, searchKey).booksChecked << "\n"
             << "  Final Prefix Index:    " << (double)finRq3Time / RUNS << " ns | Checked: " << cts.search(searchKey).booksChecked << "\n\n" << flush;
    }

    // 2. Synthetic Scaled Dataset Generation & Benchmark (N = 5,000 and N = 10,000)
    cout << "--- 2. BENCHMARK ON SCALED SYNTHETIC DATASETS (N = 5.000 & N = 10.000) ---\n" << flush;
    vector<size_t> testSizes = {5000, 10000};

    vector<string> sampleCategories = {"Computer Science", "Software Engineering", "Database", "Networking", "Mathematics"};
    vector<string> sampleWords = {"Algorithms", "Database", "System", "Network", "Design", "Clean", "Data"};

    for(size_t N : testSizes) {
        cout << "Generating Synthetic Dataset N = " << N << "...\n" << flush;
        vector<Book> synBooks;
        synBooks.reserve(N);
        vector<BorrowRecord> synRecords;
        synRecords.reserve(N);

        for(size_t i = 0; i < N; ++i) {
            Book b;
            b.book_id = "BK" + to_string(i + 1);
            b.title = sampleWords[i % sampleWords.size()] + " fundamentals volume " + to_string(i + 1);
            b.author = "Tac Gia " + to_string(i % 100);
            b.category = sampleCategories[i % sampleCategories.size()];
            b.total_quantity = 10 + (i % 20);
            b.available_quantity = b.total_quantity - (i % 5);
            b.borrow_count = (i * 7) % 50000;
            synBooks.push_back(b);

            BorrowRecord rec;
            rec.borrow_id = "BR" + to_string(i + 1);
            rec.book_id = b.book_id;
            rec.reader_id = "RD" + to_string((i % 1000) + 1);
            rec.borrow_date = "2026-08-01";
            int dayOffset = (i % 90);
            int m = 8 + (dayOffset / 30);
            int d = 1 + (dayOffset % 28);
            char buf[32];
            snprintf(buf, sizeof(buf), "2026-%02d-%02d", m, d);
            rec.due_date = string(buf);
            rec.return_date = (i % 3 == 0) ? "2026-09-01" : "";
            rec.status = (i % 3 == 0) ? "RETURNED" : "BORROWING";
            synRecords.push_back(rec);
        }

        cout << "Building DSA Structures for N = " << N << "...\n" << flush;
        HashTable ht(N * 2 + 7);
        for(const auto& b : synBooks) ht.insert(b);

        MaxHeap mh;
        mh.build(synBooks);

        CategoryHashTable cht(sampleCategories.size() * 2 + 7);
        cht.build(synBooks);

        AVLTree avl;
        avl.build(synRecords);

        CategoryTitleSearch cts;
        cts.build(synBooks);

        string targetId = "BK" + to_string(N - 5); // Worst-case near end
        string targetCat = "Computer Science";
        string targetWord = "Data";
        string checkDate = "2026-10-02";

        const int RUNS = (N > 5000) ? 3 : 5;

        // MC1
        long long baseMc1 = 0, finMc1 = 0;
        for(int r = 0; r < RUNS; ++r) {
            baseMc1 += LinearSearch::search(synBooks, targetId).executionTime;
            finMc1 += ht.search(targetId).executionTime;
        }
        cout << "== Scale N = " << N << " Results ==\n" << flush;
        cout << "MC1 (Book ID Lookup):\n"
             << "  Baseline Linear Scan: " << (double)baseMc1 / (RUNS * 1000.0) << " us | Comparisons: " << LinearSearch::search(synBooks, targetId).comparisons << "\n"
             << "  Final Hash Table:     " << (double)finMc1 / (RUNS * 1000.0) << " us | Comparisons: " << ht.search(targetId).comparisons << "\n" << flush;

        // MC2
        long long baseMc2 = 0, finMc2 = 0;
        for(int r = 0; r < RUNS; ++r) {
            baseMc2 += LinearMaxScan::findMax(synBooks).executionTime;
            finMc2 += mh.getMax().executionTime;
        }
        cout << "MC2 (Top Borrowed Book):\n"
             << "  Baseline Max Scan:    " << (double)baseMc2 / (RUNS * 1000.0) << " us | Comparisons: " << LinearMaxScan::findMax(synBooks).comparisons << "\n"
             << "  Final Max-Heap:       " << (double)finMc2 / (RUNS * 1000.0) << " us | Comparisons: " << mh.getMax().comparisons << "\n" << flush;

        // RQ1
        long long baseRq1 = 0, finRq1 = 0;
        for(int r = 0; r < RUNS; ++r) {
            baseRq1 += LinearCategoryScan::search(synBooks, targetCat).executionTime;
            finRq1 += cht.search(targetCat).executionTime;
        }
        cout << "RQ1 (Category Filter):\n"
             << "  Baseline Category:    " << (double)baseRq1 / (RUNS * 1000.0) << " us | Comparisons: " << LinearCategoryScan::search(synBooks, targetCat).comparisons << "\n"
             << "  Final Category Hash:  " << (double)finRq1 / (RUNS * 1000.0) << " us | Comparisons: " << cht.search(targetCat).comparisons << "\n" << flush;

        // RQ2
        long long baseRq2 = 0, finRq2 = 0;
        for(int r = 0; r < RUNS; ++r) {
            baseRq2 += LinearOverdueScan::search(synRecords, checkDate).executionTime;
            finRq2 += avl.findOverdue(checkDate).executionTime;
        }
        cout << "RQ2 (Overdue Tracker):\n"
             << "  Baseline Scan:        " << (double)baseRq2 / (RUNS * 1000.0) << " us | Checks: " << LinearOverdueScan::search(synRecords, checkDate).checks << "\n"
             << "  Final AVL Pruning:    " << (double)finRq2 / (RUNS * 1000.0) << " us | Checks: " << avl.findOverdue(checkDate).checks << "\n" << flush;

        // RQ3
        long long baseRq3 = 0, finRq3 = 0;
        for(int r = 0; r < RUNS; ++r) {
            baseRq3 += LinearTitleScan::search(synBooks, targetWord).executionTime;
            finRq3 += cts.search(targetWord).executionTime;
        }
        cout << "RQ3 (Title Keyword):\n"
             << "  Baseline Substring:   " << (double)baseRq3 / (RUNS * 1000.0) << " us | Checked: " << LinearTitleScan::search(synBooks, targetWord).booksChecked << "\n"
             << "  Final Prefix Index:   " << (double)finRq3 / (RUNS * 1000.0) << " us | Checked: " << cts.search(targetWord).booksChecked << "\n\n" << flush;
    }

    return 0;
}
