#ifndef STRING_UTILS_H
#define STRING_UTILS_H

#include <string>
#include <cctype>

using namespace std;

class StringUtils {
public:
    // Chuyển chuỗi sang chữ thường (hỗ trợ tìm kiếm không phân biệt hoa thường)
    static string toLower(string s) {
        for (char& c : s) {
            c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
        }
        return s;
    }
};

#endif // STRING_UTILS_H

