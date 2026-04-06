import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useBibleStore } from '@/stores'
import { ChapterReader } from '@/components/reader/ChapterReader'

export function RootRedirect() {
  const navigate = useNavigate()
  const bookId = useBibleStore((s) => s.bookId)
  const chapter = useBibleStore((s) => s.chapter)

  useEffect(() => {
    if (bookId && chapter) {
      navigate(`/${bookId}/${chapter}`, { replace: true })
    } else if (bookId) {
      navigate(`/${bookId}/1`, { replace: true })
    } else {
      navigate('/genesis/1', { replace: true })
    }
  }, [navigate, bookId, chapter])

  return null
}

export function BookRedirect() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (bookId) {
      navigate(`/${bookId}/1`, { replace: true })
    }
  }, [navigate, bookId])

  return null
}

export function ChapterPage() {
  return <ChapterReader />
}
