#ifndef AVL_TREE_H
#define AVL_TREE_H

#include <vector>
#include <string>
#include "OverdueResult.h"

// Node trên cây AVL: mỗi node là một mốc ngày hẹn trả (dueDate)
struct AVLNode {
    std::string dueDate;                // Ngày hẹn trả ("YYYY-MM-DD")
    std::vector<BorrowRecord> records;  // Danh sách phiếu mượn có cùng hạn trả này
    AVLNode* left;                      // Nhánh con trái (ngày < dueDate)
    AVLNode* right;                     // Nhánh con phải (ngày > dueDate)
    int height;                         // Chiều cao node

    AVLNode(const std::string& d) 
        : dueDate(d), left(nullptr), right(nullptr), height(1) {}
};

// Cây AVL tự cân bằng lọc phiếu quá hạn (không dùng con trỏ dữ liệu ngoài)
class AVLTree {
private:
    AVLNode* root;

    int getHeight(AVLNode* node) const;
    int getBalance(AVLNode* node) const;
    void updateHeight(AVLNode* node);

    AVLNode* rotateRight(AVLNode* y); // Xoay phải
    AVLNode* rotateLeft(AVLNode* x);  // Xoay trái

    AVLNode* insert(AVLNode* node, const BorrowRecord& record);
    void rangeQueryOverdue(AVLNode* node, const std::string& currentDate, std::vector<BorrowRecord>& result, long long& nodesVisited) const;
    void destroy(AVLNode* node);

public:
    AVLTree();
    ~AVLTree();

    AVLTree(const AVLTree&) = delete;
    AVLTree& operator=(const AVLTree&) = delete;

    void build(const std::vector<BorrowRecord>& records);
    void insert(const BorrowRecord& record);
    OverdueResult findOverdue(const std::string& currentDate) const;
    void clear();
};

#endif // AVL_TREE_H
