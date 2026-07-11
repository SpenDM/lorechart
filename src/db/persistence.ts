import type { Project } from '../types/model'
import { db } from './db'

export interface ProjectMeta {
  id: string
  name: string
  updatedAt: string
}

const META_LAST_ACTIVE = 'lastActiveProjectId'

let saveTimer: ReturnType<typeof setTimeout> | null = null

export function scheduleSave(project: Project): void {
  if (saveTimer !== null) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = null
    db.projects.put(project).catch(console.error)
  }, 600)
}

export async function saveProjectNow(project: Project): Promise<void> {
  if (saveTimer !== null) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  await db.projects.put(project)
}

export async function loadProject(id: string): Promise<Project | null> {
  return (await db.projects.get(id)) ?? null
}

export async function listProjects(): Promise<ProjectMeta[]> {
  const all = await db.projects.orderBy('updatedAt').reverse().toArray()
  return all.map(({ id, name, updatedAt }) => ({ id, name, updatedAt }))
}

export async function getLastActiveProjectId(): Promise<string | null> {
  const record = await db.meta.get(META_LAST_ACTIVE)
  return (record?.value as string | undefined) ?? null
}

export async function setLastActiveProjectId(id: string | null): Promise<void> {
  if (id === null) {
    await db.meta.delete(META_LAST_ACTIVE)
  } else {
    await db.meta.put({ key: META_LAST_ACTIVE, value: id })
  }
}
