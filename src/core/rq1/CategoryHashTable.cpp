#include "../../../include/core/rq1/CategoryHashTable.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>

using namespace std;

CategoryHashTable::CategoryHashTable(int cap) : capacity(cap > 0 ? cap : 1) {
    buckets.resize(capacity);
}

int CategoryHashTable::hashFunction(const string& key) const {
    unsigned long hash = 5381;
    for (char c : key) {
        hash = ((hash << 5) + hash) + static_cast<unsigned char>(c);
    }
    return static_cast<int>(hash % capacity);
}

void CategoryHashTable::build(const vector<Book>& books) {
    clear();
    for (const auto& b : books) {
        insert(b);
    }
}

void CategoryHashTable::insert(const Book& book) {
    string normCat = StringUtils::toLower(book.category);
    int index = hashFunction(normCat);

    // Kiểm tra xem nhóm thể loại đã tồn tại trong bucket chưa
    for (auto& entry : buckets[index]) {
        if (entry.category == normCat) {
            entry.books.push_back(book);
            return;
        }
    }

    // Nếu chưa có thể loại này thì tạo mới
    CategoryEntry newEntry;
    newEntry.category = normCat;
    newEntry.books.push_back(book);
    buckets[index].push_back(newEntry);
}

CategoryResult CategoryHashTable::search(const string& category) const {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string normCat = StringUtils::toLower(category);
    int index = hashFunction(normCat);

    vector<Book> foundBooks;
    for (const auto& entry : buckets[index]) {
        comparisons++;
        if (entry.category == normCat) {
            foundBooks = entry.books;
            break;
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return CategoryResult(foundBooks, !foundBooks.empty(), durationNs, comparisons, "Category Hash Table", "O(1 + k)");
}

vector<Book> CategoryHashTable::getBooksInCategory(const string& category) const {
    string normCat = StringUtils::toLower(category);
    int index = hashFunction(normCat);

    for (const auto& entry : buckets[index]) {
        if (entry.category == normCat) {
            return entry.books;
        }
    }
    return {};
}

void CategoryHashTable::clear() {
    for (auto& bucket : buckets) {
        bucket.clear();
    }
}
