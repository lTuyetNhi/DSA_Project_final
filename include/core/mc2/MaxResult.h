#ifndef MAX_RESULT_H
#define MAX_RESULT_H

#include <string>
#include "../../../src/models/Book.h"

using namespace std;

// Kết quả tìm cuốn sách có lượt mượn nhiều nhất (không dùng con trỏ)
struct MaxResult {
    Book book;               // Dữ liệu cuốn sách hot nhất
    bool found;              // Trạng thái tìm thấy
    long long executionTime; // Thời gian chạy (nanoseconds)
    long long comparisons;   // Số lần so sánh
    string method;           // Tên giải thuật
    string bigO;             // Độ phức tạp lý thuyết

    MaxResult()
        : found(false), executionTime(0), comparisons(0), method(""), bigO("") {}

    MaxResult(const Book& b, bool isFound, long long timeNs, long long comp, const string& m, const string& bo)
        : book(b), found(isFound), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // MAX_RESULT_H
