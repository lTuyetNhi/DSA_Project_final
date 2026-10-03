#ifndef LINEAR_CATEGORY_SCAN_H
#define LINEAR_CATEGORY_SCAN_H

#include <vector>
#include <string>
#include "CategoryResult.h"

// Quét tuần tự toàn bộ sách để lọc ra các sách đúng thể loại (O(n))
class LinearCategoryScan {
public:
    static CategoryResult search(std::vector<Book>& books, const std::string& category);
};

#endif // LINEAR_CATEGORY_SCAN_H
