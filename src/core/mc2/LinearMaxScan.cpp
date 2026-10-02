#include "../../../include/core/mc2/LinearMaxScan.h"
#include <chrono>

using namespace std;

MaxResult LinearMaxScan::findMax(vector<Book>& books) {
    if (books.empty()) {
        return MaxResult(nullptr, 0, 0, "Linear Max Scan", "O(n)");
    }

    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    Book* maxBook = &books[0];
    for (size_t i = 1; i < books.size(); ++i) {
        comparisons++;
        if (books[i].borrow_count > maxBook->borrow_count || 
           (books[i].borrow_count == maxBook->borrow_count && books[i].book_id < maxBook->book_id)) {
            maxBook = &books[i];
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return MaxResult(maxBook, durationNs, comparisons, "Linear Max Scan", "O(n)");
}
