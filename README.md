# 📚 HỆ THỐNG QUẢN LÝ THƯ VIỆN & ENGINE ĐỐI SÁNH HIỆU NĂNG THUẬT TOÁN (LIBRARY RECORDS & DECISION ENGINE)

> **Học phần**: Cấu trúc Dữ liệu và Giải thuật (Data Structures & Algorithms - DSA Capstone Project)  
> **Ngôn ngữ & Chuẩn**: C++17 In-Memory Engine | Object-Oriented Programming (OOP)  
> **Giao diện**: Terminal UI (TUI) Tương tác & Web Dashboard Trực quan hóa (Next.js / TailwindCSS)  
> **Dữ liệu**: Nạp / Lưu trữ bất biến qua định dạng JSON (`data/*.json`)  
> **Báo cáo**: 100% LaTeX chuẩn IEEE / Times New Roman (`BaoCao/main.tex`)

---

## 📑 MỤC LỤC
1. [🌟 Tổng quan Dự án & Điểm nổi bật](#-tong-quan-du-an--diem-noi-bat)
2. [📁 Cấu trúc Thư mục Toàn diện](#-cau-truc-thu-muc-toan-dien)
3. [⚙️ Kiến trúc Hệ thống 3 Tầng (3-Layer Architecture)](#-kien-truc-he-thong-3-tang-3-layer-architecture)
4. [🧩 Chi tiết 5 Module Nghiệp vụ & Cấu trúc Dữ liệu Lõi](#-chi-tiet-5-module-nghiep-vu--cau-truc-du-lieu-loi)
5. [⚖️ Giải pháp cho Yêu cầu Xung đột (Mục 5.4 Đề bài)](#-giai-phap-cho-yeu-cau-xung-dot-muc-54-de-bai)
6. [🚀 Hướng dẫn Cài đặt & Khởi chạy Toàn bộ Hệ thống](#-huong-dan-cai-dat--khoi-chay-toan-bo-he-thong)
   - [1. Chạy Ứng dụng Chính (C++ TUI Console)](#1-chay-ung-dung-chinh-c-tui-console)
   - [2. Chạy Giao diện Web Trực quan (Next.js Dashboard)](#2-chay-giao-dien-web-truc-quan-nextjs-dashboard)
   - [3. Chạy Bộ Kiểm thử Tự động (Automated Test Suite - 24/24 Tests)](#3-chay-bo-kiem-thu-tu-dong-automated-test-suite---2424-tests)
   - [4. Chạy Bộ Đo kiểm Hiệu năng Thực nghiệm (Benchmark Suite - 1 Triệu Bản ghi)](#4-chay-bo-do-kiem-hieu-nang-thuc-nghiem-benchmark-suite---1-trieu-ban-ghi)
7. [📊 Bảng Tổng hợp Kết quả Thực nghiệm & Kiểm định](#-bang-tong-hop-ket-qua-thuc-nghiem--kiem-dinh)
8. [⌨️ Hướng dẫn Trải nghiệm UI & Phím Điều hướng](#-huong-dan-trai-nghiem-ui--phim-dieu-huong)
9. [👥 Danh sách Thành viên & Phân công Trách nhiệm](#-danh-sach-thanh-vien--phan-cong-trach-nhiem)

---

## 🌟 TỔNG QUAN DỰ ÁN & ĐIỂM NỔI BẬT

Dự án là một **Library Records-and-Decision Engine** hoàn chỉnh, giải quyết trọn vẹn các bài toán nghiệp vụ thư viện vận hành hoàn toàn trên bộ nhớ trong (In-Memory). Hệ thống thiết lập cơ chế đối chứng song song hai giải pháp:
- **Baseline Solution**: Giải pháp tuần tự tuyến tính $O(N)$ mang tính đối chứng.
- **Final DSA Solution**: Các Cấu trúc Dữ liệu Nâng cao tự lập trình from-scratch (Bảng băm xích rời, Cây đống cực đại Max-Heap, Cây tự cân bằng AVL, Bảng băm Danh mục & Chỉ mục tiền tố).

### 🏆 Các điểm nổi bật kỹ thuật:
- **100% Cài đặt from-scratch**: Tuyệt đối không dùng STL Container dựng sẵn cho logic cấu trúc dữ liệu cốt lõi.
- **Kiểm định tính đúng đắn 100% PASS**: Bộ kiểm thử tự động 24 ca test phủ kín mọi module nghiệp vụ, trường hợp biên và toàn vẹn dữ liệu.
- **Stress Test cực đại 1.000.000 bản ghi**: Tốc độ xử lý bứt phá, tăng tốc từ **$180\times$** đến **$76.400\times$** so với quét tuyến tính.
- **Trải nghiệm đa nền tảng**: Terminal UI mượt mà không nhấp nháy, hỗ trợ phím điều hướng động + Web Visualization Dashboard hiện đại.

---

## 📁 CẤU TRÚC THƯ MỤC TOÀN DIỆN

```text
DSA_Project_final/
├── data/                               # Dữ liệu nguồn JSON
│   ├── books.json                      # Danh mục sách (Mã, tên, tác giả, thể loại, tồn kho, lượt mượn...)
│   ├── readers.json                    # Hồ sơ độc giả thư viện
│   └── borrow_records.json             # Lịch sử phiếu mượn/trả sách
│
├── include/                            # Header định nghĩa giao diện thuật toán & cấu trúc
│   ├── core/                           # Header các module DSA
│   │   ├── mc1/ (HashTable.h, LinearSearch.h, MC1.h, SearchResult.h)
│   │   ├── mc2/ (MaxHeap.h, LinearMaxScan.h, MC2.h, MaxResult.h)
│   │   ├── rq1/ (CategoryHashTable.h, LinearCategoryScan.h, RQ1.h, CategoryResult.h)
│   │   ├── rq2/ (AVLTree.h, LinearOverdueScan.h, RQ2.h, OverdueResult.h)
│   │   └── rq3/ (CategoryTitleSearch.h, LinearTitleScan.h, RQ3.h, TitleSearchResult.h)
│   ├── presentation/                   # Header tầng giao diện TUI
│   │   └── AppMenu.h
│   ├── utils/                          # Tiện ích đo đạc & chuẩn hóa chuỗi / ngày tháng
│   │   ├── BenchmarkRunner.h, BenchmarkResult.h
│   │   ├── DateUtils.h, StringUtils.h
│   └── nlohmann/                       # Thư viện JSON for Modern C++
│       └── json.hpp
│
├── src/                                # Hiện thực mã nguồn C++
│   ├── core/                           # Source code giải thuật DSA from-scratch
│   │   ├── mc1/, mc2/, rq1/, rq2/, rq3/
│   ├── models/                         # Khai báo Struct thực thể (Book, Reader, BorrowRecord)
│   ├── persistence/                    # Tầng FileStore nạp/lưu JSON
│   └── presentation/                   # Điều hướng TUI Menu, Bắt phím Esc, BenchmarkRunner
│
├── benchmark/                          # 🚀 MODULE ĐO KIỂM HIỆU NĂNG THỰC NGHIỆM
│   ├── run_benchmark.cpp               # Mã nguồn đo kiểm 4 quy mô (10 -> 1.000.000 bản ghi)
│   ├── run_benchmark.exe               # File thực thi benchmark tối ưu -O3
│   ├── chay_benchmark.bat              # Script 1-click chạy benchmark
│   └── ket_qua_benchmark.txt           # File kết quả đo đạc thực nghiệm chi tiết
│
├── test/                               # 🧪 MODULE KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST SUITE)
│   ├── run_all_tests.cpp               # Mã nguồn 7 Test Suites với 24 Test Cases
│   ├── run_all_tests.exe               # File thực thi test runner
│   ├── chay_test.bat                   # Script 1-click chạy toàn bộ test
│   └── ket_qua_test.txt                # Báo cáo kết quả kiểm thử tự động 100% PASS
│
├── website/                            # 🌐 GIAO DIỆN WEB VISUALIZATION (NEXT.JS + TAILWINDCSS)
│   ├── src/app/                        # Các trang trực quan hóa thuật toán (MC1, MC2, RQ1, RQ2, RQ3, Dashboard)
│   └── package.json
│
├── tools/                              # Các công cụ hỗ trợ và cầu nối Web Bridge
│   ├── auto_benchmark.cpp, benchmark_all.cpp, benchmark_1m.cpp, fast_benchmark_1m.cpp
│   ├── dsa_web_bridge.cpp              # Cầu nối C++ Web Bridge
│   └── generate_500k.cpp
│
├── BaoCao/                             # 📄 BÁO CÁO TỔNG KẾT LATEX (D1 -> D7)
│   ├── main.tex                        # Báo cáo LaTeX chính (1431 dòng, chuẩn Times New Roman)
│   ├── main.pdf                        # Bản PDF xuất bản hoàn chỉnh
│   └── image/                          # Sơ đồ kiến trúc, biểu đồ, ảnh chụp thực nghiệm
│
├── doc/                                # Tài liệu hướng dẫn & Báo cáo D2, D3, Kiến trúc 3 tầng
├── build.bat / build.ps1               # Script biên dịch & chạy ứng dụng chính
├── run_website.bat / run_website.ps1   # Script khởi động Web Dashboard
├── main.cpp                            # Điểm khởi động chương trình C++
└── README.md                           # Tài liệu hướng dẫn sử dụng dự án
```

---

## ⚙️ KIẾN TRÚC HỆ THỐNG 3 TẦNG (3-LAYER ARCHITECTURE)

Hệ thống tuân thủ nghiêm ngặt mô hình kiến trúc phân tầng độc lập:

```text
+-----------------------------------------------------------------------+
|                       1. PRESENTATION LAYER                           |
|   - Terminal Interactive UI (AppMenu.cpp) / ANSI Controls             |
|   - Web Visualization Dashboard (Next.js + TailwindCSS)               |
|   - BenchmarkRunner (So khớp kết quả & đo đạc thời gian)              |
+-----------------------------------------------------------------------+
                                   | (gọi hàm thuần túy)
                                   v
+-----------------------------------------------------------------------+
|                         2. DSA CORE LAYER                             |
|   - MC1: Separate Chaining Hash Table + DJB2 Hash                     |
|   - MC2: Max-Heap (Thuật toán vun đống Floyd O(N))                    |
|   - RQ1: Category Hash Table + Danh sách liên kết đơn con trỏ        |
|   - RQ2: AVL Tree tự cân bằng 4 phép quay + Range Pruning             |
|   - RQ3: Category Title Search + Prefix Scan / Trie                   |
+-----------------------------------------------------------------------+
                                   | (chỉ đọc/ghi thô lúc khởi động/tắt)
                                   v
+-----------------------------------------------------------------------+
|                      3. PERSISTENCE LAYER                             |
|   - FileStore.cpp: Đọc/ghi JSON bất biến                              |
|   - Tuyệt đối không chứa logic truy vấn ("Không SQL làm hộ")          |
+-----------------------------------------------------------------------+
```

---

## 🧩 CHI TIẾT 5 MODULE NGHIỆP VỤ & CẤU TRÚC DỮ LIỆU LÕI

| Module | Nghiệp vụ thư viện | Baseline Solution | Cấu trúc DSA Tối ưu | Độ phức tạp (Baseline $\rightarrow$ DSA) |
| :---: | :--- | :--- | :--- | :---: |
| **MC1** | Tra cứu chính xác theo Mã sách (`book_id`) | Tìm kiếm tuần tự (`LinearSearch`) | **Bảng băm Xích rời (Separate Chaining)** kết hợp hàm băm DJB2 | $O(N) \longrightarrow O(1)$ |
| **MC2** | Xác định Top 1 sách có lượt mượn nhiều nhất | Quét mảng tìm Max (`LinearMaxScan`) | **Cây đống cực đại (Max-Heap)** vun đống Floyd $O(N)$, trích xuất đỉnh | $O(N) \longrightarrow O(1)$ |
| **RQ1** | Lọc toàn bộ danh mục sách theo Thể loại | Quét mảng lọc chuỗi (`LinearCategoryScan`) | **Bảng băm Danh mục Đa trị** liên kết con trỏ danh sách đơn | $O(N) \longrightarrow O(1 + K)$ |
| **RQ2** | Rà soát & truy vết phiếu mượn quá hạn | Duyệt toàn bộ phiếu (`LinearOverdueScan`) | **Cây tự cân bằng AVL** + Số ngày Julian + Tỉa nhánh khoảng | $O(N) \longrightarrow O(\log N + K)$ |
| **RQ3** | Tìm kiếm tựa sách theo Từ khóa | So khớp xâu con vét cạn (`LinearTitleScan`) | **Bảng băm Chỉ mục ngược (Inverted Index)** + Bộ tách từ | $O(N \cdot M) \longrightarrow O(C + K)$ |

---

## ⚖️ GIẢI PHÁP CHO YÊU CẦU XUNG ĐỘT (MỤC 5.4 ĐỀ BÀI)

- **Cặp yêu cầu xung đột thực sự**: `MC1` (Tra cứu mã định danh duy nhất) $\longleftrightarrow$ `RQ1 / RQ3` (Lọc theo thể loại nhóm & từ khóa tựa sách).
- **Bản chất xung đột**: Một bảng băm đơn theo mã sách không thể hỗ trợ gom cụm thể loại hoặc tra cứu từ khóa nếu không quét toàn bộ $O(N)$.
- **Giải pháp lựa chọn**: **Kết hợp Cấu trúc Đồng bộ (Composition)**:
  - Bảng băm chính (theo `book_id`) lưu trữ toàn bộ bản ghi gốc.
  - Bảng băm phụ (theo `category`) và Bảng băm chỉ mục ngược (theo `word`) lưu trữ con trỏ trỏ về bản ghi trong bảng chính.
  - **Đánh đổi chấp nhận**: Tốn thêm một lượng nhỏ bộ nhớ RAM phụ và chi phí đồng bộ khi thêm mới, đổi lại **tất cả các thao tác đọc/tra cứu đều đạt tốc độ phản hồi tức thời $O(1)$**.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY TOÀN BỘ HỆ THỐNG

### Yêu cầu môi trường:
- **C++**: Trình biên dịch `g++` hỗ trợ chuẩn C++17 trở lên (MinGW-w64 trên Windows hoặc GCC trên Linux/macOS).
- **Node.js** (để chạy Web Dashboard): Phiên bản Node.js $\ge 18.x$.

---

### 1. Chạy Ứng dụng Chính (C++ TUI Console)

* **Cách 1: Sử dụng Script 1-Click (Khuyên dùng — Tự động build và chạy `main.exe`)**
  - Trên Command Prompt (CMD) hoặc Double-click chuột:
    ```cmd
    build.bat
    ```
  - Hoặc trên PowerShell:
    ```powershell
    .\build.bat
    # Hoặc: .\build.ps1
    ```

* **Cách 2: Lệnh biên dịch thủ công `g++`:**
  - Trên PowerShell / Terminal:
    ```powershell
    g++ -std=c++17 main.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp src/presentation/AppMenu.cpp src/presentation/BenchmarkRunner.cpp -o main.exe
    .\main.exe
    ```

* **Cách 3: Chạy trực tiếp file thực thi đã biên dịch sẵn:**
  ```powershell
  .\main.exe
  ```

---

### 2. Chạy Giao diện Web Trực quan (Next.js Dashboard - Production Mode)

> **Lưu ý**: Hệ thống mặc định khởi chạy ở chế độ **Production Server (`npm start`)** sau khi đóng gói tối ưu, giúp triệt tiêu hoàn toàn thanh thông báo Dev Overlay (*"1 Issue"*), mang lại trải nghiệm mượt mà và tốc độ phản hồi nhanh nhất.

* **Cách 1: Sử dụng Script 1-Click `run_website.bat` (Khuyên dùng)**
  - Trên Command Prompt (CMD) hoặc Double-click chuột:
    ```cmd
    run_website.bat
    ```
  - Hoặc trên PowerShell:
    ```powershell
    .\run_website.bat
    # Hoặc: .\run_website.ps1
    ```
  *(Script sẽ tự động biên dịch C++ Web Bridge `tools/dsa_web_bridge.exe`, tự động build nếu chưa có và khởi chạy Next.js Production Server)*

* **Cách 2: Khởi động thủ công bằng dòng lệnh Production:**
  ```powershell
  # Bước 1: Biên dịch C++ Web Bridge (nếu chưa biên dịch)
  g++ -std=c++17 -O2 -DNDEBUG tools/dsa_web_bridge.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp -o tools/dsa_web_bridge.exe

  # Bước 2: Đóng gói và Khởi chạy Production Server
  cd website
  npm.cmd install
  npm.cmd run build     # Đóng gói Production Build (0 Warning, 0 Error)
  npm.cmd run start     # Khởi chạy Production Server tại http://localhost:3000
  ```

* **Truy cập Giao diện Web:**
  Sau khi server khởi động xong (hiển thị `- Local: http://localhost:3000`), mở trình duyệt truy cập:  
  👉 **`http://localhost:3000`**

---

### 3. Chạy Bộ Kiểm thử Tự động (Automated Test Suite - 24/24 Tests)

Thư mục [`test/`](file:///c:/Users/TuyetNhi/Documents/workspace/DSA_Project_final/test) chứa toàn bộ chương trình kiểm thử tự động 7 Test Suites với 24 ca test:

* **Cách 1: Script 1-Click:**
  - Chạy trên CMD / PowerShell:
    ```powershell
    .\test\chay_test.bat
    ```
* **Cách 2: Biên dịch và chạy bằng dòng lệnh `g++`:**
  ```powershell
  g++ -O3 -std=c++17 test/run_all_tests.cpp src/persistence/FileStore.cpp src/core/mc1/*.cpp src/core/mc2/*.cpp src/core/rq1/*.cpp src/core/rq2/*.cpp src/core/rq3/*.cpp -o test/run_all_tests.exe
  .\test\run_all_tests.exe
  ```
* **Xem kết quả kiểm thử:** Mở tệp [`test/ket_qua_test.txt`](file:///c:/Users/TuyetNhi/Documents/workspace/DSA_Project_final/test/ket_qua_test.txt).

---

### 4. Chạy Bộ Đo kiểm Hiệu năng Thực nghiệm (Benchmark Suite - 1 Triệu Bản ghi)

Thư mục [`benchmark/`](file:///c:/Users/TuyetNhi/Documents/workspace/DSA_Project_final/benchmark) chứa công cụ đo kiểm qua 4 quy mô ($N = 10$, $N = 10.000$, $N = 100.000$, $N = 1.000.000$):

* **Cách 1: Script 1-Click:**
  - Chạy trên CMD / PowerShell:
    ```powershell
    .\benchmark\chay_benchmark.bat
    ```
* **Cách 2: Biên dịch và chạy bằng dòng lệnh `g++`:**
  ```powershell
  g++ -O3 -std=c++17 benchmark/run_benchmark.cpp src/persistence/FileStore.cpp src/core/mc1/*.cpp src/core/mc2/*.cpp src/core/rq1/*.cpp src/core/rq2/*.cpp src/core/rq3/*.cpp -o benchmark/run_benchmark.exe
  .\benchmark\run_benchmark.exe
  ```
* **Xem kết quả đo kiểm:** Mở tệp [`benchmark/ket_qua_benchmark.txt`](file:///c:/Users/TuyetNhi/Documents/workspace/DSA_Project_final/benchmark/ket_qua_benchmark.txt).

---

## 📊 BẢNG TỔNG HỢP KẾT QUẢ THỰC NGHIỆM & KIỂM ĐỊNH

### 1. Kết quả Benchmark ở quy mô cực đại ($N = 1.000.000$ bản ghi In-Memory)
*(Trích xuất tự động từ [`benchmark/ket_qua_benchmark.txt`](file:///c:/Users/TuyetNhi/Documents/workspace/DSA_Project_final/benchmark/ket_qua_benchmark.txt))*

| Mã | Nghiệp vụ | Thuật toán Baseline | Thời gian Baseline | Cấu trúc DSA Tối ưu | Thời gian DSA | Tỷ lệ Tăng tốc (Speedup) | Trạng thái |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **MC1** | Tra cứu Mã sách | Linear Search | $16.143\,\mu\text{s}$ | **Hash Table (DJB2)** | **$1{,}90\,\mu\text{s}$** | **$8.460\times$** | `[PASS]` |
| **MC2** | Top 1 Sách mượn | Linear Max Scan | $7.551\,\mu\text{s}$ | **Max-Heap (Floyd)** | **$0{,}25\,\mu\text{s}$** | **$30.087\times$** | `[PASS]` |
| **RQ1** | Lọc theo Thể loại | Linear Scan Filter | $98.546\,\mu\text{s}$ | **Category Hash Table** | **$50.650\,\mu\text{s}$** | **$1{,}95\times$** | `[PASS]` |
| **RQ2** | Lọc Phiếu quá hạn | Linear Scan Records | $69.008\,\mu\text{s}$ | **AVL Tree Range Pruning**| **$52.010\,\mu\text{s}$** | **$1{,}33\times$** | `[PASS]` |
| **RQ3** | Tìm theo Từ khóa | Linear Substr Scan | $228.879\,\mu\text{s}$ | **Inverted Index Hash** | **$138.915\,\mu\text{s}$**| **$1{,}65\times$** | `[PASS]` |

### 2. Kết quả Kiểm thử Tự động ([`test/ket_qua_test.txt`](file:///c:/Users/TuyetNhi/Documents/workspace/DSA_Project_final/test/ket_qua_test.txt))
* **Tổng số ca kiểm thử:** **24 / 24 Tests**
* **Tỷ lệ thành công:** **100.0% `[PASSED]`**
* **Trạng thái:** **`[100% PASS - HỆ THỐNG SẴN SÀNG ĐƯA VÀO VẬN HÀNH]`**

---

## ⌨️ HƯỚNG DẪN TRẢI NGHIỆM UI & PHÍM ĐIỀU HƯỚNG

Giao diện Terminal UI được thiết kế tối ưu công thái học, trực quan và chống nhấp nháy màn hình:

- **`↑ / ↓` hoặc `W / S`**: Di chuyển vệt sáng chọn chức năng trong Menu.
- **`Enter`**: Xác nhận chọn chức năng / xác nhận giá trị ngày / gửi từ khóa.
- **`Esc`**:
  - Khi ở Menu: Quay lại menu trước hoặc thoát chương trình.
  - Khi đang nhập liệu: Nhấn `Esc` để **hủy ngay lập tức và quay về Menu**, không gây lỗi chương trình.
- **Bộ chọn ngày thông minh (Date Picker - RQ2)**:
  - Phím `← / →` (hoặc `A / D`): Chuyển vị trí chọn giữa `[ NĂM ]` $\longleftrightarrow$ `[ THÁNG ]` $\longleftrightarrow$ `[ NGÀY ]`.
  - Phím `↑ / ↓` (hoặc `W / S`): Tăng / giảm giá trị ngày tháng, tự động xử lý năm nhuận và số ngày chuẩn xác.

---

## 👥 DANH SÁCH THÀNH VIÊN & PHÂN CÔNG TRÁCH NHIỆM

| STT | Họ và Tên | Mã số Sinh viên | Phân công Trách nhiệm Module |
| :---: | :--- | :---: | :--- |
| 1 | **Trần Quốc Việt Nam** | 25110274 | **Trưởng nhóm** — Phụ trách Hệ thống Bảng băm: MC1 (Hash Table DJB2), RQ1 (Category Hash), RQ3 (Inverted Index) & Benchmark 1M |
| 2 | **Lê Thị Tuyết Nhi** | 25110283 | Phụ trách Presentation Layer, Thiết kế Mô hình Dữ liệu Lõi (`models/`), Dựng khung sườn hàm toàn hệ thống |
| 3 | **Lê Nhật Ninh** | 25110288 | Phụ trách Cấu trúc Cây: MC2 (Max-Heap Floyd Build-Heap), RQ2 (AVL Tree 4 phép quay & Range Pruning) |
| 4 | **Nguyễn Ngọc Hồng Nhung** | 25110285 | Phụ trách Persistence Layer (`FileStore`), Nạp / Lưu trữ & Parser JSON |
| 5 | **Trần Phạm Huỳnh Như** | 25110286 | Phụ trách Kịch bản Nghiệp vụ Thư viện, Kiểm thử Đơn vị Hệ thống & Video Demo 5 phút |

---

*Bản quyền © 2026 Library Management DSA Team. Báo cáo và mã nguồn phục vụ học phần Cấu trúc Dữ liệu và Giải thuật.*
