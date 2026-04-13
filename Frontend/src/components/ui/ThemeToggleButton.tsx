import { useTheme } from '../../context/ThemeContext';

type ThemeToggleButtonProps = {
  className?: string;
  showLabel?: boolean;
};

const ThemeToggleButton = ({ className = '', showLabel = true }: ThemeToggleButtonProps) => {
  const { isDark, toggleTheme } = useTheme();

  const label = isDark ? 'Dark Mode' : 'Light Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`group inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-lowest/90 px-3 py-2 text-on-surface shadow-[0_8px_18px_rgba(40,24,14,0.15)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(40,24,14,0.2)] active:translate-y-0 ${className}`}
    >
      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-on-surface transition-colors">
        {isDark ? 'dark_mode' : 'light_mode'}
      </span>

      {showLabel && (
        <span className="hidden sm:inline text-xs font-bold tracking-wide text-on-surface-variant group-hover:text-on-surface">
          {label}
        </span>
      )}
    </button>
  );
};

export default ThemeToggleButton;
