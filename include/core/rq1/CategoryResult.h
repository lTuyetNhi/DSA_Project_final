#ifndef CATEGORY_RESULT_H
#define CATEGORY_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/Book.h"

using namespace std;

// Kết quả lọc danh mục sách theo thể loại (không dùng con trỏ)
struct CategoryResult {
    vector<Book> books;      // Danh sách sách thuộc thể loại
    bool found;              // Có tìm thấy sách nào không
    long long executionTime; // Thời gian chạy (nanoseconds)
    long long comparisons;   // Số lần so sánh tên thể loại
    string method;           // Tên giải thuật
    string bigO;             // Độ phức tạp lý thuyết

    CategoryResult()
        : found(false), executionTime(0), comparisons(0), method(""), bigO("") {}

    CategoryResult(const vector<Book>& bList, bool isFound, long long timeNs, long long comp, const string& m, const string& bo)
        : books(bList), found(isFound), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // CATEGORY_RESULT_H
