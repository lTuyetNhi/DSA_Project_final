#ifndef RQ3_H
#define RQ3_H

#include <vector>
#include <string>
#include "LinearTitleScan.h"
#include "CategoryTitleSearch.h"
#include "TitleSearchResult.h"

using namespace std;

// Điều phối tìm sách theo tên/từ khóa (không dùng con trỏ)
class RQ3 {
private:
    vector<Book>& books;               // Danh mục sách gốc
    LinearTitleScan baseline;          // Quét chuỗi tuyến tính O(n*m)
    CategoryTitleSearch finalSolution; // Chỉ mục ngược Inverted Index O(1+k)

public:
    explicit RQ3(vector<Book>& bookList);

    void build();
    void comparisonMode(const string& keyword);
    void normalMode(const string& keyword);

    LinearTitleScan& getBaseline() { return baseline; }
    CategoryTitleSearch& getFinalSolution() { return finalSolution; }
    vector<Book>& getBooks() { return books; }

    static bool sameResultSet(const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes);
    static void printComparison(size_t datasetSize, const string& keyword, const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes);
    static void printBooks(const vector<Book>& books);
};

#endif // RQ3_H
