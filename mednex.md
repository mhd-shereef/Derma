
Design and build a complete, production-quality marketing and sales website for "MedNexa", a health-tech company that sells two products. The site must NOT look like a generic SaaS template.

## About the company

MedNexa builds software for healthcare. Tagline direction: "Where care meets intelligence." (open to a better one).

## Products

1. Diagnox: an AI-based health analysis platform. It covers cancer risk screening, diabetes risk, general health analysis, BMI calculation, and a personal health tracker. Audience: individuals, wellness programs, and clinics.
2. Derma: an EMR (electronic medical record) system built for individual clinic physicians, especially dermatology practices. Covers patient records, visit notes, image/lesion tracking, prescriptions, and appointments. Audience: solo doctors and small clinics.

## Design direction (important: avoid the generic look)

- No stock gradient hero with a laptop mockup, no purple-blue "AI glow", no generic icon grids, no stock photos of smiling doctors.
- Concept: "the nexus", a connected network. Use a recurring visual motif of fine nodes and lines that form organic, vein-like or neural patterns, and use it to link the two products visually.
- Palette: deep ink/navy base, warm off-white surfaces, one sharp accent (e.g., coral or electric mint). Define colors as CSS variables, with light and dark modes.
- Typography: pair an expressive serif or editorial display font for headlines with a clean, highly legible sans for body text. Large, confident type with generous whitespace.
- Layout: asymmetric sections, oversized numbers, editorial-style spacing. Avoid repeating the same three-card row.
- Motion: subtle and purposeful (scroll-linked reveals, the network motif gently animating, hover states on product cards). Respect prefers-reduced-motion.
- Product visuals: build realistic, stylized UI mockups in code (a Diagnox risk-score dashboard, a Derma patient chart with a lesion timeline) instead of using stock images.
- Tone of copy: calm, trustworthy, human, precise. No buzzword filler.

## Pages and sections

1. Home: striking hero with one clear promise, then a split showcase of Diagnox and Derma, "how it works" in 3 steps, trust and security section, short testimonial placeholders, final CTA.
2. Diagnox page: features (cancer, diabetes, BMI, tracker), a sample interactive BMI calculator widget, sample report preview, who it's for, pricing.
3. Derma page: EMR features, workflow walkthrough (visit, notes, images, prescription), why solo clinics choose it, pricing.
4. Pricing: clear plans for each product with a toggle (monthly/yearly) and a "Contact us" option for clinics.
5. Book a demo / contact: short form (name, role, clinic, product of interest, message).
6. About, FAQ, Privacy and Terms placeholders.

## Trust and compliance

- Include a section on data privacy, encryption, and role-based access.
- Add a clear disclaimer on Diagnox: "Provides screening insights, not a medical diagnosis. Consult a qualified doctor."
- Do not make unverified clinical claims or invent statistics, certifications, or customer names. Use clearly marked placeholders.

## Technical requirements

- Fully responsive (mobile first), accessible (WCAG AA contrast, keyboard navigation, semantic HTML, alt text).
- Fast: no heavy libraries, optimized assets, lazy loading.
- Clean, well-commented code with a single easy-to-edit config for colors, fonts, and copy.
- SEO basics: meta titles and descriptions, Open Graph tags, structured headings.
- Include English now, with a layout that can support Arabic (RTL) later.

## Output

Deliver the complete working code for the site, then a short note explaining the design concept and how to customize it.
