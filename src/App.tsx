import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LogOut, Activity } from 'lucide-react';
import PasswordGate from './components/PasswordGate';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import RateLimitBanner from './components/RateLimitBanner';
import { useSearch } from './hooks/useSearch';
import './index.css';

function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <motion.div
            className="header-logo"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shield size={22} />
          </motion.div>
          <span className="header-title">RedBreach</span>
          <span className="header-badge">
            <Activity size={10} />
            Live
          </span>
        </div>
        <motion.button
          className="header-logout"
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Oturumu kapat"
        >
          <LogOut size={16} />
        </motion.button>
      </div>
    </header>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const { search, results, loading, error, isRateLimited, waitSeconds, remaining, clearResults } =
    useSearch();

  useEffect(() => {
    if (sessionStorage.getItem('rb_auth') === '1') {
      setAuthed(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('rb_auth');
    setAuthed(false);
    clearResults();
  };

  return (
    <AnimatePresence mode="wait">
      {!authed ? (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4 }}
        >
          <PasswordGate onSuccess={() => setAuthed(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          className="app-root"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Header onLogout={handleLogout} />

          <main className="app-main">
            <div className="app-hero">
              <motion.h2
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Veri İhlali Arama
              </motion.h2>
              <motion.p
                className="hero-sub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                E-posta, kullanıcı adı, IP ve daha fazlasını sorgulayın
              </motion.p>
            </div>

            <RateLimitBanner visible={isRateLimited} waitSeconds={waitSeconds} />

            <SearchBar
              onSearch={search}
              loading={loading}
              isRateLimited={isRateLimited}
              remaining={remaining}
            />

            <SearchResults results={results} loading={loading} error={error} />
          </main>

          <footer className="app-footer">
            <span>RedBreach — Yalnızca yetkili kullanım için</span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
