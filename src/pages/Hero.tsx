import { motion } from 'framer-motion'
import { assetPath } from '../site'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <div className={styles.homeChapter}>
      <section className="page-view hero" aria-labelledby="paper-title">
        <div className={styles.layout}>
          <motion.div
            className={styles.copy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.eyebrow} data-reveal="eyebrow"><span className={styles.eyebrowDot} /> 01 / The idea</div>
            <h1 id="paper-title" className={styles.title} data-reveal="title">
              <span className={styles.titleLead}>Correctness Conditioning</span>
              <span className={styles.titleTail}>as Selection in Chain-of-Thought</span>
              <span className={styles.titleTail}>Faithfulness Evaluation</span>
            </h1>
            <p className={styles.subtitle} data-reveal="subtitle">A causal benchmark for knowing when a faithful trace is actually faithful.</p>

            <div className={styles.authors} aria-label="Authors" data-reveal="authors">
              <div data-reveal="author">
                <strong>Yueer Pan</strong>
                <span>Zhejiang University</span>
              </div>
              <span className={styles.authorDivider} aria-hidden="true">·</span>
              <div data-reveal="author">
                <strong>Yuexi Pan</strong>
                <span>University of Science and Technology of China</span>
              </div>
            </div>

            <div className={styles.actions} data-reveal="actions">
              <a className={styles.action + ' ' + styles.primary} data-reveal="action" href={assetPath('/docs/arxiv/main_arxiv.pdf')} target="_blank" rel="noreferrer">
                <span>Read paper</span><span aria-hidden="true">↗</span>
              </a>
              <a className={styles.action} data-reveal="action" href={assetPath('/code/index.html')} target="_blank" rel="noreferrer">
                <span>Open code</span><span aria-hidden="true">⌘</span>
              </a>
              <a className={styles.action} data-reveal="action" href="#framework">
                <span>Explore model</span><span aria-hidden="true">→</span>
              </a>
              <a className={styles.action} data-reveal="action" href="#video">
                <span>Watch film</span><span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className={styles.scaleRail} aria-label="Research scale" data-reveal="scale">
              <div className={styles.scaleItem} data-reveal="metric">
                <strong>+7.4<small>pp</small></strong>
                <span>average conditional shift</span>
              </div>
              <div className={styles.scaleItem} data-reveal="metric">
                <strong>16<small>/18</small></strong>
                <span>studies affected</span>
              </div>
              <div className={styles.scaleItem} data-reveal="metric">
                <strong>5</strong>
                <span>benchmark views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.videoSection} id="video" aria-labelledby="video-title">
        <div className={styles.videoHeading} data-reveal="video-heading">
          <div>
            <div className={styles.videoEyebrow}><span className={styles.eyebrowDot} /> Watch the exhibit</div>
            <h2 id="video-title">See the distinction in motion.</h2>
          </div>
          <a className={styles.videoLink} href="#framework">Continue to benchmark <span aria-hidden="true">↓</span></a>
        </div>
        <div className={styles.videoStage} data-reveal="video-stage">
          <video controls playsInline preload="metadata" aria-label="CoTsel project film" src={assetPath('/promo-film/selected-not-faithful.mp4')} />
          <div className={styles.videoCaption}><span>CoTsel / selected, not faithful</span><span>01:05 · project film</span></div>
        </div>
      </section>
    </div>
  )
}
