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
 * 여백이 없는 바깥 상자에 붙인다. 안쪽 여백은 그 상자의 내용이 가진다.
 * 띠가 여백을 밀어내거나 자식에 간격을 얹지 않아, 어디에 붙여도 붙인 쪽의
 * 여백 값을 알 필요가 없다.
 */
export const dividerTop = style({
  '::before': {
    content: '',
    display: 'block',
    height: '9px',
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
