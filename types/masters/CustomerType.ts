
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
  address?: string
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
  remark?: string
  pic?: string | null
  status?: number

  owner_name?: string
  owner_phone?: string
  owner_email?: string
  category_type_id?: number
  contract_date?: string
  is_contract?: number
  pic_name?: string
  pic_phone?: string
  pic_emails?: CustomerPICEmailType[]

  customer_contracts?: FormCustomerContractsType[]
}

export type FormCustomerContractsType = {
  id?: number | null | undefined
  product_id?: number
  item_name?: string
  item_code?: string
  agree_at?: string
  due_at?: string
  price?: number
  payment_type_id?: number

  qty?: number
  installation_at?: string
  warranty_at?: string
  remark?: string
}

export type CustomerPICEmailType = {
  id?: number | null | undefined
  name?: string
  is_main?: number
}
