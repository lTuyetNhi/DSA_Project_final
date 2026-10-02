#include "../../../include/core/mc2/LinearMaxScan.h"
#include <chrono>

using namespace std;

MaxResult LinearMaxScan::findMax(vector<Book>& books) {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    Book* maxBook = nullptr;
    if (!books.empty()) {
        maxBook = &books[0];
        // Duyet qua toan bo danh sach sach de tim sach co borrow_count lon nhat
        for (size_t i = 1; i < books.size(); ++i) {
            comparisons++;
            if (books[i].borrow_count > maxBook->borrow_count) {
                maxBook = &books[i];
            } else if (books[i].borrow_count == maxBook->borrow_count) {
                // Tie-break: Neu bang nhau, uu tien book_id nho hon
                if (books[i].book_id < maxBook->book_id) {
                    maxBook = &books[i];
                }
            }
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return MaxResult(maxBook, durationNs, comparisons, "Linear Max Scan", "O(n)");
}
