import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductListType } from "../masters/ProductType"
import type { SoDtsType } from "../sales-orders/SalesOrderType"

export type IndexInventoryType = {
  id: number
  inventory_id: number | null
  customer_id: number | null
  io_type_id: number | null
  currency_id: number | null
  payment_term_id: number | null
  warehouse_id?: number | null
  vat_id: number | null
  pph23_id: number | null
  branch_id: number | null
  inventory_no?: string
  do_no?: string
  surat_jalan_no?: string
  invoice_no?: string
  ship_dest: string
  remark: string | null
  status: string
  exchange_rate: number | null
  is_vat?: number | null
  vat_perc: number | null
  pph23_perc: number | null

  total_qty: number | null
  subtotal: number | null
  total_pph23: number | null
  total_vat: number | null
  grand_total: number | null
  do_at: string
  ingoing_at: string
  invoice_at: string

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
  warehouse_name?: string | null
  item_name: string | null
  vat_name: string | null
  pph23_name: string | null
}

export type FormInventoryType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  io_type_id?: number | null
  currency_id?: number | null
  payment_term_id?: number | null
  warehouse_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  branch_id?: number | null
  inventory_no?: string
  inventory_no_ori?: string
  do_no?: string
  surat_jalan_no?: string
  invoice_no?: string
  ship_dest?: string
  remark?: string | null
  status: string
  exchange_rate?: number | null
  is_vat?: number | null
  vat_perc: number
  pph23_perc: number
  total_qty: number
  subtotal: number
  total_pph23: number
  total_vat: number
  grand_total: number
  do_at: string
  ingoing_at: string
  invoice_at: string
  inv_dts: InvDtType[]

  summary?: Record<string, SummaryPartType>

  email?: string
  phone?: string
  address?: string

  io_type?: 'INVENTORY_IN' | 'INVENTORY_OUT'
}

export type InvDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  inventory_id?: number | null
  item_unit_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  ref_id: number | string | null
  item_id: number
  product_uuid: string
  ref_type: InvDtRefType
  item_type: InvDtItemType
  gen_code?: string | null
  remark?: string
  qty_out?: number
  qty: number
  price_sell: number
  price_buy: number
  subtotal_sell: number
  subtotal_buy: number
  total_am: number
  expired_at: string | null

  code?: string
  name?: string
  unit_name?: string
  product_name?: string
  product_code?: string
  item_name?: string
  item_code?: string
  balance?: number
}

export type InvDtsType = InvDtType

export type InvDtDiscType = 'p' | 'a' | 'all' | null

export type InvDtRefType = 'products' | 'so' | 'po' | 'inv_in'

export type InvDtItemType = 'item' | 'product'

export type FormInvDtRefType = FormInvDtProductListType

export type ModalIndexProductFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexProductFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type ModalIndexSalesOrderFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexSalesOrderFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type QInvIndexType = {
  page: number
  per_page: number
  parent_ids: number[]
  global: string
  order_column: string
  order_direction: string
}

export type QIndexSalesOrdersType = {
  page: number
  per_page: number
  sales_order_ids?: number[] | null
  item_group_ids?: number[] | null
  item_sub_group_ids?: number[] | null
  quotation_ids?: number[] | null
  customer_ids?: number[] | null
  product_ids?: number[] | null
  customer_id?: number | null
  product_id?: number[] | null
  code?: string
  name?: string
  sku?: string
  factory_code?: string
  order_column?: string
  order_direction?: string
}

export type QIndexPurchaseOrdersType = {
  page: number
  per_page: number
  sales_order_ids?: number[] | null
  item_group_ids?: number[] | null
  item_sub_group_ids?: number[] | null
  quotation_ids?: number[] | null
  customer_ids?: number[] | null
  product_ids?: number[] | null
  customer_id?: number | null
  product_id?: number[] | null
  code?: string
  name?: string
  sku?: string
  factory_code?: string
  order_column?: string
  order_direction?: string
}

export type QIndexInventoryInsType = {
  page: number
  per_page: number
  sales_order_ids?: number[] | null
  item_group_ids?: number[] | null
  item_sub_group_ids?: number[] | null
  quotation_ids?: number[] | null
  customer_ids?: number[] | null
  product_ids?: number[] | null
  customer_id?: number | null
  product_id?: number[] | null
  code?: string
  name?: string
  sku?: string
  factory_code?: string
  order_column?: string
  order_direction?: string
}

export type VatModeType = 'header' | 'detail' | null

export type FormInvDtProductListType = ProductListType & InvDtsType & SoDtsType & {
  customer_id?: number | null
  inv_dt_id?: number | null
  so_dt_id?: number | null
  po_dt_id?: number | null
  subtotal?: number

  sales_order_id?: number | null
  io_type_id?: number | null
  currency_id?: number | null
  payment_term_id?: number | null
  head_vat_id?: number | null
  head_vat_perc?: number | null
  head_pph23_id?: number | null
  head_pph23_perc?: number | null
  head_markup_perc?: number | null
  exchange_rate?: number | null
  head_remark?: string | null

  item_name?: string
  item_code?: string
  product_name?: string
  product_code?: string
  unit_name?: string
}

export type FormInvDtBomListType = ProductListType

export type OptionalInvRefType = {
  ref_id?: number | string | null
  item_type: InvDtItemType
  item_id?: number | null
  product_id?: number | null
}