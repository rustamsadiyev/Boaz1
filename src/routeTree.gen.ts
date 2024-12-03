/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as MainImport } from './routes/_main'
import { Route as AuthImport } from './routes/_auth'
import { Route as MainIndexImport } from './routes/_main/index'
import { Route as MainWarehouseImport } from './routes/_main/warehouse'
import { Route as MainProfileImport } from './routes/_main/profile'
import { Route as MainBasketImport } from './routes/_main/basket'
import { Route as AuthAuthImport } from './routes/_auth/auth'
import { Route as MainCategoriesIndexImport } from './routes/_main/categories/index'
import { Route as MainProductsProductImport } from './routes/_main/products/$product'

// Create Virtual Routes

const AdminProductsLazyImport = createFileRoute('/admin/products')()

// Create/Update Routes

const MainRoute = MainImport.update({
  id: '/_main',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const MainIndexRoute = MainIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => MainRoute,
} as any)

const AdminProductsLazyRoute = AdminProductsLazyImport.update({
  id: '/admin/products',
  path: '/admin/products',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/admin/products.lazy').then((d) => d.Route)
)

const MainWarehouseRoute = MainWarehouseImport.update({
  id: '/warehouse',
  path: '/warehouse',
  getParentRoute: () => MainRoute,
} as any)

const MainProfileRoute = MainProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => MainRoute,
} as any)

const MainBasketRoute = MainBasketImport.update({
  id: '/basket',
  path: '/basket',
  getParentRoute: () => MainRoute,
} as any)

const AuthAuthRoute = AuthAuthImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => AuthRoute,
} as any)

const MainCategoriesIndexRoute = MainCategoriesIndexImport.update({
  id: '/categories/',
  path: '/categories/',
  getParentRoute: () => MainRoute,
} as any)

const MainProductsProductRoute = MainProductsProductImport.update({
  id: '/products/$product',
  path: '/products/$product',
  getParentRoute: () => MainRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_main': {
      id: '/_main'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof MainImport
      parentRoute: typeof rootRoute
    }
    '/_auth/auth': {
      id: '/_auth/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthAuthImport
      parentRoute: typeof AuthImport
    }
    '/_main/basket': {
      id: '/_main/basket'
      path: '/basket'
      fullPath: '/basket'
      preLoaderRoute: typeof MainBasketImport
      parentRoute: typeof MainImport
    }
    '/_main/profile': {
      id: '/_main/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof MainProfileImport
      parentRoute: typeof MainImport
    }
    '/_main/warehouse': {
      id: '/_main/warehouse'
      path: '/warehouse'
      fullPath: '/warehouse'
      preLoaderRoute: typeof MainWarehouseImport
      parentRoute: typeof MainImport
    }
    '/admin/products': {
      id: '/admin/products'
      path: '/admin/products'
      fullPath: '/admin/products'
      preLoaderRoute: typeof AdminProductsLazyImport
      parentRoute: typeof rootRoute
    }
    '/_main/': {
      id: '/_main/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof MainIndexImport
      parentRoute: typeof MainImport
    }
    '/_main/products/$product': {
      id: '/_main/products/$product'
      path: '/products/$product'
      fullPath: '/products/$product'
      preLoaderRoute: typeof MainProductsProductImport
      parentRoute: typeof MainImport
    }
    '/_main/categories/': {
      id: '/_main/categories/'
      path: '/categories'
      fullPath: '/categories'
      preLoaderRoute: typeof MainCategoriesIndexImport
      parentRoute: typeof MainImport
    }
  }
}

// Create and export the route tree

interface AuthRouteChildren {
  AuthAuthRoute: typeof AuthAuthRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthAuthRoute: AuthAuthRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

interface MainRouteChildren {
  MainBasketRoute: typeof MainBasketRoute
  MainProfileRoute: typeof MainProfileRoute
  MainWarehouseRoute: typeof MainWarehouseRoute
  MainIndexRoute: typeof MainIndexRoute
  MainProductsProductRoute: typeof MainProductsProductRoute
  MainCategoriesIndexRoute: typeof MainCategoriesIndexRoute
}

const MainRouteChildren: MainRouteChildren = {
  MainBasketRoute: MainBasketRoute,
  MainProfileRoute: MainProfileRoute,
  MainWarehouseRoute: MainWarehouseRoute,
  MainIndexRoute: MainIndexRoute,
  MainProductsProductRoute: MainProductsProductRoute,
  MainCategoriesIndexRoute: MainCategoriesIndexRoute,
}

const MainRouteWithChildren = MainRoute._addFileChildren(MainRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof MainRouteWithChildren
  '/auth': typeof AuthAuthRoute
  '/basket': typeof MainBasketRoute
  '/profile': typeof MainProfileRoute
  '/warehouse': typeof MainWarehouseRoute
  '/admin/products': typeof AdminProductsLazyRoute
  '/': typeof MainIndexRoute
  '/products/$product': typeof MainProductsProductRoute
  '/categories': typeof MainCategoriesIndexRoute
}

export interface FileRoutesByTo {
  '': typeof AuthRouteWithChildren
  '/auth': typeof AuthAuthRoute
  '/basket': typeof MainBasketRoute
  '/profile': typeof MainProfileRoute
  '/warehouse': typeof MainWarehouseRoute
  '/admin/products': typeof AdminProductsLazyRoute
  '/': typeof MainIndexRoute
  '/products/$product': typeof MainProductsProductRoute
  '/categories': typeof MainCategoriesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth': typeof AuthRouteWithChildren
  '/_main': typeof MainRouteWithChildren
  '/_auth/auth': typeof AuthAuthRoute
  '/_main/basket': typeof MainBasketRoute
  '/_main/profile': typeof MainProfileRoute
  '/_main/warehouse': typeof MainWarehouseRoute
  '/admin/products': typeof AdminProductsLazyRoute
  '/_main/': typeof MainIndexRoute
  '/_main/products/$product': typeof MainProductsProductRoute
  '/_main/categories/': typeof MainCategoriesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/auth'
    | '/basket'
    | '/profile'
    | '/warehouse'
    | '/admin/products'
    | '/'
    | '/products/$product'
    | '/categories'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/auth'
    | '/basket'
    | '/profile'
    | '/warehouse'
    | '/admin/products'
    | '/'
    | '/products/$product'
    | '/categories'
  id:
    | '__root__'
    | '/_auth'
    | '/_main'
    | '/_auth/auth'
    | '/_main/basket'
    | '/_main/profile'
    | '/_main/warehouse'
    | '/admin/products'
    | '/_main/'
    | '/_main/products/$product'
    | '/_main/categories/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthRoute: typeof AuthRouteWithChildren
  MainRoute: typeof MainRouteWithChildren
  AdminProductsLazyRoute: typeof AdminProductsLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthRoute: AuthRouteWithChildren,
  MainRoute: MainRouteWithChildren,
  AdminProductsLazyRoute: AdminProductsLazyRoute,
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
        "/_auth",
        "/_main",
        "/admin/products"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/auth"
      ]
    },
    "/_main": {
      "filePath": "_main.tsx",
      "children": [
        "/_main/basket",
        "/_main/profile",
        "/_main/warehouse",
        "/_main/",
        "/_main/products/$product",
        "/_main/categories/"
      ]
    },
    "/_auth/auth": {
      "filePath": "_auth/auth.tsx",
      "parent": "/_auth"
    },
    "/_main/basket": {
      "filePath": "_main/basket.tsx",
      "parent": "/_main"
    },
    "/_main/profile": {
      "filePath": "_main/profile.tsx",
      "parent": "/_main"
    },
    "/_main/warehouse": {
      "filePath": "_main/warehouse.tsx",
      "parent": "/_main"
    },
    "/admin/products": {
      "filePath": "admin/products.lazy.tsx"
    },
    "/_main/": {
      "filePath": "_main/index.tsx",
      "parent": "/_main"
    },
    "/_main/products/$product": {
      "filePath": "_main/products/$product.tsx",
      "parent": "/_main"
    },
    "/_main/categories/": {
      "filePath": "_main/categories/index.tsx",
      "parent": "/_main"
    }
  }
}
ROUTE_MANIFEST_END */
