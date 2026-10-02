#ifndef LINEAR_OVERDUE_SCAN_H
#define LINEAR_OVERDUE_SCAN_H

#include <vector>
#include <string>
#include "OverdueResult.h"

using namespace std;

class LinearOverdueScan {
public:
    static OverdueResult search(vector<BorrowRecord>& records, const string& currentDate);
};

#endif // LINEAR_OVERDUE_SCAN_H
