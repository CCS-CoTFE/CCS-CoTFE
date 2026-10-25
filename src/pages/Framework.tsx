import { useMemo, useState } from 'react'
import LiquidGlassSurface from '../components/LiquidGlass'
import { assetPath } from '../site'
import styles from './Framework.module.css'

type CausalNode = {
  id: string
  label: string
  short: string
  x: number
  y: number
  tone: 'signal' | 'violet' | 'coral'
  detail: string
}

type CausalEdge = {
  from: string
  to: string
  label?: string
}

const nodes: CausalNode[] = [
  { id: 'D', label: 'Difficulty', short: 'D', x: 100, y: 116, tone: 'violet', detail: 'Task difficulty shapes both the model’s reliance on reasoning and the chance of a correct answer.' },
  { id: 'S', label: 'Shortcut', short: 'S', x: 300, y: 74, tone: 'violet', detail: 'A shortcut can make an answer correct without the written trace carrying the decisive information.' },
  { id: 'R', label: 'Reliance', short: 'R', x: 290, y: 218, tone: 'signal', detail: 'Reliance is the latent response propensity that the intervention tries to reveal.' },
  { id: 'T', label: 'Trace', short: 'T', x: 480, y: 188, tone: 'signal', detail: 'The trace is edited, masked, or replaced to test whether it is causally used.' },
  { id: 'C', label: 'Correctness', short: 'C', x: 660, y: 116, tone: 'coral', detail: 'Correctness is the selection variable. Measuring faithfulness only here opens the bias path.' },
  { id: 'A', label: 'Answer change', short: 'A', x: 470, y: 300, tone: 'coral', detail: 'A changed answer after intervention is the observable causal signal.' },
]

const edges: CausalEdge[] = [
  { from: 'D', to: 'R' },
  { from: 'D', to: 'S' },
  { from: 'S', to: 'T' },
  { from: 'R', to: 'A' },
  { from: 'T', to: 'A', label: 'intervene' },
  { from: 'T', to: 'C', label: 'condition' },
]

const modes = [
  { id: 'selection', label: 'Selection', note: 'Where the lens bends' },
  { id: 'mechanism', label: 'Mechanism', note: 'What the intervention tests' },
  { id: 'remedy', label: 'Remedy', note: 'How to report the gap' },
] as const

type Mode = (typeof modes)[number]['id']

export default function Framework() {
  const [activeNode, setActiveNode] = useState('C')
  const [mode, setMode] = useState<Mode>('selection')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'unavailable'>('idle')

  const active = nodes.find((node) => node.id === activeNode) ?? nodes[0]
  const connected = useMemo(() => {
    const ids = new Set([activeNode])
    edges.forEach((edge) => {
      if (edge.from === activeNode) ids.add(edge.to)
      if (edge.to === activeNode) ids.add(edge.from)
    })
    return ids
  }, [activeNode])

  const selectNode = (id: string) => setActiveNode(id)
  const copyFormula = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyState('unavailable')
      window.setTimeout(() => setCopyState('idle'), 1800)
      return
    }
    try {
      await navigator.clipboard.writeText('Δ = Cov(η, π) / P(C = 1)')
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1600)
    } catch {
      setCopyState('unavailable')
      window.setTimeout(() => setCopyState('idle'), 1800)
    }
  }

  return (
    <section className="page-view framework-page" aria-labelledby="framework-title">
      <div className={styles.header} data-reveal="header">
        <div>
          <div className={styles.eyebrow}>02 / The benchmark</div>
          <h1 id="framework-title">One causal contract.<br /><span>Six paths to inspect.</span></h1>
        </div>
        <p>Trace the paper's structural model, then isolate the variable that changes the estimate.</p>
      </div>

      <div className={styles.statRail} aria-label="Framework scale" data-reveal="stats">
        <div data-reveal="metric"><strong>7</strong><span>causal variables</span></div>
        <div data-reveal="metric"><strong>6</strong><span>directed pathways</span></div>
        <div data-reveal="metric"><strong>1</strong><span>selection operator</span></div>
      </div>

      <div className={styles.grid} data-reveal="framework-grid">
        <LiquidGlassSurface className={styles.graphCard} radius={32} plain tintOpacity={0.08} data-reveal="card">
          <div className={styles.cardTop}><span>Structural causal model</span><span className={styles.live}><i /> live path</span></div>
          <div className={styles.figureStage}>
            <span className={styles.figureHalo} aria-hidden="true" />
            <img className={styles.paperGraph} src={assetPath('/paper-figures/scm-overview-glass.png')} alt="Polished structural causal model showing the unconditional graph and the graph after conditioning on correctness" />
            <span className={styles.figurePulse + ' ' + styles.edgeParticle} aria-hidden="true" />
          </div>
          <div className={styles.nodeRail} role="group" aria-label="Causal variables">
            {nodes.map((node) => {
              const isActive = node.id === activeNode
              const isConnected = connected.has(node.id)
              return <button key={node.id} className={styles.nodeChip} data-reveal="node" data-tone={node.tone} data-active={isActive} data-connected={isConnected} onClick={() => selectNode(node.id)} aria-pressed={isActive}><span className={styles.nodePulse} aria-hidden="true" /><span className={styles.nodeBox}>{node.short}</span><span>{node.label}</span></button>
            })}
          </div>
          <div className={styles.graphLegend}><span><i className={styles.dotSignal} /> variable</span><span><i className={styles.dotCoral} /> outcome / selection</span></div>
        </LiquidGlassSurface>

        <div className={styles.side} data-reveal="side">
          <LiquidGlassSurface className={styles.detailCard} radius={28} plain tintOpacity={0.07} data-reveal="detail">
            <div className={styles.detailEyebrow}>{mode} / {active.id}</div>
            <div aria-live="polite" aria-atomic="true">
              <h2>{active.label}</h2>
              <p>{active.detail}</p>
            </div>
            <div className={styles.detailRule}><span style={{ width: mode === 'selection' ? '82%' : mode === 'mechanism' ? '64%' : '48%' }} /></div>
            <div className={styles.detailFooter}><span>path weight</span><strong>{mode === 'selection' ? 'high' : mode === 'mechanism' ? 'mid' : 'low'}</strong></div>
          </LiquidGlassSurface>

          <LiquidGlassSurface className={styles.formulaCard} radius={28} plain tintOpacity={0.08} data-reveal="formula">
            <div className={styles.cardTop}><span>Bias decomposition</span><button className={styles.copyButton} onClick={copyFormula}>{copyState === 'copied' ? 'Copied' : copyState === 'unavailable' ? 'Unavailable' : 'Copy'}</button></div>
            <span className="srOnly" role="status" aria-live="polite">{copyState === 'copied' ? 'Formula copied to the clipboard.' : copyState === 'unavailable' ? 'Clipboard is unavailable in this browser.' : ''}</span>
            <div className={styles.formula} aria-label="Delta equals covariance of eta and pi divided by probability of C equals one">
              <span>Δ</span><b>=</b>
              <span className={styles.fraction}><em>Cov(η, π)</em><i>P(C = 1)</i></span>
            </div>
            <p>Covariance of response propensity and correctness, normalized by selection probability.</p>
          </LiquidGlassSurface>

          <LiquidGlassSurface className={styles.modeRail} radius={18} plain tintOpacity={0.06} role="group" aria-label="Framework lenses" data-reveal="modes">
            {modes.map((item) => (
              <button key={item.id} className={mode === item.id ? styles.modeActive : ''} onClick={() => setMode(item.id)} aria-pressed={mode === item.id}>
                <span>{item.label}</span><small>{item.note}</small>
              </button>
            ))}
          </LiquidGlassSurface>
        </div>
      </div>
    </section>
  )
}
