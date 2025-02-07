import { createFileRoute, Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { readItemsThesurvePostingsInfiniteOptions } from '~/oapi_client/@tanstack/react-query.gen'
import type { ItemsThesurvePostings } from '~/oapi_client/types.gen'
import { PostFormDialog } from '~/components/PostFormDialog'
import { Button } from '~/components/ui/button'
import { z } from 'zod'
import React from 'react'
import _ from 'lodash'
import { formatTime } from '~/utils/format'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ReportFormDialog } from "~/components/ReportFormDialog"
import { logPageView } from '~/utils/firebase'

export const Route = createFileRoute('/_with_layout/')({
  async beforeLoad({ context: { queryClient } }) {
    return {
      data: await queryClient.ensureInfiniteQueryData({
        ...readItemsThesurvePostingsInfiniteOptions({
          query: {
            sort: ['-date_created'],
          } 
        }),
      }),
    }
  },
  validateSearch: z.object({
    search: z.string().optional(),
  }),
  component: Home,
})

function EmptyState() {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No surveys yet</h3>
      <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
        Be the first to share your survey! Help your fellow students by
        participating in their research.
      </p>
      <div className="mt-6">
        <PostFormDialog />
      </div>
    </div>
  )
}

function NoResultsState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
      <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
        We couldn't find any surveys matching "{searchTerm}". Try adjusting your search terms.
      </p>
    </div>
  )
}

function PostingCard({ posting }: { posting: ItemsThesurvePostings }) {
  return (
    <div className="group bg-white px-5 py-4 rounded-lg hover:shadow-sm transition-all duration-300 border border-gray-100 hover:border-blue-100">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <Link
          to="/postings/$post_id"
          params={{ post_id: posting.id?.toString() || '' }}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-col gap-1.5 mb-2">
            <span className="inline-flex bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium text-xs self-start">
              {posting.course ?? 'Uncategorized'}
            </span>
            {(posting.school ?? '').length > 0 && (
              <span className="text-xs text-gray-400">
                {posting.school}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {posting.survey_title ?? 'Untitled Survey'}
          </h3>
          {(posting.description ?? '').length > 0 ? (
            <p className="text-sm text-gray-500 line-clamp-1">
              {posting.description}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No description provided
            </p>
          )}
        </Link>
        <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
          <div className="text-xs text-gray-400">
            {formatTime(posting.estimated_time!)}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/postings/$post_id"
              params={{ post_id: posting.id }}
              className="w-[125px]"
            >
              <span className="flex items-center text-center justify-center gap-1 text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1.5 rounded-full w-full">
                View Survey
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ReportFormDialog posting={posting}>
                  <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                    Report this Survey
                  </DropdownMenuItem>
                </ReportFormDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search surveys..."
      />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white px-5 py-4 rounded-lg border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-shrink-0">
              <div className="h-8 w-[125px] bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Home() {
  const { search } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [searchValue, setSearchValue] = React.useState(search || '')
  const loadMoreRef = React.useRef<HTMLDivElement>(null)
  
  const debouncedSearch = React.useMemo(
    () => _.debounce((value: string) => {
      navigate({ search: { search: value || undefined } })
    }, 300),
    []
  )

  React.useEffect(() => {
    debouncedSearch(searchValue)
    return () => debouncedSearch.cancel()
  }, [searchValue, debouncedSearch])

  React.useEffect(() => {
    logPageView({
      page_title: 'Home',
      search_term: search || undefined
    });
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      ...readItemsThesurvePostingsInfiniteOptions({
        query: {
          limit: 10,
          search: search ?? undefined,
        },
      }),
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (
          !lastPage.meta?.total_count ||
          typeof lastPageParam === 'number' ||
          !lastPageParam.query?.limit ||
          (lastPageParam.query.offset ?? 0) + lastPageParam.query.limit >= lastPage.meta.total_count
        ) {
          return undefined
        }
        return {
          ...lastPageParam,
          query: {
            ...lastPageParam.query,
            offset: (lastPageParam.query.offset ?? 0) + lastPageParam.query.limit,
          },
        }
      },
      enabled: searchValue.length === 0 || searchValue.length > 2
    })

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const postings = data?.pages.flatMap((page) => page.data || []) || []

  return (
    <div className="bg-gray-50">
      <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 text-white bg-repeat [background-size:40px]"></div>
        <div className="relative max-w-3xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl md:text-[2.2rem] font-bold mb-4 md:leading-10">
                Every Student <span className="italic">Deserves</span><span className="md:hidden">&nbsp;</span><br className="hidden md:block" />Quality Research Data
              </h1>
              <p className="text-blue-100">
                Share and participate in academic surveys to help fellow students gather 
                meaningful data for their research projects.
              </p>
            </div>
            <div className="flex-shrink-0">
              <PostFormDialog />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchBar value={searchValue} onChange={setSearchValue} />
        </div>
        {isLoading ? (
          <LoadingState />
        ) : postings.length > 0 ? (
          <>
            <div className="space-y-3">
              {postings.map((posting, index) => (
                <PostingCard key={posting.id || index} posting={posting} />
              ))}
            </div>
            {hasNextPage && (
              <>
                <div ref={loadMoreRef} className="h-10 w-full" />
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              </>
            )}
          </>
        ) : searchValue.length > 0 ? (
          <NoResultsState searchTerm={searchValue} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
