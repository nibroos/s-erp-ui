import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductBomListType, ProductListType } from "../masters/ProductType"
import type { SoDtsType } from "../sales-orders/SalesOrderType"

export type IndexInvoiceDpType = {
  id: number
  invoice_dp_id: number | null
  customer_id: number | null
  order_type_id: number | null
  currency_id: number | null
  warehouse_id?: number | null
  vat_id: number | null
  payment_id: number | null
  pph23_id: number | null
  branch_id: number | null
  invoice_dp_no: string
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
  disc_type: InvDpDtDiscType | null

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
  inv_dp_dt_vat_id: string | null

  currency_name: string | null
  warehouse_name?: string | null
  product_name: string | null
  item_name: string | null
  vat_name: string | null
  pph23_name: string | null
  inv_dp_dt_remark: string | null
  inv_dp_dt_bom_remark: string | null
}

export type FormInvoiceDpType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  order_type_id?: number | null
  currency_id?: number | null
  warehouse_id?: number | null
  vat_id?: number | null
  payment_id?: number | null
  pph23_id?: number | null
  branch_id?: number | null
  invoice_dp_no?: string
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
  disc_type: InvDpDtDiscType | null
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
  inv_dp_dts: InvDpDtType[]

  schedule: FormScheduleType
  attachments: any[]

  email?: string
  phone?: string
  address?: string

  summary?: Record<string, SummaryPartType>
}

export type FormScheduleType = {
  id: number | null
  invoice_dp_id: number | null
  assignee_id: number | null
  schedule_no: string
  title: string
  start_at: string
  end_at: string
  color: string
  status: string
  remark: string | null
}

export type InvDpDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  invoice_dp_id?: number | null
  item_unit_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  ref_id: number
  item_id: number
  product_uuid: string
  ref_type: InvDpDtRefType
  item_type: InvDpDtItemType
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
  disc_type?: InvDpDtDiscType | null
  // head_disc_am?: number | null
  // head_disc_perc?: number | null
  // disc_end?: number | null
  total_am: number
  inv_dp_dts_boms?: (InvDpDtBomType | ProductBomListType)[] | null
  so_dts_boms?: (InvDpDtBomType | ProductBomListType)[] | null
  boms?: InvDpDtBomType[]

  product_id?: number
  code?: string
  name?: string
  unit_name?: string
  product_name?: string
  product_code?: string
  item_name?: string
  item_code?: string
}

export type InvDpDtBomType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  product_uuid: string
  invoice_dp_id?: number | null
  inv_dp_dt_id?: number | null
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

export type InvDpDtsType = {
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
  inv_dp_dts_boms: InvDpDtBomType[]
}

export type InvDpDtDiscType = 'p' | 'a' | 'all' | null

export type InvDpDtRefType = 'products' | 'sales_orders'

export type InvDpDtItemType = 'item' | 'product'

export type FormInvDpDtRefType = FormInvDpDtProductListType

export type ModalIndexProductFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexProductFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type ModalIndexSalesOrderFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexSalesOrderFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type QSoIndexType = {
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
  item_group_ids?: number[] | null
  item_sub_group_ids?: number[] | null
  sales_order_ids?: number[] | null
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


export type FormInvDpDtProductListType = ProductListType & InvDpDtsType & SoDtsType & {
  subtotal?: number

  inv_dp_dts_boms?: ProductBomListType[]
  so_dts_boms?: ProductBomListType[]

  sales_order_id?: number | null
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

export type FormInvDpDtBomListType = ProductListType & InvDpDtBomType

export type OptionalSoRefType = {
  ref_id?: number | null
  item_type: InvDpDtItemType
  item_id?: number | null
  product_id?: number | null
}