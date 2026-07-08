// ═══════════════════════════════════════════════════════════
// PRICING PAGE — Page des offres de crédits
// src/pages/PricingPage.jsx
// ═══════════════════════════════════════════════════════════
import { useNavigate } from 'react-router-dom'
import { useCredits, CREDIT_PACKS } from '../hooks/useCredits'

export default function PricingPage() {
  const navigate             = useNavigate()
  const { credits, creditsUsed, plan, loading } = useCredits()

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      minHeight: '100%', background: '#fafafa',
      padding: '40px 32px',
    }}>

      {/* ── En-tête ── */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f0a1e', letterSpacing: '-0.8px', margin: 0 }}>
                Crédits & Tarifs
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>
                Chaque génération de site consomme 1 crédit.
              </p>
            </div>

            {/* Solde actuel */}
            {!loading && credits !== null && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'white', border: '1.5px solid #f3f4f6',
                borderRadius: 14, padding: '14px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: credits === 0 ? '#ef4444' : '#7c3aed', letterSpacing: '-1px' }}>
                    {credits}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>crédits restants</div>
                </div>
                <div style={{ width: 1, height: 36, background: '#f3f4f6' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>{creditsUsed}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>utilisés</div>
                </div>
                <div style={{ width: 1, height: 36, background: '#f3f4f6' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: '#7c3aed',
                    background: '#f5f3ff', border: '1px solid #ede9fe',
                    borderRadius: 20, padding: '3px 10px',
                    textTransform: 'capitalize',
                  }}>{plan}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginTop: 3 }}>plan actuel</div>
                </div>
              </div>
            )}
          </div>

          {/* Alerte crédits épuisés */}
          {!loading && credits === 0 && (
            <div style={{
              marginTop: 20, padding: '14px 20px',
              background: '#fef2f2', border: '1.5px solid #fecaca',
              borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#dc2626' }}>
                  Vous n'avez plus de crédits disponibles
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#ef4444', marginTop: 2 }}>
                  Achetez un pack ci-dessous pour continuer à générer des sites.
                </p>
              </div>
            </div>
          )}

          {/* Alerte crédits faibles */}
          {!loading && credits !== null && credits > 0 && credits <= 2 && (
            <div style={{
              marginTop: 20, padding: '14px 20px',
              background: '#fffbeb', border: '1.5px solid #fde68a',
              borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
                Il vous reste seulement <strong>{credits} crédit{credits > 1 ? 's' : ''}</strong>. Pensez à recharger bientôt.
              </p>
            </div>
          )}
        </div>

        {/* ── Grille des packs ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          {CREDIT_PACKS.map(pack => {
            const isPopular = pack.badge !== null
            return (
              <div key={pack.id} style={{
                background: 'white',
                border: isPopular ? `2px solid ${pack.color}` : '1.5px solid #f3f4f6',
                borderRadius: 18, padding: '28px 24px',
                position: 'relative', overflow: 'hidden',
                boxShadow: isPopular ? `0 8px 32px ${pack.color}22` : '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${pack.color}20` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = isPopular ? `0 8px 32px ${pack.color}22` : '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                {/* Badge */}
                {pack.badge && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    background: pack.color, color: 'white',
                    fontSize: 10, fontWeight: 700, padding: '3px 10px',
                    borderRadius: 20, letterSpacing: '0.3px',
                  }}>{pack.badge}</div>
                )}

                {/* Nom */}
                <div style={{
                  fontSize: 12, fontWeight: 700, color: pack.color,
                  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8,
                }}>{pack.name}</div>

                {/* Prix */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: '#0f0a1e', letterSpacing: '-1px' }}>
                    {pack.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>€</span>
                </div>

                {/* Crédits */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: pack.bgColor, borderRadius: 20,
                  padding: '5px 12px', marginBottom: 16,
                }}>
                  <span style={{ fontSize: 16 }}>⚡</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: pack.color }}>
                    {pack.credits} crédits
                  </span>
                </div>

                {/* Prix/crédit */}
                <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 20 }}>
                  {pack.priceUnit.toFixed(2)} € / crédit
                </p>

                {/* Description */}
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 20, lineHeight: 1.5 }}>
                  {pack.description}
                </p>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {pack.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
                      <span style={{ color: pack.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => navigate('/checkout', { state: { pack } })}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10,
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
                    background: isPopular ? pack.color : 'transparent',
                    color: isPopular ? 'white' : pack.color,
                    border: isPopular ? 'none' : `1.5px solid ${pack.color}`,
                    boxShadow: isPopular ? `0 4px 16px ${pack.color}40` : 'none',
                  }}
                  onMouseEnter={e => { if (!isPopular) { e.currentTarget.style.background = pack.bgColor } }}
                  onMouseLeave={e => { if (!isPopular) { e.currentTarget.style.background = 'transparent' } }}
                >
                  Choisir ce pack
                </button>
              </div>
            )
          })}
        </div>

        {/* ── FAQ rapide ── */}
        <div style={{
          background: 'white', border: '1.5px solid #f3f4f6',
          borderRadius: 16, padding: '28px 32px',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f0a1e', marginBottom: 20 }}>Questions fréquentes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 40px' }}>
            {[
              ['Qu\'est-ce qu\'un crédit ?',         'Un crédit = 1 génération complète de site vitrine avec IA.'],
              ['Les crédits expirent-ils ?',          'Non, vos crédits sont valables à vie, sans date d\'expiration.'],
              ['Peut-on acheter plusieurs packs ?',   'Oui, les crédits s\'accumulent. Achetez autant de packs que vous souhaitez.'],
              ['Le paiement est-il sécurisé ?',       'La démo utilise une simulation. En production, Stripe sécurise chaque transaction.'],
            ].map(([q, a]) => (
              <div key={q}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{q}</p>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}