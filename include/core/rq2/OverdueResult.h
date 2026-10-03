#ifndef OVERDUE_RESULT_H
#define OVERDUE_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/BorrowRecord.h"

// Kết quả lọc danh sách phiếu mượn quá hạn (không dùng con trỏ)
struct OverdueResult {
    std::vector<BorrowRecord> records;  // Danh sách phiếu quá hạn
    bool found = false;                 // Có phiếu quá hạn hay không
    long long executionTime = 0;        // Thời gian chạy (nanoseconds)
    long long checks = 0;               // Số lượt kiểm tra
    std::string method;                 // Tên giải thuật
    std::string bigO;                   // Độ phức tạp lý thuyết

    OverdueResult() = default;

    OverdueResult(const std::vector<BorrowRecord>& rList, bool isFound, long long timeNs, long long chk, const std::string& m, const std::string& bo)
        : records(rList), found(isFound), executionTime(timeNs), checks(chk), method(m), bigO(bo) {}
};

#endif // OVERDUE_RESULT_H
