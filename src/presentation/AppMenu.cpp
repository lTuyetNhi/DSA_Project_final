#include "../../include/presentation/AppMenu.h"
#include "../../include/utils/DateUtils.h"
#include "../../include/utils/BenchmarkRunner.h"
#include <iostream>
#include <iomanip>
#include <cstdlib>
#include <conio.h>

using namespace std;

AppMenu::AppMenu(MC1& m1, MC2& m2, RQ1& r1, RQ2& r2, RQ3& r3)
    : mc1(m1), mc2(m2), rq1(r1), rq2(r2), rq3(r3), currentMode(BENCHMARK_MODE) {}

int AppMenu::selectMenu(const vector<string>& options, const string& title, const string& subtitle) {
    int selected = 0;
    int n = static_cast<int>(options.size());

    while (true) {
        system("cls");

        // Header
        cout << "======================================================================\n";
        cout << "   " << title << "\n";
        cout << "======================================================================\n";
        if (!subtitle.empty()) {
            cout << " " << subtitle << "\n";
            cout << "----------------------------------------------------------------------\n";
        }
        cout << "\n";

        // Danh sach lua chon
        for (int i = 0; i < n; ++i) {
            if (i == selected) {
                cout << "  -> " << options[i] << "\n";
            } else {
                cout << "     " << options[i] << "\n";
            }
        }

        // Footer huong dan
        cout << "\n======================================================================\n";
        cout << " [^/v] Di chuyen   [Enter] Chon   [Esc] Quay lai\n";
        cout << "======================================================================\n";

        int key = _getch();
        if (key == 0 || key == 224) {
            key = _getch();
            if (key == 72) { // Mui ten LEN
                selected = (selected - 1 + n) % n;
            } else if (key == 80) { // Mui ten XUONG
                selected = (selected + 1) % n;
            }
        } else if (key == 'w' || key == 'W') {
            selected = (selected - 1 + n) % n;
        } else if (key == 's' || key == 'S') {
            selected = (selected + 1) % n;
        } else if (key == 13) { // ENTER
            return selected;
        } else if (key == 27 || key == '0') { // ESC hoac phim 0 -> Lua chon cuoi cung (Exit / Back)
            return n - 1;
        }
    }
}

string AppMenu::readLineWithEsc(const string& prompt, bool& cancelled) {
    cancelled = false;
    cout << prompt;
    string input = "";

    while (true) {
        int ch = _getch();

        // Nhan phim ESC bat ky luc nao -> Huy bo ngay lap tuc
        if (ch == 27) {
            cancelled = true;
            cout << "\n";
            return "";
        }

        // Nhan phim ENTER -> Hoan tat nhap
        if (ch == 13) {
            cout << "\n";
            return input;
        }

        // Phim BACKSPACE
        if (ch == 8) {
            if (!input.empty()) {
                input.pop_back();
                cout << "\b \b";
            }
        } else if (ch == 0 || ch == 224) {
            // Extended keys (arrows, function keys)
            int ext = _getch();
            if (ext == 27) {
                cancelled = true;
                cout << "\n";
                return "";
            }
        } else if (ch >= 32 && ch <= 126) {
            // Ky tu hop le
            input += static_cast<char>(ch);
            cout << static_cast<char>(ch);
        }
    }
}

string AppMenu::selectDate(const string& title, int defaultYear, int defaultMonth, int defaultDay) {
    int year = defaultYear;
    int month = defaultMonth;
    int day = defaultDay;
    int curField = 0; // 0: Nam, 1: Thang, 2: Ngay

    while (true) {
        system("cls");

        // Header
        cout << "======================================================================\n";
        cout << "   " << title << "\n";
        cout << "======================================================================\n\n";

        cout << " [i] Huong dan chon ngay kiem tra:\n";
        cout << "     - Dung phim [< / >] (Trai / Phai) de chuyen giua Nam, Thang, Ngay.\n";
        cout << "     - Dung phim [^ / v] (Len / Xuong)  de Tang / Giam gia tri.\n";
        cout << "     - Nhan [Enter] de Xac nhan, [Esc] de Quay lai Menu.\n";
        cout << "----------------------------------------------------------------------\n\n";

        // Validate max day in month
        int maxDays = DateUtils::getDaysInMonth(year, month);
        if (day > maxDays) day = maxDays;

        cout << "                     [ NAM ]         [ THANG ]         [ NGAY ]\n";
        cout << "                 ";

        // Field 0: Nam
        if (curField == 0) {
            cout << "  > [ " << setw(4) << year << " ] <     ";
        } else {
            cout << "    [ " << setw(4) << year << " ]       ";
        }

        // Field 1: Thang
        if (curField == 1) {
            cout << "> [ " << setfill('0') << setw(2) << month << " ] <       " << setfill(' ');
        } else {
            cout << "  [ " << setfill('0') << setw(2) << month << " ]         " << setfill(' ');
        }

        // Field 2: Ngay
        if (curField == 2) {
            cout << "> [ " << setfill('0') << setw(2) << day << " ] <\n" << setfill(' ');
        } else {
            cout << "  [ " << setfill('0') << setw(2) << day << " ]\n" << setfill(' ');
        }

        char dateBuf[32];
        snprintf(dateBuf, sizeof(dateBuf), "%04d-%02d-%02d", year, month, day);

        cout << "\n----------------------------------------------------------------------\n";
        cout << "  => Ngay dang chon: " << dateBuf << "\n";
        cout << "======================================================================\n";
        cout << " [</>] Chon o   [^/v] Tang/Giam   [Enter] Xac nhan   [Esc] Quay lai\n";
        cout << "======================================================================\n";

        int key = _getch();
        if (key == 0 || key == 224) {
            key = _getch();
            if (key == 75) { // Mui ten TRAI
                curField = (curField - 1 + 3) % 3;
            } else if (key == 77) { // Mui ten PHAI
                curField = (curField + 1) % 3;
            } else if (key == 72) { // Mui ten LEN (Tang gia tri)
                if (curField == 0) {
                    year++;
                    if (year > 2035) year = 2020;
                } else if (curField == 1) {
                    month++;
                    if (month > 12) month = 1;
                } else if (curField == 2) {
                    day++;
                    if (day > DateUtils::getDaysInMonth(year, month)) day = 1;
                }
            } else if (key == 80) { // Mui ten XUONG (Giam gia tri)
                if (curField == 0) {
                    year--;
                    if (year < 2020) year = 2035;
                } else if (curField == 1) {
                    month--;
                    if (month < 1) month = 12;
                } else if (curField == 2) {
                    day--;
                    if (day < 1) day = DateUtils::getDaysInMonth(year, month);
                }
            }
        } else if (key == 'a' || key == 'A') {
            curField = (curField - 1 + 3) % 3;
        } else if (key == 'd' || key == 'D') {
            curField = (curField + 1) % 3;
        } else if (key == 'w' || key == 'W') {
            if (curField == 0) year++;
            else if (curField == 1) { month++; if (month > 12) month = 1; }
            else if (curField == 2) { day++; if (day > DateUtils::getDaysInMonth(year, month)) day = 1; }
        } else if (key == 's' || key == 'S') {
            if (curField == 0) year--;
            else if (curField == 1) { month--; if (month < 1) month = 12; }
            else if (curField == 2) { day--; if (day < 1) day = DateUtils::getDaysInMonth(year, month); }
        } else if (key == 13) { // ENTER
            return string(dateBuf);
        } else if (key == 27 || key == 'q' || key == 'Q') { // ESC -> Quay ve Menu
            return "";
        }
    }
}

int AppMenu::showModeMenu() {
    vector<string> modeOptions = {
        "1. Benchmark Mode  (So sanh hieu nang Baseline vs Final Solution)",
        "2. Normal Mode     (Van hanh thuc te - Chi su dung Final Solution)",
        "0. Exit            (Thoat chuong trinh)"
    };
    string badge = "[ HE THONG QUAN LY THU VIEN & MUON TRA TAI LIEU ]";
    int choice = selectMenu(modeOptions, "LIBRARY MANAGEMENT SYSTEM - CHON CHE DO HOAT DONG", badge);
    if (choice == 0) return 1; // Benchmark
    if (choice == 1) return 2; // Normal
    return 0; // Exit
}

int AppMenu::showModuleMenu() {
    string modeStr;
    if (currentMode == BENCHMARK_MODE) {
        modeStr = "Che do hien tai: [ BENCHMARK MODE - SO SANH THUAT TOAN ]";
    } else {
        modeStr = "Che do hien tai: [ NORMAL MODE - TRA CUU NHANH ]";
    }

    vector<string> moduleOptions = {
        "1. MC1 - Tra cuu chinh xac sach theo Book ID (Hash Table vs Linear Search)",
        "2. MC2 - Tim sach co luot muon cao nhat (Max-Heap vs Linear Max Scan)",
        "3. RQ1 - Tra cuu tat ca sach theo The loai (Category Hash Table vs Linear Scan)",
        "4. RQ2 - Loc danh sach phieu muon qua han (AVL Tree vs Linear Scan)",
        "5. RQ3 - Tim kiem sach theo Tu khoa / Ten sach (Inverted Hash vs Linear Scan)",
        "6. Chay Benchmark Toan Dien (5 Module) & Xuat CSV/LaTeX",
        "9. Doi Che do hoat dong (Change Mode)",
        "0. Thoat chuong trinh (Exit)"
    };

    int choice = selectMenu(moduleOptions, "DANH MUC MODULE CHUC NANG", modeStr);
    if (choice == 0) return 1;
    if (choice == 1) return 2;
    if (choice == 2) return 3;
    if (choice == 3) return 4;
    if (choice == 4) return 5;
    if (choice == 5) return 6;
    if (choice == 6) return 9;
    return 0;
}

bool AppMenu::runMC1() {
    system("cls");
    cout << "======================================================================\n";
    cout << "          MC1: TRA CUU CHINH XAC TAI LIEU THEO BOOK ID                \n";
    cout << "======================================================================\n\n";

    cout << " [i] Goi y mot so Ma sach co san: B001, B002, B003, B004, B007...\n";
    cout << " [i] Nhan phim [Esc] bat ky luc nao de Quay lai Menu.\n\n";

    bool cancelled = false;
    string bookId = readLineWithEsc(" [+] Nhap Book ID can tra cuu: ", cancelled);

    if (cancelled || bookId.empty()) {
        return false;
    }

    // Xoa sach man hinh de hien thi ket qua
    system("cls");

    if (currentMode == BENCHMARK_MODE) {
        mc1.comparisonMode(bookId);
    } else {
        mc1.normalMode(bookId);
    }
    return true;
}

bool AppMenu::runMC2() {
    system("cls");
    if (currentMode == BENCHMARK_MODE) {
        mc2.comparisonMode();
    } else {
        mc2.normalMode();
    }
    return true;
}

bool AppMenu::runRQ1() {
    system("cls");
    cout << "======================================================================\n";
    cout << "             RQ1: TRA CUU DANH SACH SACH THEO THE LOAI                \n";
    cout << "======================================================================\n\n";

    cout << " [i] Goi y the loai: Computer Science, Software Engineering, Database, Mathematics...\n";
    cout << " [i] Nhan phim [Esc] bat ky luc nao de Quay lai Menu.\n\n";

    bool cancelled = false;
    string category = readLineWithEsc(" [+] Nhap The loai can tim: ", cancelled);

    if (cancelled || category.empty()) {
        return false;
    }

    // Xoa sach man hinh de hien thi ket qua
    system("cls");

    if (currentMode == BENCHMARK_MODE) {
        rq1.comparisonMode(category);
    } else {
        rq1.normalMode(category);
    }
    return true;
}

bool AppMenu::runRQ2() {
    string currentDate = selectDate("RQ2: LOC DANH SACH PHIEU MUON QUA HAN (CHON NGAY)", 2026, 10, 2);
    if (currentDate.empty()) {
        return false; // User pressed Esc to back
    }

    system("cls");
    if (currentMode == BENCHMARK_MODE) {
        rq2.comparisonMode(currentDate);
    } else {
        rq2.normalMode(currentDate);
    }
    return true;
}

bool AppMenu::runRQ3() {
    system("cls");
    cout << "======================================================================\n";
    cout << "          RQ3: TIM KIEM TAI LIEU THEO TEN / TU KHOA                   \n";
    cout << "======================================================================\n\n";

    cout << " [i] Goi y tu khoa: data, clean, python, system, algorithms, code, design...\n";
    cout << " [i] Nhan phim [Esc] bat ky luc nao de Quay lai Menu.\n\n";

    bool cancelled = false;
    string keyword = readLineWithEsc(" [+] Nhap Ten sach hoac Tu khoa can tim: ", cancelled);

    if (cancelled || keyword.empty()) {
        return false;
    }

    // Xoa sach man hinh de hien thi ket qua
    system("cls");

    if (currentMode == BENCHMARK_MODE) {
        rq3.comparisonMode(keyword);
    } else {
        rq3.normalMode(keyword);
    }
    return true;
}

bool AppMenu::runFullBenchmark() {
    system("cls");
    cout << "======================================================================\n";
    cout << "       DANG CHAY BENCHMARK TU DONG CHO CA 5 MODULE (100 ITERATIONS)    \n";
    cout << "======================================================================\n";
    cout << " [*] Dang thu nghiem tren CPU hien tai...\n\n";

    vector<ModuleBenchmarkResult> results;
    int iterations = 100;
    int warmup = 5;

    // 1. MC1: Tra cuu ma sach
    string testBookId = mc1.getBooks().empty() ? "B004" : mc1.getBooks()[mc1.getBooks().size() / 2].book_id;
    auto r1Base = mc1.getBaseline().search(mc1.getBooks(), testBookId);
    auto r1Opt = mc1.getFinalSolution().search(testBookId);
    auto mc1Base = BenchmarkRunner::run("Linear Search", r1Base.comparisons, r1Base.found, [&]() { return mc1.getBaseline().search(mc1.getBooks(), testBookId); }, iterations, warmup);
    auto mc1Opt = BenchmarkRunner::run("Hash Table", r1Opt.comparisons, r1Opt.found, [&]() { return mc1.getFinalSolution().search(testBookId); }, iterations, warmup);
    double mc1Speedup = mc1Opt.avgTimeUs > 0 ? (mc1Base.avgTimeUs / mc1Opt.avgTimeUs) : 1.0;
    results.push_back(ModuleBenchmarkResult("MC1", "Tim book_id", static_cast<int>(mc1.getBooks().size()), mc1Base, mc1Opt, mc1Speedup));

    // 2. MC2: Tim sach muon nhieu nhat
    auto r2Base = mc2.getBaseline().findMax(mc2.getBooks());
    auto r2Opt = mc2.getFinalSolution().getMax();
    auto mc2Base = BenchmarkRunner::run("Linear Max Scan", r2Base.comparisons, r2Base.found, [&]() { return mc2.getBaseline().findMax(mc2.getBooks()); }, iterations, warmup);
    auto mc2Opt = BenchmarkRunner::run("Max-Heap", r2Opt.comparisons, r2Opt.found, [&]() { return mc2.getFinalSolution().getMax(); }, iterations, warmup);
    double mc2Speedup = mc2Opt.avgTimeUs > 0 ? (mc2Base.avgTimeUs / mc2Opt.avgTimeUs) : 1.0;
    results.push_back(ModuleBenchmarkResult("MC2", "Top Borrowed", static_cast<int>(mc2.getBooks().size()), mc2Base, mc2Opt, mc2Speedup));

    // 3. RQ1: Loc theo the loai
    string testCategory = "Computer Science";
    auto rq1BaseRes = rq1.getBaseline().search(rq1.getBooks(), testCategory);
    auto rq1OptRes = rq1.getFinalSolution().search(testCategory);
    auto rq1Base = BenchmarkRunner::run("Linear Scan", rq1BaseRes.comparisons, rq1BaseRes.found, [&]() { return rq1.getBaseline().search(rq1.getBooks(), testCategory); }, iterations, warmup);
    auto rq1Opt = BenchmarkRunner::run("Category Hash", rq1OptRes.comparisons, rq1OptRes.found, [&]() { return rq1.getFinalSolution().search(testCategory); }, iterations, warmup);
    double rq1Speedup = rq1Opt.avgTimeUs > 0 ? (rq1Base.avgTimeUs / rq1Opt.avgTimeUs) : 1.0;
    results.push_back(ModuleBenchmarkResult("RQ1", "Filter Category", static_cast<int>(rq1.getBooks().size()), rq1Base, rq1Opt, rq1Speedup));

    // 4. RQ2: Loc phieu muon qua han
    string testDate = "2026-10-02";
    auto rq2BaseRes = rq2.getBaseline().search(rq2.getRecords(), testDate);
    auto rq2OptRes = rq2.getFinalSolution().findOverdue(testDate);
    auto rq2Base = BenchmarkRunner::run("Linear Scan", rq2BaseRes.checks, rq2BaseRes.found, [&]() { return rq2.getBaseline().search(rq2.getRecords(), testDate); }, iterations, warmup);
    auto rq2Opt = BenchmarkRunner::run("AVL Tree", rq2OptRes.checks, rq2OptRes.found, [&]() { return rq2.getFinalSolution().findOverdue(testDate); }, iterations, warmup);
    double rq2Speedup = rq2Opt.avgTimeUs > 0 ? (rq2Base.avgTimeUs / rq2Opt.avgTimeUs) : 1.0;
    results.push_back(ModuleBenchmarkResult("RQ2", "Filter Overdue", static_cast<int>(rq2.getRecords().size()), rq2Base, rq2Opt, rq2Speedup));

    // 5. RQ3: Tim kiem tu khoa
    string testKeyword = "data";
    auto rq3BaseRes = rq3.getBaseline().search(rq3.getBooks(), testKeyword);
    auto rq3OptRes = rq3.getFinalSolution().search(testKeyword);
    auto rq3Base = BenchmarkRunner::run("Linear Scan", rq3BaseRes.booksChecked, rq3BaseRes.found, [&]() { return rq3.getBaseline().search(rq3.getBooks(), testKeyword); }, iterations, warmup);
    auto rq3Opt = BenchmarkRunner::run("Inverted Index", rq3OptRes.booksChecked, rq3OptRes.found, [&]() { return rq3.getFinalSolution().search(testKeyword); }, iterations, warmup);
    double rq3Speedup = rq3Opt.avgTimeUs > 0 ? (rq3Base.avgTimeUs / rq3Opt.avgTimeUs) : 1.0;
    results.push_back(ModuleBenchmarkResult("RQ3", "Keyword Search", static_cast<int>(rq3.getBooks().size()), rq3Base, rq3Opt, rq3Speedup));

    // In bang ket qua
    BenchmarkRunner::printComparisonTable(results);

    // Tu dong xuat ra file CSV va LaTeX
    BenchmarkRunner::exportToCSV("BaoCao/data/benchmark_results.csv", results);
    BenchmarkRunner::exportToLaTeX("BaoCao/data/benchmark_table.tex", results);

    return true;
}

void AppMenu::run() {
    while (true) {
        // 1. Chon Mode
        int modeChoice = showModeMenu();
        if (modeChoice == 0) {
            system("cls");
            cout << "\n Cam on ban da su dung He thong Quan ly Thu vien! Tam biet.\n\n";
            return;
        }

        currentMode = (modeChoice == 1) ? BENCHMARK_MODE : NORMAL_MODE;

        // 2. Vong lap chon Module
        bool stayInModuleMenu = true;
        while (stayInModuleMenu) {
            int modChoice = showModuleMenu();

            if (modChoice == 0) { // Thoat
                system("cls");
                cout << "\n Cam on ban da su dung He thong Quan ly Thu vien! Tam biet.\n\n";
                return;
            }

            if (modChoice == 9) { // Doi Mode
                stayInModuleMenu = false;
                break;
            }

            // Chay module da chon
            bool executed = false;
            switch (modChoice) {
                case 1: executed = runMC1(); break;
                case 2: executed = runMC2(); break;
                case 3: executed = runRQ1(); break;
                case 4: executed = runRQ2(); break;
                case 5: executed = runRQ3(); break;
                case 6: executed = runFullBenchmark(); break;
                default: break;
            }

            // Sau khi xem ket qua, nhan Enter hoac phim bat ky de quay thang ve Module Menu
            if (executed) {
                cout << "\n======================================================================\n";
                cout << " [*] Nhan [Enter] hoac phim bat ky de quay lai Danh muc Module...";
                _getch();
            }
        }
    }
}
