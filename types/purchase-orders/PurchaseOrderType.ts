import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductBomListType, ProductListType } from "../masters/ProductType"

export type IndexPurchaseOrderType = {
  id: number
  customer_id: number | null
  purchase_type_id: number | null
  currency_id: number | null
  vat_id: number | null
  payment_term_id: number | null
  shipping_term_id: number | null
  pph23_id: number | null
  branch_id: number | null
  po_no: string
  po_date: string | null
  delivery_date: string | null
  shipping_destination: string
  remark: string | null
  is_vat?: number
  is_pph23?: number
  exchange_rate: number | null
  discount_percentage: number | null
  discount_amount: number | null
  discount_percentage_amount: number | null
  discount_final_header: number | null
  discount_amount_product: number | null
  discount_type: PoDtDiscType | null
  pph23_percentage: number | null
  vat_percentage: number | null
  total_amount_products: number | null
  subtotal: number | null
  total_qty: number | null
  total_discount: number | null
  total_pph23: number | null
  total_vat: number | null
  grand_total: number | null
  status: string
  created_by_id: number | null
  updated_by_id: number | null
  deleted_by_id: number | null
  created_by_name: string | null
  updated_by_name: string | null
  deleted_by_name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  product_id: string | null
  item_id: string | null
  po_dt_vat_id: string | null

  currency_name: string | null
  product_name: string | null
  item_name: string | null
  vat_name: string | null
  pph23_name: string | null
  po_dt_remark: string | null
  po_dt_bom_remark: string | null
}

export type FormPurchaseOrderType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  purchase_type_id?: number | null
  currency_id?: number | null
  vat_id?: number | null
  payment_term_id?: number | null
  shipping_term_id?: number | null
  pph23_id?: number | null
  branch_id?: number | null
  is_vat?: number
  is_pph23?: number
  po_no?: string
  po_date: string
  delivery_date: string
  shipping_destination?: string
  remark?: string | null
  status: string
  exchange_rate?: number | null
  discount_percentage: number
  discount_amount: number
  discount_percentage_amount: number
  discount_final_header: number
  discount_amount_product: number
  discount_type: PoDtDiscType | null
  pph23_percentage: number
  vat_percentage: number
  total_amount_products: number
  total_qty: number
  subtotal: number
  total_discount: number
  total_pph23: number
  total_vat: number
  grand_total: number
  po_dts: PoDtType[]

  email?: string
  phone?: string
  address?: string

  summary?: Record<string, SummaryPartType>
}

export type PoDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  product_uuid: string
  po_id?: number | null
  item_unit_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  ref_id: number
  product_id: number
  bom_id: number | null
  product_type: PoDtProductType
  product_json?: any
  ref_type: PoDtRefType
  ref_json?: any
  gen_code?: string | null
  remark?: string
  need_qty?: number
  qty: number
  price: number
  subtotal: number
  discount_amount: number
  discount_percentage?: number
  discount_percentage_num?: number
  discount_percentage_amount: number
  discount_final: number
  discount_type?: PoDtDiscType | null
  is_vat?: number
  is_pph23?: number
  total_amount: number
  vat_perc?: number
  vat_perc_am?: number
  pph23_perc?: number
  pph23_perc_am?: number
  expired_at: string

  code?: string
  name?: string
  unit_name?: string
  product_name?: string
  product_code?: string
  item_name?: string
  item_code?: string
}

export type PoDtsType = {
  id?: number | null | undefined | string | string[]
  product_uuid: string
  po_id?: number | null
  item_unit_id: number
  vat_id: number
  pph23_id: number
  ref_id: number
  product_id: number
  bom_id: number | null
  product_type: PoDtProductType
  product_json?: any
  ref_type: string
  ref_json?: any
  gen_code?: string | null
  remark?: string | null
  need_qty: number
  qty: number
  price: number
  subtotal: number
  discount_amount: number
  discount_percentage: number
  discount_percentage_num: number
  discount_percentage_amount: number
  discount_final: number
  discount_type: string
  is_vat: number
  is_pph23: number
  total_amount: number
}

export type PoDtDiscType = 'percentage' | 'amount' | 'all' | null

export type PoDtRefType = 'products' | 'so' | 'ro'

export type PoDtProductType = 'item' | 'product' | 'bom'

export type FormPoDtRefType = FormPoDtProductListType

export type ModalIndexProductFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexProductFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type QIndexType = {
  page: number
  per_page: number
  parent_ids: number[]
  global: string
  order_column: string
  order_direction: string
}

export type QIndexProductsType = {
  page: number
  per_page: number
  item_group_ids?: number[] | null
  item_sub_group_ids?: number[] | null
  code?: string
  name?: string
  sku?: string
  factory_code?: string
  order_column?: string
  order_direction?: string
}

export type VatModeType = 'header' | 'detail' | null

export type FormPoDtProductListType = ProductListType & PoDtsType & {
  ref_type: 'products' | 'so' | 'ro'
  product_type?: PoDtProductType
  customer_id?: number | null
  po_id?: number | null
  po_dt_id?: number | null
  vat_id?: number
  pph23_id?: number
  vat_percentage?: number
  pph23_percentage?: number
  is_vat?: number
  is_pph23?: number
  ref_id?: number
  need_qty?: number
  qty?: number
  discount_amount?: number
  discount_percentage?: number
  discount_percentage_num?: number
  discount_percentage_amount?: number
  discount_final?: number
  discount_type?: PoDtDiscType | null
  total_amount?: number

  purchase_type_id?: number | null
  currency_id?: number | null
  exchange_rate?: number | null
  head_vat_id?: number | null
  head_vat_percentage?: number | null
  head_pph23_id?: number | null
  head_pph23_percentage?: number | null
  head_discount_amount?: number | null
  head_discount_percentage?: number | null
  head_remark?: string | null

  item_name?: string
  item_code?: string
  product_name?: string
  product_code?: string
  unit_name?: string
}
