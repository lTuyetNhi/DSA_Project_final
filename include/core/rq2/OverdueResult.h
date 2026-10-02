#ifndef OVERDUE_RESULT_H
#define OVERDUE_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/BorrowRecord.h"

using namespace std;

struct OverdueResult {
    vector<BorrowRecord*> records;
    long long executionTime; // nanoseconds
    long long checks;        // số lượt kiểm tra / số AVL nodes visited
    string method;           // "Linear Scan" hoặc "AVL Tree"
    string bigO;             // "O(n)" hoặc "O(log n + k)"

    OverdueResult()
        : executionTime(0), checks(0), method(""), bigO("") {}

    OverdueResult(const vector<BorrowRecord*>& rList, long long timeNs, long long chk, const string& m, const string& bo)
        : records(rList), executionTime(timeNs), checks(chk), method(m), bigO(bo) {}
};

#endif // OVERDUE_RESULT_H
