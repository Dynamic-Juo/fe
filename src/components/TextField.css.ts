import { style } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: vars.layout.controlHeight,
  padding: `0 ${vars.space.md}`,
  border: `${vars.borderWidth.medium} solid ${vars.color.border.strong}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.base,
})

/** 잘못된 입력은 선을 끊어 표시한다. 색만으로 구분하지 않는다. */
export const invalid = style({
  borderColor: vars.color.text.tertiary,
  borderStyle: 'dashed',
})

export const input = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: vars.font.size.lg,
  selectors: {
    '&::placeholder': {
      color: vars.color.text.disabled,
    },
    /**
     * 전역 초점 표시를 여기서만 끈다. 테두리 안쪽에 선이 한 겹 더 생겨
     * 두 겹으로 보인다. 글자 입력 칸은 커서가 깜빡여 초점이 어디인지 보인다.
     */
    '&:focus-visible': {
      outline: 'none',
    },
  },
})

export const icon = style({
  flexShrink: 0,
  color: vars.color.text.tertiary,
})

/**
 * 화면에서만 감춘다. `hidden` 속성이나 `display: none`은 낭독기에서도
 * 지워 버려서, 자리 표시자만 남고 입력에 이름이 없어진다.
 */
export const hiddenLabel = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
})
