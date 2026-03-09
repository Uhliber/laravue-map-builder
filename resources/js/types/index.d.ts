import type { Side } from "@floating-ui/vue"

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
}

export interface Map {
  id: number
  name: string
  base_src: string
  pointers_count: number
  created_at: {
    date: string
    human: string
  }
}

export interface MapPreview {
  base_src: string
  pointers: MapPointer[]
}

export interface MapFormData {
  base: MapBaseAsset
  pointers: MapPointer[]
}
export interface MapPointer {
  id: string
  name: string
  category: string
  src?: string
  asset_src?: string
  fileType: string
  x: number
  y: number
  width?: number | null
  height?: number | null
  title?: string
  description?: string
  link?: string
  target?: string
  trigger?: "hover" | "click" | "always" | "disabled"
  placement?: Side
  offset?: number
  animate?: boolean
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

export type MapBaseAsset = {
  id?: string
  src?: string
  naturalWidth?: number
  naturalHeight?: number
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
