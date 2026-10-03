#ifndef BORROW_RECORD_H
#define BORROW_RECORD_H

#include <string>

// Model Phiếu mượn / trả - tương ứng data/borrow_records.json
struct BorrowRecord {
    std::string borrow_id;
    std::string reader_id;
    std::string book_id;
    std::string borrow_date;
    std::string due_date;
    std::string return_date; // "null" hoặc rỗng nếu chưa trả
    std::string status;      // "BORROWING" hoặc "RETURNED"
};

#endif // BORROW_RECORD_H
