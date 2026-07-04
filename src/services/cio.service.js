import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Chemin vers le fichier d'historique (racine du projet : /data/site-history.json)
const HISTORY_PATH = path.join(__dirname, '..', '..', 'data', 'site-history.json')

const EMPTY_HISTORY = { sites: [], analytics: {} }

// ═══════════════════════════════════════════════════════════
// I/O — Chargement & sauvegarde de l'historique
// ═══════════════════════════════════════════════════════════

/**
 * Charge l'historique des sites générés depuis data/site-history.json.
 * Crée le fichier s'il n'existe pas. Retourne toujours une structure valide.
 */
export function loadHistory() {
  try {
    if (!fs.existsSync(HISTORY_PATH)) {
      fs.mkdirSync(path.dirname(HISTORY_PATH), { recursive: true })
      fs.writeFileSync(HISTORY_PATH, JSON.stringify(EMPTY_HISTORY, null, 2))
      return structuredClone(EMPTY_HISTORY)
    }
    const raw = fs.readFileSync(HISTORY_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return {
      sites: Array.isArray(parsed.sites) ? parsed.sites : [],
      analytics: parsed.analytics && typeof parsed.analytics === 'object' ? parsed.analytics : {},
    }
  } catch (err) {
    console.warn('⚠️  CIO: impossible de charger l\'historique, reset par défaut.', err.message)
    return structuredClone(EMPTY_HISTORY)
  }
}

/**
 * Écrit l'historique complet sur disque (remplace le fichier).
 */
function writeHistory(history) {
  try {
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2))
    return true
  } catch (err) {
    console.error('❌ CIO: échec écriture historique.', err.message)
    return false
  }
}

// ═══════════════════════════════════════════════════════════
// ENREGISTREMENT D'UN SITE
// ═══════════════════════════════════════════════════════════

/**
 * Sauvegarde un nouveau site généré avec ses métadonnées.
 * @param {Object} record
 * @param {string} record.nom
 * @param {string} record.secteur
 * @param {Object} record.layout      - variantes choisies par section (ex: { hero: 'hero-a', ... })
 * @param {Object} record.theme       - thème choisi (dark/accent/lightBg...)
 * @param {number} [record.durationMs]
 * @returns {Object} l'enregistrement créé (avec id + timestamp)
 */
export function saveSiteRecord(record) {
  const history = loadHistory()

  const siteId = `site_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const entry = {
    id: siteId,
    nom: record.nom || '',
    secteur: record.secteur || 'Autre',
    layout: record.layout || {},
    theme: record.theme || {},
    durationMs: record.durationMs ?? null,
    createdAt: new Date().toISOString(),
    metrics: {
      // Rempli plus tard via trackPerformance (vues, conversions, note, etc.)
      views: 0,
      conversions: 0,
      avgTimeOnSiteSec: null,
      rating: null,
      lastUpdatedAt: null,
    },
  }

  history.sites.push(entry)
  writeHistory(history)
  return entry
}

/**
 * Met à jour les métriques de performance d'un site existant.
 * @param {string} siteId
 * @param {Object} metrics - champs partiels à fusionner (views, conversions, avgTimeOnSiteSec, rating...)
 */
export function trackPerformance(siteId, metrics = {}) {
  const history = loadHistory()
  const site = history.sites.find(s => s.id === siteId)

  if (!site) {
    console.warn(`⚠️  CIO: site introuvable pour tracking (id=${siteId})`)
    return null
  }

  site.metrics = {
    ...site.metrics,
    ...metrics,
    lastUpdatedAt: new Date().toISOString(),
  }

  writeHistory(history)
  return site
}

// ═══════════════════════════════════════════════════════════
// LECTURE / ANALYSE PAR SECTEUR
// ═══════════════════════════════════════════════════════════

/**
 * Récupère les N derniers sites générés pour un secteur donné.
 * @param {string} secteur
 * @param {number} limit
 */
export function getPreviousSites(secteur, limit = 10) {
  const history = loadHistory()
  return history.sites
    .filter(s => s.secteur === secteur)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
}

/**
 * Calcule un score de performance simple pour un site.
 * Combine taux de conversion et note utilisateur quand disponibles.
 * Retourne null si aucune donnée exploitable n'existe encore.
 */
function computeScore(metrics) {
  if (!metrics) return null
  const hasViews = metrics.views > 0
  const hasRating = typeof metrics.rating === 'number'

  if (!hasViews && !hasRating) return null

  let score = 0
  let weight = 0

  if (hasViews) {
    const conversionRate = metrics.conversions / metrics.views
    score += conversionRate * 100 * 0.7
    weight += 0.7
  }
  if (hasRating) {
    score += (metrics.rating / 5) * 100 * 0.3
    weight += 0.3
  }
  return weight > 0 ? score / weight : null
}

/**
 * Analyse les performances des sites d'un secteur et propose des suggestions.
 * - fréquence d'usage de chaque variante par section
 * - score moyen par variante (quand des métriques existent)
 * - suggestions textuelles d'amélioration
 */
export function analyzePerformance(secteur) {
  const sites = getPreviousSites(secteur, 9999) // tout l'historique du secteur

  if (sites.length === 0) {
    return {
      secteur,
      totalSites: 0,
      message: 'Aucune donnée historique pour ce secteur encore. Les choix par défaut du LLM s\'appliquent.',
      variantStats: {},
      suggestions: [],
    }
  }

  // variantStats[section][variant] = { count, scoredCount, totalScore }
  const variantStats = {}

  for (const site of sites) {
    const score = computeScore(site.metrics)
    for (const [section, variant] of Object.entries(site.layout || {})) {
      variantStats[section] ??= {}
      variantStats[section][variant] ??= { count: 0, scoredCount: 0, totalScore: 0 }
      variantStats[section][variant].count += 1
      if (score !== null) {
        variantStats[section][variant].scoredCount += 1
        variantStats[section][variant].totalScore += score
      }
    }
  }

  // Construire des moyennes lisibles + suggestions
  const suggestions = []
  const readableStats = {}

  for (const [section, variants] of Object.entries(variantStats)) {
    readableStats[section] = {}
    let best = null

    for (const [variant, stat] of Object.entries(variants)) {
      const avgScore = stat.scoredCount > 0 ? stat.totalScore / stat.scoredCount : null
      readableStats[section][variant] = {
        usageCount: stat.count,
        avgScore: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
      }
      if (avgScore !== null && (best === null || avgScore > best.avgScore)) {
        best = { variant, avgScore }
      }
    }

    if (best) {
      suggestions.push(
        `Pour "${section}", la variante "${best.variant}" obtient le meilleur score moyen (${Math.round(best.avgScore)}/100) — privilégier ce choix pour "${secteur}".`
      )
    }
  }

  if (suggestions.length === 0) {
    suggestions.push('Pas encore assez de métriques (vues/conversions/notes) pour recommander une variante fiable. Continuez à tracker les performances.')
  }

  return {
    secteur,
    totalSites: sites.length,
    variantStats: readableStats,
    suggestions,
  }
}

/**
 * Recommande une variante par section pour un secteur donné, basée sur l'historique.
 * Retourne un objet { section: variant } partiel — uniquement les sections où
 * une recommandation fiable existe (score moyen calculable). Les sections absentes
 * doivent rester gérées par le LLM / SECTOR_CONSTRAINTS comme fallback.
 *
 * @param {string} secteur
 * @param {number} minSamples - nombre minimum de sites notés avant de faire confiance à une recommandation
 */
export function getVariantRecommendation(secteur, minSamples = 3) {
  const analysis = analyzePerformance(secteur)
  const recommendation = {}

  for (const [section, variants] of Object.entries(analysis.variantStats || {})) {
    let best = null
    let totalScoredSamples = 0

    for (const [variant, stat] of Object.entries(variants)) {
      if (stat.avgScore === null) continue
      totalScoredSamples += stat.usageCount
      if (best === null || stat.avgScore > best.avgScore) {
        best = { variant, avgScore: stat.avgScore }
      }
    }

    // On ne recommande que si on a assez d'échantillons notés pour être confiant
    if (best && totalScoredSamples >= minSamples) {
      recommendation[section] = best.variant
    }
  }

  return recommendation
}