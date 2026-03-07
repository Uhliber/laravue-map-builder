import type { Side } from "@floating-ui/vue"

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
}

export interface MapPointer {
  id: string
  name: string
  category: string
  src?: string
  fileType: string
  x: number | null
  y: number | null
  title?: string
  description?: string
  link?: string
  target?: string
  trigger?: "hover" | "click" | "always" | "disabled"
  placement?: Side
  offset?: number
  animate?: boolean
  visible?: boolean
}

export type MapAssetCategory = "base" | "pointers"

export type MapAssetSubcategory = "basic" | "dots" | "landmarks" | null

export type MapAsset = {
  id: string
  name: string
  category: MapAssetCategory
  subcategory: MapAssetSubcategory
  src: string
  fileType: "jpg" | "png" | "svg"
}

export interface MapHighlightPointer {
  pointer: MapPointer
  style: Record<string, string | number>
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User
  }
  app: {
    author_url: string
  }
}
