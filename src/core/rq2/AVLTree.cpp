#include "../../../include/core/rq2/AVLTree.h"
#include "../../../include/utils/DateUtils.h"
#include <chrono>
#include <algorithm>

using namespace std;

AVLTree::AVLTree() : root(nullptr) {}

AVLTree::~AVLTree() {
    clear();
}

void AVLTree::destroy(AVLNode* node) {
    if (!node) return;
    destroy(node->left);
    destroy(node->right);
    delete node;
}

void AVLTree::clear() {
    destroy(root);
    root = nullptr;
}

int AVLTree::getHeight(AVLNode* node) const {
    return node ? node->height : 0;
}

int AVLTree::getBalance(AVLNode* node) const {
    return node ? (getHeight(node->left) - getHeight(node->right)) : 0;
}

void AVLTree::updateHeight(AVLNode* node) {
    if (node) {
        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    }
}

AVLNode* AVLTree::rotateRight(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;

    x->right = y;
    y->left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
}

AVLNode* AVLTree::rotateLeft(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;

    y->left = x;
    x->right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
}

AVLNode* AVLTree::insert(AVLNode* node, BorrowRecord* record) {
    if (!node) {
        AVLNode* newNode = new AVLNode(record->due_date);
        newNode->records.push_back(record);
        return newNode;
    }

    if (record->due_date == node->dueDate) {
        node->records.push_back(record);
        return node;
    } else if (record->due_date < node->dueDate) {
        node->left = insert(node->left, record);
    } else {
        node->right = insert(node->right, record);
    }

    updateHeight(node);
    int balance = getBalance(node);

    // 4 truong hop mat can bang cua AVL
    // Left Left
    if (balance > 1 && record->due_date < node->left->dueDate) {
        return rotateRight(node);
    }
    // Right Right
    if (balance < -1 && record->due_date > node->right->dueDate) {
        return rotateLeft(node);
    }
    // Left Right
    if (balance > 1 && record->due_date > node->left->dueDate) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    // Right Left
    if (balance < -1 && record->due_date < node->right->dueDate) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}

void AVLTree::build(vector<BorrowRecord>& records) {
    clear();
    for (auto& r : records) {
        if (r.status == "BORROWING" && DateUtils::isValidDate(r.due_date)) {
            insert(&r);
        }
    }
}

void AVLTree::insert(BorrowRecord* record) {
    if (!record) return;
    root = insert(root, record);
}

void AVLTree::rangeQueryOverdue(AVLNode* node, const string& currentDate, vector<BorrowRecord*>& result, long long& nodesVisited) const {
    if (!node) return;
    nodesVisited++;

    if (DateUtils::daysBetween(node->dueDate, currentDate) > 0) {
        // Duyet nhanh trai vi toan bo nhanh trai deu co dueDate < node->dueDate < currentDate
        rangeQueryOverdue(node->left, currentDate, result, nodesVisited);

        // Lay cac record hop le o node hien tai
        for (auto* r : node->records) {
            if (r && r->status == "BORROWING") {
                result.push_back(r);
            }
        }

        // Kiem tra tiep nhanh phai
        rangeQueryOverdue(node->right, currentDate, result, nodesVisited);
    } else {
        // node->dueDate >= currentDate: Toan bo cay con phai chac chan >= currentDate => Cat tia hoan toan!
        rangeQueryOverdue(node->left, currentDate, result, nodesVisited);
    }
}

OverdueResult AVLTree::findOverdue(const string& currentDate) const {
    long long nodesVisited = 0;
    auto start = chrono::high_resolution_clock::now();

    vector<BorrowRecord*> overdueList;
    if (DateUtils::isValidDate(currentDate)) {
        rangeQueryOverdue(root, currentDate, overdueList, nodesVisited);
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return OverdueResult(overdueList, durationNs, nodesVisited, "AVL Tree", "O(log n + k)");
}
