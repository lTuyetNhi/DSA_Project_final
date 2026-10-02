#ifndef AVL_TREE_H
#define AVL_TREE_H

#include <vector>
#include <string>
#include "OverdueResult.h"

using namespace std;

struct AVLNode {
    string dueDate;
    vector<BorrowRecord*> records;
    AVLNode* left;
    AVLNode* right;
    int height;

    AVLNode(const string& d) 
        : dueDate(d), left(nullptr), right(nullptr), height(1) {}
};

class AVLTree {
private:
    AVLNode* root;

    int getHeight(AVLNode* node) const;
    int getBalance(AVLNode* node) const;
    void updateHeight(AVLNode* node);

    AVLNode* rotateRight(AVLNode* y);
    AVLNode* rotateLeft(AVLNode* x);

    AVLNode* insert(AVLNode* node, BorrowRecord* record);
    void rangeQueryOverdue(AVLNode* node, const string& currentDate, vector<BorrowRecord*>& result, long long& nodesVisited) const;
    void destroy(AVLNode* node);

public:
    AVLTree();
    ~AVLTree();

    AVLTree(const AVLTree&) = delete;
    AVLTree& operator=(const AVLTree&) = delete;

    void build(vector<BorrowRecord>& records);
    void insert(BorrowRecord* record);
    OverdueResult findOverdue(const string& currentDate) const;
    void clear();
};

#endif // AVL_TREE_H
