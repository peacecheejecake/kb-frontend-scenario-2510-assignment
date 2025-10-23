import axios from 'axios'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { useInfiniteQuery } from '@tanstack/react-query'

export type Movies = SimpleMovie[]
export interface SimpleMovie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}
export interface DetailedMovie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
    Source: string
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

const defaultMessage = 'Search for the movie title!'

export const useMoviesStore = create(
  combine(
    {
      inputText: '',
      searchText: '',
      message: defaultMessage
    },
    set => ({
      setInputText: (text: string) => set({ inputText: text }),
      setSearchText: (text: string) => set({ searchText: text }),
      setMessage: (message: string) => set({ message }),
      resetMovies: () =>
        set({
          inputText: '',
          searchText: '',
          message: defaultMessage
        })
    })
  )
)

async function fetchMovies(
  searchText: string,
  page: number
): Promise<{
  movies: Movies
  message?: string
}> {
  if (!searchText) {
    return { movies: [], message: defaultMessage }
  }

  try {
    const response = await axios.get(
      `/api/movies?title=${searchText}&page=${page}`
    )

    if (response.data?.Response === 'True') {
      return {
        movies: response.data.Search as Movies
        // message: `Found ${response.data.Search.length} results.`
      }
    } else if (response.data?.Response === 'False') {
      return {
        movies: [],
        message: response.data.Error
      }
    } else {
      return Promise.reject(new Error('Unknown error occurred.'))
    }
  } catch (error) {
    return Promise.reject(
      new Error(error instanceof Error ? error.message : 'Unknown error')
    )
  }
}

export function useMovies() {
  const searchText = useMoviesStore(state => state.searchText)
  const setMessage = useMoviesStore(state => state.setMessage)

  return useInfiniteQuery({
    queryKey: ['data', { searchText }],
    queryFn: async ({ pageParam }) => {
      const { movies, message } = await fetchMovies(searchText, pageParam)
      setMessage(message ?? '')
      return movies
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length > 0 ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
    maxPages: 100,
    select: data => data.pages.flat(),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1
  })
}
