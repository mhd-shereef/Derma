# MedNexa — marketing & sales site (standalone, no framework)

Fresh build in `mednexa/`. Nothing reused from the existing codebase.
Open `index.html` directly, or serve the folder: `python -m http.server` → http://localhost:8000

## Pages
`index.html` (Home) · `diagnox.html` (features + BMI widget + sample report) ·
`derma.html` (EMR + 4-part visit workflow) · `pricing.html` (monthly/yearly toggle) ·
`demo.html` (book-a-demo form) · `about.html` · `faq.html` · `privacy.html` · `terms.html`

## Customize (single config)
- Copy/brand: `js/config.js` → `window.MEDNEXA` (prices, emails, disclaimer, motif density/speed)
- Colors/fonts/spacing: `css/tokens.css` (`:root` + `[data-theme="dark"]`)
- Behaviour: `js/main.js` (theme, canvas, BMI, pricing, FAQ, form). No dependencies.
- RTL/Arabic later: layout already uses logical properties; set `<html dir="rtl" lang="ar">` + translate copy.

## Design concept
“The nexus”: fine nodes + vein-like threads (canvas, animated, reduced-motion safe) link the
two products visually. Ink-navy + warm paper + one coral accent. Fraunces (editorial serif)
headlines + Inter body. Asymmetric sections, oversized outline numerals, code-drawn UI
mockups (no stock photos, no purple-blue glow, no 3-card grids).
