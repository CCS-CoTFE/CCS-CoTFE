declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

interface ImportMetaEnv {
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {
  const css: string
  export default css
}

declare module 'react-dom/client' {
  import type { ReactNode } from 'react'
  export function createRoot(container: Element | DocumentFragment): { render(children: ReactNode): void }
}

declare module 'react-dom' {
  import type { ReactNode, ReactPortal } from 'react'
  export function createPortal(children: ReactNode, container: Element): ReactPortal
}
