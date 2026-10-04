#ifndef LINEAR_OVERDUE_SCAN_H
#define LINEAR_OVERDUE_SCAN_H

#include <vector>
#include <string>
#include "OverdueResult.h"

using namespace std;

// Quét tuần tự kiểm tra từng phiếu mượn xem có quá hạn không (O(n))
class LinearOverdueScan {
public:
    static OverdueResult search(vector<BorrowRecord>& records, const string& currentDate);
    static size_t count(const vector<BorrowRecord>& records, const string& currentDate, long long* checks = nullptr);
};

#endif // LINEAR_OVERDUE_SCAN_H
