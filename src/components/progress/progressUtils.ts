export type ReadStatus = 'none' | 'partial' | 'full'

export function getReadStatus(read: number, total: number): ReadStatus {
  if (read === 0) return 'none'
  if (read === total) return 'full'
  return 'partial'
}
