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

static void escapeJsonStream(ostream& os, const string& s) {
    for (char c : s) {
        if (c == '"') os << "\\\"";
        else if (c == '\\') os << "\\\\";
        else if (c == '\b') os << "\\b";
        else if (c == '\f') os << "\\f";
        else if (c == '\n') os << "\\n";
        else if (c == '\r') os << "\\r";
        else if (c == '\t') os << "\\t";
        else os << c;
    }
}

bool FileStore::saveBooks(const string& filePath, const vector<Book>& books) {
    ofstream file(filePath, ios::out | ios::binary);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the ghi file: " << filePath << "\n";
        return false;
    }

    file << "[\n";
    for (size_t i = 0; i < books.size(); ++i) {
        const auto& b = books[i];
        file << "  {\n"
             << "    \"book_id\": \""; escapeJsonStream(file, b.book_id); file << "\",\n"
             << "    \"title\": \""; escapeJsonStream(file, b.title); file << "\",\n"
             << "    \"author\": \""; escapeJsonStream(file, b.author); file << "\",\n"
             << "    \"category\": \""; escapeJsonStream(file, b.category); file << "\",\n"
             << "    \"published_year\": " << b.published_year << ",\n"
             << "    \"total_quantity\": " << b.total_quantity << ",\n"
             << "    \"available_quantity\": " << b.available_quantity << ",\n"
             << "    \"borrow_count\": " << b.borrow_count << "\n"
             << "  }" << (i + 1 == books.size() ? "\n" : ",\n");
    }
    file << "]\n";
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
    ofstream file(filePath, ios::out | ios::binary);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the ghi file: " << filePath << "\n";
        return false;
    }

    file << "[\n";
    for (size_t i = 0; i < readers.size(); ++i) {
        const auto& r = readers[i];
        file << "  {\n"
             << "    \"reader_id\": \""; escapeJsonStream(file, r.reader_id); file << "\",\n"
             << "    \"name\": \""; escapeJsonStream(file, r.name); file << "\",\n"
             << "    \"email\": \""; escapeJsonStream(file, r.email); file << "\",\n"
             << "    \"phone\": \""; escapeJsonStream(file, r.phone); file << "\"\n"
             << "  }" << (i + 1 == readers.size() ? "\n" : ",\n");
    }
    file << "]\n";
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
    ofstream file(filePath, ios::out | ios::binary);
    if (!file.is_open()) {
        cerr << "[FileStore] Khong the ghi file: " << filePath << "\n";
        return false;
    }

    file << "[\n";
    for (size_t i = 0; i < records.size(); ++i) {
        const auto& br = records[i];
        file << "  {\n"
             << "    \"borrow_id\": \""; escapeJsonStream(file, br.borrow_id); file << "\",\n"
             << "    \"reader_id\": \""; escapeJsonStream(file, br.reader_id); file << "\",\n"
             << "    \"book_id\": \""; escapeJsonStream(file, br.book_id); file << "\",\n"
             << "    \"borrow_date\": \""; escapeJsonStream(file, br.borrow_date); file << "\",\n"
             << "    \"due_date\": \""; escapeJsonStream(file, br.due_date); file << "\",\n";
        if (br.return_date.empty()) {
            file << "    \"return_date\": null,\n";
        } else {
            file << "    \"return_date\": \""; escapeJsonStream(file, br.return_date); file << "\",\n";
        }
        file << "    \"status\": \""; escapeJsonStream(file, br.status); file << "\"\n"
             << "  }" << (i + 1 == records.size() ? "\n" : ",\n");
    }
    file << "]\n";
    return true;
}

