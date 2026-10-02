#include "../../../include/core/rq1/CategoryHashTable.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>

using namespace std;

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

// Ham bam chuoi the loai
int CategoryHashTable::hashFunction(const string& key) const {
    unsigned long long hash = 0;
    for (char c : key) {
        hash = (hash * 31 + static_cast<unsigned char>(tolower(static_cast<unsigned char>(c))));
    }
    return static_cast<int>(hash % capacity);
}

// Xay dung Bang bam the loai tu toan bo danh muc sach
void CategoryHashTable::build(vector<Book>& books) {
    clear();
    for (auto& b : books) {
        insert(&b);
    }
}

// Chen sach vao the loai tuong ung
void CategoryHashTable::insert(Book* book) {
    if (!book) return;
    string normCat = StringUtils::toLower(book->category);
    int index = hashFunction(normCat);

    // Kiem tra neu the loai da co node trong bucket
    CategoryHashNode* curr = buckets[index];
    while (curr != nullptr) {
        if (StringUtils::toLower(curr->category) == normCat) {
            curr->books.push_back(book);
            return;
        }
        curr = curr->next;
    }

    // Tao node the loai moi va chen vao dau bucket
    CategoryHashNode* newNode = new CategoryHashNode(book->category);
    newNode->books.push_back(book);
    newNode->next = buckets[index];
    buckets[index] = newNode;
}

// Tra cuu tat ca sach theo the loai trong O(1 + k) average
CategoryResult CategoryHashTable::search(const string& category) const {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = StringUtils::toLower(category);
    int index = hashFunction(target);
    vector<Book*> foundBooks;

    CategoryHashNode* curr = buckets[index];
    while (curr != nullptr) {
        comparisons++;
        if (StringUtils::toLower(curr->category) == target) {
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
    string target = StringUtils::toLower(category);
    int index = hashFunction(target);

    CategoryHashNode* curr = buckets[index];
    while (curr != nullptr) {
        if (StringUtils::toLower(curr->category) == target) {
            return curr->books;
        }
        curr = curr->next;
    }
    return {};
}
