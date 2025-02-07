import { Button, ButtonProps } from "~/components/ui/button"
import { Link } from "@tanstack/react-router"

export function PostFormDialog(props: ButtonProps) {
  return (
    <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold" {...props}>
      <Link to="/post">
        Post your survey
        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </Button>
  )
}
