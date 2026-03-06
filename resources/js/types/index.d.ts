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
  fileType: string
  x: number | null
  y: number | null
  title?: string
  description?: string
  link?: string
  target?: string
  trigger?: "hover" | "click" | "always" | "disabled"
  placement?: string
  offset?: number
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
