import { zodResolver } from "@hookform/resolvers/zod"
import debounce from "lodash/debounce"
import { useCallback, useState, useRef, useEffect, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { useToast } from "~/hooks/use-toast"
import { ItemsThesurvePostings } from '~/oapi_client'
import { createItemsThesurvePostingsMutation, readItemsThesurvePostingsOptions } from "~/oapi_client/@tanstack/react-query.gen"
import { zItemsThesurvePostings } from "~/oapi_client/zod.gen"
import { Collapsible, CollapsibleContent } from "~/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "~/lib/utils"
import { seo } from '~/utils/seo'
import { logPageView } from '~/utils/firebase'

const formSchema = zItemsThesurvePostings.extend({
  id: z.undefined(),
  survey_title: z.string().min(1, "Title is required"),
  course: z.string().min(1, "Course is required"),
  school: z.string().min(1, "School is required"),
  description: z.string().min(30, "Please provide a detailed description (minimum 30 characters)"),
  survey_link: z.string().url("Must be a valid URL"),
  submitter_email: z.string().email("Must be a valid email"),
  estimated_time: z.string().min(1, "Please select estimated completion time").default("0:05:00"),
  submitter: z.string().min(1, "Name is required"),
})

export const Route = createFileRoute('/_with_layout/post')({
  component: PostForm,
  head: () => ({
    meta: seo({
      title: 'Share Your Survey | TheSurve',
      description: 'Share your academic research survey with student participants. Connect with research participants and gather valuable data for your study.',
      keywords: 'post survey, share survey, student research, academic research',
      ogType: 'website'
    })
  }),
})

function SurveyGuideCollapsible({ open, onOpenChange }: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="w-full">
      <CollapsibleContent className="mt-3 text-sm bg-slate-50 rounded-md p-4">
        <div className="space-y-4">
          <div className="pb-3 border-b">
            <h3 className="font-medium mb-2">Good Example:</h3>
            <p className="text-blue-800">
              "I'm researching how social media affects students' mental health and academic performance. This survey asks about your social media usage patterns and stress levels during the semester. Looking for university students who use social media daily. Your responses will help develop better support systems for students struggling with social media-related stress."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Key Elements:</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>What your survey is about</li>
                <li>Who should participate</li>
                <li>How the results will help</li>
                <li>Completion time</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Tips:</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Be clear and concise</li>
                <li>Show the importance</li>
                <li>Mention incentives</li>
                <li>Use friendly language</li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ContentPolicy() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
      <h4 className="font-medium mb-2">Content Policy Notice</h4>
      <p>
        By submitting this survey, you acknowledge that:
      </p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li>Your submission must be for legitimate academic research purposes</li>
        <li>Spam, commercial surveys, or inappropriate content will be removed</li>
        <li>Administrators reserve the right to review, remove, or report any submission that violates these guidelines</li>
        <li>Repeated violations may result in account restrictions</li>
      </ul>
    </div>
  )
}

function RequiredField() {
  return <span className="text-red-500 ml-1">*</span>
}

function AutocompleteInput({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  isLoading,
}: {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string) => void
  suggestions: string[]
  placeholder: string
  isLoading?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasTyped, setHasTyped] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault()
      onSelect(suggestions[focusedIndex])
      setIsOpen(false)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    setFocusedIndex(-1)
  }, [suggestions])

  const handleBlur = useCallback(() => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }, [])

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
          setHasTyped(true)
        }}
        autoComplete="off"
        autoCorrect="off"
        onFocus={() => {
          setIsOpen(true)
          setHasTyped(false)
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-auto">
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                    focusedIndex === index && "bg-gray-100"
                  )}
                  onClick={() => {
                    onSelect(suggestion)
                    setIsOpen(false)
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-sm">
              {!hasTyped ? (
                <span className="text-gray-500">Start typing to search...</span>
              ) : (
                <div className="flex items-center space-x-1.5 px-1">
                  <span className="text-gray-600 shrink-0">Add</span>
                  <span className="font-medium text-blue-600 truncate">{value}</span>
                  <span className="text-gray-600 shrink-0">as new entry</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PostForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [schoolInput, setSchoolInput] = useState("")
  const [courseInput, setCourseInput] = useState("")
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  const mutation = useMutation({
    ...createItemsThesurvePostingsMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readItemsThesurvePostings'] })
      navigate({ to: '/' })
      toast({
        title: "Survey Published! ✅",
        description: "Your survey has been successfully published and is now visible to other students.",
        duration: 6000,
      })
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      survey_title: "",
      course: "",
      school: "",
      description: "",
      survey_link: "",
      submitter_email: "",
      estimated_time: "0:05:00",
      submitter: "",
      date_created: undefined,
      date_updated: undefined,
      id: undefined
    },
    disabled: mutation.isPending
  })

  const debouncedSchoolSearch = useMemo(() => debounce(setSchoolInput, 300), [])
  const debouncedCourseSearch = useMemo(() => debounce(setCourseInput, 300), [])

  const schoolQuery = useQuery({
    ...readItemsThesurvePostingsOptions({
      query: {
        'groupBy[]': 'school',
        fields: ['school'],
        filter: JSON.stringify({
          school: {
            '_icontains': schoolInput
          }
        }),
        limit: 5
      } as unknown as Record<string, unknown>
    }),
    enabled: schoolInput.length > 2
  })

  const courseQuery = useQuery({
    ...readItemsThesurvePostingsOptions({
      query: {
        'groupBy[]': 'course',
        fields: ['course'],
        filter: JSON.stringify({
          course: {
            '_icontains': courseInput
          }
        }),
        limit: 5
      } as unknown as Record<string, unknown>
    }),
    enabled: courseInput.length > 2
  })

  useEffect(() => {
    logPageView({
      page_title: 'Post Survey'
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Share Your Survey</h1>
        <p className="text-gray-600">
          Connect with participants by sharing clear details about your study.
          The more information you provide, the better response you'll receive.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(
          (values) => mutation.mutate({ body: values as unknown as ItemsThesurvePostings }),
        )} className="space-y-6">
          {/* Survey URL Card */}
          <div className="bg-white rounded-lg border shadow-sm">
            <FormField
              control={form.control}
              name="survey_link"
              render={({ field }) => (
                <FormItem className="p-6">
                  <FormLabel className="text-lg font-medium">Survey URL<RequiredField /></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://forms.google.com/..."
                      {...field}
                      className="text-lg mt-2"
                    />
                  </FormControl>
                  <FormDescription className="mt-2 text-sm">
                    Paste the full URL to your survey (Google Forms, Microsoft Forms, Qualtrics, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <p className="text-sm text-gray-500">Help others understand your research</p>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="survey_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Survey Title<RequiredField /></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Impact of Social Media on Student Mental Health" {...field} />
                      </FormControl>
                      <FormDescription>
                        Make it clear and descriptive to attract relevant participants
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell Us About Your Survey<RequiredField /></FormLabel>
                      <div className="space-y-2">
                        <FormControl>
                          <Textarea
                            placeholder="Describe what your survey is about, who should take it, and how it will help. Be friendly and clear!"
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <button type="button" onClick={() => setIsGuideOpen(v => !v)} className="flex items-center gap-1">
                              <span className="text-xs text-blue-600 hover:text-blue-700">See example and writing tips</span>
                              <ChevronDownIcon className="h-3 w-3" />
                            </button>

                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              field.value.length < 50 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            )}>
                              {field.value.length}/50
                            </span>
                          </div>

                          <SurveyGuideCollapsible open={isGuideOpen} onOpenChange={setIsGuideOpen} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Time to Complete<RequiredField /></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0:05:00">5 minutes</SelectItem>
                          <SelectItem value="0:10:00">10 minutes</SelectItem>
                          <SelectItem value="0:15:00">15 minutes</SelectItem>
                          <SelectItem value="0:20:00">20 minutes</SelectItem>
                          <SelectItem value="0:30:00">30 minutes</SelectItem>
                          <SelectItem value="1:00:00">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Be honest - this helps set expectations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Academic & Contact Information Card */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Academic & Contact Information</h3>
                <p className="text-sm text-gray-500">Tell us about yourself and your institution</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>School/University<RequiredField /></FormLabel>
                        <AutocompleteInput
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                            debouncedSchoolSearch(value)
                          }}
                          onSelect={(value) => field.onChange(value)}
                          suggestions={schoolQuery.data?.data?.map(item => item.school) || []}
                          placeholder="International State College of the Philippines"
                          isLoading={schoolQuery.isFetching}
                        />
                        <FormDescription>
                          Full university name (no abbreviations)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Program/Major<RequiredField /></FormLabel>
                        <AutocompleteInput
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                            debouncedCourseSearch(value)
                          }}
                          onSelect={(value) => field.onChange(value)}
                          suggestions={courseQuery.data?.data?.map(item => item.course) || []}
                          placeholder="e.g., Bachelor of Computer Science"
                          isLoading={courseQuery.isFetching}
                        />
                        <FormDescription>
                          Your full degree program or major
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="submitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name<RequiredField /></FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="submitter_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Email<RequiredField /></FormLabel>
                        <FormControl>
                          <Input placeholder="your.name@university.edu" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use your institutional email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section Card */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex flex-col items-stretch">
                <div className="flex-1 pb-4">
                  <ContentPolicy />
                </div>
                <div className="w-full flex justify-end space-x-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate({ to: '/' })}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Submit Survey"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
