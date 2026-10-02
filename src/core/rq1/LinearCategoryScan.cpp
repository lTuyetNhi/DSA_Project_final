#include "../../../include/core/rq1/LinearCategoryScan.h"
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

CategoryResult LinearCategoryScan::search(vector<Book>& books, const string& category) {
    long long comparisons = 0;
    auto start = chrono::high_resolution_clock::now();

    string target = toLowerStr(category);
    vector<Book*> foundBooks;

    for (size_t i = 0; i < books.size(); ++i) {
        comparisons++;
        if (toLowerStr(books[i].category) == target) {
            foundBooks.push_back(&books[i]);
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return CategoryResult(foundBooks, durationNs, comparisons, "Linear Scan", "O(n)");
}
