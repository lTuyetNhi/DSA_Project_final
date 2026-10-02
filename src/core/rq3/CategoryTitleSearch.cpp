#include "../../../include/core/rq3/CategoryTitleSearch.h"
#include "../../../include/utils/StringUtils.h"
#include <chrono>
#include <algorithm>
#include <cctype>
#include <sstream>
#include <unordered_set>

using namespace std;

CategoryTitleSearch::CategoryTitleSearch() {
    table.resize(TABLE_SIZE, nullptr);
}

CategoryTitleSearch::~CategoryTitleSearch() {
    clear();
}

void CategoryTitleSearch::clear() {
    for (size_t i = 0; i < table.size(); ++i) {
        TitleHashNode* curr = table[i];
        while (curr != nullptr) {
            TitleHashNode* temp = curr;
            curr = curr->next;
            delete temp;
        }
        table[i] = nullptr;
    }
}

// Ham bam DJB2 cho cac tu trong tieu de sach
size_t CategoryTitleSearch::hashFunction(const string& key) const {
    unsigned long hashVal = 5381;
    for (char c : key) {
        hashVal = ((hashVal << 5) + hashVal) + static_cast<unsigned char>(c);
    }
    return hashVal % TABLE_SIZE;
}

// Chen tu khoa (word) va con tro sach vao Bang bam
void CategoryTitleSearch::insertWord(const string& word, Book* book) {
    if (word.empty() || !book) return;
    size_t index = hashFunction(word);
    TitleHashNode* curr = table[index];

    while (curr != nullptr) {
        if (curr->word == word) {
            // Tranh trung lap sach trong cung mot token
            for (auto* b : curr->books) {
                if (b && b->book_id == book->book_id) return;
            }
            curr->books.push_back(book);
            return;
        }
        curr = curr->next;
    }

    TitleHashNode* newNode = new TitleHashNode(word);
    newNode->books.push_back(book);
    newNode->next = table[index];
    table[index] = newNode;
}

// Xay dung chi muc nguoc (Inverted Index) tu tieu de cua toan bo danh muc sach
void CategoryTitleSearch::build(vector<Book>& books) {
    clear();
    for (auto& book : books) {
        // Chuyen ky tu dac biet thanh khoang trang de tach tu sach
        string cleanTitle;
        for (char c : book.title) {
            if (isalnum(static_cast<unsigned char>(c)) || c == ' ') {
                cleanTitle += static_cast<char>(tolower(static_cast<unsigned char>(c)));
            } else {
                cleanTitle += ' ';
            }
        }

        stringstream ss(cleanTitle);
        string word;
        while (ss >> word) {
            insertWord(word, &book);
        }
    }
}

// Tra cuu tu khoa trong tieu de sach qua Inverted Hash Index
TitleSearchResult CategoryTitleSearch::search(const string& keyword) const {
    auto start = chrono::high_resolution_clock::now();
    long long checks = 0;

    string targetKw = StringUtils::toLower(keyword);
    // Trim khoang trang
    size_t first = targetKw.find_first_not_of(" \t\r\n");
    size_t last = targetKw.find_last_not_of(" \t\r\n");
    if (first != string::npos && last != string::npos) {
        targetKw = targetKw.substr(first, (last - first + 1));
    }

    vector<Book*> matchedBooks;
    unordered_set<string> seenBookIds;

    // 1. Tra cuu truc tiep theo Hash neu keyword la 1 tu don
    bool isSingleWord = (targetKw.find(' ') == string::npos);
    if (isSingleWord && !targetKw.empty()) {
        size_t index = hashFunction(targetKw);
        TitleHashNode* curr = table[index];
        while (curr != nullptr) {
            checks++;
            if (curr->word == targetKw) {
                for (auto* b : curr->books) {
                    if (b && seenBookIds.find(b->book_id) == seenBookIds.end()) {
                        seenBookIds.insert(b->book_id);
                        matchedBooks.push_back(b);
                    }
                }
                break;
            }
            curr = curr->next;
        }
    }

    // 2. Neu la chuoi con hoac chua tim thay qua tu don, quet tren tap cac token da danh chi muc
    if (matchedBooks.empty() && !targetKw.empty()) {
        for (size_t i = 0; i < table.size(); ++i) {
            TitleHashNode* curr = table[i];
            while (curr != nullptr) {
                checks++;
                if (curr->word.find(targetKw) != string::npos) {
                    for (auto* b : curr->books) {
                        if (b && seenBookIds.find(b->book_id) == seenBookIds.end()) {
                            seenBookIds.insert(b->book_id);
                            matchedBooks.push_back(b);
                        }
                    }
                }
                curr = curr->next;
            }
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return TitleSearchResult(matchedBooks, durationNs, checks, "Title Inverted Hash Index", "O(1 + k) average");
}
