#include "../../../include/core/mc1/HashTable.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>

using namespace std;

HashTable::HashTable(int cap) : capacity(cap) {
    if (capacity <= 0) capacity = 10007;
    buckets = new HashNode*[capacity];
    for (int i = 0; i < capacity; ++i) {
        buckets[i] = nullptr;
    }
}

HashTable::~HashTable() {
    clear();
    delete[] buckets;
    buckets = nullptr;
}

void HashTable::clear() {
    if (!buckets) return;
    for (int i = 0; i < capacity; ++i) {
        HashNode* curr = buckets[i];
        while (curr != nullptr) {
            HashNode* temp = curr;
            curr = curr->next;
            delete temp;
        }
        buckets[i] = nullptr;
    }
}

// Ham bam da thuc: hash = (hash * 31 + char) % capacity
int HashTable::hashFunction(const string& key) const {
    unsigned long long hash = 0;
    for (char c : key) {
        hash = (hash * 31 + static_cast<unsigned char>(tolower(static_cast<unsigned char>(c))));
    }
    return static_cast<int>(hash % capacity);
}

// Them hoac cap nhat sach vao Bang bam (Separate Chaining)
void HashTable::insert(const string& key, Book* book) {
    string normKey = StringUtils::toLower(key);
    int index = hashFunction(normKey);

    // Kiem tra neu key da ton tai
    HashNode* curr = buckets[index];
    while (curr != nullptr) {
        if (curr->key == normKey) {
            curr->book = book;
            return;
        }
        curr = curr->next;
    }

    // Chen node moi vao dau bucket
    HashNode* newNode = new HashNode(normKey, book);
    newNode->next = buckets[index];
    buckets[index] = newNode;
}

// Tra cuu sach theo book_id trong O(1) average
SearchResult HashTable::search(const string& bookId) const {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = StringUtils::toLower(bookId);
    Book* foundBook = nullptr;
    int index = hashFunction(target);

    // Duyet danh sach lien ket trong bucket tuong ung
    HashNode* curr = buckets[index];
    while (curr != nullptr) {
        comparisons++;
        if (curr->key == target) {
            foundBook = curr->book;
            break;
        }
        curr = curr->next;
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return SearchResult(foundBook, durationNs, comparisons, "Hash Table", "O(1) average");
}
