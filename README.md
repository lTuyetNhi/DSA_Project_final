# HỆ THỐNG QUẢN LÝ THƯ VIỆN (DSA PROJECT)

Dự án C++ ứng dụng Cấu trúc dữ liệu và Giải thuật (DSA) vào việc xây dựng hệ thống Quản lý Thư viện, hỗ trợ đọc/ghi dữ liệu từ các file JSON và thực hiện các nghiệp vụ tra cứu, mượn trả tài liệu.

---

## 📁 Cấu trúc thư mục

```text
DSA_Project_final/
├── data/                       # Chứa dữ liệu dạng JSON
│   ├── books.json              # Dữ liệu sách / tài liệu
│   ├── readers.json            # Dữ liệu độc giả
│   ├── borrow_records.json     # Lịch sử mượn trả
│   └── waitlist.json           # Danh sách hàng đợi chờ mượn
├── include/
│   ├── core/
│   │   └── mc1/                # Header cho Module MC1 (Tra cứu chính xác sách theo ID)
│   │       ├── MC1.h
│   │       ├── LinearSearch.h
│   │       ├── HashTable.h
│   │       └── SearchResult.h
│   └── nlohmann/               # Thư viện JSON for Modern C++ (header-only)
│       └── json.hpp
├── src/
│   ├── core/
│   │   └── mc1/                # Cài đặt thuật toán Module MC1
│   │       ├── MC1.cpp
│   │       ├── LinearSearch.cpp
│   │       └── HashTable.cpp
│   ├── models/                 # Định nghĩa các struct / class dữ liệu
│   │   ├── Book.h
│   │   ├── Reader.h
│   │   ├── BorrowRecord.h
│   │   ├── WaitlistEntry.h
│   │   └── Models.h
│   └── persistence/            # Xử lý đọc / ghi file JSON
│       ├── FileStore.h
│       └── FileStore.cpp
├── main.cpp                    # Điểm bắt đầu chương trình (Giao diện dòng lệnh & Điều phối)
├── doc/                        # Tài liệu đặc tả và prompt triển khai chi tiết
└── README.md                   # Tài liệu hướng dẫn
```

---

## 🔍 Module MC1: Tra cứu chính xác một tài liệu theo `book_id`

- **Baseline**: `Linear Search` - Độ phức tạp $O(n)$, duyệt tuần tự.
- **Final Solution**: `Hash Table` (tự cài đặt bằng cơ chế *Separate Chaining*) - Độ phức tạp trung bình $O(1)$.
- **Các chế độ hoạt động**:
  - **Mode 1 (Comparison Mode)**: Chạy song song cả hai thuật toán trên cùng một `book_id`, kiểm tra tính nhất quán kết quả (PASS/FAIL), đo thời gian thực thi ($ns$), đếm số phép so sánh và phân tích Trade-off.
  - **Mode 2 (Normal Mode)**: Tra cứu nhanh bằng `Hash Table` và hiển thị chi tiết thông tin sách.

---

## 🛠 Yêu cầu môi trường

- **Trình biên dịch C++**: GCC (MinGW-w64) hỗ trợ chuẩn **C++17** trở lên (hoặc Clang / MSVC).
- **Hệ điều hành**: Windows (PowerShell / CMD) hoặc Linux / macOS.

---

## 🚀 Hướng dẫn biên dịch và chạy chương trình

### 1. Sử dụng PowerShell (Khuyên dùng trên Windows)

Mở terminal PowerShell tại thư mục gốc của dự án (`DSA_Project_final`), chạy lệnh sau:

```powershell
# Biên dịch toàn bộ chương trình
g++ -std=c++17 main.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp -o main.exe

# Chạy chương trình
.\main.exe
```

> **Mẹo chạy nhanh (Biên dịch và chạy 1 dòng):**
> ```powershell
> g++ -std=c++17 main.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp -o main.exe; .\main.exe
> ```

---

### 2. Sử dụng Command Prompt (cmd)

```cmd
:: Biên dịch và chạy
g++ -std=c++17 main.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp -o main.exe && main.exe
```

---

## 📊 Dữ liệu mẫu (Data)

Chương trình đọc dữ liệu từ các tệp sau trong thư mục `data/`:
- **`books.json`**: Mã sách, tên sách, tác giả, thể loại, năm xuất bản, số lượng sách, số lượng còn lại, lượt mượn.
- **`readers.json`**: Mã độc giả, họ tên, email, số điện thoại.
- **`borrow_records.json`**: Mã phiếu mượn, mã độc giả, mã sách, ngày mượn, hạn trả, ngày trả thực tế, trạng thái (`BORROWING`, `RETURNED`, `OVERDUE`).
- **`waitlist.json`**: Hàng đợi đăng ký mượn sách khi sách hết (`available_quantity == 0`).

---

## ⚠️ Lưu ý khi chạy

1. **Đường dẫn dữ liệu**: Luôn chạy lệnh từ **thư mục gốc** (`DSA_Project_final`) để chương trình nạp đúng thư mục `data/`.
2. **Cờ `-std=c++17`**: Bắt buộc thêm cờ `-std=c++17` để hỗ trợ C++17 và thư viện `nlohmann/json`.
