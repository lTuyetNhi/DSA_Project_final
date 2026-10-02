#ifndef TITLE_SEARCH_RESULT_H
#define TITLE_SEARCH_RESULT_H

#include <vector>
#include <string>
#include "../../../src/models/Book.h"

using namespace std;

struct TitleSearchResult {
    vector<Book*> books;
    long long executionTime; // nanoseconds
    long long booksChecked;  // số cuốn sách đã duyệt / kiểm tra
    string method;           // "Full Linear Title Scan" hoặc "Category Hash + String Matching"
    string bigO;             // "O(n) + string matching" hoặc "O(1 + k) average + string matching"

    TitleSearchResult()
        : executionTime(0), booksChecked(0), method(""), bigO("") {}

    TitleSearchResult(const vector<Book*>& bList, long long timeNs, long long chk, const string& m, const string& bo)
        : books(bList), executionTime(timeNs), booksChecked(chk), method(m), bigO(bo) {}
};

#endif // TITLE_SEARCH_RESULT_H
