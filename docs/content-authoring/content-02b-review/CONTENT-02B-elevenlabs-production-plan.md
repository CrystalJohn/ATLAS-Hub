# CONTENT-02B ElevenLabs production plan

2026-11-04 · metadata proposal only · NOT READY FOR GENERATION.

The script-lock manifest contains all six audio IDs, script IDs, v2 words/turns, role-sensitive hashes, exact transcripts, objectives, scenario/lesson references, accepted answers and estimated durations. All are READY_FOR_HUMAN_SCRIPT_LOCK with null human review. A producer must not treat this status as permission to generate.

| Audio | Intended voice profile / role mapping | Target pacing / tone | Pronunciation review | Expected filename |
|---|---|---|---|---|
| AUD-TKY-001 | Adult traveler and distinct information assistant; clear, conversational | 120–130 wpm; calm/helpful | baggage claim, exit, right/left | AUD-TKY-001-v2.wav |
| AUD-TKY-002 | Adult transport assistant; no announcer effects | 120–130 wpm; informative | eleven forty vs eleven twenty vs eleven ten; direct; shuttle | AUD-TKY-002-v2.wav |
| AUD-TKY-003 | Adult station attendant | 120–130 wpm; measured instructions | Pine /paɪn/, Lake /leɪk/ are proposed English fictional names; Green/Red line; verify with human | AUD-TKY-003-v2.wav |
| AUD-TKY-004 | Adult station attendant | 120–130 wpm; clear pair grouping | nine twenty / nine thirty-five; platform two / three | AUD-TKY-004-v2.wav |
| AUD-TKY-005 | Cashier and distinct customer | 120–130 wpm; neutral service politeness | receipt: silent p; card/cash; pause for payment before final line | AUD-TKY-005-v2.wav |
| AUD-TKY-006 | Staff and distinct traveler | 120–130 wpm; patient repetition | three fifteen, not three fifty; didn't catch; local | AUD-TKY-006-v2.wav |

Language: English. Proposed locale: en-GB, pending human selection; accent choice is a production model and does not represent all speakers in Tokyo. No Japanese place name or brand is spoken in these six scripts. Narita/Tokyo are metadata only; if spoken later, require a new script version and reviewed pronunciation. No IPA or overrides above are claimed educator-approved.

Provider record, separate from scenarios: provider ElevenLabs proposed; voiceId null; consent/license evidence null; settingsRef null; date null; generatedPath null; measuredDuration null; QA NOT_RUN; transcriptMatch NOT_RUN. Never embed credentials or voice-provider parameters in generic lesson content.

Normalize only in rendering layer: expand digits to reviewed spoken forms; preserve explicit fifteen/thirty-five distinctions; do not read role labels, Markdown or production cues; do not alter canonical learner text to manipulate TTS. A later provider-specific pronunciation dictionary is versioned separately. Manifest hashes freeze canonical role labels and spoken text, not provider settings. Human lock must record reviewer/date and exact hash; any subsequent text/role/turn change increments version and invalidates the lock and audio QA.

QA after authorized generation: listen through every turn; verify every word/number against locked transcript; correct-role voice; no missing/duplicate line; no spoken stage direction; no clipping or abrupt joins; consistent loudness; understandable timing; pauses preserve meaning; verify answer is audible and unique. Test numeric/paraphrase acceptance, retry and transcript support behavior independently. Use both ordinary playback and accessibility text path; text path must not be classified as unaided listening. No files have been generated, no API was called, and no voice selected.
