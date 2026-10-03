#ifndef MAX_RESULT_H
#define MAX_RESULT_H

#include <string>
#include "../../../src/models/Book.h"

// Kết quả tìm cuốn sách có lượt mượn nhiều nhất (không dùng con trỏ)
struct MaxResult {
    Book book;                      // Dữ liệu cuốn sách hot nhất
    bool found = false;             // Trạng thái tìm thấy
    long long executionTime = 0;    // Thời gian chạy (nanoseconds)
    long long comparisons = 0;      // Số lần so sánh
    std::string method;             // Tên giải thuật
    std::string bigO;               // Độ phức tạp lý thuyết

    MaxResult() = default;

    MaxResult(const Book& b, bool isFound, long long timeNs, long long comp, const std::string& m, const std::string& bo)
        : book(b), found(isFound), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // MAX_RESULT_H
