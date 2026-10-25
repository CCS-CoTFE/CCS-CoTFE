import { useEffect, useRef, useState } from 'react'
import LiquidGlassSurface from '../components/LiquidGlass'
import { assetPath } from '../site'
import styles from './Results.module.css'

export type ResultTab = 'benchmarks' | 'coverage' | 'decomposition' | 'trend' | 'matrix' | 'figures'

const biasData = [
  { name: 'GLM-5.3', value: 7.4 },
  { name: 'v4-flash', value: 6.0 },
  { name: 'v4-pro', value: 2.4 },
  { name: 'GLM-5.2', value: 1.6 },
  { name: 'Qwen3.8', value: 0.0 },
  { name: 'Gemini 3.5', value: 0.0 },
]

const studyLabels = ['Faithfulness', 'CoT', 'Intervention', 'Selection', 'Causal', 'Trace', 'Metric', 'Audit', 'Benchmark', 'Reasoning', 'Filter', 'Answer', 'Perturb', 'Reliance', 'Counterfactual', 'Correctness', 'Coverage', 'Outcome']
const trendData = [
  { label: '0%', observed: 2.2, adjusted: 2.2 },
  { label: '20%', observed: 3.4, adjusted: 3.8 },
  { label: '40%', observed: 4.7, adjusted: 5.8 },
  { label: '60%', observed: 5.9, adjusted: 7.4 },
  { label: '80%', observed: 6.5, adjusted: 8.3 },
  { label: '100%', observed: 7.1, adjusted: 9.1 },
]
const matrixRows = ['GSM8K', 'MATH', 'StrategyQA', 'ARC']
const matrixCols = ['Trace', 'Answer', 'Selection', 'Outcome']
const matrixValues = [
  [0.34, 0.62, 0.78, 0.44],
  [0.48, 0.81, 0.94, 0.57],
  [0.25, 0.52, 0.66, 0.38],
  [0.22, 0.44, 0.59, 0.32],
]
const paperFigures = [
  { id: 'scm', label: 'SCM overview', meta: 'Figure 01 · causal structure', src: assetPath('/paper-figures/scm-overview.png'), caption: 'The structural causal model makes the selection path explicit: correctness opens a route that changes the observed faithfulness estimate.' },
  { id: 'forest', label: 'Forest plot', meta: 'Source figure · pooled odds', src: assetPath('/paper-figures/forest-plot.png'), caption: 'Per-model odds ratios all point toward selection bias; the pooled Mantel–Haenszel estimate is 1.70.' },
  { id: 'surface', label: 'Bias surface', meta: 'Figure 02 · closed form', src: assetPath('/paper-figures/bias-surface.png'), caption: 'The closed-form surface shows where conditioning creates the largest gap across response and shortcut propensities.' },
  { id: 'reversal', label: 'Reversal map', meta: 'Figure 03 · phase diagram', src: assetPath('/paper-figures/reversal-map.png'), caption: 'The phase diagram marks the narrow region where selection can reverse a model ranking.' },
  { id: 'goldilocks', label: 'Goldilocks curve', meta: 'Source figure · accuracy sweep', src: assetPath('/paper-figures/goldilocks.png'), caption: 'The measured effect peaks in the intermediate accuracy band and collapses at the ceiling.' },
]

export default function Results() {
  const [selectedModel, setSelectedModel] = useState('GLM-5.3')
  const [selectedCell, setSelectedCell] = useState({ row: 1, col: 2 })
  const [selectedFigure, setSelectedFigure] = useState('forest')
  const trendRef = useRef<SVGSVGElement>(null)

  const maxBias = Math.max(...biasData.map((item) => item.value))
  const chartX = (index: number) => 48 + index * (687 / (trendData.length - 1))
  const chartY = (value: number) => 218 - value * 20
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
        <p>One paper, five source figures, six views of the same causal finding.</p>
      </div>

      <div className={styles.metricRail} data-reveal="metrics">
        <LiquidGlassSurface className={styles.metric} radius={18} plain tintOpacity={0.06} data-reveal="metric"><span>Average gap</span><strong>+7.4<small>pp</small></strong><i>across benchmarks</i></LiquidGlassSurface>
        <LiquidGlassSurface className={styles.metric} radius={18} plain tintOpacity={0.06} data-reveal="metric"><span>Studies affected</span><strong>16<small>/18</small></strong><i>screened literature</i></LiquidGlassSurface>
        <LiquidGlassSurface className={styles.metric} radius={18} plain tintOpacity={0.06} data-reveal="metric"><span>Pooled odds</span><strong>1.70<small>×</small></strong><i>p &lt; 10⁻⁹</i></LiquidGlassSurface>
      </div>

      <div className={styles.resultStack}>
        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="deployments-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>01 / bias by deployment</span><h2 id="deployments-heading">Conditioning lifts every measured estimate.</h2></div>
            <span className={styles.chartMeta}>Δ in percentage points</span>
          </div>
          <div className={styles.benchmarkPanel} data-reveal="panel">
            <div className={styles.axis}><span>0</span><span>4</span><span>8 pp</span></div>
            {biasData.map((item, index) => {
              const selected = selectedModel === item.name
              return (
                <button key={item.name} className={selected ? styles.benchmarkActive : styles.benchmarkRow} data-reveal="bar" onClick={() => setSelectedModel(item.name)} aria-pressed={selected}>
                  <span className={styles.benchmarkName}>{item.name}</span>
                  <span className={styles.barTrack}><span className={styles.barFill} style={{ width: ((item.value / maxBias) * 100) + '%', animationDelay: (index * 70) + 'ms' }} /></span>
                  <strong>{item.value.toFixed(1)}<small>pp</small></strong>
                </button>
              )
            })}
            <div className={styles.selectedNote}><span className={styles.noteDot} /> {selectedModel} shows a {biasData.find((item) => item.name === selectedModel)?.value.toFixed(1)}pp conditional inflation.</div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="coverage-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>02 / screened literature</span><h2 id="coverage-heading">The pattern is not isolated.</h2></div>
            <span className={styles.chartMeta}>18 screened studies</span>
          </div>
          <div className={styles.coveragePanel} data-reveal="panel">
            <div className={styles.coverageSummary} data-reveal="summary"><strong>16</strong><span>of 18 studies show a conditional view that can move the estimate.</span></div>
            <div className={styles.dotMatrix} data-reveal="dots" role="list" aria-label="Study coverage matrix">
              {studyLabels.map((label, index) => <span key={label} role="listitem" aria-label={label + ': ' + (index < 16 ? 'affected' : 'unaffected')} className={index < 16 ? styles.dotAffected : styles.dotUnaffected} title={label + ': ' + (index < 16 ? 'affected' : 'unaffected')} />)}
            </div>
            <div className={styles.coverageLegend}><span><i className={styles.dotAffected} /> affected</span><span><i className={styles.dotUnaffected} /> unaffected</span></div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="decomposition-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>03 / attribution of the gap</span><h2 id="decomposition-heading">Separate selection from signal.</h2></div>
            <span className={styles.chartMeta}>covariance view</span>
          </div>
          <div className={styles.decompPanel} data-reveal="panel">
            <div className={styles.ring} data-reveal="ring" style={{ '--progress': '42.8%' } as React.CSSProperties}><div><strong>42.8%</strong><span>selection explained</span></div></div>
            <div className={styles.decompCopy} data-reveal="copy"><span className={styles.chartKicker}>Covariance share</span><h3>Intervenable operations carry the signal.</h3><p>The decomposition keeps the selection effect visible while separating it from residual variation.</p><div className={styles.stack}><span /><i /></div><div className={styles.stackLegend}><span><i className={styles.explained} /><strong>42.8%</strong> explained by selection</span><span><i className={styles.residual} /><strong>57.2%</strong> residual variation</span></div></div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="trend-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>04 / faithfulness response curve</span><h2 id="trend-heading">The gap widens as correctness rises.</h2></div>
            <span className={styles.chartMeta}>normalized score</span>
          </div>
          <div className={styles.trendPanel} data-reveal="panel">
            <div className={styles.trendLegend} data-reveal="legend"><span><i className={styles.legendObserved} /> observed estimate</span><span><i className={styles.legendAdjusted} /> correctness conditioned</span></div>
            <svg ref={trendRef} className={styles.trendChart} viewBox="0 0 760 260" role="img" aria-label="Observed and correctness conditioned faithfulness response curves">
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
              <text className={styles.axisLabel} x="48" y="20">faithfulness gap / pp</text>
              <text className={styles.axisLabel} x="735" y="258" textAnchor="end">correctness percentile</text>
            </svg>
            <table className="srOnly"><caption>Observed and correctness conditioned faithfulness response values</caption><thead><tr><th>Correctness percentile</th><th>Observed estimate</th><th>Conditioned estimate</th></tr></thead><tbody>{trendData.map((point) => <tr key={point.label}><td>{point.label}</td><td>{point.observed.toFixed(1)} pp</td><td>{point.adjusted.toFixed(1)} pp</td></tr>)}</tbody></table>
            <div className={styles.trendCallout}><span className={styles.noteDot} /> The conditioned estimate separates by <strong>+2.0pp</strong> at the upper tail.</div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="matrix-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>05 / evidence map</span><h2 id="matrix-heading">The selection path has a visible shape.</h2></div>
            <span className={styles.chartMeta}>click cells to inspect</span>
          </div>
          <div className={styles.matrixPanel} data-reveal="panel">
            <div className={styles.matrixLabels} data-reveal="labels"><span>benchmark</span>{matrixCols.map((label) => <span key={label}>{label}</span>)}</div>
            <div className={styles.matrixGrid} data-reveal="matrix" role="grid" aria-label="Evidence strength by benchmark and causal operation">
              {matrixRows.map((row, rowIndex) => <div className={styles.matrixRow} role="row" key={row}>
                <span className={styles.matrixRowLabel}>{row}</span>
                {matrixValues[rowIndex].map((value, colIndex) => <button key={matrixCols[colIndex]} role="gridcell" aria-label={`${row}, ${matrixCols[colIndex]}, ${(value * 100).toFixed(0)} percent evidence`} className={selectedCell.row === rowIndex && selectedCell.col === colIndex ? styles.matrixCellActive : styles.matrixCell} style={{ '--cell-alpha': value } as React.CSSProperties} onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}>{Math.round(value * 100)}%</button>)}
              </div>)}
            </div>
            <div className={styles.matrixNote} aria-live="polite" aria-atomic="true"><span className={styles.noteDot} /> <strong>{matrixRows[selectedCell.row]} × {matrixCols[selectedCell.col]}</strong><span>has the strongest observed selection signal in this slice.</span></div>
          </div>
        </LiquidGlassSurface>

        <LiquidGlassSurface className={styles.chartCard} radius={30} plain tintOpacity={0.08} aria-labelledby="figures-heading" data-reveal="card">
          <div className={styles.chartHead} data-reveal="text">
            <div><span className={styles.chartKicker}>06 / paper figures</span><h2 id="figures-heading">Read the result at its source.</h2></div>
            <span className={styles.chartMeta}>five full figures · click to inspect</span>
          </div>
          <div className={styles.figurePanel} data-reveal="panel">
            <div className={styles.figureGrid} data-reveal="figures" role="group" aria-label="Paper figures">
              {paperFigures.map((figure, index) => <button key={figure.id} className={selectedFigure === figure.id ? styles.figureCardActive : styles.figureCard} onClick={() => setSelectedFigure(figure.id)} aria-pressed={selectedFigure === figure.id}><div className={styles.figureCardTop}><span>Figure {String(index + 1).padStart(2, '0')}</span><strong>{figure.label}</strong><b aria-hidden="true">↗</b></div><div className={styles.figureCardImage}><img src={figure.src} alt={figure.label + ' from the paper'} /></div><small>{figure.meta}</small></button>)}
            </div>
            {(() => {
              const figure = paperFigures.find((item) => item.id === selectedFigure) ?? paperFigures[0]
              return <div className={styles.figureDetail} aria-live="polite" aria-atomic="true"><span>Selected source</span><h3>{figure.label}</h3><p>{figure.caption}</p></div>
            })()}
          </div>
        </LiquidGlassSurface>
      </div>

      <div className={styles.footerNote} data-reveal="footer"><span>Reading the exhibit</span><strong>Start at the framework, then test the claim in results.</strong><a href="#framework">View framework →</a></div>
    </section>
  )
}
