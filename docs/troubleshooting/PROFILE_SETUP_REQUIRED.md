# Trace: HTTP 503 / PROFILE_SETUP_REQUIRED

## Kết luận hiện tại

Kiểm tra chỉ đọc ngày **2026-10-20** bằng cấu hình `.env.local` đang có:

| Kiểm tra | Kết quả |
| --- | --- |
| Supabase Auth settings | HTTP 200; Google enabled |
| Data API: `atlas_expeditions`, select `player_id`, limit 0 | HTTP 200 |
| Data API: `atlas_profiles`, select `player_id`, limit 0 | HTTP 404; `PGRST205` |

Data API của project đang cấu hình không tìm thấy `public.atlas_profiles` trong schema cache. Đây là nguyên nhân trực tiếp dẫn tới mã `PROFILE_SETUP_REQUIRED` trên ảnh. Không có key/token, nội dung profile hay dữ liệu người chơi nào được đưa vào báo cáo.

Kết quả này chưa phân biệt tuyệt đối bảng chưa được tạo với bảng đã tạo ở project/schema khác hoặc cache chưa cập nhật. Nó không phải bằng chứng Google bị tắt, người chơi nhập tên sai hay mất XP.

## Chuỗi thực thi

1. `/api/session` xác thực user và tải expedition qua [`handleVercelAtlas`](../../lib/atlas/vercel-handler.ts). Việc này có thể thành công dù profile chưa có schema.
2. Khi có session, [`useAccountProfile`](../../app/components/useAccountProfile.ts) gọi `GET /api/profile`.
3. API xác thực Supabase user lần nữa, rồi chuyển request sang [`handlePlayerProfile`](../../lib/atlas/profile-handler.ts).
4. Handler chạy truy vấn:

   ```typescript
   client.from('atlas_profiles')
     .select('player_id,display_name,vietnamese_support,reading_band')
     .eq('player_id', user.id)
     .maybeSingle()
   ```

5. Supabase Data API trả `404 / PGRST205`. Handler ánh xạ `PGRST205` hoặc `42P01` sang HTTP 503 với `code: PROFILE_SETUP_REQUIRED`.
6. [`AtlasApiError`](../../app/components/chapter-types.ts) giữ mã lỗi. Hook chuyển mã đó cho [`AccountSetup`](../../app/components/AccountMenu.tsx), rồi [`AdventureRecovery`](../../app/components/AdventureRecovery.tsx) hiển thị nhánh “Your adventure is almost ready”.

Nút Try again chỉ gọi lại API; nó không tạo bảng hoặc áp dụng SQL. Lỗi schema sẽ còn cho đến khi schema/cache của đúng project sẵn sàng.

Một tài khoản mới **chưa có dòng profile** là trường hợp khác: `maybeSingle()` trả `data: null` mà không lỗi, API trả HTTP 200 với tên rỗng để mở onboarding. Không có dòng profile không dẫn tới mã lỗi trên ảnh.

## Cách xử lý

1. Mở đúng project Supabase tương ứng với `NEXT_PUBLIC_SUPABASE_URL` trong `.env.local`.
2. Trong SQL Editor, kiểm tra chỉ đọc:

   ```sql
   select to_regclass('public.atlas_profiles') as profile_table;
   ```

3. Nếu kết quả là `null`, review rồi chạy đầy đủ migration [`20261020110000_atlas_profiles.sql`](../../supabase/migrations/20261020110000_atlas_profiles.sql) trong SQL Editor của project đó. Migration tạo profile, bật RLS và cấp quyền cho service role; không sửa `atlas_expeditions`, XP hay reward ledger.
4. Nếu bảng đã có trong đúng `public` schema nhưng Data API vẫn trả `PGRST205`, kiểm tra schema được expose và schema cache. Sau khi kiểm tra đúng schema, có thể yêu cầu PostgREST reload cache:

   ```sql
   notify pgrst, 'reload schema';
   ```

5. Quay lại app và bấm **Try again**. Kỳ vọng `/api/profile` trả HTTP 200; tài khoản chưa đặt tên sẽ thấy onboarding, tài khoản đã có tên sẽ vào hành trình.

`GET /api/health` hiện chỉ đọc bảng expedition. Do đó health 200 cùng với profile 503 là hai kết quả có thể xảy ra đồng thời.

## Phạm vi phiên trace

- Đã đọc code và kiểm tra lại provider/schema qua request chỉ đọc.
- Đã cập nhật README và lưu báo cáo này.
- Chưa chạy migration, reload schema cache, sửa quyền, tạo profile hay ghi dữ liệu trên Supabase thật.
- Chưa commit, push hoặc deploy.
