#ifndef LINEAR_CATEGORY_SCAN_H
#define LINEAR_CATEGORY_SCAN_H

#include <vector>
#include <string>
#include "CategoryResult.h"

using namespace std;

class LinearCategoryScan {
public:
    static CategoryResult search(vector<Book>& books, const string& category);
};

#endif // LINEAR_CATEGORY_SCAN_H
