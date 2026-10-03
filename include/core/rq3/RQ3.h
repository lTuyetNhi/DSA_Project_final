#ifndef RQ3_H
#define RQ3_H

#include <vector>
#include <string>
#include <cstddef>
#include "LinearTitleScan.h"
#include "CategoryTitleSearch.h"
#include "TitleSearchResult.h"

// Điều phối tìm sách theo tên/từ khóa (không dùng con trỏ)
class RQ3 {
private:
    std::vector<Book>& books;               // Danh mục sách gốc
    LinearTitleScan baseline;               // Quét chuỗi tuyến tính O(n*m)
    CategoryTitleSearch finalSolution;      // Prefix index cho tieu de da chuan hoa

public:
    explicit RQ3(std::vector<Book>& bookList);

    void build();
    void comparisonMode(const std::string& keyword);
    void normalMode(const std::string& keyword);

    LinearTitleScan& getBaseline() { return baseline; }
    CategoryTitleSearch& getFinalSolution() { return finalSolution; }
    std::vector<Book>& getBooks() { return books; }

    static bool sameResultSet(const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes);
    static void printComparison(std::size_t datasetSize, const std::string& keyword, const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes);
    static void printBooks(const std::vector<Book>& books);
};

#endif // RQ3_H
