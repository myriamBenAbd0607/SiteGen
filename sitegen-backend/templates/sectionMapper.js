// ═══════════════════════════════════════════════════════════
// SECTION MAPPER — Sélection automatique des variantes
// Sections disponibles :
//   navbar    : a (transparent/premium) | b (avec topbar contact)
//   hero      : a (plein écran image)   | b (split 50/50) | c (centré dégradé)
//   stats     : a (overlap sombre)      | b (cards sur fond clair)
//   portfolio : a (bento grid)          | b (magazine)
//   services  : a (grille 3 cols SVG)
//   footer    : a (4 colonnes complet)  | b (minimal centré)
// ═══════════════════════════════════════════════════════════

// ─── Mapping secteur → variantes ─────────────────────────
//
// Logique de différenciation visuelle :
//
// Coiffure & beauté  → split élégant + bento + footer minimal
// Restaurant & café  → plein écran appétissant + magazine + 4 colonnes
// Médecin & santé    → split propre + magazine + topbar contact
// Artisan & réparation → plein écran + bento + CTA géant
// Commerce & épicerie  → plein écran + magazine + 4 colonnes
// Autre (B2B, SaaS)    → dégradé centré + bento + minimal
//
export const SECTOR_VARIANTS = {
  'Coiffure & beauté': {
    navbar:    'a',   // transparent premium
    hero:      'b',   // split image droite → élégant
    stats:     'b',   // cards claires → léger
    portfolio: 'a',   // bento → visuels variés
    services:  'a',
    footer:    'b',   // minimal centré → luxe
  },
  'Restaurant & café': {
    navbar:    'b',   // topbar avec horaires/tél
    hero:      'a',   // plein écran → appétissant
    stats:     'a',   // overlap sombre → impact
    portfolio: 'b',   // magazine → plats mis en scène
    services:  'a',
    footer:    'a',   // 4 colonnes → menu + contact
  },
  'Médecin & santé': {
    navbar:    'b',   // topbar → pro + contact visible
    hero:      'b',   // split → propre, rassurant
    stats:     'b',   // cards claires → médical propre
    portfolio: 'b',   // magazine → spécialités
    services:  'a',
    footer:    'a',   // 4 colonnes → infos pratiques
  },
  'Artisan & réparation': {
    navbar:    'a',   // transparent → fort impact visuel
    hero:      'a',   // plein écran → chantier, matière
    stats:     'a',   // overlap sombre → costaud
    portfolio: 'a',   // bento → réalisations variées
    services:  'a',
    footer:    'a',   // 4 colonnes → devis + contact
  },
  'Commerce & épicerie': {
    navbar:    'b',   // topbar → promo + contact
    hero:      'a',   // plein écran → produits en scène
    stats:     'b',   // cards claires → accueillant
    portfolio: 'b',   // magazine → produits
    services:  'a',
    footer:    'a',   // 4 colonnes → horaires + adresse
  },
  'Autre': {
    navbar:    'a',   // transparent → moderne
    hero:      'c',   // dégradé centré → B2B, SaaS
    stats:     'b',   // cards claires
    portfolio: 'a',   // bento
    services:  'a',
    footer:    'b',   // minimal
  },
}

// ─── Labels lisibles pour l'UI React ─────────────────────
export const SECTOR_VARIANTS_INFO = {
  'Coiffure & beauté':    { navbar:'A — Premium',  hero:'B — Split',    stats:'B — Cards',  portfolio:'A — Bento',    footer:'B — Minimal'   },
  'Restaurant & café':    { navbar:'B — Topbar',   hero:'A — Plein',    stats:'A — Overlap', portfolio:'B — Magazine',  footer:'A — Colonnes'  },
  'Médecin & santé':      { navbar:'B — Topbar',   hero:'B — Split',    stats:'B — Cards',  portfolio:'B — Magazine',  footer:'A — Colonnes'  },
  'Artisan & réparation': { navbar:'A — Premium',  hero:'A — Plein',    stats:'A — Overlap', portfolio:'A — Bento',    footer:'A — Colonnes'  },
  'Commerce & épicerie':  { navbar:'B — Topbar',   hero:'A — Plein',    stats:'B — Cards',  portfolio:'B — Magazine',  footer:'A — Colonnes'  },
  'Autre':                { navbar:'A — Premium',  hero:'C — Dégradé',  stats:'B — Cards',  portfolio:'A — Bento',    footer:'B — Minimal'   },
}