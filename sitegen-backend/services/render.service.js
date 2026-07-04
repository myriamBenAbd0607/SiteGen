// services/render.service.js
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function renderSite(content) {
  let html = fs.readFileSync(
    path.join(__dirname, "..", "templates", "architecture.html"),
    "utf-8"
  )

  const replacements = {
    "{{NOM}}": content.nom,
    "{{HERO_BADGE}}": content.heroBadge,
    "{{HERO_TITLE}}": content.heroTitle,
    "{{HERO_SUBTITLE}}": content.heroSubtitle,
    "{{STATS_HTML}}": content.statsHtml,
    "{{SERVICES_HTML}}": content.servicesHtml,
    "{{FAQ_HTML}}": content.faqHtml,
    "{{ABOUT_TEXT}}": content.aboutText,
    "{{FOOTER_SERVICES_HTML}}": content.footerServicesHtml,
    "{{ADRESSE}}": content.adresse,
    "{{TELEPHONE}}": content.telephone,
    "{{EMAIL}}": content.email,
    "{{WHATSAPP_NUMBER}}": content.whatsappNumber,
  }

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value ?? "")
  }

  return html
}