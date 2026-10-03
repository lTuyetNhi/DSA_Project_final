#ifndef DATE_UTILS_H
#define DATE_UTILS_H

#include <string>
#include <cctype>

// Tiện ích xử lý và kiểm tra tính hợp lệ của ngày tháng ("YYYY-MM-DD")
class DateUtils {
public:
    // Kiểm tra năm nhuận
    static bool isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    // Lấy số ngày tối đa của một tháng (có xét năm nhuận cho tháng 2)
    static int getDaysInMonth(int year, int month) {
        if (month == 2) return isLeapYear(year) ? 29 : 28;
        if (month == 4 || month == 6 || month == 9 || month == 11) return 30;
        return 31;
    }

    // Tách chuỗi "YYYY-MM-DD" thành năm, tháng, ngày
    static bool parseDate(const std::string& s, int& y, int& m, int& d) {
        if (s.length() != 10 || s[4] != '-' || s[7] != '-') return false;
        for (int i = 0; i < 10; ++i) {
            if (i == 4 || i == 7) continue;
            if (!isdigit(static_cast<unsigned char>(s[i]))) return false;
        }
        try {
            y = std::stoi(s.substr(0, 4));
            m = std::stoi(s.substr(5, 2));
            d = std::stoi(s.substr(8, 2));
        } catch (...) {
            return false;
        }

        if (y < 1900 || y > 2100) return false;
        if (m < 1 || m > 12) return false;
        if (d < 1 || d > getDaysInMonth(y, m)) return false;

        return true;
    }

    // Kiểm tra chuỗi ngày có đúng chuẩn "YYYY-MM-DD" và hợp lệ không
    static bool isValidDate(const std::string& s) {
        int y = 0, m = 0, d = 0;
        return parseDate(s, y, m, d);
    }

    // Chuyển ngày sang số ngày Julian Day để trừ trực tiếp
    static int toJulianDays(int y, int m, int d) {
        if (m < 3) {
            y -= 1;
            m += 12;
        }
        return 365 * y + y / 4 - y / 100 + y / 400 + (153 * (m + 1)) / 5 + d;
    }

    // Tính số ngày chênh lệch giữa date1 và date2 (date2 - date1)
    static int daysBetween(const std::string& date1, const std::string& date2) {
        int y1 = 0, m1 = 0, d1 = 0, y2 = 0, m2 = 0, d2 = 0;
        if (!parseDate(date1, y1, m1, d1) || !parseDate(date2, y2, m2, d2)) {
            return 0;
        }
        return toJulianDays(y2, m2, d2) - toJulianDays(y1, m1, d1);
    }
};

#endif // DATE_UTILS_H
