import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import React, { useState } from 'react'
import { PostFormDialog } from '~/components/PostFormDialog'
import { readItemsThesurvePostingsOptions, readSingleItemsThesurvePostingsOptions } from '~/oapi_client/@tanstack/react-query.gen'
import type { ItemsThesurvePostings } from '~/oapi_client/types.gen'
import { formatTime } from '~/utils/format'
import { seo } from '~/utils/seo'
import { ReportFormDialog } from "~/components/ReportFormDialog"
import { logPageView } from '~/utils/firebase'
import { buildUrl } from '~/utils/url'

marked.setOptions({
  gfm: true,
})

export const Route = createFileRoute('/_with_layout/postings/$post_id')({
  async loader({ context: { queryClient }, params: { post_id } }) {
    try {
      const { data: posting } = await queryClient.ensureQueryData({
        ...readSingleItemsThesurvePostingsOptions({
          path: {
            id: post_id,
          },
        }),
      });

      if (!posting) {
        throw notFound();
      }
  
      return {
        posting
      }
    } catch (e) {
      if (isAxiosError(e) && (e.response?.status === 404 || e.response?.status === 403)) {
        throw notFound();
      }
      throw e;
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};

    const { posting } = loaderData;
    return {
      meta: seo({
        title: `${posting.survey_title} | TheSurve`,
        description: posting.description || 'Participate in this student research survey. TheSurve connects student researchers with participants.',
        keywords: `${posting.course}, ${posting.school || ''}, student research, survey, academic research`,
        author: posting.submitter || undefined,
        ogType: 'article'
      })
    }
  },
  notFoundComponent: NotFoundComponent,
  pendingComponent: PendingComponenet,
  component: RouteComponent,
})

function PendingComponenet() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-bold text-blue-600 sm:text-5xl">Loading...</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                Survey is loading
              </h1>
              <p className="mt-3 text-base text-gray-500">
                Please wait while we load the survey details.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-bold text-blue-600 sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                Survey not found
              </h1>
              <p className="mt-3 text-base text-gray-500">
                The survey you're looking for may have been removed or is not yet approved.
              </p>
            </div>
            <div className="mt-8 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse available surveys
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function formatDescriptionAsMarkdown(description: string | undefined | null) {  
  // Convert to HTML using marked and sanitize with DOMPurify
  const html = marked(description ?? '', { async: false })
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

function RelatedSurveyCard({ posting }: { posting: ItemsThesurvePostings }) {
  return (
    <Link
      to="/postings/$post_id"
      params={{ post_id: posting.id || '' }}
      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
    >
      <div className="text-xs text-gray-500 mb-1 truncate max-w-full">
        <span className="inline-block max-w-[200px] truncate align-bottom">
          {posting.course}
        </span>
      </div>
      <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
        {posting.survey_title}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-1">{posting.description}</p>
    </Link>
  )
}

function RelatedSurveyCardSkeleton() {
  return (
    <div className="block bg-gray-50 rounded-lg p-4 animate-pulse">
      <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-3/4 bg-gray-300 rounded mb-1"></div>
      <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
    </div>
  )
}

function EmptyRelatedState() {
  const { posting } = Route.useLoaderData()

  return (
    <div className="text-center py-8 px-4">
      <svg
        className="mx-auto h-10 w-10 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
      <h3 className="mt-3 text-sm font-medium text-gray-900">No related surveys yet</h3>
      <p className="mt-2 text-sm text-gray-500">
        Be the first to add a survey for {posting.school || posting.course}
      </p>
      <div className="mt-4">
        <PostFormDialog variant="outline" size="sm" />
      </div>
    </div>
  )
}

function RouteComponent() {
  const { posting } = Route.useLoaderData()
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const locationHref = buildUrl()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(locationHref)
      setShowCopiedMessage(true)
      setTimeout(() => setShowCopiedMessage(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  React.useEffect(() => {
    logPageView({
      page_title: `Survey: ${posting.survey_title}`,
      course: posting.course,
      school: posting.school,
      posting_id: posting.id
    });
  }, [posting]);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(locationHref)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(locationHref)}&text=${encodeURIComponent(posting.survey_title!)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(locationHref)}`,
  }

  const formattedDescription = formatDescriptionAsMarkdown(posting.description)

  // Query for related surveys
  const { data: relatedSurveys, isLoading } = useQuery({
    ...readItemsThesurvePostingsOptions({
      query: {
        limit: 3,
        fields: ['id', 'course', 'school', 'survey_title', 'description'],
        filter: {
          ...(posting.school ? {
            '_or': [{
              course: {
                '_eq': posting.course,
              },
            }, { 
              school: { 
                '_eq': posting.school 
              } 
            }]
          } : {
            course: {
              '_eq': posting.course,
            },
          }),
          id: {
            '_neq': posting.id,
          }
        }
      },
    }),
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Add All Surveys link */}
        <div className="mb-4">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center w-fit"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            All Surveys
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 md:p-8 border-b">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0 w-full">
                <div className="space-y-1 mb-2">
                  <div className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-medium text-sm max-w-full truncate">
                    <span className="inline-block max-w-full truncate align-bottom">
                      {posting.course}
                    </span>
                  </div>
                  {posting.school && (
                    <div className="text-sm text-gray-600">
                      {posting.school}
                    </div>
                  )}
                </div>
                
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {posting.survey_title}
                </h1>

                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  {posting.submitter && (
                    <div className="flex flex-wrap items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{posting.submitter}</span>
                      {posting.submitter_email && (
                        <a href={`mailto:${posting.submitter_email}`} className="text-blue-600 hover:text-blue-800">
                          ({posting.submitter_email})
                        </a>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Anonymous Participation
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(posting.estimated_time!)}
                    </div>
                  </div>
                </div>
              </div>

              {posting.survey_link && (
                <div className="text-center w-full sm:w-auto">
                  <a
                    href={posting.survey_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Participate Now
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <div className="text-xs text-gray-500 mt-2">Opens in a new window</div>
                  <ReportFormDialog posting={posting} variant="ghost">
                    <button className="mt-4 text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center justify-center mx-auto gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Report this survey
                    </button>
                  </ReportFormDialog>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div 
              className="prose prose-gray prose-sm sm:prose-base max-w-none
                prose-headings:text-gray-900 prose-headings:font-semibold
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:text-gray-600 prose-ol:text-gray-600
                prose-li:marker:text-gray-400
                prose-blockquote:text-gray-700 prose-blockquote:border-l-blue-200
                prose-hr:border-gray-200
                prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                prose-pre:bg-gray-800 prose-pre:text-gray-100"
            >
              <div dangerouslySetInnerHTML={{ __html: formattedDescription }} />
            </div>

            {posting.survey_link && (
              <div className="mt-6 sm:mt-8">
                <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
                  <h3 className="text-base font-semibold text-blue-900 mb-2">
                    Ready to Participate?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your feedback will help improve support for others. The survey takes {formatTime(posting.estimated_time!, 'long')} to complete.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <a
                      href={posting.survey_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium gap-2 text-sm sm:text-base"
                    >
                      Participate Now
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <div className="flex items-center justify-center gap-2">
                      {Object.entries(shareLinks).map(([platform, link]) => (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            {platform === 'facebook' && <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>}
                            {platform === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>}
                            {platform === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>}
                          </svg>
                        </a>
                      ))}
                      <button
                        onClick={handleCopyLink}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                      </button>
                      {showCopiedMessage && (
                        <span className="text-sm text-green-600">Copied!</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-blue-700 mt-2 text-left">Opens in a new window</div>
                </div>
              </div>
            )}

            <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                Related Surveys
              </h2>

              {isLoading ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <RelatedSurveyCardSkeleton />
                  <RelatedSurveyCardSkeleton />
                  <RelatedSurveyCardSkeleton />
                </div>
              ) : (relatedSurveys?.data ?? []).length > 0 ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {(relatedSurveys?.data ?? []).map((survey) => (
                    <RelatedSurveyCard key={survey.id} posting={survey} />
                  ))}
                </div>
              ) : (
                <EmptyRelatedState />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Hero Banner */}
      <div className="sticky bottom-0 z-10">
        <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 text-white bg-repeat [background-size:40px]"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Connect with Participants</h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Get valuable responses for your research study. 
                  TheSurve helps student researchers find participants easily.
                </p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <PostFormDialog variant="secondary" className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
