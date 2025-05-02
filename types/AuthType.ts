export type AuthResponseType = {
  data?: AuthDataType
  message: string
  cookie: string
}

export type AuthDataType = {
  uuid?: string | null
  email?: string
  first_name?: string
  last_name?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
  expiresIn?: number
  token?: string | null
}

export type FormLoginType = {
  email: string
  password: string
  first_name?: string
}


export type AuthUserType = {
  data?: AuthUserDataType | null
  meta?: AuthUserMetaType
  message?: string
  status?: number
  errors?: any
  optional?: AuthUserOptionalType
}

export type AuthUserDataType = {
  id: number
  branch_id: number
  warehouse_id?: number
  branch_name: string
  name: string
  username: string
  email: string
  address: string
  password: string
  avatar_url: string
  roles: string[]
  permissions: any
  created_at: any
}

export type AuthUserMetaType = {
  total: number
  per_page: number
  current_page: number
  last_page: number
}

export type AuthUserOptionalType = {
  token: string | null
  expired_at: string | null
}
