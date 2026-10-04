#ifndef CATEGORY_TITLE_SEARCH_H
#define CATEGORY_TITLE_SEARCH_H

#include <string>
#include <vector>
#include <cstddef>
#include "TitleSearchResult.h"
#include "../../../src/models/Book.h"

using namespace std;

struct TitleEntry {
    string word;
    vector<int> bookIndices;
};

class CategoryTitleSearch {
private:
    static const size_t TABLE_SIZE = 200003;
    vector<vector<TitleEntry>> table;
    const vector<Book>* allBooks = nullptr;
    vector<string> normalizedTitles;

    size_t hashFunction(const string& key) const;
    void insertPrefix(const string& prefix, int bookIndex);
    const vector<int>* findCandidateIndices(const string& prefix) const;

public:
    CategoryTitleSearch();

    void clear();
    void build(const vector<Book>& books);
    TitleSearchResult search(const string& keyword) const;
    size_t count(const string& keyword, long long* booksChecked = nullptr) const;
};

#endif // CATEGORY_TITLE_SEARCH_H
