'use client'
import { useCallback, useEffect, useRef } from 'react'
import { useMovies, useMoviesStore } from '@/hooks/movies'
import MovieItem from '@/components/MovieItem'

export default function MovieList() {
  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useMovies()
  const messageStore = useMoviesStore(state => state.message)
  const message = isFetching ? 'Loading...' : messageStore

  const ioElementRef = useRef<HTMLDivElement | null>(null)
  const ioRef = useRef<IntersectionObserver | null>(null)

  const handleIoElement = useCallback(
    (node: HTMLDivElement | null) => {
      if (ioRef.current) {
        ioRef.current.disconnect()
        ioRef.current = null
      }

      if (!node || !hasNextPage) return

      ioElementRef.current = node

      ioRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            if (!isFetchingNextPage && hasNextPage) {
              fetchNextPage()
            }
          }
        },
        {
          root: null,
          rootMargin: '300px',
          threshold: 0.1
        }
      )

      ioRef.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  return (
    <div className="rounded bg-[var(--color-area)] p-5">
      {!movies?.length && message && (
        <p className="text-center text-[var(--color-primary)] opacity-50">
          {message}
        </p>
      )}
      <ul className="flex flex-wrap justify-center gap-5">
        {movies?.map((movie, index) => (
          <MovieItem
            key={`/movies-${index}/${movie.imdbID}`}
            movie={movie}
          />
        ))}
      </ul>

      <div ref={handleIoElement} />
    </div>
  )
}
