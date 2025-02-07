import { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { Toaster } from '~/components/ui/toaster'
import { apiClientConfig } from '~/lib/api'
import { client } from '~/oapi_client/client.gen'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

interface AppContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<AppContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'TheSurve | Every Student Deserves Quality Research Data',
        description: 'TheSurve connects student researchers with willing participants. Share your survey, collect quality data, and help fellow students succeed in their research journey.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  React.useEffect(() => {
    client.setConfig(apiClientConfig);    
  }, []);

  return (
    <RootDocument>
      <Outlet />
      <Toaster />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        {children}
        {/* <TanStackRouterDevtools position="bottom-right" /> */}
        <Scripts />
      </body>
    </html>
  )
}
