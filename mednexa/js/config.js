/* ============================================================
   MedNexa — single easy-to-edit config
   Change copy, prices, contact, and motif here.
   All pages read window.MEDNEXA. No build step needed.
   To support Arabic later: layout already uses logical
   properties; set <html dir="rtl" lang="ar"> and add
   translations to copy.* below.
   ============================================================ */
window.MEDNEXA = {
  brand: {
    name: "MedNexa",
    tagline: "Where care meets intelligence.",
    // Refined hero promise (calm, human, precise):
    heroPromise: "Clarity for every clinical decision.",
    supportEmail: "hello@mednexa.example",
    demoEmail: "care@mednexa.example",
  },
  theme: {
    defaultMode: "light", // "light" | "dark" — respects saved choice first
    accent: "#ff4d3d",    // must match --accent in tokens.css
  },
  motif: {
    // "the nexus" network: nodes + vein-like links
    nodeCountDesktop: 70,
    nodeCountMobile: 34,
    linkDistance: 130,
    driftSpeed: 0.22,
    lineColorLight: "rgba(20,40,67,0.22)",
    lineColorDark: "rgba(250,246,239,0.20)",
    nodeColor: "#ff4d3d",
  },
  pricing: {
    currency: "USD",
    diagnox: { monthly: 19, yearly: 182, unit: "per person / month" },
    dermaStarter: { monthly: 49, yearly: 470, unit: "per physician / month" },
    dermaClinic: { monthly: 119, yearly: 1142, unit: "per clinic / month" },
  },
  copy: {
    diagnoxDisclaimer:
      "Diagnox provides screening insights, not a medical diagnosis. Consult a qualified doctor.",
  },
};
