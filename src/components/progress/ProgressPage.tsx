import { ProgressPanel } from '@/components/progress/ProgressPanel'
import { OverallProgress } from '@/components/progress/OverallProgress'

export function ProgressPage() {
  return (
    <div className="space-y-4" data-testid="progress-page">
      <h1 className="font-book-title text-xl text-[var(--color-text)]">Progresso</h1>
      <OverallProgress />
      <ProgressPanel />
    </div>
  )
}
