#ifndef TITLE_SEARCH_RESULT_H
#define TITLE_SEARCH_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/Book.h"

using namespace std;

// Kết quả tìm kiếm sách theo tên / từ khóa (không dùng con trỏ)
struct TitleSearchResult {
    vector<Book> books;      // Danh sách sách tìm thấy
    bool found;              // Có tìm thấy sách hay không
    long long executionTime; // Thời gian chạy (nanoseconds)
    long long booksChecked;  // Số cuốn sách đã kiểm tra
    string method;           // Tên giải thuật
    string bigO;             // Độ phức tạp lý thuyết

    TitleSearchResult()
        : found(false), executionTime(0), booksChecked(0), method(""), bigO("") {}

    TitleSearchResult(const vector<Book>& bList, bool isFound, long long timeNs, long long chk, const string& m, const string& bo)
        : books(bList), found(isFound), executionTime(timeNs), booksChecked(chk), method(m), bigO(bo) {}
};

#endif // TITLE_SEARCH_RESULT_H
