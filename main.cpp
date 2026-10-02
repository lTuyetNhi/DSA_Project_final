#include <iostream>
#include <exception>
#include "src/persistence/FileStore.h"

using namespace std;

// 1. Doc Books
vector<Book> testDocBooks() {
    return FileStore::loadBooks("data/books.json");
}

// 2. Doc Readers
vector<Reader> testDocReaders() {
    return FileStore::loadReaders("data/readers.json");
}

// 3. Doc Borrow Records
vector<BorrowRecord> testDocBorrowRecords() {
    return FileStore::loadBorrowRecords("data/borrow_records.json");
}

// 4. Doc Waitlist
vector<WaitlistEntry> testDocWaitlist() {
    return FileStore::loadWaitlist("data/waitlist.json");
}

int main() {
    try {
        // Goi cac ham doc du lieu
        auto books = testDocBooks();
        auto readers = testDocReaders();
        auto records = testDocBorrowRecords();
        auto waitlist = testDocWaitlist();

        cout << "Doc du lieu thanh cong!\n";
    } catch (const exception& e) {
        cerr << "Doc du lieu that bai: " << e.what() << "\n";
        return 1;
    } catch (...) {
        cerr << "Doc du lieu that bai!\n";
        return 1;
    }

    return 0;
}
