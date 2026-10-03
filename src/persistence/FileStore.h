#ifndef FILE_STORE_H
#define FILE_STORE_H

#include <vector>
#include <string>
#include "../models/Book.h"
#include "../models/Reader.h"
#include "../models/BorrowRecord.h"
#include "../models/WaitlistEntry.h"

class FileStore {
public:
    // Đọc và ghi Books
    static std::vector<Book> loadBooks(const std::string& filePath = "data/books.json");
    static bool saveBooks(const std::string& filePath, const std::vector<Book>& books);

    // Đọc và ghi Readers
    static std::vector<Reader> loadReaders(const std::string& filePath = "data/readers.json");
    static bool saveReaders(const std::string& filePath, const std::vector<Reader>& readers);

    // Đọc và ghi Borrow Records
    static std::vector<BorrowRecord> loadBorrowRecords(const std::string& filePath = "data/borrow_records.json");
    static bool saveBorrowRecords(const std::string& filePath, const std::vector<BorrowRecord>& records);

    // Đọc và ghi Waitlist
    static std::vector<WaitlistEntry> loadWaitlist(const std::string& filePath = "data/waitlist.json");
    static bool saveWaitlist(const std::string& filePath, const std::vector<WaitlistEntry>& waitlist);
};

#endif // FILE_STORE_H
