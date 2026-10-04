#ifndef APP_MENU_H
#define APP_MENU_H

#include <vector>
#include <string>
#include "../core/mc1/MC1.h"
#include "../core/mc2/MC2.h"
#include "../core/rq1/RQ1.h"
#include "../core/rq2/RQ2.h"
#include "../core/rq3/RQ3.h"

using namespace std;

// 2 chế độ chính của chương trình
enum AppMode {
    BENCHMARK_MODE = 1, // So sánh hiệu năng giữa thuật toán cơ sở và thuật toán tối ưu
    NORMAL_MODE = 2     // Chạy bình thường chỉ dùng thuật toán tối ưu
};

// Giao diện dòng lệnh tương tác (Terminal UI với phím mũi tên và Esc)
class AppMenu {
private:
    MC1& mc1;
    MC2& mc2;
    RQ1& rq1;
    RQ2& rq2;
    RQ3& rq3;
    AppMode currentMode;

    // Các hàm vẽ menu và nhận phím điều hướng
    int selectMenu(const vector<string>& options, const string& title, const string& subtitle = "");
    string selectDate(const string& title, int defaultYear = 2026, int defaultMonth = 10, int defaultDay = 2);
    string readLineWithEsc(const string& prompt, bool& cancelled);

    int showModeMenu();
    int showModuleMenu();

    bool runMC1();
    bool runMC2();
    bool runRQ1();
    bool runRQ2();
    bool runRQ3();
    bool runFullBenchmark(); // Chạy benchmark tự động cho cả 5 bài toán và xuất báo cáo

public:
    AppMenu(MC1& m1, MC2& m2, RQ1& r1, RQ2& r2, RQ3& r3);
    void run(); // Vòng lặp chính điều phối toàn bộ ứng dụng
};

#endif // APP_MENU_H
