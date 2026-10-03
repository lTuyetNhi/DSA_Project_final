#include "../../../include/core/rq3/LinearTitleScan.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>

using namespace std;

TitleSearchResult LinearTitleScan::search(vector<Book>& books, const string& keyword) {
    long long booksChecked = 0;
    auto start = chrono::high_resolution_clock::now();

    string targetKw = StringUtils::normalizeSearchText(keyword);
    vector<Book> foundBooks;

    if (!targetKw.empty()) {
        // Duyet tuan tu qua tat ca sach trong he thong va kiem tra tieu de
        for (size_t i = 0; i < books.size(); ++i) {
            booksChecked++;
            string normalizedTitle = StringUtils::normalizeSearchText(books[i].title);
            if (normalizedTitle.find(targetKw) != string::npos) {
                foundBooks.push_back(books[i]);
            }
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return TitleSearchResult(foundBooks, !foundBooks.empty(), durationNs, booksChecked, "Full Linear Title Scan", "O(n) + string matching");
}
