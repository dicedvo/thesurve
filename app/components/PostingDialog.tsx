import { Dialog, DialogContent } from "~/components/ui/dialog"
import type { PostingsResponse } from "~/oapi_client/types.gen"

interface PostingDialogProps {
  posting: PostingsResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostingDialog({ posting, open, onOpenChange }: PostingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                {posting.Course}
              </span>
              {posting.School && (
                <span>• {posting.School}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {posting['Study Name / Survey Title']}
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              {posting.Description}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">Quick Info</h3>
                <p className="text-sm text-gray-500">What you need to know</p>
              </div>
              <span className="text-sm text-gray-500">~5 mins to complete</span>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Anonymous participation
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Added recently
              </li>
            </ul>
          </div>

          {posting['Survey Link'] && (
            <div className="text-center">
              <a
                href={posting['Survey Link']}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Survey
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <p className="text-sm text-gray-500 mt-4">
                You'll be redirected to an external survey form
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
