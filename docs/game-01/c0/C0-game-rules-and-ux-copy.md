# C0 game rules and UX copy

**DRAFT · 2026-10-26 · design only.** All EN/VI below is an assistant-checked review candidate; independent bilingual educator and owner signoff remain pending. Scope: five floors total, Floor 5 is a two-decision boss. [Source/package basis](C0-learning-objectives-and-provenance.md#s4). Copy below supersedes reward numbers and the grammar floor **for this C0 proposal only**; original package files stay unchanged.

## Rules disclosed before starting

| Copy ID | EN | VI candidate |
|---|---|---|
| RULE-TITLE | Airport Survival · Challenge | Sinh tồn ở sân bay · Thử thách |
| RULE-SCOPE | Practise the words, signs and station request from Arriving in Tokyo. This is a fictional terminal. | Luyện từ vựng, biển chỉ dẫn và cách hỏi đường tới ga trong bài Đến Tokyo. Đây là nhà ga hư cấu. |
| RULE-FAIL | Clear five floors. Floor 5 has two answers; both must be correct. One confirmed wrong answer ends this run. A new run starts at Floor 1. | Vượt qua năm tầng. Tầng 5 có hai câu trả lời; cần đúng cả hai. Một câu trả lời sai đã xác nhận sẽ kết thúc lượt này. Lượt mới bắt đầu từ tầng 1. |
| RULE-SAFE | Your existing XP, World Travel progress and passport stamps stay with you. Connection and save errors never count as wrong answers. | XP đã có, tiến độ World Travel và stamp hộ chiếu của bạn được giữ nguyên. Lỗi kết nối hoặc lưu không bị tính là trả lời sai. |
| RULE-CHECK | Select an answer, review your selection, then choose Confirm answer to submit. You can change your selection before confirming. | Chọn câu trả lời, xem lại lựa chọn, rồi chọn Xác nhận câu trả lời để nộp. Bạn có thể đổi lựa chọn trước khi xác nhận. |
| RULE-SUPPORT | No timer. Challenge questions and choices are in English. You can change the interface language. Vietnamese explanations appear after submission. | Không giới hạn thời gian. Câu hỏi và lựa chọn trong Thử thách bằng tiếng Anh. Bạn có thể đổi ngôn ngữ giao diện. Giải thích tiếng Việt xuất hiện sau khi nộp. |
| RULE-REPEAT | A new run uses different question variants where available. This small bank will repeat taught material. | Lượt mới dùng biến thể câu hỏi khác khi có. Bộ câu hỏi nhỏ này sẽ lặp lại nội dung đã học. |
| RULE-REWARD | First-clear rewards are awaiting approval. No reward amount or passport stamp is promised in this review build. | Phần thưởng vượt tháp lần đầu đang chờ phê duyệt. Bản duyệt này chưa hứa mức thưởng hay stamp hộ chiếu. |
| RULE-START | I understand — start Floor 1 | Tôi đã hiểu — bắt đầu tầng 1 |
| RULE-LESSON | Review Arriving in Tokyo first | Ôn bài Đến Tokyo trước |

No run is created merely by viewing the preview. RULE-START explicitly acknowledges the failure rule and creates a run only after required source review. If resuming an existing run, show its frozen rules/version and **Resume Floor {n}** / **Tiếp tục tầng {n}**, not a fresh-run promise. The exact rule text/version acknowledged belongs in the run contract.

Challenge hides answer-revealing VI/glossary before confirmation; interface language, screen-reader labels and access controls remain available. Translate the task instruction, not the answer content. If a learner needs answer translation, offer source review and future Practice; do not silently relabel supported answers as unaided Challenge evidence. This is a proposed policy requiring owner/educator approval, not an assertion that current World Travel already behaves this way.

## Selection and explicit confirmation

Required sequence: **UNSELECTED → SELECTED/REVIEW → SUBMITTING → COMMITTED FEEDBACK**, or RECOVERING. Selecting a radio never submits. SELECTED/REVIEW displays the full selected text beside the confirmation CTA. For a boss it displays both numbered selected texts and “2 of 2 selected”. The CTA is the separate confirmation act; no extra modal is required for each question.

| Copy ID | EN | VI candidate |
|---|---|---|
| ANSWER-EMPTY | Select an answer to review it. | Chọn một câu trả lời để xem lại. |
| ANSWER-REVIEW | Your selection: {selectedText}. Confirming submits this answer. A wrong answer ends this run. | Bạn đã chọn: {selectedText}. Xác nhận sẽ nộp câu trả lời này. Trả lời sai sẽ kết thúc lượt này. |
| ANSWER-CONFIRM | Confirm answer | Xác nhận câu trả lời |
| BOSS-RULE | Floor 5 · Airport boss. Two answers; both must be correct. | Tầng 5 · Boss sân bay. Hai câu trả lời; cần đúng cả hai. |
| BOSS-COUNT | {selectedCount} of 2 selected | Đã chọn {selectedCount}/2 |
| BOSS-CONFIRM | Confirm both answers | Xác nhận cả hai câu trả lời |
| ANSWER-SENDING | Checking and saving your answer… | Đang kiểm tra và lưu câu trả lời… |

Disable confirmation until required selections exist. During submission freeze the submitted choices and operation identity. Do not optimistically change floor, personal best, XP or outcome. Keyboard Space changes a radio; Enter only submits when focus deliberately activates the confirmation button. Do not let the activation that opens a new question also answer it. On feedback focus the result heading once; keep the explanation until a separate Continue activation. Live regions announce status without reading the entire page repeatedly. Use natural page scroll, text alternatives for arrows and choices, visible focus and at least 48px proposed touch targets; test at 320px and 200% text before release. These are acceptance specifications, not tested UI claims.

## Committed outcomes and failure recovery

| Copy ID | EN | VI candidate |
|---|---|---|
| FLOOR-CLEAR | Floor {n} cleared. | Đã vượt tầng {n}. |
| FLOOR-NEXT | Continue to Floor {next} | Tiếp tục tới tầng {next} |
| RUN-FAIL | Run ended on Floor {n}. You cleared {cleared} of 5 floors. Your existing XP and World Travel progress are safe. | Lượt kết thúc ở tầng {n}. Bạn đã vượt {cleared}/5 tầng. XP đã có và tiến độ World Travel được giữ nguyên. |
| FEEDBACK-CHOSEN | You chose: {chosenText} | Bạn đã chọn: {chosenText} |
| FEEDBACK-ACCEPTED | For this goal, the answer is: {acceptedText} | Với mục tiêu này, đáp án là: {acceptedText} |
| FEEDBACK-VI | Show Vietnamese explanation | Xem giải thích tiếng Việt |
| LESSON-RETURN | Review the original lesson: {lessonTitle} — {sectionTitle} | Ôn bài gốc: {lessonTitle} — {sectionTitle} |
| RUN-RESTART | Start a new run at Floor 1 | Bắt đầu lượt mới từ tầng 1 |
| RUN-WORLD | Return to World Travel | Quay về World Travel |
| RUN-CLEAR | Tower cleared · 5 of 5 floors. You completed this challenge; this is not a mastery or CEFR certificate. | Đã vượt tháp · 5/5 tầng. Bạn đã hoàn thành thử thách này; kết quả không chứng nhận thành thạo hay trình độ CEFR. |
| REWARD-PENDING | Reward policy pending approval. | Chính sách thưởng đang chờ phê duyệt. |
| REWARD-ALREADY | Your first-clear reward was already earned. No additional XP for this replay. | Bạn đã nhận phần thưởng vượt tháp lần đầu. Lượt chơi lại không nhận thêm XP. |

Always show chosen option, accepted option, a goal-specific explanation for the chosen wrong option, the correct explanation, and a direct lesson-return action. Full per-option EN/VI explanations live in the [bank](C0-question-bank-candidates.md); do not replace them with “Wrong, try again.” Review is available immediately on the failed screen; no forced replay of Floors 1–3 to see the correction.

**Example:** candidate 005, submitted Left. Explain: “Left is the BUSES arrow. The original TRAINS arrow points right.” VI: “Mũi tên sang trái thuộc BUSES. Mũi tên TRAINS trong bài gốc chỉ sang phải.” Return target R-SIGN opens `jp-arrival/read-signs`, hotspot `signs`, with the original description visible. A wrong answer at Floor 4 after three clears yields FAILED, `clearedFloors=3`, best `max(previousBest,3)`, and a new run starts at Floor 1. Historical progress is retained; nothing subtracts XP or resets travel.

**Boss example:** 011.p1 correct and p2 wrong → Floor 5 not cleared, `clearedFloors=4`, FAILED. Show p1 “Correct” and p2 correction separately, with R-ASK/R-SIGN links. Never label p1 incorrect because the run failed. Full boss submission is one atomic evaluation; neither part is sent early. All four part combinations have explicit [oracles](C0-content-contract.md#interaction-and-persistence-oracles).

## Recovery is distinct from a language mistake

| Copy ID | EN | VI candidate |
|---|---|---|
| SAVE-UNKNOWN | We could not confirm the saved result yet. Your submitted choices are kept. This connection problem does not count as a wrong answer. | Chưa xác nhận được kết quả đã lưu. Các lựa chọn đã nộp vẫn được giữ. Lỗi kết nối này không bị tính là trả lời sai. |
| SAVE-RETRY | Reconnect and check saved result | Kết nối lại và kiểm tra kết quả đã lưu |
| SAVE-STALE | This run changed in another tab. Load the saved result before continuing. | Lượt này đã thay đổi ở thẻ khác. Tải kết quả đã lưu trước khi tiếp tục. |
| SAVE-SIGNIN | Sign in again to recover this run. | Đăng nhập lại để khôi phục lượt này. |
| CONTENT-INVALID | This question is unavailable for review. This is not a wrong answer. Your best and existing rewards are safe. | Câu hỏi này tạm ngừng để kiểm tra. Đây không phải câu trả lời sai. Thành tích tốt nhất và phần thưởng đã có được giữ nguyên. |
| SAVE-LEAVE | Leave for now; recover this run later | Tạm rời đi; khôi phục lượt này sau |

Only a **valid incorrect answer committed by the server** ends a run for a learning mistake. Offline, timeout, auth expiry, invalid payload, unknown choice, stale revision, rate limit, API/DB error and content withdrawal cannot themselves fail or consume a run. A timeout may hide an already-committed result: reconcile first. If recovery reveals a valid committed wrong answer, show its actual failure with explanation; do not pretend the connection caused or erased it. Exact idempotency rules are in the [contract](C0-content-contract.md#response-semantics).

Closing/refreshing/leaving is pause, no gameplay timer. Resume restores the same assigned question/order or its committed result. Starting over while ACTIVE requires explicit abandonment confirmation; cancelling keeps the run. Terminal FAILED restarts need no second abandonment dialog. Lesson review pauses an active run and preserves tower return context. A lesson-return view must not overwrite adventure checkpoints or progress.

## Challenge versus future Practice

| Behavior | Challenge MVP proposal | Future Practice proposal (not promised implemented) |
|---|---|---|
| Failure | One valid confirmed wrong answer ends current run; restart F1 | Corrections and retry-until-understood; no strict loss |
| Content | Fixed reviewed floor blueprint; pinned variants | Choose a weak objective directly, fresh cue when available |
| Assistance | EN stimuli/options; VI explanation after submission | VI/hints/reveal allowed and recorded; reveal never counts as unaided correct |
| Evidence | First valid response per served part; run result separate | Preserve initial error and assisted/retry status; no mastery claim |
| Rewards / best | Only an approved first-clear policy; Challenge best | No Challenge XP, first-clear ledger, passport stamp or Challenge PB |
| Availability in C0/T1 | Specification only | Defer app screens/adaptation/scheduling. Do not show a dead Practice button in a later MVP; original-lesson review is the required recovery path. |

## Rewards needing approval

No permanent World Travel or XP loss. No per-floor, failure or repeat-clear XP. Proposed +40 XP in the earlier package remains **UNAPPROVED**, as does the final first-clear amount/policy/version. C0 local design defaults to **reward disabled / no ledger write**, not a zero-valued permanent reward receipt that would consume future eligibility. No passport stamp unless explicitly approved in a later decision. UI must not promise a numeric reward until that decision is pinned and implemented/tested. After approval, only the server's atomic committed receipt determines the displayed award; no “Claim” step and no client increment. A bank/locale correction must never renew reward eligibility. [Existing helper basis S6](C0-learning-objectives-and-provenance.md#s6).
