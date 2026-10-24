# Chạy ATLAS local trên Windows

Thư mục: `D:\ATLAS-Hub`. Runtime duy nhất: native Next.js + Supabase PostgreSQL.
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
Nếu chạy qua một domain HTTPS hoặc preview alias, thêm origin chính xác vào `ATLAS_AUTH_ALLOWED_ORIGINS` và thêm callback `/auth/callback` tương ứng trong Supabase Redirect URLs. Localhost/127.0.0.1 không cần biến này ở chế độ `dev`; với `build` + `start`, đặt `ATLAS_AUTH_ALLOWED_ORIGINS=http://localhost:3000` (hoặc đúng origin loopback đang dùng).

2. Đảm bảo project Supabase đã có các migration theo thứ tự:
   - `supabase/migrations/20261020090000_atlas_expeditions.sql`
   - `supabase/migrations/20261020110000_atlas_profiles.sql`
   - `supabase/migrations/20261020130000_atlas_profile_interests.sql`
   - `supabase/migrations/20261021090000_auth02_expedition_integrity.sql` (review/readiness trước khi áp dụng staging/production)

Áp dụng từ terminal theo [hướng dẫn CLI trong README](../README.md#3-chuẩn-bị-schema-supabase). Lần đầu dùng `supabase login` và `supabase link`; các lần sau chạy dry-run, `db push --linked --skip-vault`, rồi `migration list --linked`. Không cần mở SQL Editor mỗi lần. Không dùng `db reset` với database đang có dữ liệu.

3. Bật Google provider trong Supabase. Giữ callback của Google trỏ về `https://YOUR_PROJECT.supabase.co/auth/v1/callback`. Trong Supabase Authentication → URL Configuration → Redirect URLs, thêm chính xác `http://localhost:3000/auth/callback`.

4. Chạy:

```powershell
pnpm.cmd dev:supabase
```

Mở http://localhost:3000 và chọn đăng nhập Google. Chế độ này sử dụng dữ liệu Supabase thật; tiến trình và profile lưu theo UUID của tài khoản đã xác thực. Dừng bằng **Ctrl+C**.

`pnpm.cmd dev` cũng chạy native Next/Supabase. `pnpm.cmd build` rồi `pnpm.cmd start` chạy bản production local; không cần biến `VERCEL`. D1 không còn là nhánh runtime. Để kiểm thử AUTH-02 với PostgreSQL thật và user test riêng, xem các lệnh `test:auth02`, `test:auth02:http` và `preview:auth02` trong README; fixture Auth không xác minh Google OAuth.

## Lỗi thường gặp

- **Hydration mismatch có `bis_skin_checked`, `bis_register` hoặc `__processed_...`:** đây là thuộc tính extension chèn vào DOM trước khi React khởi tạo. Trên máy đã trace được `bis_*` trong script của **Urban VPN Proxy** (ID `eppiocemhmnlbhjplcgkofciiegomcon`). Mở `chrome://extensions` hoặc `brave://extensions`, vào Chi tiết của extension và giới hạn quyền truy cập trang để không chạy trên `localhost`/`127.0.0.1`; nếu extension không cho loại trừ local, tạm tắt nó khi phát triển. Sau đó tải lại bằng **Ctrl+Shift+R**. Có thể đối chiếu bằng Guest profile hoặc cửa sổ riêng tư không cho phép extension. Không thêm `suppressHydrationWarning` hàng loạt: nó chỉ giấu cảnh báo và không ngăn extension sửa HTML. Kiểm tra ngày 2026-10-24: server không trả các thuộc tính này; Chrome sạch không báo hydration mismatch khi mở trang và reload sau khi lưu tiếng Việt. Xem [hướng dẫn Next.js](https://nextjs.org/docs/messages/react-hydration-error).
- **Đã điền cấu hình nhưng vẫn 503:** Next không nạp `.env.example`. Cần có `.env.local` hoặc `.env` trong thư mục dự án. Sau khi tạo file, dừng/chạy lại `pnpm.cmd dev:supabase` nếu server chưa nạp cấu hình mới. Không đặt secret thật trong file mẫu được Git theo dõi.
- **Google đăng nhập được nhưng profile vẫn 503:** nếu response có `PROFILE_SETUP_REQUIRED`, kiểm tra đúng project và migration `supabase/migrations/20261020110000_atlas_profiles.sql`. Review rồi áp dụng bằng CLI theo README; chạy app không tự tạo schema.
- **Profile đọc được nhưng lưu sở thích báo `PROFILE_SCHEMA_UPDATE_REQUIRED`:** review rồi áp dụng `supabase/migrations/20261020130000_atlas_profile_interests.sql`. Migration chỉ thêm cột sở thích, không sửa expedition/XP. Form giữ lựa chọn hiện tại để thử lưu lại sau khi schema sẵn sàng.
- **Port đang được dùng:** dừng cửa sổ server local cũ bằng Ctrl+C rồi chạy lại. Không mở hai chế độ cùng lúc trong checkout này.
- **Không tìm thấy pnpm:** cài từ registry bằng `npm.cmd install -g pnpm@11.25.0`, rồi mở lại PowerShell.
- **Không lưu được profile trên Supabase thật:** kiểm tra migration `atlas_profiles` và server secret.
- **Đăng nhập quay về trang lỗi:** kiểm tra Google provider và Redirect URL khớp với địa chỉ đang mở.
- **Đổi tài khoản thử:** mở link `/login/alice` hoặc `/login/bob`; hai tài khoản dùng cookie trên cùng trình duyệt nên link mới thay thế phiên hiện tại.
