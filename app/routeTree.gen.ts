/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WithlayoutImport } from './routes/_with_layout'
import { Route as WithlayoutIndexImport } from './routes/_with_layout/index'
import { Route as WithlayoutPostImport } from './routes/_with_layout/post'
import { Route as WithlayoutPostingsPostidImport } from './routes/_with_layout/postings.$post_id'

// Create/Update Routes

const WithlayoutRoute = WithlayoutImport.update({
  id: '/_with_layout',
  getParentRoute: () => rootRoute,
} as any)

const WithlayoutIndexRoute = WithlayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => WithlayoutRoute,
} as any)

const WithlayoutPostRoute = WithlayoutPostImport.update({
  id: '/post',
  path: '/post',
  getParentRoute: () => WithlayoutRoute,
} as any)

const WithlayoutPostingsPostidRoute = WithlayoutPostingsPostidImport.update({
  id: '/postings/$post_id',
  path: '/postings/$post_id',
  getParentRoute: () => WithlayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_with_layout': {
      id: '/_with_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof WithlayoutImport
      parentRoute: typeof rootRoute
    }
    '/_with_layout/post': {
      id: '/_with_layout/post'
      path: '/post'
      fullPath: '/post'
      preLoaderRoute: typeof WithlayoutPostImport
      parentRoute: typeof WithlayoutImport
    }
    '/_with_layout/': {
      id: '/_with_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof WithlayoutIndexImport
      parentRoute: typeof WithlayoutImport
    }
    '/_with_layout/postings/$post_id': {
      id: '/_with_layout/postings/$post_id'
      path: '/postings/$post_id'
      fullPath: '/postings/$post_id'
      preLoaderRoute: typeof WithlayoutPostingsPostidImport
      parentRoute: typeof WithlayoutImport
    }
  }
}

// Create and export the route tree

interface WithlayoutRouteChildren {
  WithlayoutPostRoute: typeof WithlayoutPostRoute
  WithlayoutIndexRoute: typeof WithlayoutIndexRoute
  WithlayoutPostingsPostidRoute: typeof WithlayoutPostingsPostidRoute
}

const WithlayoutRouteChildren: WithlayoutRouteChildren = {
  WithlayoutPostRoute: WithlayoutPostRoute,
  WithlayoutIndexRoute: WithlayoutIndexRoute,
  WithlayoutPostingsPostidRoute: WithlayoutPostingsPostidRoute,
}

const WithlayoutRouteWithChildren = WithlayoutRoute._addFileChildren(
  WithlayoutRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof WithlayoutRouteWithChildren
  '/post': typeof WithlayoutPostRoute
  '/': typeof WithlayoutIndexRoute
  '/postings/$post_id': typeof WithlayoutPostingsPostidRoute
}

export interface FileRoutesByTo {
  '/post': typeof WithlayoutPostRoute
  '/': typeof WithlayoutIndexRoute
  '/postings/$post_id': typeof WithlayoutPostingsPostidRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_with_layout': typeof WithlayoutRouteWithChildren
  '/_with_layout/post': typeof WithlayoutPostRoute
  '/_with_layout/': typeof WithlayoutIndexRoute
  '/_with_layout/postings/$post_id': typeof WithlayoutPostingsPostidRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/post' | '/' | '/postings/$post_id'
  fileRoutesByTo: FileRoutesByTo
  to: '/post' | '/' | '/postings/$post_id'
  id:
    | '__root__'
    | '/_with_layout'
    | '/_with_layout/post'
    | '/_with_layout/'
    | '/_with_layout/postings/$post_id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  WithlayoutRoute: typeof WithlayoutRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  WithlayoutRoute: WithlayoutRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_with_layout"
      ]
    },
    "/_with_layout": {
      "filePath": "_with_layout.tsx",
      "children": [
        "/_with_layout/post",
        "/_with_layout/",
        "/_with_layout/postings/$post_id"
      ]
    },
    "/_with_layout/post": {
      "filePath": "_with_layout/post.tsx",
      "parent": "/_with_layout"
    },
    "/_with_layout/": {
      "filePath": "_with_layout/index.tsx",
      "parent": "/_with_layout"
    },
    "/_with_layout/postings/$post_id": {
      "filePath": "_with_layout/postings.$post_id.tsx",
      "parent": "/_with_layout"
    }
  }
}
ROUTE_MANIFEST_END */
