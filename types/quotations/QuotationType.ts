import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductBomListType, ProductListType } from "../masters/ProductType"

export type IndexQuotationType = {
  id: number
  quotation_id: number | null
  customer_id: number | null
  order_type_id: number | null
  currency_id: number | null
  vat_id: number | null
  payment_id: number | null
  pph23_id: number | null
  branch_id: number | null
  rev_no?: string
  quo_no: string
  title: string
  remark: string | null
  status: string
  is_approved: number
  is_vat: number
  is_pph23: number
  exchange_rate: number | null
  vat_perc: number | null
  pph23_perc: number | null
  markup_perc: number | null

  total_qty: number | null
  subtotal: number | null
  total_discount: number | null
  total_pph23: number | null
  total_vat: number | null
  grand_total: number | null
  due_at: string | null
  expired_at: string | null
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
  quo_dt_vat_id: string | null
  currency_name: string | null
  product_name: string | null
  item_name: string | null
  vat_name: string | null
  pph23_name: string | null
  quo_dt_remark: string | null
  quo_dt_bom_remark: string | null
}

export type FormQuotationType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  order_type_id?: number | null
  currency_id?: number | null
  vat_id?: number | null
  payment_id?: number | null
  pph23_id?: number | null
  branch_id?: number | null
  rev_no?: string
  quo_no: string
  title: string
  remark?: string
  license_desc?: string | null
  term_desc?: string | null
  status: string
  is_approved: number
  is_vat: number
  is_pph23: number
  exchange_rate?: number | null
  vat_perc: number
  disc_am: number
  disc_perc: number
  disc_perc_am: number
  disc_final: number
  disc_type: QuoDtDiscType | null
  pph23_perc: number
  markup_perc: number // n
  total_qty: number
  subtotal: number
  total_discount: number
  total_after_disc: number
  total_pph23: number
  total_vat: number
  grand_total: number
  due_at: string
  expired_at: string
  quo_dts: QuoDtType[]

  email?: string
  phone?: string
  address?: string

  summary?: Record<string, SummaryPartType>

  customer_code?: string
}

export type QuoDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  quotation_id?: number | null
  item_unit_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  ref_id: number
  item_id: number
  product_uuid: string
  ref_type: QuoDtRefType
  item_type: QuoDtItemType
  gen_code?: string | null
  remark?: string
  // is_lock_vat?: number
  vat_perc?: number
  vat_perc_am?: number
  // is_lock_pph23?: number
  pph23_perc?: number
  pph23_perc_am?: number
  markup_perc?: number // n
  markup_perc_am?: number // n
  is_vat?: number
  is_pph23?: number
  is_lock_markup?: number
  is_lock_price_sell?: number
  is_lock_price_buy?: number
  qty_so?: number
  qty: number
  price_sell: number
  price_buy: number
  subtotal_sell: number
  subtotal_buy: number
  disc_am: number
  disc_perc?: number
  disc_perc_num?: number
  disc_perc_am: number
  sub_discount: number
  disc_final: number
  disc_type?: QuoDtDiscType | null
  // head_disc_am?: number | null
  // head_disc_perc?: number | null
  // disc_end?: number | null
  total_am: number // ambil dari (qty * price_sell) - (disc_am or disc_perc per detail)
  quo_dts_boms?: (QuoDtBomType | ProductBomListType)[] | null
  boms?: QuoDtBomType[]

  code?: string
  name?: string
  unit_name?: string
  product_name?: string
  product_code?: string
  item_name?: string
  item_code?: string
}

export type QuoDtBomType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  product_uuid: string
  quotation_id?: number | null
  quo_dt_id?: number | null
  product_id?: number
  item_id?: number
  item_unit_id?: number
  gen_code?: string
  remark?: string
  qty: number
  price_sell: number
  price_buy: number
  subtotal_sell: number
  subtotal_buy: number
  bom_id: number

  product_item_id?: number
  code?: string
  name?: string
  unit_name?: string
  ref_id?: number
  sku?: string
  factory_code?: string
  specification?: string
  barcode?: string
  item_name?: string
  item_code?: string
  item_sku?: string
  item_factory_code?: string
  item_specification?: string
  item_barcode?: string
  item_unit_name?: string
}

export type QuoDtsType = {
  id?: number | null | undefined | string | string[]
  quo_dt_id?: number | null
  item_unit_id: number
  vat_id: number
  ref_id: number
  item_id: number
  ref_type: string
  product_uuid?: string | null
  remark?: string
  // is_lock_vat?: number
  vat_perc?: number
  vat_perc_am?: number
  // is_lock_pph23?: number
  pph23_perc?: number
  pph23_perc_am?: number
  markup_perc?: number // n
  markup_perc_am?: number // n
  is_vat?: number
  is_pph23?: number
  is_lock_markup?: number
  is_lock_price_sell?: number
  is_lock_price_buy?: number
  qty_so: number
  qty: number
  price_sell: number
  price_buy: number
  subtotal: number
  disc_am: number
  disc_perc: number
  total_am: number
  quo_dts_boms: QuoDtBomType[]
}

export type QuoDtDiscType = 'p' | 'a' | 'all' | null

export type QuoDtRefType = 'products'

export type QuoDtItemType = 'item' | 'product'

export type FormQuoDtRefType = FormQuoDtProductListType

export type ModalIndexProductFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexProductFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type QQuoIndexType = {
  page: number
  per_page: number
  parent_ids: number[]
  global: string
  order_column: string
  order_direction: string
}

export type VatModeType = 'header' | 'detail' | null


export type FormQuoDtProductListType = ProductListType & QuoDtsType & {
  ref_type: 'products'
  quotation_id?: number | null
  quo_dt_id?: number | null
  vat_id?: number
  pph23_id?: number
  vat_perc?: number
  vat_perc_am?: number
  pph23_perc?: number
  pph23_perc_am?: number
  markup_perc?: number // n
  markup_perc_am?: number // n
  is_vat?: number
  is_pph23?: number
  is_lock_markup?: number
  is_lock_price_sell?: number
  is_lock_price_buy?: number
  ref_id?: number
  qty_so?: number
  qty?: number
  subtotal_sell?: number
  subtotal_buy?: number
  disc_am?: number
  disc_perc?: number
  disc_perc_num?: number
  disc_perc_am?: number
  disc_final?: number
  disc_type?: QuoDtDiscType | null
  total_am?: number

  quo_dts_boms?: ProductBomListType[]

  item_name?: string
  item_code?: string
  product_name?: string
  product_code?: string
  unit_name?: string
}

export type FormQuoDtBomListType = ProductListType & QuoDtBomType
