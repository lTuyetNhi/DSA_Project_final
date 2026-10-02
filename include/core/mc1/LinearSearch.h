#ifndef LINEAR_SEARCH_H
#define LINEAR_SEARCH_H

#include <vector>
#include <string>
#include "SearchResult.h"

using namespace std;

class LinearSearch {
public:
    static SearchResult search(vector<Book>& books, const string& bookId);
};

#endif // LINEAR_SEARCH_H
