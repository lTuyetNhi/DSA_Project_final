#ifndef BORROW_RECORD_H
#define BORROW_RECORD_H

#include <string>

using namespace std;

// Model Phiếu mượn / trả - tương ứng data/borrow_records.json
struct BorrowRecord {
    string borrow_id;
    string reader_id;
    string book_id;
    string borrow_date;
    string due_date;
    string return_date; // "null" hoặc rỗng nếu chưa trả
    string status;      // "BORROWING" hoặc "RETURNED"
};

#endif // BORROW_RECORD_H
