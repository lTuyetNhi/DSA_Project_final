#ifndef RQ1_H
#define RQ1_H

#include <vector>
#include <string>
#include <cstddef>
#include "LinearCategoryScan.h"
#include "CategoryHashTable.h"
#include "CategoryResult.h"

// Điều phối lọc sách theo thể loại (không dùng con trỏ)
class RQ1 {
private:
    std::vector<Book>& books;             // Danh mục sách gốc
    LinearCategoryScan baseline;          // Quét tuyến tính O(n)
    CategoryHashTable finalSolution;      // Bảng băm đa trị O(1+k)

public:
    explicit RQ1(std::vector<Book>& bookList);

    void build();
    void comparisonMode(const std::string& category);
    void normalMode(const std::string& category);

    LinearCategoryScan& getBaseline() { return baseline; }
    CategoryHashTable& getFinalSolution() { return finalSolution; }
    std::vector<Book>& getBooks() { return books; }

    CategoryHashTable& getCategoryTable();

    static bool sameResultSet(const CategoryResult& baselineRes, const CategoryResult& finalSolRes);
    static void printComparison(std::size_t datasetSize, const std::string& category, const CategoryResult& baselineRes, const CategoryResult& finalSolRes);
    static void printBooks(const std::vector<Book>& books);
};

#endif // RQ1_H
