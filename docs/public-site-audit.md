# Majestia public website — audit, implementation plan and delivery record

Date: 2026-10-08. Scope: public-facing website only.

Sections 1 to 10 are the audit and plan written before any code. Section 11 lists the files. Section 12 records what was built and how it was verified, including where the build departed from the plan.

Anything marked **Unknown** was not visible, not confirmed or not available at audit time. Nothing in this document is guessed.

---

## 1. Repository audit

| Item | Finding |
| --- | --- |
| Repository structure | `Majestia-13-References/` (14 files), `.qodo/agents/` and `.qodo/workflows/` (both empty), `.DS_Store`. Nothing else. |
| Git | Not a git repository. |
| Framework | None. No `package.json`, lockfile, `tsconfig`, or framework config. |
| Package manager | None configured. `npm 11.6.2` and `node v25.2.1` are installed; `pnpm` is not. npm is used. |
| Entry points, routes, build commands | None exist. |
| Existing public website | None. The repository is empty apart from references. |
| Existing dependencies | None. |
| Existing public routes | None. |
| Existing backend / API routes | None. No endpoints, no API contract, no environment files. |
| Existing design tokens | None. |
| Reusable components | None. |
| Private SaaS admin, auth, Airbnb sync, calendar, payments | Not present in this repository. Nothing to preserve, nothing that can be broken. |

### Files that must not be touched

- `Majestia-13-References/` — read-only design inputs.
- `.qodo/` — empty third-party tool folders, not part of the website.

### Discrepancies between the brief and the repository

1. The brief names the folder `/reference-assets/`. The actual folder is `Majestia-13-References/`. It was used as-is and not renamed.
2. The brief describes 13 UI screenshots plus 1 official colour-palette screenshot. The folder contains 13 UI screenshots plus 1 screen recording. **No palette swatch image exists.** None of the 13 screenshots is a Majestia palette. The hex values written in the brief are therefore the only palette source and are used as the source of truth. They live in one file so they can be corrected in one place once the swatch is supplied.
3. No property photography, inventory, pricing or contact details are present. See section 9.

---

## 2. Reference inventory

All 13 screenshots were opened individually. The recording (24.3 s, 1018×750, H.264) was sampled at 4 fps across its full length and at 15 fps around every transition.

Several screenshots carry Pinterest interface overlays (expand and visual-search buttons, a "Recherche d'image" pill, a red "Enregistrer" button). These are not part of the designs and were ignored.

| ID | File (timestamp) | Size | Subject |
| --- | --- | --- | --- |
| R01 | 13.19.57 | 2048×1283 | Three mobile screens: photo onboarding, home feed, filter sheet |
| R02 | 13.20.21 | 324×522 | "Moon" frosted capsule card over a landscape |
| R03 | 13.20.48 | 1336×902 | "Tripify" split hero with glass hotspots |
| R04 | 13.21.11 | 1098×842 | "Vespa Matic" framed layout with cut-out corners |
| R05 | 13.21.21 | 1044×738 | "Reserve Your Ideal Holiday" split villa hero |
| R06 | 13.21.57 | 1180×928 | Norway stays, three mobile screens |
| R07 | 13.22.20 | 1038×650 | "PrimeHouse", three mobile screens |
| R08 | 13.22.30 | 984×814 | "CoStar Group" translucent phones |
| R09 | 13.23.14 | 1150×952 | "HomeLuxe", three mobile screens |
| R10 | 13.23.25 | 672×1268 | "LuxeEstate" stacked glass list |
| R11 | 13.24.09 | 988×774 | "Aurora Stays" full-bleed sky hero |
| R12 | 13.24.24 | 1046×760 | "Bayt Travel" hero with search dock (a still from V1) |
| R13 | 13.24.38 | 518×318 | "Vision Estate" framed panels. Low resolution and partly covered; fine detail is **Unknown** |
| V1 | Screen Recording 14.11.03.mov | 1018×750, 24.3 s | "Bayt Travel" motion: intro, two scene changes, scroll, card to detail |

---

## 3. Reference mapping

### R01 — mobile onboarding, feed, filters
- **Layout / grid:** single column, 24 px gutters, full-bleed photo with content anchored at the bottom.
- **Typography:** tight neo-grotesk, medium weight, two-line headline, small grey support line.
- **Colour:** sky blue and warm concrete from the photo; white and black interface.
- **Image treatment:** architectural exterior at dusk, bottom fade into a soft grey veil.
- **Radius:** 40 px screen, pill buttons, 28 px cards.
- **Glass:** translucent location pill, translucent secondary button, frosted circular controls.
- **Card geometry:** photo card with name, facts and price overlaid on a bottom blur.
- **Search:** segmented controls and a range slider inside a bottom sheet with one full-width action.
- **Navigation:** floating pill tab bar.
- **Mobile:** native. **Motion:** carousel dots imply swipe.
- **Reuse:** bottom filter sheet with one primary action, segmented selectors, location pill, text over a bottom veil.
- **Do not copy:** "2,900 homes" count, monthly price, pure black interface, login screen.

### R02 — frosted capsule
- **Layout:** one centred capsule. **Typography:** light geometric, small label above a large name.
- **Colour:** dusty mauve and sand. **Image:** circular cut-out photo inside the capsule.
- **Radius:** full capsule. **Glass:** the strongest frosted material in the set, heavy blur, thin light border.
- **Card geometry:** vertical capsule: image, label, name, dates, price, action.
- **Search / navigation / mobile:** none shown. **Motion:** none shown.
- **Reuse:** the frosted material recipe; label-above-name hierarchy.
- **Do not copy:** Apple Pay button and any payment affordance, pink tones.

### R03 — Tripify
- **Layout:** two columns inside a rounded frame; text left, tall photo right. **Grid:** asymmetric 45/55.
- **Typography:** rounded geometric display with a small photo pill set inline in the headline.
- **Colour:** sage green and white. **Image:** tall architectural interior.
- **Radius:** 32 px frame and photo, pill buttons.
- **Glass:** frosted hotspot labels over the photo, pill tabs.
- **Card geometry:** small photo card with location and name, plus vertical pill links.
- **Search:** none. **Navigation:** logo, contact, menu pill. **Mobile:** not shown.
- **Motion:** "01/08" counter and arrows imply a slider; a rotating "scroll down" badge.
- **Reuse:** framed canvas, floating glass labels on photography, scene counter, pill category tabs.
- **Do not copy:** sage and olive greens, "5*" rating label, rotating text badge, social pills.

### R04 — Vespa Matic
- **Layout:** framed canvas over a full-bleed photo, with corners cut out to seat the navigation and thumbnail panel.
- **Grid:** asymmetric; text left, subject right.
- **Typography:** bold neo-grotesk, four-line headline, small caps support text.
- **Colour:** white panels over sky and grass. **Image:** one continuous photo behind and inside the frame.
- **Radius:** 24 px with notched corners. **Glass:** translucent chips at the lower right, white info pills.
- **Card geometry:** three labelled thumbnail cards with a "2/15" counter and arrows.
- **Search:** none. **Navigation:** segmented pill, active item dark.
- **Mobile:** not shown. **Motion:** thumbnail-driven slider implied.
- **Reuse:** labelled thumbnail selector, counter, pill navigation with a clear active state, panels that seat into the photo.
- **Do not copy:** product subject, olive accents, opaque white panels.

### R05 — Reserve Your Ideal Holiday
- **Layout:** split; white editorial column left, tall villa photo right. **Grid:** 40/60.
- **Typography:** bold neo-grotesk headline, small support text, large statistics.
- **Colour:** white, black, warm timber from the photo. **Image:** dusk villa, strong verticals.
- **Radius:** 28 px panel, pill buttons.
- **Glass:** white location card overlapping the photo, small circular arrow button.
- **Card geometry:** secondary villa card with a location chip and up/down arrows.
- **Search:** two select pills and a search button sitting directly on the photo.
- **Navigation:** minimal text links, contact pill. **Mobile:** not shown. **Motion:** vertical dots imply slides.
- **Reuse:** search controls placed on the photograph, overlapping location card, editorial split.
- **Do not copy:** "115k+ / 70k+ / 47K+" statistics, star ratings, "Popular" badge, avatar clusters. All are invented social proof.

### R06 — Norway stays
- **Layout:** photo header with rounded lower corners; content sheet below. **Grid:** single column, horizontal card rails.
- **Typography:** geometric sans, semibold titles, small grey metadata.
- **Colour:** white with dark overlays. **Image:** warm cabin interiors and exteriors.
- **Radius:** 28 px photos, pill chips. **Glass:** translucent dark search field over the photo, frosted heart buttons.
- **Card geometry:** photo on top, name, facts line, price line.
- **Search:** one field summarising place, dates and guests; type chips below.
- **Navigation:** dark floating tab bar. **Mobile:** native; a single dark bottom bar holding price and one action.
- **Motion:** gallery dots and a "1/7" counter.
- **Reuse:** one search summary field on mobile, amenity chips, the single bottom action bar with price, gallery counter.
- **Do not copy:** ratings and review counts, struck-through prices, host details, "Book now" wording.

### R07 — PrimeHouse
- **Layout:** photo fading into the page colour; stacked photo cards. **Grid:** single column.
- **Typography:** medium neo-grotesk, comfortable body size.
- **Colour:** off-white with a deep slate-green dark. **Image:** dusk villa with a gradient to dark.
- **Radius:** 36 px screen, 24 px cards, pill action. **Glass:** translucent chips and action on the detail screen.
- **Card geometry:** photo card with a dark gradient footer carrying name, price and facts.
- **Search:** field plus filter button plus tab chips. **Navigation:** bottom icon bar.
- **Mobile:** native. **Motion:** none shown.
- **Reuse:** photo dissolving into the page tone, dark gradient card footer, translucent action over a dark photo.
- **Do not copy:** green cast, sale prices, rating chip, "New" badge.

### R08 — CoStar Group
- **Layout:** translucent screens over a blue-grey to sand atmosphere. **Grid:** single column.
- **Typography:** light humanist sans, small labels, large numerals.
- **Colour:** pale blue-grey, slate, sand, champagne. The closest match to the Majestia palette in the set.
- **Image:** modern villa at golden hour blending into the interface.
- **Radius:** 36 px panels, circular thumbnails, pill bar.
- **Glass:** light frosted panels, dark frosted bottom bar, dark frosted pill button.
- **Card geometry:** large frosted sheet with soft corners.
- **Search:** none. **Navigation:** frosted bottom bar.
- **Mobile:** native. **Motion:** circular thumbnail strip with an enlarged active item; numbered hotspots.
- **Reuse:** light and dark glass recipes, warm-to-cool atmosphere, circular thumbnails with an enlarged active state.
- **Do not copy:** finance data and charts, pale yellow accent, very small low-contrast labels.

### R09 — HomeLuxe
- **Layout:** card-based app screens on a warm off-white. **Grid:** single column with a four-up category row.
- **Typography:** neo-grotesk, clear hierarchy, small metadata.
- **Colour:** warm off-white with an olive-black dark. **Image:** villa exteriors, tall location tiles.
- **Radius:** 24 px cards, pill buttons. **Glass:** minimal; frosted round buttons over the photo.
- **Card geometry:** facts row of four icon cells; tall destination tiles with the label at the bottom.
- **Search:** field with a filter icon. **Navigation:** bottom tab bar with a pill active state.
- **Mobile:** native; bottom bar with total and one action. **Motion:** gallery "1/24" counter.
- **Reuse:** four-cell facts row, tall destination tiles, content sheet overlapping the gallery, one bottom action.
- **Do not copy:** olive tone, rating and reviews, "Confirm Booking", time-slot booking.

### R10 — LuxeEstate
- **Layout:** stacked horizontal glass cards over a champagne and navy gradient. **Grid:** list rows, thumbnail left and text right.
- **Typography:** clean sans with a serif wordmark.
- **Colour:** champagne and cream against deep blue. **Image:** small rounded thumbnails.
- **Radius:** 28 px cards, pill buttons. **Glass:** layered frosted cards with bright edges and inner highlights.
- **Card geometry:** thumbnail, name, facts with dividers, primary pill, secondary pill.
- **Search:** field with filter chips below. **Navigation:** icons only. **Mobile:** native.
- **Motion:** the lifted first card implies a selection state.
- **Reuse:** glass list rows, inner highlight and bright border, filter chips, primary-plus-secondary pill pair, warm-against-cool atmosphere.
- **Do not copy:** navy saturation, lens flares, agent avatars, sale prices, the map (no location data is confirmed).

### R11 — Aurora Stays
- **Layout:** full-bleed architectural hero; headline upper left, glass card lower left. **Grid:** 12 columns with wide margins.
- **Typography:** very large thin geometric capitals with a small tagline beside them.
- **Colour:** pale blue-grey to slate sky. **Image:** building against sky with atmospheric haze.
- **Radius:** 28 px frame, pill buttons, 20 px glass card.
- **Glass:** frosted card with a bright border; pill buttons with circular arrow caps.
- **Card geometry:** small frosted statement card. **Search:** none in the hero.
- **Navigation:** transparent bar, light text over the photo. **Mobile:** phone mockup with search, chips, cards.
- **Motion:** none shown.
- **Reuse:** header integrated into the photograph, glass card anchored low, pill buttons with arrow caps, cool sky atmosphere.
- **Do not copy:** ultra-thin display weight (fails legibility), all-caps headline, "3D virtual tour".

### R12 — Bayt Travel (still of V1)
- **Layout:** framed hero; header over the photo; search dock straddling the hero's lower edge; cards below.
- **Grid:** centred 12 columns, dock about 78% of the frame width.
- **Typography:** geometric capitals headline, sans dock labels, serif section title.
- **Colour:** champagne, sand and peach. The warm half of the Majestia palette.
- **Image:** interior with a warm veil fading into the page colour at the bottom.
- **Radius:** 24 px frame, 20 px dock, circular thumbnails.
- **Glass:** dock is nearly opaque white; the thumbnail rings are translucent.
- **Card geometry:** tall photo cards with a price chip and heart.
- **Search:** destination, check in, check out, visitors, square action button.
- **Navigation:** transparent bar over the photo. **Mobile:** not shown.
- **Motion:** see V1.
- **Reuse:** the four-field dock at the hero's lower edge, vertical circular scene selector with a connector line and caption, photo dissolving into the page tone.
- **Do not copy:** opaque white dock (Majestia's dock is translucent), gradient capitals, star ratings, the serif.

### R13 — Vision Estate (low confidence)
- **Layout:** framed canvas divided into rounded panels. **Grid:** three unequal columns.
- **Typography:** bold capitals with one highlighted word. **Colour:** grey, sand and amber.
- **Image:** organic architecture, warm interior light. **Radius:** large, organic.
- **Glass:** semi-transparent side panels over the photo.
- **Card geometry:** tall panels with rotated numerals. **Search:** none.
- **Navigation:** small top bar. **Mobile / motion:** **Unknown**.
- **Reuse:** multi-panel framed composition, vertical rhythm.
- **Do not copy:** "50+" and "1.4K+" statistics, amber highlight, rotated text.

### V1 — screen recording (motion reference)

Measured at 15 fps; values are accurate to about ±70 ms.

| Moment | Observation |
| --- | --- |
| Intro | Photo and search dock are present from the first frame. The headline fades in about 0.45 s later over roughly 0.25 s. Thumbnails pop in from about 0.55 s, 70–130 ms apart, growing from roughly 40% scale. The connector line draws at about 1.3 s; the caption and concentric rings arrive at about 1.6 s. |
| Scene change 1 | The active thumbnail swaps size in about 200 ms. Photos cross-dissolve over 550–650 ms with both layers visible; there is no blank frame. The old headline fades while the new one is revealed by a right-to-left wipe over about 400 ms. Rings, connector and caption return 0.6–0.9 s later. |
| Scene change 2 | The new photo enters from the right behind a soft diagonal edge over about 530 ms. A cloud layer rises about 400 ms after. |
| During both changes | The header stays mounted. **The search dock does not move by a single pixel.** |
| Scroll | Ordinary browser scrolling. The hero dissolves into a pale layer. The second row of cards brightens from about 50% opacity as it enters. The dock scrolls away with the page. |
| Card to detail | Page cross-dissolve of about 270 ms. The main image scales from roughly 0.6 to 1, anchored bottom-left, over about 600 ms. Thumbnails follow. The action button appears last, about 1 s in. |

- **Reuse:** overlapping photo layers, a dock that stays still, thumbnail-driven scenes, secondary elements arriving after the photo, ordinary scrolling.
- **Do not copy:** cloud layers, a headline that changes per scene (Majestia keeps one stable `h1`), ratings on cards, "Book Now".
- **Timing note:** the brief specifies 1.1 s for the hero image. The recording's dissolves are faster (about 0.6 s). The brief's explicit values are used for the entrance; scene changes use 0.95 s, between the two.

---

## 4. Shared patterns across the references

1. **Framed canvas.** R03, R04, R05, R11, R12 and R13 place the hero inside a large rounded frame on a tinted page, so the page colour stays visible around the photography.
2. **Photography carries the page.** Architecture at dusk or golden hour, with the interface sitting on it rather than beside it.
3. **Pills and circles.** Pill buttons, pill chips and circular thumbnails recur in 11 of 13 screenshots.
4. **Large soft radii.** 24–40 px on panels, full radius on controls.
5. **Glass as an accent.** Frosted surfaces appear on small floating elements (labels, chips, bars), not on whole pages. R02, R08 and R10 define the material.
6. **Photo dissolving into the page tone** at the lower edge (R01, R07, R12).
7. **One bottom action on mobile** (R01, R06, R09).
8. **Thumbnail-driven scene selection** (R04, R08, R12, V1).

---

## 5. Analysis

### Colour

No palette image exists (section 1). Values from the brief:

| Token | Hex | Role |
| --- | --- | --- |
| Champagne | `#E3CDB3` | Page background, warm atmosphere |
| Sand | `#D0B898` | Secondary surfaces, selected backgrounds |
| Blue-grey | `#B5C2CB` | Quiet glass, search and input surfaces |
| Slate blue | `#607680` | Primary action, active states, dark glass |
| Charcoal | `#1F292E` | Text, icons |

Sampling the references supports these values. R11 yields `#BACAD1` and `#546C7C` (the cool pair). R12 yields `#EAC9B3`, `#D3C0B1` and `#BEA693` (the warm pair). R08 combines both families.

Measured contrast (WCAG):

| Pair | Ratio | Use |
| --- | --- | --- |
| Charcoal on champagne | 9.6 | Body text |
| White on slate blue | 4.8 | Primary button label |
| Slate blue on champagne | 3.1 | Large text and icons only, never small text |

Because slate blue fails for small text on warm surfaces, two derived tones are added. Both are shades of the official colours, not new hues: `#3E4C53` for secondary text (5.8 on champagne, 4.8 on blue-grey) and `#4C6069` for pressed and hover states of the primary action. Light tints `#F4EADD` (champagne) and `#E7ECEF` (blue-grey) provide readable surfaces for forms, calendars and prices.

Excluded: olive and sage (R03, R04, R09), forest green (R07), amber (R13), pale yellow (R08), pink (R02), saturated navy (R10), pure black interface (R01, R05).

### Typography

No approved Majestia typeface exists. The references use neo-grotesk and geometric sans faces; the serif in R12 and the ultra-thin capitals in R11 are not adopted. **Geist Sans** is used, self-hosted through the `geist` package so builds need no network access.

| Role | Desktop | Mobile |
| --- | --- | --- |
| Hero heading | 68–84 px | 38–46 px |
| Section heading | 42–60 px | 30–38 px |
| Body | 17 px | 16 px |
| Small label | 14 px | 13 px minimum |

Headings use weight 500 with −0.03 em tracking. Nothing is set lighter than 400.

### Layout

- 12-column grid, 1320 px maximum content width, 24 px mobile and 40–56 px desktop gutters.
- Framed hero with a 12 px page inset and 36 px radius.
- Section rhythm alternates composition so that no two adjacent sections share a layout: framed hero, asymmetric destination mosaic, card rail, dark split, numbered steps, accordion.

### Motion

| Layer | Owner | Property |
| --- | --- | --- |
| First-paint hero entrance | CSS keyframes | opacity, transform on inner nodes |
| Hero scene change, thumbnails, popovers, sheets, menus, gallery modal, shortlist bar | Motion for React | opacity, transform |
| Section, card and FAQ reveals; desktop hero parallax | GSAP ScrollTrigger | opacity, transform |
| Hover, focus, colour | CSS transitions | colour, border, shadow |

Each animated node has exactly one owner. Where two systems act on the same visual element they act on separate nested nodes.

The first-paint entrance uses CSS rather than Motion on purpose: a server-rendered `opacity: 0` that waits for JavaScript would hide the headline and hero image until hydration, which breaks the rule against hiding content and harms Largest Contentful Paint.

### Responsive behaviour

The references are almost all either desktop heroes or native mobile screens; none shows a tablet layout, so 768 px and 1024 px are designed here rather than derived.

| Width | Behaviour |
| --- | --- |
| 360–390 | Shorter hero; headline, then a stacked search card; horizontal thumbnail row; pickers open as bottom sheets; one bottom action per page |
| 768 | Two-column grids; dock becomes two rows |
| 1024 | Full horizontal dock; vertical thumbnail rail; three-column grids |
| 1440 | Full editorial layout; parallax enabled |

---

## 6. Final page architecture

| Route | Purpose | Rendering |
| --- | --- | --- |
| `/` | Hero with scenes and search dock, destinations, selection, concierge, process, FAQ | Static |
| `/stays` | Search summary, editable search, filters, grid, shortlist, all result states | Static shell, client search |
| `/destinations` | The four destinations | Static |
| `/destinations/[slug]` | Destination story and its properties | Static per destination |
| `/properties/[slug]` | Gallery, facts, amenities, rules, price and availability labels, request panel, similar properties | Static per property |
| `/request` | Short request form | Static shell, client form |
| `/request/[reference]` | Receipt and status | Client lookup |

"La conciergerie" in the navigation points to the concierge section of the homepage (`/#conciergerie`), since no separate route was requested.

One route was added to the requested list: `/credits`. The demonstration photographs are under Creative Commons licences that require attribution, and this page provides it. It can be removed once the site uses only Majestia's own photography.

All public routes live in an `app/(public)/` route group, so a future admin area can be added beside it without sharing layout or styles.

---

## 7. Component architecture

```
src/
  app/                    routes, global styles and design tokens
  components/
    layout/               PublicHeader, PublicFooter, NotFoundMessage
    hero/                 HomeHero, HeroScene, HeroSceneControls, HeroThumbnailSelector
    search/               GlassSearchDock, FieldButton, DestinationField, DateRangePicker, GuestSelector
    property/             PropertyCard, PropertyGrid, PropertyGallery, PropertyFacts,
                          PropertyAmenities, PriceLabel, AvailabilityLabel, ShortlistButton
    stays/                StaysExplorer, FilterSheet, ShortlistSummary, ResultStates
    destination/          DestinationCard, DestinationSection
    request/              RequestPanel, RequestForm, RequestLookup, RequestReceipt, RequestStatus
    home/                 SelectionSection, ConciergeSection, ProcessSection, FAQ, ClosingSection
    ui/                   Button, Sheet, ResponsivePanel, PhotoImage, ScrollReveals,
                          MotionProvider, Wordmark
  content/                French copy, separate from components
  data/mock/              demo fixtures and photo library, separate from UI
  lib/
    api/                  domain types, the adapter interface, the demo adapter
    search/               the single implementation of search state, and date helpers
    shortlist/            shortlist store
    motion/               Motion presets, GSAP registration, CSS entrance timing
    a11y/                 focus trap, Escape handling, scroll lock, media queries
    design/               design tokens mirrored for script use
```

Search state has one implementation (`lib/search`). The dock, results page, property page and request form all read and write the same URL parameters through it.

---

## 8. Data and integration boundary

No backend is available, so:

- `lib/api/types.ts` defines the domain types and the `MajestiaApi` interface. This is the only seam the real backend needs to satisfy.
- `lib/api/mock-adapter.ts` implements it from fixtures in `data/mock/`. Every fixture file and the adapter are marked as demo.
- No HTTP adapter is written. The real API contract is **Unknown**, and writing one would be guessing.

The backend stays authoritative for availability, price, date validation, quote validity, request status, payment status and booking confirmation. The interface never states any of these as fact.

Demo behaviour visible to visitors:

- A notice states that the site is running on demonstration data.
- Photographs carry a "Photo d'illustration" label.
- Demo request references contain `DEMO`, and the receipt states that nothing was transmitted to Majestia.

---

## 9. Technical risks and open questions

| # | Risk or unknown | Handling |
| --- | --- | --- |
| 1 | Palette swatch image missing | Brief's hex values used; one token file to update |
| 2 | No backend or API contract | Mock adapter behind an interface; nothing is presented as real |
| 3 | No Majestia photography | Licensed stock photographs, downloaded locally, labelled as illustrations, credited in `data/mock/photo-credits.ts`. To be replaced with real inventory photography |
| 4 | No property inventory | Invented demo properties. Names, prices, capacities and rules are placeholders |
| 5 | WhatsApp number unknown | Read from `NEXT_PUBLIC_WHATSAPP_NUMBER`. If unset, no WhatsApp action is shown |
| 6 | Response times, legal pages, contact details unknown | Not shown. No response time is promised anywhere |
| 7 | Concierge services unknown | Described generically as available on request, depending on property. Copy needs validation |
| 8 | `backdrop-filter` unsupported or disabled | `@supports` fallback to opaque tinted surfaces |
| 9 | Blur cost on low-end devices | Glass limited to a few small surfaces per viewport; blur is never animated |
| 10 | Very new dependency majors (Next 16, Tailwind 4, Motion 14) | Versions verified at install. npm resolved TypeScript 6.0.3 and ESLint 9.39.5; nothing was pinned by hand |
| 11 | Demo requests stored in the browser | Stated on the receipt; a real backend replaces this |

---

## 10. Implementation phases

1. Scaffold: Next.js (App Router), TypeScript, Tailwind, Motion, GSAP, Lucide, Geist.
2. Design tokens, glass materials, base styles, primitives.
3. Data layer: types, fixtures, mock adapter, search module, shortlist store.
4. Demo photography: source, verify visually, compress, credit.
5. Header, footer, homepage.
6. Results page, filters, shortlist.
7. Property page and gallery.
8. Destination pages.
9. Request form, receipt and status.
10. Verification: build, lint, type check, routes, widths, keyboard, reduced motion, states.

## 11. Files

Created: everything under `src/` (81 files) and `public/demo/` (44 photographs), plus `docs/public-site-audit.md`, `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore` and `.env.example`.

Generated by tools, not written by hand: `next-env.d.ts`, `AGENTS.md` (written by the Next.js development server) and `src/data/mock/photo-library.json` (produced by the photograph download script).

Modified: none. No file existed before this work except the references, which are unchanged.

---

## 12. Delivery record

### Where the build departed from the plan

- **Photography source.** Unsplash refuses automated access and its `robots.txt` disallows the download path, so it was not used. Photographs come from Wikimedia Commons through its public API, under CC BY and CC BY-SA licences.
- **Pickers sit beside the glass dock, not inside it.** An element with a backdrop filter prevents its descendants from blurring what lies behind them, which left the calendar unreadable. The pickers are now siblings of the glass form.
- **Hero text contrast.** Measured contrast over photography was as low as 1.8:1. A soft dark shade now sits behind the hero copy, the dark glass carries a deeper charcoal veil, and text-heavy cards over photographs use the denser sheet tint.
- **Search dock rows.** The dock is a single row from 1280 px. Between 768 and 1279 px it uses two rows; at exactly 1024 px a single row overflowed by 10 px.
- **Image sizes.** `sizes` values describe the drawn width of tall crops, and `deviceSizes` gained 1440 and 2560, so a phone no longer receives a 3840 px hero.

### Verification, run against the production build

| Check | Result |
| --- | --- |
| `npm run build` | Passes. 21 pages generated |
| `npm run lint` | Passes, no warnings |
| `npm run typecheck` | Passes |
| Routes | 19 respond 200; unknown property, destination and address respond 404 |
| Hero and dock behaviour | 34 of 34 checks pass |
| Results, property and request flows | 47 of 47 checks pass |
| Phone flow, overflow, images, touch targets | 17 of 17 checks pass |
| Horizontal overflow | None on 55 route and width combinations (360, 390, 768, 1024, 1440) |
| Text contrast, measured from rendered pixels | 74 samples, none below its threshold |
| Layout shift | 0.003 or less on every measured page |

The checks were scripted in a headless Chrome with Playwright, kept outside the repository. They are not part of the project's test suite: the project has none yet.

### Largest Contentful Paint, simulated slow 4G with 4x CPU slowdown

| Page | LCP |
| --- | --- |
| Home, phone | 2.0 s |
| Destination, phone | 1.8 s |
| Property, phone | 2.1 s |
| Results, phone | 4.3 s |

These are local laboratory figures, not field data. The results page is slow because its search runs in the browser after the page loads, and the demo adapter adds 0.45 s of simulated delay. Once a real API exists, running the first search on the server would fix this.

### Open items

1. The palette swatch image was never supplied. Colours come from the hex values in the brief.
2. No backend is connected. Every property, price, availability and request is demonstration data, and the interface says so.
3. All photographs are placeholders to replace with Majestia's own. Property photographs show real third-party places and are labelled as illustrations.
4. Concierge services, house rules, arrival and departure times are placeholder copy to validate.
5. No WhatsApp number is configured, so no WhatsApp action appears. A demo request never offers one.
6. No privacy notice, legal pages or contact details exist; none were invented.
7. Results-page LCP on slow connections (see above).
8. The wordmark is set in type. No logo file was supplied.
9. `npm audit` reports 5 high-severity advisories, all in the lint toolchain (`eslint-config-next` and its dependencies). Production dependencies report none. The suggested fix downgrades `eslint-config-next` to version 14 and was not applied.
10. Not tested: Safari, Firefox, real devices and screen readers. Only Chrome was available for automated checks.
