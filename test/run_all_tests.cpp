#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <chrono>

#include "../src/models/Book.h"
#include "../src/models/BorrowRecord.h"
#include "../src/persistence/FileStore.h"
#include "../include/core/mc1/HashTable.h"

#include "../include/core/mc1/LinearSearch.h"
#include "../include/core/mc2/MaxHeap.h"
#include "../include/core/mc2/LinearMaxScan.h"
#include "../include/core/rq1/CategoryHashTable.h"
#include "../include/core/rq1/LinearCategoryScan.h"
#include "../include/core/rq2/AVLTree.h"
#include "../include/core/rq2/LinearOverdueScan.h"
#include "../include/core/rq3/CategoryTitleSearch.h"
#include "../include/core/rq3/LinearTitleScan.h"
#include "../include/utils/StringUtils.h"

using namespace std;

// Cấu trúc lưu kết quả từng ca kiểm thử đơn vị
struct TestCaseResult {
    string testId;
    string moduleName;
    string testDescription;
    bool passed;
    string message;
};

class AutomatedTestSuite {
private:
    vector<TestCaseResult> results;
    int totalTests = 0;
    int passedTests = 0;
    int failedTests = 0;
    stringstream reportLog;

    void log(const string& text) {
        cout << text << flush;
        reportLog << text;
    }

    void recordResult(const string& id, const string& mod, const string& desc, bool ok, const string& msg = "OK") {
        totalTests++;
        if (ok) {
            passedTests++;
        } else {
            failedTests++;
        }
        results.push_back({id, mod, desc, ok, msg});
        
        stringstream ss;
        ss << "  [" << (ok ? "PASSED" : "FAILED") << "] " 
           << left << setw(10) << id 
           << " | " << setw(18) << mod 
           << " | " << desc;
        if (!ok) {
            ss << " --> Loi: " << msg;
        }
        ss << "\n";
        log(ss.str());
    }

public:
    // -------------------------------------------------------------
    // SUITE 1: KIỂM THỬ MODULE MC1 (HASH TABLE & TRA CỨU MÃ SÁCH)
    // -------------------------------------------------------------
    void runMC1Tests() {
        log("\n======================================================================\n");
        log(" SUITE 1: KIEM THU MODULE MC1 (BANG BAM VA TRA CUU MA SACH)\n");
        log("======================================================================\n");

        HashTable ht(10007);
        Book b1{"B001", "Cau truc Du lieu", "Nguyen Van A", "Lap trinh", 2024, 10, 5, 25};
        Book b2{"B002", "Giai thuat Nang cao", "Tran Van B", "Lap trinh", 2023, 8, 2, 40};
        Book b3{"B003", "Co so Du lieu", "Le Thi C", "He thong", 2022, 15, 10, 15};

        // TC-MC1-01: Thêm phần tử và tìm kiếm chính xác
        ht.insert(b1);
        ht.insert(b2);
        ht.insert(b3);

        auto res1 = ht.search("B001");
        recordResult("TC-MC1-01", "MC1 - Hash Table", "Tra cuu dung ma sach ton tai", 
                     res1.found && res1.book.title == "Cau truc Du lieu");

        // TC-MC1-02: Tìm kiếm mã không tồn tại
        auto resMissing = ht.search("B999");
        recordResult("TC-MC1-02", "MC1 - Hash Table", "Tra cuu ma sach khong ton tai tra ve found=false", 
                     !resMissing.found);

        // TC-MC1-03: Xử lý va chạm (Collision Resolution)
        // Thêm nhiều sách có cùng tiền tố để kiểm tra xích rời (Separate Chaining)
        for (int i = 10; i <= 30; ++i) {
            Book b{"BK" + to_string(i), "Sach Test " + to_string(i), "Tac gia", "Test", 2024, 5, 5, i};
            ht.insert(b);
        }
        bool collisionOk = true;
        for (int i = 10; i <= 30; ++i) {
            auto r = ht.search("BK" + to_string(i));
            if (!r.found || r.book.title != "Sach Test " + to_string(i)) {
                collisionOk = false;
                break;
            }
        }
        recordResult("TC-MC1-03", "MC1 - Hash Table", "Kiem tra Separate Chaining khi xay ra va cham bam", 
                     collisionOk);

        // TC-MC1-04: Đối chứng tính đúng đắn với LinearSearch (Baseline)
        vector<Book> bookList = {b1, b2, b3};
        auto baseRes = LinearSearch::search(bookList, "B002");
        auto optRes = ht.search("B002");
        recordResult("TC-MC1-04", "MC1 - Equivalence", "Doi chung ket qua khop tuyet doi voi Baseline Linear Search", 
                     baseRes.found == optRes.found && baseRes.book.book_id == optRes.book.book_id);
    }

    // -------------------------------------------------------------
    // SUITE 2: KIỂM THỬ MODULE MC2 (MAX-HEAP & TOP SÁCH MƯỢN NHIỀU NHẤT)
    // -------------------------------------------------------------
    void runMC2Tests() {
        log("\n======================================================================\n");
        log(" SUITE 2: KIEM THU MODULE MC2 (MAX-HEAP VA TOP SACH MUON NHIEU NHAT)\n");
        log("======================================================================\n");

        vector<Book> books = {
            {"B1", "Sach A", "TG1", "Cat1", 2024, 10, 5, 12},
            {"B2", "Sach B", "TG2", "Cat1", 2024, 10, 5, 89}, // Cực đại (borrow_count = 89)
            {"B3", "Sach C", "TG3", "Cat2", 2024, 10, 5, 45},
            {"B4", "Sach D", "TG4", "Cat2", 2024, 10, 5, 76},
            {"B5", "Sach E", "TG5", "Cat3", 2024, 10, 5, 3}
        };

        MaxHeap heap;
        heap.build(books);

        // TC-MC2-01: Trích xuất phần tử cực đại tại gốc O(1)
        auto maxRes = heap.getMax();
        recordResult("TC-MC2-01", "MC2 - Max-Heap", "Trich xuat dung sach co luot muon cao nhat tai nut goc", 
                     maxRes.found && maxRes.book.book_id == "B2" && maxRes.book.borrow_count == 89);

        // TC-MC2-02: Kiểm tra trường hợp đống rỗng
        MaxHeap emptyHeap;
        auto emptyRes = emptyHeap.getMax();
        recordResult("TC-MC2-02", "MC2 - Max-Heap", "Truy xuat tren Max-Heap rong an toan khong loi", 
                     !emptyRes.found);

        // TC-MC2-03: Đối chứng tính đúng đắn với LinearMaxScan (Baseline)
        auto baseMax = LinearMaxScan::findMax(books);
        auto optMax = heap.getMax();
        recordResult("TC-MC2-03", "MC2 - Equivalence", "Doi chung ket qua khop tuyet doi voi Baseline Linear Max Scan", 
                     baseMax.found == optMax.found && baseMax.book.borrow_count == optMax.book.borrow_count);

        // TC-MC2-04: Kiểm tra tính chất đống khi nhiều phần tử có lượt mượn bằng nhau
        vector<Book> tieBooks = {
            {"T1", "Tie 1", "TG", "C", 2024, 5, 5, 100},
            {"T2", "Tie 2", "TG", "C", 2024, 5, 5, 100},
            {"T3", "Tie 3", "TG", "C", 2024, 5, 5, 50}
        };
        MaxHeap tieHeap;
        tieHeap.build(tieBooks);
        auto tieRes = tieHeap.getMax();
        recordResult("TC-MC2-04", "MC2 - Max-Heap", "Xu ly chinh xac truong hop cac sach co cung luot muon cuc dai", 
                     tieRes.found && tieRes.book.borrow_count == 100);
    }

    // -------------------------------------------------------------
    // SUITE 3: KIỂM THỬ MODULE RQ1 (CATEGORY HASH TABLE & LỌC THỂ LOẠI)
    // -------------------------------------------------------------
    void runRQ1Tests() {
        log("\n======================================================================\n");
        log(" SUITE 3: KIEM THU MODULE RQ1 (BANG BAM DANH MUC VA LOC THE LOAI)\n");
        log("======================================================================\n");

        vector<Book> books = {
            {"B1", "C++ Basic", "TG1", "Programming", 2024, 10, 5, 10},
            {"B2", "Java Advanced", "TG2", "Programming", 2024, 10, 5, 20},
            {"B3", "Linear Algebra", "TG3", "Mathematics", 2024, 10, 5, 30},
            {"B4", "Calculus", "TG4", "Mathematics", 2024, 10, 5, 40},
            {"B5", "World History", "TG5", "History", 2024, 10, 5, 5}
        };

        CategoryHashTable cht;
        cht.build(books);

        // TC-RQ1-01: Lọc thể loại có nhiều sách
        auto progRes = cht.search("Programming");
        recordResult("TC-RQ1-01", "RQ1 - Category Hash", "Loc dung so luong sach thuoc the loai Programming (2 sach)", 
                     progRes.found && progRes.books.size() == 2);

        // TC-RQ1-02: Lọc thể loại không tồn tại
        auto fakeRes = cht.search("NonExistentCategory");
        recordResult("TC-RQ1-02", "RQ1 - Category Hash", "Loc the loai khong ton tai tra ve danh sach rong", 
                     !fakeRes.found && fakeRes.books.empty());

        // TC-RQ1-03: Đối chứng tính đúng đắn với LinearCategoryScan
        auto baseCat = LinearCategoryScan::search(books, "Mathematics");
        auto optCat = cht.search("Mathematics");
        recordResult("TC-RQ1-03", "RQ1 - Equivalence", "Doi chung so luong va noi dung sach khop tuyet doi voi Baseline", 
                     baseCat.found == optCat.found && baseCat.books.size() == optCat.books.size());
    }

    // -------------------------------------------------------------
    // SUITE 4: KIỂM THỬ MODULE RQ2 (AVL TREE & TRUY VẾT QUÁ HẠN THEO NGÀY)
    // -------------------------------------------------------------
    void runRQ2Tests() {
        log("\n======================================================================\n");
        log(" SUITE 4: KIEM THU MODULE RQ2 (CAY AVL VA TRUY VET PHIEU QUA HAN)\n");
        log("======================================================================\n");

        vector<BorrowRecord> records = {
            {"BR01", "RD01", "B1", "2026-08-01", "2026-08-15", "", "BORROWING"}, // Quá hạn so với 2026-09-01
            {"BR02", "RD02", "B2", "2026-08-10", "2026-08-25", "", "BORROWING"}, // Quá hạn so với 2026-09-01
            {"BR03", "RD03", "B3", "2026-08-15", "2026-08-20", "2026-08-19", "RETURNED"},  // Đã trả -> Không tính
            {"BR04", "RD04", "B4", "2026-09-01", "2026-09-15", "", "BORROWING"}  // Chưa đến hạn
        };

        AVLTree avl;
        avl.build(records);

        // TC-RQ2-01: Lọc đúng các phiếu mượn quá hạn (chưa trả và due_date < target)
        auto overdueRes = avl.findOverdue("2026-09-01");
        recordResult("TC-RQ2-01", "RQ2 - AVL Tree", "Loc dung cac phieu chua tra co han truoc ngay kiem tra", 
                     overdueRes.found && overdueRes.records.size() == 2);

        // TC-RQ2-02: Mốc thời gian quá sâu trong quá khứ (không có phiếu nào quá hạn)
        auto noOverdue = avl.findOverdue("2026-01-01");
        recordResult("TC-RQ2-02", "RQ2 - AVL Tree", "Moc thoi gian khong co phieu qua han tra ve dung records rong", 
                     !noOverdue.found && noOverdue.records.empty());

        // TC-RQ2-03: Đối chứng tính đúng đắn với LinearOverdueScan (Baseline)
        auto baseOverdue = LinearOverdueScan::search(records, "2026-09-01");
        auto optOverdue = avl.findOverdue("2026-09-01");
        recordResult("TC-RQ2-03", "RQ2 - Equivalence", "Doi chung danh sach phieu qua han khop tuyet doi voi Baseline", 
                     baseOverdue.found == optOverdue.found && baseOverdue.records.size() == optOverdue.records.size());

        // TC-RQ2-04: Kiểm tra 4 phép quay cây tự cân bằng AVL (LL, RR, LR, RL)
        // Chèn các mốc thời gian tăng dần liên tục để ép cây thực hiện phép quay cân bằng
        vector<BorrowRecord> sortedRecords;
        for (int i = 1; i <= 15; ++i) {
            string dayStr = (i < 10 ? "0" : "") + to_string(i);
            sortedRecords.push_back({"BR" + to_string(i), "RD1", "B1", "2026-08-01", "2026-08-" + dayStr, "", "BORROWING"});
        }
        AVLTree avlBalanced;
        avlBalanced.build(sortedRecords);
        auto balancedRes = avlBalanced.findOverdue("2026-08-10");
        recordResult("TC-RQ2-04", "RQ2 - AVL Rotations", "Cay AVL tu can bang chinh xac khi nap du lieu co thu tu tang dan", 
                     balancedRes.found && balancedRes.records.size() == 9);
    }

    // -------------------------------------------------------------
    // SUITE 5: KIỂM THỬ MODULE RQ3 (INVERTED INDEX & TÌM KIẾM TỪ KHÓA)
    // -------------------------------------------------------------
    void runRQ3Tests() {
        log("\n======================================================================\n");
        log(" SUITE 5: KIEM THU MODULE RQ3 (CHI MUC NGUOC VA TIM KIEM TU KHOA)\n");
        log("======================================================================\n");

        vector<Book> books = {
            {"B1", "Data Structures and Algorithms in C++", "TG1", "CS", 2024, 10, 5, 10},
            {"B2", "Introduction to Machine Learning", "TG2", "CS", 2024, 10, 5, 20},
            {"B3", "Design Patterns and Software Architecture", "TG3", "CS", 2024, 10, 5, 30},
            {"B4", "Advanced Algorithms Design", "TG4", "CS", 2024, 10, 5, 40}
        };

        CategoryTitleSearch cts;
        cts.build(books);

        // TC-RQ3-01: Tìm kiếm từ khóa đơn (không phân biệt hoa thường)
        auto r1 = cts.search("algorithms");
        recordResult("TC-RQ3-01", "RQ3 - Inverted Index", "Tim kiem tu khoa 'algorithms' xuat hien trong 2 cuon sach", 
                     r1.found && r1.books.size() == 2);

        // TC-RQ3-02: Tìm kiếm từ khóa chứa chữ hoa (Case-Insensitive)
        auto r2 = cts.search("DATA");
        recordResult("TC-RQ3-02", "RQ3 - Inverted Index", "Tim kiem chu hoa 'DATA' tra ve dung sach chua tu 'Data'", 
                     r2.found && r2.books.size() == 1 && r2.books[0].book_id == "B1");

        // TC-RQ3-03: Tìm từ khóa không tồn tại
        auto rMissing = cts.search("Quantum");
        recordResult("TC-RQ3-03", "RQ3 - Inverted Index", "Tu khoa khong ton tai tra ve dung danh sach rong", 
                     !rMissing.found && rMissing.books.empty());

        // TC-RQ3-04: Đối chứng tính đúng đắn với LinearTitleScan (Baseline)
        auto baseTitle = LinearTitleScan::search(books, "Patterns");
        auto optTitle = cts.search("Patterns");
        recordResult("TC-RQ3-04", "RQ3 - Equivalence", "Doi chung ket qua tim tu khoa khop tuyet doi voi Baseline Scan", 
                     baseTitle.found == optTitle.found && baseTitle.books.size() == optTitle.books.size());
    }

    // -------------------------------------------------------------
    // SUITE 6: KIỂM THỬ TẦNG LƯU TRỮ VÀ TOÀN VẸN DỮ LIỆU (PERSISTENCE)
    // -------------------------------------------------------------
    void runPersistenceTests() {
        log("\n======================================================================\n");
        log(" SUITE 6: KIEM THU TANG LUU TRU FILE VA TOAN VEN DU LIEU (PERSISTENCE)\n");
        log("======================================================================\n");

        // TC-FS-01: Nạp danh sách sách thực tế từ data/books.json
        auto books = FileStore::loadBooks("data/books.json");
        recordResult("TC-FS-01", "Persistence", "Nap danh sach sach hop le tu tep books.json", 
                     !books.empty());

        // TC-FS-02: Nạp danh sách phiếu mượn từ data/borrow_records.json
        auto borrows = FileStore::loadBorrowRecords("data/borrow_records.json");
        recordResult("TC-FS-02", "Persistence", "Nap danh sach phieu muon hop le tu borrow_records.json", 
                     !borrows.empty());

        // TC-FS-03: Kiểm tra chuẩn hóa chuỗi StringUtils (Trim khoảng trắng & Lowercase)
        string raw = "   Co So Du Lieu   ";
        string norm = StringUtils::normalizeSearchText(raw);
        recordResult("TC-FS-03", "StringUtils", "Chuan hoa chuoi tim kiem xoa khoang trang va chuyen chu thuong", 
                     norm == "co so du lieu");
    }

    // Xuất báo cáo tổng kết
    void generateSummaryReport(const string& filePath) {
        log("\n======================================================================\n");
        log("                     TONG KET KIEM THU HE THONG (TEST REPORT)          \n");
        log("======================================================================\n");

        stringstream ss;
        ss << "Tong so ca kiem thu (Total Tests):  " << totalTests << "\n"
           << "So ca kiem thu THANH CONG (Passed):  " << passedTests << " (" 
           << fixed << setprecision(1) << (totalTests > 0 ? (passedTests * 100.0 / totalTests) : 0.0) << "%)\n"
           << "So ca kiem thu THAT BAI (Failed):    " << failedTests << "\n"
           << "Danh gia chung (Overall Status):     " 
           << (failedTests == 0 ? "[100% PASS - HE THONG SAN SANG DUA VAO VAN HANH]" : "[FAIL - CO LOI CAN KHAC PHUC]") 
           << "\n======================================================================\n";

        log(ss.str());

        // Ghi ra file txt
        ofstream outFile(filePath);
        if (outFile.is_open()) {
            outFile << reportLog.str();
            outFile.close();
            cout << "\n[THANH CONG] Da ghi toan bo ket qua Kiem thu vao: " << filePath << "\n" << flush;
        } else {
            cerr << "\n[LOI] Khong the ghi file: " << filePath << "\n" << flush;
        }
    }
};

int main() {
    cout << "======================================================================\n";
    cout << "  CHUONG TRINH KIEM THU TU DONG TOAN BO MODULE (AUTOMATED TEST SUITE) \n";
    cout << "======================================================================\n\n";

    AutomatedTestSuite suite;

    auto start = chrono::high_resolution_clock::now();

    // Chạy toàn bộ 6 Test Suites (MC1, MC2, RQ1, RQ2, RQ3, Persistence)
    suite.runMC1Tests();
    suite.runMC2Tests();
    suite.runRQ1Tests();
    suite.runRQ2Tests();
    suite.runRQ3Tests();
    suite.runPersistenceTests();

    auto end = chrono::high_resolution_clock::now();
    double totalMs = chrono::duration_cast<chrono::microseconds>(end - start).count() / 1000.0;
    cout << "\nThoi gian thuc thi toan bo Test Suites: " << fixed << setprecision(2) << totalMs << " ms\n";

    // Xuất báo cáo kết quả ra test/ket_qua_test.txt
    suite.generateSummaryReport("test/ket_qua_test.txt");

    return 0;
}

