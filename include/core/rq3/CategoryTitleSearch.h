#ifndef CATEGORY_TITLE_SEARCH_H
#define CATEGORY_TITLE_SEARCH_H

#include <string>
#include <vector>
#include <cstddef>
#include "TitleSearchResult.h"
#include "../../../src/models/Book.h"

struct TitleEntry {
    std::string word;
    std::vector<int> bookIndices;
};

class CategoryTitleSearch {
private:
    static const std::size_t TABLE_SIZE = 200003;
    std::vector<std::vector<TitleEntry>> table;
    const std::vector<Book>* allBooks = nullptr;
    std::vector<std::string> normalizedTitles;

    std::size_t hashFunction(const std::string& key) const;
    void insertPrefix(const std::string& prefix, int bookIndex);
    const std::vector<int>* findCandidateIndices(const std::string& prefix) const;

public:
    CategoryTitleSearch();

    void clear();
    void build(const std::vector<Book>& books);
    TitleSearchResult search(const std::string& keyword) const;
    size_t count(const std::string& keyword, long long* booksChecked = nullptr) const;
};

#endif // CATEGORY_TITLE_SEARCH_H
