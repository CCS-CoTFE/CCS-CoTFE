import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const pathFor = (relativePath) => new URL(relativePath, root)

const sourcePaths = {
  app: 'src/App.tsx',
  nav: 'src/components/Navigation.tsx',
  hero: 'src/pages/Hero.tsx',
  framework: 'src/pages/Framework.tsx',
  results: 'src/pages/Results.tsx',
  figures: 'src/paperFigures.ts',
  bridge: 'src/components/LiquidGlass.tsx',
  entry: 'src/main.tsx',
  styles: 'src/App.css',
}

const source = Object.fromEntries(
  await Promise.all(Object.entries(sourcePaths).map(async ([key, relativePath]) => [key, await readFile(pathFor(relativePath), 'utf8')])),
)

const sha256 = async (relativePath) => {
  const bytes = await readFile(pathFor(relativePath))
  return createHash('sha256').update(bytes).digest('hex')
}

const isFile = async (relativePath) => {
  try {
    const details = await stat(pathFor(relativePath))
    return details.isFile() && details.size > 0
  } catch {
    return false
  }
}

const finalPdfHash = 'ffcab9a684dc36ca042f073ed559aec82896e1e3dc3cc95dcd5eb05cc3dffd20'
const finalSourceHash = '71ca15692b151d28f67ac95cad7a5313d35dd0a0c969a36b0761e54a9ce39d7a'

const requiredAssets = [
  'public/docs/arxiv/main_arxiv.pdf',
  'public/docs/arxiv/CCS-CoTFE-final.pdf',
  'public/docs/arxiv/CCS-CoTFE-latex-source.zip',
  'public/docs/arxiv/metadata.txt',
  'public/promo-film/selected-not-faithful.mp4',
  ...Array.from({ length: 14 }, (_, index) => `public/paper-figures/final/figure-${String(index + 1).padStart(2, '0')}.png`),
]

const includesAll = (text, needles) => needles.every((needle) => text.includes(needle))

const checks = [
  ['TypeScript source tree is present', await isFile('tsconfig.json')],
  ['App mounts the light liquid-glass exhibit', includesAll(source.app, ['GlassScene', 'data-glass-engine="liquid-glass"', 'appearance="light"', 'motion="full"'])],
  ['Navigation uses the live Glass-HQ surface and CoTsel mark', includesAll(source.nav + source.bridge + source.entry, ["@glass-sdk/liquid-glass", 'LiquidGlassSurface', '/paper-cotsel-mark.png'])],
  ['Navigation keeps scroll-driven section labels', includesAll(source.nav, ['Idea', 'Benchmark', 'Evidence'])],
  ['Hero uses the final paper title, subtitle, and primary metrics', includesAll(source.hero, ['Correctness Conditioning', 'as Selection in Chain-of-Thought', 'Faithfulness Evaluation', 'Correctness conditioning changes the estimand', '+7.4', '1.70']) && !source.hero.includes('16<small>/18</small>')],
  ['Hero keeps the University of Science and Technology of China affiliation', source.hero.includes('University of Science and Technology of China')],
  ['Framework models all seven variables and thirteen dependencies', includesAll(source.framework, ["id: 'D'", "id: 'S'", "id: 'R'", "id: 'T'", "id: 'C'", "id: 'A'", "id: 'I'", 'directed dependencies', 'Cov(A, C)'])],
  ['Framework uses the final structural causal figure and vector link', includesAll(source.framework, ['/paper-figures/final/figure-03.png', '/paper-figures/final/figure-03.pdf', 'Structural causal model'])],
  ['Framework states the proxy share as descriptive', includesAll(source.framework, ['42.8%', 'descriptive', 'not a causal effect'])],
  ['Results imports all fourteen final figures', includesAll(source.results + source.figures, ['paperFigures', 'figure-${key}.png', '14 final figures'])],
  ['Results uses the final GLM-5.3 metrics and exact joint counts', includesAll(source.results, ['+7.4', '50.7%', '58.1%', '1.70', '299, 216', '208, 277'])],
  ['Results uses the seven non-empty operation strata', includesAll(source.results, ['1 op', '2 op', '3 op', '5 op', '7 op', '8 op', '11 op', 'n=1000'])],
  ['Results presents an eighteen-source protocol inventory', includesAll(source.results, ['18 screened studies', 'Measuring Faithfulness in Chain-of-Thought Reasoning', 'C2-Faith'])],
  ['Results keeps the scroll reveal and continuous chart interaction', includesAll(source.app + source.results, ['IntersectionObserver', 'data-reveal', 'trendRef', '--trend-progress', 'pathLength="1"'])],
  ['Manual scrolling remains continuous without snapping', source.styles.includes('scroll-snap-type: none') && !source.styles.includes('scroll-snap-align')],
  ['No night-mode toggle or USTC abbreviation remains', !Object.values(source).some((value) => value.includes('USTC') || value.includes('prefers-color-scheme') || value.includes('themeButton'))],
  ['Every final paper and media asset is present', (await Promise.all(requiredAssets.map(isFile))).every(Boolean)],
  ['Published PDF mirrors the final corrected paper', await sha256('public/docs/arxiv/main_arxiv.pdf') === finalPdfHash && await sha256('public/docs/arxiv/CCS-CoTFE-final.pdf') === finalPdfHash],
  ['Published source archive mirrors the final PDFLaTeX source', await sha256('public/docs/arxiv/CCS-CoTFE-latex-source.zip') === finalSourceHash],
  ['Published metadata mirrors the final metadata text', (await readFile(pathFor('public/docs/arxiv/metadata.txt'))).equals(await readFile(pathFor('docs/final-corrected-20261026/metadata.txt')))],
]

const failures = checks.filter(([, passed]) => !passed)
for (const [label, passed] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}: ${label}`)
if (failures.length) process.exit(1)
