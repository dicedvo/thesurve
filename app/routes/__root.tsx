import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { createServerFn, Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { Footer } from '~/components/Footer'
import { NotFound } from '~/components/NotFound'
import { Toaster } from '~/components/ui/toaster'
import { apiClientConfig } from '~/lib/api'
import { client } from '~/oapi_client/client.gen'
import appCss from '~/styles/app.css?url'
import { firebaseConfig, initializeFirebase } from '~/utils/firebase'
import { seo } from '~/utils/seo'
import { buildUrl } from '~/utils/url'

interface AppContext {
  queryClient: QueryClient
}

const $getSessionConfig = createServerFn()
  .handler(() => ({ 
    apiClientConfig, 
    firebaseConfig
  }) as { 
    apiClientConfig: { baseURL: string, headers: { Authorization: string } },
    firebaseConfig: { apiKey: string, projectId: string, appId: string }
  });

export const Route = createRootRouteWithContext<AppContext>()({
  beforeLoad: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ["__root"],
      queryFn: async () => {
        const config = await $getSessionConfig();
        return {
          config,
        };
      },
    }),
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
        image: buildUrl('/og.png'),
      }),
    ],
    links: [
      { rel: 'manifest', href: buildUrl('/site.webmanifest') },
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
  const { config } = Route.useRouteContext();

  React.useEffect(() => {
    if (config) {
      client.setConfig(config.apiClientConfig);
      initializeFirebase(config.firebaseConfig);
    }
  }, [config]);

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
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
