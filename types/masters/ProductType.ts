import type { QuoDtDiscType, QuoDtsType } from "../quotations/QuotationType"

export type FormProductType = {
  id?: number | null | undefined | string | string[]
  item_sub_group_id: number | null
  item_unit_id: number | null
  code?: string | null
  factory_code?: string | null
  name: string
  sku?: string | null
  barcode?: string | null
  specification?: string | null
  description?: string | null
  remark?: string | null
  price_sell?: number | null
  price_buy?: number | null
  margin?: number | null
  tpb_code?: string | null
  minimum_stock?: number | null
  is_all_branch?: number | null
  is_vat: number | null | undefined
  is_pph23: number | null | undefined
  status?: number
  expired_at: string | undefined | null
  units: CreateMsItemUnitsRequestType[]
  boms: CreateBomsRequestType[]
}

export type CreateMsItemUnitsRequestType = {
  id?: number | null | undefined | string | string[]
  unit_id: number
  conversion: number
  price_sell: number
  price_buy: number

  name?: string
}

export type CreateBomsRequestType = {
  id?: number | null | undefined | string | string[]
  product_item_id: number
  item_unit_id: number
  qty: number
  remark?: string | null

  ref_id?: number
  product_id: number
  name?: string
  item_name?: string
}

export type ProductListType = {
  id?: number | null | undefined | string | string[]
  product_id?: number
  item_sub_group_id?: number
  item_group_id?: number
  item_unit_id?: number | null
  item_unit_unit_id?: number | null
  branch_id?: number | null
  branch_item_id?: number | null
  item_sub_group_name?: string
  item_group_name?: string
  unit_name?: string
  branch_name?: string
  code?: string
  factory_code?: string
  name?: string
  prod_type?: string
  sku?: string
  barcode?: string
  specification?: string
  description?: string
  tpb_code?: string
  minimum_stock?: string
  is_all_branch?: number
  remark?: string
  price_sell?: number
  price_buy?: number
  margin?: string
  expired_at?: string
  status?: number
  created_by_name?: string
  updated_by_name?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
  item_name?: string
  item_code?: string
  item_factory_code?: string
  item_sku?: string
  item_barcode?: string
  item_specification?: string
  item_description?: string
  item_remark?: string
  item_tpb_code?: string
  boms?: ProductBomListType[]

  ref_id?: number
  product_item_id?: number
}

export type ProductBomListType = {
  id: number
  product_uuid: string;
  bom_id: number
  product_id: number
  product_item_id: number
  item_sub_group_id: number
  item_group_id: number
  item_unit_id: number
  item_sub_group_name: string
  item_group_name: string
  branch_name: string
  qty: number
  remark: string
  unit_name: string
  item_unit_name: string
  created_by_name: string
  updated_by_name: string
  created_at: string
  updated_at: string
  deleted_at: string
  item_name: string
  item_code: string
  item_factory_code: string
  item_sku: string
  item_barcode: string
  item_specification: string
  item_description: string
  item_remark: string
  item_tpb_code: string
  name: string
  code: string
  factory_code: string
  sku: string
  barcode: string
  specification: string
  description: string
  tpb_code: string

  price_sell: number
  price_buy: number
  subtotal_sell: number
  subtotal_buy: number

  item_id?: number
  ref_id?: number
}


export type ModalIndexMasterFilterTextType = 'code' | 'name'

export type QIndexProductsType = {
  page: number
  per_page: number
  item_group_ids?: number[] | null
  item_sub_group_ids?: number[] | null
  code?: string
  name?: string
  sku?: string
  factory_code?: string
  prod_type?: 'single' | 'product'
  order_column?: string
  order_direction?: string
}

export type FormProductCompType = {
  id?: number | null | undefined | string | string[]
  isOpen?: boolean
  type?: 'page' | 'modal'
}