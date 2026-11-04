# Tokyo Daily English — source registry companion

Scenario JSON source IDs resolve to this registry. CONTENT-01 DE-### values are idea references, not source records and never prove a lesson was taught. The fictional ATLAS lesson itself is the assessed source; external pages are factual or language references only.

| Source ID | Type | Primary scope | Status |
|---|---|---|---|
| S-FICTION | ATLAS-authored source lesson | Fictional practice facts, original dialogues and learning evidence | DRAFT r1, source passage hashes in scenario JSON |
| S-NARITA | Official airport reference | General rail access at Narita Airport | Reference only; operational detail mutable |
| S-METRO | Official transit reference | General Tokyo Metro journey context | Reference only; no fictional map detail |
| S-BC | Language reference | Original request/repetition phrase review | Reference only; no copying |
| S-CAMBRIDGE | Dictionary sense check | Change lines; catch meaning fail to hear/understand | Reference only; original ATLAS examples |
| S-RECEIPT | Dictionary sense check | Receipt as payment record | Reference only; original ATLAS examples |

The broader CONTENT-01 family IDs SRC-01 and SRC-14/20/21 are linked in the provenance document for curriculum framing and future transfer sourcing. They are not attached as factual sources to fictional scenario values.

Every scenario record has a pair of exact sourceLessonRefs, each pinned to contentRevision TOKYO-DAILY-r1 and a SHA-256 of EN + separator + VI. A candidate variant is valid only while its lesson ID, revision and digest still match. Changing either language passage requires a new review and updated dependent candidate references.
