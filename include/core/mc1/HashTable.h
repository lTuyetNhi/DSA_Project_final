#ifndef HASH_TABLE_H
#define HASH_TABLE_H

#include <string>
#include <vector>
#include "SearchResult.h"

using namespace std;

// Bảng băm tra cứu sách O(1) theo mã sách (sử dụng Separate Chaining với vector, không dùng con trỏ)
class HashTable {
private:
    vector<vector<Book>> buckets; // Mảng các ô chứa danh sách sách (giải quyết va chạm)
    int capacity;                 // Số lượng ô trong bảng băm

    int hashFunction(const string& key) const;

public:
    explicit HashTable(int cap = 10007);

    void insert(const Book& book);
    SearchResult search(const string& bookId) const;
    void clear();
};

#endif // HASH_TABLE_H
