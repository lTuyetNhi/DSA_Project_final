#ifndef FILE_STORE_H
#define FILE_STORE_H

#include "../models/Models.h"
#include <vector>
#include <string>

using namespace std;

class FileStore {
public:
    // Đọc và ghi Books
    static vector<Book> loadBooks(const string& filePath = "data/books.json");
    static bool saveBooks(const string& filePath, const vector<Book>& books);

    // Đọc và ghi Readers
    static vector<Reader> loadReaders(const string& filePath = "data/readers.json");
    static bool saveReaders(const string& filePath, const vector<Reader>& readers);

    // Đọc và ghi Borrow Records
    static vector<BorrowRecord> loadBorrowRecords(const string& filePath = "data/borrow_records.json");
    static bool saveBorrowRecords(const string& filePath, const vector<BorrowRecord>& records);

    // Đọc và ghi Waitlist
    static vector<WaitlistEntry> loadWaitlist(const string& filePath = "data/waitlist.json");
    static bool saveWaitlist(const string& filePath, const vector<WaitlistEntry>& waitlist);
};

#endif // FILE_STORE_H
