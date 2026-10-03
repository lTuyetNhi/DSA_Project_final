#ifndef SEARCH_RESULT_H
#define SEARCH_RESULT_H

#include <string>
#include "../../../src/models/Book.h"

// Kết quả tìm sách theo ID (không dùng con trỏ)
struct SearchResult {
    Book book;                      // Dữ liệu cuốn sách tìm thấy
    bool found = false;             // Trạng thái tìm thấy (true/false)
    long long executionTime = 0;    // Thời gian chạy (nanoseconds)
    long long comparisons = 0;      // Số lần so sánh mã sách
    std::string method;             // Tên giải thuật
    std::string bigO;               // Độ phức tạp lý thuyết

    SearchResult() = default;

    SearchResult(const Book& b, bool isFound, long long timeNs, long long comp, const std::string& m, const std::string& bo)
        : book(b), found(isFound), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // SEARCH_RESULT_H
