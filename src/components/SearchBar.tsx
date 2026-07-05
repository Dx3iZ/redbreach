import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mail,
  User,
  KeyRound,
  Globe,
  Phone,
  Network,
  Tag,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Crosshair,
  Filter,
} from 'lucide-react';
import type { SearchField, SearchRequest } from '../types';

interface SearchBarProps {
  onSearch: (params: SearchRequest) => void;
  loading: boolean;
  isRateLimited: boolean;
  remaining: number;
}

const FIELDS: { value: SearchField; label: string; Icon: React.ElementType }[] = [
  { value: 'email', label: 'E-posta', Icon: Mail },
  { value: 'username', label: 'Kullanıcı Adı', Icon: User },
  { value: 'password', label: 'Şifre', Icon: KeyRound },
  { value: 'domain', label: 'Domain', Icon: Globe },
  { value: 'phone', label: 'Telefon', Icon: Phone },
  { value: 'ip', label: 'IP Adresi', Icon: Network },
  { value: 'name', label: 'İsim', Icon: Tag },
];

const CATEGORIES = [
  'minecraft', 'gaming', 'social', 'forum', 'dating', 'shopping',
  'streaming', 'crypto', 'finance', 'education', 'vpn', 'adult',
  'government', 'healthcare', 'tech', 'news',
];

export default function SearchBar({ onSearch, loading, isRateLimited, remaining }: SearchBarProps) {
  const [term, setTerm] = useState('');
  const [selectedFields, setSelectedFields] = useState<SearchField[]>(['email']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [wildcard, setWildcard] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const toggleField = (field: SearchField) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.length > 1 ? prev.filter((f) => f !== field) : prev
        : [...prev, field]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || loading || isRateLimited) return;
    onSearch({
      term: term.trim(),
      fields: selectedFields,
      categories: selectedCategories,
      wildcard,
      case_sensitive: caseSensitive,
    });
  };

  const disabled = loading || isRateLimited || !term.trim();

  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSubmit} className="searchbar-form">
        <div className="searchbar-main">
          <div className="searchbar-input-row">
            <Search size={18} className="searchbar-icon" />
            <input
              id="search-input"
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="searchbar-input"
              placeholder="Sorgu girin... (örn: user@domain.com veya user*)"
              disabled={isRateLimited}
              autoComplete="off"
            />
            <motion.button
              type="submit"
              className={`searchbar-btn ${disabled ? 'searchbar-btn-disabled' : ''}`}
              whileHover={disabled ? {} : { scale: 1.03 }}
              whileTap={disabled ? {} : { scale: 0.96 }}
              disabled={disabled}
            >
              {loading ? (
                <motion.div
                  className="searchbar-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <Crosshair size={16} />
                  <span>Ara</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="remaining-badge">
            <Filter size={12} />
            <span>{remaining} istek kaldı</span>
          </div>
        </div>

        <div className="searchbar-options">
          <div className="fields-row">
            <span className="options-label">Alan:</span>
            {FIELDS.map(({ value, label, Icon }) => (
              <motion.button
                key={value}
                type="button"
                className={`field-chip ${selectedFields.includes(value) ? 'field-chip-active' : ''}`}
                onClick={() => toggleField(value)}
                whileTap={{ scale: 0.93 }}
              >
                <Icon size={12} />
                {label}
              </motion.button>
            ))}
          </div>

          <div className="toggles-row">
            <button
              type="button"
              className={`toggle-btn ${wildcard ? 'toggle-active' : ''}`}
              onClick={() => setWildcard((v) => !v)}
            >
              {wildcard ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              <span>Wildcard (*)</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${caseSensitive ? 'toggle-active' : ''}`}
              onClick={() => setCaseSensitive((v) => !v)}
            >
              {caseSensitive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              <span>Büyük/Küçük Harf</span>
            </button>

            <button
              type="button"
              className={`toggle-btn ${showCategories ? 'toggle-active' : ''}`}
              onClick={() => setShowCategories((v) => !v)}
            >
              <Tag size={14} />
              <span>Kategoriler</span>
              {selectedCategories.length > 0 && (
                <span className="cat-badge">{selectedCategories.length}</span>
              )}
              <ChevronDown
                size={14}
                className={`chevron ${showCategories ? 'chevron-open' : ''}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {showCategories && (
              <motion.div
                className="categories-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="categories-grid">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat}
                      type="button"
                      className={`cat-chip ${selectedCategories.includes(cat) ? 'cat-chip-active' : ''}`}
                      onClick={() => toggleCategory(cat)}
                      whileTap={{ scale: 0.9 }}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    className="cat-clear"
                    onClick={() => setSelectedCategories([])}
                  >
                    Seçimi Temizle
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
