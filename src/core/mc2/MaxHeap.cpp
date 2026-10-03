#include "../../../include/core/mc2/MaxHeap.h"
#include <chrono>
#include <algorithm>

using namespace std;

MaxHeap::MaxHeap() {}

// Hàm so sánh độ ưu tiên: lượt mượn cao hơn -> ưu tiên hơn, nếu bằng thì ID nhỏ hơn
bool MaxHeap::higherPriority(const Book& a, const Book& b) {
    if (a.borrow_count != b.borrow_count) {
        return a.borrow_count > b.borrow_count;
    }
    return a.book_id < b.book_id;
}

void MaxHeap::heapifyUp(int index) {
    while (index > 0) {
        int parent = (index - 1) / 2;
        if (higherPriority(heap[index], heap[parent])) {
            swap(heap[index], heap[parent]);
            index = parent;
        } else {
            break;
        }
    }
}

void MaxHeap::heapifyDown(int index) {
    int n = static_cast<int>(heap.size());
    while (true) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        if (left < n && higherPriority(heap[left], heap[largest])) {
            largest = left;
        }
        if (right < n && higherPriority(heap[right], heap[largest])) {
            largest = right;
        }

        if (largest != index) {
            swap(heap[index], heap[largest]);
            index = largest;
        } else {
            break;
        }
    }
}

// Xây dựng Heap nhanh bằng thuật toán Floyd O(n)
void MaxHeap::build(const vector<Book>& books) {
    heap = books;
    for (int i = static_cast<int>(heap.size()) / 2 - 1; i >= 0; --i) {
        heapifyDown(i);
    }
}

void MaxHeap::insert(const Book& book) {
    heap.push_back(book);
    heapifyUp(static_cast<int>(heap.size()) - 1);
}

// Lấy sách mượn nhiều nhất tại đỉnh Heap với thời gian O(1)
MaxResult MaxHeap::getMax() const {
    auto start = chrono::high_resolution_clock::now();

    Book maxBook;
    bool found = false;
    if (!heap.empty()) {
        maxBook = heap[0];
        found = true;
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return MaxResult(maxBook, found, durationNs, 1, "Max-Heap", "O(1)");
}

// Cập nhật số lượt mượn của một cuốn sách
bool MaxHeap::updateBorrowCount(const string& bookId, int newCount) {
    int targetIdx = -1;
    for (size_t i = 0; i < heap.size(); ++i) {
        if (heap[i].book_id == bookId) {
            targetIdx = static_cast<int>(i);
            break;
        }
    }

    if (targetIdx == -1) {
        return false;
    }

    int oldCount = heap[targetIdx].borrow_count;
    heap[targetIdx].borrow_count = newCount;

    if (newCount > oldCount) {
        heapifyUp(targetIdx);
    } else if (newCount < oldCount) {
        heapifyDown(targetIdx);
    }
    return true;
}

int MaxHeap::size() const {
    return static_cast<int>(heap.size());
}

bool MaxHeap::empty() const {
    return heap.empty();
}

void MaxHeap::clear() {
    heap.clear();
}
