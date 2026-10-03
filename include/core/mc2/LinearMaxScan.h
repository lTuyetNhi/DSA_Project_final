#ifndef LINEAR_MAX_SCAN_H
#define LINEAR_MAX_SCAN_H

#include <vector>
#include "MaxResult.h"

// Quét toàn bộ danh sách để tìm cuốn sách có lượt mượn cao nhất (O(n))
class LinearMaxScan {
public:
    static MaxResult findMax(std::vector<Book>& books);
};

#endif // LINEAR_MAX_SCAN_H
