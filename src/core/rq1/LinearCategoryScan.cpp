#include "../../../include/core/rq1/LinearCategoryScan.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>

using namespace std;

CategoryResult LinearCategoryScan::search(vector<Book>& books, const string& category) {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = StringUtils::toLower(category);
    vector<Book> foundBooks;

    // Duyet tuan tu toan bo sach de tim sach co the loai khop
    for (size_t i = 0; i < books.size(); ++i) {
        comparisons++;
        if (StringUtils::toLower(books[i].category) == target) {
            foundBooks.push_back(books[i]);
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return CategoryResult(foundBooks, !foundBooks.empty(), durationNs, comparisons, "Linear Category Scan", "O(n)");
}
