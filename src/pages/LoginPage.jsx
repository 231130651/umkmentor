import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import '../css/auth.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [emailErr, setEmailErr] = useState('')
  const [passErr, setPassErr] = useState('')
  const [btnState, setBtnState] = useState('idle')

  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotEmailErr, setForgotEmailErr] = useState(false)
  const [forgotState, setForgotState] = useState('form')
  const dialogRef = useRef(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    let valid = true
    setEmailErr('')
    setPassErr('')

    if (!email.includes('@')) { setEmailErr('Email tidak valid'); valid = false }
    if (password.length < 6) { setPassErr('Password minimal 6 karakter'); valid = false }
    if (!valid) return

    setBtnState('loading')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setBtnState('success')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setBtnState('idle')
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPassErr('Email atau password salah')
      } else if (err.code === 'auth/too-many-requests') {
        setPassErr('Terlalu banyak percobaan, coba lagi nanti')
      } else {
        setPassErr('Terjadi kesalahan, coba lagi')
      }
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) {
      setPassErr('Login Google gagal, coba lagi')
    }
  }

  const openModal = () => {
    setForgotEmail('')
    setForgotEmailErr(false)
    setForgotState('form')
    setTimeout(() => dialogRef.current?.showModal(), 0)
  }

  const closeModal = () => {
    dialogRef.current?.close()
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotEmailErr(true)
      return
    }
    setForgotEmailErr(false)
    setForgotState('loading')
    try {
      await sendPasswordResetEmail(auth, forgotEmail)
    } catch (err) {}
    setForgotState('success')
  }

  return (
    <>
    <header className="mobile-header">   
      <Link to="/" className="brand-link">
        <span className="brand-dot" aria-hidden="true"></span>
        <span className="brand-name">UMKMentor</span>
      </Link>
    </header>
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
              <div><strong className="author-name">Suminah</strong><span className="author-title">Seller Skincare, Shopee</span></div>
            </figcaption>
          </figure>
        </footer>
      </aside>

      <section className="right-panel" aria-label="Form masuk">
        <div className="auth-card">
          <h2 className="form-title">Selamat datang! 👋</h2>
          <p className="form-subtitle">Masuk ke akun UMKMentor kamu</p>

          <form className="auth-form" noValidate onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmail">Email</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true"><Mail size={15} /></span>
                <input type="email" className={`form-input${emailErr ? ' error' : ''}`} id="loginEmail" placeholder="nama@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              {emailErr && <p className="error-msg" role="alert">{emailErr}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="loginPassword">Password</label>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true"><Lock size={15} /></span>
                <input type={showPass ? 'text' : 'password'} className={`form-input${passErr ? ' error' : ''}`} id="loginPassword" placeholder="Masukkan password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="input-toggle" aria-label="Tampilkan password" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>              
                </div>
              {passErr && <p className="error-msg" role="alert">{passErr}</p>}
            </div>

            <p className="forgot-row">
              <a href="#" className="forgot-link" onClick={e => { e.preventDefault(); openModal() }}>Lupa password?</a>
            </p>

            <button type="submit" className={`submit-btn${btnState === 'loading' ? ' loading' : ''}`} style={btnState === 'success' ? { background: '#16a34a' } : {}}>
              {btnState === 'idle' ? 'Masuk ke UMKMentor  ' : btnState === 'loading' ? 'Memverifikasi...' : '✓ Berhasil masuk!'}
            </button>
          </form>

          <div className="divider" aria-hidden="true">
            <hr className="divider-line" /><span className="divider-text">atau</span><hr className="divider-line" />
          </div>

          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="" aria-hidden="true" />
            Lanjutkan dengan Google
          </button>

          <p className="terms-text">Belum punya akun? <Link to="/register">Daftar sekarang</Link></p>
        </div>
      </section>

      <dialog ref={dialogRef} className="forgot-modal" aria-labelledby="forgotModalTitle" onClick={e => { if (e.target === dialogRef.current) closeModal() }}>
        <article className="forgot-modal-card">
          <button type="button" className="forgot-modal-close" aria-label="Tutup" onClick={closeModal}>✕</button>
          <span className="forgot-modal-icon" aria-hidden="true">🔑</span>
          <h2 className="forgot-modal-title" id="forgotModalTitle">Lupa Password?</h2>
          <p className="forgot-modal-desc">Masukkan email yang terdaftar, dan kami akan mengirimkan link untuk mengatur ulang password Anda.</p>
          {forgotState !== 'success' ? (
            <form noValidate onSubmit={handleForgot}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgotEmail">Email</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true"><Mail size={15} /></span>
                  <input type="email" className="form-input" id="forgotEmail" placeholder="nama@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                </div>
                {forgotEmailErr && <p className="error-msg" role="alert">Email tidak valid</p>}
              </div>
              <button type="submit" className={`submit-btn${forgotState === 'loading' ? ' loading' : ''}`}>
                {forgotState === 'loading' ? 'Mengirim...' : 'Kirim Link Reset  '}
              </button>
            </form>
          ) : (
            <section className="forgot-success" aria-live="polite">
              <span className="forgot-success-icon" aria-hidden="true">📬</span>
              <p className="forgot-success-text">Link reset password sudah dikirim! Cek inbox atau folder spam kamu.</p>
              <button type="button" className="submit-btn" onClick={closeModal}>Kembali ke Login</button>
            </section>
          )}
        </article>
      </dialog>
    </main>
    </>
  )
}
