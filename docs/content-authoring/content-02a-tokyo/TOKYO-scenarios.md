# Tokyo Daily English — scenario authoring

**Revision:** TOKYO-DAILY-r1 · **12 scenarios / 24 source lessons** · **Status:** DRAFT, not published

Each base and retry passage is a source lesson that must be taught before any linked review item. New content is self-contained; legacy jp-arrival does not teach the new material. Place names, operating details, times, prices, menu contents and maps are fictional practice data. Source websites verify context only and are not authors of ATLAS dialogue. Player tasks and response modes are authoring proposals; all scoring mappings are DESIGN_PENDING.

## TKY-DAILY-001 — Find baggage claim before leaving

- **Domain / location:** Airport recovery · fictional Tokyo-trip terminal
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** information assistant · ASK_LOCATION
- **Objectives:** O-LOCATE · **CONTENT-01 idea refs:** DE-003
- **Target language:** Where can I find...?; Turn left/right; exit; baggage claim
- **Vocabulary terms / stable sense IDs:** baggage-claim, exit · VS-baggage-claim, VS-exit
- **Chunks / stable IDs:** where-can-i-find, which-exit · CH-ask-location, CH-which-exit
- **Interaction pattern:** inspect → dialogue → target
- **Difficulty hypothesis:** lexical LOW; sentence LOW; 2 information pieces; inference NONE; distractors MEDIUM; demand RECOGNITION; support: optional Vietnamese, re-read board, vocabulary hint. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **001-STEP-1 / inspect / RECOGNITION:** Read the practice board. Which place do you need?
  - **VI candidate:** Đọc biển luyện tập. Bạn cần đến khu vực nào?
  - **Action:** Inspect the fictional sign and select the named destination.
  - **Support:** labeled sign, optional VI after first attempt · **Scoring:** DESIGN_PENDING
- **001-STEP-2 / dialogue+target / CONTROLLED_APPLICATION:** Ask where baggage claim is, then mark its direction.
  - **VI candidate:** Hỏi khu nhận hành lý ở đâu, rồi đánh dấu hướng đi.
  - **Action:** Choose or say a taught location request and tap the matching direction on the sign.
  - **Support:** replay assistant response · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-001-L1

**EN:** You have checked a bag and need to collect it before leaving. A practice board says BAGGAGE CLAIM: LEFT; EXIT: RIGHT; TRAINS: STRAIGHT. You ask, ‘Where can I find baggage claim?’ The assistant answers, ‘Turn left for baggage claim. The exit is on your right.’

**VI candidate:** Bạn ký gửi hành lý và cần nhận trước khi rời đi. Biển luyện tập ghi: NHẬN HÀNH LÝ: TRÁI; LỐI RA: PHẢI; TÀU: THẲNG. Bạn hỏi khu nhận hành lý ở đâu. Nhân viên chỉ sang trái; lối ra ở bên phải.

### Retry lesson — TKY-DAILY-001-L2

**EN:** You have collected your bag and now need the exit. A second practice board says EXIT: STRAIGHT; TRAINS: LEFT; BAGGAGE CLAIM: RIGHT. You ask, ‘Which exit should I use?’ The assistant says, ‘Go straight for the exit.’

**VI candidate:** Bạn đã nhận hành lý và cần tìm lối ra. Biển luyện tập thứ hai ghi: LỐI RA: THẲNG; TÀU: TRÁI; NHẬN HÀNH LÝ: PHẢI. Bạn hỏi nên dùng lối nào. Nhân viên bảo đi thẳng.

### Teaching and review notes

- **Feedback EN:** Baggage claim is where checked bags are collected; exit is a way out. Match the requested place before following its direction.
- **Feedback VI candidate:** Baggage claim là nơi nhận hành lý ký gửi; exit là lối ra. Xác định đúng nơi cần đến rồi mới theo hướng dẫn.
- **Likely misunderstanding:** Confuse the exit with baggage collection.
- **Transfer proposal:** A cloakroom or information desk after its location labels are taught.
- **Provenance:** S-FICTION, S-NARITA
- **Retry family:** RF-TKY-DAILY-001; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-001-L1 · TOKYO-DAILY-r1 · SHA-256 867a73b4629f86a84f1b4c6a8cbf7aa5c47247f11e51cb70c16888c8ee4a945d · must be taught before assessment.
  - TKY-DAILY-001-L2 · TOKYO-DAILY-r1 · SHA-256 11a267aaced0a12eaf9186e973907e8a2df6ec501da9743a2085585ed4d29a7c · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-002 — Choose a direct service before a stated time

- **Domain / location:** Airport recovery · fictional airport transport desk
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** transport assistant · COMPARE_TRAVEL_INFORMATION
- **Objectives:** O-INFO · **CONTENT-01 idea refs:** DE-054, DE-049
- **Target language:** direct; delayed until; depart at; before
- **Vocabulary terms / stable sense IDs:** delay, direct, depart · VS-delay-service, VS-direct-rail, VS-depart-rail
- **Chunks / stable IDs:** is-it-direct, what-time-leave · CH-confirm-direct-service, CH-ask-departure-time
- **Interaction pattern:** inspect → dialogue → compare → decision
- **Difficulty hypothesis:** lexical MEDIUM; sentence MEDIUM; 4 information pieces; inference LOW; distractors HIGH; demand INTERPRETATION; support: optional Vietnamese, re-read board, highlight two conditions. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **002-STEP-1 / inspect+compare / INTERPRETATION:** Read all three service options and note the time and whether a change is needed.
  - **VI candidate:** Đọc ba lựa chọn và chú ý giờ cùng việc có cần đổi chuyến hay không.
  - **Action:** Inspect a fictional service board and compare two stated conditions.
  - **Support:** highlight requested cutoff and directness · **Scoring:** DESIGN_PENDING
- **002-STEP-2 / decision / INTERPRETATION:** Choose a direct service that leaves before the stated time.
  - **VI candidate:** Chọn chuyến đi thẳng và khởi hành trước giờ đã nêu.
  - **Action:** Select one service; no real-world timetable knowledge is needed.
  - **Support:** re-read board · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-002-L1

**EN:** At this practice desk, the train is delayed until 11:40. A direct bus departs at 11:20. A shuttle departs at 11:10 but requires a change. You need a direct service before 11:30. You ask, ‘Is the bus direct?’ The assistant says, ‘Yes. No change is needed.’

**VI candidate:** Ở quầy luyện tập, tàu bị chậm đến 11:40. Xe buýt đi thẳng khởi hành 11:20. Xe trung chuyển đi 11:10 nhưng cần đổi chuyến. Bạn cần chuyến đi thẳng trước 11:30. Nhân viên xác nhận xe buýt không cần đổi.

### Retry lesson — TKY-DAILY-002-L2

**EN:** On a new practice board, the direct train departs at 12:10, the direct bus is delayed until 12:35, and a shuttle leaves at 12:05 but needs a change. You need a direct service before 12:20. The assistant says, ‘The train is direct and leaves at 12:10.’

**VI candidate:** Bảng luyện tập mới ghi tàu đi thẳng lúc 12:10, xe buýt đi thẳng bị chậm đến 12:35, xe trung chuyển đi 12:05 nhưng phải đổi chuyến. Bạn cần chuyến đi thẳng trước 12:20. Nhân viên xác nhận tàu phù hợp.

### Teaching and review notes

- **Feedback EN:** Direct means no change in this lesson. Compare the requested time and route condition; the earliest departure may not meet both.
- **Feedback VI candidate:** Trong bài này, direct nghĩa là không phải đổi chuyến. So sánh cả giờ và điều kiện hành trình; chuyến sớm nhất có thể không đáp ứng cả hai.
- **Likely misunderstanding:** Pick the earliest service but overlook the change or cutoff time.
- **Transfer proposal:** A coach desk in another city with separately authored options.
- **Provenance:** S-FICTION, S-NARITA
- **Retry family:** RF-TKY-DAILY-002; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-002-L1 · TOKYO-DAILY-r1 · SHA-256 0a6fd952ecb91034dc51503b6cfc6121ccd0c15e81e9e75b35d070385a5afa80 · must be taught before assessment.
  - TKY-DAILY-002-L2 · TOKYO-DAILY-r1 · SHA-256 66d4d28ed6d9345e55cdef4bc2039b4825dfc14c2960b0785ae2ca578fdf46ed · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-003 — Recover after missing a stop

- **Domain / location:** Train and metro · fictional two-line practice network
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** station attendant · FOLLOW_DIRECTIONS
- **Objectives:** O-ROUTE · **CONTENT-01 idea refs:** DE-007, DE-050
- **Target language:** get off at; change to the ... line; then
- **Vocabulary terms / stable sense IDs:** change-rail, stop, get-off · VS-change-rail, VS-stop-rail, VS-get-off
- **Chunks / stable IDs:** change-lines-at, get-off-at · CH-change-lines-at, CH-get-off-at
- **Interaction pattern:** inspect → dialogue → route
- **Difficulty hypothesis:** lexical MEDIUM; sentence MEDIUM; 3 information pieces; inference LOW; distractors MEDIUM; demand APPLICATION; support: optional Vietnamese, labeled diagram, re-read instructions. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **003-STEP-1 / inspect / RECOGNITION:** Trace which line reaches the transfer stop next.
  - **VI candidate:** Xác định tuyến nào sẽ đến ga chuyển tiếp tiếp theo.
  - **Action:** Inspect the fictional two-line diagram.
  - **Support:** labeled network · **Scoring:** DESIGN_PENDING
- **003-STEP-2 / route / APPLICATION:** Put the transfer stop, new line and destination in travel order.
  - **VI candidate:** Sắp xếp ga đổi tuyến, tuyến mới và điểm đến theo thứ tự hành trình.
  - **Action:** Arrange route nodes; the route sequence is taught in the linked lesson.
  - **Support:** replay instructions, optional sequence scaffold · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-003-L1

**EN:** You missed your stop in a practice network. The attendant says, ‘Get off at Pine Stop. Change to the Green Line there. Get off at Lake Stop.’ A labeled diagram shows your Red Line reaches Pine next and Green connects Pine to Lake. It gives no fares or walking directions.

**VI candidate:** Bạn đi quá ga trong mạng lưới luyện tập. Nhân viên nói: ‘Xuống tại Pine. Đổi sang tuyến Green ở đó. Xuống tại Lake.’ Sơ đồ có nhãn cho thấy Red sắp đến Pine và Green nối Pine với Lake. Không có giá vé hay hướng đi bộ.

### Retry lesson — TKY-DAILY-003-L2

**EN:** In a second practice network, get off at Hill Stop, change to the Blue Line there, then get off at Garden Stop. Your current train reaches Hill next; Blue connects Hill to Garden.

**VI candidate:** Trong mạng lưới luyện tập thứ hai, xuống tại Hill, đổi sang tuyến Blue ở đó rồi xuống Garden. Tàu hiện tại đến Hill tiếp theo; Blue nối Hill với Garden.

### Teaching and review notes

- **Feedback EN:** Change lines means continue on another line. Get off means leave the train at the named stop. Follow the order: transfer stop, new line, destination.
- **Feedback VI candidate:** Change lines nghĩa là chuyển sang tuyến khác. Get off là xuống tàu tại ga đã nêu. Theo thứ tự: ga đổi tuyến, tuyến mới, điểm đến.
- **Likely misunderstanding:** Change at the destination, or stay on the first line.
- **Transfer proposal:** A separately sourced Singapore MRT interchange scene.
- **Provenance:** S-FICTION, S-METRO
- **Retry family:** RF-TKY-DAILY-003; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-003-L1 · TOKYO-DAILY-r1 · SHA-256 df188edc9dfce9f896d71f433e175f133dc4260efdfc97f1691b159c64c417e4 · must be taught before assessment.
  - TKY-DAILY-003-L2 · TOKYO-DAILY-r1 · SHA-256 8a3ceff82f5a5e9ad3ff5e7e14942c7c6efed65ac110b6830230b11622b73d0f · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-004 — Match a destination with its platform and departure time

- **Domain / location:** Train and metro · fictional station practice board
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** station attendant · COMPARE_TRAVEL_INFORMATION
- **Objectives:** O-INFO · **CONTENT-01 idea refs:** DE-004, DE-006
- **Target language:** Which platform does it leave from?; Platform two; at nine twenty
- **Vocabulary terms / stable sense IDs:** platform, depart · VS-platform-rail, VS-depart-rail
- **Chunks / stable IDs:** which-platform, what-time-leave · CH-which-platform, CH-ask-departure-time
- **Interaction pattern:** inspect → match → compare
- **Difficulty hypothesis:** lexical LOW; sentence LOW; 4 information pieces; inference LOW; distractors HIGH; demand INTERPRETATION; support: optional Vietnamese, highlight destination row, re-read board. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **004-STEP-1 / inspect / RECOGNITION:** Find the row for your destination.
  - **VI candidate:** Tìm đúng hàng của điểm đến.
  - **Action:** Highlight one destination row on the fictional board.
  - **Support:** destination highlight · **Scoring:** DESIGN_PENDING
- **004-STEP-2 / match / INTERPRETATION:** Match that destination with its platform and departure time.
  - **VI candidate:** Ghép điểm đến với sân ga và giờ khởi hành.
  - **Action:** Match a complete row; do not combine details from two destinations.
  - **Support:** keep row together · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-004-L1

**EN:** The practice board lists MUSEUM: PLATFORM 2, DEPARTS 09:20 and PARK: PLATFORM 3, DEPARTS 09:35. You are going to the museum. You ask, ‘Which platform does it leave from?’ The attendant answers, ‘Platform two. It leaves at nine twenty.’

**VI candidate:** Bảng luyện tập ghi BẢO TÀNG: SÂN GA 2, KHỞI HÀNH 09:20; CÔNG VIÊN: SÂN GA 3, KHỞI HÀNH 09:35. Bạn đi bảo tàng. Nhân viên xác nhận sân ga 2, lúc 09:20.

### Retry lesson — TKY-DAILY-004-L2

**EN:** A new practice board lists PARK: PLATFORM 1, DEPARTS 10:45 and MUSEUM: PLATFORM 4, DEPARTS 10:15. You are going to the park. The attendant says, ‘Platform one. It leaves at ten forty-five.’

**VI candidate:** Bảng mới ghi CÔNG VIÊN: SÂN GA 1, KHỞI HÀNH 10:45; BẢO TÀNG: SÂN GA 4, KHỞI HÀNH 10:15. Bạn đi công viên. Nhân viên xác nhận sân ga 1, lúc 10:45.

### Teaching and review notes

- **Feedback EN:** Keep all details from the same destination row. A platform and time for another destination do not answer this question.
- **Feedback VI candidate:** Giữ các chi tiết cùng một hàng điểm đến. Sân ga và giờ của nơi khác không trả lời câu hỏi này.
- **Likely misunderstanding:** Take the right time from the wrong destination row.
- **Transfer proposal:** An original bus terminal board with destination, bay and departure time.
- **Provenance:** S-FICTION, S-METRO
- **Retry family:** RF-TKY-DAILY-004; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-004-L1 · TOKYO-DAILY-r1 · SHA-256 c24ca98fd15028e909562b460970ac747c765df19f64e075132f4ddd87570024 · must be taught before assessment.
  - TKY-DAILY-004-L2 · TOKYO-DAILY-r1 · SHA-256 9acdb217c76eae9f812a033e35078ef2ceda4bb0e16f0a3455b4363f0e04c33e · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-005 — Find a requested drink and match its price to the item

- **Domain / location:** Convenience store · fictional convenience shop aisle
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** shop assistant · ASK_ITEM_LOCATION_AND_PRICE
- **Objectives:** O-SHOP · **CONTENT-01 idea refs:** DE-018
- **Target language:** Where can I find...?; How much is...?; aisle
- **Vocabulary terms / stable sense IDs:** aisle, price, tea · VS-aisle-shop, VS-price-shop, VS-tea-drink
- **Chunks / stable IDs:** where-can-i-find, how-much-is · CH-ask-location, CH-ask-price
- **Interaction pattern:** dialogue → inspect → target
- **Difficulty hypothesis:** lexical LOW; sentence LOW; 3 information pieces; inference LOW; distractors HIGH; demand INTERPRETATION; support: optional Vietnamese, product highlight, re-read shelf. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **005-STEP-1 / dialogue / CONTROLLED_APPLICATION:** Ask the shop assistant where tea is and how much it costs.
  - **VI candidate:** Hỏi nhân viên trà ở đâu và giá bao nhiêu.
  - **Action:** Choose or compose a short functional request using the taught chunks.
  - **Support:** optional chunk bank · **Scoring:** DESIGN_PENDING
- **005-STEP-2 / target / INTERPRETATION:** Tap the tea label, not a neighboring product.
  - **VI candidate:** Chọn nhãn trà, không chọn sản phẩm bên cạnh.
  - **Action:** Select the product row and read its aisle/price pair.
  - **Support:** product highlight · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-005-L1

**EN:** You want tea. The practice shelf labels say TEA—AISLE 2, 150 YEN; WATER—AISLE 1, 110 YEN; JUICE—AISLE 3, 170 YEN. You ask, ‘Where can I find the tea, and how much is it?’ The assistant says, ‘Aisle two. It is 150 yen.’

**VI candidate:** Bạn muốn mua trà. Nhãn kệ luyện tập ghi TRÀ—LỐI 2, 150 YÊN; NƯỚC—LỐI 1, 110 YÊN; NƯỚC ÉP—LỐI 3, 170 YÊN. Bạn hỏi trà ở đâu và giá bao nhiêu; nhân viên trả lời lối hai, giá 150 yên.

### Retry lesson — TKY-DAILY-005-L2

**EN:** You want tea again, but a new practice shelf has TEA—AISLE 3, 140 YEN; WATER—AISLE 1, 110 YEN; JUICE—AISLE 2, 170 YEN. You ask, ‘How much is the tea?’ The assistant replies, ‘It is 140 yen, in aisle three.’

**VI candidate:** Bạn muốn trà. Nhãn luyện tập mới: TRÀ—LỐI 3, 140 YÊN; NƯỚC—LỐI 1, 110 YÊN; NƯỚC ÉP—LỐI 2, 170 YÊN. Bạn hỏi giá trà. Nhân viên xác nhận giá 140 yên, ở lối ba.

### Teaching and review notes

- **Feedback EN:** An aisle is the passage between shelves. Price is the amount for an item. Match both details to the same product.
- **Feedback VI candidate:** Aisle là lối đi giữa các kệ; price là giá món hàng. Ghép cả hai chi tiết với đúng sản phẩm.
- **Likely misunderstanding:** Use a nearby item’s price or aisle.
- **Transfer proposal:** A different shop with new item names and labels taught first.
- **Provenance:** S-FICTION
- **Retry family:** RF-TKY-DAILY-005; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-005-L1 · TOKYO-DAILY-r1 · SHA-256 26e4f46760a542511397e485d5c34a3027eb904ef93e7699d215457606d5fb74 · must be taught before assessment.
  - TKY-DAILY-005-L2 · TOKYO-DAILY-r1 · SHA-256 f71900d573e23f59327e25b7bd4dcc80102aec19df2f5ba8216bab356af4c2c9 · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-006 — Decline a bag, choose payment and request a receipt

- **Domain / location:** Convenience store · fictional shop checkout
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** cashier · REQUEST_TRANSACTION
- **Objectives:** O-SHOP · **CONTENT-01 idea refs:** DE-021
- **Target language:** No bag, thanks; By card/cash, please; Could I have a receipt, please?
- **Vocabulary terms / stable sense IDs:** bag, cash, card, receipt · VS-bag-store, VS-cash-payment, VS-card-payment, VS-receipt
- **Chunks / stable IDs:** receipt, bag · CH-request-receipt, CH-state-bag-choice
- **Interaction pattern:** dialogue → compose
- **Difficulty hypothesis:** lexical MEDIUM; sentence MEDIUM; 3 information pieces; inference LOW; distractors MEDIUM; demand CONTROLLED; support: optional Vietnamese, vocabulary hint, token ordering. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **006-STEP-1 / dialogue / RECOGNITION:** Listen to the cashier’s bag and payment questions.
  - **VI candidate:** Nghe câu hỏi của nhân viên về túi và cách thanh toán.
  - **Action:** Identify which choices belong to the learner’s own preference.
  - **Support:** replay dialogue · **Scoring:** DESIGN_PENDING
- **006-STEP-2 / compose / CONTROLLED:** Tell the cashier whether you need a bag, choose card or cash, and ask for a receipt.
  - **VI candidate:** Nói rõ có cần túi hay không, chọn thẻ hoặc tiền mặt và xin biên lai.
  - **Action:** Build a short three-part response from tokens; accept reviewed Can/Could variants.
  - **Support:** optional chunk bank, token ordering · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-006-L1

**EN:** At checkout the cashier asks, ‘A bag? Cash or card?’ You already have a bag and want to pay by card. After payment, you need proof of purchase. You say, ‘No bag, thanks. By card, please. Could I have a receipt, please?’

**VI candidate:** Ở quầy thu ngân, nhân viên hỏi bạn có cần túi và trả tiền mặt hay thẻ. Bạn đã có túi, muốn trả bằng thẻ rồi xin chứng từ mua hàng. Bạn từ chối túi, chọn thẻ và xin biên lai.

### Retry lesson — TKY-DAILY-006-L2

**EN:** This time you need a bag and want to pay in cash. After paying, you ask, ‘A bag, please. I will pay in cash. Can I have a receipt, please?’ The practice scene states no bag fee or general store payment rule.

**VI candidate:** Lần này bạn cần túi và muốn trả tiền mặt. Sau khi trả tiền, bạn xin biên lai. Cảnh luyện tập không nêu phí túi hay quy định thanh toán chung của cửa hàng.

### Teaching and review notes

- **Feedback EN:** A receipt records payment; a bag carries the purchase. Can I and Could I are both acceptable here. Payment and bag choices belong to this customer’s preference.
- **Feedback VI candidate:** Receipt ghi nhận khoản đã trả; bag đựng món mua. Can I và Could I đều phù hợp ở đây. Cách trả tiền và nhu cầu túi tùy khách trong tình huống này.
- **Likely misunderstanding:** Confuse receipt with recipe, or keep one requested detail while changing another.
- **Transfer proposal:** A cafe receipt, after its payment interaction is taught.
- **Provenance:** S-FICTION, S-RECEIPT
- **Retry family:** RF-TKY-DAILY-006; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-006-L1 · TOKYO-DAILY-r1 · SHA-256 b8da76cbeb12c575f86ad19f47635da031161f6087023d1a92a08e32030f4671 · must be taught before assessment.
  - TKY-DAILY-006-L2 · TOKYO-DAILY-r1 · SHA-256 7023fdb34f89733c49ef2605c3f27e342a2e8d91fc4b1329aadba78774bd8f09 · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-007 — Ask about ingredients and order a dish without an optional ingredient

- **Domain / location:** Restaurant and food · fictional noodle shop
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** server · CLARIFY_FOOD_ORDER
- **Objectives:** O-FOOD · **CONTENT-01 idea refs:** DE-014, DE-015
- **Target language:** What is in...?; without egg; please
- **Vocabulary terms / stable sense IDs:** ingredient, without, order · VS-ingredient, VS-without, VS-order-food
- **Chunks / stable IDs:** ingredients, without · CH-ask-ingredients, CH-exclude-ingredient
- **Interaction pattern:** inspect → dialogue → order
- **Difficulty hypothesis:** lexical MEDIUM; sentence MEDIUM; 2 information pieces; inference LOW; distractors HIGH; demand APPLICATION; support: optional Vietnamese, menu reread, ingredient hint. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **007-STEP-1 / inspect / RECOGNITION:** Check the fictional menu for the dish and optional ingredient.
  - **VI candidate:** Xem món ăn và thành phần thêm tùy chọn trên thực đơn hư cấu.
  - **Action:** Inspect menu details; this is not an allergy-safety task.
  - **Support:** menu reread · **Scoring:** DESIGN_PENDING
- **007-STEP-2 / order / APPLICATION:** Order the selected dish with your stated preference.
  - **VI candidate:** Gọi đúng món và nêu sở thích đã chọn.
  - **Action:** Select the dish, then compose a request excluding the optional item.
  - **Support:** ingredient hint · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-007-L1

**EN:** You ask, ‘What is in the vegetable noodles?’ The server says, ‘Noodles, vegetable broth and mushrooms. An egg is optional.’ You prefer no egg. The menu also lists chicken noodles. You order, ‘I'll have the vegetable noodles without egg, please.’ This is preference practice, not an allergy check.

**VI candidate:** Bạn hỏi mì rau có gì. Nhân viên nói gồm mì, nước dùng rau và nấm; trứng là phần thêm tùy chọn. Bạn không muốn trứng và gọi mì rau không thêm trứng. Bài luyện sở thích này không kiểm tra dị ứng.

### Retry lesson — TKY-DAILY-007-L2

**EN:** Chicken noodles in the same fictional shop include chicken broth. Spring onions are optional. You prefer no spring onions and say, ‘Chicken noodles without spring onions, please.’ The menu also lists vegetable noodles. No allergen or cross-contact guarantee is made.

**VI candidate:** Mì gà ở quán hư cấu có nước dùng gà; hành lá là phần tùy chọn. Bạn không muốn hành lá nên gọi mì gà không thêm hành. Không có bảo đảm về dị ứng hay lây nhiễm chéo.

### Teaching and review notes

- **Feedback EN:** Ingredients are foods used in a dish. Without excludes the named item from this order. Asking about ingredients does not establish medical safety; never infer that a vegetable dish is allergy-safe.
- **Feedback VI candidate:** Ingredients là nguyên liệu của món. Without yêu cầu bỏ phần được nêu. Hỏi nguyên liệu không xác nhận an toàn y tế; không suy ra món rau an toàn dị ứng.
- **Likely misunderstanding:** Choose the right dish but add the ingredient the learner meant to exclude.
- **Transfer proposal:** A London cafe order after its menu vocabulary is explicitly taught.
- **Provenance:** S-FICTION, S-BC
- **Retry family:** RF-TKY-DAILY-007; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-007-L1 · TOKYO-DAILY-r1 · SHA-256 8cb4f8e088aabde09cdcead91edbf8eaceaecece4cd91b7010242eeae69cd40b · must be taught before assessment.
  - TKY-DAILY-007-L2 · TOKYO-DAILY-r1 · SHA-256 9798cd003d8673d71bdd7e7d09b7895ce84133b32f43db568ee46221f3e58c87 · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-008 — Correct a dish and request the bill

- **Domain / location:** Restaurant and food · fictional cafe table
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** server · REPAIR_UNDERSTANDING
- **Objectives:** O-FOOD, O-REPAIR · **CONTENT-01 idea refs:** DE-016, DE-055
- **Target language:** Sorry, I ordered...; Could we have the bill, please?; check
- **Vocabulary terms / stable sense IDs:** order, bill, receipt · VS-order-food, VS-bill-restaurant, VS-receipt
- **Chunks / stable IDs:** bill, meant · CH-request-bill, CH-repair-order
- **Interaction pattern:** dialogue → compose
- **Difficulty hypothesis:** lexical MEDIUM; sentence MEDIUM; 2 information pieces; inference LOW; distractors MEDIUM; demand APPLICATION; support: optional Vietnamese, reread order, phrase hint. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **008-STEP-1 / dialogue+compose / CONTROLLED:** The server brought a different dish. Explain calmly what you ordered.
  - **VI candidate:** Nhân viên mang nhầm món. Hãy bình tĩnh nói rõ món bạn đã gọi.
  - **Action:** Compose a clear repair naming the intended dish; accept equivalent reviewed forms.
  - **Support:** re-read the order, phrase hint after first attempt · **Scoring:** DESIGN_PENDING
- **008-STEP-2 / dialogue / APPLICATION:** When you are ready to pay, ask for the restaurant bill.
  - **VI candidate:** Khi sẵn sàng thanh toán, hãy xin hóa đơn nhà hàng.
  - **Action:** Choose a natural request; review bill/check variation by target variety.
  - **Support:** optional chunk bank · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-008-L1

**EN:** You ordered vegetable soup, but the server brings chicken soup. You say, ‘Sorry, I ordered the vegetable soup.’ The server checks and replaces it. After the meal, you ask, ‘Could we have the bill, please?’ In this scene bill is the amount to pay; a receipt follows payment.

**VI candidate:** Bạn gọi súp rau nhưng được mang súp gà. Bạn xin lỗi và nói rõ mình đã gọi súp rau; nhân viên kiểm tra rồi đổi món. Sau bữa ăn, bạn xin hóa đơn tính tiền. Bill là khoản cần thanh toán; receipt là biên lai sau khi trả.

### Retry lesson — TKY-DAILY-008-L2

**EN:** You ordered chicken noodles but receive vegetable noodles. You say, ‘Sorry, I ordered the chicken noodles.’ After the corrected meal, ‘Can we have the check, please?’ also asks for the restaurant bill. Bill and check are both acceptable here.

**VI candidate:** Bạn gọi mì gà nhưng được mang mì rau. Bạn nói rõ đã gọi mì gà. Sau khi món được đổi, bạn có thể xin check; trong bối cảnh nhà hàng, từ này cũng chỉ hóa đơn tính tiền. Bill và check đều được.

### Teaching and review notes

- **Feedback EN:** Name the dish you intended without blaming the server. Then ask for payment when ready. Bill and check must not be treated as opposing answers in this context.
- **Feedback VI candidate:** Nêu món mình định gọi mà không đổ lỗi cho nhân viên. Khi cần thanh toán thì xin hóa đơn. Trong ngữ cảnh này không đánh bill và check thành hai đáp án đối lập.
- **Likely misunderstanding:** Request the bill but fail to identify the dish that needs correction.
- **Transfer proposal:** Correcting a cafe drink after the relevant drink names are taught.
- **Provenance:** S-FICTION, S-BC
- **Retry family:** RF-TKY-DAILY-008; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-008-L1 · TOKYO-DAILY-r1 · SHA-256 96ea13b4828d1b03b9573cdfb480008f30f9ca1d454dce39939b9ef9808c9a79 · must be taught before assessment.
  - TKY-DAILY-008-L2 · TOKYO-DAILY-r1 · SHA-256 51ad3ae65c41faba5089e0bf12404db96d67691627cba84b59492128c65962c0 · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-009 — Reach a destination using two landmarks and a turn

- **Domain / location:** Street and city navigation · fictional station-to-library street
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** pedestrian · ASK_FOR_DIRECTIONS
- **Objectives:** O-ROUTE · **CONTENT-01 idea refs:** DE-026, DE-027
- **Target language:** How do I get to...?; Go straight past...; Turn left/right at...; next to
- **Vocabulary terms / stable sense IDs:** straight, turn-left, next-to · VS-straight-route, VS-turn-direction, VS-next-to
- **Chunks / stable IDs:** how-do-i-get-to, go-past · CH-ask-directions, CH-go-past-landmark
- **Interaction pattern:** inspect → dialogue → route → recall
- **Difficulty hypothesis:** lexical MEDIUM; sentence MEDIUM; 4 information pieces; inference LOW; distractors HIGH; demand APPLICATION; support: optional Vietnamese, labeled map, replay directions. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **009-STEP-1 / inspect / RECOGNITION:** Study the starting point and landmarks on the practice map.
  - **VI candidate:** Xem điểm xuất phát và các mốc trên bản đồ luyện tập.
  - **Action:** Inspect the labeled fictional route map.
  - **Support:** labeled map · **Scoring:** DESIGN_PENDING
- **009-STEP-2 / route+recall / APPLICATION:** Give the directions in order from the starting corner to the destination.
  - **VI candidate:** Sắp xếp chỉ dẫn theo thứ tự từ góc xuất phát đến điểm đến.
  - **Action:** Sequence pass-landmark, turn and final location clue.
  - **Support:** replay directions, optional map labels · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-009-L1

**EN:** You are at Cedar Corner and want to reach the station. The pedestrian says, ‘Go straight past the bank. Turn left at the library. The station is next to the post office.’ A simple labeled map shows those places in that order.

**VI candidate:** Bạn đang ở Cedar Corner và muốn đến ga. Người đi đường chỉ: đi thẳng qua ngân hàng, rẽ trái ở thư viện; ga nằm cạnh bưu điện. Sơ đồ có nhãn thể hiện đúng thứ tự đó.

### Retry lesson — TKY-DAILY-009-L2

**EN:** You are at River Corner and want the museum. A local says, ‘Go straight past the cafe. Turn right at the park. The museum is next to the hotel.’ The practice map confirms each landmark.

**VI candidate:** Bạn đang ở River Corner và muốn đến bảo tàng. Người địa phương chỉ đi thẳng qua quán cà phê, rẽ phải ở công viên; bảo tàng nằm cạnh khách sạn. Sơ đồ luyện tập xác nhận thứ tự.

### Teaching and review notes

- **Feedback EN:** Keep the route order: continue past the first landmark, turn at the named place, then use the final location clue. Left and right are relative to the traveler facing forward on this map.
- **Feedback VI candidate:** Giữ đúng thứ tự: đi qua mốc đầu, rẽ tại địa điểm được nêu rồi dùng manh mối vị trí cuối. Trái/phải tính theo hướng người đi đang nhìn trên sơ đồ.
- **Likely misunderstanding:** Turn at the first landmark or reverse left and right.
- **Transfer proposal:** A separately authored London street map with its own landmarks.
- **Provenance:** S-FICTION, S-METRO
- **Retry family:** RF-TKY-DAILY-009; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-009-L1 · TOKYO-DAILY-r1 · SHA-256 466802ad644891c667041de8d634eb8a5cf1f93f8670e5acbe1e2cf977402bc9 · must be taught before assessment.
  - TKY-DAILY-009-L2 · TOKYO-DAILY-r1 · SHA-256 2d1a74173373fd83be6f3b407f8e0b76d402c48e2c82464ec02d1e6cfe135462 · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-010 — Confirm the exit nearest a named destination

- **Domain / location:** Street and city navigation · fictional station exit map
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** station assistant · CONFIRM_DESTINATION
- **Objectives:** O-LOCATE · **CONTENT-01 idea refs:** DE-002
- **Target language:** Which exit is nearest the museum?; Exit C; nearest
- **Vocabulary terms / stable sense IDs:** exit, nearest · VS-exit, VS-nearest
- **Chunks / stable IDs:** which-exit · CH-which-exit
- **Interaction pattern:** inspect → target → match
- **Difficulty hypothesis:** lexical LOW; sentence LOW; 3 information pieces; inference NONE; distractors MEDIUM; demand RECOGNITION; support: optional Vietnamese, map labels, destination highlight. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **010-STEP-1 / inspect / RECOGNITION:** Read the exit map and locate your destination.
  - **VI candidate:** Đọc sơ đồ lối ra và tìm điểm đến.
  - **Action:** Inspect the fictional station map; exit labels apply only to this map.
  - **Support:** destination highlight · **Scoring:** DESIGN_PENDING
- **010-STEP-2 / target / RECOGNITION:** Select the exit marked beside your destination.
  - **VI candidate:** Chọn lối ra được đánh dấu cạnh điểm đến.
  - **Action:** Tap the corresponding exit label.
  - **Support:** re-read map · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-010-L1

**EN:** A practice station map marks the museum beside Exit C, the park beside Exit A, and the river beside Exit B. You are going to the museum. You ask, ‘Which exit is nearest the museum?’ The assistant answers, ‘Exit C.’

**VI candidate:** Sơ đồ ga luyện tập đánh dấu bảo tàng cạnh lối C, công viên cạnh lối A, sông cạnh lối B. Bạn đến bảo tàng và hỏi lối ra nào gần nhất; nhân viên trả lời lối C.

### Retry lesson — TKY-DAILY-010-L2

**EN:** A different practice map places the library beside Exit B, the hotel beside Exit D, and the market beside Exit A. You are going to the library. The assistant confirms, ‘Exit B is nearest.’

**VI candidate:** Sơ đồ luyện tập khác đặt thư viện cạnh lối B, khách sạn cạnh lối D, chợ cạnh lối A. Bạn đến thư viện; nhân viên xác nhận lối B gần nhất.

### Teaching and review notes

- **Feedback EN:** Match the destination to its own map label. An exit number or letter is meaningful only within that displayed map; it is not a real Tokyo station instruction.
- **Feedback VI candidate:** Ghép điểm đến với nhãn trên đúng sơ đồ. Chữ lối ra chỉ có nghĩa trong bản đồ đang hiển thị; đây không phải chỉ dẫn cho ga Tokyo có thật.
- **Likely misunderstanding:** Choose the nearest-looking exit from a different destination row.
- **Transfer proposal:** An airport departure-hall exit map created and taught for that venue.
- **Provenance:** S-FICTION, S-METRO
- **Retry family:** RF-TKY-DAILY-010; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-010-L1 · TOKYO-DAILY-r1 · SHA-256 7d1e200fbab599db77a5c588a8cd1e58177be81f624d3247d851915cd2d58505 · must be taught before assessment.
  - TKY-DAILY-010-L2 · TOKYO-DAILY-r1 · SHA-256 e31b553020a9033a33e7d1d304a153b02fe402a89210495108c5975740951f5d · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-011 — Ask a speaker to repeat a time that was not heard

- **Domain / location:** Social repair · fictional station information counter
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** station staff member · REQUEST_REPETITION
- **Objectives:** O-REPAIR · **CONTENT-01 idea refs:** DE-032
- **Target language:** Could you say that again, please?; Could you repeat that?; I did not catch...
- **Vocabulary terms / stable sense IDs:** repeat, again, did-not-catch · VS-repeat, VS-again, VS-catch-hear
- **Chunks / stable IDs:** could-you-say-that-again, didnt-catch · CH-ask-repeat, CH-signal-missed-info
- **Interaction pattern:** dialogue → recall → compose
- **Difficulty hypothesis:** lexical MEDIUM; sentence LOW; 1 information pieces; inference NONE; distractors MEDIUM; demand RECALL; support: optional Vietnamese, replay once, phrase bank after first attempt. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **011-STEP-1 / dialogue / RECALL:** Listen for the time; one detail is deliberately missed on the first pass.
  - **VI candidate:** Nghe giờ tàu; lượt đầu cố ý bỏ lỡ một chi tiết.
  - **Action:** Use a taught repetition request rather than guessing; accept natural equivalent requests.
  - **Support:** one replay, optional phrase bank after first attempt · **Scoring:** DESIGN_PENDING
- **011-STEP-2 / recall / RECALL:** After the speaker repeats the time, report the time you heard.
  - **VI candidate:** Sau khi người nói nhắc lại, cho biết giờ bạn nghe được.
  - **Action:** Recall the repeated time; numeric or spoken format can be accepted.
  - **Support:** transcript after attempt · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-011-L1

**EN:** A staff member says, ‘The local train leaves at 3:15.’ You did not hear the minutes. You say, ‘Sorry, I didn’t catch the time. Could you say that again, please?’ The staff member repeats, ‘Three fifteen.’

**VI candidate:** Nhân viên nói tàu thường khởi hành lúc 3:15 nhưng bạn không nghe rõ phút. Bạn xin lỗi, nói mình chưa nghe được giờ và nhờ nhắc lại; nhân viên nói lại ‘three fifteen’.

### Retry lesson — TKY-DAILY-011-L2

**EN:** A cafe worker tells you a table number, but you miss it. You can say, ‘Sorry, could you repeat that?’ or ‘Sorry, I didn’t catch that.’ Both ask the speaker to say the information again.

**VI candidate:** Nhân viên quán cà phê nói số bàn nhưng bạn không nghe rõ. Bạn có thể nói ‘Sorry, could you repeat that?’ hoặc ‘Sorry, I didn’t catch that.’ Cả hai đều xin người nói nhắc lại thông tin.

### Teaching and review notes

- **Feedback EN:** These are natural requests for repetition. They do not accuse the speaker or change the information. Accept more than one polite realization when the task goal is the same.
- **Feedback VI candidate:** Đây là các cách tự nhiên để xin nhắc lại. Chúng không trách người nói và không thay đổi thông tin. Chấp nhận nhiều cách diễn đạt lịch sự khi cùng đạt mục tiêu.
- **Likely misunderstanding:** Guess the missing detail instead of asking, or apologize without making a clear request.
- **Transfer proposal:** A workplace conversation with relationship-appropriate register reviewed separately.
- **Provenance:** S-FICTION, S-BC
- **Retry family:** RF-TKY-DAILY-011; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-011-L1 · TOKYO-DAILY-r1 · SHA-256 f53891a49608d005db2246767754222d453d3cc73bcf17276b4b2513a22f2441 · must be taught before assessment.
  - TKY-DAILY-011-L2 · TOKYO-DAILY-r1 · SHA-256 4fda8fdfc8ac897bfd95829e4cfd0f1ba7c8bc2bd6ee94ebb9402c6396448d2d · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

## TKY-DAILY-012 — Correct a misunderstood room number and confirm the repair

- **Domain / location:** Social repair · fictional journey-planning counter
- **Version / status:** TOKYO-DAILY-r1 · DRAFT
- **NPC / intent:** help-desk staff member · CLARIFY_AND_CONFIRM
- **Objectives:** O-REPAIR, O-INFO · **CONTENT-01 idea refs:** DE-039, DE-055
- **Target language:** Did you say Room 14?; I meant...; So that is..., right?
- **Vocabulary terms / stable sense IDs:** mean, room, confirm · VS-mean-intended, VS-room-number, VS-confirm
- **Chunks / stable IDs:** did-you-mean, i-meant, so-thats · CH-confirm-heard-detail, CH-correct-heard-detail, CH-confirm-understanding
- **Interaction pattern:** dialogue → decision → compose → recall
- **Difficulty hypothesis:** lexical MEDIUM; sentence MEDIUM; 2 information pieces; inference LOW; distractors HIGH; demand CONTROLLED; support: optional Vietnamese, replay, confirmation sequence scaffold. CEFR A2–B1 hypothesis only.

### Player interaction plan — not a runtime contract

- **012-STEP-1 / dialogue+decision / CONTROLLED:** You heard a different room number. State what you heard and ask the staff member to confirm.
  - **VI candidate:** Bạn nghe một số phòng khác. Nêu số bạn nghe được và nhờ nhân viên xác nhận.
  - **Action:** Ask a confirmation question that names the suspected number.
  - **Support:** replay, confirmation scaffold · **Scoring:** DESIGN_PENDING
- **012-STEP-2 / compose / CONTROLLED:** After the staff member confirms, repeat the correct detail to check shared understanding.
  - **VI candidate:** Sau khi nhân viên xác nhận, nhắc lại chi tiết đúng để kiểm tra hai bên hiểu giống nhau.
  - **Action:** Compose a concise confirmation; equivalent natural phrasing needs review.
  - **Support:** phrase hint · **Scoring:** DESIGN_PENDING

### Base lesson — TKY-DAILY-012-L1

**EN:** The staff member says, ‘Your meeting is in Room 14.’ You heard Room 40 and want to confirm before walking away. You ask, ‘Sorry, did you say Room 14?’ The staff member confirms, ‘Yes, Room 14.’ You reply, ‘So that’s Room 14, right?’

**VI candidate:** Nhân viên nói cuộc hẹn ở phòng 14. Bạn nghe thành phòng 40 và muốn xác nhận trước khi đi. Bạn hỏi lại có phải phòng 14 không; nhân viên xác nhận, bạn nhắc lại ‘Vậy là phòng 14, đúng không?’

### Retry lesson — TKY-DAILY-012-L2

**EN:** A receptionist says the appointment is at 2:30, but you heard 3:20. You ask, ‘Sorry, did you say 2:30?’ After the receptionist confirms, you say, ‘So that’s 2:30, right?’ The numbers differ, but the repair pattern is the same.

**VI candidate:** Lễ tân nói cuộc hẹn lúc 2:30 nhưng bạn nghe thành 3:20. Bạn hỏi lại ‘Có phải 2:30 không?’ Sau khi lễ tân xác nhận, bạn nhắc lại 2:30 để kiểm tra.

### Teaching and review notes

- **Feedback EN:** State the detail you think you heard, invite confirmation, then repeat the confirmed detail. A correction or check is appropriate; silently choosing one number risks following the wrong information.
- **Feedback VI candidate:** Nêu chi tiết bạn nghĩ mình đã nghe, mời người kia xác nhận rồi nhắc lại chi tiết đã được xác nhận. Hỏi lại giúp tránh làm theo nhầm số.
- **Likely misunderstanding:** Repeat the mistaken detail as if it were confirmed, or skip the confirmation turn.
- **Transfer proposal:** Confirming a platform or appointment time after the relevant venue data is taught.
- **Provenance:** S-FICTION, S-BC
- **Retry family:** RF-TKY-DAILY-012; both variants change meaningful information, not answer ordering.
  - TKY-DAILY-012-L1 · TOKYO-DAILY-r1 · SHA-256 309f3b209962b2a8f8158a375fee5dca59f7aca09459e8e48ba2925d78aea765 · must be taught before assessment.
  - TKY-DAILY-012-L2 · TOKYO-DAILY-r1 · SHA-256 d6d80826810a04f93b59af0e9946aaabe0e214ebd9d043e4384bbec43613bdd2 · must be taught before assessment.
- **Cultural / factual boundary:** Fictional practice context; no live venue rule, route, fare, schedule, allergy assurance or Tokyo-wide cultural claim is made.
- **Review:** EN, VI, cultural, assessment and educator sign-offs all pending; no reviewer evidence claimed.

