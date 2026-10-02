#ifndef HASH_TABLE_H
#define HASH_TABLE_H

#include <string>
#include "SearchResult.h"

using namespace std;

struct HashNode {
    string key;
    Book* book;
    HashNode* next;

    HashNode(const string& k, Book* b) : key(k), book(b), next(nullptr) {}
};

class HashTable {
private:
    HashNode** buckets;
    int capacity;

    int hashFunction(const string& key) const;

public:
    HashTable(int cap = 10007);
    ~HashTable();

    // Disable copy to prevent double free
    HashTable(const HashTable&) = delete;
    HashTable& operator=(const HashTable&) = delete;

    void insert(const string& key, Book* book);
    SearchResult search(const string& bookId) const;
    void clear();
};

#endif // HASH_TABLE_H
