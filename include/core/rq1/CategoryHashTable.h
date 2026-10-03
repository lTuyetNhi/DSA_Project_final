#ifndef CATEGORY_HASH_TABLE_H
#define CATEGORY_HASH_TABLE_H

#include <vector>
#include <string>
#include "CategoryResult.h"

using namespace std;

// Mục lưu trữ gom nhóm sách theo thể loại
struct CategoryEntry {
    string category;    // Tên thể loại (đã chuẩn hóa)
    vector<Book> books; // Danh sách các cuốn sách thuộc thể loại này
};

// Bảng băm đa trị gom nhóm sách theo thể loại (không dùng con trỏ)
class CategoryHashTable {
private:
    vector<vector<CategoryEntry>> buckets; // Mảng các ô chứa danh sách thể loại
    int capacity;                          // Kích thước bảng băm

    int hashFunction(const string& key) const;

public:
    explicit CategoryHashTable(int cap = 1009);

    void build(const vector<Book>& books);
    void insert(const Book& book);
    CategoryResult search(const string& category) const;
    vector<Book> getBooksInCategory(const string& category) const;
    void clear();
};

#endif // CATEGORY_HASH_TABLE_H
