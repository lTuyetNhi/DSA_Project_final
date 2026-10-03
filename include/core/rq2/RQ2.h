#ifndef RQ2_H
#define RQ2_H

#include <vector>
#include <string>
#include "LinearOverdueScan.h"
#include "AVLTree.h"
#include "OverdueResult.h"

using namespace std;

// Điều phối lọc phiếu mượn quá hạn (không dùng con trỏ)
class RQ2 {
private:
    vector<BorrowRecord>& records; // Danh sách phiếu mượn gốc
    LinearOverdueScan baseline;    // Quét tuần tự O(n)
    AVLTree finalSolution;         // Cây AVL O(log n + k)

public:
    explicit RQ2(vector<BorrowRecord>& recordList);

    void build();
    void comparisonMode(const string& currentDate);
    void normalMode(const string& currentDate);

    LinearOverdueScan& getBaseline() { return baseline; }
    AVLTree& getFinalSolution() { return finalSolution; }
    vector<BorrowRecord>& getRecords() { return records; }

    static bool sameResultSet(const OverdueResult& baselineRes, const OverdueResult& finalSolRes);
    static void printComparison(size_t datasetSize, const string& currentDate, const OverdueResult& baselineRes, const OverdueResult& finalSolRes);
    static void printRecords(const vector<BorrowRecord>& records);
};

#endif // RQ2_H
