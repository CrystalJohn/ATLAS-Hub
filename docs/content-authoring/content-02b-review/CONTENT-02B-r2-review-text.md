# CONTENT-02B proposed r2 review text

DRAFT · AI correction proposal · no human signoff. This view is generated from r2 JSON, not a replacement for the original r1 files. Unresolved issues remain in the item matrix.

## TKY-DAILY-001 — TOKYO-DAILY-r2

### TKY-DAILY-001-L1

EN: You have checked a bag and need to collect it before leaving. A practice board says BAGGAGE CLAIM: LEFT; EXIT: RIGHT; TRAINS: STRAIGHT. You ask, ‘Where can I find baggage claim?’ The assistant answers, ‘Turn left for baggage claim. The exit is on your right.’

VI candidate: Bạn ký gửi hành lý và cần nhận trước khi rời đi. Biển luyện tập ghi: NHẬN HÀNH LÝ: TRÁI; LỐI RA: PHẢI; TÀU: THẲNG. Bạn hỏi khu nhận hành lý ở đâu. Nhân viên chỉ sang trái; lối ra ở bên phải.

### TKY-DAILY-001-L2

EN: You have collected your bag and now need to leave the terminal. The practice board says EXIT: STRAIGHT; TRAINS: LEFT; BAGGAGE CLAIM: RIGHT. You ask, 'Which way is the exit?' The assistant says, 'Go straight for the exit.'

VI candidate: Bạn đã nhận hành lý và muốn rời nhà ga. Biển luyện tập ghi LỐI RA: ĐI THẲNG; TÀU: TRÁI; NHẬN HÀNH LÝ: PHẢI. Bạn hỏi lối ra ở hướng nào. Nhân viên nói đi thẳng.

Feedback EN: Baggage claim is where checked bags are collected; exit is a way out. Match the requested place before following its direction.

Feedback VI: Baggage claim là nơi nhận hành lý ký gửi; exit là lối ra. Xác định đúng nơi cần đến rồi mới theo hướng dẫn.

## TKY-DAILY-002 — TOKYO-DAILY-r2

### TKY-DAILY-002-L1

EN: At this practice desk, the train is delayed until 11:40. A direct bus departs at 11:20. A shuttle departs at 11:10 but requires a change. You need a direct service before 11:30. You ask, ‘Is the bus direct?’ The assistant says, ‘Yes. No change is needed.’

VI candidate: Ở quầy luyện tập, tàu bị chậm đến 11:40. Xe buýt đi thẳng khởi hành 11:20. Xe trung chuyển đi 11:10 nhưng cần đổi chuyến. Bạn cần chuyến đi thẳng trước 11:30. Nhân viên xác nhận xe buýt không cần đổi.

### TKY-DAILY-002-L2

EN: On a new practice board, the direct train departs at 12:10, the direct bus is delayed until 12:35, and a shuttle leaves at 12:05 but needs a change. You need a direct service before 12:20. The assistant says, ‘The train is direct and leaves at 12:10.’

VI candidate: Bảng luyện tập mới ghi tàu đi thẳng lúc 12:10, xe buýt đi thẳng bị chậm đến 12:35, xe trung chuyển đi 12:05 nhưng phải đổi chuyến. Bạn cần chuyến đi thẳng trước 12:20. Nhân viên xác nhận tàu phù hợp.

Feedback EN: Direct means no change in this lesson. Compare the requested time and route condition; the earliest departure may not meet both.

Feedback VI: Trong bài này, direct nghĩa là không phải đổi chuyến. So sánh cả giờ và điều kiện hành trình; chuyến sớm nhất có thể không đáp ứng cả hai.

## TKY-DAILY-003 — TOKYO-DAILY-r2

### TKY-DAILY-003-L1

EN: You missed your stop in a practice network. The attendant says, ‘Get off at Pine Stop. Change to the Green Line there. Get off at Lake Stop.’ A labeled diagram shows your Red Line reaches Pine next and Green connects Pine to Lake. It gives no fares or walking directions.

VI candidate: Bạn đi quá ga trong mạng lưới luyện tập. Nhân viên nói: ‘Xuống tại Pine. Đổi sang tuyến Green ở đó. Xuống tại Lake.’ Sơ đồ có nhãn cho thấy Red sắp đến Pine và Green nối Pine với Lake. Không có giá vé hay hướng đi bộ.

### TKY-DAILY-003-L2

EN: In a second practice network, get off at Hill Stop, change to the Blue Line there, then get off at Garden Stop. Your current train reaches Hill next; Blue connects Hill to Garden.

VI candidate: Trong mạng lưới luyện tập thứ hai, xuống tại Hill, đổi sang tuyến Blue ở đó rồi xuống Garden. Tàu hiện tại đến Hill tiếp theo; Blue nối Hill với Garden.

Feedback EN: Change lines means continue on another line. Get off means leave the train at the named stop. Follow the order: transfer stop, new line, destination.

Feedback VI: Change lines nghĩa là chuyển sang tuyến khác. Get off là xuống tàu tại ga đã nêu. Theo thứ tự: ga đổi tuyến, tuyến mới, điểm đến.

## TKY-DAILY-004 — TOKYO-DAILY-r2

### TKY-DAILY-004-L1

EN: The practice board lists MUSEUM: PLATFORM 2, DEPARTS 09:20 and PARK: PLATFORM 3, DEPARTS 09:35. You are going to the museum. You ask, ‘Which platform does it leave from?’ The attendant answers, ‘Platform two. It leaves at nine twenty.’

VI candidate: Bảng luyện tập ghi BẢO TÀNG: SÂN GA 2, KHỞI HÀNH 09:20; CÔNG VIÊN: SÂN GA 3, KHỞI HÀNH 09:35. Bạn đi bảo tàng. Nhân viên xác nhận sân ga 2, lúc 09:20.

### TKY-DAILY-004-L2

EN: A new practice board lists PARK: PLATFORM 1, DEPARTS 10:45 and MUSEUM: PLATFORM 4, DEPARTS 10:15. You are going to the park. The attendant says, ‘Platform one. It leaves at ten forty-five.’

VI candidate: Bảng mới ghi CÔNG VIÊN: SÂN GA 1, KHỞI HÀNH 10:45; BẢO TÀNG: SÂN GA 4, KHỞI HÀNH 10:15. Bạn đi công viên. Nhân viên xác nhận sân ga 1, lúc 10:45.

Feedback EN: Keep all details from the same destination row. A platform and time for another destination do not answer this question.

Feedback VI: Giữ các chi tiết cùng một hàng điểm đến. Sân ga và giờ của nơi khác không trả lời câu hỏi này.

## TKY-DAILY-005 — TOKYO-DAILY-r2

### TKY-DAILY-005-L1

EN: You want tea. The practice shelf labels say TEA—AISLE 2, 150 YEN; WATER—AISLE 1, 110 YEN; JUICE—AISLE 3, 170 YEN. You ask, ‘Where can I find the tea, and how much is it?’ The assistant says, ‘Aisle two. It is 150 yen.’

VI candidate: Bạn muốn mua trà. Nhãn kệ luyện tập ghi TRÀ—LỐI 2, 150 YÊN; NƯỚC—LỐI 1, 110 YÊN; NƯỚC ÉP—LỐI 3, 170 YÊN. Bạn hỏi trà ở đâu và giá bao nhiêu; nhân viên trả lời lối hai, giá 150 yên.

### TKY-DAILY-005-L2

EN: You want tea again, but a new practice shelf has TEA—AISLE 3, 140 YEN; WATER—AISLE 1, 110 YEN; JUICE—AISLE 2, 170 YEN. You ask, ‘How much is the tea?’ The assistant replies, ‘It is 140 yen, in aisle three.’

VI candidate: Bạn muốn trà. Nhãn luyện tập mới: TRÀ—LỐI 3, 140 YÊN; NƯỚC—LỐI 1, 110 YÊN; NƯỚC ÉP—LỐI 2, 170 YÊN. Bạn hỏi giá trà. Nhân viên xác nhận giá 140 yên, ở lối ba.

Feedback EN: An aisle is the passage between shelves. Price is the amount for an item. Match both details to the same product.

Feedback VI: Aisle là lối đi giữa các kệ; price là giá món hàng. Ghép cả hai chi tiết với đúng sản phẩm.

## TKY-DAILY-006 — TOKYO-DAILY-r2

### TKY-DAILY-006-L1

EN: At checkout the cashier asks, ‘A bag? Cash or card?’ You already have a bag and want to pay by card. After payment, you need proof of purchase. You say, ‘No bag, thanks. By card, please. Could I have a receipt, please?’

VI candidate: Ở quầy thu ngân, nhân viên hỏi bạn có cần túi và trả tiền mặt hay thẻ. Bạn đã có túi, muốn trả bằng thẻ rồi xin chứng từ mua hàng. Bạn từ chối túi, chọn thẻ và xin biên lai.

### TKY-DAILY-006-L2

EN: At checkout, you need a bag and want to pay in cash. You say, 'A bag, please. I'll pay in cash.' After paying, you ask, 'Can I have a receipt, please?' The scene states no bag fee or general store payment rule.

VI candidate: Tại quầy thanh toán, bạn cần túi và muốn trả tiền mặt. Bạn nói: 'Cho tôi một chiếc túi. Tôi trả bằng tiền mặt.' Sau khi trả tiền, bạn xin biên lai. Cảnh không nêu phí túi hay quy định chung của cửa hàng.

Feedback EN: A receipt records payment; a bag carries the purchase. Can I and Could I are both acceptable here. Payment and bag choices belong to this customer’s preference.

Feedback VI: Receipt ghi nhận khoản đã trả; bag đựng món mua. Can I và Could I đều phù hợp ở đây. Cách trả tiền và nhu cầu túi tùy khách trong tình huống này.

## TKY-DAILY-007 — TOKYO-DAILY-r2

### TKY-DAILY-007-L1

EN: You ask, ‘What is in the vegetable noodles?’ The server says, ‘Noodles, vegetable broth and mushrooms. An egg is optional.’ You want vegetable noodles and prefer no egg. The menu also lists chicken noodles. You order, ‘I'll have the vegetable noodles without egg, please.’ This is preference practice, not an allergy check.

VI candidate: Bạn hỏi mì rau có gì. Nhân viên nói gồm mì, nước dùng rau và nấm; trứng là phần thêm tùy chọn. Bạn muốn gọi mì rau và không muốn trứng và gọi mì rau không thêm trứng. Bài luyện sở thích này không kiểm tra dị ứng.

### TKY-DAILY-007-L2

EN: Chicken noodles in the same fictional shop include chicken broth. Spring onions are optional. You want chicken noodles and prefer no spring onions and say, ‘Chicken noodles without spring onions, please.’ The menu also lists vegetable noodles. No allergen or cross-contact guarantee is made.

VI candidate: Mì gà ở quán hư cấu có nước dùng gà; hành lá là phần tùy chọn. Bạn muốn gọi mì gà và không muốn hành lá nên gọi mì gà không thêm hành. Không có bảo đảm về dị ứng hay lây nhiễm chéo.

Feedback EN: Ingredients are foods used in a dish. Without excludes the named item from this order. Asking about ingredients does not establish medical safety; never infer that a vegetable dish is allergy-safe.

Feedback VI: Ingredients là nguyên liệu của món. Without yêu cầu bỏ phần được nêu. Hỏi nguyên liệu không xác nhận an toàn y tế; không suy ra món rau an toàn dị ứng.

## TKY-DAILY-008 — TOKYO-DAILY-r2

### TKY-DAILY-008-L1

EN: You ordered vegetable soup, but the server brings chicken soup. You say, ‘Sorry, I ordered the vegetable soup.’ The server checks and replaces it. After the meal, you ask, ‘Could we have the bill, please?’ In this scene bill is the amount to pay; a receipt follows payment.

VI candidate: Bạn gọi súp rau nhưng được mang súp gà. Bạn xin lỗi và nói rõ mình đã gọi súp rau; nhân viên kiểm tra rồi đổi món. Sau bữa ăn, bạn xin hóa đơn tính tiền. Bill là khoản cần thanh toán; receipt là biên lai sau khi trả.

### TKY-DAILY-008-L2

EN: You ordered chicken noodles but receive vegetable noodles. You say, ‘Sorry, I ordered the chicken noodles.’ After the corrected meal, ‘Can we have the check, please?’ also asks for the restaurant bill. Bill and check are both acceptable here.

VI candidate: Bạn gọi mì gà nhưng được mang mì rau. Bạn nói rõ đã gọi mì gà. Sau khi món được đổi, bạn có thể xin check; trong bối cảnh nhà hàng, từ này cũng chỉ hóa đơn tính tiền. Bill và check đều được.

Feedback EN: Name the dish you ordered so the server can check the mismatch. When you are ready to pay, ask for the bill or check. Both terms are acceptable in this restaurant context; a receipt records payment.

Feedback VI: Nêu món bạn đã gọi để nhân viên kiểm tra nhầm lẫn. Khi sẵn sàng thanh toán, xin bill hoặc check. Cả hai từ đều chỉ hóa đơn tính tiền trong bối cảnh nhà hàng này; receipt là biên lai thanh toán.

## TKY-DAILY-009 — TOKYO-DAILY-r2

### TKY-DAILY-009-L1

EN: You are at Cedar Corner and want to reach the station. The pedestrian says, ‘Go straight past the bank. Turn left at the library. The station is next to the post office.’ A simple labeled map shows those places in that order.

VI candidate: Bạn đang ở Cedar Corner và muốn đến ga. Người đi đường chỉ: đi thẳng qua ngân hàng, rẽ trái ở thư viện; ga nằm cạnh bưu điện. Sơ đồ có nhãn thể hiện đúng thứ tự đó.

### TKY-DAILY-009-L2

EN: You are at River Corner and want the museum. A local says, ‘Go straight past the cafe. Turn right at the park. The museum is next to the hotel.’ The practice map confirms each landmark.

VI candidate: Bạn đang ở River Corner và muốn đến bảo tàng. Người địa phương chỉ đi thẳng qua quán cà phê, rẽ phải ở công viên; bảo tàng nằm cạnh khách sạn. Sơ đồ luyện tập xác nhận thứ tự.

Feedback EN: Keep the route order: continue past the first landmark, turn at the named place, then use the final location clue. Left and right are relative to the traveler facing forward on this map.

Feedback VI: Giữ đúng thứ tự: đi qua mốc đầu, rẽ tại địa điểm được nêu rồi dùng manh mối vị trí cuối. Trái/phải tính theo hướng người đi đang nhìn trên sơ đồ.

## TKY-DAILY-010 — TOKYO-DAILY-r2

### TKY-DAILY-010-L1

EN: A practice station map marks the museum beside Exit C, the park beside Exit A, and the river beside Exit B. You are going to the museum. You ask, ‘Which exit is nearest the museum?’ The assistant answers, ‘Exit C.’

VI candidate: Sơ đồ ga luyện tập đánh dấu bảo tàng cạnh lối C, công viên cạnh lối A, sông cạnh lối B. Bạn đến bảo tàng và hỏi lối ra nào gần nhất; nhân viên trả lời lối C.

### TKY-DAILY-010-L2

EN: A different practice map places the library beside Exit B, the hotel beside Exit D, and the market beside Exit A. You are going to the library. The assistant confirms, ‘Exit B is nearest.’

VI candidate: Sơ đồ luyện tập khác đặt thư viện cạnh lối B, khách sạn cạnh lối D, chợ cạnh lối A. Bạn đến thư viện; nhân viên xác nhận lối B gần nhất.

Feedback EN: Match the destination to its own map label. An exit number or letter is meaningful only within that displayed map; it is not a real Tokyo station instruction.

Feedback VI: Ghép điểm đến với nhãn trên đúng sơ đồ. Chữ lối ra chỉ có nghĩa trong bản đồ đang hiển thị; đây không phải chỉ dẫn cho ga Tokyo có thật.

## TKY-DAILY-011 — TOKYO-DAILY-r2

### TKY-DAILY-011-L1

EN: A staff member says, ‘The local train leaves at 3:15.’ You did not hear the minutes. You say, ‘Sorry, I didn’t catch the time. Could you say that again, please?’ The staff member repeats, ‘Three fifteen.’

VI candidate: Nhân viên nói tàu dừng ở các ga dọc tuyến khởi hành lúc 3:15 nhưng bạn không nghe rõ phút. Bạn xin lỗi, nói mình chưa nghe được giờ và nhờ nhắc lại; nhân viên nói lại ‘three fifteen’.

### TKY-DAILY-011-L2

EN: A cafe worker tells you a table number, but you miss it. You can say, ‘Sorry, could you repeat that?’ or ‘Sorry, I didn’t catch that.’ Both ask the speaker to say the information again.

VI candidate: Nhân viên quán cà phê nói số bàn nhưng bạn không nghe rõ. Bạn có thể nói ‘Sorry, could you repeat that?’ hoặc ‘Sorry, I didn’t catch that.’ Cả hai đều xin người nói nhắc lại thông tin.

Feedback EN: These are natural requests for repetition. They do not accuse the speaker or change the information. Accept more than one polite realization when the task goal is the same.

Feedback VI: Đây là các cách tự nhiên để xin nhắc lại. Chúng không trách người nói và không thay đổi thông tin. Chấp nhận nhiều cách diễn đạt lịch sự khi cùng đạt mục tiêu.

## TKY-DAILY-012 — TOKYO-DAILY-r2

### TKY-DAILY-012-L1

EN: The staff member says, 'Your meeting is in Room 14.' You think you heard Room 40. You ask, 'Sorry, did you say Room 40?' The staff member replies, 'No, Room 14.' You confirm, 'Room 14, right?' The staff member says, 'That's right.'

VI candidate: Nhân viên nói cuộc hẹn ở phòng 14. Bạn nghĩ mình nghe được phòng 40 nên hỏi: 'Xin lỗi, có phải phòng 40 không?' Nhân viên sửa: 'Không, phòng 14.' Bạn hỏi lại: 'Phòng 14, đúng không?' Nhân viên xác nhận: 'Đúng rồi.'

### TKY-DAILY-012-L2

EN: A receptionist says the appointment is at 2:30. You think you heard 3:20. You ask, 'Sorry, did you say 3:20?' The receptionist replies, 'No, 2:30.' You confirm, 'So that's 2:30, right?' The receptionist says, 'Yes.'

VI candidate: Lễ tân nói cuộc hẹn lúc 2:30. Bạn nghĩ mình nghe được 3:20 nên hỏi: 'Xin lỗi, có phải 3:20 không?' Lễ tân sửa: 'Không, 2:30.' Bạn hỏi lại: 'Vậy là 2:30, đúng không?' Lễ tân xác nhận.

Feedback EN: State the detail you think you heard, invite confirmation, then repeat the confirmed detail. A correction or check is appropriate; silently choosing one number risks following the wrong information.

Feedback VI: Nêu chi tiết bạn nghĩ mình đã nghe, mời người kia xác nhận rồi nhắc lại chi tiết đã được xác nhận. Hỏi lại giúp tránh làm theo nhầm số.

# Proposed Tower prompts and choices

Keys remain in the separate private file.

## TWR-TKY-001-V1

The board says baggage claim is left, the exit is right, and trains are straight. Where should you go to collect your checked bag?

VI candidate: Biển ghi khu nhận hành lý ở bên trái, lối ra bên phải và tàu đi thẳng. Bạn nên đi hướng nào để nhận hành lý ký gửi?

- A: Turn left for baggage claim.
- B: Go right for the exit.
- C: Go straight for the trains.

## TWR-TKY-001-V2

You have your bag and need to leave. The second board says exit is straight, trains are left, baggage claim is right. Which direction is the exit?

VI candidate: Bạn đã lấy hành lý và cần rời đi. Biển thứ hai ghi lối ra đi thẳng, tàu bên trái, khu nhận hành lý bên phải. Lối ra ở hướng nào?

- A: Right, toward baggage claim.
- B: Straight, toward the exit.
- C: Left, toward the trains.

## TWR-TKY-002-V1

You need a direct service before 11:30. Which option meets both conditions?

VI candidate: Bạn cần chuyến đi thẳng trước 11:30. Lựa chọn nào đáp ứng cả hai điều kiện?

- A: The shuttle at 11:10; it requires a change.
- B: The direct bus at 11:20.
- C: The train delayed until 11:40.

## TWR-TKY-002-V2

You need a direct service before 12:20. Which option fits?

VI candidate: Bạn cần chuyến đi thẳng trước 12:20. Lựa chọn nào phù hợp?

- A: The direct bus delayed until 12:35.
- B: The shuttle at 12:05; it needs a change.
- C: The direct train at 12:10.

## TWR-TKY-003-V1

You are on Red. Pine is the next stop; Green connects Pine to Lake. What should you do?

VI candidate: Bạn đang đi tuyến Red. Pine là ga kế tiếp; tuyến Green nối Pine với Lake. Bạn cần làm gì?

- A: Get off at Pine, change to Green, then get off at Lake.
- B: Stay on Red until Lake, then look for Green.
- C: Change to Green at Lake, then get off at Pine.

## TWR-TKY-003-V2

You are on the current line approaching Hill. Blue connects Hill to Garden. What is the taught route?

VI candidate: Bạn đang đến gần ga Hill; tuyến Blue nối Hill với Garden. Đâu là lộ trình đã học?

- A: Change to Blue at Garden, then return to Hill.
- B: Get off at Hill, change to Blue, then get off at Garden.
- C: Stay on the current train past Hill and Garden.

## TWR-TKY-004-V1

You are going to the museum. Which platform and time belong to that destination?

VI candidate: Bạn đi bảo tàng. Sân ga và giờ nào thuộc điểm đến này?

- A: Platform 2 at 09:20.
- B: Platform 3 at 09:35.
- C: Platform 2 at 09:35.

## TWR-TKY-004-V2

You are going to the park. Which platform and time belong to it?

VI candidate: Bạn đi công viên. Sân ga và giờ nào thuộc điểm đến này?

- A: Platform 4 at 10:15.
- B: Platform 1 at 10:45.
- C: Platform 1 at 10:15.

## TWR-TKY-005-V1

You want tea. Which shelf label gives the tea's aisle and price?

VI candidate: Bạn muốn mua trà. Nhãn nào ghi đúng lối đi và giá của trà?

- A: Aisle 2, 150 yen.
- B: Aisle 1, 110 yen.
- C: Aisle 3, 170 yen.

## TWR-TKY-005-V2

You want tea. Which shelf label gives its price and aisle?

VI candidate: Bạn muốn mua trà. Nhãn nào ghi đúng giá và lối đi của trà?

- A: Aisle 2, 170 yen.
- B: Aisle 1, 110 yen.
- C: Aisle 3, 140 yen.

## TWR-TKY-006-V1

You already have a bag, want to pay by card, and need proof of purchase. Which response communicates all three choices?

VI candidate: Bạn đã có túi, muốn trả bằng thẻ và cần chứng từ mua hàng. Câu trả lời nào diễn đạt đủ cả ba lựa chọn?

- A: No bag, thanks. By card, please. Could I have a receipt, please?
- B: A bag, please. I will pay in cash. Could I have a receipt?
- C: No bag, thanks. By card, please.

## TWR-TKY-006-V2

You need a bag, want to pay in cash, and want proof of purchase. Which response includes all three?

VI candidate: Bạn cần túi, muốn trả tiền mặt và muốn có chứng từ mua hàng. Câu trả lời nào gồm đủ cả ba?

- A: No bag, thanks. By card, please. Can I have a receipt?
- B: A bag, please. I will pay in cash. Can I have a receipt, please?
- C: A bag, please. I will pay in cash.

## TWR-TKY-007-V1

You want vegetable noodles with no egg. Which order states both choices?

VI candidate: Bạn muốn mì rau và không muốn trứng. Cách gọi nào nêu đúng cả hai lựa chọn?

- A: I'll have the vegetable noodles without egg, please.
- B: Chicken noodles without an egg, please.
- C: Vegetable noodles with an egg, please.

## TWR-TKY-007-V2

You want chicken noodles with no spring onions. Which order states both choices?

VI candidate: Bạn muốn mì gà và không muốn hành lá. Cách gọi nào nêu đúng cả hai lựa chọn?

- A: Vegetable noodles without spring onions, please.
- B: Chicken noodles without spring onions, please.
- C: Chicken noodles with spring onions, please.

## TWR-TKY-008-V1

You ordered vegetable soup but received chicken soup. What is a clear, non-accusatory repair?

VI candidate: Bạn gọi súp rau nhưng được mang súp gà. Cách sửa hiểu lầm nào rõ ràng và không trách móc?

- A: Sorry, I ordered the vegetable soup.
- B: Could we have the bill, please?
- C: I prefer chicken soup.

## TWR-TKY-008-V2

You ordered chicken noodles but received vegetable noodles. Which response names your intended order?

VI candidate: Bạn gọi mì gà nhưng được mang mì rau. Câu nào nêu đúng món bạn đã gọi?

- A: Can we have the check, please?
- B: Sorry, I ordered the chicken noodles.
- C: Vegetable noodles are very good.

## TWR-TKY-009-V1

Starting at Cedar Corner, how do you reach the station on the practice map?

VI candidate: Từ Cedar Corner, bạn đi đến ga theo sơ đồ luyện tập như thế nào?

- A: Go straight past the bank, turn left at the library; the station is next to the post office.
- B: Turn left at the bank, then go straight past the library to the post office.
- C: Go straight past the bank, turn right at the library; the station is next to the post office.

## TWR-TKY-009-V2

Starting at River Corner, how do you reach the museum?

VI candidate: Từ River Corner, bạn đi đến bảo tàng như thế nào?

- A: Go straight past the cafe, turn right at the park; the museum is next to the hotel.
- B: Turn right at the cafe, then go straight to the park; the museum is next to the hotel.
- C: Go straight past the cafe, turn left at the park; the museum is next to the hotel.

## TWR-TKY-010-V1

You did not hear the minutes in the train time. Which response politely asks the staff member to repeat them?

VI candidate: Bạn không nghe rõ phút trong giờ tàu chạy. Câu nào lịch sự nhờ nhân viên nhắc lại?

- A: Sorry, I didn’t catch the time. Could you say that again, please?
- B: Sorry, is that the departure time?
- C: Sorry, which platform does it leave from?

## TWR-TKY-010-V2

You missed a table number. Which response clearly asks the speaker to repeat it?

VI candidate: Bạn không nghe rõ số bàn. Câu nào yêu cầu người nói nhắc lại?

- A: Sorry, where is that table?
- B: Sorry, could you repeat that?
- C: Sorry, is that my table number?

