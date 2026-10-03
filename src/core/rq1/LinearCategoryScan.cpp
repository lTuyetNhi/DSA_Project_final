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

CategoryResult LinearCategoryScan::searchPage(const vector<Book>& books, const string& category, size_t offset, size_t limit) {
    long long comparisons = 0;
    size_t total = 0;
    vector<Book> page;
    if (limit > 0) page.reserve(limit);
    const string target = StringUtils::toLower(category);
    auto start = chrono::high_resolution_clock::now();
    for (const auto& book : books) {
        ++comparisons;
        if (StringUtils::toLower(book.category) == target) {
            if (total >= offset && page.size() < limit) page.push_back(book);
            ++total;
        }
    }
    auto end = chrono::high_resolution_clock::now();
    CategoryResult result(page, total > 0, chrono::duration_cast<chrono::nanoseconds>(end - start).count(), comparisons, "Linear Category Scan", "O(n)");
    result.totalCount = total;
    return result;
}

size_t LinearCategoryScan::count(const vector<Book>& books, const string& category) {
    string target = StringUtils::toLower(category);
    size_t matches = 0;
    for (const auto& book : books) {
        if (StringUtils::toLower(book.category) == target) ++matches;
    }
    return matches;
}
