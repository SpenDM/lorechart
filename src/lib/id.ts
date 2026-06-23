import { v4 as uuidv4 } from 'uuid'

export function id(): string {
  return uuidv4()
}
