#include "../../../include/core/mc1/LinearSearch.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>

using namespace std;

SearchResult LinearSearch::search(vector<Book>& books, const string& bookId) {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = StringUtils::toLower(bookId);
    Book foundBook;
    bool found = false;

    // Duyet tuan tu qua tung cuon sach trong danh sach
    for (size_t i = 0; i < books.size(); ++i) {
        comparisons++;
        if (StringUtils::toLower(books[i].book_id) == target) {
            foundBook = books[i];
            found = true;
            break; // Tim thay -> dung luon
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return SearchResult(foundBook, found, durationNs, comparisons, "Linear Search", "O(n)");
}
