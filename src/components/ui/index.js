export { default as Button } from './Button';
export { default as Modal } from './Modal';
export { default as Alert } from './Alert';
// src/components/ui/index.js
import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X, Loader } from 'lucide-react';

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        
        <div className={`inline-block w-full ${sizes[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}>
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-6">
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          {children}
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
  const types = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600'
    }
  };
  
  const config = types[type];
  const Icon = config.icon;
  
  return (
    <div className={`border rounded-lg p-4 ${config.bg} ${className}`}>
      <div className="flex">
        <Icon className={`w-5 h-5 ${config.iconColor} mr-3 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-medium ${config.text} mb-1`}>{title}</h4>
          )}
          <div className={config.text}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 ${config.iconColor} hover:opacity-70`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  
  return (
    <Loader className={`animate-spin ${sizes[size]} ${className}`} />
  );
};

// Progress Bar
export const ProgressBar = ({ 
  value, 
  max = 100, 
  color = 'purple',
  showLabel = false,
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// Tooltip Component
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = React.useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap ${positions[position]}`}>
          {content}
        </div>
      )}
    </div>
  );
};

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

// Export all components
export default {
  Button,
  Card,
  Modal,
  Alert,
  LoadingSpinner,
  ProgressBar,
  Badge,
  Tooltip,
  EmptyState,
  Toggle,
  SearchInput
};