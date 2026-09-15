import { createGlobalTheme } from '@vanilla-extract/css'

import { vars } from './contract.css'
import { brand, gray, signal } from './palette'

/**
 * 판정과 미디어 조작 단계의 색이다. 축마다 계열이 다르다. 주장 판정은
 * 초록·빨강, 미디어 조작은 주황·먹색을 쓴다. 판정하지 않은 상태는 양쪽 다
 * 회색이다. 노랑을 쓰지 않는다. 중간 단계로 읽혀 우리가 하지 않은 판단을
 * 한 것처럼 보인다.
 */
createGlobalTheme(':root', vars, {
  color: {
    surface: {
      base: gray[0],
      raised: gray[0],
      sunken: gray[25],
      band: gray[100],
    },
    brand: {
      ink: brand.ink,
      cream: brand.cream,
      beak: brand.beak,
      deep: brand.deep,
    },
    text: {
      primary: gray[900],
      secondary: gray[800],
      muted: gray[700],
      tertiary: gray[650],
      faint: gray[600],
      disabled: gray[550],
      inverse: gray[0],
    },
    border: {
      faint: gray[350],
      subtle: gray[200],
      muted: gray[250],
      default: gray[400],
      medium: gray[500],
      dashed: gray[450],
      strong: gray[900],
    },
    action: {
      solid: gray[900],
      solidText: gray[0],
      disabled: gray[550],
    },
    focus: gray[900],
    skeleton: gray[300],

    verdict: {
      supported: signal.supported,
      refuted: signal.refuted,
      // 판정하지 않은 상태다. 색을 주면 판정한 것처럼 읽힌다.
      unverified: gray[650],
    },

    manipulation: {
      suspected: signal.suspected,
      // 초록을 쓰지 않는다. 문구가 일부러 단정을 피했는데 색이 뒤집는다.
      noClearSigns: gray[800],
      inconclusive: gray[650],
      unavailable: gray[550],
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
      xxs: '0.625rem',
      xs: '0.71875rem',
      sm: '0.78125rem',
      md: '0.8125rem',
      lg: '0.875rem',
      xl: '0.9375rem',
      xxl: '1rem',
      xxxl: '1.1875rem',
      hero: '2.25rem',
      heroLg: '3.5rem',
    },
    weight: {
      regular: '400',
      medium: '500',
      bold: '600',
    },
    lineHeight: {
      tight: '1.3',
      normal: '1.55',
      relaxed: '1.65',
    },
    letterSpacing: {
      tightest: '-0.04em',
      tighter: '-0.03em',
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
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem',
  },

  /** 참새 시안의 값이다. 칩과 입력이 `sm`, 카드와 안내가 `md`를 쓴다. */
  radius: {
    none: '0',
    sm: '0.5rem',
    md: '0.75rem',
    full: '9999px',
  },

  borderWidth: {
    thin: '1px',
    medium: '1.5px',
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
    formMax: '42.5rem',
    sidebarWidth: '22.5rem',
    minTouchTarget: '2.75rem',
    controlHeight: '3.25rem',
  },
})
