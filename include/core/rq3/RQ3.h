#ifndef RQ3_H
#define RQ3_H

#include <vector>
#include <string>
#include "LinearTitleScan.h"
#include "CategoryTitleSearch.h"
#include "TitleSearchResult.h"

using namespace std;

class RQ3 {
private:
    vector<Book>& books;
    LinearTitleScan baseline;
    CategoryTitleSearch finalSolution;

public:
    RQ3(vector<Book>& bookList);

    void build();
    void comparisonMode(const string& keyword);
    void normalMode(const string& keyword);

    static bool sameResultSet(const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes);
    static void printComparison(size_t datasetSize, const string& keyword, const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes);
    static void printBooks(const vector<Book*>& books);
};

#endif // RQ3_H
