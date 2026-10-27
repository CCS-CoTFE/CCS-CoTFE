import { useEffect, useRef, useState } from 'react'
import LiquidGlassSurface from '../components/LiquidGlass'
import { paperFigures } from '../paperFigures'
import styles from './Results.module.css'

export type ResultTab = 'benchmarks' | 'coverage' | 'decomposition' | 'trend' | 'matrix' | 'figures'

const biasData = [
  { name: 'GLM-5.3', value: 7.4, p: 'p < 0.0001', significant: true },
  { name: 'deepseek-v4-flash', value: 6.0, p: 'p = 0.046', significant: true },
  { name: 'deepseek-v4-pro', value: 2.4, p: 'p = 0.337', significant: false },
  { name: 'glm-5.2', value: 1.6, p: 'p = 0.540', significant: false },
  { name: 'qwen3.8-max', value: 0.0, p: 'boundary control', significant: false },
  { name: 'Gemini 3.5 Flash Lite', value: 0.0, p: 'boundary control', significant: false },
]

const protocolInventory = [
  { title: 'Measuring Faithfulness in Chain-of-Thought Reasoning', href: 'https://arxiv.org/abs/2307.13702v1', version: 'arXiv 2307.13702v1', scope: 'Trace truncation, mistakes, and paraphrase; collected traces.' },
  { title: "Language Models Don't Always Say What They Think", href: 'https://arxiv.org/abs/2305.04388v2', version: 'arXiv 2305.04388v2', scope: 'Biased input cues; main tests and correctness-selected examples.' },
  { title: 'Faithful Chain-of-Thought Reasoning', href: 'https://arxiv.org/abs/2301.13379v3', version: 'arXiv 2301.13379v3', scope: 'Deterministic solver; test accuracy and human-plausibility checks.' },
  { title: 'Question Decomposition Improves Faithfulness', href: 'https://arxiv.org/abs/2307.11768v2', version: 'arXiv 2307.11768v2', scope: 'Trace truncation and corruption across reasoning samples.' },
  { title: 'Knowledge-Driven CoT', href: 'https://arxiv.org/abs/2308.13259v2', version: 'arXiv 2308.13259v2', scope: 'Retrieval and trace construction; correct-answer training pool.' },
  { title: 'Chain-of-Thought Unfaithfulness as Disguised Accuracy', href: 'https://arxiv.org/abs/2402.14897v3', version: 'arXiv 2402.14897v3', scope: 'With/without-CoT agreement; dataset-level metric.' },
  { title: 'Making Reasoning Matter', href: 'https://arxiv.org/abs/2402.13950v4', version: 'arXiv 2402.13950v4', scope: 'Counterfactual mediation and mean test-set accuracy differences.' },
  { title: 'On the Hardness of Faithful CoT Reasoning', href: 'https://arxiv.org/abs/2406.10625v2', version: 'arXiv 2406.10625v2', scope: 'Early-answer consistency; correct-only training is separate.' },
  { title: 'Chain-of-Thought Reasoning In The Wild Is Not Always Faithful', href: 'https://arxiv.org/abs/2503.08679v6', version: 'arXiv 2503.08679v6', scope: 'Input pairs and shortcut detection; correct Putnam responses.' },
  { title: 'Measuring Faithfulness by Unlearning Reasoning Steps', href: 'https://arxiv.org/abs/2502.14829v4', version: 'arXiv 2502.14829v4', scope: 'Unlearning and mistake insertion; CoT/no-CoT agreement.' },
  { title: "Reasoning Models Don't Always Say What They Think", href: 'https://arxiv.org/abs/2505.05410v1', version: 'arXiv 2505.05410v1', scope: 'Injected hints and answer switches to the hint.' },
  { title: 'Thought Anchors', href: 'https://arxiv.org/abs/2506.19143v4', version: 'arXiv 2506.19143v4', scope: 'Step resampling and attention; outcome-balanced traces.' },
  { title: 'A Causal Lens for Evaluating Faithfulness Metrics', href: 'https://arxiv.org/abs/2502.18848v3', version: 'arXiv 2502.18848v3', scope: 'Knowledge edits and corruption in constructed explanation pairs.' },
  { title: 'FaithCoT-Bench', href: 'https://arxiv.org/abs/2510.04040v2', version: 'arXiv 2510.04040v2', scope: 'Instance-level detection on annotated correct and incorrect traces.' },
  { title: 'Faithfulness as Information Flow', href: 'https://arxiv.org/abs/2605.24286v1', version: 'arXiv 2605.24286v1', scope: 'Information flow and hint edits; behavior-selected verbalizations.' },
  { title: 'Counterfactual Simulation Training', href: 'https://arxiv.org/abs/2602.20710v2', version: 'arXiv 2602.20710v2', scope: 'Counterfactual input simulation and cue-influence test sets.' },
  { title: "Faithfulness Metrics Don't Measure Faithfulness", href: 'https://arxiv.org/abs/2605.25052v1', version: 'arXiv 2605.25052v1', scope: 'Ground-truth meta-evaluation with correct and wrong-hint cases.' },
  { title: 'C2-Faith', href: 'https://arxiv.org/abs/2603.05167v2', version: 'arXiv 2603.05167v2', scope: 'Step-validity and coverage judges on labelled source chains.' },
]

const trendData = [
  { label: '1 op', n: 115, observed: 0.922, adjusted: 0.942, gap: 2.0 },
  { label: '2 op', n: 104, observed: 0.750, adjusted: 0.739, gap: -1.1 },
  { label: '3 op', n: 232, observed: 0.379, adjusted: 0.408, gap: 2.8 },
  { label: '5 op', n: 223, observed: 0.426, adjusted: 0.496, gap: 7.0 },
  { label: '7 op', n: 100, observed: 0.320, adjusted: 0.405, gap: 8.5 },
  { label: '8 op', n: 123, observed: 0.415, adjusted: 0.500, gap: 8.5 },
  { label: '11 op', n: 103, observed: 0.553, adjusted: 0.613, gap: 6.0 },
]
const matrixRows = ['Correct (C=1)', 'Incorrect (C=0)']
const matrixCols = ['Compliant (A=1)', 'Non-compliant (A=0)']
const matrixValues = [
  [299, 216],
  [208, 277],
]


export default function Results() {
  const [selectedModel, setSelectedModel] = useState('GLM-5.3')
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 })
  const [selectedFigure, setSelectedFigure] = useState('figure-13')
  const trendRef = useRef<SVGSVGElement>(null)

  const maxBias = Math.max(...biasData.map((item) => item.value))
  const chartX = (index: number) => 48 + index * (687 / (trendData.length - 1))
  const chartY = (value: number) => 218 - value * 160
  const observedPoints = trendData.map((point, index) => ({ x: chartX(index), y: chartY(point.observed) }))
  const adjustedPoints = trendData.map((point, index) => ({ x: chartX(index), y: chartY(point.adjusted) }))
  const toPath = (points: Array<{ x: number; y: number }>) => points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')
  const observedPath = toPath(observedPoints)
  const adjustedPath = toPath(adjustedPoints)
  const adjustedAreaPath = `${adjustedPath} L${adjustedPoints[adjustedPoints.length - 1].x} 218 L${adjustedPoints[0].x} 218 Z`

  useEffect(() => {
    const chart = trendRef.current
    const stage = chart?.closest<HTMLElement>('.stage')
    if (!chart || !stage) return

    let frame = 0
    const updateProgress = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const chartRect = chart.getBoundingClientRect()
        const stageRect = stage.getBoundingClientRect()
        const start = stageRect.top + stageRect.height * 0.9
        const end = stageRect.top + stageRect.height * 0.2
        const progress = Math.max(0, Math.min(1, (start - chartRect.top) / (start - end)))
        chart.style.setProperty('--trend-progress', String(progress))
      })
    }

    stage.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    updateProgress()
    return () => {
      stage.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="page-view results-page" aria-labelledby="results-title">
      <div className={styles.header} data-reveal="header">
        <div>
          <div className={styles.eyebrow}>03 / Evidence</div>
          <h1 id="results-title">Expose the <span>selection gap.</span></h1>
        </div>
        <p>One paper, four deployments, and a protocol inventory with version-pinned sources.</p>
      </div>

      <div className={styles.metricRail} data-reveal="metrics">
        <LiquidGlassSurface className={styles.metric} radius={18} plain tintOpacity={0.06} data-reveal="metric"><span>Primary GLM-5.3 gap</span><strong>+7.4<small>pp</small></strong><i>Fpop 50.7% · Fsel 58.1% · n=1000</i></LiquidGlassSurface>
        <LiquidGlassSurface className={styles.metric} radius={18} plain tintOpacity={0.06} data-reveal="metric"><span>Pooled CMH odds</span><strong>1.70<small>×</small></strong><i>95% CI 1.39–2.08 · p &lt; 10⁻⁶</i></LiquidGlassSurface>
        <LiquidGlassSurface className={styles.metric} radius={18} plain tintOpacity={0.06} data-reveal="metric"><span>GLM-5.3 joint table</span><strong>1000<small>traces</small></strong><i>299 / 216 / 208 / 277 across A × C</i></LiquidGlassSurface>
      </div>

      <div className={styles.resultStack}>
        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="deployments-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>01 / deployment gaps</span><h2 id="deployments-heading">Four positive sub-ceiling gaps, two individually significant.</h2></div>
            <span className={styles.chartMeta}>Δ = Fsel − Fpop</span>
          </div>
          <div className={styles.benchmarkPanel} data-reveal="panel">
            <div className={styles.axis}><span>0</span><span>4</span><span>8 pp</span></div>
            {biasData.map((item, index) => {
              const selected = selectedModel === item.name
              return (
                <button key={item.name} className={selected ? styles.benchmarkActive : styles.benchmarkRow} data-reveal="bar" onClick={() => setSelectedModel(item.name)} aria-pressed={selected}>
                  <span className={styles.benchmarkName}>{item.name}</span>
                  <span className={styles.barTrack}><span className={styles.barFill} style={{ width: (maxBias ? (item.value / maxBias) * 100 : 0) + '%', animationDelay: (index * 70) + 'ms' }} /></span>
                  <strong>{item.value.toFixed(1)}<small>pp</small></strong>
                </button>
              )
            })}
            <div className={styles.selectedNote}><span className={styles.noteDot} /> {selectedModel}: {biasData.find((item) => item.name === selectedModel)?.p}. Only GLM-5.3 and deepseek-v4-flash are individually significant; the pooled test is the pre-specified analysis.</div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="coverage-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>02 / screened literature</span><h2 id="coverage-heading">The pattern is not isolated.</h2></div>
            <span className={styles.chartMeta}>18 screened studies</span>
          </div>
          <div className={styles.coveragePanel} data-reveal="panel">
            <div className={styles.coverageSummary} data-reveal="summary"><strong>18</strong><span>protocols reviewed with source versions and scopes recorded per analysis.</span></div>
            <div className={styles.protocolGrid} data-reveal="dots" role="list" aria-label="Version-pinned protocol inventory">
              {protocolInventory.map((item) => <a key={item.href} className={styles.protocolItem} role="listitem" href={item.href} target="_blank" rel="noreferrer"><strong>{item.title}</strong><small>{item.version}</small><span>{item.scope}</span></a>)}
            </div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="decomposition-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>03 / attribution of the gap</span><h2 id="decomposition-heading">Separate selection from signal.</h2></div>
            <span className={styles.chartMeta}>covariance view</span>
          </div>
          <div className={styles.decompPanel} data-reveal="panel">
            <div className={styles.ring} data-reveal="ring" style={{ '--progress': '42.8%' } as React.CSSProperties}><div><strong>42.8%</strong><span>between strata</span></div></div>
            <div className={styles.decompCopy} data-reveal="copy"><span className={styles.chartKicker}>Operation-count decomposition</span><h3>A descriptive split, not a causal attribution.</h3><p>Operation-count strata account for 42.8% of the GLM-5.3 gap; the remaining 57.2% stays unattributed within the reported decomposition.</p><div className={styles.stack}><span /><i /></div><div className={styles.stackLegend}><span><i className={styles.explained} /><strong>42.8%</strong> between-stratum variation</span><span><i className={styles.residual} /><strong>57.2%</strong> unattributed remainder</span></div></div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="trend-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>04 / operation-count strata</span><h2 id="trend-heading">GLM-5.3 faithfulness by editable operations.</h2></div>
            <span className={styles.chartMeta}>Fpop and Fsel · n per stratum</span>
          </div>
          <div className={styles.trendPanel} data-reveal="panel">
            <div className={styles.trendLegend} data-reveal="legend"><span><i className={styles.legendObserved} /> all traces (Fpop)</span><span><i className={styles.legendAdjusted} /> selected traces (Fsel)</span></div>
            <svg ref={trendRef} className={styles.trendChart} viewBox="0 0 760 260" role="img" aria-label="GLM-5.3 all-trace and correctness-selected faithfulness by operation-count stratum">
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--violet)" stopOpacity=".32" /><stop offset="1" stopColor="var(--violet)" stopOpacity="0" /></linearGradient>
              </defs>
              {[0, 1, 2, 3].map((line) => <line key={line} x1="48" x2="735" y1={42 + line * 49} y2={42 + line * 49} className={styles.chartGrid} />)}
              <path className={styles.trendArea} d={adjustedAreaPath} />
              <path className={styles.trendLineObserved} pathLength="1" d={observedPath} />
              <path className={styles.trendLineAdjusted} pathLength="1" d={adjustedPath} />
              {trendData.map((point, index) => {
                const x = chartX(index)
                const observedY = chartY(point.observed)
                const adjustedY = chartY(point.adjusted)
                return <g key={point.label}><circle className={styles.trendPointObserved} cx={x} cy={observedY} r="4" /><circle className={styles.trendPointAdjusted} cx={x} cy={adjustedY} r="5" /><text className={styles.trendLabel} x={x} y="244" textAnchor="middle">{point.label}</text></g>
              })}
              <text className={styles.axisLabel} x="48" y="20">faithfulness estimate</text>
              <text className={styles.axisLabel} x="735" y="258" textAnchor="end">editable operations</text>
            </svg>
            <table className="srOnly"><caption>GLM-5.3 faithfulness by operation-count stratum</caption><thead><tr><th>Operations</th><th>n</th><th>Fpop</th><th>Fsel</th><th>Gap</th></tr></thead><tbody>{trendData.map((point) => <tr key={point.label}><td>{point.label}</td><td>{point.n}</td><td>{point.observed.toFixed(3)}</td><td>{point.adjusted.toFixed(3)}</td><td>{point.gap.toFixed(1)} pp</td></tr>)}</tbody></table>
            <div className={styles.trendCallout}><span className={styles.noteDot} /> The seven non-empty strata sum to <strong>n=1000</strong>; their gaps are descriptive within the GLM-5.3 run.</div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="matrix-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>05 / joint outcome counts</span><h2 id="matrix-heading">The primary GLM-5.3 table stays inspectable.</h2></div>
            <span className={styles.chartMeta}>click cells to inspect</span>
          </div>
          <div className={styles.matrixPanel} data-reveal="panel">
            <div className={styles.matrixLabels} data-reveal="labels"><span>correctness</span>{matrixCols.map((label) => <span key={label}>{label}</span>)}</div>
            <div className={styles.matrixGrid} data-reveal="matrix" role="grid" aria-label="GLM-5.3 joint correctness and compliance counts">
              {matrixRows.map((row, rowIndex) => <div className={styles.matrixRow} role="row" key={row}>
                <span className={styles.matrixRowLabel}>{row}</span>
                {matrixValues[rowIndex].map((value, colIndex) => { const alpha = value / 299; return <button key={matrixCols[colIndex]} role="gridcell" aria-label={`${row}, ${matrixCols[colIndex]}, ${value} traces`} className={selectedCell.row === rowIndex && selectedCell.col === colIndex ? styles.matrixCellActive : styles.matrixCell} style={{ '--cell-alpha': alpha } as React.CSSProperties} onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}>{value}</button> })}
              </div>)}
            </div>
            <div className={styles.matrixNote} aria-live="polite" aria-atomic="true"><span className={styles.noteDot} /> <strong>{matrixRows[selectedCell.row]} × {matrixCols[selectedCell.col]}</strong><span>{matrixValues[selectedCell.row][selectedCell.col]} traces in the GLM-5.3 2×2 table.</span></div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="figures-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>06 / paper figures</span><h2 id="figures-heading">Read all fourteen final figures at their source.</h2></div>
            <span className={styles.chartMeta}>14 final figures · click to inspect</span>
          </div>
          <div className={styles.figurePanel} data-reveal="panel">
            <div className={styles.figureGrid} data-reveal="figures" role="group" aria-label="Paper figures">
              {paperFigures.map((figure) => <button key={figure.id} className={selectedFigure === figure.id ? styles.figureCardActive : styles.figureCard} onClick={() => setSelectedFigure(figure.id)} aria-pressed={selectedFigure === figure.id}><div className={styles.figureCardTop}><span>Figure {String(figure.number).padStart(2, '0')}</span><strong>{figure.label}</strong><b aria-hidden="true">↗</b></div><div className={styles.figureCardImage}><img src={figure.src} alt={figure.label + ' from the paper'} /></div><small>{figure.meta}</small></button>)}
            </div>
            {(() => {
              const figure = paperFigures.find((item) => item.id === selectedFigure) ?? paperFigures[0]
              return <div className={styles.figureDetail} aria-live="polite" aria-atomic="true"><span>Selected source · Figure {String(figure.number).padStart(2, '0')}</span><h3>{figure.label}</h3><p>{figure.caption}</p><a className={styles.figureSource} href={figure.href} target="_blank" rel="noreferrer">Open source page ↗</a></div>
            })()}
          </div>
        </LiquidGlassSurface>
      </div>

      <div className={styles.footerNote} data-reveal="footer"><span>Reading the exhibit</span><strong>Start at the framework, then test the claim in results.</strong><a href="#framework">View framework →</a></div>
    </section>
  )
}
