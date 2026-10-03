#include "../../../include/core/rq3/CategoryTitleSearch.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>
#include <sstream>

using namespace std;

CategoryTitleSearch::CategoryTitleSearch() {
    table.resize(TABLE_SIZE);
}

size_t CategoryTitleSearch::hashFunction(const string& key) const {
    size_t hash = 5381;
    for (char c : key) {
        hash = ((hash << 5) + hash) + static_cast<unsigned char>(c);
    }
    return hash % TABLE_SIZE;
}

void CategoryTitleSearch::insertWord(const string& word, const Book& book) {
    string normWord = StringUtils::toLower(word);
    if (normWord.empty()) return;

    size_t index = hashFunction(normWord);

    // Kiểm tra xem từ khóa đã có trong bucket chưa
    for (auto& entry : table[index]) {
        if (entry.word == normWord) {
            // Tránh trùng sách trong cùng một từ khóa
            for (const auto& b : entry.books) {
                if (b.book_id == book.book_id) return;
            }
            entry.books.push_back(book);
            return;
        }
    }

    // Nếu chưa có từ khóa này thì tạo mục mới
    TitleEntry newEntry;
    newEntry.word = normWord;
    newEntry.books.push_back(book);
    table[index].push_back(newEntry);
}

void CategoryTitleSearch::clear() {
    for (auto& bucket : table) {
        bucket.clear();
    }
}

// Tách tiêu đề từng cuốn sách thành các từ đơn và lập chỉ mục ngược
void CategoryTitleSearch::build(const vector<Book>& books) {
    clear();
    for (const auto& b : books) {
        stringstream ss(b.title);
        string word;
        while (ss >> word) {
            // Loại bỏ dấu câu cơ bản
            string cleanWord = "";
            for (char c : word) {
                if (isalnum(static_cast<unsigned char>(c))) {
                    cleanWord += c;
                }
            }
            if (!cleanWord.empty()) {
                insertWord(cleanWord, b);
            }
        }
    }
}

TitleSearchResult CategoryTitleSearch::search(const string& keyword) const {
    long long booksChecked = 0;
    auto start = chrono::high_resolution_clock::now();

    string normKw = StringUtils::toLower(keyword);
    size_t index = hashFunction(normKw);

    vector<Book> foundBooks;
    for (const auto& entry : table[index]) {
        booksChecked++;
        if (entry.word == normKw) {
            foundBooks = entry.books;
            break;
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return TitleSearchResult(foundBooks, !foundBooks.empty(), durationNs, booksChecked, "Title Inverted Hash Index", "O(1 + k)");
}
