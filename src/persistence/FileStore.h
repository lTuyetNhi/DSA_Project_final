#ifndef FILE_STORE_H
#define FILE_STORE_H

#include <vector>
#include <string>
#include "../models/Book.h"
#include "../models/Reader.h"
#include "../models/BorrowRecord.h"

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
};

#endif // FILE_STORE_H
