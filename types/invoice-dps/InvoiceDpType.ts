import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductListType } from "../masters/ProductType"
import type { SoDtBomType } from "../sales-orders/SalesOrderType"

export type IndexInvoiceDpType = {
  id: number
  customer_id: number | null
  currency_id: number | null
  payment_term_id: number | null
  vat_id: number | null
  pph23_id: number | null
  branch_id: number | null
  title: string
  invoice_no: string
  invoice_date: string | null
  due_date: string | null
  exchange_rate: number | null
  remark: string | null
  status: string | null
  pph23_percentage: number | null
  vat_percentage: number | null
  discount_amount: number | null
  discount_percentage: number | null
  discount_percentage_amount: number | null
  discount_final: number | null
  discount_type: InvoiceDpDiscType | null
  dp_percentage: number | null
  subtotal: number | null
  total_amount_products: number | null
  total_dp_products: number | null
  total_qty: number | null
  total_discount: number | null
  total_pph23: number | null
  total_vat: number | null
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
  payment_term_name: string | null
  vat_name: string | null
  pph23_name: string | null

  invoice_dp_dts?: InvoiceDpDtType[] | null
}

export type FormInvoiceDpType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  currency_id?: number | null
  payment_term_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  branch_id?: number | null
  bank_id?: number | null
  title: string
  invoice_no?: string
  invoice_date: string
  due_date?: string
  exchange_rate?: number | null
  remark?: string
  status?: string | null
  pph23_percentage: number
  vat_percentage: number
  discount_amount: number
  discount_percentage: number
  discount_percentage_amount: number
  discount_final: number
  discount_type: InvoiceDpDiscType | null
  dp_percentage: number
  subtotal: number
  total_amount_products: number
  total_dp_products: number
  total_qty: number
  total_discount: number
  total_pph23: number
  total_vat: number
  grand_total: number
  invoice_dp_dts: InvoiceDpDtType[]

  email?: string
  phone?: string
  address?: string

  summary?: Record<string, SummaryPartType>

  customer_code?: string
  is_vat?: number
  is_pph23?: number
}

export type InvoiceDpDtBomType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  product_uuid: string
  sales_order_id?: number | null
  so_dt_id?: number | null
  product_id?: number
  item_id?: number
  item_unit_id?: number
  item_sub_group_id?: number | null
  item_group_id?: number | null
  item_sub_group_name?: string | null
  item_group_name?: string | null
  gen_code?: string
  remark?: string
  qty: number
  qty_out?: number | null
  price_sell: number
  price_buy: number
  subtotal_sell: number
  subtotal_buy: number

  item_name?: string
  item_code?: string
  item_barcode?: string | null
  item_sku?: string | null
  item_factory_code?: string | null
  item_specification?: string | null
  item_qty_stock?: number | null
  unit_name?: string

  created_by_id?: number | null
  updated_by_id?: number | null
  deleted_by_id?: number | null
  created_by_name?: string | null
  updated_by_name?: string | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
}

export type InvoiceDpDtType = {
  uid?: string
  id?: number | null | undefined | string | string[]
  invoice_dp_dt_id?: number | null
  product_uuid: string
  customer_id?: number | null
  invoice_dp_id?: number | null
  item_unit_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  ref_id: number
  ref_dt_id: number
  product_id: number
  item_id: number
  item_sub_group_id?: number | null
  item_group_id?: number | null
  item_sub_group_name?: string | null
  item_group_name?: string | null
  ref_json?: any
  ref_type: InvoiceDpRefType
  product_type: InvoiceDpProductType
  product_json?: any
  remark?: string
  dp_percentage: number
  is_vat?: number
  is_pph23?: number
  qty: number
  price: number
  subtotal: number
  discount: number
  total_amount: number
  total_dp: number
  ref_num?: string | null

  product_name?: string
  product_code?: string
  item_name?: string
  item_code?: string
  unit_name?: string
  vat_name?: string | null
  pph23_name?: string | null

  created_by_id?: number | null
  updated_by_id?: number | null
  deleted_by_id?: number | null
  created_by_name?: string | null
  updated_by_name?: string | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null

  item_type?: string | null

  invoice_dp_dt_boms?: InvoiceDpDtBomType[] | null
  so_dts_boms?: SoDtBomType[] | null;
}

export type InvoiceDpDiscType = 'amount' | 'percentage' | null

export type InvoiceDpRefType = 'so'

export type InvoiceDpProductType = 'item' | 'product'

export type FormInvoiceDpDtRefType = FormInvoiceDpDtProductListType

export type QInvoiceDpIndexType = {
  page: number
  per_page: number
  parent_ids: number[]
  global: string
  order_column: string
  order_direction: string
  export_type: 'all' | 'detail'
}

export type QIndexSalesOrdersType = {
  page: number
  per_page: number
  sales_order_ids?: number[] | null
  customer_ids?: number[] | null
  customer_id?: number | null
  order_column?: string
  order_direction?: string
  so_no?: string
  po_buyer_no?: string
  order_type_id?: number | null
  item_type?: string
  product_code?: string
  product_name?: string
  global?: string
  specific_ids?: string
  invoice_id?: number | null
  date_type?: string
  start_date?: string
  end_date?: string
}

export type VatModeType = 'header' | 'detail' | null

export type FormInvoiceDpDtProductListType = ProductListType & {
  sales_order_id?: number | null,
  id?: number | null,
  ref_type: InvoiceDpRefType
  customer_id?: number | null
  invoice_dp_id?: number | null
  vat_id?: number
  pph23_id?: number
  vat_percentage?: number
  pph23_percentage?: number
  is_vat?: number
  is_pph23?: number
  ref_id?: number
  ref_dt_id?: number
  product_id?: number
  product_type?: InvoiceDpProductType
  dp_percentage?: number
  qty?: number
  price?: number
  price_sell?: number
  subtotal?: number
  discount_amount?: number
  discount_percentage?: number
  discount_percentage_num?: number
  discount_percentage_amount?: number
  discount_final?: number
  discount_type?: InvoiceDpDiscType | null
  total_amount?: number
  total_dp?: number

  disc_am?: number
  disc_perc?: number
  disc_perc_am?: number

  invoice_dp_dt_boms?: InvoiceDpDtBomType[] | null

  item_id?: number | null
  item_type?: string
  sales_order_no?: string
  currency_id?: number | null
  exchange_rate?: number | null
  head_vat_id?: number | null
  head_vat_percentage?: number | null
  head_pph23_id?: number | null
  head_pph23_percentage?: number | null
  head_discount_amount?: number | null
  head_discount_percentage?: number | null
  head_remark?: string
  head_is_vat?: number
  head_is_pph23?: number

  item_name?: string
  item_code?: string
  product_name?: string
  product_code?: string
  unit_name?: string
}

export type FormVatType = {
  id: number | null;
  name: string;
  num: number;
  description?: string | null;
  remark?: string;
  date_at?: string | null;
  status?: number;
  multiplier?: number | null;
  divider?: number | null;
}
