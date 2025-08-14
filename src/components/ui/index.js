
// ...existing component definitions...

// Empty State Component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
};

// Toggle Switch
export const Toggle = ({ 
  checked, 
  onChange, 
  disabled = false,
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'h-4 w-8',
    md: 'h-6 w-11',
    lg: 'h-8 w-14'
  };
  
  const thumbSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };
  
  const translateX = {
    sm: checked ? 'translate-x-4' : 'translate-x-1',
    md: checked ? 'translate-x-6' : 'translate-x-1',
    lg: checked ? 'translate-x-8' : 'translate-x-1'
  };
  
  return (
    <button
      type="button"
      className={`relative inline-flex items-center rounded-full transition-colors ${sizes[size]} ${
        checked ? 'bg-purple-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`inline-block ${thumbSizes[size]} transform rounded-full bg-white transition-transform ${translateX[size]}`}
      />
    </button>
  );
};

// Search Input
export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className = '',
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        {...props}
      />
    </div>
  );
};





// At the very end of the file, after all component/function definitions:

export {
  Button,
  Modal,
  Alert,
  Card,
  LoadingSpinner,
  ProgressBar,
  Badge,
  Tooltip,
  EmptyState,
  Toggle,
  SearchInput
};




