#ifndef STRING_UTILS_H
#define STRING_UTILS_H

#include <string>
#include <cctype>
#include <sstream>

class StringUtils {
public:
    // Chuyển chuỗi sang chữ thường (hỗ trợ tìm kiếm không phân biệt hoa thường)
    static std::string toLower(std::string s) {
        for (char& c : s) {
            c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
        }
        return s;
    }

    static std::string normalizeSearchText(const std::string& s) {
        std::string spaced;
        spaced.reserve(s.size());

        for (char c : s) {
            unsigned char uc = static_cast<unsigned char>(c);
            if (isalnum(uc)) {
                spaced += static_cast<char>(tolower(uc));
            } else {
                spaced += ' ';
            }
        }

        std::string word;
        std::string normalized;
        std::stringstream ss(spaced);
        while (ss >> word) {
            if (!normalized.empty()) {
                normalized += ' ';
            }
            normalized += word;
        }
        return normalized;
    }
};

#endif // STRING_UTILS_H
