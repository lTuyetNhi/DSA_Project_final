#ifndef RQ2_H
#define RQ2_H

#include <vector>
#include <string>
#include "LinearOverdueScan.h"
#include "AVLTree.h"
#include "OverdueResult.h"

using namespace std;

class RQ2 {
private:
    vector<BorrowRecord>& records;
    LinearOverdueScan baseline;
    AVLTree finalSolution;

public:
    RQ2(vector<BorrowRecord>& recordList);

    void build();
    void comparisonMode(const string& currentDate);
    void normalMode(const string& currentDate);

    static bool sameResultSet(const OverdueResult& baselineRes, const OverdueResult& finalSolRes);
    static void printComparison(size_t datasetSize, const string& currentDate, const OverdueResult& baselineRes, const OverdueResult& finalSolRes);
    static void printRecords(const vector<BorrowRecord*>& records);
};

#endif // RQ2_H
