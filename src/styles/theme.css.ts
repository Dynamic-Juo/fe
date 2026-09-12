import { createGlobalTheme } from '@vanilla-extract/css'

import { vars } from './contract.css'
import { gray } from './palette'

/**
 * 판정과 미디어 조작 단계의 색은 아직 정해지지 않았다. 지금은 모두 같은
 * 회색이며, 화면에서는 문구와 테두리 두께로 구분한다. 색이 정해지면 이
 * 파일의 값만 바꾼다.
 */
createGlobalTheme(':root', vars, {
  color: {
    surface: {
      base: gray[0],
      raised: gray[0],
      sunken: gray[100],
    },
    text: {
      primary: gray[900],
      secondary: gray[600],
      tertiary: gray[500],
      inverse: gray[0],
    },
    border: {
      subtle: gray[200],
      default: gray[300],
      strong: gray[900],
    },
    action: {
      solid: gray[900],
      solidText: gray[0],
      disabled: gray[400],
    },
    focus: gray[900],

    verdict: {
      supported: gray[700],
      refuted: gray[700],
      unverified: gray[700],
    },

    manipulation: {
      suspected: gray[700],
      noClearSigns: gray[700],
      inconclusive: gray[600],
      unavailable: gray[500],
    },

    claimStatus: {
      pending: gray[500],
      verifying: gray[600],
      done: gray[700],
      failed: gray[700],
      timedOut: gray[700],
    },
  },

  font: {
    family: {
      sans: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
    },
    size: {
      xs: '0.6875rem',
      sm: '0.75rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.1875rem',
      xxl: '1.5rem',
    },
    weight: {
      regular: '400',
      medium: '500',
      bold: '600',
    },
    lineHeight: {
      tight: '1.3',
      normal: '1.55',
      relaxed: '1.7',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
    },
  },

  space: {
    none: '0',
    xxs: '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '2rem',
    xxl: '3rem',
  },

  radius: {
    none: '0',
    sm: '2px',
    md: '4px',
    full: '9999px',
  },

  borderWidth: {
    thin: '1px',
    thick: '2px',
  },

  shadow: {
    none: 'none',
    raised: 'none',
  },

  motion: {
    duration: {
      fast: '120ms',
      base: '200ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0.2, 1)',
    },
  },

  layout: {
    contentMax: '45rem',
    sidebarWidth: '22.5rem',
    minTouchTarget: '2.75rem',
  },
})
