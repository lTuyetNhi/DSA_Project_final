#ifndef MAX_RESULT_H
#define MAX_RESULT_H

#include <string>
#include "../../../src/models/Book.h"

using namespace std;

struct MaxResult {
    Book* book;
    long long executionTime; // Thời gian thực thi (nanoseconds)
    long long comparisons;   // Số lần so sánh / số bước
    string method;           // "Linear Max Scan" hoặc "Max-Heap"
    string bigO;             // "O(n)" hoặc "O(1) getMax"

    MaxResult()
        : book(nullptr), executionTime(0), comparisons(0), method(""), bigO("") {}

    MaxResult(Book* b, long long timeNs, long long comp, const string& m, const string& bo)
        : book(b), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // MAX_RESULT_H
