#include "../../../include/core/mc1/MC1.h"
#include <iostream>
#include <iomanip>

using namespace std;

MC1::MC1(vector<Book>& bookList) : books(bookList), finalSolution(10007) {}

void MC1::build() {
    finalSolution.clear();
    for (auto& b : books) {
        finalSolution.insert(b.book_id, &b);
    }
}

bool MC1::sameResult(const SearchResult& baselineRes, const SearchResult& finalSolRes) {
    if (baselineRes.book == nullptr && finalSolRes.book == nullptr) {
        return true;
    }
    if (baselineRes.book != nullptr && finalSolRes.book != nullptr) {
        return baselineRes.book->book_id == finalSolRes.book->book_id;
    }
    return false;
}

void MC1::printComparison(const string& bookId, const SearchResult& baselineRes, const SearchResult& finalSolRes) {
    bool isSame = sameResult(baselineRes, finalSolRes);

    cout << "==============================================================================================\n";
    cout << "                             MC1: SO SANH 2 THUAT TOAN TRA CUU                                \n";
    cout << "==============================================================================================\n\n";

    cout << "  * Ma sach tra cuu: " << bookId << "\n\n";

    // Bang so sanh duoc can le chinh xac 100%
    cout << "+--------------------------+------------------------------+----------------------------------+\n";
    cout << "| " << left << setw(24) << "Tieu chi so sanh" 
         << " | " << left << setw(28) << "Baseline (Linear Search)" 
         << " | " << left << setw(32) << "Final Solution (Hash Table)" << " |\n";
    cout << "+--------------------------+------------------------------+----------------------------------+\n";

    // Hang 1: Ket qua
    cout << "| " << left << setw(24) << "Ket qua tim kiem" 
         << " | " << left << setw(28) << (baselineRes.book ? "FOUND" : "NOT FOUND")
         << " | " << left << setw(32) << (finalSolRes.book ? "FOUND" : "NOT FOUND") << " |\n";

    // Hang 2: Thoi gian
    string baseTime = to_string(baselineRes.executionTime) + " ns";
    string finalTime = to_string(finalSolRes.executionTime) + " ns";
    cout << "| " << left << setw(24) << "Thoi gian thuc thi" 
         << " | " << left << setw(28) << baseTime 
         << " | " << left << setw(32) << finalTime << " |\n";

    // Hang 3: So lan so sanh
    cout << "| " << left << setw(24) << "So lan so sanh key" 
         << " | " << left << setw(28) << baselineRes.comparisons 
         << " | " << left << setw(32) << finalSolRes.comparisons << " |\n";

    // Hang 4: Big-O
    cout << "| " << left << setw(24) << "Do phuc tap (Big-O)" 
         << " | " << left << setw(28) << baselineRes.bigO 
         << " | " << left << setw(32) << finalSolRes.bigO << " |\n";

    cout << "+--------------------------+------------------------------+----------------------------------+\n";

    // Hang Kiem dinh
    string valText = isSame ? "PASS (Ket qua 2 thuat toan hoan toan dong nhat)" : "FAIL (Ket qua khac nhau)";
    cout << "| " << left << setw(24) << "Kiem dinh (Validation)" 
         << " | " << left << setw(63) << valText << " |\n";
    cout << "+--------------------------+-----------------------------------------------------------------+\n";
}

void MC1::printBook(const Book* book) {
    if (!book) {
        cout << "  [!] Khong tim thay sach trong he thong.\n";
        return;
    }
    cout << "+--------------------------------------------------------------------------------------------+\n";
    cout << "|                              THONG TIN TAI LIEU TIM THAY                                   |\n";
    cout << "+--------------------------------------------------------------------------------------------+\n";
    cout << "  [+] Ma sach        : " << book->book_id << "\n";
    cout << "  [+] Ten sach       : " << book->title << "\n";
    cout << "  [+] Tac gia        : " << book->author << "\n";
    cout << "  [+] The loai       : " << book->category << "\n";
    cout << "  [+] Nam xuat ban   : " << book->published_year << "\n";
    cout << "  [+] So luong       : " << book->available_quantity << " / " << book->total_quantity << " (San co / Tong)\n";
    cout << "  [+] Luot da muon   : " << book->borrow_count << "\n";
    cout << "+--------------------------------------------------------------------------------------------+\n";
}

void MC1::comparisonMode(const string& bookId) {
    SearchResult baselineRes = LinearSearch::search(books, bookId);
    SearchResult finalSolRes = finalSolution.search(bookId);
    printComparison(bookId, baselineRes, finalSolRes);

    cout << "\n";
    if (finalSolRes.book) {
        printBook(finalSolRes.book);
    } else {
        cout << "  [!] Ket qua: Khong tim thay tai lieu voi Ma sach '" << bookId << "' trong he thong.\n";
    }
}

void MC1::normalMode(const string& bookId) {
    cout << "==============================================================================================\n";
    cout << "                               MC1: TRA CUU SACH (HASH TABLE)                                 \n";
    cout << "==============================================================================================\n\n";

    SearchResult finalSolRes = finalSolution.search(bookId);
    cout << "  * Ma sach can tim : " << bookId << "\n";
    cout << "  * Thoi gian tim   : " << finalSolRes.executionTime << " ns (So phep so sanh: " << finalSolRes.comparisons << ")\n\n";

    if (finalSolRes.book) {
        printBook(finalSolRes.book);
    } else {
        cout << "  [!] Ket qua: Khong tim thay tai lieu voi Ma sach '" << bookId << "' trong he thong.\n";
    }
}
