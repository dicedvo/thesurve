import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "~/hooks/use-toast"
import { createItemsThesurveReports } from "~/oapi_client/sdk.gen"
import type { ItemsThesurvePostings } from "~/oapi_client/types.gen"
import { zItemsThesurveReports } from "~/oapi_client/zod.gen"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { createItemsThesurveReportsMutation } from "~/oapi_client/@tanstack/react-query.gen"

const reportFormSchema = zItemsThesurveReports.extend({
  reporter_name: z.string().min(1, "Name is required"),
  reporter_email: z.string().email("Invalid email address"),
  report_description: z.string().min(10, "Please provide more details about the issue"),
})

type ReportFormData = z.infer<typeof reportFormSchema>

interface ReportFormDialogProps {
  posting: ItemsThesurvePostings
  children?: React.ReactNode
  variant?: "outline" | "ghost" | "link" | undefined
  className?: string
}

export function ReportFormDialog({ posting, children, variant, className }: ReportFormDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const mutation = useMutation(createItemsThesurveReportsMutation())

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reporter_name: "",
      reporter_email: "",
      report_description: "",
    },
    disabled: mutation.isPending,
  })

  const onSubmit = async (data: ReportFormData) => {
    mutation.mutate(
      {
        body: {
          ...data,
          reported_posting: posting.id,
        },
      },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
          toast({
            title: "Report Submitted",
            description: "Thank you for your report. We will review it shortly.",
            variant: "default",
          })
        },
        onError: () => {
          toast({
            title: "Failed to Submit Report",
            description: "An error occurred while submitting your report. Please try again.",
            variant: "destructive",
          })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={variant} className={className}>
            Report this Survey
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Survey</DialogTitle>
          <DialogDescription>
            Please provide details about why you're reporting this survey.
            We'll review your report and take appropriate action.
          </DialogDescription>
        </DialogHeader>

        <Card className="my-4 bg-muted/50">
          <CardHeader className="py-3">
            <div className="text-sm font-medium">Reporting Survey:</div>
          </CardHeader>
          <CardContent className="py-3">
            <div className="space-y-1">
              <h4 className="font-medium leading-none">{posting.survey_title}</h4>
              <p className="text-sm text-muted-foreground">
                {posting.description?.slice(0, 100)}
                {posting.description && posting.description.length > 100 ? '...' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reporter_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reporter_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll only use this to follow up on your report if necessary.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="report_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe why you're reporting this survey..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
