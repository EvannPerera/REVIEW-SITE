import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        border: isDark
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid rgba(0, 0, 0, 0.12)',
        color: isDark ? '#F59E0B' : '#6366F1',
        cursor: 'pointer',
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        outline: 'none',
        flexShrink: 0,
        boxShadow: isDark
          ? '0 0 14px rgba(245, 158, 11, 0.2)'
          : '0 0 14px rgba(99, 102, 241, 0.2)',
      }}
      className="theme-toggle-btn"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.borderColor = 'var(--red-accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = isDark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease',
          transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        {isDark ? (
          <Sun size={iconSize} color="#FFD166" style={{ filter: 'drop-shadow(0 0 4px #FFD166)' }} />
        ) : (
          <Moon size={iconSize} color="#4F46E5" style={{ filter: 'drop-shadow(0 0 4px rgba(79, 70, 229, 0.4))' }} />
        )}
      </div>
      <span className="sr-only" style={{ display: 'none' }}>
        {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
      </span>
    </button>
  );
};
