#include "../../../include/core/rq3/CategoryTitleSearch.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>
#include <sstream>

using namespace std;

CategoryTitleSearch::CategoryTitleSearch() {
    table.resize(TABLE_SIZE);
}

size_t CategoryTitleSearch::hashFunction(const string& key) const {
    size_t hash = 5381;
    for (char c : key) {
        hash = ((hash << 5) + hash) + static_cast<unsigned char>(c);
    }
    return hash % TABLE_SIZE;
}

void CategoryTitleSearch::insertPrefix(const string& prefix, int bookIndex) {
    string normPrefix = StringUtils::normalizeSearchText(prefix);
    if (normPrefix.empty()) return;

    size_t index = hashFunction(normPrefix);
    for (auto& entry : table[index]) {
        if (entry.word == normPrefix) {
            for (int existingIndex : entry.bookIndices) {
                if (existingIndex == bookIndex) return;
            }
            entry.bookIndices.push_back(bookIndex);
            return;
        }
    }

    TitleEntry newEntry;
    newEntry.word = normPrefix;
    newEntry.bookIndices.push_back(bookIndex);
    table[index].push_back(newEntry);
}

vector<int> CategoryTitleSearch::findCandidateIndices(const string& prefix) const {
    string normPrefix = StringUtils::normalizeSearchText(prefix);
    if (normPrefix.empty()) return {};

    size_t index = hashFunction(normPrefix);
    for (const auto& entry : table[index]) {
        if (entry.word == normPrefix) {
            return entry.bookIndices;
        }
    }
    return {};
}

void CategoryTitleSearch::clear() {
    for (auto& bucket : table) {
        bucket.clear();
    }
    allBooks.clear();
    normalizedTitles.clear();
}

void CategoryTitleSearch::build(const vector<Book>& books) {
    clear();
    allBooks = books;
    normalizedTitles.reserve(books.size());

    for (size_t i = 0; i < books.size(); ++i) {
        string normalizedTitle = StringUtils::normalizeSearchText(books[i].title);
        normalizedTitles.push_back(normalizedTitle);

        stringstream ss(normalizedTitle);
        string word;
        while (ss >> word) {
            for (size_t len = 1; len <= word.size(); ++len) {
                insertPrefix(word.substr(0, len), static_cast<int>(i));
            }
        }
    }
}

TitleSearchResult CategoryTitleSearch::search(const string& keyword) const {
    long long booksChecked = 0;
    auto start = chrono::high_resolution_clock::now();

    string normKw = StringUtils::normalizeSearchText(keyword);
    vector<Book> foundBooks;

    if (!normKw.empty()) {
        string firstToken;
        stringstream ss(normKw);
        ss >> firstToken;

        vector<int> candidateIndices = findCandidateIndices(firstToken);
        if (candidateIndices.empty()) {
            candidateIndices.reserve(allBooks.size());
            for (size_t i = 0; i < allBooks.size(); ++i) {
                candidateIndices.push_back(static_cast<int>(i));
            }
        }

        for (int bookIndex : candidateIndices) {
            if (bookIndex < 0 || static_cast<size_t>(bookIndex) >= allBooks.size()) {
                continue;
            }
            booksChecked++;
            if (normalizedTitles[bookIndex].find(normKw) != string::npos) {
                foundBooks.push_back(allBooks[bookIndex]);
            }
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return TitleSearchResult(foundBooks, !foundBooks.empty(), durationNs, booksChecked, "Prefix Title Index", "O(c + k)");
}
