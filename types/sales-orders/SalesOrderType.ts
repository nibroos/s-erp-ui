import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductBomListType, ProductListType } from "../masters/ProductType"
import type { QuoDtsType } from "../quotations/QuotationType"

export type IndexSalesOrderType = {
  id: number
  sales_order_id: number | null
  customer_id: number | null
  order_type_id: number | null
  currency_id: number | null
  warehouse_id?: number | null
  vat_id: number | null
  payment_id: number | null
  pph23_id: number | null
  branch_id: number | null
  sales_order_no: string
  po_buyer_no: string
  ship_dest: string
  remark: string | null
  status: string
  exchange_rate: number | null
  vat_perc: number | null
  pph23_perc: number | null
  markup_perc: number | null

  disc_am: number | null
  disc_perc: number | null
  disc_perc_am: number | null
  disc_final: number | null
  disc_type: SoDtDiscType | null

  total_qty: number | null
  subtotal: number | null
  total_discount: number | null
  total_pph23: number | null
  total_vat: number | null
  grand_total: number | null
  order_at: string | null
  shipping_at: string | null
  agree_at: string | null
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
  so_dt_vat_id: string | null

  currency_name: string | null
  warehouse_name?: string | null
  product_name: string | null
  item_name: string | null
  vat_name: string | null
  pph23_name: string | null
  so_dt_remark: string | null
  so_dt_bom_remark: string | null
}

export type FormSalesOrderType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  order_type_id?: number | null
  currency_id?: number | null
  warehouse_id?: number | null
  vat_id?: number | null
  payment_id?: number | null
  pph23_id?: number | null
  branch_id?: number | null
  sales_order_no?: string
  po_buyer_no: string
  ship_dest?: string
  remark?: string | null
  status: string
  exchange_rate?: number | null
  vat_perc: number
  pph23_perc: number
  // markup_perc: number
  disc_am: number
  disc_perc: number
  disc_perc_am: number
  disc_final: number
  disc_type: SoDtDiscType | null
  total_qty: number
  subtotal: number
  total_discount: number
  total_after_disc: number
  total_pph23: number
  total_vat: number
  grand_total: number
  order_at: string
  shipping_at: string
  agree_at: string
  due_at: string
  expired_at: string
  so_dts: SoDtType[]

  email?: string
  phone?: string
  address?: string

  summary?: Record<string, SummaryPartType>
}

export type SoDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  sales_order_id?: number | null
  item_unit_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  ref_id: number
  item_id: number
  product_uuid: string
  ref_type: SoDtRefType
  item_type: SoDtItemType
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
  disc_final: number
  disc_type?: SoDtDiscType | null
  // head_disc_am?: number | null
  // head_disc_perc?: number | null
  // disc_end?: number | null
  total_am: number
  so_dts_boms?: (SoDtBomType | ProductBomListType)[] | null
  quo_dts_boms?: (SoDtBomType | ProductBomListType)[] | null
  boms?: SoDtBomType[]

  code?: string
  name?: string
  unit_name?: string
  product_name?: string
  product_code?: string
  item_name?: string
  item_code?: string
}

export type SoDtBomType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  product_uuid: string
  sales_order_id?: number | null
  so_dt_id?: number | null
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

export type SoDtsType = {
  id?: number | null | undefined | string | string[]
  item_unit_id: number
  vat_id: number
  ref_id: number
  item_id: number
  ref_type: string
  product_uuid?: string | null
  remark?: string | null
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
  qty_so: number
  qty: number
  price_sell: number
  price_buy: number
  subtotal: number
  disc_am: number
  disc_perc: number
  total_am: number
  so_dts_boms: SoDtBomType[]
}

export type SoDtDiscType = 'p' | 'a' | 'all' | null

export type SoDtRefType = 'products' | 'quotations'

export type SoDtItemType = 'item' | 'product'

export type FormSoDtRefType = FormSoDtProductListType

export type ModalIndexProductFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexProductFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type ModalIndexQuotationFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexQuotationFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

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

export type QIndexQuotationsType = {
  page: number
  per_page: number
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


export type FormSoDtProductListType = ProductListType & SoDtsType & QuoDtsType & {
  ref_type: 'products' | 'quotations'
  customer_id?: number | null
  sales_order_id?: number | null
  so_dt_id?: number | null
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
  disc_type?: SoDtDiscType | null
  total_am?: number
  subtotal?: number

  so_dts_boms?: ProductBomListType[]
  quo_dts_boms?: ProductBomListType[]

  quotation_id?: number | null
  order_type_id?: number | null
  currency_id?: number | null
  exchange_rate?: number | null
  head_vat_id?: number | null
  head_vat_perc?: number | null
  head_pph23_id?: number | null
  head_pph23_perc?: number | null
  head_disc_am?: number | null
  head_disc_perc?: number | null
  head_markup_perc?: number | null
  head_remark?: string | null

  item_name?: string
  item_code?: string
  product_name?: string
  product_code?: string
  unit_name?: string
}

export type FormSoDtBomListType = ProductListType & SoDtBomType

export type OptionalRefType = {
  ref_id?: number | null
  item_type: SoDtItemType
  item_id?: number | null
  product_id?: number | null
}