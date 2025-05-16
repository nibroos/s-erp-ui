import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"

export type IndexInvoiceAdjustmentType = {
  id: number
  customer_id: number | null
  currency_id: number | null
  branch_id: number | null
  bank_id: number | null
  invoice_no: string
  payment_date: string | null
  payment_amount: number | null
  exchange_rate: number | null
  reference: string | null
  ref_start_date: string | null
  ref_end_date: string | null
  remark: string | null
  rev_no: number | null
  total_invoice: number | null
  total_adjustment: number | null
  total_balance: number | null
  total_admin_bank: number | null
  grand_total: number | null
  created_by_id: number | null
  updated_by_id: number | null
  deleted_by_id: number | null
  created_by_name: string | null
  updated_by_name: string | null
  deleted_by_name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  currency_name: string | null
  customer_name: string | null
  branch_name: string | null
  bank_name: string | null

  adjustment_dts?: InvoiceAdjustmentDtType[] | null
}

export type FormInvoiceAdjustmentType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  currency_id?: number | null
  branch_id?: number | null
  bank_id?: number | null
  invoice_no?: string
  payment_date: string
  payment_amount: number
  exchange_rate?: number | null
  reference?: string | null
  ref_start_date?: string | null
  ref_end_date?: string | null
  remark?: string
  rev_no?: number | null
  total_invoice: number
  total_adjustment: number
  total_balance: number
  total_admin_bank: number
  grand_total: number
  adjustment_dts: InvoiceAdjustmentDtType[]

  email?: string
  phone?: string
  address?: string

  summary?: Record<string, SummaryPartType>

  customer_code?: string
  currency_code?: string
  branch_code?: string
  bank_code?: string
}

export type InvoiceAdjustmentDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  invoice_uuid: string
  invoice_adjustment_id?: number | null
  ref_id: number
  ref_type: InvoiceAdjustmentRefType
  ref_json?: any
  invoice_no: string
  invoice_date: string
  invoice_amount: number
  total_adjustment: number
  balance_amount: number
  adjustment_amount: number
  admin_bank: number
  total_amount: number
  selected?: boolean

  created_by_id?: number | null
  updated_by_id?: number | null
  deleted_by_id?: number | null
  created_by_name?: string | null
  updated_by_name?: string | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
}

export type InvoiceAdjustmentRefType = 'sales_invoice' | 'invoice_dp' | 'invoice_maintenance'

export type FormInvoiceAdjustmentDtRefType = FormInvoiceAdjustmentDtInvoiceType

export type QInvoiceAdjustmentIndexType = {
  page: number
  per_page: number
  parent_ids?: number[]
  global?: string
  order_column?: string
  order_direction?: string
}

export type QIndexInvoicesType = {
  page: number
  per_page: number
  invoice_ids?: number[] | null
  customer_ids?: number[] | null
  customer_id?: number | null
  order_column?: string
  order_direction?: string
  invoice_no?: string
  global?: string
  ref_start_date?: string
  ref_end_date?: string
}

export type FormInvoiceAdjustmentDtInvoiceType = {
  id?: number | null
  invoice_uuid: string
  invoice_adjustment_id?: number | null
  ref_id: number
  ref_type: InvoiceAdjustmentRefType
  invoice_no: string
  invoice_date: string
  invoice_amount: number
  total_adjustment: number
  balance_amount: number
  adjustment_amount: number
  admin_bank: number
  total_amount: number

  customer_id?: number | null
  customer_name?: string | null
  currency_id?: number | null
  currency_name?: string | null
}
