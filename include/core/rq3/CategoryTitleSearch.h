#ifndef CATEGORY_TITLE_SEARCH_H
#define CATEGORY_TITLE_SEARCH_H

#include <vector>
#include <string>
#include "TitleSearchResult.h"
#include "../../../src/models/Book.h"

using namespace std;

struct TitleHashNode {
    string word;
    vector<Book*> books;
    TitleHashNode* next;

    TitleHashNode(const string& w) : word(w), next(nullptr) {}
};

class CategoryTitleSearch {
private:
    static const size_t TABLE_SIZE = 101;
    vector<TitleHashNode*> table;

    size_t hashFunction(const string& key) const;
    void insertWord(const string& word, Book* book);

public:
    CategoryTitleSearch();
    ~CategoryTitleSearch();

    void clear();
    void build(vector<Book>& books);
    TitleSearchResult search(const string& keyword) const;
};

#endif // CATEGORY_TITLE_SEARCH_H
