#ifndef RQ1_H
#define RQ1_H

#include <vector>
#include <string>
#include "LinearCategoryScan.h"
#include "CategoryHashTable.h"
#include "CategoryResult.h"

using namespace std;

class RQ1 {
private:
    vector<Book>& books;
    LinearCategoryScan baseline;
    CategoryHashTable finalSolution;

public:
    RQ1(vector<Book>& bookList);

    void build();
    void comparisonMode(const string& category);
    void normalMode(const string& category);

    CategoryHashTable& getCategoryTable();

    static bool sameResultSet(const CategoryResult& baselineRes, const CategoryResult& finalSolRes);
    static void printComparison(size_t datasetSize, const string& category, const CategoryResult& baselineRes, const CategoryResult& finalSolRes);
    static void printBooks(const vector<Book*>& books);
};

#endif // RQ1_H
