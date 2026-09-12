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
 * 띠는 띠일 뿐이라 여백을 갖지 않는다. 붙일 자리의 위 여백만큼 끌어올려
 * 앞 영역에 맞붙이고, 아래 간격은 그 자리의 패딩이 그대로 맡는다. 좌우로는
 * 화면 끝까지 밀어낸다. 여백이 `space.md`/`space.lg`인 자리에 쓴다.
 */
export const dividerTop = style({
  '::before': {
    content: '',
    display: 'block',
    height: '9px',
    marginTop: `calc(-1 * ${vars.space.md})`,
    marginInline: `calc(-1 * ${vars.space.lg})`,
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
