#ifndef LINEAR_MAX_SCAN_H
#define LINEAR_MAX_SCAN_H

#include <vector>
#include "MaxResult.h"

using namespace std;

class LinearMaxScan {
public:
    static MaxResult findMax(vector<Book>& books);
};

#endif // LINEAR_MAX_SCAN_H
