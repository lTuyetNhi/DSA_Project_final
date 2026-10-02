#include "../../../include/core/mc2/MC2.h"
#include <iostream>
#include <iomanip>

using namespace std;

MC2::MC2(vector<Book>& bookList) : books(bookList) {}

void MC2::build() {
    finalSolution.build(books);
}

bool MC2::sameResult(const MaxResult& baselineRes, const MaxResult& finalSolRes) {
    if (baselineRes.book == nullptr && finalSolRes.book == nullptr) {
        return true;
    }
    if (baselineRes.book != nullptr && finalSolRes.book != nullptr) {
        return (baselineRes.book->book_id == finalSolRes.book->book_id) &&
               (baselineRes.book->borrow_count == finalSolRes.book->borrow_count);
    }
    return false;
}

void MC2::printComparison(size_t datasetSize, const MaxResult& baselineRes, const MaxResult& finalSolRes) {
    bool isSame = sameResult(baselineRes, finalSolRes);

    cout << "==============================================================================================\n";
    cout << "                         MC2: SO SANH THUAT TOAN TIM SACH MUON NHIEU NHAT                      \n";
    cout << "==============================================================================================\n\n";

    cout << "  * Tong so sach trong he thong: " << datasetSize << "\n\n";

    // Bang so sanh chi tiet can le chinh xac
    cout << "+--------------------------+------------------------------+----------------------------------+\n";
    cout << "| " << left << setw(24) << "Tieu chi so sanh" 
         << " | " << left << setw(28) << "Baseline (Linear Max Scan)" 
         << " | " << left << setw(32) << "Final Solution (Max-Heap)" << " |\n";
    cout << "+--------------------------+------------------------------+----------------------------------+\n";

    // Hang 1: Ma sach
    string baseBookId = baselineRes.book ? baselineRes.book->book_id : "NULL";
    string finalBookId = finalSolRes.book ? finalSolRes.book->book_id : "NULL";
    cout << "| " << left << setw(24) << "Ma sach (Result)" 
         << " | " << left << setw(28) << baseBookId 
         << " | " << left << setw(32) << finalBookId << " |\n";

    // Hang 2: So luot muon
    string baseBorrow = baselineRes.book ? to_string(baselineRes.book->borrow_count) : "0";
    string finalBorrow = finalSolRes.book ? to_string(finalSolRes.book->borrow_count) : "0";
    cout << "| " << left << setw(24) << "So luot muon (Max Count)" 
         << " | " << left << setw(28) << baseBorrow 
         << " | " << left << setw(32) << finalBorrow << " |\n";

    // Hang 3: Thoi gian thuc thi
    string baseTime = to_string(baselineRes.executionTime) + " ns";
    string finalTime = to_string(finalSolRes.executionTime) + " ns";
    cout << "| " << left << setw(24) << "Thoi gian thuc thi" 
         << " | " << left << setw(28) << baseTime 
         << " | " << left << setw(32) << finalTime << " |\n";

    // Hang 4: So lan so sanh / buoc
    cout << "| " << left << setw(24) << "So lan so sanh / Buoc" 
         << " | " << left << setw(28) << baselineRes.comparisons 
         << " | " << left << setw(32) << finalSolRes.comparisons << " |\n";

    // Hang 5: Do phuc tap Big-O
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

void MC2::printBook(const Book* book) {
    if (!book) {
        cout << "  [!] Khong co sach nao trong he thong.\n";
        return;
    }
    cout << "+--------------------------------------------------------------------------------------------+\n";
    cout << "|                          THONG TIN TAI LIEU DUOC MUON NHIEU NHAT                           |\n";
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

void MC2::comparisonMode() {
    MaxResult baselineRes = LinearMaxScan::findMax(books);
    MaxResult finalSolRes = finalSolution.getMax();
    printComparison(books.size(), baselineRes, finalSolRes);

    cout << "\n";
    if (finalSolRes.book) {
        printBook(finalSolRes.book);
    }
}

void MC2::normalMode() {
    cout << "==============================================================================================\n";
    cout << "                     MC2: TIM SACH DUOC MUON NHIEU NHAT (MAX-HEAP)                           \n";
    cout << "==============================================================================================\n\n";

    MaxResult finalSolRes = finalSolution.getMax();
    cout << "  * Thoi gian tim : " << finalSolRes.executionTime << " ns (So buoc: " << finalSolRes.comparisons << ")\n\n";

    if (finalSolRes.book) {
        printBook(finalSolRes.book);
    } else {
        cout << "  [!] Khong co sach nao trong he thong.\n";
    }
}

void MC2::updateComparisonMode(const string& bookId, int newCount) {
    // 1. Update dataset & baseline
    for (auto& b : books) {
        if (b.book_id == bookId) {
            b.borrow_count = newCount;
            break;
        }
    }
    // 2. Update Heap
    finalSolution.updateBorrowCount(bookId, newCount);

    // 3. Re-run comparison
    comparisonMode();
}
