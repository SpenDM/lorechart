import Dexie, { type Table } from 'dexie'
import type { Project } from '../types/model'

interface BlobRecord {
  id: string
  data: Blob
}

interface MetaRecord {
  key: string
  value: unknown
}

class AppDB extends Dexie {
  projects!: Table<Project, string>
  blobs!: Table<BlobRecord, string>
  meta!: Table<MetaRecord, string>

  constructor() {
    super('lorechart')
    this.version(1).stores({
      projects: 'id, name, updatedAt',
      blobs: 'id',
      meta: 'key',
    })
  }
}

export const db = new AppDB()
