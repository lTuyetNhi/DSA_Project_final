#ifndef TITLE_SEARCH_RESULT_H
#define TITLE_SEARCH_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/Book.h"

// Kết quả tìm kiếm sách theo tên / từ khóa (không dùng con trỏ)
struct TitleSearchResult {
    std::vector<Book> books;        // Danh sách sách tìm thấy
    bool found = false;             // Có tìm thấy sách hay không
    long long executionTime = 0;    // Thời gian chạy (nanoseconds)
    long long booksChecked = 0;     // Số cuốn sách đã kiểm tra
    std::string method;             // Tên giải thuật
    std::string bigO;               // Độ phức tạp lý thuyết

    TitleSearchResult() = default;

    TitleSearchResult(const std::vector<Book>& bList, bool isFound, long long timeNs, long long chk, const std::string& m, const std::string& bo)
        : books(bList), found(isFound), executionTime(timeNs), booksChecked(chk), method(m), bigO(bo) {}
};

#endif // TITLE_SEARCH_RESULT_H
