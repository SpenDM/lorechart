import type { Project } from '../types/model'
import { SCHEMA_VERSION } from '../types/model'

export function migrateProject(project: Project): Project {
  // Add migrations here as schema versions increment:
  // if (project.schemaVersion < 2) project = migrate1to2(project)
  return { ...project, schemaVersion: SCHEMA_VERSION }
}
