import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductListType } from "../masters/ProductType"

export type IndexRequestOrderType = {
  id: number
  branch_id: number | null
  warehouse_id: number | null
  request_no: string
  request_date: string | null
  remark: string | null
  requested: string | null
  rev_no: number | null
  status: string
  grand_total_order_product_qty: number | null
  grand_total_order_item_qty: number | null
  grand_total_wh_qty: number | null
  grand_total_req_qty: number | null
  created_by_id: number | null
  updated_by_id: number | null
  deleted_by_id: number | null
  created_by_name: string | null
  updated_by_name: string | null
  deleted_by_name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  
  branch_name: string | null
  warehouse_name: string | null
}

export type FormRequestOrderType = {
  id?: number | null | undefined | string | string[]
  branch_id?: number | null
  warehouse_id?: number | null
  request_no?: string
  request_date: string
  remark?: string | null
  requested?: string | null
  rev_no?: number | null
  status: string
  grand_total_order_product_qty: number
  grand_total_order_item_qty: number
  grand_total_wh_qty: number
  grand_total_req_qty: number
  request_order_dts: RoDtType[]
  
  branch_name?: string
  warehouse_name?: string
  
  summary?: Record<string, SummaryPartType>
}

export type RoDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  product_uuid: string
  request_order_id?: number | null
  item_unit_id?: number | null
  ref_id: number
  product_id: number
  item_id: number | null
  ref_type: RoDtRefType
  ref_json?: any
  product_type: RoDtProductType
  product_json?: any
  product_name?: string
  item_name?: string
  unit_name?: string
  price_sell?: number
  remark?: string
  order_product_qty: number
  order_item_qty: number
  wh_qty: number
  req_qty: number
  
  code?: string
  name?: string
  item_code?: string
  product_code?: string
  item_sub_group_id?: number
  item_group_id?: number
  item_sub_group_name?: string
  item_group_name?: string
  gen_code?: string
  item_sku?: string
  ref_num?: string
}

export type RoDtsType = {
  id?: number | null | undefined | string | string[]
  product_uuid: string
  request_order_id?: number | null
  item_unit_id: number
  ref_id: number
  product_id: number
  item_id: number | null
  ref_type: string
  ref_json?: any
  product_type: string
  product_json?: any
  product_name: string
  item_name: string
  unit_name: string
  price_sell: number
  remark?: string | null
  order_product_qty: number
  order_item_qty: number
  wh_qty: number
  req_qty: number
}

export type RoDtRefType = 'products' | 'so'

export type RoDtProductType = 'item' | 'product'

export type FormRoDtRefType = FormRoDtProductListType

export type QIndexType = {
  page: number
  per_page: number
  global: string
  order_column: string
  order_direction: string
  start_date?: string
  end_date?: string
  status?: string
  branch_id?: number
  warehouse_id?: number
  request_no?: string
  remark?: string
  requested?: string
  rev_no?: number
}

export type QIndexRefSoType = {
  page: number
  per_page: number
  global?: string
  request_order_id?: string
  sales_order_no?: string
  po_buyer_no?: string
  remark?: string
  customer_id?: number
  order_type_id?: number
  branch_id?: number
  warehouse_id?: number
  status?: string
  date_type?: string
  start_date?: string
  end_date?: string
  specific_ids?: string
  order_column?: string
  order_direction?: string
}

export type QIndexRefProductType = {
  page: number
  per_page: number
  global?: string
  request_order_id?: string
  product_code?: string
  product_name?: string
  item_code?: string
  item_name?: string
  item_group_id?: number
  item_sub_group_id?: number
  branch_id?: number
  status?: string
  specific_ids?: string
  order_column?: string
  order_direction?: string
}

export type FormRoDtProductListType = ProductListType & RoDtsType & {
  uid?: string
  ref_type: RoDtRefType
  product_type?: RoDtProductType
  request_order_id?: number | null
  
  item_id?: number
  item_name?: string
  item_code?: string
  product_name?: string
  product_code?: string
  unit_name?: string
  item_sub_group_id?: number
  item_group_id?: number
  item_sub_group_name?: string
  item_group_name?: string
  item_sku?: string
  gen_code?: string
  ref_num?: string
}

export type RefSoForRoType = {
  id?: number
  branch_id?: number
  so_dt_id?: number
  product_uuid?: string
  sales_order_id?: number
  item_unit_id?: number
  ref_id?: number
  item_id?: number
  product_id?: number
  item_sub_group_id?: number
  item_group_id?: number
  item_sub_group_name?: string
  item_group_name?: string
  item_name?: string
  item_code?: string
  unit_name?: string
  ref_json?: string
  ref_type?: string
  item_type?: string
  product_type?: string
  product_name?: string
  product_code?: string
  gen_code?: string
  remark?: string
  price_sell?: number
  qty?: number
  qty_requested?: number
  order_product_qty?: number
  order_item_qty?: number
  wh_qty?: number
  req_qty?: number
  request_status?: string
  
  customer_id?: number
  order_type_id?: number
  head_remark?: string
  sales_order_no?: string
  po_buyer_no?: string
  customer_name?: string
  order_type_name?: string
  order_date?: string
  shipping_date?: string
  item_sku?: string
  due_at?: string
}

export type RefProductForRoType = {
  id?: number
  product_id?: number
  product_code?: string
  product_name?: string
  item_unit_id?: number
  item_id?: number
  item_code?: string
  item_name?: string
  item_type?: string
  item_sku?: string
  item_sub_group_id?: number
  item_group_id?: number
  item_sub_group_name?: string
  item_group_name?: string
  unit_name?: string
  gen_code?: string
  remark?: string
  price_sell?: number
  order_product_qty?: number
  order_item_qty?: number
  wh_qty?: number
  req_qty?: number
  ref_id?: number
  ref_type?: string
  ref_json?: string
  ref_num?: string
  branch_id?: number
}

export type RequestOrderStatusWidgetType = {
  status: string
  order_count: number
  total_qty: number
}
