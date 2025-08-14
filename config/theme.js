// src/config/theme.js

// Main theme configuration for the admin dashboard
export const theme = {
  // Color palette
  palette: {
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      main: '#8b5cf6',
      dark: '#6d28d9',
      light: '#a78bfa',
      contrastText: '#ffffff'
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      main: '#06b6d4',
      dark: '#0369a1',
      light: '#38bdf8',
      contrastText: '#ffffff'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      main: '#22c55e',
      dark: '#15803d',
      light: '#4ade80',
      contrastText: '#ffffff'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      main: '#f59e0b',
      dark: '#b45309',
      light: '#fbbf24',
      contrastText: '#ffffff'
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      main: '#ef4444',
      dark: '#b91c1c',
      light: '#f87171',
      contrastText: '#ffffff'
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      main: '#3b82f6',
      dark: '#1d4ed8',
      light: '#60a5fa',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      elevated: '#ffffff',
      disabled: '#f1f5f9'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#94a3b8',
      hint: '#cbd5e1'
    },
    divider: '#e2e8f0',
    border: {
      light: '#e2e8f0',
      main: '#cbd5e1',
      dark: '#94a3b8'
    }
  },

  // Typography system
  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem'   // 60px
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },

  // Spacing system
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    7: '1.75rem',   // 28px
    8: '2rem',      // 32px
    9: '2.25rem',   // 36px
    10: '2.5rem',   // 40px
    11: '2.75rem',  // 44px
    12: '3rem',     // 48px
    14: '3.5rem',   // 56px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    28: '7rem',     // 112px
    32: '8rem',     // 128px
    36: '9rem',     // 144px
    40: '10rem',    // 160px
    44: '11rem',    // 176px
    48: '12rem',    // 192px
    52: '13rem',    // 208px
    56: '14rem',    // 224px
    60: '15rem',    // 240px
    64: '16rem',    // 256px
    72: '18rem',    // 288px
    80: '20rem',    // 320px
    96: '24rem'     // 384px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    default: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none'
  },

  // Z-index scale
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Animation durations
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },

  // Animation timing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // Component specific styles
  components: {
    button: {
      borderRadius: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      padding: {
        sm: '0.5rem 0.75rem',
        md: '0.625rem 1rem',
        lg: '0.75rem 1.5rem'
      }
    },
    card: {
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0'
    },
    input: {
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '0.875rem',
      padding: '0.625rem 0.75rem'
    },
    modal: {
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      backdropBlur: 'blur(8px)'
    }
  },

  // Status colors
  status: {
    published: {
      bg: '#dcfce7',
      text: '#166534',
      border: '#bbf7d0'
    },
    draft: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fde68a'
    },
    archived: {
      bg: '#f1f5f9',
      text: '#475569',
      border: '#e2e8f0'
    },
    processing: {
      bg: '#dbeafe',
      text: '#1e40af',
      border: '#bfdbfe'
    },
    failed: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fecaca'
    },
    active: {
      bg: '#dcfce7',
      text: '#166534',
      border: '#bbf7d0'
    },
    inactive: {
      bg: '#f1f5f9',
      text: '#475569',
      border: '#e2e8f0'
    },
    healthy: {
      bg: '#dcfce7',
      text: '#166534',
      border: '#bbf7d0'
    },
    degraded: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fde68a'
    },
    unhealthy: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fecaca'
    }
  },

  // Chart theme
  chart: {
    colors: [
      '#8b5cf6', // Purple
      '#06b6d4', // Cyan
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#6366f1', // Indigo
      '#84cc16', // Lime
      '#f97316', // Orange
      '#ec4899', // Pink
      '#14b8a6'  // Teal
    ],
    grid: {
      stroke: '#e2e8f0',
      strokeWidth: 1
    },
    axis: {
      stroke: '#94a3b8',
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif'
    },
    tooltip: {
      backgroundColor: '#1f2937',
      border: 'none',
      borderRadius: '0.5rem',
      color: '#ffffff'
    }
  }
};

// Utility functions for theme usage
export const getStatusColor = (status) => {
  return theme.status[status] || theme.status.inactive;
};

export const getChartColor = (index) => {
  return theme.chart.colors[index % theme.chart.colors.length];
};

export const getPaletteColor = (color, shade = 500) => {
  return theme.palette[color]?.[shade] || theme.palette.primary[shade];
};

// CSS custom properties for global use
export const cssVariables = {
  '--color-primary': theme.palette.primary.main,
  '--color-secondary': theme.palette.secondary.main,
  '--color-success': theme.palette.success.main,
  '--color-warning': theme.palette.warning.main,
  '--color-error': theme.palette.error.main,
  '--color-info': theme.palette.info.main,
  '--color-background': theme.palette.background.default,
  '--color-surface': theme.palette.background.paper,
  '--color-text-primary': theme.palette.text.primary,
  '--color-text-secondary': theme.palette.text.secondary,
  '--color-border': theme.palette.border.main,
  '--font-family-sans': theme.typography.fontFamily.sans.join(', '),
  '--font-family-mono': theme.typography.fontFamily.mono.join(', '),
  '--border-radius': theme.borderRadius.default,
  '--shadow-sm': theme.boxShadow.sm,
  '--shadow-md': theme.boxShadow.md,
  '--shadow-lg': theme.boxShadow.lg
};

// Dark mode theme (for future use)
export const darkTheme = {
  ...theme,
  palette: {
    ...theme.palette,
    background: {
      default: '#0f172a',
      paper: '#1e293b',
      elevated: '#334155',
      disabled: '#475569'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      disabled: '#64748b',
      hint: '#475569'
    },
    divider: '#334155',
    border: {
      light: '#334155',
      main: '#475569',
      dark: '#64748b'
    }
  }
};

export default theme;