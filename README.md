# 50for50scholarship.org

Rebuild of the website for the **50 for 50 Sigma Scholarship Foundation, Inc.** — a Georgia nonprofit awarding scholarships to Metro Atlanta students, presented in partnership with the Xi Chi Sigma Chapter of Phi Beta Sigma Fraternity, Inc.

Plain static HTML, CSS, and JavaScript. **No build step, no frameworks, no dependencies.** Open a file, edit it, save it, done.

---

## Preview it locally

Double-clicking `index.html` works, but a tiny local server is better (it makes relative paths and the 404 page behave the way they will in production):

```bash
cd 50for50-site
python3 -m http.server 8000     # then open http://localhost:8000
# or:  npx serve .
```

---

## What's in here

```
index.html          Home
about.html          Mission, three pillars, Foundation/Chapter relationship, legal details
board.html          Executive officers + founding board members
scholarships.html   Awards, eligibility, FAQ
apply.html          Application steps, requirements, application form
events.html         Linen & Blues, Brisket & Brotherhood, calendar
sponsors.html       Sponsorship levels, benefits, partners
donate.html         Giving levels, monthly, mail-a-check, employer matching
contact.html        Contact details + contact form
404.html            Not-found page

assets/css/styles.css   Everything visual. Design tokens live at the top.
assets/js/main.js       Mobile nav, scroll reveals, footer year, donate amount picker.
assets/img/             Placeholder artwork — all of it is meant to be replaced.

tools/content.json      Fill in the real copy values here…
tools/fill-tokens.js     …then run this to drop them into the HTML.
tools/make-placeholders.js  Regenerates the placeholder SVGs (delete once real photos are in).
tools/page-template.html    Blank page with the shared header/footer — copy it to add a page.

robots.txt, sitemap.xml, .nojekyll
```

---

## Before this goes live

### 1. Fill in the placeholders

The site is full of `{{TOKEN}}` placeholders — every number, date, URL, and bio I could not verify. **They will render literally on the page**, so none can survive to launch. That is deliberate: a visible `{{APP_DEADLINE}}` is better than a confident wrong date.

Fill them in one of two ways:

**Option A — edit `tools/content.json`, then run the filler:**

```bash
node tools/fill-tokens.js --dry-run   # preview
node tools/fill-tokens.js             # apply
```

It prints anything still unfilled when it finishes. You can run it repeatedly as you gather values.

**Option B — find and replace in your editor.** Search the repo for `{{` and work through the list.

Either way, this is a one-time swap. Once a token is replaced you edit the HTML directly from then on.

### 2. Answer these before writing the values

These are the facts I did not have, grouped by who can answer them:

| Needs an answer from | Tokens |
|---|---|
| **You / the board** | `TOTAL_AWARDED`, `SCHOLARS_SUPPORTED`, `YEAR_FOUNDED`, `AWARD_AMOUNT`, `AWARDS_PER_YEAR`, `MIN_GPA`, `APP_OPEN_DATE`, `APP_DEADLINE`, `AWARD_DATE`, `ESSAY_PROMPT`, `ESSAY_LENGTH`, `DISBURSEMENT_NOTE`, `REAPPLY_NOTE` |
| **Joe Freeman (CFO)** | `TAX_STATUS_LINE` — the exact deductibility language. The site currently says only "Georgia nonprofit corporation" and states the EIN; do **not** claim 501(c)(3) deductibility until he confirms it in writing. |
| **Event leads** | `EVENT_DATE_LINEN`, `EVENT_VENUE_LINEN`, `EVENT_TICKETS_LINEN`, `EVENT_TICKET_URL_LINEN`, `EVENT_DATE_BRISKET`, `EVENT_TICKETS_BRISKET`, `EVENT_TICKET_URL_BRISKET`, and the three `EVENT_3/4/5_*` cards (fill them or delete the cards) |
| **Prospectus** | `TIER_1..4_AMOUNT` / `TIER_1..4_BENEFITS`, `PROSPECTUS_URL` — pull these straight from the Corporate Donation Prospectus rather than reinventing them |
| **Each board member** | `BIO_MURDOCK`, `BIO_WALDEN`, `BIO_FREEMAN`, `BIO_WHITE`, `BIO_CANGE`, `BIO_MARSHALL` — two sentences each |
| **Comms** | `EMAIL`, `PHONE`, `FACEBOOK_URL`, `INSTAGRAM_URL`, `LINKEDIN_URL`, `DONATE_URL`, `DONATE_MONTHLY_URL`, `PAYMENT_PROCESSOR` |

There are also `<!-- TODO: -->` comments in the HTML for things that need a human decision rather than a value — search for `TODO` to find them. One in particular: **Dr. Carlton Calhoun** is listed as a contact on the current site; if he serves on the board, add him to `board.html`.

### 3. Replace the artwork

Everything in `assets/img/` beginning with `ph-` is a generated placeholder with "REPLACE" printed across it. Swap in real photography at these sizes:

| File | Used for | Size |
|---|---|---|
| `ph-mission.svg` | Homepage mission, check presentation | 1200×900 |
| `ph-students.svg` | Scholars / awareness sessions | 1200×900 |
| `ph-community.svg` | Volunteers at a community event | 1200×900 |
| `ph-linen.svg` | Linen & Blues | 1200×675 |
| `ph-brisket.svg` | Brisket & Brotherhood | 1200×675 |
| `ph-board.svg` | Board group photo | 1200×675 |
| `ph-portrait.svg` | Board headshots (one per person) | 600×600 square |

Use `.jpg` for photos and update the `src` and `alt` on each `<img>`. Also replace the Open Graph image (`og:image` in each page's `<head>`) with a real 1200×630 JPG — that is what shows when someone shares a link on Facebook.

`assets/img/favicon.svg` and the inline `50/50` logo mark in the header are stand-ins too. If the Foundation has an official logo (the one covered by the USPTO filing), use that instead.

### 4. Wire up the two forms

`apply.html` and `contact.html` have real form markup with `action="{{FORM_ENDPOINT}}"` that currently goes nowhere. Pick one:

- **Netlify / Cloudflare Pages** — add `netlify` and `name="application"` attributes to the `<form>` tag and submissions land in the dashboard. Zero code.
- **Formspree / Basin / FormSubmit** — sign up, paste the endpoint URL into `FORM_ENDPOINT`. Works on any host, including GitHub Pages.
- **Google Form** — delete the `<form>` block and point the "Start your application" button at the Google Form URL instead. Least elegant, least work, and the responses land in a spreadsheet the committee can already use.

Whichever you choose, test it end to end and make sure the notification goes somewhere a person actually reads.

### 5. Check accessibility and links

```bash
npx linkinator http://localhost:8000 --recurse    # broken links
npx pa11y http://localhost:8000                   # accessibility
```

---

## Editing the site

**Colors and type** — all design tokens are at the top of `assets/css/styles.css` under `:root`. `--blue` is Phi Beta Sigma royal blue; `--accent` is the gold used only on Donate/Apply buttons. Change `--accent` to `#ffffff` or a blue if you'd rather the site stay strictly blue-and-white.

**The header and footer are copied into every page.** That is the cost of having no build step. If you change a nav link or a footer column, change it in all ten `.html` files — find-and-replace across the folder handles it in one pass.

**Adding a page** — copy `tools/page-template.html` to the repo root, rename it, fill in the title/description/content, add it to the nav in every page and to `sitemap.xml`.

**Reusable pieces** already in the CSS, if you're writing new sections: `.card`, `.tier`, `.step`, `.checklist`, `.faq`, `.stats`, `.logo-wall`, `.quote`, `.cta-band`, `.media`, `.person`, `.btn--primary/--accent/--ghost/--onblue/--white`. Add `data-reveal` to any element to have it fade in on scroll.

---

## Deploying

Hosting isn't decided yet, so nothing here is tied to a provider. Every file is static and can be dropped on any host as-is.

**GitHub Pages** — push to GitHub, then Settings → Pages → Deploy from branch → `main` / root. Add a file named `CNAME` at the repo root containing `50for50scholarship.org`, then point the domain's DNS at GitHub (four `A` records for the apex, plus a `CNAME` for `www`). `.nojekyll` is already here so Pages serves the files untouched.

**Netlify or Cloudflare Pages** — connect the repo, leave the build command blank, set the publish directory to `/`. You get form handling and redirects for free, which is why they're worth considering given the two forms above.

**Existing host** — upload the repo contents to the web root over FTP/cPanel. Keep the folder structure intact.

Whatever you pick: put the new site on a staging URL first and click every link and both forms before pointing the live domain at it.

---

## Foundation facts used on the site

Verified and hard-coded (not tokens), so if any of these are wrong, fix them everywhere:

- Legal name: **50 for 50 Sigma Scholarship Foundation, Inc.**, a Georgia nonprofit corporation
- EIN: **83-3944594**
- Mailing address: **P.O. Box 82714, Atlanta, GA 30354**
- USPTO trademark Serial No. **98/824,939** (Classes 025 & 041)
- Executive officers: Andre Murdock (President & CEO), Antonio Walden (Secretary), Joe Freeman (CFO)
- Founding board: Dr. Garrick White, Joseph Charles Devon Cange Sr., Rasheed B. Marshall
- The Foundation is the legal donor entity; Xi Chi Sigma is the **presenting partner** — this distinction is stated on `about.html` and `sponsors.html` and should not be blurred in future copy
- Three pillars: Community Philanthropy, Scholarship Awareness, Scholarship Dissemination
- Signature events: Linen & Blues; Brisket & Brotherhood (John A. White Park)
- Partner named on the current site: Enterprise Holdings

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari), plus iOS and Android. Uses CSS grid, `clamp()`, and `aspect-ratio`. The site is readable with JavaScript disabled — JS only adds the mobile menu, scroll reveals, and the footer year.
