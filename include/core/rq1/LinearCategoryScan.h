#ifndef LINEAR_CATEGORY_SCAN_H
#define LINEAR_CATEGORY_SCAN_H

#include <vector>
#include <string>
#include "CategoryResult.h"

using namespace std;

// Quét tuần tự toàn bộ sách để lọc ra các sách đúng thể loại (O(n))
class LinearCategoryScan {
public:
    static CategoryResult search(vector<Book>& books, const string& category);
};

#endif // LINEAR_CATEGORY_SCAN_H



