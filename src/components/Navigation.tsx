import { motion } from 'framer-motion'
import LiquidGlassSurface from './LiquidGlass'
import type { Page } from '../App'
import { assetPath } from '../site'
import styles from './Navigation.module.css'

interface NavigationProps {
  currentPage: Page
}

const items: Array<{ page: Page; label: string; index: string; glyph: string }> = [
  { page: 'home', label: 'Idea', index: '01', glyph: '💡' },
  { page: 'framework', label: 'Benchmark', index: '02', glyph: '▦' },
  { page: 'results', label: 'Evidence', index: '03', glyph: '◫' },
]

export default function Navigation({ currentPage }: NavigationProps) {
  return (
    <header className={styles.header}>
      <LiquidGlassSurface
        className={styles.capsule}
        radius="capsule"
        tintOpacity={0.08}
        blur={16}
        light={72}
      >
        <div className={styles.brand} aria-label="CoTsel — Correctness Conditioning as Selection in Chain-of-Thought Faithfulness Evaluation" title="Correctness Conditioning as Selection in Chain-of-Thought Faithfulness Evaluation">
          <span className={styles.brandMark} aria-hidden="true">
            <img className={styles.brandLogo} src={assetPath('/paper-cotsel-mark.png')} alt="" />
          </span>
          <span className={styles.brandText}>CoTsel</span>
        </div>

        <nav className={styles.navLinks} aria-label="Exhibit sections">
          {items.map((item) => (
            <span
              key={item.page}
              className={styles.navButton + ' ' + (currentPage === item.page ? styles.active : '')}
              aria-current={currentPage === item.page ? 'page' : undefined}
              title={'Scroll position: ' + item.label}
            >
              <span className={styles.navIndex}>{item.index}</span>
              <span className={styles.navGlyph} aria-hidden="true">{item.glyph}</span>
              <span>{item.label}</span>
              {currentPage === item.page && (
                <motion.span className={styles.activeDot} layoutId="active-nav" transition={{ duration: 0.3 }} />
              )}
            </span>
          ))}
        </nav>

        <div className={styles.actions}>
          <a className={styles.externalLink} href="https://github.com/CCS-CoTFE/CCS-CoTFE" target="_blank" rel="noreferrer" aria-label="Open the CCS-CoTFE GitHub repository in a new tab">
            <span className={styles.externalIcon} aria-hidden="true">⌘</span>
            <span className={styles.externalLabel}>Code</span>
          </a>
          <a className={styles.externalLink} href={assetPath('/docs/arxiv/main_arxiv.pdf')} target="_blank" rel="noreferrer" aria-label="Open Paper PDF in a new tab">
            <span className={styles.externalIcon} aria-hidden="true">↗</span>
            <span className={styles.externalLabel}>Paper</span>
          </a>
        </div>
      </LiquidGlassSurface>
    </header>
  )
}
