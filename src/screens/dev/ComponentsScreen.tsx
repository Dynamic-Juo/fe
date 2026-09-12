import type { ReactElement, ReactNode } from 'react'

import { Banner, Button, Card, Chip, ProgressBar, Skeleton, TextField } from '../../components'
import * as Icons from '../../components/icons'
import { ClockIcon, InfoIcon, LinkIcon, type IconProps } from '../../components/icons'
import {
  CLAIM_STATUS_LABEL,
  DETECTION_LABEL,
  MANIPULATION_LABEL,
  VERDICT_LABEL,
} from '../../copy/strings'
import { vars } from '../../styles/contract.css'
import * as styles from './ComponentsScreen.css'

/** 공통 껍데기인 Icon은 children을 요구하므로 목록에서 뺀다. */
type NamedIcon = (props: IconProps) => ReactElement

const ICONS = Object.entries(Icons).filter(
  (entry): entry is [string, NamedIcon] => entry[0].endsWith('Icon') && entry[0] !== 'Icon',
)

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {note ? <p className={styles.caption}>{note}</p> : null}
      {children}
    </section>
  )
}

/**
 * 공통 컴포넌트 목록이다. 상세 디자인이 정해져 토큰 값을 바꿀 때 한 화면에서
 * 결과를 확인한다. 개발 모드에서만 등록한다.
 */
export function ComponentsScreen() {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.pageTitle}>공통 컴포넌트</h1>
        <p className={styles.lead}>
          색은 아직 정해지지 않았다. 판정과 미디어 조작 단계는 지금 모두 같은 회색이며 문구와 테두리
          두께로 구분한다. 색이 정해지면 theme.css.ts의 값만 바꾼다.
        </p>
      </header>

      <Section title="검증 판정" note="U-03. 처리 상태와 다른 축이며 한 칩에 합치지 않는다.">
        <div className={styles.row}>
          <Chip emphasis="strong">{VERDICT_LABEL.supported}</Chip>
          <Chip emphasis="strong">{VERDICT_LABEL.refuted}</Chip>
          <Chip emphasis="strong">{VERDICT_LABEL.unverified}</Chip>
        </div>
      </Section>

      <Section title="처리 상태" note="완료되지 않은 카드에는 판정 칩을 두지 않는다.">
        <div className={styles.row}>
          <Chip emphasis="muted">{CLAIM_STATUS_LABEL.pending}</Chip>
          <Chip emphasis="dashed">{CLAIM_STATUS_LABEL.verifying}</Chip>
          <Chip>{CLAIM_STATUS_LABEL.done}</Chip>
          <Chip>{CLAIM_STATUS_LABEL.failed}</Chip>
          <Chip>{CLAIM_STATUS_LABEL.timed_out}</Chip>
        </div>
      </Section>

      <Section title="미디어 조작" note="U-04. 네 단계 라벨을 줄이지 않는다.">
        <div className={styles.row}>
          <Chip emphasis="strong">{MANIPULATION_LABEL.suspected}</Chip>
          <Chip>{MANIPULATION_LABEL.no_clear_signs}</Chip>
          <Chip emphasis="dashed">{MANIPULATION_LABEL.inconclusive}</Chip>
          <Chip emphasis="muted">{MANIPULATION_LABEL.unavailable}</Chip>
        </div>
        <p className={styles.caption}>
          {DETECTION_LABEL.face} · {DETECTION_LABEL.wholeVideo}
        </p>
      </Section>

      <Section title="버튼" note="최소 높이는 토큰의 minTouchTarget을 따른다.">
        <div className={styles.row}>
          <Button>분석하기</Button>
          <Button variant="outline">다시 분석</Button>
          <Button size="sm" variant="outline">
            작은 버튼
          </Button>
          <Button disabled>비활성</Button>
        </div>
        <Button fullWidth>가로 전체</Button>
      </Section>

      <Section title="입력" note="자리 표시자를 설명 대신 쓰지 않는다. 라벨이 필수다.">
        <TextField
          label="YouTube Shorts 링크"
          placeholder="링크 붙여넣기"
          icon={<LinkIcon size={17} />}
          hideLabel
        />
        <TextField label="라벨이 보이는 입력" placeholder="값을 입력하세요" />
        <TextField label="잘못된 입력" placeholder="형식이 맞지 않음" invalid />
      </Section>

      <Section title="진행률" note="전체 개수를 모르면 아무것도 그리지 않는다.">
        <ProgressBar done={3} total={8} label="주장 검증 진행률" />
        <p className={styles.caption}>total이 0이면 아래처럼 렌더되지 않는다.</p>
        <ProgressBar done={0} total={0} label="확정 전" />
      </Section>

      <Section title="카드">
        <Card>
          <strong>기본</strong>
          <Skeleton width="88%" />
          <Skeleton width="55%" />
        </Card>
        <Card tone="muted">흐림</Card>
        <Card tone="dashed">점선</Card>
      </Section>

      <Section title="안내" note="실패는 낭독기에 알린다.">
        <Banner title="분석이 예상보다 오래 걸리고 있습니다." icon={<ClockIcon size={17} />} />
        <Banner
          title="일부 분석만 완료되었습니다"
          description="분석하지 못한 영역과 이유를 함께 표시한다."
          icon={<InfoIcon size={17} />}
          tone="notice"
        />
      </Section>

      <Section title="아이콘" note={`${ICONS.length}개. 이름을 주지 않으면 낭독기에서 감춘다.`}>
        <div className={styles.grid}>
          {ICONS.map(([name, Component]) => (
            <div key={name} className={styles.iconCell}>
              <Component size={24} />
              {name.replace(/Icon$/, '')}
            </div>
          ))}
        </div>
      </Section>

      <Section title="색 토큰" note="지금은 전부 회색이다. 값이 바뀌면 여기서 확인한다.">
        <div className={styles.grid}>
          {[
            ['판정 일치', vars.color.verdict.supported],
            ['판정 불일치', vars.color.verdict.refuted],
            ['근거 부족', vars.color.verdict.unverified],
            ['조작 의심', vars.color.manipulation.suspected],
            ['징후 없음', vars.color.manipulation.noClearSigns],
            ['판단 보류', vars.color.manipulation.inconclusive],
            ['분석 불가', vars.color.manipulation.unavailable],
          ].map(([label, color]) => (
            <div key={label} className={styles.swatch}>
              <span className={styles.swatchBox} style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
