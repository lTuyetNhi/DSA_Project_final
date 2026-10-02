#include "../../../include/core/rq1/CategoryHashTable.h"
#include <chrono>
#include <algorithm>
#include <cctype>

using namespace std;

static string toLowerStr(string s) {
    for (char& c : s) {
        c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
    }
    return s;
}

CategoryHashTable::CategoryHashTable(int cap) : capacity(cap) {
    if (capacity <= 0) capacity = 1009;
    buckets = new CategoryHashNode*[capacity];
    for (int i = 0; i < capacity; ++i) {
        buckets[i] = nullptr;
    }
}

CategoryHashTable::~CategoryHashTable() {
    clear();
    delete[] buckets;
    buckets = nullptr;
}

void CategoryHashTable::clear() {
    if (!buckets) return;
    for (int i = 0; i < capacity; ++i) {
        CategoryHashNode* curr = buckets[i];
        while (curr != nullptr) {
            CategoryHashNode* temp = curr;
            curr = curr->next;
            delete temp;
        }
        buckets[i] = nullptr;
    }
}

int CategoryHashTable::hashFunction(const string& key) const {
    unsigned long long hash = 0;
    for (char c : key) {
        char lowerC = static_cast<char>(tolower(static_cast<unsigned char>(c)));
        hash = (hash * 31 + static_cast<unsigned char>(lowerC));
    }
    return static_cast<int>(hash % capacity);
}

void CategoryHashTable::build(vector<Book>& books) {
    clear();
    for (auto& b : books) {
        insert(&b);
    }
}

void CategoryHashTable::insert(Book* book) {
    if (!book) return;
    string normCat = toLowerStr(book->category);
    int index = hashFunction(normCat);

    CategoryHashNode* curr = buckets[index];
    while (curr != nullptr) {
        if (toLowerStr(curr->category) == normCat) {
            curr->books.push_back(book);
            return;
        }
        curr = curr->next;
    }

    // Neu category chua co trong bucket, tao node moi
    CategoryHashNode* newNode = new CategoryHashNode(book->category);
    newNode->books.push_back(book);
    newNode->next = buckets[index];
    buckets[index] = newNode;
}

CategoryResult CategoryHashTable::search(const string& category) const {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = toLowerStr(category);
    int index = hashFunction(target);
    vector<Book*> foundBooks;

    CategoryHashNode* curr = buckets[index];
    while (curr != nullptr) {
        comparisons++;
        if (toLowerStr(curr->category) == target) {
            foundBooks = curr->books;
            break;
        }
        curr = curr->next;
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return CategoryResult(foundBooks, durationNs, comparisons, "Category Hash", "O(1 + k) average");
}

vector<Book*> CategoryHashTable::getBooksInCategory(const string& category) const {
    string target = toLowerStr(category);
    int index = hashFunction(target);

    CategoryHashNode* curr = buckets[index];
    while (curr != nullptr) {
        if (toLowerStr(curr->category) == target) {
            return curr->books;
        }
        curr = curr->next;
    }
    return {};
}
