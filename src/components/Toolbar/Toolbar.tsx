import type { ReactNode } from 'react'
import ToolbarButton from './ToolbarButton'

interface ToolbarProps {
  onNewProject: () => void
  onSwitchProject: () => void
  onSave: () => void
  bottomSlot: ReactNode
}

export default function Toolbar({ onNewProject, onSwitchProject, onSave, bottomSlot }: ToolbarProps) {
  return (
    <div className="absolute left-4 top-4 z-10 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center gap-2 shadow-md">
      <span className="text-[8px] tracking-widest text-slate-400 uppercase">Project</span>
      <ToolbarButton onClick={onNewProject} title="New project">＋</ToolbarButton>
      <ToolbarButton onClick={onSwitchProject} title="Switch project">⇄</ToolbarButton>
      <ToolbarButton onClick={onSave} title="Save (export)">⤓</ToolbarButton>

      <div className="w-full border-t border-slate-200 my-1" />

      <span className="text-[8px] tracking-widest text-slate-400 uppercase">Tools</span>
      {bottomSlot}
    </div>
  )
}
