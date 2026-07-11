import { useEffect, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import { selectProject, selectActiveView } from './store/selectors'
import PlotView from './views/PlotView'
import MapView from './views/MapView'
import ProjectSwitcherModal from './components/overlays/ProjectSwitcherModal'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [showSwitcher, setShowSwitcher] = useState(false)
  const boot = useAppStore(s => s._boot)
  const project = useAppStore(selectProject)
  const activeView = useAppStore(selectActiveView)

  useEffect(() => {
    boot().then(() => setBooted(true))
  }, [boot])

  if (!booted) return null

  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-slate-50">
        <h1 className="text-2xl font-semibold text-slate-700">Plot & Map</h1>
        <p className="text-slate-500 text-sm">Create your first project to get started.</p>
        <button
          onClick={() => setShowSwitcher(true)}
          className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm font-medium"
        >
          Create project
        </button>
        {showSwitcher && <ProjectSwitcherModal onClose={() => setShowSwitcher(false)} />}
      </div>
    )
  }

  return (
    <div className="h-full">
      {activeView === 'plot' ? <PlotView /> : <MapView />}
    </div>
  )
}
