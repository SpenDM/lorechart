import type { ReactNode } from 'react'

interface ToolbarButtonProps {
  onClick: () => void
  title: string
  children: ReactNode
  variant?: 'default' | 'primary'
}

export default function ToolbarButton({ onClick, title, children, variant = 'default' }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-colors ${
        variant === 'primary'
          ? 'bg-blue-50 border border-blue-400 text-blue-600 hover:bg-blue-100'
          : 'bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  )
}
