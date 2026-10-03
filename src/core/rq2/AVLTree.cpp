#include "../../../include/core/rq2/AVLTree.h"
#include "../../../include/utils/DateUtils.h"
#include <chrono>
#include <algorithm>

using namespace std;

AVLTree::AVLTree() : root(nullptr) {}

AVLTree::~AVLTree() {
    clear();
}

int AVLTree::getHeight(AVLNode* node) const {
    return node ? node->height : 0;
}

int AVLTree::getBalance(AVLNode* node) const {
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

void AVLTree::updateHeight(AVLNode* node) {
    if (node) {
        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    }
}

// Xoay phải (Right Rotation - LL Case)
AVLNode* AVLTree::rotateRight(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;

    x->right = y;
    y->left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
}

// Xoay trái (Left Rotation - RR Case)
AVLNode* AVLTree::rotateLeft(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;

    y->left = x;
    x->right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
}

// Chèn phiếu mượn vào cây AVL theo ngày hẹn trả (dueDate)
AVLNode* AVLTree::insert(AVLNode* node, const BorrowRecord& record) {
    if (!node) {
        AVLNode* newNode = new AVLNode(record.due_date);
        newNode->records.push_back(record);
        if (record.status == "BORROWING") ++newNode->borrowingCount;
        return newNode;
    }

    if (record.due_date < node->dueDate) {
        node->left = insert(node->left, record);
    } else if (record.due_date > node->dueDate) {
        node->right = insert(node->right, record);
    } else {
        // Trùng ngày hẹn trả -> gom chung vào vector của node hiện tại
        node->records.push_back(record);
        if (record.status == "BORROWING") ++node->borrowingCount;
        return node;
    }

    // Cập nhật chiều cao và tự cân bằng 4 trường hợp (LL, RR, LR, RL)
    updateHeight(node);
    int balance = getBalance(node);

    // 1. LL
    if (balance > 1 && record.due_date < node->left->dueDate) {
        return rotateRight(node);
    }
    // 2. RR
    if (balance < -1 && record.due_date > node->right->dueDate) {
        return rotateLeft(node);
    }
    // 3. LR
    if (balance > 1 && record.due_date > node->left->dueDate) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    // 4. RL
    if (balance < -1 && record.due_date < node->right->dueDate) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}

// Cắt tỉa nhánh thông minh: chỉ duyệt nhánh trái nếu ngày hẹn trả < currentDate
void AVLTree::rangeQueryOverdue(AVLNode* node, const string& currentDate, vector<BorrowRecord>& result, long long& nodesVisited) const {
    if (!node) return;

    nodesVisited++;

    // Nhánh trái luôn có dueDate nhỏ hơn node hiện tại
    rangeQueryOverdue(node->left, currentDate, result, nodesVisited);

    // Kiểm tra node hiện tại có quá hạn so với ngày kiểm tra không
    if (DateUtils::daysBetween(node->dueDate, currentDate) > 0) {
        for (const auto& rec : node->records) {
            if (rec.status == "BORROWING") {
                result.push_back(rec);
            }
        }
        // Tiếp tục xét nhánh phải
        rangeQueryOverdue(node->right, currentDate, result, nodesVisited);
    }
    // Nếu node->dueDate >= currentDate thì toàn bộ cây con bên phải cũng >= currentDate -> CẮT TỈA (Prune)
}

void AVLTree::build(const vector<BorrowRecord>& records) {
    clear();
    for (const auto& rec : records) {
        if (rec.status == "BORROWING" && DateUtils::isValidDate(rec.due_date)) {
            insert(rec);
        }
    }
}

void AVLTree::insert(const BorrowRecord& record) {
    root = insert(root, record);
}

OverdueResult AVLTree::findOverdue(const string& currentDate) const {
    long long nodesVisited = 0;
    auto start = chrono::high_resolution_clock::now();

    vector<BorrowRecord> overdueList;
    if (DateUtils::isValidDate(currentDate)) {
        rangeQueryOverdue(root, currentDate, overdueList, nodesVisited);
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return OverdueResult(overdueList, !overdueList.empty(), durationNs, nodesVisited, "AVL Tree Range Query", "O(log n + k)");
}

size_t AVLTree::countOverdue(const string& currentDate, long long* nodesVisited) const {
    if (nodesVisited) *nodesVisited = 0;
    if (!DateUtils::isValidDate(currentDate)) return 0;
    return countRangeOverdue(root, currentDate, nodesVisited);
}

size_t AVLTree::countRangeOverdue(AVLNode* node, const string& currentDate, long long* nodesVisited) const {
    if (!node) return 0;
    if (nodesVisited) ++(*nodesVisited);
    if (node->dueDate >= currentDate) {
        return countRangeOverdue(node->left, currentDate, nodesVisited);
    }
    return node->borrowingCount
        + countRangeOverdue(node->left, currentDate, nodesVisited)
        + countRangeOverdue(node->right, currentDate, nodesVisited);
}

void AVLTree::destroy(AVLNode* node) {
    if (node) {
        destroy(node->left);
        destroy(node->right);
        delete node;
    }
}

void AVLTree::clear() {
    destroy(root);
    root = nullptr;
}
