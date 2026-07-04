// test-render.js
import fs from "fs"
import { renderSite } from "./services/render.service.js"

const fakeContent = {
  nom: "Studio Atlas",
  heroBadge: "★ 12 ans d'expérience",
  heroTitle: "Agence d'architecture innovante",
  heroSubtitle: "Des espaces conçus pour durer, alliant esthétique et fonctionnalité.",
  statsHtml: `
    <div class="stat-item"><span class="stat-value">120+</span><span class="stat-label">Projets réalisés</span></div>
    <div class="stat-item"><span class="stat-value">12</span><span class="stat-label">Années d'expérience</span></div>
    <div class="stat-item"><span class="stat-value">45</span><span class="stat-label">Clients fidèles</span></div>
    <div class="stat-item"><span class="stat-value">98%</span><span class="stat-label">Satisfaction client</span></div>
  `,
  servicesHtml: `
    <div class="service-card fade-in delay-1">
      <span class="service-num">01</span>
      <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l8-4 8 4v14"/></svg></div>
      <h3>Conception architecturale</h3>
      <p>Études et plans personnalisés.</p>
    </div>
    <div class="service-card fade-in delay-2">
      <span class="service-num">02</span>
      <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l9 6-9 6-9-6 9-6zM3 15l9 6 9-6"/></svg></div>
      <h3>Aménagement intérieur</h3>
      <p>Optimisation des espaces de vie et de travail.</p>
    </div>
    <div class="service-card fade-in delay-3">
      <span class="service-num">03</span>
      <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
      <h3>Suivi de chantier</h3>
      <p>Accompagnement complet jusqu'à la livraison finale.</p>
    </div>
  `,
  faqHtml: `
    <div class="faq-item">
      <div class="faq-question">Combien de temps dure un projet type ?<span class="faq-toggle">+</span></div>
      <div class="faq-answer"><p>Test réponse injectée dynamiquement.</p></div>
    </div>
    <div class="faq-item">
      <div class="faq-question">Travaillez-vous avec un budget défini ?<span class="faq-toggle">+</span></div>
      <div class="faq-answer"><p>Oui, nous adaptons nos propositions à votre enveloppe budgétaire.</p></div>
    </div>
  `,
  aboutText: "Agence spécialisée dans la conception d'espaces durables et innovants (texte injecté).",
  footerServicesHtml: "<li>Conception</li><li>Aménagement</li>",
  adresse: "Rue de la République, Sfax",
  telephone: "+216 12 345 678",
  email: "contact@studioatlas.tn",
  whatsappNumber: "21612345678"
}

const html = renderSite(fakeContent)
fs.writeFileSync("test-output.html", html)
console.log("✅ test-output.html généré — ouvre-le dans le navigateur")