import { createTheme, ThemeOptions } from '@mui/material/styles';

// Definir a paleta de cores profissional do ACES POKER
const pokerColors = {
  primary: {
    50: '#fef7f0',
    100: '#fdedd3',
    200: '#fcd9a6',
    300: '#fbbf6e',
    400: '#f59e0b',
    500: '#d97706',
    600: '#b45309',
    700: '#92400e',
    800: '#78350f',
    900: '#7c2d12',
    main: '#7c2d12',
    light: '#a16207',
    dark: '#451a03',
  },
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    main: '#374151',
    light: '#4b5563',
    dark: '#1f2937',
  },
  accent: {
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
    light: '#fbbf24',
    dark: '#d97706',
  },
  status: {
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0ea5e9',
  },
  background: {
    default: '#0f0f0f',
    paper: '#1e1e1e',
    light: '#1a1a1a',
    surface: '#2a2a2a',
  },
  text: {
    primary: '#ffffff',
    secondary: '#d1d5db',
    muted: '#9ca3af',
    disabled: '#6b7280',
  },
  border: {
    main: '#333333',
    light: '#404040',
  },
};

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: pokerColors.primary.main,
      light: pokerColors.primary.light,
      dark: pokerColors.primary.dark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: pokerColors.secondary.main,
      light: pokerColors.secondary.light,
      dark: pokerColors.secondary.dark,
      contrastText: '#ffffff',
    },
    error: {
      main: pokerColors.status.error,
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    warning: {
      main: pokerColors.status.warning,
      light: '#f59e0b',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    info: {
      main: pokerColors.status.info,
      light: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    success: {
      main: pokerColors.status.success,
      light: '#10b981',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    background: {
      default: pokerColors.background.default,
      paper: pokerColors.background.paper,
    },
    text: {
      primary: pokerColors.text.primary,
      secondary: pokerColors.text.secondary,
      disabled: pokerColors.text.disabled,
    },
    divider: pokerColors.border.main,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
    '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
    '0 24px 48px rgba(0, 0, 0, 0.35), 0 18px 15px rgba(0, 0, 0, 0.22)',
    '0 30px 60px rgba(0, 0, 0, 0.40), 0 23px 18px rgba(0, 0, 0, 0.22)',
    '0 36px 72px rgba(0, 0, 0, 0.45), 0 27px 22px rgba(0, 0, 0, 0.22)',
    '0 42px 84px rgba(0, 0, 0, 0.50), 0 32px 25px rgba(0, 0, 0, 0.22)',
    '0 48px 96px rgba(0, 0, 0, 0.55), 0 36px 28px rgba(0, 0, 0, 0.22)',
    '0 54px 108px rgba(0, 0, 0, 0.60), 0 41px 32px rgba(0, 0, 0, 0.22)',
    '0 60px 120px rgba(0, 0, 0, 0.65), 0 45px 35px rgba(0, 0, 0, 0.22)',
    '0 66px 132px rgba(0, 0, 0, 0.70), 0 50px 38px rgba(0, 0, 0, 0.22)',
    '0 72px 144px rgba(0, 0, 0, 0.75), 0 54px 42px rgba(0, 0, 0, 0.22)',
    '0 78px 156px rgba(0, 0, 0, 0.80), 0 59px 45px rgba(0, 0, 0, 0.22)',
    '0 84px 168px rgba(0, 0, 0, 0.85), 0 63px 48px rgba(0, 0, 0, 0.22)',
    '0 90px 180px rgba(0, 0, 0, 0.90), 0 68px 52px rgba(0, 0, 0, 0.22)',
    '0 96px 192px rgba(0, 0, 0, 0.95), 0 72px 55px rgba(0, 0, 0, 0.22)',
    '0 102px 204px rgba(0, 0, 0, 1.00), 0 77px 58px rgba(0, 0, 0, 0.22)',
    '0 108px 216px rgba(0, 0, 0, 1.00), 0 81px 62px rgba(0, 0, 0, 0.22)',
    '0 114px 228px rgba(0, 0, 0, 1.00), 0 86px 65px rgba(0, 0, 0, 0.22)',
    '0 120px 240px rgba(0, 0, 0, 1.00), 0 90px 68px rgba(0, 0, 0, 0.22)',
    '0 126px 252px rgba(0, 0, 0, 1.00), 0 95px 72px rgba(0, 0, 0, 0.22)',
    '0 132px 264px rgba(0, 0, 0, 1.00), 0 99px 75px rgba(0, 0, 0, 0.22)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${pokerColors.primary.main} 0%, ${pokerColors.primary.light} 100%)`,
          boxShadow: '0 4px 14px 0 rgba(124, 45, 18, 0.3)',
          '&:hover': {
            background: `linear-gradient(135deg, ${pokerColors.primary.light} 0%, ${pokerColors.accent.main} 100%)`,
            boxShadow: '0 8px 25px 0 rgba(124, 45, 18, 0.4)',
          },
        },
        outlined: {
          borderColor: pokerColors.border.main,
          color: pokerColors.text.primary,
          '&:hover': {
            borderColor: pokerColors.accent.main,
            backgroundColor: `${pokerColors.accent.main}20`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: pokerColors.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${pokerColors.border.main}`,
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${pokerColors.accent.main}20`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: pokerColors.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${pokerColors.border.main}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: pokerColors.background.surface,
            borderRadius: 8,
            '& fieldset': {
              borderColor: pokerColors.border.main,
            },
            '&:hover fieldset': {
              borderColor: pokerColors.accent.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: pokerColors.accent.main,
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: pokerColors.text.secondary,
            '&.Mui-focused': {
              color: pokerColors.accent.main,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: pokerColors.background.paper,
          backgroundImage: 'none',
          borderBottom: `1px solid ${pokerColors.border.main}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: pokerColors.background.paper,
          backgroundImage: 'none',
          border: 'none',
          borderRight: `1px solid ${pokerColors.border.main}`,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: `${pokerColors.accent.main}15`,
          },
          '&.Mui-selected': {
            backgroundColor: `${pokerColors.accent.main}25`,
            borderLeft: `3px solid ${pokerColors.accent.main}`,
            '&:hover': {
              backgroundColor: `${pokerColors.accent.main}35`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
        filled: {
          background: `linear-gradient(135deg, ${pokerColors.accent.main} 0%, ${pokerColors.accent.light} 100%)`,
          color: pokerColors.secondary.dark,
        },
        outlined: {
          borderColor: pokerColors.accent.main,
          color: pokerColors.accent.main,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${pokerColors.border.main}`,
          color: pokerColors.text.primary,
        },
        head: {
          backgroundColor: pokerColors.background.surface,
          fontWeight: 600,
          color: pokerColors.text.primary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: `${pokerColors.accent.main}10`,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: pokerColors.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${pokerColors.border.main}`,
          borderRadius: 16,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        },
      },
    },
  },
};

export const pokerTheme = createTheme(themeOptions);

// Extensão do tema para cores customizadas
declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      accent: {
        main: string;
        light: string;
        dark: string;
      };
      poker: {
        felt: string;
        chips: {
          red: string;
          blue: string;
          green: string;
          black: string;
          white: string;
          gold: string;
        };
      };
      glass: {
        background: string;
        border: string;
        shadow: string;
      };
    };
  }

  interface ThemeOptions {
    customColors?: {
      accent?: {
        main?: string;
        light?: string;
        dark?: string;
      };
      poker?: {
        felt?: string;
        chips?: {
          red?: string;
          blue?: string;
          green?: string;
          black?: string;
          white?: string;
          gold?: string;
        };
      };
      glass?: {
        background?: string;
        border?: string;
        shadow?: string;
      };
    };
  }
}

// Adicionando cores customizadas ao tema
pokerTheme.customColors = {
  accent: {
    main: pokerColors.accent.main,
    light: pokerColors.accent.light,
    dark: pokerColors.accent.dark,
  },
  poker: {
    felt: '#1b5e20',
    chips: {
      red: '#c62828',
      blue: '#1565c0',
      green: '#2e7d32',
      black: '#212121',
      white: '#fafafa',
      gold: pokerColors.accent.main,
    },
  },
  glass: {
    background: 'rgba(30, 30, 30, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export default pokerTheme;
