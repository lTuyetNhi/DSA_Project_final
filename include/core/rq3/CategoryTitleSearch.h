#ifndef CATEGORY_TITLE_SEARCH_H
#define CATEGORY_TITLE_SEARCH_H

#include <vector>
#include <string>
#include "TitleSearchResult.h"
#include "../../../src/models/Book.h"

using namespace std;

// Mục lưu một từ khóa đơn và danh sách các cuốn sách có chứa từ đó
struct TitleEntry {
    string word;        // Từ khóa đơn đã chuẩn hóa
    vector<Book> books; // Danh sách sách chứa từ này
};

// Bảng băm chỉ mục ngược (Inverted Index) tra cứu sách theo từ khóa (không dùng con trỏ)
class CategoryTitleSearch {
private:
    static const size_t TABLE_SIZE = 1009;
    vector<vector<TitleEntry>> table; // Bảng băm lưu các mục từ khóa

    size_t hashFunction(const string& key) const;
    void insertWord(const string& word, const Book& book);

public:
    CategoryTitleSearch();

    void clear();
    void build(const vector<Book>& books);
    TitleSearchResult search(const string& keyword) const;
};

#endif // CATEGORY_TITLE_SEARCH_H
