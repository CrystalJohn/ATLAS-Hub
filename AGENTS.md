# Hướng dẫn phát triển ATLAS Hub

Đọc [kiến trúc hệ thống](docs/ARCHITECTURE.md) trước khi thay đổi ranh giới module, hợp đồng API hoặc cách lưu tiến trình.

## Code gọn, module hóa và tái sử dụng

- Tìm logic, kiểu dữ liệu, schema, component và hook hiện có trước khi thêm mới. Dùng chung một nguồn cho cùng một quy tắc nghiệp vụ. Chỉ gom hai đoạn code khi chúng thực sự biểu diễn cùng hành vi và cần thay đổi cùng nhau.
- Giữ code dễ đọc với tên rõ nghĩa, ít tầng điều kiện và ít lớp trung gian. Tách file khi có trách nhiệm độc lập. Ưu tiên đặt logic cạnh tính năng sở hữu nó và đưa ra dùng chung khi có nhu cầu thực tế.
- Giữ route mỏng. Route xử lý HTTP và xác thực, module tính năng điều phối nghiệp vụ, engine xử lý quy tắc thuần, adapter lo lưu trữ. Module dùng chung có giao diện nhỏ và phụ thuộc một chiều.
- Dùng lại `atlasApi` cho truy cập API từ UI. Khi tách hợp đồng chung, đặt kiểu request/response ở vị trí an toàn cho client. Giữ SDK quản trị, đáp án và mã chấm ở server. Các hàm thuần dùng chung cho UI và server chỉ đọc dữ liệu công khai.
- Giữ refactor theo từng luồng nhỏ và bảo toàn hành vi người dùng, hợp đồng API, ID/phiên bản nội dung và khả năng đọc document cũ. Dùng kiểm thử hiện có tương ứng với luồng thay đổi. Khi thay đổi phần ghi tiến trình, xác minh cả retry và cập nhật đồng thời.
- Giữ danh tính gắn với Supabase Auth UUID đã xác minh. Dùng chung quy trình ghi theo revision cho các command trên expedition khi đã đối chiếu chính sách retry của từng luồng. Commit XP, ledger, stamp, checkpoint và ngày học liên quan cùng thay đổi nghiệp vụ.
