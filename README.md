# HỆ THỐNG QUẢN LÝ THƯ VIỆN (DSA PROJECT)

Dự án C++ ứng dụng Cấu trúc dữ liệu và Giải thuật (DSA) vào việc xây dựng hệ thống Quản lý Thư viện, hỗ trợ đọc/ghi dữ liệu từ các file JSON (Sách, Độc giả, Phiếu mượn, Danh sách chờ).

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
│   └── nlohmann/               # Thư viện JSON for Modern C++ (header-only)
│       └── json.hpp
├── src/
│   ├── models/                 # Định nghĩa các struct / class dữ liệu
│   │   ├── Book.h
│   │   ├── Reader.h
│   │   ├── BorrowRecord.h
│   │   ├── WaitlistEntry.h
│   │   └── Models.h
│   └── persistence/            # Xử lý đọc / ghi file JSON
│       ├── FileStore.h
│       └── FileStore.cpp
├── main.cpp                    # Điểm bắt đầu chương trình (kiểm tra & chạy các module)
└── README.md                   # Tài liệu hướng dẫn
```

---

## 🛠 Yêu cầu môi trường

- **Trình biên dịch C++**: GCC (MinGW-w64) hỗ trợ chuẩn **C++17** trở lên (hoặc Clang / MSVC).
- **Hệ điều hành**: Windows (PowerShell / CMD) hoặc Linux / macOS.

---

## 🚀 Hướng dẫn biên dịch và chạy chương trình

### 1. Sử dụng PowerShell (Khuyên dùng trên Windows)

Mở terminal PowerShell tại thư mục gốc của dự án (`DSA_Project_final`), chạy lệnh sau:

```powershell
# Biên dịch chương trình
g++ -std=c++17 main.cpp src/persistence/FileStore.cpp -o main.exe

# Chạy chương trình
.\main.exe
```

> **Mẹo chạy nhanh (Biên dịch và chạy 1 dòng):**
> ```powershell
> g++ -std=c++17 main.cpp src/persistence/FileStore.cpp -o main.exe; .\main.exe
> ```

---

### 2. Sử dụng Command Prompt (cmd)

```cmd
:: Biên dịch và chạy
g++ -std=c++17 main.cpp src/persistence/FileStore.cpp -o main.exe && main.exe
```

---

### 3. Chạy trực tiếp trong Visual Studio Code

1. Mở thư mục `DSA_Project_final` bằng VS Code.
2. Mở Terminal tích hợp (`Ctrl + ~` hoặc `Ctrl + ` ` `).
3. Nhập lệnh biên dịch và chạy bằng PowerShell:
   ```powershell
   g++ -std=c++17 main.cpp src/persistence/FileStore.cpp -o main.exe; .\main.exe
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

1. **Đường dẫn dữ liệu**: Hãy đảm bảo chạy lệnh từ **thư mục gốc** (`DSA_Project_final`) để chương trình có thể tìm thấy thư mục `data/`.
2. **Cờ `-std=c++17`**: Bắt buộc thêm cờ `-std=c++17` khi dùng `g++` để trình biên dịch hỗ trợ thư viện `nlohmann/json`.
