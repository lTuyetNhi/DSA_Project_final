#include "../../../include/core/mc2/MaxHeap.h"
#include <chrono>
#include <algorithm>
#include <cctype>

using namespace std;

static string toLowerStr(string s) {
    for (char& c : s) {
        c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
    }
    return s;
}

MaxHeap::MaxHeap() {}

bool MaxHeap::higherPriority(const Book* a, const Book* b) {
    if (!a) return false;
    if (!b) return true;
    if (a->borrow_count != b->borrow_count) {
        return a->borrow_count > b->borrow_count;
    }
    return a->book_id < b->book_id;
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
        int left = 2 * index + 1;
        int right = 2 * index + 2;
        int largest = index;

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

void MaxHeap::build(vector<Book>& books) {
    heap.clear();
    heap.reserve(books.size());
    for (auto& b : books) {
        heap.push_back(&b);
    }

    int n = static_cast<int>(heap.size());
    for (int i = (n / 2) - 1; i >= 0; --i) {
        heapifyDown(i);
    }
}

void MaxHeap::insert(Book* book) {
    if (!book) return;
    heap.push_back(book);
    heapifyUp(static_cast<int>(heap.size()) - 1);
}

MaxResult MaxHeap::getMax() const {
    if (heap.empty()) {
        return MaxResult(nullptr, 0, 0, "Max-Heap", "O(1) getMax");
    }

    auto start = chrono::high_resolution_clock::now();
    Book* maxBook = heap[0];
    auto end = chrono::high_resolution_clock::now();

    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return MaxResult(maxBook, durationNs, 1, "Max-Heap", "O(1) getMax");
}

bool MaxHeap::updateBorrowCount(const string& bookId, int newCount) {
    string target = toLowerStr(bookId);
    int n = static_cast<int>(heap.size());
    for (int i = 0; i < n; ++i) {
        if (toLowerStr(heap[i]->book_id) == target) {
            int oldCount = heap[i]->borrow_count;
            heap[i]->borrow_count = newCount;
            if (newCount > oldCount) {
                heapifyUp(i);
            } else {
                heapifyDown(i);
            }
            return true;
        }
    }
    return false;
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
