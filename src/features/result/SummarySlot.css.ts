import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

/**
 * 넓은 화면에만 둔다. 좁은 화면은 한 열로 이어져서 빈 자리를 잡아 둘 이유가
 * 없고, 자리만 차지하면 아래 내용이 화면 밖으로 밀린다.
 */
export const text = style({
  padding: `${vars.space.sm} 0`,
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
  textAlign: 'center',
})
