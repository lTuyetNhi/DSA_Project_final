#ifndef STRING_UTILS_H
#define STRING_UTILS_H

#include <string>
#include <cctype>

class StringUtils {
public:
    // Chuyển chuỗi sang chữ thường (hỗ trợ tìm kiếm không phân biệt hoa thường)
    static std::string toLower(std::string s) {
        for (char& c : s) {
            c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
        }
        return s;
    }

    static void normalizeSearchText(const std::string& s, std::string& normalized) {
        normalized.clear();
        if (normalized.capacity() < s.size()) normalized.reserve(s.size());
        bool separatorPending = false;

        // Normalize in one pass. The old stringstream implementation created
        // multiple temporary strings for every title, which dominated RQ3's
        // 500k-item baseline even though the actual substring test was cheap.
        for (char c : s) {
            const unsigned char uc = static_cast<unsigned char>(c);
            const bool upper = uc >= 'A' && uc <= 'Z';
            const bool lower = uc >= 'a' && uc <= 'z';
            const bool digit = uc >= '0' && uc <= '9';
            if (upper || lower || digit) {
                if (separatorPending && !normalized.empty()) normalized += ' ';
                normalized += static_cast<char>(upper ? uc + ('a' - 'A') : uc);
                separatorPending = false;
            } else if (!normalized.empty()) {
                separatorPending = true;
            }
        }
    }

    static std::string normalizeSearchText(const std::string& s) {
        std::string normalized;
        normalizeSearchText(s, normalized);
        return normalized;
    }
};

#endif // STRING_UTILS_H
