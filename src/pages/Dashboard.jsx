// ═══════════════════════════════════════════════════════════
// DASHBOARD — Style Wix AI : blanc, épuré, Inter
// src/pages/Dashboard.jsx
// ═══════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { deleteDoc, doc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db }      from '../firebase'
import { useAuth } from '../contexts/AuthContext'

const SECTOR_ICONS = {
  'Coiffure & beauté': '💇‍♀️', 'Restaurant & café': '🍽️',
  'Médecin & santé': '🏥', 'Artisan & réparation': '🔧',
  'Commerce & épicerie': '🛒', 'Autre': '🎯',
}

function formatDate(ts) {
  if (!ts) return '—'
  const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function SiteCard({ site, onDelete, onView, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]           = useState(false)
  const [hovered, setHovered]             = useState(false)

  const accent = site.palette?.primary   || '#7c3aed'
  const darkBg = site.palette?.secondary || '#0f0a1e'

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(site.id)
    setDeleting(false)
  }

  // Nettoyer les badges (supprimer doublons "hero-hero-b" → "hero-b")
  const cleanVariant = (v) => {
    if (!v) return v
    const parts = v.split('-')
    // Détecter pattern "section-section-variant" et le simplifier
    if (parts.length >= 3 && parts[0] === parts[1]) {
      return parts.slice(1).join('-')
    }
    return v
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        border: `1.5px solid ${hovered ? accent + '40' : '#f3f4f6'}`,
        borderRadius: '16px', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.2s',
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.08)` : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Miniature */}
      <div style={{
        height: '120px', background: darkBg,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 30% 50%, ${accent}30 0%, transparent 70%)`,
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '32px', marginBottom: '4px' }}>{SECTOR_ICONS[site.secteur] || '🎯'}</div>
          <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: accent }}>
            {site.secteur}
          </div>
        </div>
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          borderRadius: '100px', padding: '3px 8px',
          fontSize: '10px', color: 'rgba(255,255,255,0.8)',
        }}>
          {site.langue === 'Français' ? '🇫🇷' : site.langue === 'Arabe' ? '🇹🇳' : site.langue === 'Anglais' ? '🇬🇧' : '🗣️'}
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: '16px', flex: 1 }}>
        <h3 style={{
          fontSize: '14px', fontWeight: '700', color: '#111827',
          margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{site.nom}</h3>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 10px' }}>
          {formatDate(site.createdAt)}
        </p>

        {/* Badges layout — nettoyés */}
        {site.layout && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {Object.values(site.layout).slice(0, 4).map((v, i) => {
              const clean = cleanVariant(v)
              return (
                <span key={i} style={{
                  fontSize: '10px', padding: '2px 8px',
                  background: '#f5f3ff', color: '#7c3aed',
                  borderRadius: '100px', fontWeight: '500',
                  border: '1px solid #ede9fe',
                }}>{clean}</span>
              )
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        padding: '12px 16px', borderTop: '1.5px solid #f9fafb',
        display: 'flex', gap: '8px',
      }}>
        <button onClick={() => onView(site)} style={{
          flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
          background: accent, color: 'white',
          fontSize: '12px', fontWeight: '600', cursor: 'pointer',
          fontFamily: 'inherit',
        }}>Aperçu</button>
        <button onClick={() => onEdit(site)} style={{
          flex: 1, padding: '8px', borderRadius: '8px',
          border: '1.5px solid #e5e7eb', background: 'white',
          color: '#374151', fontSize: '12px', fontWeight: '600',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Recréer</button>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} style={{
            padding: '8px 12px', borderRadius: '8px',
            border: '1.5px solid #fee2e2', background: '#fef2f2',
            color: '#ef4444', fontSize: '12px', cursor: 'pointer',
          }}>🗑</button>
        ) : (
          <button onClick={handleDelete} disabled={deleting} style={{
            padding: '8px 10px', borderRadius: '8px',
            background: '#ef4444', color: 'white', border: 'none',
            fontSize: '11px', fontWeight: '700', cursor: 'pointer',
          }}>{deleting ? '...' : '✓'}</button>
        )}
      </div>
    </div>
  )
}

function PreviewModal({ site, onClose }) {
  if (!site) return null
  const accent = site.palette?.primary || '#7c3aed'
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        width: '100%', maxWidth: '1100px', height: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1.5px solid #f3f4f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{SECTOR_ICONS[site.secteur] || '🎯'}</span>
            <div>
              <p style={{ fontWeight: '700', color: '#111827', margin: 0, fontSize: '15px' }}>{site.nom}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{site.secteur} · {formatDate(site.createdAt)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a href={`data:text/html;charset=utf-8,${encodeURIComponent(site.htmlSnapshot || '')}`}
              download={`${site.nom.replace(/\s+/g, '-')}.html`} style={{
                padding: '8px 16px', background: '#10b981', color: 'white',
                borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                textDecoration: 'none',
              }}>⬇ Télécharger</a>
            <button onClick={onClose} style={{
              background: 'none', border: '1.5px solid #e5e7eb',
              borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
              color: '#6b7280', fontSize: '13px',
            }}>✕ Fermer</button>
          </div>
        </div>
        <div style={{ flex: 1, background: '#f9fafb', padding: '12px' }}>
          <iframe srcDoc={site.htmlSnapshot || '<p style="padding:2rem;color:#888">Aperçu non disponible</p>'}
            title={site.nom} sandbox="allow-scripts allow-same-origin"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px', background: 'white' }} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sites, setSites]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [previewSite, setPreviewSite]   = useState(null)
  const [searchTerm, setSearchTerm]     = useState('')
  const [filterSector, setFilterSector] = useState('Tous')
  const [error, setError]               = useState(null)
  const [retryCount, setRetryCount]     = useState(0)

  useEffect(() => {
    if (!user) return
    const fetchSites = async () => {
      setLoading(true); setError(null)
      try {
        const q = query(collection(db, 'sites'), where('userId', '==', user.uid))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        data.sort((a, b) => {
          const ta = a.createdAt?.toDate?.() || new Date(0)
          const tb = b.createdAt?.toDate?.() || new Date(0)
          return tb - ta
        })
        setSites(data)
      } catch (err) {
        setError(err.code === 'permission-denied' ? 'permission' : 'network')
      } finally { setLoading(false) }
    }
    fetchSites()
  }, [user, retryCount])

  const handleDelete = async (siteId) => {
    try { await deleteDoc(doc(db, 'sites', siteId)); setSites(p => p.filter(s => s.id !== siteId)) }
    catch (err) { console.error(err) }
  }

  const handleEdit = (site) => {
    sessionStorage.setItem('sitegen_prefill', JSON.stringify({
      nom: site.nom, secteur: site.secteur, services: site.services || '',
      telephone: site.telephone || '', email: site.email || '',
      adresse: site.adresse || '', langue: site.langue || 'Français',
    }))
    navigate('/generate')
  }

  const sectors = ['Tous', ...new Set(sites.map(s => s.secteur).filter(Boolean))]
  const filtered = sites.filter(s => {
    const matchSearch = s.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || s.secteur?.toLowerCase().includes(searchTerm.toLowerCase())
    return (filterSector === 'Tous' || s.secteur === filterSector) && matchSearch
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px', height: '32px', border: '2.5px solid #ede9fe',
          borderTopColor: '#7c3aed', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', margin: '0 auto 12px',
        }} />
        <p style={{ color: '#9ca3af', fontSize: '13px' }}>Chargement...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) }}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '40px', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Bibliothèque
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f0a1e', letterSpacing: '-1px', margin: 0 }}>
            Mes sites
            <span style={{
              marginLeft: '10px', fontSize: '14px', fontWeight: '600',
              background: '#f5f3ff', color: '#7c3aed',
              padding: '2px 10px', borderRadius: '100px',
              verticalAlign: 'middle',
            }}>{sites.length}</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
            Bonjour {user?.displayName?.split(' ')[0] || 'vous'} 👋
          </p>
        </div>
        <button onClick={() => navigate('/generate')} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: '#7c3aed', color: 'white', border: 'none',
          borderRadius: '10px', padding: '10px 20px',
          fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
        }}>
          <span>✦</span> Nouveau site
        </button>
      </div>

      {/* Erreur */}
      {error === 'permission' && (
        <div style={{
          marginBottom: '24px', padding: '16px 20px',
          background: '#fffbeb', border: '1.5px solid #fde68a',
          borderRadius: '12px', display: 'flex', gap: '12px',
        }}>
          <span style={{ fontSize: '18px' }}>🔒</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', color: '#92400e', margin: '0 0 4px', fontSize: '13px' }}>Permissions Firestore insuffisantes</p>
            <p style={{ color: '#b45309', fontSize: '12px', margin: '0 0 8px' }}>Publiez les règles de sécurité dans la console Firebase.</p>
            <button onClick={() => setRetryCount(c => c + 1)} style={{
              background: '#f59e0b', color: 'white', border: 'none',
              borderRadius: '6px', padding: '6px 12px', fontSize: '12px',
              fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
            }}>↺ Réessayer</button>
          </div>
        </div>
      )}

      {/* État vide */}
      {sites.length === 0 && !error && (
        <div style={{
          textAlign: 'center', padding: '80px 40px',
          background: 'white', borderRadius: '20px',
          border: '1.5px solid #f3f4f6',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
            Aucun site pour l'instant
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '28px', maxWidth: '320px', margin: '0 auto 28px' }}>
            Créez votre premier site vitrine en quelques minutes grâce à l'IA.
          </p>
          <button onClick={() => navigate('/generate')} style={{
            background: '#7c3aed', color: 'white', border: 'none',
            borderRadius: '10px', padding: '12px 28px',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
          }}>✦ Créer mon premier site</button>
        </div>
      )}

      {/* Filtres + grille */}
      {sites.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px',
              }}>🔍</span>
              <input type="text" placeholder="Rechercher un site..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  paddingLeft: '36px', paddingRight: '16px',
                  height: '40px', background: 'white',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                  color: '#111827',
                }} />
            </div>
            <select value={filterSector} onChange={e => setFilterSector(e.target.value)} style={{
              padding: '0 16px', height: '40px',
              background: 'white', border: '1.5px solid #e5e7eb',
              borderRadius: '10px', fontSize: '13px', color: '#374151',
              outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px',
              background: 'white', borderRadius: '16px', border: '1.5px solid #f3f4f6',
            }}>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Aucun résultat pour cette recherche.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}>
              {filtered.map(site => (
                <SiteCard key={site.id} site={site}
                  onDelete={handleDelete} onView={setPreviewSite} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </>
      )}

      {previewSite && <PreviewModal site={previewSite} onClose={() => setPreviewSite(null)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg) }}`}</style>
    </div>
  )
}