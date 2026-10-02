#include "include/presentation/AppMenu.h"
#include "include/core/mc1/MC1.h"
#include "include/core/mc2/MC2.h"
#include "include/core/rq1/RQ1.h"
#include "include/core/rq2/RQ2.h"
#include "include/core/rq3/RQ3.h"
#include "src/persistence/FileStore.h"
#include <exception>
#include <iostream>
#include <vector>

using namespace std;

int main() {
  try {
    // 1. Load du lieu tu Persistence FileStore
    cout << "Dang khoi tao va nap du lieu tu FileStore...\n";
    vector<Book> books = FileStore::loadBooks("data/books.json");
    vector<Reader> readers = FileStore::loadReaders("data/readers.json");
    vector<BorrowRecord> borrowRecords =
        FileStore::loadBorrowRecords("data/borrow_records.json");
    vector<WaitlistEntry> waitlist =
        FileStore::loadWaitlist("data/waitlist.json");

    cout << "Tai thanh cong:\n";
    cout << " - " << books.size() << " cuon sach\n";
    cout << " - " << readers.size() << " doc gia\n";
    cout << " - " << borrowRecords.size() << " phieu muon\n";
    cout << " - " << waitlist.size() << " luot cho muon\n\n";

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

  } catch (const exception &e) {
    cerr << "Loi nghiem trong: " << e.what() << "\n";
    return 1;
  } catch (...) {
    cerr << "Loi khong xac dinh xay ra!\n";
    return 1;
  }

  return 0;
}
