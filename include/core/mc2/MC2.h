#ifndef MC2_H
#define MC2_H

#include <vector>
#include <string>
#include "LinearMaxScan.h"
#include "MaxHeap.h"
#include "MaxResult.h"

using namespace std;

class MC2 {
private:
    vector<Book>& books;
    LinearMaxScan baseline;
    MaxHeap finalSolution;

public:
    MC2(vector<Book>& bookList);

    void build();
    void comparisonMode();
    void normalMode();
    void updateComparisonMode(const string& bookId, int newCount);

    static bool sameResult(const MaxResult& baselineRes, const MaxResult& finalSolRes);
    static void printComparison(size_t datasetSize, const MaxResult& baselineRes, const MaxResult& finalSolRes);
    static void printBook(const Book* book);
};

#endif // MC2_H
