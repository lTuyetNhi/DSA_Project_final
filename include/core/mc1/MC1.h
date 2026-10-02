#ifndef MC1_H
#define MC1_H

#include <vector>
#include <string>
#include "LinearSearch.h"
#include "HashTable.h"
#include "SearchResult.h"

using namespace std;

class MC1 {
private:
    vector<Book>& books;
    LinearSearch baseline;
    HashTable finalSolution;

public:
    MC1(vector<Book>& bookList);

    void build();
    void comparisonMode(const string& bookId);
    void normalMode(const string& bookId);

    static bool sameResult(const SearchResult& baselineRes, const SearchResult& finalSolRes);
    static void printComparison(const string& bookId, const SearchResult& baselineRes, const SearchResult& finalSolRes);
    static void printBook(const Book* book);
};

#endif // MC1_H
