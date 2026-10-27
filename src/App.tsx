import { lazy, Suspense } from 'react'
import './index.css'
import { DemoModeProvider } from './demo/DemoModeProvider'
import { ComparisonPage } from './pages/ComparisonPage'

const SpaceGlobeBackground = lazy(() =>
  import('./components/SpaceGlobeBackground').then((module) => ({
    default: module.SpaceGlobeBackground,
  })),
)

export default function App() {
  return (
    <DemoModeProvider>
      <div className="relative min-h-screen text-slate-100">
        <Suspense fallback={null}>
          <SpaceGlobeBackground />
        </Suspense>
        <div className="relative z-10">
          <ComparisonPage />
        </div>
      </div>
    </DemoModeProvider>
  )
}
