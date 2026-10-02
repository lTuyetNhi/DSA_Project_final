#include "../../../include/core/mc2/MaxHeap.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>
#include <algorithm>

using namespace std;

MaxHeap::MaxHeap() {}

// Ham so sanh do uu tien: borrow_count lon hon -> uu tien hon; neu bang nhau uu tien book_id nho hon
bool MaxHeap::higherPriority(const Book* a, const Book* b) {
    if (!a) return false;
    if (!b) return true;
    if (a->borrow_count != b->borrow_count) {
        return a->borrow_count > b->borrow_count;
    }
    return a->book_id < b->book_id;
}

// Vun dong tu duoi len (khi chen phan tu moi hoac tang gia tri)
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

// Vun dong tu tren xuong (de duy tri tinh chat Max-Heap)
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

// Xay dung Heap tu danh sach sach trong O(n)
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

// Lay sach co luot muon nhieu nhat o dinh Heap trong O(1)
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

// Cap nhat borrow_count cua mot sach va duy tri lai Heap trong O(log n)
bool MaxHeap::updateBorrowCount(const string& bookId, int newCount) {
    string target = StringUtils::toLower(bookId);
    int n = static_cast<int>(heap.size());
    for (int i = 0; i < n; ++i) {
        if (StringUtils::toLower(heap[i]->book_id) == target) {
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
