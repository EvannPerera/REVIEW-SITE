import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Globe } from 'lucide-react';
import { COUNTRIES, Country } from '../data/countries';

interface CountrySelectProps {
  value: string; // Country code (e.g., 'US', 'LK')
  onChange: (country: Country) => void;
  required?: boolean;
  error?: string | null;
  id?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  required = true,
  error = null,
  id = 'country-select',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedCountry = COUNTRIES.find(
    (c) => c.code.toUpperCase() === value.toUpperCase()
  );

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFocusedIndex(-1);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0 && filteredCountries[focusedIndex]) {
      e.preventDefault();
      handleSelect(filteredCountries[focusedIndex]);
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      const item = items[focusedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const handleSelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
      onKeyDown={handleKeyDown}
    >
      <label
        htmlFor={id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '0.45rem',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-tech)',
          color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
        }}
      >
        <Globe size={14} color="var(--red-accent)" />
        <span>Country {required && <strong style={{ color: 'var(--red-accent)' }}>*</strong>}</span>
      </label>

      {/* Main Trigger Button */}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-label="Select Country"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderRadius: '8px',
          backgroundColor: 'var(--input-bg)',
          border: error
            ? '1px solid var(--red-accent)'
            : isOpen
            ? '1px solid var(--red-accent)'
            : '1px solid var(--input-border)',
          color: selectedCountry ? 'var(--input-text)' : 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'all 200ms ease',
          textAlign: 'left',
          boxShadow: isOpen
            ? '0 0 15px var(--red-glow)'
            : error
            ? '0 0 0 2px rgba(220, 38, 38, 0.2)'
            : 'none',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          {selectedCountry ? (
            <>
              <span style={{ fontSize: '1.25rem' }}>{selectedCountry.flag}</span>
              <span style={{ fontWeight: 500 }}>{selectedCountry.name}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-tech)',
                  color: 'var(--text-muted)',
                  marginLeft: '4px',
                }}
              >
                ({selectedCountry.code})
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              Select your country...
            </span>
          )}
        </span>
        <ChevronDown
          size={18}
          color="var(--text-muted)"
          style={{
            transition: 'transform 200ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: 'var(--bg-card-solid)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '10px',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), var(--shadow-neon)',
            maxHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-elevated)',
            }}
          >
            <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country by name or code..."
              aria-label="Filter countries"
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--input-text)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          {/* List of Countries */}
          <ul
            ref={listRef}
            style={{
              listStyle: 'none',
              margin: 0,
              padding: '4px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {filteredCountries.length === 0 ? (
              <li
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-tech)',
                }}
              >
                No countries match "{search}"
              </li>
            ) : (
              filteredCountries.map((c, index) => {
                const isSelected =
                  selectedCountry && selectedCountry.code === c.code;
                const isFocused = focusedIndex === index;

                return (
                  <li
                    key={c.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(c)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: isFocused
                        ? 'var(--bg-elevated)'
                        : isSelected
                        ? 'var(--bg-card-hover)'
                        : 'transparent',
                      color: isSelected
                        ? 'var(--red-accent)'
                        : 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      transition: 'background-color 120ms ease',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{c.flag}</span>
                      <span>{c.name}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-tech)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        ({c.code})
                      </span>
                    </span>
                    {isSelected && <Check size={16} color="var(--red-accent)" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
