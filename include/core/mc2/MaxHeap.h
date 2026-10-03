#ifndef MAX_HEAP_H
#define MAX_HEAP_H

#include <vector>
#include <string>
#include "MaxResult.h"

using namespace std;

// Cấu trúc Max-Heap mảng động (lưu trực tiếp Book, không dùng con trỏ)
class MaxHeap {
private:
    vector<Book> heap; // Mảng lưu trực tiếp các cuốn sách

    void heapifyUp(int index);   // Đẩy lên
    void heapifyDown(int index); // Kéo xuống
    static bool higherPriority(const Book& a, const Book& b);

public:
    MaxHeap();

    void build(const vector<Book>& books);
    void insert(const Book& book);
    MaxResult getMax() const;
    bool updateBorrowCount(const string& bookId, int newCount);
    int size() const;
    bool empty() const;
    void clear();
};

#endif // MAX_HEAP_H
