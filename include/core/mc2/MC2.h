#ifndef MC2_H
#define MC2_H

#include <vector>
#include <string>
#include "LinearMaxScan.h"
#include "MaxHeap.h"
#include "MaxResult.h"

using namespace std;

// Điều phối tìm sách mượn nhiều nhất (không dùng con trỏ)
class MC2 {
private:
    vector<Book>& books;    // Danh mục sách gốc
    LinearMaxScan baseline; // Quét tuyến tính O(n)
    MaxHeap finalSolution;  // Max-Heap O(1)

public:
    explicit MC2(vector<Book>& bookList);

    void build();
    void comparisonMode();
    void normalMode();
    void updateComparisonMode(const string& bookId, int newCount);

    LinearMaxScan& getBaseline() { return baseline; }
    MaxHeap& getFinalSolution() { return finalSolution; }
    vector<Book>& getBooks() { return books; }

    static bool sameResult(const MaxResult& baselineRes, const MaxResult& finalSolRes);
    static void printComparison(size_t datasetSize, const MaxResult& baselineRes, const MaxResult& finalSolRes);
    static void printBook(const Book& book);
};

#endif // MC2_H
