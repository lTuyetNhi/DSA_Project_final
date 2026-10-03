#ifndef CATEGORY_HASH_TABLE_H
#define CATEGORY_HASH_TABLE_H

#include <vector>
#include <string>
#include "CategoryResult.h"

// Mục lưu trữ gom nhóm sách theo thể loại
struct CategoryEntry {
    std::string category;       // Tên thể loại (đã chuẩn hóa)
    std::vector<Book> books;    // Danh sách các cuốn sách thuộc thể loại này
};

// Bảng băm đa trị gom nhóm sách theo thể loại (không dùng con trỏ)
class CategoryHashTable {
private:
    std::vector<std::vector<CategoryEntry>> buckets; // Mảng các ô chứa danh sách thể loại
    int capacity;                                    // Kích thước bảng băm

    int hashFunction(const std::string& key) const;

public:
    explicit CategoryHashTable(int cap = 1009);

    void build(const std::vector<Book>& books);
    void insert(const Book& book);
    CategoryResult search(const std::string& category) const;
    std::vector<Book> getBooksInCategory(const std::string& category) const;
    void clear();
};

#endif // CATEGORY_HASH_TABLE_H
