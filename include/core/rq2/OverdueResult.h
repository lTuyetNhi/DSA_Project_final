#ifndef OVERDUE_RESULT_H
#define OVERDUE_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/BorrowRecord.h"

using namespace std;

// Kết quả lọc danh sách phiếu mượn quá hạn (không dùng con trỏ)
struct OverdueResult {
    vector<BorrowRecord> records; // Danh sách phiếu quá hạn
    bool found;                   // Có phiếu quá hạn hay không
    long long executionTime;      // Thời gian chạy (nanoseconds)
    long long checks;             // Số lượt kiểm tra
    string method;                // Tên giải thuật
    string bigO;                  // Độ phức tạp lý thuyết

    OverdueResult()
        : found(false), executionTime(0), checks(0), method(""), bigO("") {}

    OverdueResult(const vector<BorrowRecord>& rList, bool isFound, long long timeNs, long long chk, const string& m, const string& bo)
        : records(rList), found(isFound), executionTime(timeNs), checks(chk), method(m), bigO(bo) {}
};

#endif // OVERDUE_RESULT_H
