#include <iostream>
#include <string>
#include <vector>
#include <exception>
#include <conio.h>
#include "src/persistence/FileStore.h"
#include "include/core/mc1/MC1.h"

using namespace std;

// Ham dieu huong menu bang phim mui ten
int selectMenu(const vector<string>& options, const string& title) {
    int selected = 0;
    int total = static_cast<int>(options.size());

    while (true) {
        system("cls");
        cout << "=========================================\n";
        cout << "       " << title << "\n";
        cout << "=========================================\n";
        for (int i = 0; i < total; ++i) {
            if (i == selected) {
                cout << " -> [ " << options[i] << " ]\n";
            } else {
                cout << "      " << options[i] << "\n";
            }
        }
        cout << "-----------------------------------------\n";
        cout << " (Dung mui ten LEN/XUONG de di chuyen, ENTER de chon)\n";

        int key = _getch();
        if (key == 0 || key == 224) {
            key = _getch();
            if (key == 72) { // Mui ten LEN
                selected = (selected - 1 + total) % total;
            } else if (key == 80) { // Mui ten XUONG
                selected = (selected + 1) % total;
            }
        } else if (key == 13) { // Phim ENTER
            return selected;
        } else if (key == 27) { // Phim ESC -> Thoat
            return total - 1;
        }
    }
}

int main() {
    try {
        // 1. Load books tu Persistence FileStore
        cout << "Dang tai du lieu sach tu FileStore...\n";
        vector<Book> books = FileStore::loadBooks("data/books.json");
        cout << "Tai thanh cong " << books.size() << " cuon sach.\n";

        // 2. Khoi tao va build Hash Table cho MC1
        MC1 mc1(books);
        mc1.build();

        // 3. Danh sach lua chon
        vector<string> menuOptions = {
            "Mode 1: Comparison Mode (So sanh Linear Search vs Hash Table)",
            "Mode 2: Normal Mode (Tra cuu nhanh bang Hash Table)",
            "Thoat chuong trinh"
        };

        // 4. Vong lap Menu dieu huong bang mui ten
        while (true) {
            int choice = selectMenu(menuOptions, "HE THONG TRA CUU SACH - MC1");

            if (choice == 2) { // Lua chon: Thoat chuong trinh
                system("cls");
                cout << "Tam biet!\n";
                break;
            }

            system("cls");
            if (choice == 0) {
                cout << "=========================================\n";
                cout << "     MODE 1: SO SANH 2 PHUONG PHAP       \n";
                cout << "=========================================\n";
                cout << "Nhap Book ID can tra cuu (vi du: B001, B003): ";
                string bookId;
                cin >> bookId;
                cout << "\n";
                mc1.comparisonMode(bookId);
            } else if (choice == 1) {
                cout << "=========================================\n";
                cout << "     MODE 2: TRA CUU NHANH HASH TABLE    \n";
                cout << "=========================================\n";
                cout << "Nhap Book ID can tra cuu (vi du: B001, B003): ";
                string bookId;
                cin >> bookId;
                cout << "\n";
                mc1.normalMode(bookId);
            }

            cout << "\n-----------------------------------------\n";
            cout << "Nhan phim bat ky de quay lai menu chinh...";
            _getch();
        }
    } catch (const exception& e) {
        cerr << "Loi xay ra: " << e.what() << "\n";
        return 1;
    } catch (...) {
        cerr << "Loi khong xac dinh xay ra!\n";
        return 1;
    }

    return 0;
}
