# Listening review

AI text review only, 2026-11-04. None is SCRIPT_LOCKED. All six revised v2 scripts are READY_FOR_HUMAN_SCRIPT_LOCK. This explicit fallback preserves the existing independent bilingual educator requirement. Manifest contains exact proposed transcript, role order, version and role-sensitive hash. It is not an approved-transcript record.

## AUD-TKY-001

Remove untested trains clause to reduce load. Two directions only.

Traveler: Excuse me, where can I find baggage claim?
Information assistant: Turn left for baggage claim. The exit is on your right.

- Which way is baggage claim? Accepted: left; turn left
- Where is the exit? Accepted: right; on your right

Words: 19; estimated 10 seconds at 125 wpm plus 0.4 sec/turn. Pacing/duration unmeasured. READY_FOR_HUMAN_SCRIPT_LOCK.

## AUD-TKY-002

Keep cutoff as pre-audio task instruction; 3 services/2 constraints is B1 workload hypothesis. No hidden cutoff.

Transport assistant: The train is delayed until eleven forty. The direct bus leaves at eleven twenty. The shuttle leaves at eleven ten, but you need to change.

- You need a direct service before eleven thirty. Which service fits? Accepted: the bus; the direct bus; the bus at 11:20
- Why does the shuttle not fit? Accepted: you need to change; it requires a change

Words: 25; estimated 13 seconds at 125 wpm plus 0.4 sec/turn. Pacing/duration unmeasured. READY_FOR_HUMAN_SCRIPT_LOCK.

## AUD-TKY-003

Move current-line context before action. Text-only Qs cannot prove actual map navigation.

Station attendant: Your Red Line train reaches Pine Stop next. Get off there and change to the Green Line. Then get off at Lake Stop.

- Where do you change? Accepted: Pine; Pine Stop
- Which line do you take next? Accepted: Green; Green Line
- Where do you finish? Accepted: Lake; Lake Stop

Words: 23; estimated 12 seconds at 125 wpm plus 0.4 sec/turn. Pacing/duration unmeasured. READY_FOR_HUMAN_SCRIPT_LOCK.

## AUD-TKY-004

One question requests two linked facts. Accept numeric or spoken formats; accent does not determine correctness.

Station attendant: The museum train leaves from platform two at nine twenty. The park train leaves from platform three at nine thirty-five.

- Which platform and departure time are for the museum? Accepted: platform 2 at 09:20; platform two at nine twenty

Words: 20; estimated 10 seconds at 125 wpm plus 0.4 sec/turn. Pacing/duration unmeasured. READY_FOR_HUMAN_SCRIPT_LOCK.

## AUD-TKY-005

Expand compressed cashier prompt into natural turns. Last customer line occurs after payment (nonspoken production cue). Source supports choices; not spontaneous production.

Cashier: Would you like a bag?
Customer: No bag, thanks.
Cashier: Cash or card?
Customer: By card, please.
Customer: Could I have a receipt, please?

- Does the customer want a bag? Accepted: no; no bag
- How will the customer pay? Accepted: by card; card
- What do they request? Accepted: a receipt; receipt

Words: 20; estimated 12 seconds at 125 wpm plus 0.4 sec/turn. Pacing/duration unmeasured. READY_FOR_HUMAN_SCRIPT_LOCK.

## AUD-TKY-006

Repetition is already in script: measures supported retrieval, not independent repair production. Do not remove words to manufacture hearing failure.

Staff: The local train leaves at three fifteen.
Traveler: Sorry, I didn't catch the time. Could you say that again, please?
Staff: Three fifteen.

- What time does the train leave? Accepted: 3:15; three fifteen
- What does the traveler ask the staff member to do? Accepted: repeat the time; say the time again

Words: 21; estimated 12 seconds at 125 wpm plus 0.4 sec/turn. Pacing/duration unmeasured. READY_FOR_HUMAN_SCRIPT_LOCK.

Transcript/VI policy: show task instruction before audio, but no target values, highlighted keys or transcript. After an attempt, allow transcript/replay with support recorded. Accessibility text is available immediately if required, with evidence classified as supported reading, never unaided listening. Exact-match-only response scoring is unsuitable; accept listed semantic equivalents and numeric time formats. No recorded audio exists, so there is no verified listening task or audio QA yet.

Audio 002 has the heaviest information load; use one primary service-choice question then an optional explanation in practice. Audio 006 repeats the answer by design, so report supported listening. Human reviewer must verify the role voices, clear numbers and wording before locking; bilingual post-attempt support requires a separate reviewed translation, not an automatically approved one.
