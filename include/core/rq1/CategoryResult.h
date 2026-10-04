#ifndef CATEGORY_RESULT_H
#define CATEGORY_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/Book.h"

using namespace std;

// Kết quả lọc danh mục sách theo thể loại (không dùng con trỏ)
struct CategoryResult {
    vector<Book> books;             // Danh sách sách thuộc thể loại
    bool found = false;             // Có tìm thấy sách nào không
    long long executionTime = 0;    // Thời gian chạy (nanoseconds)
    long long comparisons = 0;      // Số lần so sánh tên thể loại
    string method;                  // Tên giải thuật
    string bigO;                    // Độ phức tạp lý thuyết

    size_t totalCount = 0;

    CategoryResult() = default;

    CategoryResult(const vector<Book>& bList, bool isFound, long long timeNs, long long comp, const string& m, const string& bo)
        : books(bList), found(isFound), executionTime(timeNs), comparisons(comp), method(m), bigO(bo) {}
};

#endif // CATEGORY_RESULT_H
