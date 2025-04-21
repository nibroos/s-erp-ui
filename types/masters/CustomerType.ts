
export type CustomerType = {
  id?: number | null | undefined | string | string[]
  customer_type_id?: number
  agent_id?: number
  currency_id?: number
  name?: string
  code?: string
  phone?: string
  email?: string
  shortname?: string
  status?: number
  created_by_name?: string
  updated_by_name?: string
  created_at?: string
  updated_at?: string
}

export type FormCustomerType = {
  id?: number | null | undefined | string | string[]
  customer_type_id?: number | null
  agent_id?: number | null
  currency_id?: number | null
  name: string
  code?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  shortname?: string | null
  remark?: string | null
  pic?: string | null
  status?: number
}
