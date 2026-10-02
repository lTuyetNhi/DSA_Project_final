#ifndef STRING_UTILS_H
#define STRING_UTILS_H

#include <string>
#include <cctype>

class StringUtils {
public:
    // Chuyen chuoi sang chu thuong (ho tro tim kiem khong phan biet hoa thuong)
    static std::string toLower(std::string s) {
        for (char& c : s) {
            c = static_cast<char>(tolower(static_cast<unsigned char>(c)));
        }
        return s;
    }
};

#endif // STRING_UTILS_H
