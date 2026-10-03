#include "../../../include/core/mc1/HashTable.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>

using namespace std;

HashTable::HashTable(int cap) : capacity(cap) {
    buckets.resize(capacity);
}

// Hàm băm DJB2: chuyển chuỗi mã sách thành chỉ số trong bảng băm
int HashTable::hashFunction(const string& key) const {
    unsigned long hash = 5381;
    for (char c : key) {
        hash = ((hash << 5) + hash) + static_cast<unsigned char>(c);
    }
    return static_cast<int>(hash % capacity);
}

void HashTable::insert(const Book& book) {
    string normKey = StringUtils::toLower(book.book_id);
    int index = hashFunction(normKey);

    // Kiểm tra nếu đã tồn tại thì cập nhật
    for (auto& b : buckets[index]) {
        if (StringUtils::toLower(b.book_id) == normKey) {
            b = book;
            return;
        }
    }

    // Nếu chưa có thì thêm mới vào bucket
    buckets[index].push_back(book);
}

SearchResult HashTable::search(const string& bookId) const {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string normKey = StringUtils::toLower(bookId);
    int index = hashFunction(normKey);

    Book foundBook;
    bool found = false;

    // Duyệt danh sách trong ô băm
    for (const auto& b : buckets[index]) {
        comparisons++;
        if (StringUtils::toLower(b.book_id) == normKey) {
            foundBook = b;
            found = true;
            break;
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return SearchResult(foundBook, found, durationNs, comparisons, "Hash Table", "O(1)");
}

void HashTable::clear() {
    for (auto& bucket : buckets) {
        bucket.clear();
    }
}
