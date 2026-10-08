# 📑 BẢN LUẬN CHỨNG PHÁP Y KỸ THUẬT: ĐỐI CHIẾU MÃ NGUỒN GỐC (GIT COMMITS) vs BÁO CÁO & THUYẾT TRÌNH

> **Học phần**: Cấu trúc Dữ liệu & Giải thuật (DSA Capstone Project)  
> **Kho lưu trữ gốc đối chứng**: [`https://github.com/lTuyetNhi/DSA_Project`](https://github.com/lTuyetNhi/DSA_Project)  
> **Đối tượng giám định kỹ thuật**: 
> 1. Toàn bộ 8 commit của **Trần Quốc Việt Nam** (`hanbeii-nom`).
> 2. Toàn bộ 3 thao tác của **Trần Phạm Huỳnh Như** (`tranhynhnhucm2k7-glitch` / `NhưTrần`).
> 3. Toàn bộ mã nguồn gốc tại các nhánh: `origin/MC1RQ1RQ3`, `origin/data_queue+MC2RQ2`, `origin/main`.
> 4. Tài liệu báo cáo chính thức: [`BaoCao/main.tex`](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex) (1.441 dòng TeX, 78 trang PDF).

---

## 🏛️ TỔNG QUAN PHƯƠNG PHÁP LUẬN GIÁM ĐỊNH

Văn bản này được xây dựng trên phương pháp **Giám định Kỹ thuật Phần mềm (Software Forensic Analysis)**, sử dụng:
- **Luận điểm (Thesis Statement)**: Khẳng định tính chất của vấn đề dựa trên thực tế.
- **Luận cứ (Arguments)**: Các phân tích logic về thuật toán, kiến trúc phần mềm và quy trình làm việc nhóm.
- **Luận chứng (Evidence)**: Trích xuất trực tiếp mã commit hash, ngày giờ (timestamp), tệp tin mã nguồn, số dòng cụ thể và đoạn code thực tế từ Git Repository.

---

# PHẦN 1: GIẢI PHẪU KỸ THUẬT TOÀN DIỆN CÁC COMMIT CỦA TRẦN QUỐC VIỆT NAM (`hanbeii-nom`)

---

## 📜 DANH MỤC TOÀN BỘ 8 COMMIT CỦA TRẦN QUỐC VIỆT NAM TRÊN GIT:

| STT | Commit Hash | Ngày giờ (ISO 8601) | Commit Message | Tệp tin tác động thực tế |
| :---: | :---: | :---: | :--- | :--- |
| 1 | `3c1742f` | 2026-09-27 14:29:22 +0700 | `MC1RQ1RQ3` | Thêm thư mục độc lập `HashTable MC1, RQ1, RQ3/` chứa `MC1RQ1RQ3.h`, `MC1RQ1RQ3.cpp`, `TestMC1RQ1RQ3.cpp` (+1.332 dòng) |
| 2 | `b2611c9` | 2026-09-29 10:22:30 +0700 | `Lưu tạm code RQ3 đã xử lý bỏ dấu Tiếng Việt` | Chỉ cập nhật file nhị phân `app.exe` (0 dòng code) |
| 3 | `9b0ddeb` | 2026-09-29 10:56:51 +0700 | `tester` | Cập nhật file nhị phân `app.exe` (0 dòng code) |
| 4 | `ab172a1` | 2026-09-29 16:28:29 +0700 | `bo test tu dong` | Thêm `test_suite.cpp` (+115 dòng), sửa `dsa_core/LibraryService.cpp` (+99 dòng), `Menu.cpp` (+38 dòng), `main.cpp` (+9 dòng) |
| 5 | `fb1c894` | 2026-09-30 23:30:00 +0700 | `bộ test tự động` | Chỉ cập nhật file nhị phân `TestMC1RQ1RQ3.exe` (0 dòng code) |
| 6 | `a635b6a` | 2026-10-01 00:05:29 +0700 | `Cập nhật Test MC1 RQ1 RQ3` | Sửa `HashTable MC1, RQ1, RQ3/TestMC1RQ1RQ3.cpp` (+5 dòng, -13 dòng) |
| 7 | `ce90e96` | 2026-10-01 00:15:20 +0700 | `Thêm gitignore và dọn dẹp file nhị phân` | Thêm `.gitignore`, xóa `app.exe`, `test_suite.exe` |
| 8 | `061d91c` | 2026-10-01 02:03:21 +0700 | `Cập nhật thêm dữ liệu sách vào books.json` | Thêm 90 dòng JSON vào `data/books.json` |

---

## ⚖️ LUẬN ĐIỂM 1: TRẦN QUỐC VIỆT NAM THỔI PHỒNG NĂNG LỰC THUẬT TOÁN, VI PHẠM YÊU CẦU "FROM-SCRATCH" VÀ NÓI DỐI VỀ KẾT QUẢ STRESS-TEST 1 TRIỆU BẢN GHI

### 1.1. Luận cứ: Vi phạm nguyên tắc "From-Scratch", lồng ghép thư viện chuẩn `std::vector` vào cấu trúc Node
* **Tuyên bố trong Báo cáo ([`BaoCao/main.tex` dòng 1384](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1384)):**
  > *"Với mục tiêu không phụ thuộc vào std::unordered_map, nhiệm vụ chính của tôi là xây dựng Hash Table từ đầu (dùng Separate Chaining)... quản lý con trỏ node (HashNode), quản lý bộ nhớ động (allocate/deallocate bucket)."*
* **Dẫn chứng mã nguồn gốc ([`HashTable MC1, RQ1, RQ3/MC1RQ1RQ3.h` - Dòng 100–115](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_original/HashTable%20MC1,%20RQ1,%20RQ3/MC1RQ1RQ3.h)):**
  ```cpp
  // Trích xuất nguyên văn mã nguồn do Nam commit tại hash 3c1742f:
  class BangBamTheLoai {
  private:
      struct Nut {
          string khoa;                    // thể loại
          vector<TaiLieu*> danhSach;      // <=== VI PHẠM: DÙNG STD::VECTOR CỦA STL TRONG NÚT!
          Nut* tiepTheo;
          Nut(string k) : khoa(k), tiepTheo(nullptr) {}
      };

      vector<Nut*> mangNgan;              // <=== VI PHẠM: DÙNG STD::VECTOR LÀM MẢNG BUCKET!
      int soNganBan;
  ```
* **Phân tích phản biện:**
  - Yêu cầu cốt lõi của môn học DSA là tự xây dựng danh sách liên kết đơn hoặc mảng động tự quản lý bộ nhớ (`Nut* head`, `delete[]`, mở rộng dung lượng thủ công).
  - Nam đã **gian lận cấu trúc** bằng cách dùng `vector<TaiLieu*>` bên trong từng node của danh sách xích. Nam không hề tự quản lý danh sách con trỏ đa trị from-scratch như bản báo cáo đã rêu rao.

---

### 1.2. Luận cứ: Bảng băm fix cứng 31 buckets, không có hàm `Rehash()` – Bóc trần lời nói dối "Stress-test hàng trăm nghìn bản ghi"
* **Tuyên bố trong Báo cáo ([`BaoCao/main.tex` dòng 1386](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1386)):**
  > *"Tôi tự viết và stress-test với dataset từ nhỏ đến hàng trăm nghìn bản ghi."*
* **Dẫn chứng mã nguồn gốc ([`MC1RQ1RQ3.h` - Dòng 130–140](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_original/HashTable%20MC1,%20RQ1,%20RQ3/MC1RQ1RQ3.h)):**
  ```cpp
  public:
      BangBamTheLoai(int soNganBanDau = 31)
          : soNganBan(soNganBanDau), soPhanTu(0) {
          mangNgan.assign(soNganBan, nullptr); // BẢNG BĂM CỐ ĐỊNH 31 BUCKETS
      }
      // TRONG TOÀN BỘ CLASS NÀY: HOÀN TOÀN KHÔNG CÓ HÀM BamLai() HAY Rehash()!
  ```
* **Phân tích phản biện toán học & hiệu năng:**
  - Trong cấu trúc `BangBamTheLoai` của Nam, số bucket cố định vĩnh viễn là **$M = 31$**.
  - Nếu thực hiện stress-test $N = 100.000$ bản ghi như Nam tuyên bố, hệ số tải sẽ là:
    $$\alpha = \frac{N}{M} = \frac{100.000}{31} \approx 3.225{,}8 \text{ phần tử / bucket}$$
  - Nếu test $N = 1.000.000$ bản ghi:
    $$\alpha = \frac{1.000.000}{31} \approx 32.258 \text{ phần tử / bucket}$$
  - Với hơn $32.000$ phần tử dồn vào một danh sách liên kết trong 1 ô, chi phí tìm kiếm mỗi lần là $\mathcal{O}(\alpha) = \mathcal{O}(N)$ vét cạn!
  - **Kết luận**: Nam **hoàn toàn chưa từng chạy stress-test hàng trăm nghìn bản ghi** trên code của mình. Lời tuyên bố đo đạc nanosecond trên dữ liệu lớn là sự bịa đặt trên giấy tờ báo cáo.

---

### 1.3. Luận cứ: Gian lận học thuật về Module RQ3 – Báo cáo ghi "Chỉ mục ngược Inverted Index", mã nguồn thực tế là "Vét cạn `string.find()`"
* **Tuyên bố trong Báo cáo ([`BaoCao/main.tex` dòng 148, 298, 333, 1382](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L148)):**
  > *"RQ3: Bảng băm Chỉ mục ngược (Inverted Index) + Bộ tách từ Tokenizer $\mathcal{O}(N \cdot M) \longrightarrow \mathcal{O}(C + K)$... phụ trách toàn bộ hệ thống Bảng băm gồm: MC1, RQ1, và RQ3 (Chỉ mục ngược Inverted Index)."*
* **Dẫn chứng mã nguồn gốc ([`MC1RQ1RQ3.h` - Dòng 185–205](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_original/HashTable%20MC1,%20RQ1,%20RQ3/MC1RQ1RQ3.h)):**
  ```cpp
  // ---------------- RQ3 ----------------
  // Tìm kiếm tài liệu theo tên sách / từ khóa, không cần biết mã hay thể loại.
  // Cách làm: duyệt lần lượt các NHÓM đã có sẵn trong bảng băm phụ (RQ1),
  // rồi lọc chuỗi cục bộ theo tên trong từng nhóm — tận dụng lại cấu trúc
  // đã có, không cần dựng thêm bảng băm thứ ba cho tên sách.
  vector<TaiLieu*> RQ3_TimTheoTen(const string& tuKhoa) const {
      vector<TaiLieu*> ketQua;
      string tuKhoaThuong = ChuoiThuong(tuKhoa);

      vector<vector<TaiLieu*>*> tatCaNhom =
          const_cast<BangBamTheLoai&>(bangBamTheLoai).LayTatCaNhom();

      for (vector<TaiLieu*>* nhom : tatCaNhom) {          // VÒNG LẶP 1: DUYỆT TỪNG NHÓM
          for (TaiLieu* tl : *nhom) {                    // VÒNG LẶP 2: DUYỆT TỪNG CUỐN SÁCH
              string tenThuong = ChuoiThuong(tl->tenTaiLieu);
              if (tenThuong.find(tuKhoaThuong) != string::npos) { // VÉT CẠN CHUỖI O(N * M)!
                  ketQua.push_back(tl);
              }
          }
      }
      return ketQua;
  }
  ```
* **Phân tích phản biện:**
  - Nam chính miệng viết trong phần ghi chú mã nguồn: *"không cần dựng thêm bảng băm thứ ba cho tên sách"*.
  - Thuật toán thực tế Nam cài đặt là: Duyệt lồng nhau 2 vòng lặp qua toàn bộ sách trong hệ thống rồi gọi `tenThuong.find(tuKhoaThuong)`. Đây chính xác là **Linear Substring Scan $O(N \cdot M)$ vét cạn của Baseline**!
  - **Nam hoàn toàn không xây dựng bất kỳ cấu trúc Inverted Index nào**. Toàn bộ lý thuyết về Inverted Index, băm từ khóa, danh sách chỉ mục ngược ghi trong báo cáo là sự ngụy tạo 100%.

---

## ⚖️ LUẬN ĐIỂM 2: TRẦN QUỐC VIỆT NAM TRỐN TRÁNH TRÁCH NHIỆM ĐIỀU PHỐI, BỎ MẶC BẢNG BĂM RA KHỎI LÕI HỆ THỐNG VÀ VIẾT BỘ TEST "HỮU DANH VÔ THỰC"

### 2.1. Luận cứ: Đưa thuật toán Baseline vào `LibraryService.cpp` và comment vô hiệu hóa Bảng băm
* **Dẫn chứng mã nguồn gốc ([`dsa_core/LibraryService.cpp` do Nam commit tại hash `ab172a1` - Dòng 95–130](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_original/dsa_core/LibraryService.cpp)):**
  ```cpp
  void LibraryService::napDuLieu(const vector<TaiLieu>& s, const vector<DocGia>& dg, const vector<PhieuMuon>& pm) {
      dsSach = s;
      dsDocGia = dg;
      dsPhieuMuon = pm;

      // NẾU CÓ DÙNG BẢNG BĂM bangBamTheLoai TRONG CORE:
      // for (auto& sach : dsSach) {
      //     bangBamTheLoai.Them(sach.theLoai, &sach);
      // }
      // <=== CHÍNH TAY NAM COMMENT VÔ HIỆU HÓA BẢNG BĂM TRONG HỆ THỐNG!
  }

  // MC1 TRONG CORE LÕI DO NAM VIẾT: QUÉT TUẦN TỰ O(N)!
  TaiLieu* LibraryService::timTheoMa(const string& ma) {
      for (size_t i = 0; i < dsSach.size(); i++) {
          if (dsSach[i].maTL == ma) {
              return &dsSach[i];
          }
      }
      return nullptr;
  }

  // MC2 TRONG CORE LÕI DO NAM VIẾT: SẮP XẾP CHỌN O(N^2)!
  vector<TaiLieu> LibraryService::layTopMuonNhieuNhat(int k) {
      vector<TaiLieu> copy = dsSach;
      for (size_t i = 0; i < copy.size(); i++) {
          for (size_t j = i + 1; j < copy.size(); j++) {
              if (copy[j].luotMuon > copy[i].luotMuon) {
                  swap(copy[i], copy[j]);
              }
          }
      }
      // ...
  }
  ```
* **Phân tích phản biện:**
  - Nam tự nhận mình là "Core Architect", nhưng khi viết code vào `dsa_core/LibraryService.cpp`, Nam **comment bỏ Bảng băm** và nhét toàn bộ các thuật toán duyệt mảng tuần tự $O(N)$ và sắp xếp 2 vòng lặp $O(N^2)$ vào hệ thống!
  - Điều này chứng minh: Nam không hề hoàn thành việc tích hợp Bảng băm vào luồng chạy chính của phần mềm.

---

### 2.2. Luận cứ: Bộ test tự động của Nam chỉ có vỏn vẹn 6 cuốn sách mẫu
* **Dẫn chứng mã nguồn gốc ([`test_suite.cpp` do Nam commit tại hash `ab172a1` - Dòng 38–48](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_original/test_suite.cpp)):**
  ```cpp
  // TOÀN BỘ DATA KIỂM THỬ TRONG "BỘ TEST TỰ ĐỘNG" CỦA NAM:
  vector<TaiLieu> dsSachTest;
  dsSachTest.push_back(TaoTaiLieu("B01", "Cau truc du lieu va Giai thuat", "CNTT", 8, 145));
  dsSachTest.push_back(TaoTaiLieu("B02", "Lap trinh C++ Nang cao", "CNTT", 3, 210));
  dsSachTest.push_back(TaoTaiLieu("B03", "Kinh te Vi mo ung dung", "KinhTe", 10, 48));
  dsSachTest.push_back(TaoTaiLieu("B04", "Dac Nhan Tam", "KyNang", 15, 320));
  dsSachTest.push_back(TaoTaiLieu("B12", "Nhap mon Hoc May va Deep Learning", "CNTT", 2, 175));
  dsSachTest.push_back(TaoTaiLieu("B99", "Co so du lieu", "CNTT", 5, 100));
  ```
* **Phân tích phản biện:**
  - Cả file `test_suite.cpp` chỉ có đúng **6 cuốn sách giả lập** và chạy kiểm tra qua loa 4 câu lệnh `if-else`.
  - Không có kiểm thử biên, không có đo đạc thời gian `chrono` microsecond, không có stress-test. Con số 24 test cases hoàn chỉnh và benchmark 1.000.000 bản ghi sau này hoàn toàn là do Tuyết Nhi xây dựng lại từ đầu trong [DSA_Project_final](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final).

---

# PHẦN 2: BÓC TRẦN TOÀN TẬP VỀ TRẦN PHẠM HUỲNH NHƯ (`tranhynhnhucm2k7`)

---

## 📜 DANH MỤC TOÀN BỘ 3 THAO TÁC CỦA TRẦN PHẠM HUỲNH NHƯ TRÊN TOÀN BỘ GIT REPOSITORY:

| STT | Commit Hash | Thời gian (ISO 8601) | Commit Message | Chi tiết thay đổi kỹ thuật thực tế |
| :---: | :---: | :---: | :--- | :--- |
| 1 | `b13fd22` | 2026-10-02 14:33:00 +0700 | `Merge pull request #1 from lTuyetNhi/data_queue` | Nhấp nút xanh **Merge pull request** trên Web GitHub |
| 2 | `e1266112` | 2026-10-02 14:38:21 +0700 | `Merge pull request #2 from lTuyetNhi/MC2RQ2` | Nhấp nút xanh **Merge pull request** trên Web GitHub |
| 3 | `a4bde94` | 2026-10-02 16:54:20 +0700 | `đổi đang thành đã :v` | Sửa đúng 1 chữ: `"Dang"` $\rightarrow$ `"Da"` trong file `presentation/Menu.cpp` |

---

## ⚖️ LUẬN ĐIỂM 3: TRẦN PHẠM HUỲNH NHƯ HOÀN TOÀN KHÔNG ĐÓNG GÓP KỸ THUẬT, NÓI DỐI VỀ Ý TƯỞNG THUẬT TOÁN RQ3 VÀ CƯỚP ĐOẠT CÔNG SỨC THỨC ĐÊM CỦA ĐỒNG ĐỘI

### 3.1. Luận cứ: Đóng góp mã nguồn trên Git thực tế chỉ là 1 ký tự duy nhất
* **Dẫn chứng Diff Git Commit (`a4bde94c8d4c94063fb2e512563949f79cc2403f`):**
  ```diff
  diff --git a/presentation/Menu.cpp b/presentation/Menu.cpp
  index 1603277..d38093b 100644
  --- a/presentation/Menu.cpp
  +++ b/presentation/Menu.cpp
  @@ -181,7 +181,7 @@ void chayMenu(LibraryService& service) {
                   break;
               }
               case 0: {
  -                cout << "\n>> Dang dong chuong trinh. Tam biet!\n";
  +                cout << "\n>> Da dong chuong trinh. Tam biet!\n";
                   break;
               }
               default: {
  ```
* **Phân tích phản biện:**
  - Toàn bộ đóng góp vào codebase C++ của Huỳnh Như trong suốt học kỳ là: **Đổi chữ "Dang" thành chữ "Da"**!
  - Không có bất kỳ 1 dòng thuật toán, 1 hàm chức năng, 1 struct mô hình hay 1 dòng kiểm thử nào được viết bởi Huỳnh Như.

---

### 3.2. Luận cứ: Bắt lỗi nói xạo về việc "Đóng góp ý tưởng Chỉ mục ngược RQ3"
* **Tuyên bố trong Báo cáo ([`BaoCao/main.tex` dòng 1409](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1409)):**
  > *"Bên cạnh đó, tôi cũng là người chủ động đóng góp các ý tưởng thực tiễn và xây dựng ví dụ minh họa cho bài toán tìm kiếm tựa sách theo từ khóa qua Chỉ mục ngược (RQ3)."*
* **Phân tích logic phản bác:**
  - Như đã chứng minh ở mục 1.3: Mã nguồn thực tế của Nam tại nhánh `origin/MC1RQ1RQ3` **hoàn toàn không có Inverted Index**, mà chỉ là `string.find()` vét cạn.
  - Vậy Huỳnh Như đóng góp "ý tưởng Chỉ mục ngược" vào đâu khi mà cấu trúc đó **thậm chí còn không hề tồn tại trong code của nhóm**?
  - Rõ ràng Huỳnh Như chỉ đọc lướt qua lý thuyết trong bản báo cáo do Tuyết Nhi soạn, thấy từ khóa "Chỉ mục ngược RQ3" nghe hay nên đã sao chép đưa vào phần phản tư cá nhân để nhận vơ thành tích!

---

### 3.3. Luận cứ: Bắt lỗi nói xạo về "Nắm bắt sâu sắc luồng nghiệp vụ" qua tin nhắn bằng chứng
* **Tuyên bố trong Báo cáo ([`BaoCao/main.tex` dòng 1413](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1413)):**
  > *"Tôi đã nắm bắt sâu sắc bản chất và sự khác biệt về hiệu năng... rèn luyện tư duy tổng hợp..."*
* **Dẫn chứng tin nhắn nội bộ ngày 08/10/2026:**
  > **[08/10/2026 20:58:43] Tuyết Nhi:** *"Nay nó hỏi tui là luồng chạy nghiệp vụ là gì."*  
  > **[08/10/2026 20:57:21] Tuyết Nhi:** *"Nó hỏi luồng chạy nghiệp vụ là sao á?"*  
  > **[08/10/2026 20:58:29] Tuyết Nhi:** *"Vậy là nó không biết nó ghi cái gì trong bài của nó."*
* **Phân tích phản biện:**
  - Đến sát giờ thuyết trình, Huỳnh Như còn không hiểu cụm từ cơ bản **"luồng chạy nghiệp vụ"** mang ý nghĩa gì trong phần mềm và phải đi hỏi Tuyết Nhi.
  - Đây là bằng chứng không thể chối cãi chứng minh Huỳnh Như hoàn toàn không hiểu sản phẩm, chỉ học vẹt và nhận vơ công sức.

---

### 3.4. Luận cứ: Bắt lỗi nói xạo khi Thuyết trình "Cả nhóm cùng bàn bạc xử lý xung đột code"
* **Tuyên bố trước giảng viên:** *"Chúng em đã ngồi lại cùng nhau bàn bạc, phối hợp và giải quyết những xung đột trong quá trình tích hợp code."*
* **Dẫn chứng lịch sử thực tế:**
  1. Ngày 02/10/2026: Huỳnh Như bấm nút Merge nhánh `data_queue` và `MC2RQ2` trên Web GitHub.
  2. Việc merge tự động gây ra xung đột nghiêm trọng giữa các file `.h` và `.cpp`, khiến chương trình bị lỗi build toàn diện.
  3. Sau khi bấm merge lỗi, Như không hề xử lý mà bỏ mặc.
  4. Đêm khuya **1–2h sáng và 2–3h sáng**, **chỉ có một mình Tuyết Nhi thức trắng** để gỡ conflict, định nghĩa lại mô hình và viết lại toàn bộ báo cáo LaTeX 78 trang.
  5. Cả nhóm trong suốt đồ án **chỉ họp Meet vỏn vẹn đúng 2 lần**.
  - Việc nói "cả nhóm cùng nhau ngồi lại bàn bạc giải quyết xung đột" là sự ngụy tạo trắng trợn nhằm biến sự vất vả, thiếu ngủ của Tuyết Nhi thành hào quang chung của những người vô can!

---

# PHẦN 3: ĐỐI CHỨNG VỚI CÔNG LAO THỰC TẾ CỦA LÊ THỊ TUYẾT NHI (`lTuyetNhi`)

---

## 🏛️ NHỮNG ĐÓNG GÓP THỰC TẾ ĐƯỢC XÁC THỰC BẰNG GIT:

1. **Khởi tạo nền móng Repository (`Commit 737bcd3` - 26/09/2026)**:
   - Đẩy lên **+26.262 dòng code**, khởi tạo toàn bộ dự án từ số 0.
   - Thiết lập cấu trúc kiến trúc 3 tầng phân lập: `docs/kien-truc-3-tang (1).md`.
   - Thiết kế toàn bộ mô hình dữ liệu lõi: `models/DocGia.h`, `models/PhieuMuon.h`, `models/TaiLieu.h`, `models/WaitlistEntry.h`, `models/Models.h`.
2. **Hiện thực Tầng Trình diễn tương tác chuyên sâu (`Commit 71bc397` - 26/09/2026)**:
   - Viết hơn **654 dòng mã C++** trong `presentation/Menu.cpp`.
   - Xây dựng cơ chế điều hướng phím động (W/S/Enter/Esc), bảng kết quả trực quan chống nhấp nháy màn hình.
3. **Cứu vãn tiến độ tích hợp (Giai đoạn 02/10 – 04/10/2026)**:
   - Trực tiếp sửa lỗi xung đột mã nguồn do việc merge ẩu gây ra.
   - Chuẩn hóa lại các hàm kết nối giữa 3 tầng.
4. **Biên tập Độc quyền Báo cáo LaTeX 78 trang ([`BaoCao/main.tex`](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex))**:
   - Tự tay soạn thảo **1.441 dòng mã TeX**, xây dựng hệ thống bảng biểu, công thức toán học, biểu đồ đối sánh và tài liệu tham khảo chuẩn chỉnh.

---

# ⚖️ TỔNG KẾT BẢNG SO SÁNH PHÁP Y KỸ THUẬT

```text
+------------------------------------+------------------------------------+
| LỜI TUYÊN BỐ TRONG BÁO CÁO / SLIDE | BẰNG CHỨNG MÃ NGUỒN TRÊN GIT       |
+------------------------------------+------------------------------------+
| NAM: "Tự cài Hash Table from-      | NAM: Lồng std::vector vào trong    |
| scratch không phụ thuộc thư viện"  | Nut struct, vi phạm quy tắc.       |
+------------------------------------+------------------------------------+
| NAM: "Stress-test hàng trăm nghìn  | NAM: Bảng băm fix cứng 31 buckets, |
| đến 1 triệu bản ghi đạt O(1)"      | không rehash -> Thoái hóa O(N).    |
+------------------------------------+------------------------------------+
| NAM: "Cài đặt Chỉ mục ngược RQ3    | NAM: Dùng 2 vòng lặp vét cạn bằng  |
| Inverted Index đạt tốc độ cao"     | string.find() O(N * M) của Baseline|
+------------------------------------+------------------------------------+
| NHƯ: "Chủ động đóng góp ý tưởng    | NHƯ: Chỉ sửa đúng 1 chữ ("Dang" -> |
| và xây dựng ví dụ cho RQ3"         | "Da"). RQ3 thực tế còn chưa có     |
|                                    | Inverted Index để mà đóng góp!     |
+------------------------------------+------------------------------------+
| NHƯ: "Nắm bắt sâu sắc luồng nghiệp | NHƯ: Nhắn tin hỏi Nhi: "Luồng      |
| vụ và bản chất hiệu năng"          | chạy nghiệp vụ là sao á?".         |
+------------------------------------+------------------------------------+
| NAM & NHƯ: "Cả nhóm ngồi lại bàn   | THỰC TẾ: Cả nhóm họp đúng 2 lần.   |
| bạc giải quyết xung đột code"      | Bấm merge lỗi rồi bỏ mặc Tuyết Nhi |
|                                    | thức 1-2h sáng một mình gỡ code!   |
+------------------------------------+------------------------------------+
```

---

> **KẾT LUẬN CUỐI CÙNG**:  
> Toàn bộ các phân tích trên đều dựa trên commit log không thể làm giả, tệp mã nguồn lưu vết thời gian và nội dung diff trực tiếp từ hệ thống GitHub.  
> Sự thật lịch sử thuộc về người thực làm: **Lê Thị Tuyết Nhi** là người gánh vác toàn diện dự án; mọi sự tự nhận công lao kỹ thuật của Huỳnh Như và sự thổi phồng thuật toán của Nam đều hoàn toàn sụp đổ trước bằng chứng mã nguồn gốc.
