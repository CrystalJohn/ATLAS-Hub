# Sản phẩm ATLAS

**Learn English Through Exploring the World.** ATLAS giúp người học hiểu và sử dụng tiếng Anh khi khám phá địa điểm, giải quyết tình huống và tìm hiểu kiến thức về thế giới. Vòng học định hướng là **Explore → Learn → Collect → Retain → Master**.

## Chiến lược đã chốt

- **PD-01 — B2-first, giữ A1–B1.** Ưu tiên trải nghiệm B2 khi mở rộng nội dung và thiết kế lộ trình, đồng thời duy trì A1, A2, B1 và quyền chọn độ khó. Các bài tập giao tiếp thiết thực và hỗ trợ tiếng Việt tiếp tục giúp người học tiếp cận tri thức. Ưu tiên practical English và A2–B1 trong tài liệu học liệu cũ phản ánh cách biên soạn của những gói hiện có. [Hướng biên soạn trước đây](history/content/LEARNING-CONTENT-DIRECTION.md), [báo cáo Tokyo](content-authoring/content-02a-tokyo/CONTENT-02A-final-report.md).
- **PD-02 — Knowledge-driven.** Kiến thức thế giới là một mục tiêu học. Dùng nội dung tự biên soạn, có nguồn đáng tin và được kiểm tra sự kiện. Ghi rõ bối cảnh hư cấu hoặc số liệu mô phỏng. Phát triển ATLAS Knowledge System theo nhu cầu đã xác nhận, dựa trên nội dung và nguồn hiện có. AUD-01, mục 17.
- **PD-04 — Language Library là Core Feature P0.** Người học cần một thư viện cá nhân để lưu và tìm lại từ, cụm từ, collocation và câu trong ngữ cảnh ban đầu. Tận dụng sổ từ hiện có và bảo toàn mục đã lưu. Flashcards và luyện lại theo thời gian thuộc định hướng Retain. Phạm vi phát hành đầu tiên và chính sách ôn tập cần Product Owner chốt. AUD-01, mục 16, [quyết định còn mở](PROJECT_STATUS.md#quyết-định-còn-mở).
- **PD-03 — Tách ba kết quả.** *English competency* mô tả năng lực ngôn ngữ được đánh giá theo kỹ năng và bằng chứng phù hợp. *Knowledge mastery* mô tả mức hiểu kiến thức của chủ đề. *Game progression* ghi nhiệm vụ, XP, cấp, mở khóa và phần thưởng. Lựa chọn độ khó, lượt lưu từ và lượt chơi chỉ phản ánh các hành vi tương ứng. Chỉ công bố kết quả năng lực theo phạm vi đã được thẩm định. AUD-01, mục 12.
- **PD-11 — OpenSpec quản lý đặc tả hành vi.** `openspec/` là đích canonical cho yêu cầu hành vi, scenario chấp nhận và vòng đời thay đổi. Tài liệu sản phẩm giữ mục tiêu và quyết định kinh doanh, tài liệu kiến trúc giữ ràng buộc kỹ thuật, trạng thái dự án giữ việc đang mở. Dẫn chiếu giữa các tài liệu và chuyển từng hành vi còn sử dụng khi có thay đổi. [Trạng thái triển khai OpenSpec](PROJECT_STATUS.md#phát-hiện-và-ưu-tiên).

## Bất biến của Language Library

Mục người học đã lưu là tài sản học tập cá nhân có vòng đời riêng. Đây là yêu cầu đã duyệt cho Library. [Khoảng cách với Vocabulary Notebook](PROJECT_STATUS.md#language-library-và-điều-kiện-vào-aud-02).

- **LL-INV-001 — Độ bền.** Giữ từ, cụm từ, collocation và câu đã lưu khi nội dung gốc được sửa, gỡ hoặc đổi phiên bản.
- **LL-INV-002 — Xóa độc lập.** Chủ tài khoản đã xác thực có thể xóa theo định danh mục đã lưu dù catalog gốc đã mất. Lặp lệnh xóa phải an toàn và idempotent.
- **LL-INV-003 — Tương thích phiên bản.** Phát hành nội dung mới phải bảo toàn dữ liệu học, tránh mất, hỏng hoặc sinh bản trùng. Mục cũ phải còn truy xuất và quản lý được.
- **LL-INV-004 — Ngữ cảnh độc lập.** Giữ thông tin sẵn có đủ để ôn, kể cả văn bản gốc, IPA/phát âm, từ loại, nghĩa EN/VI, ngữ cảnh, ví dụ, nguồn và phiên bản khi có. Hiển thị rõ trường thiếu và nguồn không còn truy cập được. Chỉ phục hồi thông tin từ bằng chứng có thể đối chiếu.
- **LL-INV-005 — Lịch sử ôn.** Giữ lịch sử flashcard và ôn khi nguồn thay đổi, theo quyền xóa của người dùng, vòng đời tài khoản và chính sách riêng tư. AUD-02 chốt cách xử lý lịch sử khi xóa một mục Library.
- **LL-INV-006 — Sở hữu và cô lập.** Người dùng chỉ truy cập và quản lý dữ liệu Library/ôn tập của mình. Server xác minh danh tính và quyền sở hữu cho mọi thao tác.
- **LL-INV-007 — Toàn vẹn tiến trình.** Library bảo toàn XP, thưởng, nhiệm vụ, checkpoint, Travel, lịch học và bằng chứng học. Lưu hoặc ôn chỉ ghi nhận hành vi tương ứng. Mọi tích hợp điểm thưởng hoặc bằng chứng cần đặc tả được duyệt theo PD-03.
- **LL-INV-008 — Chuyển đổi tương thích.** Giữ mục Vocabulary Notebook cũ, kể cả mục thiếu trường mới. Thiết kế chuyển đổi phải hỗ trợ kiểm tra, đối soát và khôi phục.

## Năng lực sản phẩm và hiện trạng

| Năng lực | Mục tiêu sản phẩm | Hiện trạng |
| --- | --- | --- |
| Khám phá và học | Dùng tiếng Anh để hiểu nguồn thông tin, hỏi đáp, xử lý tình huống và khám phá kiến thức | Nature Realm và World Travel Nhật Bản có nội dung chơi. Các khu vực khác có thể ở dạng xem trước. Bài đọc và hỗ trợ từ vựng có A1–B2, với bằng chứng chủ yếu từ đọc và từ vựng. |
| Thu thập và ôn lại | Xây Library cá nhân theo ngữ cảnh và ôn để nhớ lâu | Vocabulary Notebook lưu từ thuộc glossary theo lesson/version. Chi tiết từ hỗ trợ IPA, nghĩa EN/VI, ví dụ và link tra cứu theo độ phủ nội dung. Collections, lưu cụm/câu theo ngữ cảnh, lịch sử ôn và SRS còn thiếu. Memory Tower là bản DRAFT cục bộ. |
| Đánh giá và tiến trình | Phản hồi riêng theo PD-03 và duy trì động lực quay lại học | Có bằng chứng đọc/từ vựng, mastery kiến thức Nature và tiến trình trò chơi. `cefrProficiency` hiện là `null`. Chưa có đánh giá nghe/nói được thẩm định. Tài khoản, tùy chọn học, Resume và lịch học hỗ trợ hành trình. |

Nguồn đối chiếu hiện trạng gồm [README](../README.md), [domain projection](../packages/domain/src/index.ts) và AUD-01, mục 5.
