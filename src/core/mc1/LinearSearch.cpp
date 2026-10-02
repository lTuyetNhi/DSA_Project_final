#include "../../../include/core/mc1/LinearSearch.h"
#include <chrono>
#include <cctype>

using namespace std;

static string toLowerStr(string s) {
    for (char& c : s) {
        c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
    }
    return s;
}

SearchResult LinearSearch::search(vector<Book>& books, const string& bookId) {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = toLowerStr(bookId);
    Book* foundBook = nullptr;
    for (size_t i = 0; i < books.size(); ++i) {
        comparisons++;
        if (toLowerStr(books[i].book_id) == target) {
            foundBook = &books[i];
            break;
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return SearchResult(foundBook, durationNs, comparisons, "Linear Search", "O(n)");
}
