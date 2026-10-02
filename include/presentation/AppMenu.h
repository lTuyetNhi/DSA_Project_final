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

enum AppMode {
    BENCHMARK_MODE = 1,
    NORMAL_MODE = 2
};

class AppMenu {
private:
    MC1& mc1;
    MC2& mc2;
    RQ1& rq1;
    RQ2& rq2;
    RQ3& rq3;
    AppMode currentMode;

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

public:
    AppMenu(MC1& m1, MC2& m2, RQ1& r1, RQ2& r2, RQ3& r3);
    void run();
};

#endif // APP_MENU_H
