import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ stroke: '#3b82f6', strokeWidth: 2.5 }}
    />
  )
}
