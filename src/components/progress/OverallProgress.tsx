import { useProgressStore } from '@/stores'

export function OverallProgress() {
  const getProgress = useProgressStore((s) => s.getOverallProgress)
  const progress = getProgress()

  const percentage = progress.total > 0
    ? ((progress.read / progress.total) * 100).toFixed(1)
    : '0.0'

  return (
    <div
      data-testid="overall-progress"
      data-read={progress.read}
      data-total={progress.total}
      className="flex flex-col items-center gap-2 rounded-lg bg-[var(--color-surface)] p-4"
    >
      <div className="text-center">
        <h3
          data-testid="overall-progress-title"
          className="font-ui text-sm font-semibold text-[var(--color-text)]"
        >
          Progresso da Bíblia
        </h3>
        <p className="font-footnote text-[var(--color-text-muted)]">
          {progress.read} de {progress.total} capítulos
        </p>
      </div>
      <div
        data-testid="overall-progress-bar"
        className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-bg)]"
      >
        <div
          data-testid="overall-progress-fill"
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        data-testid="overall-progress-percentage"
        className="font-ui text-lg font-bold text-[var(--color-accent)]"
      >
        {percentage}%
      </span>
    </div>
  )
}
