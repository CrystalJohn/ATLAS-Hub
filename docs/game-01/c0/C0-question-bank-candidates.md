# C0 question bank candidates

**DRAFT — pending independent bilingual educator and independent adversarial signoff.** Assistant EN/VI semantic self-check only, 2026-10-26. No publication approval. Source: current local commit `e1d07867e799e36bec6c550dca9e4f1dcf258dfe`.

12 records / 14 atomic decisions: F1=4, F2=2, F3=2, F4=2, F5=2 two-part bosses. Each run has four single questions + one two-part boss = six decisions, five floors. This is below 20–30 deliberately: [source limits and rationale](C0-learning-objectives-and-provenance.md#bank-capacity). These are related candidate variants, not 12 independent tests.

[Structured editorial payload](C0-question-bank-candidates.json) is the source for this review rendering; it is docs only. [P01–P08 provenance](C0-learning-objectives-and-provenance.md#taught-source-register), [quality matrix](C0-editorial-quality-matrix.md), [contract](C0-content-contract.md). Choice IDs are local to part; full key is question/revision/part/choice. Choice order is not the key.

All new prompts, distractors and translations below are candidates. Existing lesson EN excerpts are pinned in provenance; candidate VI may be more explicit than the shared source VI. Do not expose candidate VI answers before Challenge submission; use it in editorial review, Practice and feedback. None of the distractors is condemned as bad English merely for missing the stated goal.

## g01-c0-air-001 · Floor 1

Revision 1 · **DRAFT** · family `f1-airport-lexical-senses` · cued-recognition.

**Band hypothesis:** A2 audience; foundation may be A1. Place/vehicle/document distinction; no evidence of B1 reading.

**Context EN:** At the airport: “Where is the train station?”

**Context VI candidate:** Tại sân bay: “Ga tàu ở đâu?”

### p1

**EN:** In this question, what does “station” name?

**VI candidate:** Trong câu hỏi này, “station” chỉ gì?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | The place to go for the train. | Nơi đến để đi tàu. | ACCEPT | Correct: station names the place; the lesson specifies a train station. / Đúng: station chỉ địa điểm; bài học nói rõ đây là ga tàu. |
| c2 | The train you travel on. | Con tàu bạn đi. | REJECT | Train names the vehicle, not the station. / Train chỉ phương tiện, không phải nhà ga. |
| c3 | The ticket for the journey. | Vé cho chuyến đi. | REJECT | Ticket names the travel ticket, not the place. / Ticket chỉ vé đi lại, không phải địa điểm. |

**Only accepted choice:** `c1`. **Taught sources:** [P01](C0-learning-objectives-and-provenance.md#p01), [P02](C0-learning-objectives-and-provenance.md#p02), [P04](C0-learning-objectives-and-provenance.md#p04). **Objective:** AIR-LEX. **Lesson return:** [R-VOC](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-002 · Floor 1

Revision 1 · **DRAFT** · family `f1-airport-lexical-senses` · cued-recognition.

**Band hypothesis:** A2 audience; foundation may be A1. Identifies ticket in a taught sentence, without testing purchase/price/quantity.

**Context EN:** “I need a train ticket.”

**Context VI candidate:** “Tôi cần một vé tàu.”

### p1

**EN:** What does this person say they need?

**VI candidate:** Người này nói họ cần gì?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | station | station — ga tàu | REJECT | Station is the place, not the ticket. / Station là địa điểm, không phải vé. |
| c2 | ticket | ticket — vé | ACCEPT | Correct: ticket is the item needed for travel in the taught example. / Đúng: ticket là vé cần dùng để đi lại trong ví dụ đã học. |
| c3 | train | train — tàu hỏa | REJECT | Train is the vehicle, not its ticket. / Train là phương tiện, không phải vé đi tàu. |

**Only accepted choice:** `c2`. **Taught sources:** [P02](C0-learning-objectives-and-provenance.md#p02), [P01](C0-learning-objectives-and-provenance.md#p01), [P04](C0-learning-objectives-and-provenance.md#p04). **Objective:** AIR-LEX. **Lesson return:** [R-VOC](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-003 · Floor 1

Revision 1 · **DRAFT** · family `f1-airport-lexical-senses` · cued-recognition.

**Band hypothesis:** A2 audience; foundation may be A1. Recognizes the taught travel intention; does not infer a ticket transaction.

**Context EN:** “I would like to take the train.”

**Context VI candidate:** “Tôi muốn đi tàu.”

### p1

**EN:** What does the person want to do?

**VI candidate:** Người này muốn làm gì?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | Ask where the station is. | Hỏi ga tàu ở đâu. | REJECT | This sentence states a travel choice; it does not ask for a location. / Câu này nêu lựa chọn đi lại; không hỏi vị trí. |
| c2 | Ask for a train ticket. | Đề nghị lấy một vé tàu. | REJECT | A ticket may be needed later, but this sentence does not ask for one. / Sau đó có thể cần vé, nhưng câu này không đề nghị lấy vé. |
| c3 | Travel by train. | Đi bằng tàu hỏa. | ACCEPT | Correct: take the train expresses travel by train in this example. / Đúng: take the train diễn đạt việc đi bằng tàu trong ví dụ này. |

**Only accepted choice:** `c3`. **Taught sources:** [P04](C0-learning-objectives-and-provenance.md#p04), [P01](C0-learning-objectives-and-provenance.md#p01), [P02](C0-learning-objectives-and-provenance.md#p02). **Objective:** AIR-LEX. **Lesson return:** [R-VOC](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-004 · Floor 1

Revision 1 · **DRAFT** · family `f1-airport-lexical-senses` · cued-recognition.

**Band hypothesis:** A2 audience; foundation may be A1. Recognizes the taught function of please; no ranking of can versus could.

**Context EN:** “Could you help me, please?”

**Context VI candidate:** “Bạn giúp tôi được không?”

### p1

**EN:** What does “please” do in this airport request?

**VI candidate:** “Please” có tác dụng gì trong lời nhờ giúp đỡ ở sân bay này?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | Makes the request polite. | Làm lời đề nghị lịch sự hơn. | ACCEPT | Correct: the vocabulary note teaches please as a polite request marker. / Đúng: mục từ vựng dạy please dùng trong lời đề nghị lịch sự. |
| c2 | Names the transport the person wants. | Nêu phương tiện người nói muốn đi. | REJECT | Please does not name transport; train does that in the lesson. / Please không chỉ phương tiện; train mới chỉ phương tiện trong bài. |
| c3 | Shows the direction to the station. | Chỉ hướng đi tới ga tàu. | REJECT | Please gives no direction; the sign and Mika’s reply provide that. / Please không chỉ hướng; biển và lời đáp của Mika mới cung cấp hướng đi. |

**Only accepted choice:** `c1`. **Taught sources:** [P03](C0-learning-objectives-and-provenance.md#p03), [P04](C0-learning-objectives-and-provenance.md#p04), [P06](C0-learning-objectives-and-provenance.md#p06). **Objective:** AIR-LEX. **Lesson return:** [R-VOC](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-005 · Floor 2

Revision 1 · **DRAFT** · family `f2-original-sign` · cued-recognition.

**Band hypothesis:** A2 audience; simple sign recognition. Matches a taught label to an arrow; not real Narita navigation.

**Context EN:** Fictional terminal: TRAINS → · BUSES ← · EXIT ↑. These are the original practice signs.

**Context VI candidate:** Nhà ga hư cấu: TRAINS → · BUSES ← · EXIT ↑. Đây là các biển luyện tập trong bài gốc.

### p1

**EN:** You want the train station. Which way does its sign point?

**VI candidate:** Bạn muốn tới ga tàu. Biển tương ứng chỉ hướng nào?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | Left (←). | Sang trái (←). | REJECT | Left is the BUSES arrow, not the train direction in this scene. / Mũi tên sang trái thuộc BUSES, không phải hướng tàu trong cảnh này. |
| c2 | Right (→). | Sang phải (→). | ACCEPT | Correct: the TRAINS arrow points right in this fictional terminal. / Đúng: mũi tên TRAINS chỉ sang phải trong nhà ga hư cấu này. |
| c3 | Forward (↑). | Đi thẳng về phía trước (↑). | REJECT | The upward arrow belongs to EXIT, not TRAINS. / Mũi tên hướng lên thuộc EXIT, không phải TRAINS. |

**Only accepted choice:** `c2`. **Taught sources:** [P05](C0-learning-objectives-and-provenance.md#p05), [P06](C0-learning-objectives-and-provenance.md#p06). **Objective:** AIR-SIGN. **Lesson return:** [R-SIGN](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-006 · Floor 2

Revision 1 · **DRAFT** · family `f2-original-sign` · cued-recognition.

**Band hypothesis:** A2 audience; simple sign recognition. Alternate task: selects the destination label rather than naming a direction; same concept family.

**Context EN:** “I would like to take the train.” Use the original terminal signs: TRAINS → · BUSES ← · EXIT ↑.

**Context VI candidate:** “Tôi muốn đi tàu.” Dùng biển gốc trong nhà ga: TRAINS → · BUSES ← · EXIT ↑.

### p1

**EN:** Which sign matches this travel goal?

**VI candidate:** Biển nào phù hợp mục tiêu đi lại này?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | TRAINS → | TRAINS → — TÀU sang phải | ACCEPT | Correct: TRAINS matches the train station goal in the original scene. / Đúng: TRAINS phù hợp mục tiêu tới ga tàu trong cảnh gốc. |
| c2 | BUSES ← | BUSES ← — XE BUÝT sang trái | REJECT | This is the bus sign; your goal is the train station. / Đây là biển xe buýt; mục tiêu là tới ga tàu. |
| c3 | EXIT ↑ | EXIT ↑ — LỐI RA phía trước | REJECT | This is the exit sign; it does not match the train station goal. / Đây là biển lối ra; không phù hợp mục tiêu tới ga tàu. |

**Only accepted choice:** `c1`. **Taught sources:** [P04](C0-learning-objectives-and-provenance.md#p04), [P05](C0-learning-objectives-and-provenance.md#p05), [P08](C0-learning-objectives-and-provenance.md#p08). **Objective:** AIR-SIGN. **Lesson return:** [R-SIGN](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-007 · Floor 3

Revision 1 · **DRAFT** · family `f3-station-request` · cued-recognition.

**Band hypothesis:** A2-oriented pragmatic recognition. Selects a taught request by explicit destination; all choices are grammatical and polite.

**Context EN:** Mika: “Welcome! Can I help you?” You need directions to the train station.

**Context VI candidate:** Mika: “Chào bạn! Tôi giúp gì được?” Bạn cần được chỉ đường tới ga tàu.

### p1

**EN:** Choose the request that asks for your destination.

**VI candidate:** Chọn lời hỏi đường tới đúng nơi bạn cần đến.

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | Excuse me, how can I get to the train station? | Xin lỗi, tôi đến ga tàu bằng cách nào? | ACCEPT | Correct: this asks how to reach the train station, the stated goal. / Đúng: câu này hỏi cách tới ga tàu, đúng mục tiêu đã nêu. |
| c2 | Excuse me, how can I get to the buses? | Xin lỗi, tôi đến chỗ xe buýt bằng cách nào? | REJECT | This is a polite directions question, but it asks about buses rather than trains. / Đây là câu hỏi đường lịch sự, nhưng hỏi chỗ xe buýt thay vì tàu. |
| c3 | Excuse me, how can I get to the exit? | Xin lỗi, tôi đến lối ra bằng cách nào? | REJECT | This is a polite directions question for the exit, not the train station. / Đây là câu hỏi đường lịch sự tới lối ra, không phải ga tàu. |

**Only accepted choice:** `c1`. **Taught sources:** [P06](C0-learning-objectives-and-provenance.md#p06), [P05](C0-learning-objectives-and-provenance.md#p05). **Objective:** AIR-REQUEST. **Lesson return:** [R-ASK](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-008 · Floor 3

Revision 1 · **DRAFT** · family `f3-station-request` · cued-recognition.

**Band hypothesis:** B1-form exposure; A2/B1 recognition hypothesis. Longer taught indirect question; recognizing it does not establish productive B1 ability.

**Context EN:** “Excuse me, could you tell me how to get to the train station?”

**Context VI candidate:** “Xin lỗi, bạn có thể chỉ tôi cách đến ga tàu được không?”

### p1

**EN:** What is the traveller asking Mika to help with?

**VI candidate:** Người đi đường đang nhờ Mika giúp việc gì?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | To ask for a train ticket. | Đề nghị lấy vé tàu. | REJECT | The sentence asks how to reach a place; it does not request a ticket. / Câu này hỏi cách tới một nơi; không đề nghị lấy vé. |
| c2 | To ask how to reach the train station. | Hỏi cách tới ga tàu. | ACCEPT | Correct: how to get to the train station asks for directions to that place. / Đúng: how to get to the train station hỏi đường tới ga tàu. |
| c3 | To ask how to reach the exit. | Hỏi cách tới lối ra. | REJECT | The destination named is the train station, not the exit. / Nơi được nhắc tới là ga tàu, không phải lối ra. |

**Only accepted choice:** `c2`. **Taught sources:** [P07](C0-learning-objectives-and-provenance.md#p07), [P02](C0-learning-objectives-and-provenance.md#p02), [P05](C0-learning-objectives-and-provenance.md#p05). **Objective:** AIR-REQUEST. **Lesson return:** [R-ASK](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-009 · Floor 4

Revision 1 · **DRAFT** · family `f4-mika-instruction` · cued-recognition.

**Band hypothesis:** A2 audience; short written instruction. Follows a taught textual instruction to a destination; no listening assessment.

**Context EN:** Mika: “Follow the TRAINS sign to the right.”

**Context VI candidate:** Mika: “Đi theo biển TRAINS sang phải.”

### p1

**EN:** Which destination should you follow the sign to?

**VI candidate:** Bạn cần đi theo biển để tới nơi nào?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | The bus area. | Khu xe buýt. | REJECT | BUSES is a different destination on the original signboard. / BUSES là điểm đến khác trên biển gốc. |
| c2 | The exit. | Lối ra. | REJECT | EXIT is not the destination named by Mika. / EXIT không phải điểm đến Mika nhắc tới. |
| c3 | The train station entrance. | Lối vào ga tàu. | ACCEPT | Correct: TRAINS leads to the station entrance in the taught task. / Đúng: TRAINS dẫn tới lối vào ga tàu trong nhiệm vụ đã học. |

**Only accepted choice:** `c3`. **Taught sources:** [P06](C0-learning-objectives-and-provenance.md#p06), [P08](C0-learning-objectives-and-provenance.md#p08), [P05](C0-learning-objectives-and-provenance.md#p05). **Objective:** AIR-FOLLOW. **Lesson return:** [R-FOLLOW](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-010 · Floor 4

Revision 1 · **DRAFT** · family `f4-mika-instruction` · cued-recognition.

**Band hypothesis:** B1-form exposure; short instruction recognition. Reads two connected sentences and binds label/direction; not calibrated B1 complexity.

**Context EN:** Mika: “Follow the sign to your right. It says TRAINS.”

**Context VI candidate:** Mika: “Đi theo biển bên phải bạn. Biển ghi TRAINS.”

### p1

**EN:** Which sign and direction match Mika’s instruction?

**VI candidate:** Biển và hướng nào khớp chỉ dẫn của Mika?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | TRAINS — right (→). | TRAINS — sang phải (→). | ACCEPT | Correct: Mika names TRAINS and places the sign to your right. / Đúng: Mika nói biển ghi TRAINS và ở bên phải bạn. |
| c2 | BUSES — right (→). | BUSES — sang phải (→). | REJECT | The direction is right, but Mika names TRAINS, not BUSES. / Hướng phải đúng, nhưng Mika nói TRAINS, không phải BUSES. |
| c3 | TRAINS — left (←). | TRAINS — sang trái (←). | REJECT | The label is right, but left reverses Mika’s direction. / Nhãn biển đúng, nhưng hướng trái ngược với chỉ dẫn của Mika. |

**Only accepted choice:** `c1`. **Taught sources:** [P07](C0-learning-objectives-and-provenance.md#p07), [P05](C0-learning-objectives-and-provenance.md#p05). **Objective:** AIR-FOLLOW. **Lesson return:** [R-FOLLOW](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-011 · Floor 5 · boss

Revision 1 · **DRAFT** · family `f5-request-navigation-boss` · cued-recognition.

**Band hypothesis:** A2-oriented integrated recognition. Two decisions combine taught request intent and original sign direction. Floor 5 is the boss.

**Context EN:** Airport boss. You need the train station. Mika offers help. Original signs: TRAINS → · BUSES ← · EXIT ↑.

**Context VI candidate:** Boss sân bay. Bạn cần tới ga tàu. Mika đề nghị giúp. Biển gốc: TRAINS → · BUSES ← · EXIT ↑.

### p1

**EN:** 1. Ask Mika how to reach the train station.

**VI candidate:** 1. Hỏi Mika cách tới ga tàu.

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | Excuse me, how can I get to the train station? | Xin lỗi, tôi đến ga tàu bằng cách nào? | ACCEPT | Correct: this asks how to reach the train station, the stated goal. / Đúng: câu này hỏi cách tới ga tàu, đúng mục tiêu đã nêu. |
| c2 | Excuse me, how can I get to the buses? | Xin lỗi, tôi đến chỗ xe buýt bằng cách nào? | REJECT | This is a polite directions question, but it asks about buses rather than trains. / Đây là câu hỏi đường lịch sự, nhưng hỏi chỗ xe buýt thay vì tàu. |
| c3 | Excuse me, how can I get to the exit? | Xin lỗi, tôi đến lối ra bằng cách nào? | REJECT | This is a polite directions question for the exit, not the train station. / Đây là câu hỏi đường lịch sự tới lối ra, không phải ga tàu. |

**Only accepted choice:** `c1`. **Taught sources:** [P06](C0-learning-objectives-and-provenance.md#p06), [P05](C0-learning-objectives-and-provenance.md#p05). **Objective:** AIR-REQUEST. **Lesson return:** [R-ASK](C0-content-contract.md#remediation-targets).

### p2

**EN:** 2. Which direction does the original train sign show?

**VI candidate:** 2. Biển tàu trong bài gốc chỉ hướng nào?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | Left (←). | Sang trái (←). | REJECT | Left is the BUSES arrow, not the train direction in this scene. / Mũi tên sang trái thuộc BUSES, không phải hướng tàu trong cảnh này. |
| c2 | Right (→). | Sang phải (→). | ACCEPT | Correct: the TRAINS arrow points right in this fictional terminal. / Đúng: mũi tên TRAINS chỉ sang phải trong nhà ga hư cấu này. |
| c3 | Forward (↑). | Đi thẳng về phía trước (↑). | REJECT | The upward arrow belongs to EXIT, not TRAINS. / Mũi tên hướng lên thuộc EXIT, không phải TRAINS. |

**Only accepted choice:** `c2`. **Taught sources:** [P05](C0-learning-objectives-and-provenance.md#p05), [P06](C0-learning-objectives-and-provenance.md#p06). **Objective:** AIR-SIGN, AIR-FOLLOW. **Lesson return:** [R-SIGN](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## g01-c0-air-012 · Floor 5 · boss

Revision 1 · **DRAFT** · family `f5-request-navigation-boss` · cued-recognition.

**Band hypothesis:** B1-form exposure; integrated recognition hypothesis. Equivalent intent + navigation blueprint; reverses cue direction, not merely answer order.

**Context EN:** Airport boss. A traveller asks: “Excuse me, could you tell me how to get to the train station?” Mika replies: “Follow the sign to your right. It says TRAINS.”

**Context VI candidate:** Boss sân bay. Người đi đường hỏi: “Xin lỗi, bạn có thể chỉ tôi cách đến ga tàu được không?” Mika đáp: “Đi theo biển bên phải bạn. Biển ghi TRAINS.”

### p1

**EN:** 1. What help does the traveller ask for?

**VI candidate:** 1. Người đi đường nhờ giúp việc gì?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | To ask for a train ticket. | Đề nghị lấy vé tàu. | REJECT | The sentence asks how to reach a place; it does not request a ticket. / Câu này hỏi cách tới một nơi; không đề nghị lấy vé. |
| c2 | To ask how to reach the train station. | Hỏi cách tới ga tàu. | ACCEPT | Correct: how to get to the train station asks for directions to that place. / Đúng: how to get to the train station hỏi đường tới ga tàu. |
| c3 | To ask how to reach the exit. | Hỏi cách tới lối ra. | REJECT | The destination named is the train station, not the exit. / Nơi được nhắc tới là ga tàu, không phải lối ra. |

**Only accepted choice:** `c2`. **Taught sources:** [P07](C0-learning-objectives-and-provenance.md#p07), [P02](C0-learning-objectives-and-provenance.md#p02), [P05](C0-learning-objectives-and-provenance.md#p05). **Objective:** AIR-REQUEST. **Lesson return:** [R-ASK](C0-content-contract.md#remediation-targets).

### p2

**EN:** 2. Which sign and direction should the traveller follow?

**VI candidate:** 2. Người đi đường cần theo biển nào, về hướng nào?

| Stable choice | EN | VI candidate | Result | Explanation EN / VI candidate |
|---|---|---|---|---|
| c1 | TRAINS — right (→). | TRAINS — sang phải (→). | ACCEPT | Correct: Mika names TRAINS and places the sign to your right. / Đúng: Mika nói biển ghi TRAINS và ở bên phải bạn. |
| c2 | BUSES — right (→). | BUSES — sang phải (→). | REJECT | The direction is right, but Mika names TRAINS, not BUSES. / Hướng phải đúng, nhưng Mika nói TRAINS, không phải BUSES. |
| c3 | TRAINS — left (←). | TRAINS — sang trái (←). | REJECT | The label is right, but left reverses Mika’s direction. / Nhãn biển đúng, nhưng hướng trái ngược với chỉ dẫn của Mika. |

**Only accepted choice:** `c1`. **Taught sources:** [P07](C0-learning-objectives-and-provenance.md#p07), [P05](C0-learning-objectives-and-provenance.md#p05), [P08](C0-learning-objectives-and-provenance.md#p08). **Objective:** AIR-SIGN, AIR-FOLLOW. **Lesson return:** [R-FOLLOW](C0-content-contract.md#remediation-targets).

**Review state:** source/EN/VI checked by the authoring assistant; educator PENDING, independent distractor challenge PENDING, owner approval PENDING.

## Review oracles

For each part, read the explicit goal and defend all three choices. Accept exactly the authored answer only if no reviewer can defend another under that goal; otherwise quarantine the revision. Check every EN/VI context, stem, option and rationale for equivalent intent, destination and direction. IDs, membership, source selectors and render parity were mechanically checked; defensible uniqueness and CEFR fit remain editorial judgments, not automatic proofs. See [gate report](C0-gate-report.md#checks-performed).
