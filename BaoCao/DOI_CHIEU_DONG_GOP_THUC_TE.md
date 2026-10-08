# 📑 BẢN GIÁM ĐỊNH PHÁP Y KỸ THUẬT PHẦN MỀM & LUẬN CHỨNG PHẢN BÁC TOÀN DIỆN
## ĐỐI CHIẾU LỊCH SỬ GIT COMMITS (NGÀY, GIỜ, PHÚT, GIÂY), MÃ NGUỒN GỐC vs BÁO CÁO LATEX VÀ THUYẾT TRÌNH

> **Học phần**: Cấu trúc Dữ liệu & Giải thuật (DSA Capstone Project)  
> **Mã lớp học phần**: `261DASA230179_06` — Nhóm thực hiện: `Nhóm 07`  
> **Kho lưu trữ gốc đối chứng**: [`https://github.com/lTuyetNhi/DSA_Project`](https://github.com/lTuyetNhi/DSA_Project)  
> **Kho lưu trữ bảo toàn chứng cứ**: [`https://github.com/buitanphat247/demogithub`](https://github.com/buitanphat247/demogithub)  
> **Tài liệu Báo cáo đối chiếu**: [`BaoCao/main.tex`](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex) (1.441 dòng TeX, 78 trang PDF chính thức)  
> **Thư mục mã nguồn gốc Zalo**: [`HashTable MC1, RQ1, RQ3/`](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/HashTable%20MC1,%20RQ1,%20RQ3) (38.212.903 bytes ≈ 36.45 MB)  
> **Phương pháp giám định**: Software Forensic & Git Provenance Analysis (Phân tích nguồn gốc commit, giải phẫu AST/mã nguồn, kiểm tra hệ số tải toán học và đối chất lịch sử tin nhắn nội bộ).

---

# ⏱️ PHẦN 1: DÒNG THỜI GIAN TOÀN CẢNH (CHRONOLOGICAL EVENT LOG) TỪNG GIỜ, PHÚT, GIÂY

Toàn bộ lịch sử hoạt động trên tất cả các nhánh Git (`main`, `MC1RQ1RQ3`, `MC2_RQ2`, `MC2RQ2`, `data_queue`, `data_queue+MC2RQ2`) cùng các mốc thời gian trao đổi nội bộ được giải mã chính xác tuyệt đối theo chuẩn ISO 8601:

| Mốc Thời Gian (Năm-Tháng-Ngày Giờ:Phút:Giây) | Tác Giả & Email | Mã Commit / Kênh | Nội Dung Hoạt Động / Commit Message | Bản Chất Kỹ Thuật & Tác Động Thực Tế |
| :--- | :--- | :---: | :--- | :--- |
| **2026-09-26 09:53:25** | Lê Thị Tuyết Nhi<br>`lnhi8321@gmail.com` | `737bcd3` | `Add UI` | **Khởi tạo nền móng Repository (+26.262 dòng code)**: Thiết lập toàn bộ kiến trúc 3 tầng, thư mục `models/` (`DocGia.h`, `PhieuMuon.h`, `TaiLieu.h`, `WaitlistEntry.h`, `Models.h`), dữ liệu mẫu và khung sườn `LibraryService`. |
| **2026-09-26 23:26:16** | Lê Thị Tuyết Nhi<br>`lnhi8321@gmail.com` | `71bc397` | `feat: optimize RQ1-RQ3, interactive UI, align tables...` | **Xây dựng Tầng Trình diễn chuyên sâu (+654 dòng code)**: Hiện thực toàn bộ `presentation/Menu.cpp`, cơ chế điều hướng phím mũi tên/W-S-Enter-Esc, bảng hiển thị chống rung nhấp nháy màn hình. |
| **2026-09-27 09:02:00** | Nam Trần<br>`hanbeii-nom` | Zalo Chat | *"hanbeii-nom"*, *"này"* | Nam gửi username GitHub để xin cấp quyền vào repository sau khi Tuyết Nhi đã dựng xong toàn bộ khung sườn dự án. |
| **2026-09-27 09:05:00** | Lê Thị Tuyết Nhi | Zalo Chat | *"Tui add rùi á. Bà vô gmail đồng ý nha"* | Nhi thao tác mời tài khoản `hanbeii-nom` làm cộng tác viên (Collaborator) trên GitHub. |
| **2026-09-27 09:12:00** | Nam Trần<br>`hanbeii-nom` | Zalo Chat | Gửi thư mục `HashTable MC1, RQ1, RQ3` (36.45 MB) kèm tin nhắn: ***"thêm này vô giùm tui với, tui thêm hong đc=))"*** | **BẰNG CHỨNG PHÁP Y TỬ HUYỆT**: Nam không biết dùng Git, ném cả folder 36.45 MB chứa file `.exe` nhị phân 37 MB qua Zalo để Tuyết Nhi xử lý và đưa lên Git hộ! |
| **2026-09-27 09:23:00** | Lê Thị Tuyết Nhi | Zalo Chat | *"Okee"* | Tuyết Nhi nhận file, tải về và tiến hành lọc bỏ các file nhị phân để push lên repository. |
| **2026-09-27 14:29:22** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `3c1742f` | `MC1RQ1RQ3` | Đẩy thư mục độc lập `HashTable MC1, RQ1, RQ3/` (+1.332 dòng) gồm 3 file mã nguồn và **4 file nhị phân rác** (`.exe`) chiếm dung lượng lớn lên nhánh `MC1RQ1RQ3`. |
| **2026-09-29 10:22:30** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `b2611c9` | `Lưu tạm code RQ3 đã xử lý bỏ dấu Tiếng Việt` | **0 dòng code được thay đổi**. Nam chỉ commit đúng 1 file nhị phân biên dịch `app.exe` (1.66 MB). |
| **2026-09-29 10:56:51** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `9b0ddeb` | `tester` | **0 dòng code được thay đổi**. Tiếp tục chỉ đè file nhị phân `app.exe`. |
| **2026-09-29 16:28:29** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `ab172a1` | `bo test tu dong` | Thêm `test_suite.cpp` (+115 dòng), sửa `LibraryService.cpp` (+99 dòng), commit đè `test_suite.exe` (1.65 MB). **Trong commit này, Nam chính tay comment vô hiệu hóa Bảng băm và thay bằng thuật toán vét cạn Baseline $O(N)$!** |
| **2026-09-30 23:30:00** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `fb1c894` | `bộ test tự động` | **0 dòng code được thay đổi**. Chỉ commit đè file nhị phân `TestMC1RQ1RQ3.exe` (287 KB $\rightarrow$ 292 KB). |
| **2026-10-01 00:05:29** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `a635b6a` | `Cập nhật Test MC1 RQ1 RQ3` | Sửa đúng 5 dòng, xóa 13 dòng trong `TestMC1RQ1RQ3.cpp`. |
| **2026-10-01 00:15:20** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `ce90e96` | `Thêm gitignore và dọn dẹp file nhị phân` | Thêm file `.gitignore` (11 dòng) và xóa 2 file nhị phân `app.exe`, `test_suite.exe` do chính mình tải lên trước đó. |
| **2026-10-01 02:03:21** | Trần Quốc Việt Nam<br>`vietnam662284@gmail.com` | `061d91c` | `Cập nhật thêm dữ liệu sách vào books.json` | Thêm 90 dòng JSON (chứa 10 cuốn sách mẫu) vào tệp `data/books.json`. **Đây là commit cuối cùng của Nam trong cả đồ án.** |
| **2026-10-02 14:33:00** | Trần Phạm Huỳnh Như<br>`tranhuynhnhucm2k7@gmail.com` | `b13fd22` | `Merge pull request #1 from lTuyetNhi/data_queue` | Nhấp nút xanh **Merge pull request** trên giao diện Web GitHub để gộp nhánh `data_queue` vào nhánh `data_queue+MC2RQ2`. |
| **2026-10-02 14:38:21** | Trần Phạm Huỳnh Như<br>`tranhuynhnhucm2k7@gmail.com` | `e126611` | `Merge pull request #2 from lTuyetNhi/MC2RQ2` | Sau đúng 5 phút 21 giây, Như nhấp tiếp nút xanh **Merge pull request #2** trên Web GitHub. **Hành động merge ẩu liên tiếp gây xung đột (conflict) dữ liệu và sập toàn bộ hệ thống build.** |
| **2026-10-02 16:54:20** | Trần Phạm Huỳnh Như<br>`tranhuynhnhucm2k7@gmail.com` | `a4bde94` | `đổi đang thành đã :v` | **ĐÓNG GÓP CODE DUY NHẤT CỦA NHƯ TRONG HỌC KỲ**: Mở file `presentation/Menu.cpp` trên Web GitHub, sửa đúng 1 chữ: `"Dang"` $\rightarrow$ `"Da"`! Ngoài ra không viết bất kỳ dòng thuật toán nào. |
| **2026-10-02 $\rightarrow$ 2026-10-04**<br>*(Đêm khuya 1–3h sáng)* | Lê Thị Tuyết Nhi | Local & Báo Cáo | Gỡ conflict, tái cấu trúc toàn diện, biên tập báo cáo | Sau khi Như merge gây lỗi rồi bỏ mặc, Tuyết Nhi phải thức trắng đêm 1–2h sáng gỡ xung đột, chuẩn hóa lại model và **tự tay soạn thảo 100% bản báo cáo LaTeX 1.441 dòng TeX (78 trang PDF)**. |
| **2026-10-08 20:57 $\rightarrow$ 20:58** | Huỳnh Như & Tuyết Nhi | Zalo Chat | Tin nhắn lộ tẩy nghiệp vụ | Trước giờ thuyết trình, Như nhắn tin hỏi Nhi: *"Ủa Nhi ơi, luồng chạy nghiệp vụ là sao á?"* $\rightarrow$ Lộ tẩy việc không hiểu gì về hệ thống! |

---

# 🔬 PHẦN 2: BẢN GIẢI PHẪU PHÁP Y KỸ THUẬT VỀ TRẦN QUỐC VIỆT NAM (`hanbeii-nom`)

---

## 💥 BẰNG CHỨNG TỬ HUYỆT: NGUỒN GỐC THẬT CỦA THƯ MỤC `HashTable MC1, RQ1, RQ3` (36.45 MB)

### 1. Sự thật từ ảnh chụp màn hình Zalo ngày 27/09/2026
Vào lúc **09:12 Chủ Nhật, 27/09/2026**, tài khoản Zalo **Nam Trần** đã gửi một tệp nén/thư mục có tên chính xác:  
📁 **`HashTable MC1, RQ1, RQ3` — Dung lượng hiển thị trên Zalo: `36.45 MB`**  
kèm lời nhắn nguyên văn không thể chối cãi:  
> ***"thêm này vô giùm tui với, tui thêm hong đc=))"***

### 2. Đối chứng từng byte với thư mục gốc trên ổ đĩa
Kiểm tra trực tiếp thư mục [`HashTable MC1, RQ1, RQ3/`](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/HashTable%20MC1,%20RQ1,%20RQ3) có trong máy:
```text
Tên tệp tin           Dung lượng (Bytes)    Thời gian biên dịch / sửa đổi
-------------------   ------------------    -----------------------------
MC1RQ1RQ3.exe         37.013.189 bytes      26/09/2026 18:52:08 (~35.30 MB)
MC1, RQ1, RQ3.exe        582.683 bytes      26/09/2026 18:48:34 (~0.56 MB)
TestMC1RQ1RQ3.exe        287.750 bytes      26/09/2026 19:00:42 (~0.27 MB)
hash_demo.exe            284.039 bytes      26/09/2026 18:44:46 (~0.27 MB)
MC1RQ1RQ3.cpp             16.209 bytes      26/09/2026 18:32:54
MC1RQ1RQ3.h               15.280 bytes      26/09/2026 18:38:12
TestMC1RQ1RQ3.cpp         13.753 bytes      26/09/2026 19:00:38
-------------------------------------------------------------------------
TỔNG CỘNG:            38.212.903 bytes / (1024 * 1024) = 36.4427 MB ≈ 36.45 MB!
```

### 3. Bản chất kỹ thuật bóc trần năng lực của Nam
* **Lý do Nam "thêm hong được"**: Nam dùng IDE biên dịch ra file thực thi debug khổng lồ `MC1RQ1RQ3.exe` nặng tới **37.013.189 bytes (~35.3 MB)**. Nam hoàn toàn **không có kỹ năng Git cơ bản**: không biết viết `.gitignore`, không biết gõ lệnh Git qua terminal, và khi dùng trình duyệt web kéo thả thư mục vào GitHub thì bị hệ thống GitHub từ chối upload vì file nhị phân vượt quá giới hạn 25MB.
* **Đùn đẩy trách nhiệm**: Thay vì tìm hiểu cách dùng Git, Nam ném nguyên cục binary 36.45 MB qua Zalo bảo Tuyết Nhi: *"thêm này vô giùm tui với"*. Tuyết Nhi phải tự lọc bỏ file rác `.exe` và đẩy lên nhánh `origin/MC1RQ1RQ3` vào lúc 14:29:22 cùng ngày (Commit `3c1742f`).
* **Sự lừa dối trong Báo cáo**: Trong [`BaoCao/main.tex` dòng 298, 333](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L298), Nam tự ghi nhận mình là *"Trưởng nhóm điều phối chung dự án"*, *"Kiến trúc sư kiểm soát luồng kỹ thuật"*, che giấu hoàn toàn sự thật rằng ngay cả việc đưa code của chính mình lên Git cũng phải nhờ Tuyết Nhi làm hộ!

---

## ⚖️ ĐỐI CHẤT TỪNG LỜI KHAI TRONG BÁO CÁO vs CODE THỰC TẾ CỦA NAM

---

### 🔴 Lời khai 1: "Tự cài Hash Table from-scratch, quản lý con trỏ node, không dùng thư viện"
* **Trích nguyên văn Báo cáo ([`BaoCao/main.tex` dòng 1384](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1384)):**
  > *"Với mục tiêu không phụ thuộc vào std::unordered_map, nhiệm vụ chính của tôi là xây dựng Hash Table từ đầu (dùng Separate Chaining) để đạt độ phức tạp trung bình $O(1)$... quản lý con trỏ node (HashNode), quản lý bộ nhớ động (allocate/deallocate bucket)."*
* **Mã nguồn thực tế do Nam viết ([`HashTable MC1, RQ1, RQ3/MC1RQ1RQ3.h` dòng 190–205](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/HashTable%20MC1,%20RQ1,%20RQ3/MC1RQ1RQ3.h#L190-L205)):**
  ```cpp
  class BangBamTheLoai {
  private:
      struct Nut {
          string khoa;                    // thể loại
          vector<TaiLieu*> danhSach;      // <=== VI PHẠM ĐỀ BÀI: DÙNG THẲNG STD::VECTOR TRONG NÚT!
          Nut* tiepTheo;
          Nut(string k) : khoa(k), tiepTheo(nullptr) {}
      };

      vector<Nut*> mangNgan;              // <=== VI PHẠM: DÙNG STD::VECTOR LÀM MẢNG BUCKET!
      int soNganBan;
  ```
* **Luận cứ phản bác pháp y**:
  - Đề bài đồ án DSA nghiêm cấm sử dụng thư viện động STL cho các cấu trúc lõi và yêu cầu tự cài đặt danh sách liên kết đơn hoặc mảng động tự quản lý vùng nhớ (`Nut* head`, `delete[]`, `resize`).
  - Nam đã **gian lận cấu trúc** bằng cách nhét thẳng `vector<TaiLieu*> danhSach` của thư viện chuẩn C++ vào bên trong từng node của danh sách liên kết.
  - Nam hoàn toàn không hề tự quản lý danh sách con trỏ đa trị from-scratch như bản báo cáo đã rêu rao!

---

### 🔴 Lời khai 2: "Tự viết và stress-test với dataset từ nhỏ đến hàng trăm nghìn bản ghi"
* **Trích nguyên văn Báo cáo ([`BaoCao/main.tex` dòng 1386](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1386)):**
  > *"Tôi tự viết và stress-test với dataset từ nhỏ đến hàng trăm nghìn bản ghi... đo benchmark thực tế nanosecond qua chrono và đếm số lần so sánh."*
* **Mã nguồn thực tế do Nam viết ([`HashTable MC1, RQ1, RQ3/MC1RQ1RQ3.h` dòng 224–228](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/HashTable%20MC1,%20RQ1,%20RQ3/MC1RQ1RQ3.h#L224-L228)):**
  ```cpp
  public:
      BangBamTheLoai(int soNganBanDau = 31)
          : soNganBan(soNganBanDau), soPhanTu(0) {
          mangNgan.assign(soNganBan, nullptr); // BẢNG BĂM CỐ ĐỊNH DUY NHẤT 31 BUCKETS!
      }
      // TRONG TOÀN BỘ CLASS NÀY: HOÀN TOÀN KHÔNG CÓ BẤT KỲ HÀM BamLai() HAY Rehash() NÀO!
  ```
* **Luận cứ phản bác toán học & hiệu năng**:
  - Trong cấu trúc `BangBamTheLoai` của Nam, số bucket cố định vĩnh viễn là **$M = 31$**.
  - Nếu nạp dữ liệu stress-test $N = 100.000$ bản ghi như Nam tự nhận:
    $$\alpha = \frac{N}{M} = \frac{100.000}{31} \approx 3.225{,}8 \text{ phần tử / bucket}$$
  - Nếu nạp $N = 1.000.000$ bản ghi:
    $$\alpha = \frac{1.000.000}{31} \approx 32.258 \text{ phần tử / bucket}$$
  - Với hơn $32.000$ phần tử dồn vào một danh sách liên kết trong một ngăn duy nhất, độ phức tạp của mỗi lần tra cứu bị sụp đổ hoàn toàn về $\mathcal{O}(\alpha) = \mathcal{O}(N)$ vét cạn tuyến tính!
  - **Kết luận pháp y**: Nam **chưa bao giờ thực hiện stress-test 100.000 hay 1.000.000 bản ghi** trên code của mình. Toàn bộ tuyên bố đo đạc thời gian nanosecond trên tập dữ liệu lớn trong báo cáo là sự ngụy tạo số liệu trên giấy.

---

### 🔴 Lời khai 3: "Cài đặt Bảng băm Chỉ mục ngược (Inverted Index) + Bộ tách từ Tokenizer cho RQ3"
* **Trích nguyên văn Báo cáo ([`BaoCao/main.tex` dòng 148, 298, 333, 1382](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L148)):**
  > *"RQ3: Bảng băm Chỉ mục ngược (Inverted Index) + Bộ tách từ Tokenizer $\mathcal{O}(N \cdot M) \longrightarrow \mathcal{O}(C + K)$... Nam phụ trách toàn bộ hệ thống Bảng băm gồm: MC1, RQ1, và RQ3 (Chỉ mục ngược Inverted Index)."*
* **Mã nguồn thực tế do Nam viết ([`HashTable MC1, RQ1, RQ3/MC1RQ1RQ3.h` dòng 356–377](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/HashTable%20MC1,%20RQ1,%20RQ3/MC1RQ1RQ3.h#L356-L377)):**
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
* **Mã nguồn Nam viết trong Core hệ thống ([`dsa_core/LibraryService.cpp` commit `ab172a1` dòng 148–165](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_original/dsa_core/LibraryService.cpp)):**
  ```cpp
  // RQ3: Tìm kiếm theo Tên / Từ khóa
  vector<TaiLieu> LibraryService::timTheoTen(const string& tuKhoa) {
      vector<TaiLieu> ketQua;
      string tuKhoaChuAn = BoDauVaVietThuong(tuKhoa);
      if (tuKhoaChuAn.empty()) return ketQua;

      for (size_t i = 0; i < dsSach.size(); i++) {
          string tenChuAn = BoDauVaVietThuong(dsSach[i].tenTL);
          if (tenChuAn.find(tuKhoaChuAn) != string::npos) { // QUÉT TUẦN TỰ O(N * M)!
              ketQua.push_back(dsSach[i]);
          }
      }
      return ketQua;
  }
  ```
* **Luận cứ phản bác pháp y**:
  - Chính tay Nam ghi chú thích trong mã nguồn: *"không cần dựng thêm bảng băm thứ ba cho tên sách"*.
  - Cả trong thư mục riêng lẫn trong tầng Core, Nam đều cài đặt thuật toán **quét vét cạn 2 vòng lặp bằng `string.find()` đạt độ phức tạp $\mathcal{O}(N \cdot M)$ y hệt Baseline thô sơ**.
  - **Nam hoàn toàn không xây dựng bất kỳ cấu trúc Inverted Index nào**. Toàn bộ lý thuyết về Chỉ mục ngược Inverted Index, bảng băm từ khóa, danh sách postings list ghi trong báo cáo là sự ngụy tạo 100%!

---

### 🔴 Lời khai 4: "Xây dựng bộ test tự động và tích hợp Core hệ thống"
* **Bóc trần bộ test tự động ([`test_suite.cpp` do Nam commit tại hash `ab172a1` dòng 38–48](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_original/test_suite.cpp)):**
  - Số lượng sách kiểm thử: Đúng **6 cuốn sách mẫu** (`B01`, `B02`, `B03`, `B04`, `B12`, `B99`).
  - Số lượng độc giả: Đúng **2 người** (`DG01`, `DG02`).
  - Số lượng phiếu mượn: Đúng **2 phiếu** (`PM01`, `PM02`).
  - Cả file chỉ có đúng **5 câu lệnh `if-else`** kiểm tra qua loa. Hoàn toàn không có đo đạc thời gian `std::chrono`, không có test case tự động 24 bài kiểm thử như Tuyết Nhi xây dựng sau này.
* **Bóc trần việc tự tay comment vô hiệu hóa Bảng băm ([`dsa_core/LibraryService.cpp` commit `ab172a1` dòng 95–130](file:///c:/Users/Admin/Documents/Workspace/Project_DSA_NHI/DSA_Project_original/dsa_core/LibraryService.cpp)):**
  ```cpp
  void LibraryService::napDuLieu(...) {
      dsSach = s;
      dsDocGia = dg;
      dsPhieuMuon = pm;

      // NẾU CÓ DÙNG BẢNG BĂM bangBamTheLoai TRONG CORE:
      // for (auto& sach : dsSach) {
      //     bangBamTheLoai.Them(sach.theLoai, &sach);
      // }
      // <=== CHÍNH TAY NAM COMMENT VÔ HIỆU HÓA BẢNG BĂM TRONG HỆ THỐNG!
  }

  TaiLieu* LibraryService::timTheoMa(const string& ma) {
      for (size_t i = 0; i < dsSach.size(); i++) { // DUYỆT TUẦN TỰ O(N) CỦA BASELINE!
          if (dsSach[i].maTL == ma) return &dsSach[i];
      }
      return nullptr;
  }
  ```
* **Luận cứ phản bác pháp y**:
  - Nam tự xưng là "Kiến trúc sư hệ thống", nhưng khi nộp code vào `LibraryService.cpp`, Nam **comment bỏ Bảng băm** và nhét toàn bộ các thuật toán duyệt mảng tuần tự $O(N)$ và sắp xếp chọn $O(N^2)$ vào Core.
  - Nam không hề tích hợp được Bảng băm vào luồng chạy chính của phần mềm!

---

# 🔬 PHẦN 3: BẢN GIẢI PHẪU PHÁP Y KỸ THUẬT VỀ TRẦN PHẠM HUỲNH NHƯ (`tranhynhnhucm2k7`)

---

## 📜 TOÀN BỘ DI SẢN CỦA HUỲNH NHƯ TRÊN TOÀN BỘ GIT REPOSITORY: ĐÚNG 3 THAO TÁC!

| STT | Commit Hash | Thời gian (ISO 8601) | Tác giả & Tài khoản | Chi tiết thao tác kỹ thuật thực tế |
| :---: | :---: | :---: | :--- | :--- |
| 1 | `b13fd22` | 2026-10-02 14:33:00 +0700 | NhưTrần<br>`tranhuynhnhucm2k7@gmail.com` | Bấm nút xanh **Merge pull request #1** trên Web GitHub để gộp nhánh `data_queue`. |
| 2 | `e126611` | 2026-10-02 14:38:21 +0700 | NhưTrần<br>`tranhuynhnhucm2k7@gmail.com` | Bấm nút xanh **Merge pull request #2** trên Web GitHub để gộp nhánh `MC2RQ2` (sau đúng 5 phút 21 giây). |
| 3 | `a4bde94` | 2026-10-02 16:54:20 +0700 | tranhynhnhucm2k7-glitch<br>`tranhuynhnhucm2k7@gmail.com` | Mở file `presentation/Menu.cpp` trên Web GitHub, sửa đúng 1 chữ: `"Dang"` $\rightarrow$ `"Da"`. |

---

## ⚖️ ĐỐI CHẤT TỪNG LỜI KHAI TRONG BÁO CÁO vs HÀNH VI THỰC TẾ CỦA HUỲNH NHƯ

---

### 🔴 Lời khai 1: "Chủ động đóng góp ý tưởng thực tiễn và xây dựng ví dụ minh họa cho RQ3 qua Chỉ mục ngược"
* **Trích nguyên văn Báo cáo ([`BaoCao/main.tex` dòng 1409](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1409)):**
  > *"Bên cạnh đó, tôi cũng là người chủ động đóng góp các ý tưởng thực tiễn và xây dựng ví dụ minh họa cho bài toán tìm kiếm tựa sách theo từ khóa qua Chỉ mục ngược (RQ3)."*
* **Luận cứ phản bác pháp y**:
  - Như đã chứng minh ở Phần 2: Mã nguồn thực tế của Nam tại nhánh `origin/MC1RQ1RQ3` **hoàn toàn không có Inverted Index**, mà chỉ là `string.find()` vét cạn.
  - Vậy Huỳnh Như đóng góp "ý tưởng Chỉ mục ngược" vào đâu khi mà cấu trúc đó **thậm chí còn không hề tồn tại trong code của nhóm**?
  - Rõ ràng Huỳnh Như chỉ đọc lướt qua lý thuyết trong bản báo cáo do Tuyết Nhi soạn, thấy từ khóa "Chỉ mục ngược RQ3" nghe hay nên đã sao chép đưa vào phần phản tư cá nhân để nhận vơ thành tích!

---

### 🔴 Lời khai 2: "Nắm bắt sâu sắc bản chất hiệu năng và luồng chạy nghiệp vụ hệ thống"
* **Trích nguyên văn Báo cáo ([`BaoCao/main.tex` dòng 1413](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1413)):**
  > *"Thông qua việc hệ thống hóa toàn bộ luồng vận hành để thực hiện video demo, tôi đã nắm bắt sâu sắc bản chất và sự khác biệt về hiệu năng giữa giải pháp quét tuyến tính truyền thống và các cấu trúc dữ liệu tối ưu... rèn luyện tư duy tổng hợp..."*
* **Dẫn chứng tin nhắn nội bộ ngày 08/10/2026:**
  - **[08/10/2026 20:57:21] Tuyết Nhi:** *"Nó hỏi luồng chạy nghiệp vụ là sao á?"*
  - **[08/10/2026 20:58:29] Tuyết Nhi:** *"Vậy là nó không biết nó ghi cái gì trong bài của nó."*
  - **[08/10/2026 20:58:43] Tuyết Nhi:** *"Nay nó hỏi tui là luồng chạy nghiệp vụ là gì."*
* **Luận cứ phản bác pháp y**:
  - Đến sát giờ thuyết trình trước Hội đồng, Huỳnh Như còn không hiểu cụm từ cơ bản **"luồng chạy nghiệp vụ"** là gì và phải đi nhắn tin hỏi Tuyết Nhi.
  - Đây là bằng chứng không thể chối cãi chứng minh Huỳnh Như hoàn toàn không hiểu sản phẩm, học vẹt câu chữ và gian lận báo cáo.

---

### 🔴 Lời khai 3: "Cả nhóm đã cùng ngồi lại bàn bạc, giải quyết các xung đột code khi tích hợp"
* **Tuyên bố khi thuyết trình trước giảng viên:**
  > *"Chúng em đã cùng nhau ngồi lại bàn bạc, phân công chặt chẽ và giải quyết các xung đột mã nguồn phát sinh trong quá trình tích hợp hệ thống."*
* **Dẫn chứng lịch sử thực tế hiện trường**:
  1. Suốt cả học kỳ, nhóm **chỉ họp Meet đúng 2 lần**.
  2. Chiều ngày 02/10/2026: Huỳnh Như bấm liên tiếp 2 nút Merge PR trên Web GitHub (`b13fd22` và `e126611`). Thao tác merge tự động gây xung đột nghiêm trọng giữa các model và header, khiến chương trình sập toàn diện và không thể biên dịch.
  3. Sau khi gây lỗi, Như không hề gỡ lỗi mà bỏ mặc dự án.
  4. Đêm khuya **1–2h sáng và 2–3h sáng**, **chỉ có một mình Tuyết Nhi thức trắng** để ngồi gỡ từng dòng xung đột mã nguồn, viết lại hàm điều phối và thức 2-3 đêm soạn 78 trang báo cáo LaTeX.
  5. Lời tuyên bố "cả nhóm cùng nhau bàn bạc giải quyết xung đột" là sự dối trá trắng trợn nhằm cướp đoạt mồ hôi, nước mắt và những đêm mất ngủ của Tuyết Nhi!

---

# 🏛️ PHẦN 4: ĐỐI CHỨNG VỚI CÔNG LAO THỰC TẾ CỦA LÊ THỊ TUYẾT NHI (`lTuyetNhi`) VÀ SỰ BẤT CÔNG TỘT CÙNG

---

## ⭐️ NHỮNG ĐÓNG GÓP THỰC TẾ ĐƯỢC XÁC THỰC BẰNG LỊCH SỬ GIT:

1. **Khởi tạo và định hình toàn bộ dự án (`Commit 737bcd3` - 26/09/2026 09:53:25)**:
   - Đẩy lên **+26.262 dòng code**, đặt nền móng kiến trúc 3 tầng phân lập: `docs/kien-truc-3-tang (1).md`.
   - Thiết kế toàn bộ mô hình dữ liệu lõi: `models/DocGia.h`, `models/PhieuMuon.h`, `models/TaiLieu.h`, `models/WaitlistEntry.h`, `models/Models.h`.
2. **Hiện thực Tầng Trình diễn tương tác chuyên sâu (`Commit 71bc397` - 26/09/2026 23:26:16)**:
   - Viết hơn **654 dòng mã C++** trong `presentation/Menu.cpp`.
   - Xây dựng cơ chế điều hướng phím động (W/S/Enter/Esc), bảng kết quả trực quan chống nhấp nháy màn hình.
3. **Cứu vãn tiến độ tích hợp (Giai đoạn 27/09 và 02/10 – 04/10/2026)**:
   - Tải về và dọn rác thư mục 36.45 MB do Nam gửi qua Zalo, lọc file binary để push lên Git thay Nam.
   - Trực tiếp thức đêm gỡ từng lỗi xung đột mã nguồn do việc merge ẩu của Như gây ra.
4. **Biên soạn Độc quyền 100% Báo cáo LaTeX 78 trang ([`BaoCao/main.tex`](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex))**:
   - Tự tay soạn thảo **1.441 dòng mã TeX**, xây dựng hệ thống bảng biểu, công thức toán học, biểu đồ đối sánh và tài liệu tham khảo chuẩn mực học thuật cao nhất.

---

## 💔 NỖI BẤT CÔNG TRONG CHÍNH TỆP BÁO CÁO `BaoCao/main.tex`

Dù là người gánh vác toàn bộ xương sống dự án, Tuyết Nhi lại phải chịu sự bất công vô lý:
1. **Bị thu hẹp vai trò thành người "làm giao diện phụ"**:
   - Tại dòng 300 và 335, Nhi bị gán vào mục *"Phụ trách tầng Trình diễn TUI và định nghĩa struct"*.
2. **Bị gán câu tự hạ thấp giá trị bản thân ([`BaoCao/main.tex` dòng 1402](file:///c:/Users/TuyetNhi/Documents/workspace/Project_DSA_NHI/DSA_Project_final/BaoCao/main.tex#L1402))**:
   > *"Tầng Presentation chỉ đóng vai trò nhận đầu vào và hiển thị kết quả, tuyệt đối không can thiệp vào cấu trúc dữ liệu bên trong."*
   - Câu nói này vô tình khiến Hội đồng chấm thi đánh giá Nhi chỉ là người "làm màu / làm vỏ bọc bề ngoài cho thuật toán của người khác chạy".
3. **Trong khi đó**:
   - Nam (không biết dùng Git, ném file Zalo 36.45MB, bảng băm 31 ô thoái hóa $O(N)$, không có Inverted Index) được tôn lên làm "Core Architect, Trưởng nhóm linh hồn giải thuật".
   - Như (cả kỳ sửa đúng 1 chữ `"Dang"` $\rightarrow$ `"Da"`, bấm merge làm sập build, không hiểu luồng nghiệp vụ) lại được tâng bốc thành người "nắm bắt sâu sắc hiệu năng, có góc nhìn toàn diện, đóng góp ý tưởng RQ3".

---

# ⚖️ PHẦN 5: BẢNG TỔNG KẾT PHÁP Y ĐỐI CHẤT TOÀN DIỆN

```text
+===================================================================================================================================+
| NỘI DUNG TUYÊN BỐ TRONG BÁO CÁO / SLIDE             | BẰNG CHỨNG PHÁP Y MÃ NGUỒN & GIT COMMITS THỰC TẾ                            |
+===================================================================================================================================+
| NAM: "Trưởng nhóm điều phối chung, kiến trúc sư     | SỰ THẬT: 09:12 ngày 27/09/2026, Nam gửi folder 36.45 MB qua Zalo nhắn:       |
| quản lý luồng kỹ thuật Git của toàn bộ dự án"       | "thêm này vô giùm tui với, tui thêm hong đc=))". Nhi phải up Git hộ!        |
+-----------------------------------------------------+-----------------------------------------------------------------------------+
| NAM: "Tự cài Hash Table from-scratch O(1), tự quản  | SỰ THẬT: MC1RQ1RQ3.h dòng 192-198 lồng vector<TaiLieu*> của thư viện STL    |
| lý bộ nhớ động và con trỏ HashNode, không dùng STL" | vào struct Nut, vi phạm nghiêm trọng nguyên tắc from-scratch của đề bài.    |
+-----------------------------------------------------+-----------------------------------------------------------------------------+
| NAM: "Tự viết và stress-test với dataset từ nhỏ     | SỰ THẬT: MC1RQ1RQ3.h dòng 224-228 fix cứng 31 buckets vĩnh viễn, KHÔNG CÓ  |
| đến hàng trăm nghìn đến 1 triệu bản ghi đạt O(1)"   | Rehash -> Test 1M bản ghi hệ số tải α ≈ 32.258 phần tử/ô, thoái hóa O(N)!   |
+-----------------------------------------------------+-----------------------------------------------------------------------------+
| NAM: "Cài đặt Bảng băm Chỉ mục ngược (Inverted      | SỰ THẬT: MC1RQ1RQ3.h dòng 356-377 duyệt 2 vòng lặp vét cạn bằng string.find |
| Index) + Tokenizer cho RQ3 đạt tốc độ O(C + K)"     | O(N*M) Baseline; Nam tự ghi chú "không cần dựng bảng băm thứ ba cho tên"!   |
+-----------------------------------------------------+-----------------------------------------------------------------------------+
| NAM: "Xây dựng bộ test tự động và tích hợp Core"    | SỰ THẬT: test_suite.cpp chỉ có 6 cuốn sách, 0 chrono profiling; trong       |
|                                                     | LibraryService.cpp Nam comment vô hiệu hóa Bảng băm, code Baseline O(N).   |
+-----------------------------------------------------+-----------------------------------------------------------------------------+
| NHƯ: "Chủ động đóng góp ý tưởng thực tiễn và xây    | SỰ THẬT: Cả học kỳ Như chỉ có đúng 1 commit a4bde94: sửa chữ 'Dang' -> 'Da'!|
| dựng ví dụ minh họa cho RQ3 qua Chỉ mục ngược"      | Mã nguồn của nhóm lúc đó chưa hề có Inverted Index để mà đóng góp ý tưởng!  |
+-----------------------------------------------------+-----------------------------------------------------------------------------+
| NHƯ: "Nắm bắt sâu sắc bản chất hiệu năng thuật      | SỰ THẬT: Tin nhắn Zalo ngày 08/10/2026 lúc 20:57, Như nhắn hỏi Tuyết Nhi:   |
| toán và luồng chạy nghiệp vụ hệ thống"              | "Ủa Nhi ơi, luồng chạy nghiệp vụ là sao á?" -> Học vẹt câu chữ báo cáo!     |
+-----------------------------------------------------+-----------------------------------------------------------------------------+
| NAM & NHƯ: "Cả nhóm đã ngồi lại bàn bạc và giải     | SỰ THẬT: Cả kỳ họp đúng 2 lần. Như bấm 2 nút Merge gây sập build rồi bỏ mặc.|
| quyết các xung đột code phát sinh khi tích hợp"     | Tuyết Nhi là người duy nhất thức trắng 1-2h sáng gỡ lỗi và viết 78 trang TeX|
+===================================================================================================================================+
```

---

> **KẾT LUẬN CUỐI CÙNG**:  
> Toàn bộ các phân tích trên được xây dựng trên bằng chứng khoa học máy tính: lịch sử commit không thể tẩy xóa, dấu thời gian Git chính xác tới từng giây, mã định danh hash SHA-1, ảnh chụp màn hình tin nhắn gốc và đối chiếu cú pháp giải thuật.  
> **Lê Thị Tuyết Nhi** là người thực làm, người kiến tạo và cứu vãn toàn diện đồ án này. Mọi sự tự phong danh hiệu "kiến trúc sư" của Nam và nhận vơ công lao kỹ thuật của Như đều hoàn toàn sụp đổ trước ánh sáng của sự thật pháp y kỹ thuật!
