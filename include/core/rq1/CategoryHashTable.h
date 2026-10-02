#ifndef CATEGORY_HASH_TABLE_H
#define CATEGORY_HASH_TABLE_H

#include <vector>
#include <string>
#include "CategoryResult.h"

using namespace std;

struct CategoryHashNode {
    string category;
    vector<Book*> books;
    CategoryHashNode* next;

    CategoryHashNode(const string& cat) : category(cat), next(nullptr) {}
};

class CategoryHashTable {
private:
    CategoryHashNode** buckets;
    int capacity;

    int hashFunction(const string& key) const;

public:
    CategoryHashTable(int cap = 1009);
    ~CategoryHashTable();

    CategoryHashTable(const CategoryHashTable&) = delete;
    CategoryHashTable& operator=(const CategoryHashTable&) = delete;

    void build(vector<Book>& books);
    void insert(Book* book);
    CategoryResult search(const string& category) const;
    vector<Book*> getBooksInCategory(const string& category) const;
    void clear();
};

#endif // CATEGORY_HASH_TABLE_H
