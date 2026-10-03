#ifndef LINEAR_TITLE_SCAN_H
#define LINEAR_TITLE_SCAN_H

#include <vector>
#include <string>
#include "TitleSearchResult.h"

// Quét tuần tự toàn bộ sách và kiểm tra xem tên sách có chứa từ khóa không (O(n * m))
class LinearTitleScan {
public:
    static TitleSearchResult search(std::vector<Book>& books, const std::string& keyword);
};

#endif // LINEAR_TITLE_SCAN_H
