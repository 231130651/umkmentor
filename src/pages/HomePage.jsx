import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import '../css/style.css'
import sariDewi from '../assets/sari-dewi.jpg';
import budiSantoso from '../assets/budi-santoso.jpg';
import rinaHalim from '../assets/rina-halim.jpg';


const previews = {
  potensi: {
    title: 'Potensi Produk',
    subtitle: 'Skincare — Serum Vitamin C',
    metrics: [
      { label: 'Volume pasar/bulan', value: '12.400 unit', cls: 'good' },
      { label: 'Tingkat kompetisi', value: 'Sedang', cls: 'warn' },
      { label: 'Tren 3 bulan terakhir', value: '↑ Naik 23%', cls: 'good' },
      { label: 'Rata-rata harga jual', value: 'Rp 52.000', cls: '' },
    ],
    insight: 'Produk ini punya potensi bagus! Permintaan sedang naik dan kompetisi masih bisa ditembus. Fokus ke diferensiasi packaging dan konten edukasi untuk memenangkan pasar.',
  },
  harga: {
    title: 'Simulasi Harga & Komisi',
    subtitle: 'Harga jual: Rp 55.000',
    metrics: [
      { label: 'Harga jual', value: 'Rp 55.000', cls: '' },
      { label: 'Komisi Shopee (6.5%)', value: '- Rp 3.575', cls: 'bad' },
      { label: 'Biaya pengemasan', value: '- Rp 3.000', cls: 'bad' },
      { label: 'HPP produk', value: '- Rp 20.000', cls: 'bad' },
      { label: 'Keuntungan bersih', value: 'Rp 28.425 (52%)', cls: 'good' },
    ],
    insight: 'Margin 52% sangat sehat! Kamu masih bisa kasih diskon 10% dan tetap untung.',
  },
  kompetitor: {
    title: 'Insight Kompetitor',
    subtitle: 'Top seller kategori ini',
    metrics: [
      { label: 'Toko A', value: 'Rp 45rb · 8.200 terjual', cls: '' },
      { label: 'Toko B', value: 'Rp 62rb · 4.100 terjual', cls: '' },
      { label: 'Toko C', value: 'Rp 38rb · 12.000 terjual', cls: '' },
      { label: 'Rata-rata harga', value: 'Rp 48.000', cls: '' },
    ],
    insight: 'Toko C dominan dengan harga murah. Fokus ke kualitas dan branding — bukan perang harga.',
  },
  sentimen: {
    title: 'Analisis Sentimen Review',
    subtitle: 'Dari 3.200 review teks',
    isSentimen: true,
    metrics: [
      { label: 'Pujian terbanyak', value: 'Produknya sesuai', cls: 'good' },
      { label: 'Keluhan terbanyak', value: 'Pengiriman lama', cls: 'bad' },
    ],
    insight: 'Review positif dominan soal khasiat. Keluhan soal logistik — bukan produknya. Ini peluang!',
  },
  platform: {
    title: 'Rekomendasi Platform',
    subtitle: 'Untuk kategori Skincare',
    metrics: [
      { label: '🛍️ Shopee', value: '⭐ Terbaik — Komisi 6.5%', cls: 'good' },
      { label: '🟢 Tokopedia', value: 'Bagus — Komisi 5.5%', cls: 'warn' },
      { label: '🎵 TikTok Shop', value: 'Potential — Komisi 8%', cls: '' },
      { label: 'Traffic Shopee/bulan', value: '92 juta pengunjung', cls: '' },
    ],
    insight: 'Mulai di Shopee — traffic paling tinggi untuk skincare. Setelah stabil, ekspansi ke TikTok Shop.',
  },
}

const featureItems = [
  { key: 'potensi', icon: '📊', title: 'Analisis Potensi Produk', desc: 'Tau seberapa laku produkmu di pasaran sebelum keluar modal.' },
  { key: 'harga', icon: '💰', title: 'Simulasi Harga & Komisi', desc: 'Hitung keuntungan setelah dipotong komisi platform secara otomatis.' },
  { key: 'kompetitor', icon: '🔍', title: 'Insight Kompetitor', desc: 'Lihat siapa yang jual produk serupa dan strategi harga mereka.' },
  { key: 'sentimen', icon: '💬', title: 'Analisis Sentimen Review', desc: 'Bukan dari rating bintang — tapi dari isi teks review yang sebenarnya.' },
  { key: 'platform', icon: '🏪', title: 'Rekomendasi Platform', desc: 'Shopee, Tokopedia, atau TikTok Shop — mana yang paling cocok untuk produkmu?' },
]

function FeaturePreview({ data }) {
  const [activeTab, setActiveTab] = useState('overview')
  return (
    <article className="preview-card" aria-live="polite">
      <nav className="tab-nav" aria-label="Tab preview fitur">
        {['overview', 'detail', 'saran'].map(tab => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? 'Overview' : tab === 'detail' ? 'Detail' : 'Saran AI'}
          </button>
        ))}
      </nav>
      <header>
        <div className="preview-title">{data.title}</div>
        <div className="preview-subtitle">{data.subtitle}</div>
      </header>
      {data.isSentimen && (
        <>
          <div className="sentiment-bar">
            <div className="sent-pos"></div>
            <div className="sent-neu"></div>
            <div className="sent-neg"></div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--green)' }}>● 70% Positif</span>
            <span style={{ color: 'var(--accent2)' }}>● 20% Netral</span>
            <span style={{ color: '#EF4444' }}>● 10% Negatif</span>
          </div>
        </>
      )}
      <dl className="metrics-list">
        {data.metrics.map((m, i) => (
          <div className="metric-row" key={i}>
            <dt className="metric-label">{m.label}</dt>
            <dd className={`metric-value${m.cls ? ' ' + m.cls : ''}`}>{m.value}</dd>
          </div>
        ))}
      </dl>
      <aside className="insight-box">
        <p className="insight-title">💡 Insight AI</p>
        <p className="insight-text">{data.insight}</p>
      </aside>
    </article>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState('potensi')
  const [platforms, setPlatforms] = useState({ shopee: false, tokopedia: true, tiktok: false })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])
  const [analysisState, setAnalysisState] = useState('idle') // idle | loading | done
  const [formData, setFormData] = useState({ produk: '', modal: '', harga: '', target: '', deskripsi: '' })
  const [resultData, setResultData] = useState(null)

  const togglePlatform = (key) => setPlatforms(p => ({ ...p, [key]: !p[key] }))

  const runAnalysis = () => {
    if (!formData.produk) { alert('Pilih kategori produk dulu ya!'); return }
    setAnalysisState('loading')
    setTimeout(() => {
      const hargaOpt = formData.harga
        ? `Rp ${parseInt(formData.harga.replace(/\D/g, '')).toLocaleString('id')}`
        : 'Rp 45rb – 75rb'
      const kategoriLabel = {
        skincare: 'Skincare & Kecantikan', fashion: 'Fashion & Pakaian',
        'makanan-minuman': 'Makanan & Minuman', elektronik: 'Elektronik & Aksesoris HP',
        'rumah-dapur': 'Rumah & Dapur', 'ibu-bayi': 'Ibu & Bayi', 'olahraga-hobi': 'Olahraga & Hobi'
      }[formData.produk] || formData.produk
      setResultData({ hargaOpt, kategoriLabel })
      setAnalysisState('done')
    }, 2000)
  }

  return (
    <>
      <header className="home-header">
        <nav>
          <Link to="/" className="nav-logo">
            <span className="logo-dot" aria-hidden="true"></span>
            UMKMentor
          </Link>
          <ul className={`nav-links${navOpen ? ' open' : ''}`}>
            <li><a href="#cara-kerja">Cara Kerja</a></li>
            <li><a href="#fitur">Fitur</a></li>
            <li><a href="#konsultasi">Konsultasi</a></li>
            <li><a href="#pakar">Pakar</a></li>
            {user ? (
              <>
                <li>
                  <Link to="/profile" className="nav-cta-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user.photoURL ? <img src={user.photoURL} alt="" width="20" height="20" style={{ borderRadius: '50%' }} /> : '👤'}
                    {user.displayName?.split(' ')[0] || 'Profil'}
                  </Link>
                </li>
                <li>
                  <button className="nav-cta" onClick={() => signOut(auth)} style={{ background: 'none', border: '1.5px solid rgba(255,255,255,0.08)', color: '#F9F9F7', padding: '10px 22px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="nav-cta-outline">Masuk</Link></li>
                <li><Link to="/register" className="nav-cta">Daftar</Link></li>
              </>
            )}
          </ul>
          <button
            className={`nav-hamburger${navOpen ? ' open' : ''}`}
            aria-label="Menu"
            onClick={() => setNavOpen(o => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true"></div>
          <div className="hero-grid" aria-hidden="true"></div>
          <div className="hero-content">
            <div className="hero-left">
              <p className="hero-badge fade-up">
                <span aria-hidden="true">🟢</span> AI-Powered · Berbasis Data Real
              </p>
              <h1 id="hero-title" className="hero-title fade-up fade-up-2">
                Mulai Jualan<br />dengan <span className="accent">Strategi</span><br />yang Tepat
              </h1>
              <p className="hero-desc fade-up fade-up-3">
                Riset pasar, analisis kompetitor, dan rekomendasi platform — semua dalam hitungan detik. Tanpa harus bayar konsultan mahal.
              </p>
              <div className="hero-actions fade-up fade-up-4">
                <a href="#analisis" className="btn-primary">Analisis Produkku</a>
                <a href="#konsultasi" className="btn-secondary">Tanya Pakar</a>
              </div>
              <ul className="hero-stats fade-up fade-up-4" aria-label="Statistik platform">
                <li className="stat">
                  <strong className="stat-num">50rb+</strong>
                  <span className="stat-label">Data produk dianalisis</span>
                </li>
                <li className="stat">
                  <strong className="stat-num">3</strong>
                  <span className="stat-label">Platform e-commerce</span>
                </li>
                <li className="stat">
                  <strong className="stat-num">92%</strong>
                  <span className="stat-label">Akurasi rekomendasi</span>
                </li>
              </ul>
            </div>

            <figure className="hero-visual fade-up fade-up-3" aria-label="Contoh hasil analisis produk">
              <article className="hero-card-main">
                <header className="card-header-row">
                  <h2 className="card-title-sm">Analisis Produk — Skincare</h2>
                  <span className="card-badge-green">✓ Potensial</span>
                </header>
                <ul className="analysis-list">
                  {[
                    { icon: '📈', label: 'Potensi Pasar', sub: '12.400 produk serupa terjual/bulan', pct: 82, cls: '' },
                    { icon: '💰', label: 'Harga Optimal', sub: 'Rp 45.000 – 75.000', pct: 68, cls: 'progress-fill--green' },
                    { icon: '⭐', label: 'Sentimen Review', sub: '78% positif dari 3.200 review', pct: 78, cls: 'progress-fill--gold' },
                    { icon: '🏆', label: 'Platform Terbaik', sub: 'Shopee — komisi 6.5%, traffic tinggi', pct: 91, cls: 'progress-fill--orange' },
                  ].map((item, i) => (
                    <li className="analysis-item" key={i}>
                      <span className="analysis-icon" aria-hidden="true">{item.icon}</span>
                      <div className="analysis-info">
                        <p className="analysis-label">{item.label}</p>
                        <p className="analysis-sub">{item.sub}</p>
                        <div className="progress-bar" role="meter" aria-valuenow={item.pct} aria-valuemin="0" aria-valuemax="100">
                          <div className={`progress-fill ${item.cls}`} style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
              <p className="floating-badge badge-1" aria-hidden="true">✓ Untung Rp 28rb/produk</p>
              <p className="floating-badge badge-2" aria-hidden="true">🔥 Trending kategori ini</p>
            </figure>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="cara-kerja" aria-labelledby="cara-kerja-title">
          <div className="section-inner">
            <p className="section-eyebrow">Cara Kerja</p>
            <h2 id="cara-kerja-title" className="section-title">3 langkah menuju<br />strategi yang tepat</h2>
            <ol className="steps-grid">
              {[
                { num: '01', icon: '📝', title: 'Input Produk & Budget', desc: 'Ceritain produk yang mau kamu jual, modal yang kamu punya, dan target pembeli. Cukup beberapa menit.' },
                { num: '02', icon: '🤖', title: 'AI Analisis Data', desc: 'AI kami menganalisis 50rb+ data produk, review, dan tren pasar untuk kasih insight yang akurat dan relevan.' },
                { num: '03', icon: '🚀', title: 'Terima Strategi Lengkap', desc: 'Dapatkan rekomendasi produk, harga, platform terbaik, dan insight kompetitor. Langsung bisa dieksekusi.' },
              ].map(s => (
                <li className="step-card" key={s.num}>
                  <span className="step-num" aria-hidden="true">{s.num}</span>
                  <span className="step-icon" aria-hidden="true">{s.icon}</span>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FITUR */}
        <section id="fitur" aria-labelledby="fitur-title">
          <div className="section-inner">
            <p className="section-eyebrow">Fitur Unggulan</p>
            <h2 id="fitur-title" className="section-title">Semua yang kamu butuhkan<br />untuk mulai jualan</h2>
            <div className="features-layout">
              <nav className="features-list" aria-label="Navigasi fitur">
                {featureItems.map(f => (
                  <button
                    key={f.key}
                    className={`feature-item${activeFeature === f.key ? ' active' : ''}`}
                    onClick={() => setActiveFeature(f.key)}
                  >
                    <span className="feature-icon-wrap" aria-hidden="true">{f.icon}</span>
                    <div>
                      <p className="feature-title">{f.title}</p>
                      <p className="feature-desc">{f.desc}</p>
                    </div>
                  </button>
                ))}
              </nav>
              <aside className="features-preview">
                <FeaturePreview data={previews[activeFeature]} />
              </aside>
            </div>
          </div>
        </section>

        {/* KONSULTASI */}
        <section id="konsultasi" className="section-dark" aria-labelledby="konsultasi-title">
          <div className="section-inner">
            <p className="section-eyebrow section-eyebrow--dim">Pilihan Konsultasi</p>
            <h2 id="konsultasi-title" className="section-title section-title--light">Pilih cara yang<br />paling nyaman buatmu</h2>
            <p className="section-desc section-desc--dim">Mau analisis cepat dari AI, atau butuh pendampingan lebih mendalam dari pakar? Keduanya tersedia.</p>
            <div className="konsultasi-grid">
              <article className="konsul-card konsul-ai">
                <p className="konsul-tag">🤖 Rekomendasi AI</p>
                <span className="konsul-icon" aria-hidden="true">⚡</span>
                <h3 className="konsul-title">Konsultasi AI</h3>
                <p className="konsul-desc">Analisis instan berbasis 50rb+ data produk e-commerce Indonesia. Hasil dalam hitungan detik.</p>
                <ul className="konsul-features">
                  {['Analisis potensi produk', 'Simulasi harga & komisi', 'Rekomendasi platform terbaik', 'Insight kompetitor', 'Analisis sentimen review'].map(f => <li key={f}>{f}</li>)}
                </ul>
                <a href="#analisis" className="konsul-btn">Mulai Gratis  </a>
              </article>
              <article className="konsul-card konsul-human">
                <p className="konsul-tag">👨‍💼 Pakar Bisnis</p>
                <span className="konsul-icon" aria-hidden="true">🤝</span>
                <h3 className="konsul-title">Konsultasi Pakar</h3>
                <p className="konsul-desc">Terhubung langsung dengan konsultan bisnis dan UMKM berpengalaman untuk pendampingan lebih mendalam.</p>
                <ul className="konsul-features">
                  {['Sesi 1-on-1 dengan pakar', 'Review strategi bisnis kamu', 'Mentoring berkelanjutan', 'Jaringan sesama seller', 'Garansi kepuasan'].map(f => <li key={f}>{f}</li>)}
                </ul>
                <a href="#pakar" className="konsul-btn">Lihat Pakar  </a>
              </article>
            </div>
          </div>
        </section>

        {/* FORM ANALISIS */}
        <section id="analisis" aria-labelledby="analisis-title">
          <div className="section-inner">
            <p className="section-eyebrow">Coba Sekarang</p>
            <h2 id="analisis-title" className="section-title">Analisis produkmu<br />dalam 60 detik</h2>
            <div className="form-layout">
              <div className="form-card">
                <div className="form-group">
                  <label htmlFor="input-produk">Kategori Produk</label>
                  <select id="input-produk" value={formData.produk} onChange={e => setFormData(f => ({ ...f, produk: e.target.value }))}>
                    <option value="">Pilih kategori produk...</option>
                    <option value="skincare">Skincare & Kecantikan</option>
                    <option value="fashion">Fashion & Pakaian</option>
                    <option value="makanan-minuman">Makanan & Minuman</option>
                    <option value="elektronik">Elektronik & Aksesoris HP</option>
                    <option value="rumah-dapur">Rumah & Dapur</option>
                    <option value="ibu-bayi">Ibu & Bayi</option>
                    <option value="olahraga-hobi">Olahraga & Hobi</option>
                  </select>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="input-modal">Modal Awal</label>
                    <input id="input-modal" type="text" placeholder="Rp 0" value={formData.modal} onChange={e => setFormData(f => ({ ...f, modal: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-harga">Harga Jual Target</label>
                    <input id="input-harga" type="text" placeholder="Rp 0" value={formData.harga} onChange={e => setFormData(f => ({ ...f, harga: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input-target">Target Pembeli</label>
                  <select id="input-target" value={formData.target} onChange={e => setFormData(f => ({ ...f, target: e.target.value }))}>
                    <option value="">Pilih target pembeli...</option>
                    <option value="remaja">Remaja (15-25 tahun)</option>
                    <option value="dewasa-muda">Dewasa muda (25-35 tahun)</option>
                    <option value="ibu">Ibu rumah tangga</option>
                    <option value="profesional">Profesional</option>
                    <option value="semua">Semua kalangan</option>
                  </select>
                </div>
                <fieldset className="form-group">
                  <legend>Platform yang Diminati</legend>
                  <div className="platform-options">
                    {[
                      { key: 'shopee', icon: '🛍️', label: 'Shopee' },
                      { key: 'tokopedia', icon: '🟢', label: 'Tokopedia' },
                      { key: 'tiktok', icon: '🎵', label: 'TikTok Shop' },
                    ].map(p => (
                      <label key={p.key} className={`platform-opt${platforms[p.key] ? ' selected' : ''}`} onClick={() => togglePlatform(p.key)}>
                        <input type="checkbox" name="platform" value={p.key} checked={platforms[p.key]} onChange={() => {}} className="sr-only" />
                        <span className="p-icon" aria-hidden="true">{p.icon}</span>
                        {p.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="form-group">
                  <label htmlFor="input-deskripsi">Ceritakan Produkmu <span className="label-optional">(opsional)</span></label>
                  <textarea id="input-deskripsi" placeholder="Keunggulan produk, bahan baku, dll..." value={formData.deskripsi} onChange={e => setFormData(f => ({ ...f, deskripsi: e.target.value }))}></textarea>
                </div>
                <button className="submit-btn" type="button" onClick={runAnalysis}>
                  🤖 Analisis Sekarang
                </button>
              </div>

              <aside className="result-preview">
                <article className="result-card" aria-live="polite" aria-label="Hasil analisis">
                  <header className="result-header">
                    <h3 className="result-title">Hasil Analisis</h3>
                    <span
                      className="score-badge"
                      style={analysisState === 'loading'
                        ? { background: 'rgba(201,136,42,0.1)', color: 'var(--accent2)' }
                        : analysisState === 'done'
                        ? { background: 'rgba(34,197,94,0.1)', color: 'var(--green)' }
                        : {}}
                    >
                      {analysisState === 'idle' ? 'Menunggu input...' : analysisState === 'loading' ? 'Menganalisis...' : '✓ Potensial'}
                    </span>
                  </header>
                  {analysisState === 'idle' && (
                    <div className="result-empty">
                      <span className="result-empty-icon" aria-hidden="true">📊</span>
                      <p>Isi form di sebelah kiri untuk melihat hasil analisis produkmu</p>
                    </div>
                  )}
                  {analysisState === 'loading' && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted-dark)' }}>
                      <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚙️</div>
                      <div style={{ fontSize: '14px' }}>AI sedang menganalisis data...</div>
                    </div>
                  )}
                  {analysisState === 'done' && resultData && (
                    <>
                      <div className="metric-row"><span className="metric-label">Potensi Pasar</span><span className="metric-value good">Tinggi ↑</span></div>
                      <div className="metric-row"><span className="metric-label">Harga Optimal</span><span className="metric-value">{resultData.hargaOpt}</span></div>
                      <div className="metric-row"><span className="metric-label">Margin Estimasi</span><span className="metric-value good">45–55%</span></div>
                      <div className="metric-row"><span className="metric-label">Platform Terbaik</span><span className="metric-value good">Shopee</span></div>
                      <div className="metric-row"><span className="metric-label">Tingkat Kompetisi</span><span className="metric-value warn">Sedang</span></div>
                      <div className="metric-row"><span className="metric-label">Sentimen Review</span><span className="metric-value good">78% Positif</span></div>
                      <div className="insight-box">
                        <div className="insight-title">💡 Rekomendasi AI</div>
                        <div className="insight-text">Kategori <strong>{resultData.kategoriLabel}</strong> punya potensi bagus! Fokus ke foto produk berkualitas dan deskripsi edukatif. Hindari perang harga — diferensiasi dari kualitas.</div>
                      </div>
                      <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(232,82,10,0.06)', border: '1px solid rgba(232,82,10,0.15)', borderRadius: '10px', fontSize: '13px', color: 'var(--muted-dark)' }}>
                        <strong style={{ color: 'var(--white)' }}>Butuh pendampingan lebih?</strong><br />
                        Konsultasikan strategi ini dengan pakar kami.<br />
                        <a href="#pakar" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Lihat Konsultan  </a>
                      </div>
                    </>
                  )}
                </article>
              </aside>
            </div>
          </div>
        </section>

        {/* PAKAR */}
        <section id="pakar" aria-labelledby="pakar-title">
          <div className="section-inner">
            <p className="section-eyebrow">Konsultan Pakar</p>
            <h2 id="pakar-title" className="section-title">Belajar dari yang<br />sudah berpengalaman</h2>
            <p className="section-desc">Konsultan bisnis dan pelaku UMKM berpengalaman siap membantu perjalanan jualanmu.</p>
            <ul className="experts-grid">
            {[
              { name: 'Sari Dewi', title: 'Business Strategist · 8 tahun pengalaman', tags: ['Shopee', 'Skincare', 'Branding'], rating: '4.9', sesi: '120', src: sariDewi },
              { name: 'Budi Santoso', title: 'E-commerce Specialist · 6 tahun', tags: ['Tokopedia', 'Fashion', 'Ads'], rating: '4.8', sesi: '89', src: budiSantoso },
              { name: 'Rina Halim', title: 'UMKM Mentor · 10 tahun', tags: ['F&B', 'TikTok Shop', 'Packaging'], rating: '5.0', sesi: '200', src: rinaHalim },
            ].map(e => (
              <li className="expert-card" key={e.name}>
                <img src={e.src} alt={e.name} className="expert-avatar" />
                <h3 className="expert-name">{e.name}</h3>
                <p className="expert-title">{e.title}</p>
                <ul className="expert-tags" aria-label="Spesialisasi">
                  {e.tags.map(t => <li key={t} className="expert-tag">{t}</li>)}
                </ul>
                <p className="expert-rating"><span aria-hidden="true">⭐</span> <span>{e.rating}</span> · <span>{e.sesi} sesi</span></p>
                <button className="expert-btn" type="button">Konsultasi Sekarang</button>
              </li>
            ))}
            </ul>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-center">
          <p className="footer-brand"><span className="footer-logo-dot">●</span> UMKMentor</p>
          <nav className="footer-nav">
            {[
              { label: 'Fitur', href: '#fitur' },
              { label: 'Konsultasi', href: '#konsultasi' },
              { label: 'Tentang Kami', href: '#fitur' },
            ].map(l => <a key={l.label} href={l.href}>{l.label}</a>)}
          </nav>
          <small className="footer-copy">© 2026 UMKMentor. Capstone Project.</small>
        </div>
      </footer>
    </>
  )
}
