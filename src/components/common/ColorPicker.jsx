import { Check } from 'lucide-react';

export const ColorPicker = ({
  value,
  onChange,
  colors,
  label,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onChange(color.name)}
            className={`
              relative w-12 h-12 rounded-lg border-2 transition-all
              ${value === color.name 
                ? 'border-primary scale-110 shadow-lg' 
                : 'border-light-border dark:border-dark-border hover:scale-105'
              }
            `}
            style={{ backgroundColor: color.value }}
            title={color.label || color.name}
          >
            {value === color.name && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            )}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red">{error}</p>
      )}
    </div>
  );
};

