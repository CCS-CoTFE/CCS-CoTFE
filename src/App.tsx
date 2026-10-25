import { GlassContent, GlassForeground, GlassScene } from '@glass-sdk/liquid-glass'
import { useEffect, useRef, useState } from 'react'
import Navigation from './components/Navigation'
import Framework from './pages/Framework'
import Hero from './pages/Hero'
import Results from './pages/Results'
import './App.css'

export type Page = 'home' | 'framework' | 'results'
const PAGES: Page[] = ['home', 'framework', 'results']

function readPage(): Page {
  const hash = window.location.hash.slice(1) as Page
  return PAGES.includes(hash) ? hash : 'home'
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(readPage)
  const stageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !('IntersectionObserver' in window)) return

    const sections = Array.from(stage.querySelectorAll<HTMLElement>('[data-page]'))
    const revealTargets = Array.from(stage.querySelectorAll<HTMLElement>('[data-reveal]'))
    let initialHashPending = Boolean(window.location.hash)
    let initialHashTimer = 0
    const syncPage = () => {
      if (initialHashPending) return
      const stageRect = stage.getBoundingClientRect()
      const focusY = stageRect.top + stageRect.height * 0.42
      const activeSection = sections.find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= focusY && rect.bottom >= focusY
      }) ?? sections
        .map((section) => ({ section, distance: Math.abs((section.getBoundingClientRect().top + section.getBoundingClientRect().bottom) / 2 - focusY) }))
        .sort((a, b) => a.distance - b.distance)[0]?.section
      if (!activeSection) return

      const page = activeSection.dataset.page as Page
        setCurrentPage(page)
        const nextHash = page === 'home' ? window.location.pathname : '#' + page
        if (window.location.hash !== (page === 'home' ? '' : '#' + page)) {
          window.history.replaceState(null, '', nextHash)
        }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.setAttribute('data-visible', entry.isIntersecting ? 'true' : 'false'))
        window.requestAnimationFrame(syncPage)
      },
      { root: stage, rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.01] },
    )

    document.documentElement.dataset.revealReady = 'true'
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          target.dataset.revealed = 'true'
          revealObserver.unobserve(target)
        })
      },
      { root: stage, rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    sections.forEach((section) => observer.observe(section))
    const revealCounters = new Map<HTMLElement, number>()
    revealTargets.forEach((target) => {
      const section = target.closest<HTMLElement>('[data-page]')
      const sectionIndex = section ? (revealCounters.get(section) ?? 0) : 0
      if (section) revealCounters.set(section, sectionIndex + 1)
      target.style.setProperty('--reveal-delay', `${Math.min(sectionIndex, 8) * 88}ms`)
      revealObserver.observe(target)
    })
    stage.addEventListener('scroll', syncPage, { passive: true })
    if (!initialHashPending) syncPage()
    else initialHashTimer = window.setTimeout(() => {
      initialHashPending = false
      syncPage()
    }, 260)
    return () => {
      observer.disconnect()
      revealObserver.disconnect()
      stage.removeEventListener('scroll', syncPage)
      if (initialHashTimer) window.clearTimeout(initialHashTimer)
    }
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const page = readPage()
      setCurrentPage(page)
      stageRef.current?.querySelector<HTMLElement>('[data-page="' + page + '"]')?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
      })
    }
    window.addEventListener('hashchange', onHashChange)

    const initialPage = readPage()
    if (initialPage !== 'home') {
      window.requestAnimationFrame(() => {
        stageRef.current?.querySelector<HTMLElement>('[data-page="' + initialPage + '"]')?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        })
      })
    }

    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <GlassScene className="app" data-glass-engine="liquid-glass" material="regular" appearance="light" motion="full">
      <GlassContent layout="flow">
        <div className="scene-backdrop" aria-hidden="true">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <div className="ambient ambient-three" />
        </div>
      </GlassContent>

      <GlassForeground className="glass-ui">
        <Navigation currentPage={currentPage} />

        <main className="stage" ref={stageRef} tabIndex={0} aria-label="Research exhibit">
          <div className="story-layout">
            <div className="scroll-stack">
              <section className="scroll-panel" data-page="home" data-visible="true"><Hero /></section>
              <section className="scroll-panel" data-page="framework"><Framework /></section>
              <section className="scroll-panel" data-page="results"><Results /></section>
            </div>
          </div>
        </main>
      </GlassForeground>
    </GlassScene>
  )
}

export default App
