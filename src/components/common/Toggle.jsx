export const Toggle = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className="
          w-11 h-6 bg-light-border dark:bg-dark-border
          peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary
          rounded-full peer peer-checked:after:translate-x-full
          peer-checked:after:border-white after:content-[''] after:absolute
          after:top-[2px] after:left-[2px] after:bg-white after:rounded-full
          after:h-5 after:w-5 after:transition-all
          peer-checked:bg-primary
          disabled:opacity-50 disabled:cursor-not-allowed
        "></div>
        {label && (
          <span className="ml-3 text-sm font-medium text-light-text dark:text-dark-text">
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

