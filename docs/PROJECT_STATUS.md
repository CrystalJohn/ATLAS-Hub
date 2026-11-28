# Trạng thái dự án ATLAS

## Baseline ngày 26/11/2026

ATLAS Hub là ứng dụng production triển khai qua Vercel. Baseline AUD-01 là `074abe00f67b3376f8b31b96fff40b95035a5505`. Baseline Git hiện tại là `main` tại `e8477f887b4d310d12293e41db3eeacf3b64e653`, khớp `origin/main` lưu tại máy. Chỉ có một commit code sau AUD-01. Index và tracked working tree sạch tại thời điểm rà soát. AUD-01, mục 3.

| Mốc | Đối soát working tree |
| --- | --- |
| AUD-01 | Sáu tệp code/test đã sửa và bốn module mới chưa track. Commit `074abe0` đã chứa API client, DTO và quy tắc mở khóa Travel dùng chung. |
| SYN-01 | Bốn module mới vẫn untracked. Báo cáo AUD-01 nâng số tệp untracked lên năm. Hai tài liệu canonical mới nâng số đó lên bảy. |
| STAB-01 | `e8477f8` chứa đúng mười tệp code/test đã ghi ở AUD-01. Còn ba tệp untracked gồm `PRODUCT.md`, `PROJECT_STATUS.md` và báo cáo AUD-01 gốc. Hai tài liệu SYN-01 và báo cáo lịch sử có vòng duyệt riêng. |

Đường dẫn diff tái tạo là `git show 074abe0` cho hợp đồng đã có ở baseline và `git diff --name-status 074abe0..e8477f8` cho refactor đã commit. SHA Git đã biết. Ngày 27/11/2026, Product Owner chọn `e8477f8` làm candidate cho STAB-01B theo PD-12. Các ref lưu tại máy chỉ xác nhận baseline local.

## Phát hiện và ưu tiên

Mức P0–P2 dưới đây giữ theo AUD-01. Trạng thái và bước tiếp theo phản ánh quyết định đã ghi trong [PRODUCT.md](PRODUCT.md). AUD-01, mục 18.

| ID | Ưu tiên | Hiện trạng và việc tiếp theo | Nguồn |
| --- | --- | --- | --- |
| GAP-01 | P0 | Đã chốt hướng B2-first và knowledge-driven, giữ A1–B1. Cần đối chiếu catalog, độ phủ B2 và tiêu chí biên soạn trước khi lập roadmap nội dung. | [Chiến lược](PRODUCT.md#chiến-lược-đã-chốt), [ưu tiên biên soạn Tokyo](content-authoring/content-02a-tokyo/CONTENT-02A-final-report.md) |
| GAP-02 | P0 | Sổ từ lưu tham chiếu glossary. Cần xác định mục có ngữ cảnh, nhận diện trùng và khả năng đọc dữ liệu cũ trước khi mở rộng Library. | [Client](../app/components/SavedVocabulary.tsx), [handler Vocabulary](../lib/atlas/vocabulary.ts) |
| GAP-03 | P0 | Chưa có lịch sử ôn hoặc SRS của Library. Tower vẫn là thử nghiệm DRAFT. Chốt bước ôn tối thiểu và quyền sở hữu dữ liệu ôn. | AUD-01, mục 16, [báo cáo Tower](history/tower/t1/T1-implementation-report.md) |
| GAP-04 | P1 | PD-03 đã chốt cách tách kết quả. Còn thiếu tiêu chí thẩm định năng lực, phạm vi bằng chứng B2 và mô hình đánh giá nghe/nói. | [Domain projection](../packages/domain/src/index.ts), [giới hạn học liệu](history/content/LEARNING-CONTENT-DIRECTION.md) |
| GAP-05 | P1 | Kiến trúc đang tham chiếu `824aa83`. Cập nhật sau khi Product Owner chấp nhận kết quả xác minh baseline `e8477f8`. | [Kiến trúc](ARCHITECTURE.md), AUD-01, mục 3 |
| GAP-06 | P1 | PD-11 đã chọn OpenSpec. Checkout chưa có `openspec/`. Chốt cách duyệt và tiếp nhận đặc tả khi có thay đổi hành vi đầu tiên. | [PD-11](PRODUCT.md#chiến-lược-đã-chốt), AUD-01, mục 22 |
| GAP-07 | P1 | Dispatcher và aggregate vẫn dùng chung. Module Travel/Vocabulary thuộc `e8477f8`, còn chờ chấp nhận làm baseline kỹ thuật. Xem xét đường ghi trong ARCH-INV-001 khi có lý do cụ thể. | [Dispatcher](../lib/atlas/service.ts), [CAS adapter](../lib/atlas/supabase-storage.ts) |
| GAP-08 | P1 | Báo cáo từ vựng cũ ghi D1. STAB-01B đã đối chiếu hành vi qua fixture và PostgreSQL/PostgREST. Báo cáo D1 giữ vai trò bằng chứng lịch sử. | [Bằng chứng D1](history/verification/vocabulary-save/README.md), [test hiện hành](../scripts/test-supabase.mts), [runtime](../README.md) |
| GAP-09 | P2 | Persona, JTBD và chỉ số thành công vẫn là giả thuyết. Xác thực giá trị của vòng khám phá, lưu và ôn với người học. | AUD-01, mục 6 |
| GAP-10 | P1 | Kiểm tra độ phủ nguồn đã có. Thẩm định độc lập về nội dung, song ngữ và độ khó vẫn là cổng riêng cho các tuyên bố học tập. | [Cổng nguồn](../scripts/validate-evidence.mts), [báo cáo editorial](content-authoring/content-02b-review/CONTENT-02B-final-report.md) |
| GAP-11 | P1 | AUD-01 chưa xác minh trực tiếp production. Phiên đăng nhập Google và luồng lưu/khôi phục cần evidence trên bản triển khai mục tiêu trước khi kết luận release readiness. | [Biên bản AUTH production](history/auth/auth-04/AUTH-04-production-verification.md), AUD-01, mục 24 |

## Quyết định còn mở

- **Library P0.** Chốt phạm vi mở đầu, loại mục và ngữ cảnh cần lưu, quy tắc trùng theo nghĩa/ngữ cảnh, collections và dữ liệu cũ. Chốt quyền sở hữu lịch sử ôn, lịch ôn, quyền xuất/xóa và vai trò của Tower trước khi mở rộng.
- **Đánh giá và nội dung.** Chốt tiêu chí thẩm định B2, phạm vi tuyên bố năng lực, người duyệt học liệu và chỉ số giá trị học tập.
- **Điều kiện triển khai.** Product Owner đã duyệt candidate `e8477f8` để xác minh. STAB-01C đã chấp nhận baseline và ngoại lệ tạm thời chỉ cho AUD-02 discovery, đồng thời duyệt correction hẹp. Còn mở việc duyệt bản sửa local, kế hoạch phát hành và cách xử lý tài liệu local. Chốt người duyệt OpenSpec và phạm vi kiểm chứng production khi cần release. AUD-01, mục 23.

## PD-12 và STAB-01

Bảng giữ kết luận rà soát mã nguồn của STAB-01. Kết quả chạy và quyền chuyển sang AUD-02 được ghi ở phần STAB-01B bên dưới.

| Nhóm | Hành vi quan sát và ảnh hưởng API | Phân loại và xử lý đề xuất | Bằng chứng hiện có và phần cần bổ sung |
| --- | --- | --- | --- |
| API contracts | Client và DTO đã tách ở `074abe0`. `e8477f8` dùng chung `ApiError`, gom projection sau cập nhật ngày học và trả state cùng revision dự kiến nếu commit thành công. Logic ánh xạ lỗi và header ở biên HTTP vẫn giữ. | **Sẵn sàng xác minh**. Giữ phân lớp. | Typecheck, SSR và test HTTP đã có. Đối chiếu body/header và mã 400/401/403/409/503 trên Next thật, nhất là state/revision sau retry. [Client](../lib/atlas/api-client.ts), [DTO](../lib/atlas/contracts/expedition.ts), [route service](../lib/atlas/service.ts), [HTTP fixture](../scripts/test-auth02-http.mts) |
| Travel | Tách start, action và khởi tạo checkpoint sang module dùng chung catalog, engine và quy tắc mở điểm dừng. Payload, mã lỗi và phần thưởng theo source giữ nguyên. | **Sẵn sàng xác minh**. Giữ module và xét cả UI lẫn server. | Có kiểm tra render khóa/mở, toàn tuyến Tokyo và hoàn thành đồng thời. Kiểm lại deep link, restart cũ và replay. [Module](../lib/atlas/travel.ts), [quy tắc mở khóa](../packages/domain/src/travel.ts), [SSR](../scripts/test-chapter-ui.mts) |
| Vocabulary | Tách đọc/lưu/bỏ lưu và giữ định danh lesson/version/word cùng timestamp. Lưu kiểm tra khóa của Nature/Travel. Bỏ lưu vẫn tra catalog trước, vì vậy mục mất khỏi catalog có thể được trả trong GET nhưng bị từ chối khi bỏ lưu. STAB-01B đã tái hiện trên cả hai SHA. | **Chưa hoàn tất bằng chứng**. Giữ refactor, đưa chính sách mục cũ vào AUD-02. | Fixture có khóa, hai tài khoản, lưu trùng, bỏ lưu và CAS. Cần ca PostgreSQL cho document cũ, lưu từ đồng thời với ghi thưởng và đọc lại timestamp. [Module](../lib/atlas/vocabulary.ts), [fixture](../scripts/test-supabase.mts) |
| Expedition | Tách kiểu persistence ra khỏi route, giữ type re-export cho caller cũ và dùng kiểu Attempt chung. Adapter vẫn ghi document theo UUID/revision với số lần retry hiện hành. | **Sẵn sàng xác minh**. Giữ ranh giới, hoãn thay đổi storage. | Có kiểm tra legacy, lỗi commit và mất phản hồi. Đối chiếu no-op/revision và document sau ghi chéo tính năng. [Kiểu lưu trữ](../lib/atlas/expedition.ts), [adapter](../lib/atlas/supabase-storage.ts) |
| Checkpoint | Dùng chung kiểm tra revision cho checkpoint/restart. Bỏ lần resolve lặp, `saveCheckpoint` vẫn resolve target. Giữ `409 STALE_REVISION` và `400 INVALID_CHECKPOINT`. | **Sẵn sàng xác minh**. Giữ kiểm tra ở server. | AUTH-02 có Resume cũ, hai request cạnh tranh và duplicate sau khi đổi checkpoint. Đối chiếu cả chính sách từ chối restart cũ. [Checkpoint](../lib/atlas/checkpoint.ts), [AUTH-02 test](../scripts/test-auth02-postgres.mts) |
| Rewards | Chuyển projection trạng thái thưởng vào module chung. Quy tắc ghi ledger lần đầu và commit cùng XP, stamp giữ nguyên. | **Sẵn sàng xác minh**. Giữ một đường ghi thưởng. | Có Forest/Travel first-clear đồng thời, replay và lost response. Ca ghi thưởng đồng thời với lưu từ dùng chung oracle của Vocabulary. [Rewards](../lib/atlas/rewards.ts), [AUTH-02 test](../scripts/test-auth02-postgres.mts) |
| Study | Module chỉ đổi import kiểu. Travel vẫn trả cờ đủ điều kiện để dispatcher ghi ngày học trước CAS và trả state mới. | **Sẵn sàng xác minh**. Giữ cách tính và lưu ngày. | Có unit, fixture và PostgreSQL cho ngày Việt Nam, duplicate và lỗi ghi. Đối chiếu ngày học trong response mutation khi Travel sai nhưng hợp lệ hoặc request đã cũ. [Study](../lib/atlas/study.ts), [test](../scripts/test-study.mts) |
| Tower handlers | Chỉ đổi import kiểu. Handler vẫn có dispatcher, retry và gate DRAFT riêng. | **Sẵn sàng xác minh**. Giữ giới hạn runtime hiện có. | Test Tower và import guard phù hợp. PostgreSQL Tower chỉ cần thêm nếu correction chạm runtime hoặc persistence của Tower. [Handler](../lib/atlas/tower-handlers.ts), [test Tower](../scripts/test-tower.mts) |
| Supabase tests | Fixture mở rộng để đo CAS conflict thực sự xảy ra trong mô phỏng và kiểm tra Travel/Sổ từ qua adapter. | **Chưa hoàn tất bằng chứng**. Giữ fixture, bổ sung ca chéo trên PostgreSQL nếu được duyệt. | Fixture kiểm tra route/adapter. Các ràng buộc DB và đường Next HTTP có bộ test local riêng. [Fixture](../scripts/test-supabase.mts), [stack PostgreSQL](../scripts/auth02/local-stack.mts) |

**An toàn production.** Diff `074abe0..e8477f8` giữ nguyên xác thực UUID, adapter Supabase, migration và cấu hình Vercel. Thay đổi ở service vẫn có thể ảnh hưởng response, học ngày, phần thưởng và Resume nếu xử lý retry hoặc projection sai. Review chưa thấy regression mới trong các đường này. Với Vocabulary, hành vi mục mất khỏi catalog là giới hạn tồn tại từ trước. Các rủi ro chưa có oracle đầy đủ là hợp đồng lỗi ở HTTP và ghi đồng thời giữa lưu từ với thưởng trên PostgreSQL. Push `main` có thể kích hoạt Vercel. Deployment và Google OAuth hiện hành cần quy trình release riêng. [Biên xác thực](../lib/atlas/vercel-handler.ts), [Vercel config](../vercel.json).

## Xác minh STAB-01B ngày 27/11/2026

Xác minh fresh trên Git archive của `e8477f887b4d310d12293e41db3eeacf3b64e653` và kiểm tra riêng test mới trên bản sao cô lập. Lặp phép tái hiện trên `074abe0`. Dùng Node 22.23.5, pnpm 11.25.0, PostgreSQL 17.10 và PostgREST 14.18 trên Mac ARM. Stack tạo DB/migration tạm và Auth giả lập trên loopback, với môi trường tiến trình đã lọc bỏ cấu hình production. Source ứng dụng ở candidate giữ nguyên.

| Kiểm tra | Lệnh | Kết quả và phạm vi |
| --- | --- | --- |
| Kiểu, build, lint | `pnpm exec tsc --noEmit --incremental false`, `pnpm build`, `pnpm lint` | **PASS**. Build chạy cổng xuất bản học liệu. Lint 0 lỗi, 7 cảnh báo `no-img-element` ở UI. Bản test bổ sung cũng đạt typecheck và lint tập trung. |
| Hồi quy và nội dung | `node --test --test-reporter=spec` với `scripts/test-evidence.mts scripts/test-travel.mts scripts/test-vocabulary.mts scripts/test-chapter.mts scripts/test-chapter-ui.mts scripts/test-interests.mts scripts/test-navigation-v2.mts scripts/test-profile.mts scripts/test-supabase.mts scripts/test-study.mts scripts/test-tower.mts` | **PASS**, 46/46. Bao gồm UI render, điều hướng, tài khoản giả lập, CAS fixture, học liệu, Study và gate Tower DRAFT. |
| HTTP | `pnpm test:auth:http`, `pnpm test:auth02:http` | **PASS**. Next HTTP với cookie/Auth fixture, 401/403, health, Resume, Travel và cô lập tài khoản. AUTH-02 HTTP đi qua PostgREST/PostgreSQL thật. |
| Đường ghi và dữ liệu cũ | `pnpm test:auth02`, `node scripts/test-study-postgres.mts`, `node scripts/test-tower-postgres.mts` | **PASS** fresh, lần lượt 19, 7 và 25 ca. Có UUID, CAS, mất phản hồi, rollback, first-clear, RLS, Resume và legacy. Lần khởi động AUTH-02 đầu thiếu đường dẫn libpq nên được dừng. Lần chạy lại dùng libpq đã có trong dependency. Kết quả lịch sử 19 + 7 là lượt chạy trước. Tower vẫn là DRAFT. |
| Vocabulary thật | `node scripts/test-vocabulary-postgres.mts`, `node scripts/test-chapter-ui.mts` với test bổ sung | **PASS** trên candidate và AUD-01 cho legacy, cô lập tài khoản, lặp lệnh và mô tả đúng hành vi orphan. Cả lưu và bỏ lưu đồng thời với first-clear đều tạo đúng một CAS conflict, retry ở revision mới, commit hai revision và chỉ có một khoản thưởng. **FAIL** so với đích LL-INV-002 cho thao tác bỏ lưu mục orphan. |
| Hosted | Google OAuth, Supabase và Vercel production | **NOT RUN**. GAP-11 tiếp tục mở cho release readiness. Không còn blocker môi trường cho bộ test local đã chạy. |

Nguồn test gồm [Vocabulary PostgreSQL](../scripts/test-vocabulary-postgres.mts), [UI SSR](../scripts/test-chapter-ui.mts), [stack loopback](../scripts/auth02/local-stack.mts) và [AUTH-02 evidence lịch sử](history/auth/auth-02/AUTH-02-test-evidence.md).

## ARCH-INV-001

Hoãn điều tra cấu trúc lưu trữ. Hiện các command cập nhật một phần trạng thái **ở lớp nghiệp vụ**. Adapter lưu lại toàn bộ document của aggregate dùng chung trong `atlas_expeditions`, theo UUID của người dùng và revision qua CAS. Hồ sơ có đường cập nhật trường riêng ở `atlas_profiles`. Quyết định về partial update ở tầng lưu trữ, ranh giới aggregate, bảng riêng hay migration thuộc ARCH-INV-001. Dành phần kiểm kê persistence, quyền sở hữu và ngữ nghĩa partial update cho AUD-03, phần đo đạc, đánh giá phương án và khả năng mở rộng Library cho AUD-04.

Phạm vi gồm quyền sở hữu và vòng đời Library/nguồn, tham chiếu so với snapshot hoặc mô hình lai, phiên bản và xử lý orphan, ngữ nghĩa xóa, ranh giới transaction và khả năng mở rộng lịch sử ôn. Đo kích thước/tốc độ tăng document, read/write amplification, CAS retry/409 và độ trễ ghi. So sánh phương án bảo toàn cô lập tài khoản, thưởng, checkpoint và dữ liệu cũ, kể cả chuyển đổi, khôi phục và rollback, theo LL-INV-001–008. [ADR-003](decisions/ADR-003-player-ownership.md), [adapter](../lib/atlas/supabase-storage.ts), [profile handler](../lib/atlas/profile-handler.ts), [SQL integrity](../supabase/migrations/20261021090000_auth02_expedition_integrity.sql).

## Language Library và điều kiện vào AUD-02

**VERIFIED — GAP-02 tại baseline, giới hạn có từ AUD-01.** `GET /api/vocabulary` trả `200` và giữ định danh cùng `savedAt` của mục đọc từ document. Khi lesson hoặc từ mất khỏi catalog, `POST` trả `400` lúc tra cứu. Với phiên bản ngoài schema hiện hỗ trợ, POST trả `400` ở bước parse. Cả lưu lẫn bỏ lưu bị từ chối và row giữ nguyên. UI đếm mục đó nhưng bỏ qua thẻ và nút xóa. Bản ghi hiện chỉ có text từ, lesson/version và thời điểm lưu. Nghĩa, IPA và ví dụ chỉ phục hồi được nếu có nguồn còn truy xuất được hoặc bằng chứng lịch sử phù hợp. Kết quả vi phạm mục tiêu LL-INV-002 và cho thấy khoảng cách về khả năng sử dụng độc lập theo LL-INV-001/004. [Model](../content/english/vocabulary.ts), [server](../lib/atlas/vocabulary.ts), [UI](../app/components/SavedVocabulary.tsx).

**VERIFIED — GAP-07 và GAP-08.** Các ca local đã kiểm tra legacy, idempotency, cô lập tài khoản và giao thoa giữa Vocabulary và thưởng. Chưa phát hiện regression mới qua các ca đã chạy. **UNKNOWN:** mức khôi phục dữ liệu của mục từng lưu ở production, vòng đời review history và chất lượng metadata cho các loại entry mới. Lịch sử ôn chưa phải hành vi Notebook hiện có.

## STAB-01C ngày 27/11/2026

Product Owner chấp nhận `e8477f887b4d310d12293e41db3eeacf3b64e653` làm baseline cho Requirements Engineering. Ngoại lệ orphan chỉ áp dụng để AUD-02 discovery có thể tiến hành. LL-INV-002 vẫn là điều kiện sản phẩm. Correction đã được triển khai và kiểm tra **ở working tree local trên baseline này**.

- **Trước → sau.** Ở baseline, GET trả mục orphan nhưng UI giấu thẻ và POST bỏ lưu trả `400`. Bản sửa hiện từ đã lưu, ghi rõ nguồn không khả dụng và cho chủ tài khoản bỏ lưu theo lesson/version/word. Với định danh hợp lệ, trả `201 {words}` kể cả khi không còn mục để xóa. Lặp lệnh không tăng revision. Lưu mới vẫn dùng phiên bản, catalog và điều kiện mở khóa hiện có. [Handler](../lib/atlas/vocabulary.ts), [kiểu dữ liệu](../content/english/vocabulary.ts), [Sổ từ](../app/components/SavedVocabulary.tsx), [CSS](../app/chapter.css), [bản dịch lỗi](../content/localization/vi.ts).
- **Xác minh fresh.** `pnpm exec tsc --noEmit --incremental false`, `pnpm build`, `pnpm lint` và 46 ca hồi quy **PASS**. Lint 0 lỗi, 7 cảnh báo `no-img-element` như baseline. [SSR](../scripts/test-chapter-ui.mts) xác minh thẻ, EN/VI và thiếu nội dung nguồn. Brave headless tại 390 px trên Next HTTP xác minh tải ban đầu, trạng thái chờ, giữ thẻ sau lỗi 503 mô phỏng, bỏ lưu thành công và tải lại. Ca browser dùng dữ liệu thử, log ở ngoài repo.
- **Tính toàn vẹn.** `node scripts/test-vocabulary-postgres.mts`, `pnpm test:auth02` (19 ca), `node scripts/test-study-postgres.mts` (7 ca) và `pnpm test:auth02:http` **PASS** trên PostgreSQL/PostgREST loopback và Auth giả lập. [Test Vocabulary PostgreSQL](../scripts/test-vocabulary-postgres.mts) kiểm tra cả ba dạng orphan, định danh sai, cô lập và dữ liệu cũ. Cả ba ca lưu, bỏ lưu bình thường và bỏ lưu orphan chạy cùng ghi thưởng đều có một xung đột CAS, lưu đủ hai thay đổi và chỉ ghi một lần thưởng. Auth Google, Supabase/Vercel production **NOT RUN**, GAP-11 vẫn mở.
- **Phần còn mở.** Bản sửa giải quyết LL-INV-002 cho Vocabulary Notebook. Độ bền của dữ liệu ngôn ngữ và ngữ cảnh độc lập, các loại mục mở rộng, lịch sử ôn và chuyển đổi dữ liệu cần đặc tả tiếp. OpenSpec chưa có cấu hình hoặc CLI trong môi trường này. Giữ [LL-INV-001–008](PRODUCT.md#bất-biến-của-language-library) làm đầu vào AUD-02 và giữ ARCH-INV-001 cho AUD-03/AUD-04.

**AUD-02 sẵn sàng cho discovery** theo phê duyệt của Product Owner. Bản sửa chờ review trước khi tích hợp hoặc phát hành. Đề xuất một commit hành vi gồm handler, UI và regression tests, rồi đối soát tài liệu canonical riêng với bằng chứng AUD-01.

**Ứng viên lưu trữ ngoài repo về sau.** Bản AUD-01 gốc, báo cáo xác minh từ vựng/Travel thời D1 và biên bản preflight AUTH-04 đã được cập nhật theo mốc sau là bằng chứng lịch sử. Chỉ chuyển sau khi được duyệt, có bản lưu có quyền truy cập phù hợp và đã kiểm tra các liên kết nguồn. AUD-01 (bằng chứng lưu riêng), [Vocabulary](history/verification/vocabulary-save/README.md), [Travel](history/world-travel/verification.md), [AUTH-04 preflight](history/auth/auth-04/AUTH-04.1-production-preflight.md).
