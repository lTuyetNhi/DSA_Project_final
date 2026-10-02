#ifndef MAX_HEAP_H
#define MAX_HEAP_H

#include <vector>
#include <string>
#include "MaxResult.h"

using namespace std;

class MaxHeap {
private:
    vector<Book*> heap;

    void heapifyUp(int index);
    void heapifyDown(int index);
    static bool higherPriority(const Book* a, const Book* b);

public:
    MaxHeap();

    void build(vector<Book>& books);
    void insert(Book* book);
    MaxResult getMax() const;
    bool updateBorrowCount(const string& bookId, int newCount);
    int size() const;
    bool empty() const;
    void clear();
};

#endif // MAX_HEAP_H
