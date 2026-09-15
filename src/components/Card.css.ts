import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  padding: vars.space.sm,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.raised,
})

export const tone = styleVariants({
  default: {},
  muted: {
    backgroundColor: vars.color.surface.sunken,
    borderColor: vars.color.border.muted,
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: vars.color.border.dashed,
    backgroundColor: vars.color.surface.sunken,
  },
  /**
   * 처리가 끝나지 못한 카드다. 바탕을 가라앉혀 목록에서 구분한다. 테두리는
   * 기본 굵기를 유지해 진행 중 카드(`muted`)와 갈린다.
   *
   * 판정의 초록·빨강이나 조작의 주황을 쓰지 않는다. 처리 실패가 주장에 대한
   * 판정으로 읽힌다. 실패한 것은 우리 쪽 처리이지 주장이 아니다.
   */
  attention: {
    backgroundColor: vars.color.surface.sunken,
  },
})
