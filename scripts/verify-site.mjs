import { readFile } from 'node:fs/promises'

const files = {
  app: 'src/App.tsx',
  nav: 'src/components/Navigation.tsx',
  hero: 'src/pages/Hero.tsx',
  framework: 'src/pages/Framework.tsx',
  frameworkStyles: 'src/pages/Framework.module.css',
  results: 'src/pages/Results.tsx',
  bridge: 'src/components/LiquidGlass.tsx',
  entry: 'src/main.tsx',
  styles: 'src/App.css',
  resultsStyles: 'src/pages/Results.module.css',
}

const source = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([key, file]) => [key, await readFile(file, 'utf8')])),
)

const checks = [
  ['App mounts the live liquid glass exhibit', source.app.includes('data-glass-engine="liquid-glass"') && source.app.includes('GlassScene')],
  ['Navigation uses the live glass surface bridge', source.nav.includes('LiquidGlassSurface')],
  ['Navigation uses the CoTsel identity', source.nav.includes('/paper-cotsel-logo-gradient.png') && source.nav.includes('>CoTsel<') && source.nav.includes('Correctness Conditioning as Selection in Chain-of-Thought Faithfulness Evaluation')],
  ['Hero names the full Chinese university affiliation', source.hero.includes('University of Science and Technology of China')],
  ['Framework uses an interactive active node', source.framework.includes('activeNode')],
  ['Results keeps the chart-state data contract', source.results.includes('ResultTab')],
  ['Results reads as one continuous evidence stack', source.results.includes('resultStack') && !source.results.includes('role="tablist"')],
  ['Framework data cards use the plain surface treatment', source.framework.includes('plain tintOpacity={0.08}') && source.framework.includes('plain tintOpacity={0.07}')],
  ['Results data cards use the plain surface treatment', source.results.includes('plain tintOpacity={0.08}') && source.results.includes('plain tintOpacity={0.06}')],
  ['Scroll view uses smooth section observation', source.app.includes('IntersectionObserver')],
  ['Manual scrolling does not snap between sections', source.styles.includes('scroll-snap-type: none') && !source.styles.includes('scroll-snap-align') && source.styles.includes('scroll-behavior: auto')],
  ['Scroll reveals stagger page content', source.app.includes("target.dataset.revealed = 'true'") && source.results.includes('data-reveal') && source.styles.includes('data-revealed')],
  ['Scroll visibility writes explicit true/false state', source.app.includes("setAttribute('data-visible'")],
  ['App observes scroll sections', source.app.includes('IntersectionObserver')],
  ['Navigation keeps the capsule free of a progress bar', !source.nav.includes('progressTrack')],
  ['Liquid glass uses the Glass-HQ package renderer', source.bridge.includes("from '@glass-sdk/liquid-glass'") && source.entry.includes("@glass-sdk/liquid-glass/styles.css")],
  ['Scroll stages stay continuous', source.app.includes('scroll-stack') && !source.app.includes('story-rail-surface')],
  ['Scroll narrative label is removed', !source.app.includes('Scroll narrative')],
  ['Story rail surface is removed', !source.app.includes('story-rail-surface')],
  ['Navigation requests stronger blur', source.nav.includes('blur={16}')],
  ['Night mode is removed from the exhibit', !source.nav.includes('themeButton') && !source.app.includes('ThemeMode') && !source.app.includes('prefers-color-scheme')],
  ['Hero centers the paper intro without a side visual', source.hero.includes('className={styles.copy}') && !source.hero.includes('architecture-map.png') && !source.hero.includes('Causal glyph')],
  ['Hero keeps the lead title as a single relaxed line', source.hero.includes('titleLead') && source.hero.includes('Correctness Conditioning') && source.hero.includes('Faithfulness Evaluation')],
  ['Hero exposes a compact research scale rail', source.hero.includes('scaleRail') && source.hero.includes('16<small>/18</small>')],
  ['Framework flow has animated particles', source.framework.includes('edgeParticle') && source.framework.includes('nodePulse')],
  ['Framework uses box-based flow nodes', source.framework.includes('nodeBox')],
  ['Framework node chip borders stay still', source.frameworkStyles.includes('.nodeChip .nodePulse { display: none; animation: none; }') && !source.frameworkStyles.includes('.nodeChip:hover, .nodeChip[data-active=\'true\'] { transform')],
  ['Framework exposes a compact causal scale rail', source.framework.includes('statRail') && source.framework.includes('7</strong>')],
  ['Framework uses the generated paper causal figure', source.framework.includes('/paper-figures/scm-overview-glass.png') && source.framework.includes('paperGraph')],
  ['Navigation keeps the live glass surface', source.nav.includes('LiquidGlassSurface') && !source.nav.includes('plain')],
  ['Results includes the complete source paper figure set', source.results.includes('/paper-figures/scm-overview.png') && source.results.includes('/paper-figures/forest-plot.png') && source.results.includes('/paper-figures/bias-surface.png') && source.results.includes('/paper-figures/reversal-map.png') && source.results.includes('/paper-figures/goldilocks.png') && source.results.includes('figurePanel')],
  ['Results presents source figures as an interactive gallery', source.results.includes('figureGrid') && source.results.includes('figureCardActive') && source.results.includes('Selected source')],
  ['Results uses a responsive research figure board', source.resultsStyles.includes('.figureGrid { display: grid; grid-template-columns: repeat(2') && source.resultsStyles.includes('.figureGrid { grid-template-columns: 1fr; }') && source.resultsStyles.includes('object-fit: contain')],
  ['Trend chart uses one coordinate mapping for paths and points', source.results.includes('const chartX') && source.results.includes('const chartY') && source.results.includes('observedPath') && source.results.includes('adjustedPath')],
  ['Trend chart extends with scroll progress', source.results.includes('trendRef') && source.results.includes("--trend-progress") && source.results.includes('pathLength="1"')],
  ['No USTC abbreviation remains in source', !Object.values(source).some((value) => value.includes('USTC'))],
]

const failures = checks.filter(([, passed]) => !passed)
if (failures.length) {
  for (const [label] of failures) console.error(`FAIL: ${label}`)
  process.exit(1)
}

for (const [label] of checks) console.log(`PASS: ${label}`)
