#ifndef CATEGORY_RESULT_H
#define CATEGORY_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/Book.h"

using namespace std;

struct CategoryResult {
    vector<Book*> books;
    long long executionTime; // nanoseconds
    long long comparisons;   // số lần so sánh key/category
    string method;           // "Linear Scan" hoặc "Category Hash"
    string bigO;             // "O(n)" hoặc "O(1 + k) average"

    CategoryResult()
        : executionTime(0), comparisons(0), method(""), bigO("") {}

    CategoryResult(const vector<Book*>& bList, long long timeNs, long long comp, const string& m, const string& bo)
        : books(bList), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // CATEGORY_RESULT_H
