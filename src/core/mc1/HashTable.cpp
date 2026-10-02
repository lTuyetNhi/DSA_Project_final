#include "../../../include/core/mc1/HashTable.h"
#include <chrono>
#include <cctype>

using namespace std;

static string toLowerStr(string s) {
    for (char& c : s) {
        c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
    }
    return s;
}

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

int HashTable::hashFunction(const string& key) const {
    unsigned long long hash = 0;
    for (char c : key) {
        char lowerC = static_cast<char>(tolower(static_cast<unsigned char>(c)));
        hash = (hash * 31 + static_cast<unsigned char>(lowerC));
    }
    return static_cast<int>(hash % capacity);
}

void HashTable::insert(const string& key, Book* book) {
    string normKey = toLowerStr(key);
    int index = hashFunction(normKey);
    
    // Check neu key da ton tai thi cap nhat book
    HashNode* curr = buckets[index];
    while (curr != nullptr) {
        if (curr->key == normKey) {
            curr->book = book;
            return;
        }
        curr = curr->next;
    }

    // Them node moi vao dau danh sach lien ket (Separate Chaining)
    HashNode* newNode = new HashNode(normKey, book);
    newNode->next = buckets[index];
    buckets[index] = newNode;
}

SearchResult HashTable::search(const string& bookId) const {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = toLowerStr(bookId);
    Book* foundBook = nullptr;
    int index = hashFunction(target);

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
