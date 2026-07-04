// prompts/contentPrompt.js

export function buildContentPrompt({ nom, secteur, servicesList, langue, langueInstruction }) {
  return `Tu es un rédacteur web professionnel spécialisé dans le secteur "${secteur}".
Génère UNIQUEMENT un objet JSON valide, sans aucun texte avant ou après, sans balises markdown.

CONTEXTE :
Nom de l'entreprise : ${nom}
Secteur : ${secteur}
Services proposés : ${servicesList.join(", ")}
${langueInstruction}

Réponds avec EXACTEMENT cette structure JSON :
{
  "heroBadge": "courte accroche avec une icône texte, ex: ★ 12 ans d'expérience",
  "heroTitle": "titre accrocheur de 4 à 7 mots pour ${nom}",
  "heroSubtitle": "phrase d'accroche de 12 à 18 mots",
  "stats": [
    { "value": "120+", "label": "libellé court" },
    { "value": "12", "label": "libellé court" },
    { "value": "45", "label": "libellé court" },
    { "value": "98%", "label": "libellé court" }
  ],
  "aboutText": "2 à 3 phrases sur ${nom}, son histoire, ses valeurs",
  "services": [
    { "title": "${servicesList[0] || "Service"}", "description": "1 phrase descriptive de 12 à 18 mots", "iconKey": "icon-key-1" }
  ],
  "faq": [
    { "question": "question pertinente pour le secteur ${secteur}", "answer": "réponse claire de 1 à 2 phrases" }
  ]
}

CONTRAINTES STRICTES :
- "services" doit contenir EXACTEMENT ${servicesList.length} éléments, un par service dans cet ordre : ${servicesList.join(", ")}
- "iconKey" doit être choisi UNIQUEMENT parmi cette liste : icon-blueprint, icon-build, icon-design, icon-tools, icon-house, icon-team, icon-clock, icon-shield, icon-leaf
- "faq" doit contenir EXACTEMENT 5 éléments
- "stats" doit contenir EXACTEMENT 4 éléments avec des valeurs crédibles pour le secteur ${secteur}
- Tout le texte doit être en ${langue}, naturel, crédible, jamais générique ("Lorem ipsum", "votre entreprise", "nom de l'entreprise")
- Le JSON doit être strictement valide (pas de virgule finale, guillemets doubles uniquement)`
}