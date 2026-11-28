# ATLAS CONTENT-01 — Open assets inventory

**Rule:** an asset is not reusable until its individual source page, creator, license, modification permission and extra rights are recorded. Repository-level claims are discovery evidence only.

| Asset family | Source / evidence | Intended use | License decision | Required capture before use |
|---|---|---|---|---|
| Wikimedia Commons photos/maps/signs | [Reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia) | landmark reference, map texture, public signage | GREEN per file; REVIEW REQUIRED if file license or depicted rights unclear | file URL, creator, exact license/version, source, attribution, changes, resolution, download date |
| Unsplash photos | [License](https://unsplash.com/license) | transformed scene background, location mood | GREEN for ordinary commercial app use; REVIEW REQUIRED for people/brands | photo page, creator, license snapshot, face/brand review, crop/edit record, resolution |
| Pexels photos/video | [License](https://www.pexels.com/license/) | transformed B-roll and ambient visual reference | GREEN for ordinary app use; REVIEW REQUIRED for people/brands | media URL, creator, license snapshot, no-endorsement check, modification record |
| Openverse discovery | [About Openverse](https://openverse.org/en-ca/about) | discovery only; route to original host | REVIEW REQUIRED until original file license verified | original host, exact license, creator, attribution and rights exclusions |
| US government / National Park Service imagery | NPS and agency item pages, not a single blanket assumption | nature and public-service reference | REVIEW REQUIRED per asset/agency | item page, agency terms, public-domain/CC statement, trademarks/people review |
| Museum open-access collections | museum item page and collection policy | artifacts, historical images, cultural objects | GREEN only where item says public domain/CC/open access; otherwise REVIEW REQUIRED | item ID, creator, date, rights statement, download, attribution, object context |
| Government open-data maps | owning authority and dataset license | simplified transport/map overlays | GREEN only with explicit data license; otherwise YELLOW facts only | dataset version, coordinate/source attribution, derived-map method, update cadence |
| Public-domain archives / Library of Congress-style collections | exact item rights statement | historical context | GREEN if public domain is explicit; REVIEW REQUIRED for privacy/publicity | item page, rights statement, creator/date, crop/alteration, attribution |
| CC BY/CC BY-SA illustrations/icons | exact file page plus [CC license deed](https://creativecommons.org/cc-licenses/) | UI illustration and visual vocabulary | GREEN with attribution; SA requires compatible downstream licensing | creator, title, URL, license, changes, attribution display plan |
| Audio/ambient repositories | exact track page; no repository-wide assumption | listening or scene ambience | GREEN only if explicit CC0/CC BY-compatible terms; otherwise REFERENCE ONLY | track/creator, license, attribution, edit/loop, Content ID/performer restrictions |

## Safe asset record template

```yaml
assetId: atlas-asset-0001
sourceUrl: https://exact-item-page.example
downloadUrl: https://exact-original.example/file
creator: required-or-unknown
title: required
license: CC BY 4.0 | CC0 | Unsplash License | Pexels License | other
licenseUrl: https://exact-license.example
accessedAt: 2026-10-31
attribution: exact credit string
changes: crop, color, redraw, audio loop, none
commercialUse: confirmed | blocked | unknown
peopleBrandsPrivacy: checked | review-required | not-applicable
resolutionOrDuration: record actual value
countryRelevance: JP | US | ...
proposedUse: scene-background | sign | map | audio | learn-more
decision: GREEN | REVIEW REQUIRED | RED
```

## Asset acquisition recommendation

Start with CC BY/CC0 or transformed Unsplash/Pexels backgrounds for a prototype, but retain a human-reviewed attribution manifest. Do not bundle raw screenshots of official websites, Google Images results, Pinterest images, exam pages, YouTube downloads or “free” audio with unclear terms.
