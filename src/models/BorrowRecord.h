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
    string status;      // "BORROWING" / "Đang mượn" hoặc "RETURNED" / "Đã trả"

    bool isBorrowing() const {
        return status == "BORROWING" || status == "Đang mượn" || status == "ĐANG MƯỢN" || status == "Dang muon" || status == "DANG MUON";
    }
};

#endif // BORROW_RECORD_H
