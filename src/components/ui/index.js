import React from 'react';
import { X, Loader2, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Button Component
export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  open,
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) => {
  const modalOpen = isOpen !== undefined ? isOpen : open;
  if (!modalOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${sizes[size]} ${className}`}>
          {title && (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                <button onClick={onClose} className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  type = 'info', 
  title,
  children, 
  onClose,
  className = '' 
}) => {
  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-400',
      textColor: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-400',
      textColor: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-400',
      textColor: 'text-blue-800'
    }
  };
  
  const variant = variants[type];
  const Icon = variant.icon;
  
  return (
    <div className={`rounded-md p-4 ${variant.bg} ${variant.border} border ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${variant.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${variant.textColor}`}>{title}</h3>}
          <div className={`text-sm ${variant.textColor} ${title ? 'mt-2' : ''}`}>{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button onClick={onClose} className={`inline-flex rounded-md p-1.5 ${variant.textColor} hover:bg-opacity-20 focus:outline-none`}>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Card Component
export const Card = ({ children, className = '', padding = true, ...props }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${padding ? 'p-6' : ''} ${className}`} {...props}>
    {children}
  </div>
);

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-purple-600 ${sizes[size]} ${className}`} />;
};

// Progress Bar
export const ProgressBar = ({ value = 0, max = 100, showLabel = true, color = 'purple', className = '' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const colors = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600', 
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };
  
  return (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-300 ${colors[color]}`} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <div className="text-sm text-gray-600 mt-1">{Math.round(percentage)}%</div>}
    </div>
  );
};

// Badge
export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// Search Input
export const SearchInput = ({ value, onChange, placeholder = "Search...", className = '', ...props }) => (
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

// Toggle
export const Toggle = ({ checked, onChange, disabled = false, size = 'md', className = '' }) => {
  const sizes = { sm: 'h-4 w-8', md: 'h-6 w-11', lg: 'h-8 w-14' };
  const thumbSizes = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-6 w-6' };
  const translateX = {
    sm: checked ? 'translate-x-4' : 'translate-x-1',
    md: checked ? 'translate-x-6' : 'translate-x-1', 
    lg: checked ? 'translate-x-8' : 'translate-x-1'
  };
  
  return (
    <button
      type="button"
      className={`relative inline-flex items-center rounded-full transition-colors ${sizes[size]} ${checked ? 'bg-purple-600' : 'bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span className={`inline-block ${thumbSizes[size]} transform rounded-full bg-white transition-transform ${translateX[size]}`} />
    </button>
  );
};

// Empty State
export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div className={`text-center py-12 ${className}`}>
    {Icon && <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>}
    {action}
  </div>
);

// Tooltip
export const Tooltip = ({ children, content, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  return (
    <div className={`relative inline-block ${className}`} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded whitespace-nowrap ${positions[position]}`}>
          {content}
        </div>
      )}
    </div>
  );
};