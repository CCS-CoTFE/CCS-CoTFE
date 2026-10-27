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
  { id: 'D', label: 'Difficulty', short: 'D', x: 100, y: 116, tone: 'violet', detail: 'Task difficulty affects shortcut competence, CoT reliance, trace correctness, answer correctness, and compliance. The reported 42.8% proxy share is descriptive, not a causal effect.' },
  { id: 'S', label: 'Shortcut competence', short: 'S', x: 300, y: 74, tone: 'violet', detail: 'Shortcut competence is a non-CoT route to the answer. The collider analysis requires this branch to be active.' },
  { id: 'R', label: 'CoT reliance', short: 'R', x: 290, y: 218, tone: 'signal', detail: 'CoT reliance records whether the model uses the visible reasoning trace and enters the correctness and compliance mechanisms.' },
  { id: 'T', label: 'Trace correctness', short: 'T', x: 480, y: 188, tone: 'signal', detail: 'Trace correctness affects factual correctness and appropriate answer change after the reasoning intervention.' },
  { id: 'C', label: 'Answer correctness', short: 'C', x: 660, y: 116, tone: 'coral', detail: 'Answer correctness is the observed selection variable. Filtering on C = 1 changes the population used to estimate faithfulness.' },
  { id: 'A', label: 'Counterfactual compliance', short: 'A', x: 470, y: 300, tone: 'coral', detail: 'A is an appropriate post-intervention answer change: it means the model follows the edited dependency, not merely that any answer changes.' },
  { id: 'I', label: 'Intervention assignment', short: 'I', x: 650, y: 300, tone: 'signal', detail: 'I marks randomized intervention assignment. The compliance outcome A is defined for the causal intervention condition, I = 1.' },
]

const edges: CausalEdge[] = [
  { from: 'D', to: 'S' },
  { from: 'D', to: 'R' },
  { from: 'D', to: 'T' },
  { from: 'D', to: 'C' },
  { from: 'D', to: 'A' },
  { from: 'R', to: 'T' },
  { from: 'R', to: 'C' },
  { from: 'R', to: 'A' },
  { from: 'S', to: 'C' },
  { from: 'S', to: 'A' },
  { from: 'T', to: 'C' },
  { from: 'T', to: 'A' },
  { from: 'I', to: 'A', label: 'assignment' },
]

const modes = [
  { id: 'selection', label: 'Selection', note: 'Why C = 1 changes population' },
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
      await navigator.clipboard.writeText('Δ = Cov(A, C) / P(C = 1)')
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
          <h1 id="framework-title">One causal contract.<br /><span>Seven variables to inspect.</span></h1>
        </div>
        <p>Trace the paper's structural model, then isolate the variable that changes the estimate.</p>
      </div>

      <div className={styles.statRail} aria-label="Framework scale" data-reveal="stats">
        <div data-reveal="metric"><strong>7</strong><span>causal variables</span></div>
        <div data-reveal="metric"><strong>13</strong><span>directed dependencies</span></div>
        <div data-reveal="metric"><strong>1</strong><span>selection operator</span></div>
      </div>

      <div className={styles.grid} data-reveal="framework-grid">
        <LiquidGlassSurface className={styles.graphCard} radius={32} plain tintOpacity={0.08} data-reveal="card">
          <div className={styles.cardTop}><span>Structural causal model</span><span className={styles.live}><i /> live path</span></div>
          <div className={styles.figureStage}>
            <span className={styles.figureHalo} aria-hidden="true" />
            <a className={styles.figureLink} href={assetPath('/paper-figures/final/figure-03.pdf')} target="_blank" rel="noreferrer" aria-label="Open the vector PDF for Figure 3, the structural causal model">
              <img className={styles.paperGraph} src={assetPath('/paper-figures/final/figure-03.png')} alt="Structural causal model showing the unconditional graph and the graph after conditioning on answer correctness" />
            </a>
            <span className={styles.figurePulse + ' ' + styles.edgeParticle} aria-hidden="true" />
          </div>
          <div className={styles.nodeRail} role="group" aria-label="Causal variables">
            {nodes.map((node) => {
              const isActive = node.id === activeNode
              const isConnected = connected.has(node.id)
              return <button type="button" key={node.id} className={styles.nodeChip} data-reveal="node" data-tone={node.tone} data-active={isActive} data-connected={isConnected} onClick={() => selectNode(node.id)} aria-label={`${node.short}: ${node.label}`} aria-pressed={isActive}><span className={styles.nodePulse} aria-hidden="true" /><span className={styles.nodeBox}>{node.short}</span><span>{node.label}</span></button>
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
            <div className={styles.detailFooter}><span>direct connections</span><strong>{Math.max(0, connected.size - 1)} adjacent</strong></div>
          </LiquidGlassSurface>

          <LiquidGlassSurface className={styles.formulaCard} radius={28} plain tintOpacity={0.08} data-reveal="formula">
            <div className={styles.cardTop}><span>Observed selection gap</span><button type="button" className={styles.copyButton} onClick={copyFormula}>{copyState === 'copied' ? 'Copied' : copyState === 'unavailable' ? 'Unavailable' : 'Copy'}</button></div>
            <span className="srOnly" role="status" aria-live="polite">{copyState === 'copied' ? 'Formula copied to the clipboard.' : copyState === 'unavailable' ? 'Clipboard is unavailable in this browser.' : ''}</span>
            <div className={styles.formula} aria-label="Delta equals covariance of A and C divided by probability of C equals one">
              <span>Δ</span><b>=</b>
              <span className={styles.fraction}><em>Cov(A, C)</em><i>P(C = 1)</i></span>
            </div>
            <p>Exact observed identity for the selection gap. The latent η/π factorization applies only under A ⟂ C given R, S, I, and D.</p>
          </LiquidGlassSurface>

          <LiquidGlassSurface className={styles.modeRail} radius={18} plain tintOpacity={0.06} role="group" aria-label="Framework lenses" data-reveal="modes">
            {modes.map((item) => (
              <button type="button" key={item.id} className={mode === item.id ? styles.modeActive : ''} onClick={() => setMode(item.id)} aria-pressed={mode === item.id}>
                <span>{item.label}</span><small>{item.note}</small>
              </button>
            ))}
          </LiquidGlassSurface>
        </div>
      </div>
    </section>
  )
}
