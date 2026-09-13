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
      /** 카드를 한 단계 눌러 놓을 때. 아직 결과가 아닌 자리다. */
      sunken: null,
      /** 영역과 영역 사이를 끊는 띠. */
      band: null,
    },
    brand: {
      /** 참새 표식의 먹색. */
      ink: null,
      /** 아이콘 타일과 강조 면. */
      cream: null,
      /** 부리. 표식에서 유일한 유채색이다. */
      beak: null,
      /** 넓은 면에 쓰는 갈색. */
      deep: null,
    },
    text: {
      primary: null,
      secondary: null,
      /** 진행 중이라 아직 확정이 아닌 본문. */
      muted: null,
      /** 설명문. 본문보다 한 단계 물러난 글. */
      tertiary: null,
      /** 부가 정보. 조건 안내나 집계 같은 것. */
      faint: null,
      /** 아직 값이 들어오지 않은 자리. */
      disabled: null,
      inverse: null,
    },
    border: {
      /** 카드 안을 나누는 선. */
      faint: null,
      subtle: null,
      /** 눌러 놓은 카드의 테두리. */
      muted: null,
      default: null,
      /** 칩처럼 작은 요소의 테두리. */
      medium: null,
      /** 점선으로 쓰는 테두리. */
      dashed: null,
      strong: null,
    },
    action: {
      solid: null,
      solidText: null,
      disabled: null,
    },
    focus: null,
    /** 값이 아직 오지 않은 자리. */
    skeleton: null,

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
      /** 본문에 딸려 붙는 아주 작은 글자. */
      xxs: null,
      xs: null,
      sm: null,
      md: null,
      lg: null,
      xl: null,
      xxl: null,
      /** 홈의 제품 이름. 좁은 화면 기준이다. */
      hero: null,
      heroLg: null,
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
      tightest: null,
      tighter: null,
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
    xxxl: null,
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
    /** 입력과 버튼의 테두리. */
    medium: null,
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
    /** 홈 입력 줄의 최대 너비. */
    formMax: null,
    sidebarWidth: null,
    minTouchTarget: null,
    /** 입력과 버튼이 나란히 설 때 맞추는 높이. 접근성 최소 크기보다 크다. */
    controlHeight: null,
  },
})
