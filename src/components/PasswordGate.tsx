import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldAlert, Shield } from 'lucide-react';

interface PasswordGateProps {
  onSuccess: () => void;
}

const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? 'redbreach2024';

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [value, setValue] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === CORRECT_PASSWORD) {
      sessionStorage.setItem('rb_auth', '1');
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="gate-wrapper">
      <div className="gate-bg-grid" />
      <div className="gate-glow top-left" />
      <div className="gate-glow bottom-right" />

      <motion.div
        className="gate-card"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { opacity: 1, scale: 1, y: 0 }}
        transition={shake ? { duration: 0.5 } : { duration: 0.5, ease: 'easeOut' }}
      >
        <div className="gate-icon-wrapper">
          <motion.div
            className="gate-icon"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shield size={36} />
          </motion.div>
        </div>

        <h1 className="gate-title">RedBreach</h1>
        <p className="gate-subtitle">Güvenli Erişim Gerekli</p>

        <form onSubmit={handleSubmit} className="gate-form">
          <div className="gate-input-wrapper">
            <Lock size={16} className="gate-input-icon" />
            <input
              id="password-input"
              type={showPw ? 'text' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`gate-input ${error ? 'gate-input-error' : ''}`}
              placeholder="Erişim şifresini girin"
              autoComplete="current-password"
              autoFocus
            />
            <button
              type="button"
              className="gate-toggle-pw"
              onClick={() => setShowPw((v) => !v)}
              aria-label="Şifreyi göster/gizle"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="gate-error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <ShieldAlert size={14} />
                <span>Geçersiz şifre</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="gate-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Lock size={15} />
            Erişimi Doğrula
          </motion.button>
        </form>

        <p className="gate-footer">Bu sisteme yalnızca yetkili kullanıcılar erişebilir.</p>
      </motion.div>
    </div>
  );
}
