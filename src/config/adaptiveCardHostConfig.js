// Dark theme HostConfig for Adaptive Cards
// Matches the app's visual design:
// - Background: gradient #0a1628 -> #2d5a87
// - Bot bubble: rgba(255, 255, 255, 0.1)
// - Text: white (#ffffff)
// - Links: sky blue (#7dd3fc)
// - Accent: #0078d4 (Azure blue for buttons)

export const darkThemeHostConfig = {
  // Font configuration - match Segoe UI from global.css
  fontTypes: {
    default: {
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSizes: {
        small: 12,
        default: 14,
        medium: 16,
        large: 20,
        extraLarge: 24,
      },
      fontWeights: {
        lighter: 300,
        default: 400,
        bolder: 600,
      },
    },
    monospace: {
      fontFamily: "'Consolas', 'Monaco', monospace",
      fontSizes: {
        small: 12,
        default: 14,
        medium: 16,
        large: 20,
        extraLarge: 24,
      },
      fontWeights: {
        lighter: 300,
        default: 400,
        bolder: 600,
      },
    },
  },

  // Spacing to match message bubble padding
  spacing: {
    small: 4,
    default: 8,
    medium: 12,
    large: 16,
    extraLarge: 24,
    padding: 12,
  },

  // Separator styling
  separator: {
    lineThickness: 1,
    lineColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Container styles - dark theme colors
  containerStyles: {
    default: {
      backgroundColor: 'transparent',
      foregroundColors: {
        default: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        dark: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        light: {
          default: 'rgba(255, 255, 255, 0.5)',
          subtle: 'rgba(255, 255, 255, 0.3)',
        },
        accent: {
          default: '#7dd3fc',
          subtle: '#bae6fd',
        },
        good: {
          default: '#22c55e',
          subtle: '#86efac',
        },
        warning: {
          default: '#f59e0b',
          subtle: '#fcd34d',
        },
        attention: {
          default: '#ef4444',
          subtle: '#fca5a5',
        },
      },
    },
    emphasis: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      foregroundColors: {
        default: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        dark: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        light: {
          default: 'rgba(255, 255, 255, 0.5)',
          subtle: 'rgba(255, 255, 255, 0.3)',
        },
        accent: {
          default: '#7dd3fc',
          subtle: '#bae6fd',
        },
        good: {
          default: '#22c55e',
          subtle: '#86efac',
        },
        warning: {
          default: '#f59e0b',
          subtle: '#fcd34d',
        },
        attention: {
          default: '#ef4444',
          subtle: '#fca5a5',
        },
      },
    },
    accent: {
      backgroundColor: 'rgba(0, 120, 212, 0.2)',
      foregroundColors: {
        default: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        dark: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        light: {
          default: 'rgba(255, 255, 255, 0.5)',
          subtle: 'rgba(255, 255, 255, 0.3)',
        },
        accent: {
          default: '#7dd3fc',
          subtle: '#bae6fd',
        },
        good: {
          default: '#22c55e',
          subtle: '#86efac',
        },
        warning: {
          default: '#f59e0b',
          subtle: '#fcd34d',
        },
        attention: {
          default: '#ef4444',
          subtle: '#fca5a5',
        },
      },
    },
    good: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      foregroundColors: {
        default: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        accent: {
          default: '#7dd3fc',
          subtle: '#bae6fd',
        },
      },
    },
    attention: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      foregroundColors: {
        default: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        accent: {
          default: '#7dd3fc',
          subtle: '#bae6fd',
        },
      },
    },
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      foregroundColors: {
        default: {
          default: '#ffffff',
          subtle: 'rgba(255, 255, 255, 0.7)',
        },
        accent: {
          default: '#7dd3fc',
          subtle: '#bae6fd',
        },
      },
    },
  },

  // Image sizes
  imageSizes: {
    small: 40,
    medium: 80,
    large: 160,
  },

  // Actions configuration
  actions: {
    maxActions: 5,
    spacing: 'default',
    buttonSpacing: 8,
    showCard: {
      actionMode: 'inline',
      inlineTopMargin: 12,
    },
    actionsOrientation: 'horizontal',
    actionAlignment: 'stretch',
    iconPlacement: 'leftOfTitle',
    iconSize: 16,
  },

  // Enable interactivity for actions
  supportsInteractivity: true,
};
