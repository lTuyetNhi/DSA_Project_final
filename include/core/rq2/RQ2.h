#ifndef RQ2_H
#define RQ2_H

#include <vector>
#include <string>
#include <cstddef>
#include "LinearOverdueScan.h"
#include "AVLTree.h"
#include "OverdueResult.h"

// Điều phối lọc phiếu mượn quá hạn (không dùng con trỏ)
class RQ2 {
private:
    std::vector<BorrowRecord>& records; // Danh sách phiếu mượn gốc
    LinearOverdueScan baseline;         // Quét tuần tự O(n)
    AVLTree finalSolution;              // Cây AVL O(log n + k)

public:
    explicit RQ2(std::vector<BorrowRecord>& recordList);

    void build();
    void comparisonMode(const std::string& currentDate);
    void normalMode(const std::string& currentDate);

    LinearOverdueScan& getBaseline() { return baseline; }
    AVLTree& getFinalSolution() { return finalSolution; }
    std::vector<BorrowRecord>& getRecords() { return records; }

    static bool sameResultSet(const OverdueResult& baselineRes, const OverdueResult& finalSolRes);
    static void printComparison(std::size_t datasetSize, const std::string& currentDate, const OverdueResult& baselineRes, const OverdueResult& finalSolRes);
    static void printRecords(const std::vector<BorrowRecord>& records);
};

#endif // RQ2_H
