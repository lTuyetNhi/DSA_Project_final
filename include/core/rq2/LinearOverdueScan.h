#ifndef LINEAR_OVERDUE_SCAN_H
#define LINEAR_OVERDUE_SCAN_H

#include <vector>
#include <string>
#include "OverdueResult.h"

// Quét tuần tự kiểm tra từng phiếu mượn xem có quá hạn không (O(n))
class LinearOverdueScan {
public:
    static OverdueResult search(std::vector<BorrowRecord>& records, const std::string& currentDate);
};

#endif // LINEAR_OVERDUE_SCAN_H
