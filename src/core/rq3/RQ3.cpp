#include "../../../include/core/rq3/RQ3.h"
#include <iostream>
#include <iomanip>
#include <algorithm>

using namespace std;

RQ3::RQ3(vector<Book>& bookList)
    : books(bookList) {}

void RQ3::build() {
    finalSolution.build(books);
}

bool RQ3::sameResultSet(const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes) {
    if (baselineRes.books.size() != finalSolRes.books.size()) {
        return false;
    }

    vector<string> baseIds;
    vector<string> finalIds;

    for (const auto& b : baselineRes.books) {
        baseIds.push_back(b.book_id);
    }
    for (const auto& b : finalSolRes.books) {
        finalIds.push_back(b.book_id);
    }

    sort(baseIds.begin(), baseIds.end());
    sort(finalIds.begin(), finalIds.end());

    return baseIds == finalIds;
}

void RQ3::printComparison(size_t datasetSize, const string& keyword, const TitleSearchResult& baselineRes, const TitleSearchResult& finalSolRes) {
    bool isSame = sameResultSet(baselineRes, finalSolRes);

    cout << "==============================================================================================\n";
    cout << "                         RQ3: SO SANH THUAT TOAN TIM KIEM THEO TU KHOA                        \n";
    cout << "==============================================================================================\n\n";

    cout << "  * Tu khoa can tim : \"" << keyword << "\" (Tong so sach trong he thong: " << datasetSize << ")\n\n";

    // Bang so sanh chi tiet
    cout << "+--------------------------+------------------------------+----------------------------------+\n";
    cout << "| " << left << setw(24) << "Tieu chi so sanh" 
         << " | " << left << setw(28) << "Baseline (Linear Title Scan)" 
         << " | " << left << setw(32) << "Final (Prefix Title Index)" << " |\n";
    cout << "+--------------------------+------------------------------+----------------------------------+\n";

    // Hang 1: So ket qua
    cout << "| " << left << setw(24) << "So sach tim thay (Count)" 
         << " | " << left << setw(28) << baselineRes.books.size() 
         << " | " << left << setw(32) << finalSolRes.books.size() << " |\n";

    // Hang 2: Thoi gian
    string baseTime = to_string(baselineRes.executionTime) + " ns";
    string finalTime = to_string(finalSolRes.executionTime) + " ns";
    cout << "| " << left << setw(24) << "Thoi gian thuc thi" 
         << " | " << left << setw(28) << baseTime 
         << " | " << left << setw(32) << finalTime << " |\n";

    // Hang 3: So sach da quet
    cout << "| " << left << setw(24) << "Checks / Tokens Visited" 
         << " | " << left << setw(28) << baselineRes.booksChecked 
         << " | " << left << setw(32) << finalSolRes.booksChecked << " |\n";

    // Hang 4: Big-O
    cout << "| " << left << setw(24) << "Do phuc tap (Big-O)" 
         << " | " << left << setw(28) << baselineRes.bigO 
         << " | " << left << setw(32) << finalSolRes.bigO << " |\n";

    cout << "+--------------------------+------------------------------+----------------------------------+\n";

    // Hang Kiem dinh
    string valText = isSame ? "PASS (Tap ket qua 2 thuat toan hoan toan dong nhat)" : "FAIL (Ket qua khac nhau)";
    cout << "| " << left << setw(24) << "Kiem dinh (Validation)" 
         << " | " << left << setw(63) << valText << " |\n";
    cout << "+--------------------------+-----------------------------------------------------------------+\n";
}

void RQ3::printBooks(const vector<Book>& bookList) {
    if (bookList.empty()) {
        cout << "  [!] Khong tim thay cuon sach nao khop voi tu khoa.\n";
        return;
    }

    cout << "+-----+---------+----------------------------+------------------+--------------+------+-------+\n";
    cout << "| STT | Ma sach | Ten sach                   | Tac gia          | The loai     | Nam  | San co|\n";
    cout << "+-----+---------+----------------------------+------------------+--------------+------+-------+\n";
    for (size_t i = 0; i < bookList.size(); ++i) {
        const auto& b = bookList[i];
        string titleShort = b.title.length() > 26 ? b.title.substr(0, 23) + "..." : b.title;
        string authorShort = b.author.length() > 16 ? b.author.substr(0, 13) + "..." : b.author;
        string catShort = b.category.length() > 12 ? b.category.substr(0, 9) + "..." : b.category;
        string qtyStr = to_string(b.available_quantity) + "/" + to_string(b.total_quantity);

        cout << "| " << left << setw(3) << (i + 1)
             << " | " << left << setw(7) << b.book_id
             << " | " << left << setw(26) << titleShort
             << " | " << left << setw(16) << authorShort
             << " | " << left << setw(12) << catShort
             << " | " << left << setw(4) << b.published_year
             << " | " << left << setw(5) << qtyStr << " |\n";
    }
    cout << "+-----+---------+----------------------------+------------------+--------------+------+-------+\n";
}

void RQ3::comparisonMode(const string& keyword) {
    TitleSearchResult baselineRes = LinearTitleScan::search(books, keyword);
    TitleSearchResult finalSolRes = finalSolution.search(keyword);
    printComparison(books.size(), keyword, baselineRes, finalSolRes);

    cout << "\n";
    printBooks(finalSolRes.books);
}

void RQ3::normalMode(const string& keyword) {
    cout << "==============================================================================================\n";
    cout << "               RQ3: TIM SACH THEO TU KHOA (PREFIX TITLE INDEX)                                  \n";
    cout << "==============================================================================================\n\n";

    TitleSearchResult finalSolRes = finalSolution.search(keyword);
    cout << "  * Tu khoa can tim : \"" << keyword << "\"\n";
    cout << "  * Thoi gian       : " << finalSolRes.executionTime << " ns (Checks / Tokens: " << finalSolRes.booksChecked << ")\n";
    cout << "  * So sach tim thay: " << finalSolRes.books.size() << "\n\n";

    printBooks(finalSolRes.books);
}
