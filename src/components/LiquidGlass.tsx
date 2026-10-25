import { GlassSurface } from '@glass-sdk/liquid-glass'
import type { CSSProperties, ReactNode } from 'react'

type Radius = number | 'capsule' | 'circle'

interface LiquidGlassSurfaceProps {
  children: ReactNode
  className?: string
  radius?: Radius
  tintOpacity?: number
  blur?: number
  light?: number
  plain?: boolean
  style?: CSSProperties
  onClick?: () => void
  id?: string
  role?: string
  tabIndex?: number
  'aria-label'?: string
  'aria-labelledby'?: string
  'data-reveal'?: string
}

/**
 * Shared surface bridge. The navigation keeps the live Glass-HQ material;
 * data cards can opt into the quieter paper surface used by the exhibit.
 */
export default function LiquidGlassSurface({
  children,
  className = '',
  radius = 28,
  tintOpacity = 0.1,
  blur = 10,
  light = 64,
  plain = false,
  style,
  onClick,
  id,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'data-reveal': dataReveal,
}: LiquidGlassSurfaceProps) {
  const surfaceRadius = radius === 'capsule' ? 'capsule' : radius === 'circle' ? 'circle' : radius
  const sharedProps = {
    id,
    role,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'data-reveal': dataReveal,
    onClick,
    style: {
      '--lg-foreground': 'var(--text)',
      '--liquid-tint-opacity': String(tintOpacity),
      '--liquid-sheen-opacity': String(Math.max(0.08, Math.min(0.34, light / 240))),
      borderRadius: radius === 'capsule' ? '999px' : radius === 'circle' ? '50%' : `${radius}px`,
      overflow: 'hidden',
      ...style,
    } as CSSProperties,
  }

  if (plain) {
    return <div {...sharedProps} className={'plain-surface ' + className}>{children}</div>
  }

  const refraction = Math.min(48, Math.max(10, blur * 2.2))
  return (
    <GlassSurface
      {...sharedProps}
      className={'liquid-glass-host ' + className}
      material="regular"
      appearance="light"
      radius={surfaceRadius}
      refraction={refraction}
      interactive
    >
      {children}
    </GlassSurface>
  )
}
