import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Database, Tag, ChevronRight, FileWarning, SearchX } from 'lucide-react';
import type { SearchResponse } from '../types';

interface SearchResultsProps {
  results: SearchResponse | null;
  loading: boolean;
  error: string | null;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SkeletonCard() {
  return (
    <div className="result-card skeleton-card">
      <div className="skeleton-line wide" />
      <div className="skeleton-line narrow" />
      <div className="skeleton-line medium" />
    </div>
  );
}

export default function SearchResults({ results, loading, error }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="results-wrapper">
        <div className="results-header">
          <div className="skeleton-line medium" style={{ height: 20, borderRadius: 6 }} />
        </div>
        <div className="results-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="results-empty"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <FileWarning size={40} className="empty-icon" />
        <p className="empty-title">Hata Oluştu</p>
        <p className="empty-sub">{error}</p>
      </motion.div>
    );
  }

  if (!results) return null;

  const items = results.results ?? [];

  if (items.length === 0) {
    return (
      <motion.div
        className="results-empty"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <SearchX size={40} className="empty-icon" />
        <p className="empty-title">Sonuç Bulunamadı</p>
        <p className="empty-sub">Farklı bir sorgu ya da alan deneyin</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="results-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="results-header">
        <Database size={16} className="results-header-icon" />
        <span className="results-count">{items.length} kayıt bulundu</span>
      </div>

      <div className="results-grid">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="result-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div className="result-card-header">
              <div className="result-source-badge">
                <Database size={12} />
                <span>{item.source || 'Bilinmiyor'}</span>
              </div>
              <ChevronRight size={14} className="result-arrow" />
            </div>

            {item.categories && (
              <div className="result-categories">
                <Tag size={11} className="result-tag-icon" />
                <span>{item.categories}</span>
              </div>
            )}

            <div className="result-fields">
              {Object.entries(item)
                .filter(([k]) => k !== 'source' && k !== 'categories')
                .map(([key, val]) => (
                  <div key={key} className="result-field-row">
                    <span className="result-field-key">{key}</span>
                    <span className="result-field-val">{String(val)}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
