#ifndef SEARCH_RESULT_H
#define SEARCH_RESULT_H

#include <string>
#include "../../../src/models/Book.h"

using namespace std;

// Kết quả tìm sách theo ID (không dùng con trỏ)
struct SearchResult {
    Book book;               // Dữ liệu cuốn sách tìm thấy
    bool found;              // Trạng thái tìm thấy (true/false)
    long long executionTime; // Thời gian chạy (nanoseconds)
    long long comparisons;   // Số lần so sánh mã sách
    string method;           // Tên giải thuật
    string bigO;             // Độ phức tạp lý thuyết

    SearchResult() 
        : found(false), executionTime(0), comparisons(0), method(""), bigO("") {}

    SearchResult(const Book& b, bool isFound, long long timeNs, long long comp, const string& m, const string& bo)
        : book(b), found(isFound), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // SEARCH_RESULT_H
