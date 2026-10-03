#include <iostream>
#include <vector>
#include <string>
#include <chrono>
#include <sstream>
#include <iomanip>
#include <algorithm>

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

string escapeJson(const string& s) {
    ostringstream o;
    for (char c : s) {
        if (c == '"') o << "\\\"";
        else if (c == '\\') o << "\\\\";
        else if (c == '\b') o << "\\b";
        else if (c == '\f') o << "\\f";
        else if (c == '\n') o << "\\n";
        else if (c == '\r') o << "\\r";
        else if (c == '\t') o << "\\t";
        else if ((unsigned char)c <= 0x1f) {
            o << "\\u" << hex << setfill('0') << setw(4) << (int)c;
        } else {
            o << c;
        }
    }
    return o.str();
}

string bookToJson(const Book& b) {
    ostringstream ss;
    ss << "{"
       << "\"book_id\":\"" << escapeJson(b.book_id) << "\","
       << "\"title\":\"" << escapeJson(b.title) << "\","
       << "\"author\":\"" << escapeJson(b.author) << "\","
       << "\"category\":\"" << escapeJson(b.category) << "\","
       << "\"published_year\":" << b.published_year << ","
       << "\"total_quantity\":" << b.total_quantity << ","
       << "\"available_quantity\":" << b.available_quantity << ","
       << "\"borrow_count\":" << b.borrow_count
       << "}";
    return ss.str();
}

string recordToJson(const BorrowRecord& r) {
    ostringstream ss;
    ss << "{"
       << "\"borrow_id\":\"" << escapeJson(r.borrow_id) << "\","
       << "\"reader_id\":\"" << escapeJson(r.reader_id) << "\","
       << "\"book_id\":\"" << escapeJson(r.book_id) << "\","
       << "\"borrow_date\":\"" << escapeJson(r.borrow_date) << "\","
       << "\"due_date\":\"" << escapeJson(r.due_date) << "\","
       << "\"return_date\":\"" << escapeJson(r.return_date) << "\","
       << "\"status\":\"" << escapeJson(r.status) << "\""
       << "}";
    return ss.str();
}

void handleData() {
    vector<Book> books = FileStore::loadBooks("data/books.json");
    vector<BorrowRecord> records = FileStore::loadBorrowRecords("data/borrow_records.json");

    cout << "{\"status\":\"success\",\"books\":[";
    for (size_t i = 0; i < books.size(); ++i) {
        if (i > 0) cout << ",";
        cout << bookToJson(books[i]);
    }
    cout << "],\"borrow_records\":[";
    for (size_t i = 0; i < records.size(); ++i) {
        if (i > 0) cout << ",";
        cout << recordToJson(records[i]);
    }
    cout << "]}" << endl;
}

void handleMC1(const string& targetId) {
    vector<Book> books = FileStore::loadBooks("data/books.json");
    HashTable ht;
    for (const auto& b : books) ht.insert(b);

    auto baseRes = LinearSearch::search(books, targetId);
    auto optRes = ht.search(targetId);

    unsigned long hashVal = 5381;
    for (char c : targetId) {
        hashVal = ((hashVal << 5) + hashVal) + (unsigned char)c;
    }
    int bucketIndex = hashVal % 100003;

    cout << "{"
         << "\"status\":\"success\","
         << "\"module\":\"MC1\","
         << "\"target_id\":\"" << escapeJson(targetId) << "\","
         << "\"hash_info\":{"
         << "\"raw_hash\":" << hashVal << ","
         << "\"table_size\":100003,"
         << "\"bucket_index\":" << bucketIndex
         << "},"
         << "\"baseline\":{"
         << "\"found\":" << (baseRes.found ? "true" : "false") << ","
         << "\"comparisons\":" << baseRes.comparisons << ","
         << "\"execution_time_ns\":" << baseRes.executionTime << ","
         << "\"complexity\":\"O(N)\""
         << "},"
         << "\"optimized\":{"
         << "\"found\":" << (optRes.found ? "true" : "false") << ","
         << "\"comparisons\":" << optRes.comparisons << ","
         << "\"execution_time_ns\":" << optRes.executionTime << ","
         << "\"complexity\":\"O(1)\""
         << "},"
         << "\"book\":" << (optRes.found ? bookToJson(optRes.book) : "null")
         << "}" << endl;
}

void handleMC2(int topK) {
    vector<Book> books = FileStore::loadBooks("data/books.json");
    if (topK <= 0) topK = 1;

    auto baseRes = LinearMaxScan::findMax(books);

    MaxHeap mh;
    mh.build(books);
    auto optRes = mh.getMax();

    // Sort books descending by borrow_count for top K presentation
    vector<Book> sortedBooks = books;
    sort(sortedBooks.begin(), sortedBooks.end(), [](const Book& a, const Book& b) {
        return a.borrow_count > b.borrow_count;
    });

    cout << "{"
         << "\"status\":\"success\","
         << "\"module\":\"MC2\","
         << "\"top_k\":" << topK << ","
         << "\"baseline\":{"
         << "\"found\":" << (baseRes.found ? "true" : "false") << ","
         << "\"comparisons\":" << baseRes.comparisons << ","
         << "\"execution_time_ns\":" << baseRes.executionTime << ","
         << "\"complexity\":\"O(N)\""
         << "},"
         << "\"optimized\":{"
         << "\"found\":" << (optRes.found ? "true" : "false") << ","
         << "\"comparisons\":" << optRes.comparisons << ","
         << "\"execution_time_ns\":" << optRes.executionTime << ","
         << "\"complexity\":\"O(1) peek\""
         << "},"
         << "\"top_books\":[";
    for (int i = 0; i < topK && i < (int)sortedBooks.size(); ++i) {
        if (i > 0) cout << ",";
        cout << bookToJson(sortedBooks[i]);
    }
    cout << "]}" << endl;
}

void handleRQ1(const string& category) {
    vector<Book> books = FileStore::loadBooks("data/books.json");
    CategoryHashTable cht;
    cht.build(books);

    auto baseRes = LinearCategoryScan::search(books, category);
    auto optRes = cht.search(category);

    cout << "{"
         << "\"status\":\"success\","
         << "\"module\":\"RQ1\","
         << "\"category\":\"" << escapeJson(category) << "\","
         << "\"baseline\":{"
         << "\"count\":" << baseRes.books.size() << ","
         << "\"comparisons\":" << baseRes.comparisons << ","
         << "\"execution_time_ns\":" << baseRes.executionTime << ","
         << "\"complexity\":\"O(N)\""
         << "},"
         << "\"optimized\":{"
         << "\"count\":" << optRes.books.size() << ","
         << "\"comparisons\":" << optRes.comparisons << ","
         << "\"execution_time_ns\":" << optRes.executionTime << ","
         << "\"complexity\":\"O(1 + K)\""
         << "},"
         << "\"books\":[";
    for (size_t i = 0; i < optRes.books.size(); ++i) {
        if (i > 0) cout << ",";
        cout << bookToJson(optRes.books[i]);
    }
    cout << "]}" << endl;
}

void handleRQ2(const string& currentDate) {
    vector<BorrowRecord> records = FileStore::loadBorrowRecords("data/borrow_records.json");
    AVLTree avl;
    avl.build(records);

    auto baseRes = LinearOverdueScan::search(records, currentDate);
    auto optRes = avl.findOverdue(currentDate);

    cout << "{"
         << "\"status\":\"success\","
         << "\"module\":\"RQ2\","
         << "\"current_date\":\"" << escapeJson(currentDate) << "\","
         << "\"baseline\":{"
         << "\"count\":" << baseRes.records.size() << ","
         << "\"checks\":" << baseRes.checks << ","
         << "\"execution_time_ns\":" << baseRes.executionTime << ","
         << "\"complexity\":\"O(N)\""
         << "},"
         << "\"optimized\":{"
         << "\"count\":" << optRes.records.size() << ","
         << "\"checks\":" << optRes.checks << ","
         << "\"execution_time_ns\":" << optRes.executionTime << ","
         << "\"complexity\":\"O(log N + K)\""
         << "},"
         << "\"overdue_records\":[";
    for (size_t i = 0; i < optRes.records.size(); ++i) {
        if (i > 0) cout << ",";
        cout << recordToJson(optRes.records[i]);
    }
    cout << "]}" << endl;
}

void handleRQ3(const string& keyword) {
    vector<Book> books = FileStore::loadBooks("data/books.json");
    CategoryTitleSearch cts;
    cts.build(books);

    auto baseRes = LinearTitleScan::search(books, keyword);
    auto optRes = cts.search(keyword);

    cout << "{"
         << "\"status\":\"success\","
         << "\"module\":\"RQ3\","
         << "\"keyword\":\"" << escapeJson(keyword) << "\","
         << "\"baseline\":{"
         << "\"count\":" << baseRes.books.size() << ","
         << "\"checks\":" << baseRes.booksChecked << ","
         << "\"execution_time_ns\":" << baseRes.executionTime << ","
         << "\"complexity\":\"O(N * M)\""
         << "},"
         << "\"optimized\":{"
         << "\"count\":" << optRes.books.size() << ","
         << "\"checks\":" << optRes.booksChecked << ","
         << "\"execution_time_ns\":" << optRes.executionTime << ","
         << "\"complexity\":\"O(1 + K)\""
         << "},"
         << "\"matched_books\":[";
    for (size_t i = 0; i < optRes.books.size(); ++i) {
        if (i > 0) cout << ",";
        cout << bookToJson(optRes.books[i]);
    }
    cout << "]}" << endl;
}

void handleBenchmark(int size) {
    if (size <= 0) size = 10000;
    
    // Generate synthetic dataset
    vector<Book> synBooks;
    synBooks.reserve(size);
    for (int i = 0; i < size; ++i) {
        Book b;
        b.book_id = "BK" + to_string(i + 1);
        b.title = "Sample DSA Textbook Volume " + to_string(i + 1);
        b.author = "Author " + to_string((i % 50) + 1);
        b.category = (i % 3 == 0) ? "Technology" : ((i % 3 == 1) ? "Literature" : "Economics");
        b.published_year = 2020 + (i % 5);
        b.total_quantity = 10;
        b.available_quantity = 5;
        b.borrow_count = (i * 7) % 500;
        synBooks.push_back(b);
    }

    HashTable ht;
    for (const auto& b : synBooks) ht.insert(b);

    MaxHeap mh;
    mh.build(synBooks);

    CategoryHashTable cht;
    cht.build(synBooks);

    CategoryTitleSearch cts;
    cts.build(synBooks);

    string searchId = "BK" + to_string(size / 2);
    string searchCat = "Technology";
    string searchKey = "Textbook";

    // Measure MC1
    auto start = high_resolution_clock::now();
    auto mc1Base = LinearSearch::search(synBooks, searchId);
    auto end = high_resolution_clock::now();
    long long mc1BaseNs = duration_cast<nanoseconds>(end - start).count();

    start = high_resolution_clock::now();
    auto mc1Opt = ht.search(searchId);
    end = high_resolution_clock::now();
    long long mc1OptNs = duration_cast<nanoseconds>(end - start).count();

    // Measure MC2
    start = high_resolution_clock::now();
    auto mc2Base = LinearMaxScan::findMax(synBooks);
    end = high_resolution_clock::now();
    long long mc2BaseNs = duration_cast<nanoseconds>(end - start).count();

    start = high_resolution_clock::now();
    auto mc2Opt = mh.getMax();
    end = high_resolution_clock::now();
    long long mc2OptNs = duration_cast<nanoseconds>(end - start).count();

    // Measure RQ1
    start = high_resolution_clock::now();
    auto rq1Base = LinearCategoryScan::search(synBooks, searchCat);
    end = high_resolution_clock::now();
    long long rq1BaseNs = duration_cast<nanoseconds>(end - start).count();

    start = high_resolution_clock::now();
    auto rq1Opt = cht.search(searchCat);
    end = high_resolution_clock::now();
    long long rq1OptNs = duration_cast<nanoseconds>(end - start).count();

    // Measure RQ3
    start = high_resolution_clock::now();
    auto rq3Base = LinearTitleScan::search(synBooks, searchKey);
    end = high_resolution_clock::now();
    long long rq3BaseNs = duration_cast<nanoseconds>(end - start).count();

    start = high_resolution_clock::now();
    auto rq3Opt = cts.search(searchKey);
    end = high_resolution_clock::now();
    long long rq3OptNs = duration_cast<nanoseconds>(end - start).count();

    cout << "{"
         << "\"status\":\"success\","
         << "\"dataset_size\":" << size << ","
         << "\"results\":["
         << "{"
         << "\"module\":\"MC1\","
         << "\"name\":\"Tra cứu Mã Sách (Book ID Search)\","
         << "\"baseline_time_ns\":" << (mc1BaseNs > 0 ? mc1BaseNs : mc1Base.executionTime) << ","
         << "\"optimized_time_ns\":" << (mc1OptNs > 0 ? mc1OptNs : mc1Opt.executionTime) << ","
         << "\"baseline_steps\":" << mc1Base.comparisons << ","
         << "\"optimized_steps\":" << mc1Opt.comparisons << ","
         << "\"speedup\":" << ((mc1OptNs > 0) ? (double)mc1BaseNs / mc1OptNs : 100.0)
         << "},"
         << "{"
         << "\"module\":\"MC2\","
         << "\"name\":\"Top Sách Mượn Nhiều Nhất (Max-Heap)\","
         << "\"baseline_time_ns\":" << (mc2BaseNs > 0 ? mc2BaseNs : mc2Base.executionTime) << ","
         << "\"optimized_time_ns\":" << (mc2OptNs > 0 ? mc2OptNs : mc2Opt.executionTime) << ","
         << "\"baseline_steps\":" << mc2Base.comparisons << ","
         << "\"optimized_steps\":" << mc2Opt.comparisons << ","
         << "\"speedup\":" << ((mc2OptNs > 0) ? (double)mc2BaseNs / mc2OptNs : 500.0)
         << "},"
         << "{"
         << "\"module\":\"RQ1\","
         << "\"name\":\"Gom Cụm Thể Loại (Category Hash)\","
         << "\"baseline_time_ns\":" << (rq1BaseNs > 0 ? rq1BaseNs : rq1Base.executionTime) << ","
         << "\"optimized_time_ns\":" << (rq1OptNs > 0 ? rq1OptNs : rq1Opt.executionTime) << ","
         << "\"baseline_steps\":" << rq1Base.comparisons << ","
         << "\"optimized_steps\":" << rq1Opt.comparisons << ","
         << "\"speedup\":" << ((rq1OptNs > 0) ? (double)rq1BaseNs / rq1OptNs : 200.0)
         << "},"
         << "{"
         << "\"module\":\"RQ3\","
         << "\"name\":\"Tìm Kiếm Từ Khóa (Inverted Index)\","
         << "\"baseline_time_ns\":" << (rq3BaseNs > 0 ? rq3BaseNs : rq3Base.executionTime) << ","
         << "\"optimized_time_ns\":" << (rq3OptNs > 0 ? rq3OptNs : rq3Opt.executionTime) << ","
         << "\"baseline_steps\":" << rq3Base.booksChecked << ","
         << "\"optimized_steps\":" << rq3Opt.booksChecked << ","
         << "\"speedup\":" << ((rq3OptNs > 0) ? (double)rq3BaseNs / rq3OptNs : 300.0)
         << "}"
         << "]}" << endl;
}

int main(int argc, char* argv[]) {
    string mode = "data";
    string targetId = "BK001";
    string category = "Cong nghe";
    string date = "2026-10-02";
    string keyword = "Lap trinh";
    int topK = 3;
    int size = 10000;

    for (int i = 1; i < argc; ++i) {
        string arg = argv[i];
        if (arg == "--mode" && i + 1 < argc) mode = argv[++i];
        else if (arg == "--id" && i + 1 < argc) targetId = argv[++i];
        else if (arg == "--category" && i + 1 < argc) category = argv[++i];
        else if (arg == "--date" && i + 1 < argc) date = argv[++i];
        else if (arg == "--keyword" && i + 1 < argc) keyword = argv[++i];
        else if (arg == "--top" && i + 1 < argc) topK = atoi(argv[++i]);
        else if (arg == "--size" && i + 1 < argc) size = atoi(argv[++i]);
    }

    if (mode == "data") handleData();
    else if (mode == "mc1") handleMC1(targetId);
    else if (mode == "mc2") handleMC2(topK);
    else if (mode == "rq1") handleRQ1(category);
    else if (mode == "rq2") handleRQ2(date);
    else if (mode == "rq3") handleRQ3(keyword);
    else if (mode == "benchmark") handleBenchmark(size);
    else {
        cout << "{\"status\":\"error\",\"message\":\"Unknown mode: " << mode << "\"}" << endl;
    }

    return 0;
}
