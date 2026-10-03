#include "../../../include/core/rq2/LinearOverdueScan.h"
#include "../../../include/utils/DateUtils.h"
#include <chrono>

using namespace std;

OverdueResult LinearOverdueScan::search(vector<BorrowRecord>& records, const string& currentDate) {
    long long checks = 0;
    auto start = chrono::high_resolution_clock::now();

    vector<BorrowRecord> overdueList;
    if (DateUtils::isValidDate(currentDate)) {
        for (size_t i = 0; i < records.size(); ++i) {
            checks++;
            // Phieu muon qua han neu dang muon (chua tra) va han tra nho hon ngay kiem tra hien tai
            if (records[i].status == "BORROWING" && DateUtils::isValidDate(records[i].due_date)) {
                if (DateUtils::daysBetween(records[i].due_date, currentDate) > 0) {
                    overdueList.push_back(records[i]);
                }
            }
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return OverdueResult(overdueList, !overdueList.empty(), durationNs, checks, "Linear Scan", "O(n)");
}
