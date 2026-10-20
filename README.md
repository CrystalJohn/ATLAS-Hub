# ATLAS

**Learn a little. Explore a lot.**

ATLAS là ứng dụng học tiếng Anh qua khám phá và giải quyết tình huống. Người chơi đọc manh mối, trò chuyện với nhân vật, hoàn thành nhiệm vụ và lưu lại từ vựng trong hành trình của mình.

Repository chứa giao diện React, nội dung học, bộ đánh giá nhiệm vụ và hai adapter lưu trữ: **Next.js + Supabase** cho luồng đăng nhập Google hiện tại, và **Vinext + Cloudflare D1** cho bản Sites trước đó.

## Tính năng hiện có

- **Nature Realm — Forest of Origins:** ba nhiệm vụ quan sát khu rừng, điều tra hồ nước và khôi phục hệ sinh thái.
- **World Travel:** bản đồ chọn quốc gia; Nhật Bản có bốn điểm chơi tại sân bay, Shibuya, quán mì và Asakusa. Các quốc gia khác có trạng thái xem trước hoặc sắp có theo catalog, chưa phải tất cả đều có nhiệm vụ.
- **Luyện tiếng Anh:** bài đọc và từ vựng theo mục tiêu A1, A2, B1, B2; giải nghĩa từ, IPA, ví dụ và sổ từ đã lưu.
- **Tiến trình:** XP, cấp nhân vật, mở khóa nhiệm vụ, huy hiệu và dấu hộ chiếu. Server chấm kết quả và ghi thưởng lần đầu; chơi lại không cộng thưởng trùng.
- **Tài khoản:** Google qua Supabase Auth; onboarding đặt tên, avatar hoặc chữ viết tắt, Profile, Settings và Sign out.
- **Sở thích khám phá:** chọn nhiều chủ đề thiên nhiên, du lịch, ẩm thực, văn hóa hoặc bỏ qua; sửa trong Profile. Journey ưu tiên gợi ý từ nội dung hiện có và đã mở, không thay đổi XP hay thứ tự mở khóa. Chủ đề ở chặng sau được giới thiệu qua hành trình đang mở.
- **Ngôn ngữ:** nút EN/VI đổi ngôn ngữ giao diện và nhớ trên trình duyệt. Hỗ trợ tiếng Việt trong bài học là tùy chọn riêng, lưu cùng reading target trong profile tài khoản.

Reading target là độ khó nội dung muốn luyện, độc lập với cấp nhân vật. Kết quả nhiệm vụ không phải chứng nhận CEFR; ứng dụng chưa đánh giá nghe/nói và nội dung học vẫn cần thẩm định chuyên môn.

## Chạy local với Google và Supabase

### 1. Cài thư viện

Yêu cầu **Node.js từ 22.13.0** và **pnpm 11.25.0**. Các lệnh dưới đây dùng PowerShell trên Windows.

```powershell
cd D:\ATLAS-Hub
pnpm.cmd install --frozen-lockfile
```

Nếu chưa có pnpm: `npm.cmd install -g pnpm@11.25.0`.

### 2. Tạo cấu hình được Next nạp

```powershell
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Điền giá trị của project Supabase vào **`.env.local`**:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET
```

`.env.example` chỉ là mẫu; Next không nạp file này. `.env.local` được Git bỏ qua. Server secret chỉ dùng phía server và không được thêm tiền tố `NEXT_PUBLIC_`.

### 3. Chuẩn bị schema Supabase

Các migration được quản lý trong Git và có thể áp dụng bằng terminal. Lần đầu trên một máy, đăng nhập CLI và liên kết đúng project đã khai báo ở `.env.local`:

```powershell
npx.cmd --yes supabase@2.121.0 login
npx.cmd --yes supabase@2.121.0 link --project-ref YOUR_PROJECT_REF
```

Mỗi khi có migration mới:

```powershell
npx.cmd --yes supabase@2.121.0 db push --linked --dry-run --skip-vault
npx.cmd --yes supabase@2.121.0 db push --linked --skip-vault
npx.cmd --yes supabase@2.121.0 migration list --linked
```

Dry-run hiển thị SQL đang chờ; `db push` áp dụng và ghi lịch sử, những lần sau chỉ chạy migration còn thiếu. Không cần mở Dashboard mỗi lần. CLI tự đọc file trong `supabase/migrations/`; việc push GitHub riêng lẻ không áp dụng SQL. Project link được lưu trong `.temp` và không đưa lên Git. Các migration hiện có, theo thứ tự:

1. [`atlas_expeditions`](supabase/migrations/20261020090000_atlas_expeditions.sql): tiến trình, nhiệm vụ, thưởng và từ đã lưu.
2. [`atlas_profiles`](supabase/migrations/20261020110000_atlas_profiles.sql): tên hiển thị, hỗ trợ tiếng Việt và reading target.
3. [`atlas_profile_interests`](supabase/migrations/20261020130000_atlas_profile_interests.sql): thêm danh sách sở thích vào profile; chạy cả khi bảng profile đã có từ trước.

Cả hai gắn với `auth.users.id`. Profile nằm ở bảng riêng, không cập nhật document XP/progression. Browser không có quyền ghi trực tiếp vào các bảng này; các thao tác đi qua API của ứng dụng.

Việc chạy app hoặc đăng nhập **không tự áp dụng migration**. Nếu thiếu `atlas_profiles`, đăng nhập và tải expedition vẫn có thể thành công nhưng `/api/profile` sẽ trả `PROFILE_SETUP_REQUIRED`. SQL Editor vẫn là lựa chọn thủ công; nên dùng CLI để giữ lịch sử nhất quán với repository.

### 4. Cấu hình Google

- Bật Google provider trong Supabase Authentication và điền Google Client ID/Client Secret.
- Trong Google OAuth client, dùng callback do Supabase cung cấp: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`.
- Trong Supabase Authentication → URL Configuration → Redirect URLs, thêm `http://localhost:3000/auth/callback`.
- Nếu sử dụng `127.0.0.1` thay cho `localhost`, thêm riêng `http://127.0.0.1:3000/auth/callback`. Hai hostname có cookie và callback riêng; nên dùng nhất quán một địa chỉ.

### 5. Khởi động

```powershell
pnpm.cmd dev:supabase
```

Mở **[http://localhost:3000](http://localhost:3000)**, đăng nhập Google rồi đặt tên người chơi. Giữ cửa sổ PowerShell đang chạy; dừng bằng **Ctrl+C**. Sau khi sửa `.env.local`, khởi động lại server nếu cấu hình chưa được nạp.

## Xem thử giao diện mà không cần Google

```powershell
pnpm.cmd preview:profile
```

Mở một trong hai đường dẫn tạo phiên thử:

- [Tài khoản Alice](http://127.0.0.1:43219/login/alice)
- [Tài khoản Bob](http://127.0.0.1:43219/login/bob)

Các link chuyển tới giao diện tại `http://127.0.0.1:3211`. Chế độ này dùng provider và dữ liệu mô phỏng trong bộ nhớ; không dùng cấu hình Supabase thật trong `.env.local`. Dữ liệu mất khi dừng server. Mở trực tiếp cổng 3211 mà chưa đi qua link tạo phiên sẽ yêu cầu đăng nhập; Google thật bị tắt trong fixture này.

## Các chế độ và lệnh

| Lệnh | Mục đích |
| --- | --- |
| `pnpm.cmd dev:supabase` | Native Next.js, Google/Supabase thật, cổng 3000 |
| `pnpm.cmd preview:profile` | Next.js với provider mô phỏng; vào bằng link cổng 43219 |
| `pnpm.cmd dev` | Adapter Sites/Vinext cũ; portable mặc định cổng 5173 |
| `pnpm.cmd build` | Kiểm tra nội dung rồi build theo execution profile; có `VERCEL=1` sẽ build native Next |
| `pnpm.cmd start` | Chạy Worker đã build qua Wrangler local; không phải lệnh chạy native Next |
| `pnpm.cmd db:generate` | Sinh migration Drizzle cho D1; không áp dụng migration Supabase |

Build native Next trên PowerShell:

```powershell
$env:VERCEL = '1'
pnpm.cmd build
```

Build không deploy và không tạo bảng Supabase. Bản Sites dùng danh tính Sites và D1 riêng; repository không tự liên kết hoặc chuyển tiến trình Sites sang tài khoản Google.

## Kiến trúc

| Thành phần | Vị trí |
| --- | --- |
| Giao diện, tài khoản, bài học và bản đồ | `app/`, `app/components/` |
| Nội dung nhiệm vụ, tiếng Anh, bằng chứng và du lịch | `content/` |
| Quy tắc tiến trình và projection | `packages/domain/src/` |
| Chấm nhiệm vụ và hành động du lịch | `packages/mission-engine/src/` |
| Đánh giá bài luyện tiếng Anh | `packages/english-engine/src/` |
| API chung, storage adapter, profile handler | `lib/atlas/` |
| Supabase server clients và cấu hình | `lib/supabase/` |
| Schema Supabase / schema D1 | `supabase/migrations/` / `drizzle/` |
| Kiểm thử và công cụ chạy local | `scripts/` |

API xác thực Supabase user trên server rồi dùng UUID đó để truy cập dữ liệu của tài khoản. Expedition dùng revision và compare-and-swap để giữ đồng bộ tiến trình, lượt làm và reward ledger khi có nhiều request đồng thời. Profile chỉ cập nhật tên, sở thích và tùy chọn học. Bộ chấm dùng nội dung/quy tắc định sẵn; không có lời gọi LLM để chấm đáp án trong luồng hiện tại.

## Kiểm thử

```powershell
node scripts/test-profile.mts
node scripts/test-interests.mts
node scripts/test-supabase.mts
node scripts/test-chapter-ui.mts
node scripts/test-atlas.mts
node scripts/test-travel.mts
node scripts/test-chapter.mts
node scripts/test-vocabulary.mts
```

- `test-profile` và `test-supabase`: SDK/API với PostgREST fixture; danh tính, cô lập tài khoản, validation, lưu profile và bảo vệ thưởng.
- `test-interests`: gợi ý theo chủ đề, giữ nguyên điều kiện mở khóa và không sửa tiến trình.
- `test-chapter-ui`: render component, ngôn ngữ giao diện và hỗ trợ bài học; không phải kiểm thử tương tác trình duyệt.
- Các bài kiểm thử D1 chạy bằng Miniflare local, bao gồm lưu tiến trình và concurrent/replay protection.
- Sau native Next build: `pnpm.cmd test:auth:http` kiểm tra các route HTTP với provider mô phỏng.
- Khi `preview:profile` đang chạy: `node scripts/test-profile-http.mts` kiểm tra profile qua HTTP và xác nhận expedition không đổi sau cập nhật profile.

Các fixture không xác minh Google OAuth hoặc quyền/schema PostgreSQL thật. Kết quả kiểm tra, giới hạn và phạm vi browser QA được ghi tại [báo cáo tài khoản](docs/account-profile-verification.md), [báo cáo đăng nhập](docs/auth-01/verification.md) và [báo cáo World Travel](docs/world-travel/verification.md).

## Chẩn đoán lỗi

| Dấu hiệu | Ý nghĩa / bước kiểm tra |
| --- | --- |
| `401 SIGN_IN_REQUIRED` | Chưa có phiên hợp lệ; đăng nhập ở đúng hostname. Trong fixture, mở link `/login/alice` hoặc `/login/bob`. |
| `503 ACCOUNT_CONFIGURATION_REQUIRED` | Thiếu/sai biến môi trường đang được server nạp; kiểm tra `.env.local`, không phải `.env.example`. |
| `503 PROFILE_SETUP_REQUIRED` | Data API không tìm thấy bảng profile trong schema cache; kiểm tra project/schema và migration `atlas_profiles`. |
| `503 PROFILE_SCHEMA_UPDATE_REQUIRED` khi lưu sở thích | Bảng profile còn thiếu cột; review và áp dụng migration `atlas_profile_interests` trên đúng project. Đọc profile cũ vẫn hoạt động; form giữ lựa chọn để thử lại. |
| `503 PROFILE_UNAVAILABLE` | Lỗi profile khác; cần kiểm tra kết nối, key và quyền truy cập. |
| `503 DATABASE_SETUP_REQUIRED` | Schema expedition chưa sẵn sàng. |
| `/auth/error?reason=unavailable` | Google provider của backend đang dùng không bật; fixture cố ý tắt Google thật. |

**`GET /api/health` hiện chỉ kiểm tra `atlas_expeditions`. HTTP 200 ở health không chứng minh bảng profile đã có.** Xem [trace `PROFILE_SETUP_REQUIRED`](docs/troubleshooting/PROFILE_SETUP_REQUIRED.md) để biết chuỗi lỗi và cách xử lý.

Hướng dẫn Windows chi tiết: [LOCAL-DEVELOPMENT.md](docs/LOCAL-DEVELOPMENT.md). Tài liệu adapter Sites trước đó: [ATLAS-SITES.md](ATLAS-SITES.md); một số phần là lịch sử triển khai, không thay thế hướng dẫn Supabase hiện tại ở trên.
