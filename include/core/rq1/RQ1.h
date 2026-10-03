#ifndef RQ1_H
#define RQ1_H

#include <vector>
#include <string>
#include "LinearCategoryScan.h"
#include "CategoryHashTable.h"
#include "CategoryResult.h"

using namespace std;

// Điều phối lọc sách theo thể loại (không dùng con trỏ)
class RQ1 {
private:
    vector<Book>& books;             // Danh mục sách gốc
    LinearCategoryScan baseline;     // Quét tuyến tính O(n)
    CategoryHashTable finalSolution; // Bảng băm đa trị O(1+k)

public:
    explicit RQ1(vector<Book>& bookList);

    void build();
    void comparisonMode(const string& category);
    void normalMode(const string& category);

    LinearCategoryScan& getBaseline() { return baseline; }
    CategoryHashTable& getFinalSolution() { return finalSolution; }
    vector<Book>& getBooks() { return books; }

    CategoryHashTable& getCategoryTable();

    static bool sameResultSet(const CategoryResult& baselineRes, const CategoryResult& finalSolRes);
    static void printComparison(size_t datasetSize, const string& category, const CategoryResult& baselineRes, const CategoryResult& finalSolRes);
    static void printBooks(const vector<Book>& books);
};

#endif // RQ1_H
