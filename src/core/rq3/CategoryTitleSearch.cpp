#include "../../../include/core/rq3/CategoryTitleSearch.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>
#include <sstream>
#include <cctype>
#include <algorithm>

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
            // Each book is indexed once per complete word during build, so
            // checking the entire posting list for duplicates would make
            // common words O(n^2) on a large dataset.
            entry.bookIndices.push_back(bookIndex);
            return;
        }
    }

    TitleEntry newEntry;
    newEntry.word = normPrefix;
    newEntry.bookIndices.push_back(bookIndex);
    table[index].push_back(newEntry);
}

const vector<int>* CategoryTitleSearch::findCandidateIndices(const string& prefix) const {
    string normPrefix = StringUtils::normalizeSearchText(prefix);
    if (normPrefix.empty()) return nullptr;

    size_t index = hashFunction(normPrefix);
    for (const auto& entry : table[index]) {
        if (entry.word == normPrefix) {
            return &entry.bookIndices;
        }
    }
    return nullptr;
}

void CategoryTitleSearch::clear() {
    for (auto& bucket : table) {
        bucket.clear();
    }
    allBooks = nullptr;
    normalizedTitles.clear();
}

void CategoryTitleSearch::build(const vector<Book>& books) {
    clear();
    // Keep a non-owning reference to the RAM dataset. Copying 500k Books here
    // duplicates every string and makes index construction needlessly slow.
    allBooks = &books;
    normalizedTitles.reserve(books.size());

    for (size_t i = 0; i < books.size(); ++i) {
        string normalizedTitle = StringUtils::normalizeSearchText(books[i].title);
        normalizedTitles.push_back(normalizedTitle);

        stringstream ss(normalizedTitle);
        string word;
        while (ss >> word) {
            const bool numericToken = !word.empty() && all_of(word.begin(), word.end(), [](unsigned char c) { return std::isdigit(c) != 0; });
            if (numericToken || word.size() < 2) continue;
            // Index complete words. The final substring check below preserves
            // exact title matching while avoiding millions of prefix entries.
            insertPrefix(word, static_cast<int>(i));
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

        const vector<int>* candidateIndices = findCandidateIndices(firstToken);
        if (candidateIndices) {
            for (int bookIndex : *candidateIndices) {
                if (bookIndex < 0 || static_cast<size_t>(bookIndex) >= allBooks->size()) continue;
                booksChecked++;
                if (normalizedTitles[bookIndex].find(normKw) != string::npos) {
                    foundBooks.push_back((*allBooks)[bookIndex]);
                }
            }
        } else {
            // A substring may not be a complete indexed word. Scan by index
            // directly instead of allocating a temporary 0..N vector.
            for (size_t bookIndex = 0; bookIndex < allBooks->size(); ++bookIndex) {
                booksChecked++;
                if (normalizedTitles[bookIndex].find(normKw) != string::npos) {
                    foundBooks.push_back((*allBooks)[bookIndex]);
                }
            }
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return TitleSearchResult(foundBooks, !foundBooks.empty(), durationNs, booksChecked, "Prefix Title Index", "O(c + k)");
}

size_t CategoryTitleSearch::count(const string& keyword, long long* booksChecked) const {
    if (booksChecked) *booksChecked = 0;
    const string normKw = StringUtils::normalizeSearchText(keyword);
    if (normKw.empty()) return 0;
    string firstToken;
    stringstream ss(normKw);
    ss >> firstToken;
    const vector<int>* candidates = findCandidateIndices(firstToken);
    if (candidates && normKw == firstToken) {
        // An exact indexed word's posting-list length is already its count.
        if (booksChecked) *booksChecked = 1;
        return candidates->size();
    }

    size_t total = 0;
    if (candidates) {
        for (int index : *candidates) {
            if (booksChecked) ++(*booksChecked);
            if (index >= 0 && static_cast<size_t>(index) < normalizedTitles.size() && normalizedTitles[index].find(normKw) != string::npos) ++total;
        }
    } else {
        for (const string& title : normalizedTitles) {
            if (booksChecked) ++(*booksChecked);
            if (title.find(normKw) != string::npos) ++total;
        }
    }
    return total;
}
