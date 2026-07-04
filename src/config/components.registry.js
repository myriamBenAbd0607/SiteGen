export const COMPONENTS_REGISTRY = {
  navbar: {
    "navbar-a": { file: "navbar/navbar-a.html", tags: ["minimal", "transparent"] },
    "navbar-b": { file: "navbar/navbar-b.html", tags: ["with-topbar", "full"] },
  },
  hero: {
    "hero-a": { file: "hero/hero-a.html", tags: ["fullscreen", "image-bg", "bold"] },
    "hero-b": { file: "hero/hero-b.html", tags: ["split", "image-right", "modern"] },
    "hero-c": { file: "hero/hero-c.html", tags: ["centered", "gradient", "no-image"] },
  },
  stats: {
    "stats-a": { file: "stats/stats-a.html", tags: ["overlap", "dark"] },
    "stats-b": { file: "stats/stats-b.html", tags: ["cards", "light"] },
  },
  services: {
    "services-a": { file: "services/services-a.html", tags: ["grid", "icons"] },
    "services-b": { file: "services/services-b.html", tags: ["alternating", "image"] },
  },
  portfolio: {
    "portfolio-a": { file: "portfolio/portfolio-a.html", tags: ["bento", "varied"] },
    "portfolio-b": { file: "portfolio/portfolio-b.html", tags: ["masonry", "uniform"] },
  },
  testimonials: {
    "testimonials-a": { file: "testimonials/testimonials-a.html", tags: ["cards", "3col"] },
    "testimonials-b": { file: "testimonials/testimonials-b.html", tags: ["single", "large"] },
  },
  faq: {
    "faq-a": { file: "faq/faq-a.html", tags: ["split", "2col"] },
    "faq-b": { file: "faq/faq-b.html", tags: ["centered", "full"] },
  },
  cta: {
    "cta-a": { file: "cta/cta-a.html", tags: ["dark", "large"] },
    "cta-b": { file: "cta/cta-b.html", tags: ["accent", "form"] },
  },
  footer: {
    "footer-a": { file: "footer/footer-a.html", tags: ["full", "4col"] },
    "footer-b": { file: "footer/footer-b.html", tags: ["minimal", "centered"] },
  },
}

export const MANDATORY_SECTIONS = ["navbar", "hero", "footer"]

export const OPTIONAL_SECTIONS = [
  "stats", "services", "about", "portfolio",
  "testimonials", "faq", "cta"
]

export function getAvailableVariants(sectionName) {
  return Object.keys(COMPONENTS_REGISTRY[sectionName] || {})
}