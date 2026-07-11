import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'

function App() {
  const boot = useAppStore((s) => s._boot)

  useEffect(() => {
    boot()
  }, [boot])

  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-2xl font-medium">Plot & Map</h1>
    </div>
  )
}

export default App
