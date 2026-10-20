# Chạy ATLAS local trên Windows

Thư mục: `D:\ATLAS-Hub`. Branch đang làm: `fix/vercel-preview-build`.
Xem README để biết các thay đổi và quy trình migration bằng terminal.

## 1. Xem và thử ngay, không cần tài khoản Google

Mở PowerShell tại thư mục dự án:

```powershell
cd D:\ATLAS-Hub
pnpm.cmd install --frozen-lockfile
pnpm.cmd preview:profile
```

Nếu thư viện đã được cài và chưa thay đổi dependency thì bỏ qua dòng install.
Yêu cầu Node.js 22.13 trở lên và pnpm; dự án khóa pnpm 11.25.0.

Giữ cửa sổ PowerShell đang chạy rồi mở:

- Tài khoản thử thứ nhất: http://127.0.0.1:43219/login/alice
- Tài khoản thử thứ hai: http://127.0.0.1:43219/login/bob

Các link này chuyển tới app tại http://127.0.0.1:3211.
Đăng nhập lần đầu sẽ hiện form đặt tên và chọn sở thích (có thể bỏ qua). Nút VI/EN trên navbar đổi ngôn ngữ giao diện; Profile cho phép sửa tên và sở thích, Cài đặt chứa mức bài đọc và hỗ trợ tiếng Việt trong bài học.

Chế độ này dùng Supabase mô phỏng trên máy, không ghi vào Supabase thật. Profile/XP được giữ khi reload nhưng mất khi dừng server. Ngôn ngữ giao diện được nhớ riêng trên trình duyệt. Dừng bằng **Ctrl+C**.

## 2. Chạy với Google và Supabase thật

1. Sao chép `.env.example` thành `.env.local` nếu chưa có, rồi tự điền ba giá trị:

```powershell
Copy-Item .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET
```

`.env.local` được Git bỏ qua. Giữ secret trên máy, không đưa vào chat hay mã nguồn. Không chạy lệnh sao chép đè lên `.env.local` đã cấu hình.

2. Đảm bảo project Supabase đã có các migration theo thứ tự:
   - `supabase/migrations/20261020090000_atlas_expeditions.sql`
   - `supabase/migrations/20261020110000_atlas_profiles.sql`
   - `supabase/migrations/20261020130000_atlas_profile_interests.sql`

Áp dụng từ terminal theo [hướng dẫn CLI trong README](../README.md#3-chuẩn-bị-schema-supabase). Lần đầu dùng `supabase login` và `supabase link`; các lần sau chạy dry-run, `db push --linked --skip-vault`, rồi `migration list --linked`. Không cần mở SQL Editor mỗi lần. Không dùng `db reset` với database đang có dữ liệu.

3. Bật Google provider trong Supabase. Giữ callback của Google trỏ về `https://YOUR_PROJECT.supabase.co/auth/v1/callback`. Trong Supabase Authentication → URL Configuration → Redirect URLs, thêm chính xác `http://localhost:3000/auth/callback`.

4. Chạy:

```powershell
pnpm.cmd dev:supabase
```

Mở http://localhost:3000 và chọn đăng nhập Google. Chế độ này sử dụng dữ liệu Supabase thật; tiến trình và profile lưu theo UUID của tài khoản đã xác thực. Dừng bằng **Ctrl+C**.

`pnpm dev` cũ chạy adapter Sites/Vinext, không phải chế độ Supabase trên branch này. Để thử phần tài khoản mới, dùng một trong hai cách trên.

## Lỗi thường gặp

- **Đã điền cấu hình nhưng vẫn 503:** Next không nạp `.env.example`. Cần có `.env.local` hoặc `.env` trong thư mục dự án. Sau khi tạo file, dừng/chạy lại `pnpm.cmd dev:supabase` nếu server chưa nạp cấu hình mới. Không đặt secret thật trong file mẫu được Git theo dõi.
- **Google đăng nhập được nhưng profile vẫn 503:** nếu response có `PROFILE_SETUP_REQUIRED`, bảng `atlas_profiles` chưa được tạo. Review rồi chạy nội dung `supabase/migrations/20261020110000_atlas_profiles.sql` trong SQL Editor của đúng project Supabase. Phiên làm việc chỉ chuẩn bị SQL, không tự áp dụng lên DB thật.
- **Profile đọc được nhưng lưu sở thích báo `PROFILE_SCHEMA_UPDATE_REQUIRED`:** review rồi áp dụng `supabase/migrations/20261020130000_atlas_profile_interests.sql`. Migration chỉ thêm cột sở thích, không sửa expedition/XP. Form giữ lựa chọn hiện tại để thử lưu lại sau khi schema sẵn sàng.
- **Port đang được dùng:** dừng cửa sổ server local cũ bằng Ctrl+C rồi chạy lại. Không mở hai chế độ cùng lúc trong checkout này.
- **Không tìm thấy pnpm:** cài từ registry bằng `npm.cmd install -g pnpm@11.25.0`, rồi mở lại PowerShell.
- **Không lưu được profile trên Supabase thật:** kiểm tra migration `atlas_profiles` và server secret.
- **Đăng nhập quay về trang lỗi:** kiểm tra Google provider và Redirect URL khớp với địa chỉ đang mở.
- **Đổi tài khoản thử:** mở link `/login/alice` hoặc `/login/bob`; hai tài khoản dùng cookie trên cùng trình duyệt nên link mới thay thế phiên hiện tại.
