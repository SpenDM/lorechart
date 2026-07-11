import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { ProjectMeta } from '../../db/persistence'

interface ProjectSwitcherModalProps {
  onClose: () => void
}

export default function ProjectSwitcherModal({ onClose }: ProjectSwitcherModalProps) {
  const [projects, setProjects] = useState<ProjectMeta[]>([])
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const currentId = useAppStore(s => s.project?.id)
  const switchProject = useAppStore(s => s.switchProject)
  const newProject = useAppStore(s => s.newProject)
  const importProject = useAppStore(s => s.importProject)

  useEffect(() => {
    useAppStore.getState().listProjects().then(setProjects)
  }, [])

  const handleSwitch = async (id: string) => {
    await switchProject(id)
    onClose()
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    await newProject(newName.trim())
    onClose()
  }

  const handleImport = () => {
    // T7.2 — Phase 7
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        await importProject(file)
        onClose()
      }
    }
    input.click()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-96 max-h-[80vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Projects</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
        </div>

        {/* Project list */}
        <div className="space-y-2 mb-4">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => handleSwitch(p.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                p.id === currentId
                  ? 'bg-blue-50 border border-blue-200 text-blue-700'
                  : 'hover:bg-slate-50 border border-transparent text-slate-700'
              }`}
            >
              <div className="font-medium text-sm">{p.name}</div>
              <div className="text-xs text-slate-400">{new Date(p.updatedAt).toLocaleString()}</div>
            </button>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No projects yet</p>
          )}
        </div>

        {/* New project */}
        {creating ? (
          <div className="flex gap-2 mb-3">
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') setCreating(false)
              }}
              placeholder="Project name…"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-400"
            />
            <button
              onClick={handleCreate}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              Create
            </button>
            <button
              onClick={() => setCreating(false)}
              className="px-3 py-2 text-slate-500 rounded-lg text-sm hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-300 hover:text-blue-500 mb-2"
          >
            ＋ New project
          </button>
        )}

        <button
          onClick={handleImport}
          className="w-full px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
        >
          Import…
        </button>

        <p className="mt-4 text-xs text-slate-400 text-center">
          Data lives in this browser only — use Save to export a backup.
        </p>
      </div>
    </div>
  )
}
