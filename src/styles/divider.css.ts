import { style } from '@vanilla-extract/css'

import { media } from './breakpoints'
import { vars } from './contract.css'

/**
 * 영역과 영역 사이를 끊는 띠다. 좁은 화면에서 섹션이 세로로 이어질 때 어디서
 * 끊기는지 보이지 않아 둔다. 넓은 화면은 열이 나뉘어 있어 쓰지 않는다.
 *
 * 요소를 만들지 않고 클래스만 얹는다. 띠는 내용이 아니라 표시라서 DOM에
 * 자리를 차지하면 안 된다. 낭독기도 읽을 것이 없다.
 *
 * 붙일 대상의 위 여백을 이 클래스가 가져간다. 화면 끝까지 붙도록 좌우로
 * 밀어내므로 좌우 여백이 `space.lg`인 자리에 쓴다.
 */
export const dividerTop = style({
  paddingTop: 0,
  '::before': {
    content: '',
    display: 'block',
    height: '9px',
    marginInline: `calc(-1 * ${vars.space.lg})`,
    marginBottom: vars.space.md,
    backgroundColor: vars.color.surface.band,
    borderTop: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
    borderBottom: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  },
  '@media': {
    [media.desktop]: {
      '::before': {
        display: 'none',
      },
    },
  },
})
