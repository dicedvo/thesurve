import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Footer } from '~/components/Footer'
import { CommonHeader } from '~/components/CommonHeader'

export const Route = createFileRoute('/_with_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <CommonHeader headerClassName="relative bg-blue-900 text-white" />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
