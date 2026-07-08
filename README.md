# ⚡ SiteGen — Générateur de Sites Vitrines par IA

> Plateforme SaaS de génération automatique de sites vitrines professionnels, propulsée par l'IA générative. Conçue pour les petites entreprises et artisans tunisiens.

---

## 📋 Présentation

SiteGen permet à n'importe quel professionnel — sans compétences techniques — de créer un site vitrine complet en moins de 5 minutes. L'IA choisit la mise en page, rédige les textes, sélectionne les images et adapte le design au secteur d'activité.

---

## ✨ Fonctionnalités

- 🤖 **Génération IA** — Llama 3.3 70B (Groq) génère le contenu textuel complet en 4 langues (Français, Arabe, Anglais, Darija)
- 🎨 **Design adaptatif** — 20+ variantes de sections (hero, portfolio, footer) choisies selon le secteur
- 📸 **Images automatiques** — Unsplash & Pexels pour les photos, Gemini Vision pour décrire les photos uploadées
- 🏷️ **Logo SVG IA** — Génération de logo vectoriel personnalisé
- 🎨 **18 palettes de couleurs** — Organisées par secteur d'activité
- 💾 **Bibliothèque cloud** — Sites sauvegardés dans Firebase Firestore
- ⚡ **Système de crédits** — Modèle freemium (3 crédits offerts à l'inscription)
- 📊 **CIO Analytics** — Optimisation continue des variantes par algorithme bandit (epsilon-greedy)
- 📱 **Responsive** — Preview mobile / tablette / desktop intégré
- ⬇️ **Export HTML** — Téléchargement du site en fichier HTML autonome

---

## 🏗️ Architecture

```
sitegen/
├── src/                          # Frontend React
│   ├── pages/
│   │   ├── LandingPage.jsx       # Page d'accueil publique
│   │   ├── AuthPage.jsx          # Connexion / Inscription (Firebase Auth)
│   │   ├── WelcomePage.jsx       # Onboarding chatbot
│   │   ├── App.jsx               # Formulaire de génération
│   │   ├── Dashboard.jsx         # Bibliothèque des sites
│   │   ├── PricingPage.jsx       # Plans et crédits
│   │   └── CheckoutPage.jsx      # Simulation paiement
│   ├── hooks/
│   │   └── useCredits.js         # Gestion crédits (Firestore temps réel)
│   ├── contexts/
│   │   └── AuthContext.jsx       # État d'authentification global
│   ├── AppLayout.jsx             # Sidebar + widget crédits
│   ├── main.jsx                  # Router + guards (AuthGuard, CreditGuard)
│   ├── firebase.js               # Config Firebase
│   └── globals.css               # Polices + animations (Plus Jakarta Sans)
│
├── backend/                      # API Express.js
│   ├── server.js                 # Routes principales (/generate, /track, /cio/*)
│   ├── cio.service.js            # Bandit epsilon-greedy + analytics
│   └── templates/
│       ├── layouts/
│       │   └── universal.html    # Layout principal avec placeholders {{VAR}}
│       └── sections/
│           ├── hero/             # hero-a.html, hero-b.html
│           ├── portfolio/        # portfolio-a.html, portfolio-b.html
│           └── footer/          # footer-a.html, footer-b.html
```

---

## 🛠️ Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **Backend** | Node.js, Express.js, ES Modules |
| **Auth** | Firebase Authentication |
| **Base de données** | Firebase Firestore (utilisateurs, sites, crédits, transactions) |
| **IA Texte** | Groq API — `llama-3.3-70b-versatile` |
| **IA Vision** | Google Gemini 2.0 Flash |
| **Images** | Unsplash API, Pexels API, Pollinations.ai (fallback) |
| **Polices** | Plus Jakarta Sans (titres), Inter (corps) |

---

## 🔄 Flux de génération

```
Utilisateur remplit le formulaire
        ↓
CreditGuard vérifie le solde (≥ 1 crédit requis)
        ↓
consumeCredit() — décrémente Firestore atomiquement
        ↓
CIO : chooseVariant() sélectionne hero / portfolio / footer
(aléatoire si < 30 données, bandit epsilon-greedy sinon)
        ↓
Groq LLM génère le JSON de contenu (textes + imageQueries)
        ↓
Unsplash / Pexels / Gemini Vision résolvent les images en parallèle
        ↓
injectVars() remplace les {{PLACEHOLDERS}} dans le template HTML
        ↓
Script de tracking embarqué dans le HTML final
        ↓
Site sauvegardé en Firestore + PostgreSQL
        ↓
Résultat affiché dans l'iframe + téléchargeable en HTML
```

---

## ⚡ Système de crédits

| Pack | Crédits | Prix | Prix/crédit |
|------|---------|------|-------------|
| Starter | 5 | 9,99 € | 2,00 € |
| Pro ⭐ | 15 | 24,99 € | 1,67 € |
| Business 🔥 | 40 | 49,99 € | 1,25 € |
| Entreprise 💎 | 100 | 99,99 € | 1,00 € |

- 3 crédits offerts à chaque nouvelle inscription
- Les crédits n'expirent jamais
- Paiement simulé en mode démonstration

---

## 🚀 Installation

### Prérequis
- Node.js ≥ 18
- Compte Firebase (Auth + Firestore)
- Compte Groq (clé API gratuite)

### Frontend

```bash
git clone https://github.com/myriamBenAbd0607/SiteGen.git
cd SiteGen
npm install
cp .env.example .env     # remplir les variables
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env     # remplir les variables
node server.js
```

### Variables d'environnement (`.env`)

```env
GROQ_API_KEY=
UNSPLASH_ACCESS_KEY=
GEMINI_API_KEY=
```

---

## 🗂️ Secteurs supportés

| Secteur | Palette dédiée | Variantes optimisées |
|---------|---------------|---------------------|
| 💇‍♀️ Coiffure & beauté | Rose Gold, Nude Chic, Violet Luxe | hero-b, portfolio-a |
| 🍽️ Restaurant & café | Terracotta, Olive & Or, Bordeaux | hero-b, portfolio-b |
| 🏥 Médecin & santé | Bleu Confiance, Teal Santé, Sage | hero-b, portfolio-b |
| 🔧 Artisan & réparation | Ambre Craft, Acier, Cuivre | hero-a, portfolio-a |
| 🛒 Commerce & épicerie | Fresh Green, Market Red, Océan | hero-a, portfolio-b |
| 🎯 Autre | Or Premium, Indigo Pro, Charcoal | hero-a, portfolio-a |

---

## 📡 API Backend

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/generate` | Génère un site complet |
| `POST` | `/generate-logo` | Génère un logo SVG |
| `POST` | `/track` | Enregistre une interaction visiteur |
| `GET` | `/cio/performance/:secteur` | Stats par variante et secteur |
| `GET` | `/cio/suggestions/:secteur` | Suggestions basées sur les données |
| `POST` | `/auth/register` | Inscription |
| `POST` | `/auth/login` | Connexion |
| `GET` | `/auth/me` | Profil connecté |
| `GET` | `/projects` | Liste des projets (auth requise) |
| `DELETE` | `/projects/:id` | Suppression d'un projet |

---

## 🚢 Déploiement

| Service | Plateforme recommandée |
|---------|----------------------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) ou [Railway](https://railway.app) |
| Auth & Firestore | [Firebase](https://firebase.google.com) |

---

## 👩‍💻 Auteur

**Myriam Ben Abdallah** — Projet de stage d'été  
Encadré dans le cadre d'un stage en développement web IA  

---

## 📄 Licence

Projet académique — tous droits réservés.