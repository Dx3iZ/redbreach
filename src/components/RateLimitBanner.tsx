import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Hourglass } from 'lucide-react';

interface RateLimitBannerProps {
  waitSeconds: number;
  visible: boolean;
}

export default function RateLimitBanner({ waitSeconds, visible }: RateLimitBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="rl-banner"
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.35 }}
        >
          <div className="rl-icon-wrap">
            <Hourglass size={18} className="rl-icon" />
          </div>
          <div className="rl-text">
            <span className="rl-label">Lütfen bekleyin</span>
            <span className="rl-sub">Arama limiti korunuyor</span>
          </div>
          <div className="rl-timer">
            <Clock size={14} className="rl-clock" />
            <span className="rl-seconds">{waitSeconds}s</span>
          </div>
          <div className="rl-progress-track">
            <motion.div
              className="rl-progress-bar"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: waitSeconds, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
