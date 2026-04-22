import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import '../css/auth.css'

function getStrength(val) {
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  return score
}

const strengthColors = ['#ef4444', '#f97316', '#eab308', '#4ade80']
const strengthLabels = ['Terlalu lemah', 'Lemah', 'Cukup kuat', 'Kuat!']

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [terms, setTerms] = useState(false)

  const [nameErr, setNameErr] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [passErr, setPassErr] = useState('')
  const [confirmPassErr, setConfirmPassErr] = useState('')
  const [termsErr, setTermsErr] = useState(false)
  const [btnState, setBtnState] = useState('idle')

  const strength = password.length > 0 ? getStrength(password) : 0
  const strengthColor = strength > 0 ? strengthColors[strength - 1] : null
  const strengthLabel = strength > 0 ? strengthLabels[strength - 1] : 'Terlalu lemah'

  const handleRegister = async (e) => {
    e.preventDefault()
    let valid = true
    setNameErr('')
    setEmailErr('')
    setPassErr('')
    setConfirmPassErr('')
    setTermsErr(false)

    if (!name.trim()) { setNameErr('Nama tidak boleh kosong'); valid = false }
    if (!email.includes('@')) { setEmailErr('Email tidak valid'); valid = false }
    if (password.length < 8) { setPassErr('Password minimal 8 karakter'); valid = false }
    if (confirmPassword !== password) { setConfirmPassErr('Password tidak cocok'); valid = false }
    if (!terms) { setTermsErr(true); valid = false }
    if (!valid) return

    setBtnState('loading')
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      setBtnState('success')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setBtnState('idle')
      if (err.code === 'auth/email-already-in-use') {
        setEmailErr('Email sudah terdaftar')
      } else if (err.code === 'auth/weak-password') {
        setPassErr('Password terlalu lemah')
      } else {
        setPassErr('Terjadi kesalahan, coba lagi')
      }
    }
  }

  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) {
      setPassErr('Daftar dengan Google gagal, coba lagi')
    }
  }

  return (
    <main className="auth-layout">
      <aside className="left-panel" aria-label="Informasi UMKMentor">
        <div className="left-bg" aria-hidden="true"></div>
        <div className="left-grid" aria-hidden="true"></div>
        <div className="left-content">
          <header className="brand">
            <Link to="/" className="brand-link">
              <span className="brand-dot" aria-hidden="true"></span>
              <span className="brand-name">UMKMentor</span>
            </Link>
          </header>
          <h1 className="left-headline">
            Mulai Jualan<br />
            dengan <span className="accent">Data,</span><br />
            Bukan Feeling.
          </h1>
          <p className="left-desc">
            Platform AI yang membantu calon seller UMKM mengambil keputusan bisnis berbasis data — bukan tebak-tebakan.
          </p>
          <ul className="stats-row" aria-label="Statistik UMKM">
            <li className="stat-item"><strong className="stat-num">80%+</strong><span className="stat-label">UMKM gagal tahun ke-3</span></li>
            <li className="stat-item"><strong className="stat-num">74%</strong><span className="stat-label">Tidak riset pasar</span></li>
            <li className="stat-item"><strong className="stat-num">AI</strong><span className="stat-label">Solusi UMKMentor</span></li>
          </ul>
        </div>
        <footer className="left-footer">
          <figure className="testimonial">
            <blockquote className="testimonial-text">"Sebelum pakai UMKMentor, saya pilih produk asal-asalan dan rugi jutaan. Sekarang saya bisa lihat data dulu sebelum keluar modal."</blockquote>
            <figcaption className="testimonial-author">
              <span className="author-avatar" aria-hidden="true">👩</span>
              <div><strong className="author-name">Sari Dewi</strong><span className="author-title">Seller Skincare, Shopee</span></div>
            </figcaption>
          </figure>
        </footer>
      </aside>

      <section className="right-panel" aria-label="Form pendaftaran">
        <div className="auth-card">
          <h2 className="form-title">Daftar akun baru ✨</h2>
          <p className="form-subtitle">Mulai perjalanan bisnismu bersama UMKMentor</p>

          <form className="auth-form" noValidate onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label" htmlFor="regName">Nama Lengkap</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true"><User size={15} /></span>
                <input type="text" className={`form-input${nameErr ? ' error' : ''}`} id="regName" placeholder="Masukkan nama lengkap" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              {nameErr && <p className="error-msg" role="alert">{nameErr}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">Email</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true"><Mail size={15} /></span>
                <input type="email" className={`form-input${emailErr ? ' error' : ''}`} id="regEmail" placeholder="nama@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              {emailErr && <p className="error-msg" role="alert">{emailErr}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regPassword">Password</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true"><Lock size={15} /></span>
                <input type={showPass ? 'text' : 'password'} className={`form-input${passErr ? ' error' : ''}`} id="regPassword" placeholder="Minimal 8 karakter" autoComplete="new-password" maxLength={64} value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="input-toggle" aria-label="Tampilkan password" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="password-strength" aria-live="polite">
                  <div className="strength-bars" aria-hidden="true">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="strength-bar" style={{ background: i <= strength ? strengthColor : 'var(--border, #E5E7EB)' }}></div>
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColor || undefined }}>{strengthLabel}</span>
                </div>
              )}
              {passErr && <p className="error-msg" role="alert">{passErr}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regConfirmPassword">Konfirmasi Password</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true"><Lock size={15} /></span>
                <input type={showConfirmPass ? 'text' : 'password'} className={`form-input${confirmPassErr ? ' error' : ''}`} id="regConfirmPassword" placeholder="Konfirmasi password" autoComplete="new-password" maxLength={64} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button type="button" className="input-toggle" aria-label="Tampilkan konfirmasi password" onClick={() => setShowConfirmPass(s => !s)}>
                  {showConfirmPass ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
              {confirmPassErr && <p className="error-msg" role="alert">{confirmPassErr}</p>}
            </div>

            <div className="checkbox-group">
              <input type="checkbox" className="custom-checkbox" id="termsCheck" checked={terms} onChange={e => setTerms(e.target.checked)} />
              <label className="checkbox-label" htmlFor="termsCheck">
                Saya setuju dengan <a href="#">Syarat &amp; Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> UMKMentor
              </label>
            </div>
            {termsErr && <p className="error-msg" role="alert" style={{marginTop: '-8px', marginBottom: '8px'}}>Kamu harus menyetujui syarat & ketentuan</p>}

            <button type="submit" className={`submit-btn${btnState === 'loading' ? ' loading' : ''}`} style={btnState === 'success' ? { background: '#16a34a' } : {}}>
              {btnState === 'idle' ? 'Daftar Akun' : btnState === 'loading' ? 'Membuat akun...' : '✓ Akun berhasil dibuat!'}
            </button>
          </form>

          <div className="divider" aria-hidden="true">
            <hr className="divider-line" /><span className="divider-text">atau</span><hr className="divider-line" />
          </div>

          <button type="button" className="google-btn" onClick={handleGoogleRegister}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="" aria-hidden="true" />
            Daftar dengan Google
          </button>

          <p className="terms-text">Sudah punya akun? <Link to="/login">Masuk</Link></p>
        </div>
      </section>
    </main>
  )
}