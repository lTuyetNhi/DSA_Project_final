#ifndef MC1_H
#define MC1_H

#include <vector>
#include <string>
#include <cstddef>
#include "LinearSearch.h"
#include "HashTable.h"
#include "SearchResult.h"

using namespace std;

// Điều phối tìm sách theo mã ID (không dùng con trỏ)
class MC1 {
private:
    vector<Book>& books;          // Danh sách sách gốc
    LinearSearch baseline;        // Tìm tuần tự O(n) để đối chứng
    HashTable finalSolution;      // Bảng băm O(1) tối ưu

public:
    explicit MC1(vector<Book>& bookList);

    void build();
    void comparisonMode(const string& bookId);
    void normalMode(const string& bookId);

    LinearSearch& getBaseline() { return baseline; }
    HashTable& getFinalSolution() { return finalSolution; }
    vector<Book>& getBooks() { return books; }

    // Các hàm phụ trợ kiểm tra và in kết quả
    static bool sameResult(const SearchResult& baselineRes, const SearchResult& finalSolRes);
    static void printComparison(size_t datasetSize, const string& bookId, const SearchResult& baselineRes, const SearchResult& finalSolRes);
    static void printBook(const Book& book);
};

#endif // MC1_H
