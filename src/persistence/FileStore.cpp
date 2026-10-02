#include "FileStore.h"
#include "../../include/nlohmann/json.hpp"
#include <fstream>
#include <iostream>

using namespace std;
using json = nlohmann::json;

// =======================================================
// 1. BOOKS - Đọc và Ghi dữ liệu sách/tài liệu
// =======================================================
vector<Book> FileStore::loadBooks(const string& filePath) {
    vector<Book> list;
    ifstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the mo file: " << filePath << "\n";
        return list;
    }

    try {
        json j;
        file >> j;
        for (const auto& item : j) {
            Book b;
            b.book_id = item.value("book_id", "");
            b.title = item.value("title", "");
            b.author = item.value("author", "");
            b.category = item.value("category", "");
            b.published_year = item.value("published_year", 0);
            b.total_quantity = item.value("total_quantity", 0);
            b.available_quantity = item.value("available_quantity", 0);
            b.borrow_count = item.value("borrow_count", 0);
            list.push_back(b);
        }
    } catch (const json::exception& e) {
        cerr << "[FileStore] Loi parse JSON (" << filePath << "): " << e.what() << "\n";
    }

    return list;
}

bool FileStore::saveBooks(const string& filePath, const vector<Book>& books) {
    ofstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the ghi file: " << filePath << "\n";
        return false;
    }

    json j = json::array();
    for (const auto& b : books) {
        json item = {
            {"book_id", b.book_id},
            {"title", b.title},
            {"author", b.author},
            {"category", b.category},
            {"published_year", b.published_year},
            {"total_quantity", b.total_quantity},
            {"available_quantity", b.available_quantity},
            {"borrow_count", b.borrow_count}
        };
        j.push_back(item);
    }

    file << j.dump(2);
    return true;
}

// =======================================================
// 2. READERS - Đọc và Ghi dữ liệu độc giả
// =======================================================
vector<Reader> FileStore::loadReaders(const string& filePath) {
    vector<Reader> list;
    ifstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the mo file: " << filePath << "\n";
        return list;
    }

    try {
        json j;
        file >> j;
        for (const auto& item : j) {
            Reader r;
            r.reader_id = item.value("reader_id", "");
            r.name = item.value("name", "");
            r.email = item.value("email", "");
            r.phone = item.value("phone", "");
            list.push_back(r);
        }
    } catch (const json::exception& e) {
        cerr << "[FileStore] Loi parse JSON (" << filePath << "): " << e.what() << "\n";
    }

    return list;
}

bool FileStore::saveReaders(const string& filePath, const vector<Reader>& readers) {
    ofstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the ghi file: " << filePath << "\n";
        return false;
    }

    json j = json::array();
    for (const auto& r : readers) {
        json item = {
            {"reader_id", r.reader_id},
            {"name", r.name},
            {"email", r.email},
            {"phone", r.phone}
        };
        j.push_back(item);
    }

    file << j.dump(2);
    return true;
}

// =======================================================
// 3. BORROW RECORDS - Đọc và Ghi dữ liệu mượn/trả
// =======================================================
vector<BorrowRecord> FileStore::loadBorrowRecords(const string& filePath) {
    vector<BorrowRecord> list;
    ifstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the mo file: " << filePath << "\n";
        return list;
    }

    try {
        json j;
        file >> j;
        for (const auto& item : j) {
            BorrowRecord br;
            br.borrow_id = item.value("borrow_id", "");
            br.reader_id = item.value("reader_id", "");
            br.book_id = item.value("book_id", "");
            br.borrow_date = item.value("borrow_date", "");
            br.due_date = item.value("due_date", "");
            if (item.contains("return_date") && !item["return_date"].is_null()) {
                br.return_date = item["return_date"].get<string>();
            } else {
                br.return_date = "";
            }
            br.status = item.value("status", "");
            list.push_back(br);
        }
    } catch (const json::exception& e) {
        cerr << "[FileStore] Loi parse JSON (" << filePath << "): " << e.what() << "\n";
    }

    return list;
}

bool FileStore::saveBorrowRecords(const string& filePath, const vector<BorrowRecord>& records) {
    ofstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the ghi file: " << filePath << "\n";
        return false;
    }

    json j = json::array();
    for (const auto& br : records) {
        json item = {
            {"borrow_id", br.borrow_id},
            {"reader_id", br.reader_id},
            {"book_id", br.book_id},
            {"borrow_date", br.borrow_date},
            {"due_date", br.due_date},
            {"status", br.status}
        };

        if (br.return_date.empty()) {
            item["return_date"] = nullptr;
        } else {
            item["return_date"] = br.return_date;
        }

        j.push_back(item);
    }

    file << j.dump(2);
    return true;
}

// =======================================================
// 4. WAITLIST - Đọc và Ghi dữ liệu danh sách chờ
// =======================================================
vector<WaitlistEntry> FileStore::loadWaitlist(const string& filePath) {
    vector<WaitlistEntry> list;
    ifstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the mo file: " << filePath << "\n";
        return list;
    }

    try {
        json j;
        file >> j;
        for (const auto& item : j) {
            WaitlistEntry w;
            w.wait_id = item.value("wait_id", "");
            w.book_id = item.value("book_id", "");
            w.reader_id = item.value("reader_id", "");
            w.registered_at = item.value("registered_at", "");
            list.push_back(w);
        }
    } catch (const json::exception& e) {
        cerr << "[FileStore] Loi parse JSON (" << filePath << "): " << e.what() << "\n";
    }

    return list;
}

bool FileStore::saveWaitlist(const string& filePath, const vector<WaitlistEntry>& waitlist) {
    ofstream file(filePath);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the ghi file: " << filePath << "\n";
        return false;
    }

    json j = json::array();
    for (const auto& w : waitlist) {
        json item = {
            {"wait_id", w.wait_id},
            {"book_id", w.book_id},
            {"reader_id", w.reader_id},
            {"registered_at", w.registered_at}
        };
        j.push_back(item);
    }

    file << j.dump(2);
    return true;
}
