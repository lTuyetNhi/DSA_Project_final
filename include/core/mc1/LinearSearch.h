#ifndef LINEAR_SEARCH_H
#define LINEAR_SEARCH_H

#include <vector>
#include <string>
#include "SearchResult.h"

using namespace std;

// Tìm kiếm tuần tự từng cuốn sách từ đầu đến cuối danh sách (O(n))
class LinearSearch {
public:
    static SearchResult search(vector<Book>& books, const string& bookId);
};

#endif // LINEAR_SEARCH_H



