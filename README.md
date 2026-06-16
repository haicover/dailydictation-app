# 🚀 DailyDictation Study Planner & Progress Tracker

Ứng dụng **DailyDictation Study Planner & Progress Tracker** là một công cụ lập kế hoạch học tập cá nhân và theo dõi tiến độ dành riêng cho trang web học tiếng Anh [DailyDictation.com](https://dailydictation.com/exercises). 

Dự án được xây dựng với kiến trúc **Serverless tĩnh (chạy 100% phía Client)**, lưu trữ dữ liệu an toàn trong `localStorage` của trình duyệt và hỗ trợ deploy lên **Vercel** hoàn toàn miễn phí. Bên cạnh đó, dự án vẫn cung cấp một server Node.js/Express chạy local dự phòng để lưu tiến độ dưới dạng tệp tin JSON nếu cần.

---

## 🌟 10 Tính Năng Nổi Bật Đã Hoàn Thành

1. **Chủ Đề Sáng/Tối (Light/Dark Mode Toggle)**: Chuyển đổi mượt mà giữa giao diện Obsidian (Dark) và Clean White (Light) để bảo vệ mắt.
2. **Chuỗi Ngày Chăm Chỉ (Daily Streak Counter 🔥)**: Theo dõi số ngày học liên tục. Nếu hôm nay bạn đồng bộ bài mới, streak sẽ tăng. Nếu bỏ học quá 24h, streak reset về 0.
3. **Nhật Ký Học Hôm Nay (Daily Study Log 📅)**: So sánh dữ liệu đồng bộ mới và cũ để liệt kê chính xác các bài bạn đã hoàn thành trong ngày hôm nay.
4. **Ước Tính Thời Gian Học (Study Time Tracker ⏳)**: Tự động tính toán tổng số giờ luyện nghe thực tế dựa trên số bài đã làm (trung bình 6 phút/bài).
5. **Tìm Kiếm & Bộ Lọc Lộ Trình (Search & Filter 🔍)**: Tìm kiếm khóa học theo tên hoặc trình độ, lọc nhanh các khóa: *Chưa học*, *Đang học*, *Đã hoàn thành*.
6. **Sổ Tay Ghi Chú Từ Vựng (Personal Study Notes 📝)**: Cho phép ghi chú từ vựng khó, lưu ý phát âm trực tiếp cho từng khóa học thông qua hộp thoại chỉnh sửa.
7. **Huy Chương Thành Tích (Achievement Badges 🏆)**: 7 huy hiệu thành tích tự động mở khóa khi bạn đạt các mốc tiến độ hoặc chuỗi ngày học tập.
8. **Lời Nhắc Học Tập Hàng Ngày (Daily Reminders 🔔)**: Hiển thị banner nhấp nháy dễ thương nhắc nhở vào học nếu hôm nay bạn chưa học bài nào.
9. **Sao Lưu & Khôi Phục Dữ Liệu (Backup JSON File 💾)**: Cho phép tải về bản sao lưu chứa mọi dữ liệu tiến độ, streak, ghi chú để khôi phục hoặc chuyển đổi thiết bị.
10. **Tùy Biến Bỏ Qua Khóa Học (Exclude Courses 👁️)**: Ẩn/bỏ qua các khóa học bạn không quan tâm. Hệ thống sẽ loại bỏ các khóa này khỏi lộ trình và công thức tính thời gian hoàn thành.

---

## 🛠️ Kiến Trúc Và Cấu Trúc Dự Án

Dự án có cấu trúc thư mục tối giản, tải trang cực nhanh và không cần cơ sở dữ liệu bên ngoài:

```text
nifty-raman/
├── public/                 # Thư mục chứa tài nguyên Frontend
│   ├── app.js              # Logic xử lý chính, tính toán lộ trình & lưu trữ
│   ├── index.html          # Giao diện Dashboard (Obsidian Theme)
│   └── styles.css          # Định dạng giao diện, Dark/Light Mode, Animations
├── server.js               # Server Node.js/Express dự phòng (chạy local)
├── vercel.json             # File cấu hình deploy tĩnh lên Vercel
├── package.json            # Cấu hình dependencies Node.js
└── README.md               # Tài liệu hướng dẫn sử dụng (File này)
```

### 🗄️ Mô Kinh Lưu Trữ Dữ Liệu (LocalStorage Schema)
Mọi dữ liệu cá nhân của bạn được lưu trữ an toàn trong trình duyệt thông qua các khóa:
* `userProgress`: Lưu tiến độ của các khóa học (Completed/Total) và tên học viên.
* `studyStreak`: Lưu chuỗi streak hiện tại và ngày hoạt động gần nhất.
* `studyActivityLog`: Lưu lịch sử học tập hàng ngày (nhật ký hoàn thành bài).
* `courseNotes`: Lưu các ghi chú từ vựng cá nhân theo từng khóa học.
* `excludedCourses`: Lưu danh sách các khóa học đã được đánh dấu bỏ qua.
* `lessonsPerDay`: Lưu số bài học mục tiêu mỗi ngày (mặc định là 3).
* `appTheme`: Trạng thái theme sáng (`light`) hoặc tối (`dark`).

---

## 🔄 Giải Pháp Đồng Bộ Tiến Độ (Bookmarklet)

Do DailyDictation sử dụng cơ chế đăng nhập của Google và không có API công khai, dự án sử dụng **Browser Bookmarklet** (một đoạn mã JavaScript được lưu trên thanh dấu trang) để trích xuất dữ liệu một cách an toàn và bảo mật.

### Cách thức hoạt động:
1. Khi bạn nhấn vào Bookmarklet trên thanh dấu trang tại trang `dailydictation.com/exercises`:
2. Mã script sẽ bất đồng bộ gửi yêu cầu `fetch` tới 13 trang khóa học của DailyDictation ở chế độ ngầm.
3. Nó đếm số lượng sao vàng (`.bi-star-fill` - bài đã hoàn thành) và tổng số sao (`.bi-star, .bi-star-fill` - tổng số bài) của từng khóa học.
4. Trích xuất tên tài khoản đăng nhập của bạn.
5. Tổng hợp dữ liệu thành payload JSON dạng:
   ```json
   {
     "profileName": "Tên Của Bạn",
     "timestamp": "2026-06-17T03:00:00.000Z",
     "courses": [
       { "title": "IPA (Phát âm)", "link": "/exercises/english-pronunciation", "completed": 42, "total": 42 }
     ]
   }
   ```
6. **Cơ chế chuyển tiếp an toàn (CORS Bypass)**:
   * Đầu tiên, Bookmarklet sẽ thử gửi dữ liệu qua cổng API local `http://localhost:3000/api/sync` (nếu bạn đang bật server cục bộ).
   * Nếu server local offline (lỗi kết nối), nó sẽ tự động nén dữ liệu dưới dạng Base64 và chuyển hướng tab hiện tại về trang Vercel tĩnh của bạn với tham số hash URL: `https://your-app.vercel.app/#data=BASE64_DATA`.
   * Frontend trên Vercel sẽ đọc hash, giải mã Base64, so sánh lưu trữ vào `localStorage` và tự động làm sạch URL để giữ tính thẩm mỹ.

---

## 🚀 Hướng Dẫn Vận Hành Dự Án

### 💻 Chạy cục bộ (Local Server)
Nếu bạn muốn chạy ứng dụng ngay trên máy tính của mình và tự động lưu tiến độ vào tệp tin `progress.json`:

1. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
2. Khởi chạy server:
   ```bash
   npm start
   ```
3. Truy cập địa chỉ: **[http://localhost:3000](http://localhost:3000)**.

### ☁️ Triển khai lên Vercel (Khuyên Dùng)
Để chạy planner mọi lúc mọi nơi kể cả trên điện thoại di động:

1. Đẩy mã nguồn lên một repository GitHub mới của bạn.
2. Truy cập [Vercel](https://vercel.com/) và đăng nhập bằng tài khoản GitHub.
3. Chọn **Add New Project**, import repository vừa tạo.
4. Giữ nguyên cấu hình mặc định (Vercel tự nhận diện đây là static app) và bấm **Deploy**.
5. Sau khi hoàn thành, bạn sẽ có một đường dẫn ứng dụng công khai (dạng `https://ten-du-an.vercel.app`).
6. Kéo nút **Bookmarklet** trên trang web mới thả vào thanh dấu trang trình duyệt để bắt đầu học tập và đồng bộ!
