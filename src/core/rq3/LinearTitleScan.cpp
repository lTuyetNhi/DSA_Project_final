#include "../../../include/core/rq3/LinearTitleScan.h"
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

TitleSearchResult LinearTitleScan::search(vector<Book>& books, const string& keyword) {
    long long booksChecked = 0;
    auto start = chrono::high_resolution_clock::now();

    string targetKw = toLowerStr(keyword);
    vector<Book*> foundBooks;

    for (size_t i = 0; i < books.size(); ++i) {
        booksChecked++;
        if (toLowerStr(books[i].title).find(targetKw) != string::npos) {
            foundBooks.push_back(&books[i]);
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return TitleSearchResult(foundBooks, durationNs, booksChecked, "Full Linear Title Scan", "O(n) + string matching");
}
