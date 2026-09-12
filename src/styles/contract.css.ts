import { createThemeContract } from '@vanilla-extract/css'

/**
 * 상세 디자인이 정해지면 값이 바뀌는 것들을 모았다. 이름만 여기서 정하고
 * 값은 `theme.css.ts`에서 넣는다. 컴포넌트는 이 계약만 참조한다.
 *
 * 미디어 쿼리 조건에는 CSS 변수를 쓸 수 없다. 화면 폭 기준은 계약이 아니라
 * `breakpoints.ts`의 상수를 쓴다.
 */
export const vars = createThemeContract({
  color: {
    surface: {
      base: null,
      raised: null,
      sunken: null,
    },
    text: {
      primary: null,
      secondary: null,
      tertiary: null,
      inverse: null,
    },
    border: {
      subtle: null,
      default: null,
      strong: null,
    },
    action: {
      solid: null,
      solidText: null,
      disabled: null,
    },
    focus: null,

    /** 검증 판정. 색은 U-03에서 정한다. */
    verdict: {
      supported: null,
      refuted: null,
      unverified: null,
    },

    /** 미디어 조작 네 단계. 색과 아이콘은 U-04에서 정한다. */
    manipulation: {
      suspected: null,
      noClearSigns: null,
      inconclusive: null,
      unavailable: null,
    },

    /** 주장 카드의 처리 상태. 검증 판정과 다른 축이다. */
    claimStatus: {
      pending: null,
      verifying: null,
      done: null,
      failed: null,
      timedOut: null,
    },
  },

  font: {
    family: {
      sans: null,
      mono: null,
    },
    size: {
      xs: null,
      sm: null,
      md: null,
      lg: null,
      xl: null,
      xxl: null,
    },
    weight: {
      regular: null,
      medium: null,
      bold: null,
    },
    lineHeight: {
      tight: null,
      normal: null,
      relaxed: null,
    },
    letterSpacing: {
      tight: null,
      normal: null,
    },
  },

  space: {
    none: null,
    xxs: null,
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    xxl: null,
  },

  radius: {
    none: null,
    sm: null,
    md: null,
    full: null,
  },

  /** 색을 지워도 읽히게 하려면 두께로도 구분할 수 있어야 한다. */
  borderWidth: {
    thin: null,
    thick: null,
  },

  shadow: {
    none: null,
    raised: null,
  },

  motion: {
    duration: {
      fast: null,
      base: null,
    },
    easing: {
      standard: null,
    },
  },

  layout: {
    contentMax: null,
    sidebarWidth: null,
    minTouchTarget: null,
  },
})
