#ifndef SEARCH_RESULT_H
#define SEARCH_RESULT_H

#include <string>
#include "../../../src/models/Book.h"

using namespace std;

struct SearchResult {
    Book* book;
    long long executionTime; // Thời gian thực thi (nanoseconds)
    long long comparisons;   // Số lần so sánh
    string method;           // Tên phương pháp ("Linear Search" hoặc "Hash Table")
    string bigO;             // Độ phức tạp ("O(n)" hoặc "O(1) average")

    SearchResult() 
        : book(nullptr), executionTime(0), comparisons(0), method(""), bigO("") {}

    SearchResult(Book* b, long long timeNs, long long comp, const string& m, const string& bo)
        : book(b), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // SEARCH_RESULT_H
