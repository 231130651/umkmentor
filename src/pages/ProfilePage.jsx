import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  onAuthStateChanged, signOut, updateProfile,
  updatePassword, reauthenticateWithCredential,
  EmailAuthProvider, sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../firebase'
import '../css/auth.css'
import '../css/style.css'
import '../css/profile.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editName, setEditName] = useState('')
  const [saveState, setSaveState] = useState('idle')

  const [showPwd, setShowPwd] = useState(false)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdState, setPwdState] = useState('idle')
  const [pwdError, setPwdError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { navigate('/login'); return }
      setUser(u)
      setEditName(u.displayName || '')
      setLoading(false)
    })
    return () => unsub()
  }, [navigate])

  const isGoogleUser = user?.providerData?.some(p => p.providerId === 'google.com')

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editName.trim()) return
    setSaveState('loading')
    try {
      await updateProfile(auth.currentUser, { displayName: editName })
      setUser({ ...auth.currentUser, displayName: editName })
      setSaveState('success')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('idle')
    }
  }

  const handleSendReset = async () => {
    setPwdError('')
    setPwdState('loading')
    try {
      await sendPasswordResetEmail(auth, user.email)
      setPwdState('sent')
      setTimeout(() => setPwdState('idle'), 4000)
    } catch {
      setPwdState('idle')
      setPwdError('Gagal mengirim email. Coba lagi.')
    }
  }

  const handleChangePwd = async (e) => {
    e.preventDefault()
    setPwdError('')
    if (newPwd !== confirmPwd) { setPwdError('Password baru tidak cocok.'); return }
    if (newPwd.length < 6) { setPwdError('Password minimal 6 karakter.'); return }
    setPwdState('loading')
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPwd)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPwd)
      setPwdState('success')
      setOldPwd(''); setNewPwd(''); setConfirmPwd('')
      setTimeout(() => { setPwdState('idle'); setShowPwd(false) }, 2000)
    } catch (err) {
      setPwdState('idle')
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPwdError('Password lama salah.')
      } else {
        setPwdError('Gagal mengubah password. Coba lagi.')
      }
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D', color: '#F9F9F7' }}>
      Memuat...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', color: '#F9F9F7', fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Navbar */}
      <header>
        <nav>
          <Link to="/" className="nav-logo">
            <span className="logo-dot"></span>
            UMKMentor
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textDecoration: 'none' }}>Beranda</Link>
            <button onClick={handleLogout} className="nav-cta-outline">
              Keluar
            </button>
          </div>
        </nav>
      </header>

      <main className="profile-main">

        {/* Avatar Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.photoURL
              ? <img src={user.photoURL} alt="avatar" />
              : '👤'}
          </div>
          <div>
            <h1 className="profile-name">{user.displayName || 'Pengguna'}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        {/* 2 Column Grid */}
        <div className="profile-grid">

          {/* LEFT COL */}
          <div className="profile-col">

            {/* Edit Profil */}
            <div className="profile-card">
              <h2 className="profile-card-title">Edit Profil</h2>
              <form onSubmit={handleSave}>
                <div className="profile-field">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Nama kamu"
                  />
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="profile-input-disabled"
                  />
                  <p className="profile-field-note">Email tidak dapat diubah</p>
                </div>
                <button
                  type="submit"
                  className={`submit-btn${saveState === 'success' ? ' btn-save-success' : ''}`}
                  disabled={saveState === 'loading'}
                >
                  {saveState === 'idle' ? 'Simpan Perubahan' : saveState === 'loading' ? 'Menyimpan...' : '✓ Tersimpan!'}
                </button>
              </form>
            </div>

            {/* Ubah Password */}
            <div className="profile-card">
              <div
                className="pwd-toggle"
                onClick={() => { setShowPwd(!showPwd); setPwdError(''); setPwdState('idle') }}
              >
                <h2 className="pwd-toggle-title">Ubah Password</h2>
                <span className={`pwd-arrow${showPwd ? ' open' : ''}`}>▾</span>
              </div>

              {showPwd && (
                <div className="pwd-body">
                  {isGoogleUser ? (
                    <div>
                      <div className="pwd-info-box">
                        Link reset password akan dikirim ke <span>{user.email}</span>
                      </div>
                      {pwdError && <p className="pwd-error">{pwdError}</p>}
                      <button
                        onClick={handleSendReset}
                        disabled={pwdState === 'loading' || pwdState === 'sent'}
                        className={`btn-reset${pwdState === 'sent' ? ' sent' : ''}`}
                      >
                        {pwdState === 'idle' ? 'Kirim Link Reset Password' : pwdState === 'loading' ? 'Mengirim...' : '✓ Email Terkirim!'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleChangePwd}>
                      {[
                        { label: 'Password Lama', val: oldPwd, set: setOldPwd },
                        { label: 'Password Baru', val: newPwd, set: setNewPwd },
                        { label: 'Konfirmasi Password Baru', val: confirmPwd, set: setConfirmPwd },
                      ].map(({ label, val, set }, i) => (
                        <div className="profile-field" key={i}>
                          <label>{label}</label>
                          <input
                            type="password"
                            value={val}
                            onChange={e => set(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                      ))}
                      {pwdError && <p className="pwd-error">{pwdError}</p>}
                      <button
                        type="submit"
                        disabled={pwdState === 'loading'}
                        className={`btn-change-pwd${pwdState === 'success' ? ' success' : ''}`}
                      >
                        {pwdState === 'idle' ? 'Ubah Password' : pwdState === 'loading' ? 'Memproses...' : '✓ Password Diubah!'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COL */}
          <div className="profile-col">

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card accent">
                <div className="stat-val">12</div>
                <div className="stat-label">Analisis Produk</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">5</div>
                <div className="stat-label">Laporan Disimpan</div>
              </div>
              <div className="stat-card">
                <div className="stat-val">3</div>
                <div className="stat-label">Platform Dibandingkan</div>
              </div>
            </div>

            {/* Paket */}
            <div className="paket-card">
              <div>
                <div className="paket-name">Paket Gratis</div>
                <div className="paket-desc">Member sejak April 2025</div>
              </div>
              <div className="paket-quota">
                <div className="quota-val">6 / 10 analisis</div>
                <div className="quota-bar">
                  <div className="quota-fill"></div>
                </div>
              </div>
            </div>

            {/* Riwayat */}
            <div className="profile-card">
              <h2 className="profile-card-title">Riwayat Analisis</h2>
              <div className="riwayat-list">
                <div className="riwayat-item">
                  <div>
                    <div className="riwayat-name">Keripik Singkong Pedas</div>
                    <div className="riwayat-sub">Analisis Produk · 2 hari lalu</div>
                  </div>
                  <span className="riwayat-badge badge-green">Potensial</span>
                </div>
                <div className="riwayat-item">
                  <div>
                    <div className="riwayat-name">Baju Batik Modern</div>
                    <div className="riwayat-sub">Komparasi Platform · 5 hari lalu</div>
                  </div>
                  <span className="riwayat-badge badge-amber">Kompetitif</span>
                </div>
                <div className="riwayat-item">
                  <div>
                    <div className="riwayat-name">Minuman Herbal Sachet</div>
                    <div className="riwayat-sub">Sentimen Ulasan · 1 minggu lalu</div>
                  </div>
                  <span className="riwayat-badge badge-blue">Dianalisis</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
