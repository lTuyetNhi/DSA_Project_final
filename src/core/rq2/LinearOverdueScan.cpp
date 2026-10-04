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
            if (records[i].isBorrowing() && records[i].due_date < currentDate) {
                overdueList.push_back(records[i]);
            }
        }
    }

    auto end = chrono::high_resolution_clock::now();
    long long durationNs = chrono::duration_cast<chrono::nanoseconds>(end - start).count();

    return OverdueResult(overdueList, !overdueList.empty(), durationNs, checks, "Linear Scan", "O(n)");
}

size_t LinearOverdueScan::count(const vector<BorrowRecord>& records, const string& currentDate, long long* checks) {
    if (checks) *checks = 0;
    if (!DateUtils::isValidDate(currentDate)) return 0;
    size_t total = 0;
    for (const auto& record : records) {
        if (checks) ++(*checks);
        // Valid ISO YYYY-MM-DD strings sort in chronological order. Input is
        // validated during loading/index construction, so no per-row parsing.
        if (record.isBorrowing() && record.due_date < currentDate) ++total;
    }
    return total;
}
