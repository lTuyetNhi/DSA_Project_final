#include "../../../include/core/rq2/RQ2.h"
#include "../../../include/utils/DateUtils.h"
#include <iostream>
#include <iomanip>
#include <algorithm>

using namespace std;

RQ2::RQ2(vector<BorrowRecord>& recordList) : records(recordList) {}

void RQ2::build() {
    finalSolution.build(records);
}

bool RQ2::sameResultSet(const OverdueResult& baselineRes, const OverdueResult& finalSolRes) {
    if (baselineRes.records.size() != finalSolRes.records.size()) {
        return false;
    }

    vector<string> baseIds;
    vector<string> finalIds;

    for (const auto& r : baselineRes.records) {
        baseIds.push_back(r.borrow_id);
    }
    for (const auto& r : finalSolRes.records) {
        finalIds.push_back(r.borrow_id);
    }

    sort(baseIds.begin(), baseIds.end());
    sort(finalIds.begin(), finalIds.end());

    return baseIds == finalIds;
}

void RQ2::printComparison(size_t datasetSize, const string& currentDate, const OverdueResult& baselineRes, const OverdueResult& finalSolRes) {
    bool isSame = sameResultSet(baselineRes, finalSolRes);

    cout << "==============================================================================================\n";
    cout << "                         RQ2: SO SANH THUAT TOAN LOC PHIEU MUON QUA HAN                       \n";
    cout << "==============================================================================================\n\n";

    if (!DateUtils::isValidDate(currentDate)) {
        cout << "  [!] Ngay kiem tra '" << currentDate << "' khong hop le (Dinh dang chuan: YYYY-MM-DD).\n";
        cout << "==============================================================================================\n";
        return;
    }

    cout << "  * Ngay hien tai kiem tra : " << currentDate << " (Tong so phieu muon: " << datasetSize << ")\n\n";

    // Bang so sanh chi tiet
    cout << "+--------------------------+------------------------------+----------------------------------+\n";
    cout << "| " << left << setw(24) << "Tieu chi so sanh" 
         << " | " << left << setw(28) << "Baseline (Linear Scan)" 
         << " | " << left << setw(32) << "Final Solution (AVL Tree)" << " |\n";
    cout << "+--------------------------+------------------------------+----------------------------------+\n";

    // Hang 1: So ket qua
    cout << "| " << left << setw(24) << "So phieu qua han (Count)" 
         << " | " << left << setw(28) << baselineRes.records.size() 
         << " | " << left << setw(32) << finalSolRes.records.size() << " |\n";

    // Hang 2: Thoi gian
    string baseTime = to_string(baselineRes.executionTime) + " ns";
    string finalTime = to_string(finalSolRes.executionTime) + " ns";
    cout << "| " << left << setw(24) << "Thoi gian thuc thi" 
         << " | " << left << setw(28) << baseTime 
         << " | " << left << setw(32) << finalTime << " |\n";

    // Hang 3: So phep kiem tra / Node visited
    cout << "| " << left << setw(24) << "Checks / Nodes Visited" 
         << " | " << left << setw(28) << baselineRes.checks 
         << " | " << left << setw(32) << finalSolRes.checks << " |\n";

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

void RQ2::printRecords(const vector<BorrowRecord>& recordList) {
    if (recordList.empty()) {
        cout << "  [i] Khong co phieu muon nao bi qua han tai moc thoi gian nay.\n";
        return;
    }

    cout << "+-----+------------+-----------+---------+------------+------------+-------------------------+\n";
    cout << "| STT | Ma phieu   | Doc gia   | Ma sach | Ngay muon  | Han tra    | Tinh trang              |\n";
    cout << "+-----+------------+-----------+---------+------------+------------+-------------------------+\n";
    for (size_t i = 0; i < recordList.size(); ++i) {
        const auto& r = recordList[i];
        cout << "| " << left << setw(3) << (i + 1)
             << " | " << left << setw(10) << r.borrow_id
             << " | " << left << setw(9) << r.reader_id
             << " | " << left << setw(7) << r.book_id
             << " | " << left << setw(10) << r.borrow_date
             << " | " << left << setw(10) << r.due_date
             << " | " << left << setw(23) << "Qua han (BORROWING)" << " |\n";
    }
    cout << "+-----+------------+-----------+---------+------------+------------+-------------------------+\n";
}

void RQ2::comparisonMode(const string& currentDate) {
    OverdueResult baselineRes = baseline.search(records, currentDate);
    OverdueResult finalSolRes = finalSolution.findOverdue(currentDate);
    printComparison(records.size(), currentDate, baselineRes, finalSolRes);

    cout << "\n";
    printRecords(finalSolRes.records);
}

void RQ2::normalMode(const string& currentDate) {
    cout << "==============================================================================================\n";
    cout << "                   RQ2: LOC PHIEU MUON QUA HAN (AVL TREE RANGE QUERY)                         \n";
    cout << "==============================================================================================\n\n";

    if (!DateUtils::isValidDate(currentDate)) {
        cout << "  [!] Ngay kiem tra '" << currentDate << "' khong hop le (Dinh dang chuan: YYYY-MM-DD).\n";
        return;
    }

    OverdueResult finalSolRes = finalSolution.findOverdue(currentDate);
    cout << "  * Ngay hien tai kiem tra : " << currentDate << "\n";
    cout << "  * Thoi gian thuc thi     : " << finalSolRes.executionTime << " ns (Nodes da duyet: " << finalSolRes.checks << ")\n";
    cout << "  * So phieu qua han       : " << finalSolRes.records.size() << "\n\n";

    printRecords(finalSolRes.records);
}
