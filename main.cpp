#include "include/presentation/AppMenu.h"
#include "src/persistence/FileStore.h"
#include <iostream>
#include <exception>

#ifdef _WIN32
extern "C" {
    __declspec(dllimport) int __stdcall SetConsoleOutputCP(unsigned int wCodePageID);
    __declspec(dllimport) int __stdcall SetConsoleCP(unsigned int wCodePageID);
}
#endif

using namespace std;

int main() {
#ifdef _WIN32
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);
#endif
    try {
        // 1. Load du lieu tu Persistence FileStore
        cout << "Dang khoi tao va nap du lieu tu FileStore...\n";
        vector<Book> books = FileStore::loadBooks("data/books.json");
        vector<Reader> readers = FileStore::loadReaders("data/readers.json");
        vector<BorrowRecord> borrowRecords =
            FileStore::loadBorrowRecords("data/borrow_records.json");

        cout << "Tai thanh cong:\n";
        cout << " - " << books.size() << " cuon sach\n";
        cout << " - " << readers.size() << " doc gia\n";
        cout << " - " << borrowRecords.size() << " phieu muon\n\n";

        // 2. Khoi tao cac module
        MC1 mc1(books);
        MC2 mc2(books);
        RQ1 rq1(books);
        RQ2 rq2(borrowRecords);
        RQ3 rq3(books);

        // 3. Build cac cau truc du lieu Final DSA mot lan
        mc1.build();
        mc2.build();
        rq1.build();
        rq2.build();
        rq3.build();

        // 4. Khoi tao AppMenu va bat dau chuong trinh
        AppMenu app(mc1, mc2, rq1, rq2, rq3);
        app.run();

        // 5. Luu du lieu ra Persistence FileStore truoc khi thoat chuong trinh
        cout << "\nDang luu du lieu vao FileStore truoc khi thoat...\n";
        bool sBooks = FileStore::saveBooks("data/books.json", books);
        bool sReaders = FileStore::saveReaders("data/readers.json", readers);
        bool sRecords = FileStore::saveBorrowRecords("data/borrow_records.json", borrowRecords);

        if (sBooks && sReaders && sRecords) {
            cout << "Luu du lieu thanh cong!\n";
        } else {
            cerr << "Canh bao: Co loi xay ra khi luu du lieu vao file.\n";
        }

    } catch (const exception &e) {
        cerr << "Loi nghiem trong: " << e.what() << "\n";
        return 1;
    } catch (...) {
        cerr << "Loi khong xac dinh xay ra!\n";
        return 1;
    }

    return 0;
}
