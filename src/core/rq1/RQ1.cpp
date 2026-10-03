#include "../../../include/core/rq1/RQ1.h"
#include <iostream>
#include <iomanip>
#include <algorithm>

using namespace std;

RQ1::RQ1(vector<Book>& bookList) : books(bookList) {}

void RQ1::build() {
    finalSolution.build(books);
}

CategoryHashTable& RQ1::getCategoryTable() {
    return finalSolution;
}

bool RQ1::sameResultSet(const CategoryResult& baselineRes, const CategoryResult& finalSolRes) {
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

void RQ1::printComparison(size_t datasetSize, const string& category, const CategoryResult& baselineRes, const CategoryResult& finalSolRes) {
    bool isSame = sameResultSet(baselineRes, finalSolRes);

    cout << "==============================================================================================\n";
    cout << "                         RQ1: SO SANH THUAT TOAN TRA CUU THEO THE LOAI                        \n";
    cout << "==============================================================================================\n\n";

    cout << "  * The loai tra cuu: " << category << " (Tong so sach trong he thong: " << datasetSize << ")\n\n";

    // Bang so sanh chi tiet
    cout << "+--------------------------+------------------------------+----------------------------------+\n";
    cout << "| " << left << setw(24) << "Tieu chi so sanh" 
         << " | " << left << setw(28) << "Baseline (Linear Scan)" 
         << " | " << left << setw(32) << "Final Solution (Category Hash)" << " |\n";
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

    // Hang 3: So lan so sanh key
    cout << "| " << left << setw(24) << "So lan so sanh / Buoc" 
         << " | " << left << setw(28) << baselineRes.comparisons 
         << " | " << left << setw(32) << finalSolRes.comparisons << " |\n";

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

void RQ1::printBooks(const vector<Book>& bookList) {
    if (bookList.empty()) {
        cout << "  [!] Khong tim thay cuon sach nao thuoc the loai nay.\n";
        return;
    }

    cout << "+-----+---------+---------------------------------+--------------------+------+---------+\n";
    cout << "| STT | Ma sach | Ten sach                        | Tac gia            | Nam  | San co  |\n";
    cout << "+-----+---------+---------------------------------+--------------------+------+---------+\n";
    for (size_t i = 0; i < bookList.size(); ++i) {
        const auto& b = bookList[i];
        string titleShort = b.title.length() > 31 ? b.title.substr(0, 28) + "..." : b.title;
        string authorShort = b.author.length() > 18 ? b.author.substr(0, 15) + "..." : b.author;
        string qtyStr = to_string(b.available_quantity) + "/" + to_string(b.total_quantity);

        cout << "| " << left << setw(3) << (i + 1)
             << " | " << left << setw(7) << b.book_id
             << " | " << left << setw(31) << titleShort
             << " | " << left << setw(18) << authorShort
             << " | " << left << setw(4) << b.published_year
             << " | " << left << setw(7) << qtyStr << " |\n";
    }
    cout << "+-----+---------+---------------------------------+--------------------+------+---------+\n";
}

void RQ1::comparisonMode(const string& category) {
    CategoryResult baselineRes = LinearCategoryScan::search(books, category);
    CategoryResult finalSolRes = finalSolution.search(category);
    printComparison(books.size(), category, baselineRes, finalSolRes);

    cout << "\n";
    printBooks(finalSolRes.books);
}

void RQ1::normalMode(const string& category) {
    cout << "==============================================================================================\n";
    cout << "                    RQ1: TRA CUU SACH THEO THE LOAI (CATEGORY HASH)                           \n";
    cout << "==============================================================================================\n\n";

    CategoryResult finalSolRes = finalSolution.search(category);
    cout << "  * The loai can tim : " << category << "\n";
    cout << "  * Thoi gian tra cuu: " << finalSolRes.executionTime << " ns\n\n";

    printBooks(finalSolRes.books);
}
