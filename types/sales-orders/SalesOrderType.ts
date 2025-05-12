import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductBomListType, ProductListType } from "../masters/ProductType"
import type { QuoDtsType } from "../quotations/QuotationType"
import type { FormTaskType } from "../masters/TaskType"
import type { KanbanListTasksType } from "../KanbanBoardType"

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
  is_vat?: number
  is_pph23?: number

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
  ref_type?: string | null
  rev_no?: number | null
  sales_order_no?: string
  po_buyer_no: string
  ship_dest?: string
  remark?: string | null
  status: string
  exchange_rate?: number | null
  vat_perc: number
  pph23_perc: number
  is_vat?: number
  is_pph23?: number
  is_scheduled?: number
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

  schedule: FormScheduleType | null
  attachments: SalesOrderAttachmentsType[]
  files?: File[]
  deleted_files: number[]

  email?: string
  phone?: string
  address?: string

  summary?: Record<string, SummaryPartType>

  customer_code?: string
}

export type SalesOrderAttachmentsType = {
  id: number
  ref_id: number
  ref_type: string
  file_type: string
  file_url: string
  file_name: string
  remark: any
  file_size: number
  device_type: any
  created_at: string
  deleted_at: any
  created_by_name: string
  updated_by_name: any
}

export type RefTypeScheduleType = 'sales_orders' | 'schedules' | 'tickets'

export type FormScheduleType = {
  id: number | null
  sales_order_id: number | null
  customer_id: number | null
  assignee_id: number | null
  schedule_no: string
  title: string
  module_type: 'sales_orders' | 'tickets' | 'schedules'
  ref_type: RefTypeScheduleType
  start_at: string
  end_at: string
  color: string
  status: string
  remark: string | null
  steps_id?: number | null
  steps?: FormScheduleStepType[]

  attachments: SalesOrderAttachmentsType[]
  files?: File[]
  deleted_files: number[]

  is_scheduled?: number
  is_delete?: number
}

export type FormScheduleStepType = {
  id?: number | null
  uuid?: string
  stepIndex: number
  schedule_id?: number | null
  entity_id?: number | null
  entity_type?: ScheduleEntityType
  title: string
  remark?: string
  order_item?: number
  color?: string
  start_at?: string
  end_at?: string
  tasks: FormScheduleTaskType[]
}

export type FormScheduleTaskType = {
  id?: number | null | undefined | string | string[]
  uuid?: string
  parent_id?: number | null
  parent_uuid?: string
  schedule_id?: number | null
  assignee_id?: number | null
  entity_id?: number | null
  entity_type?: ScheduleEntityType
  title?: string
  remark?: string | null
  order_item?: number
  // color?: string
  // locations?: string
  labels?: string[]
  start_at?: string
  end_at?: string
  is_checked?: number
}

export type ScheduleEntityType = 'steps' | 'tasks' | 'comments'

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

  product_id?: number
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

  delivery_date?: string | null
}

export type SoDtDiscType = 'p' | 'a' | 'all' | null

export type SoDtRefType = 'products' | 'quotations'

export type SoDtItemType = 'item' | 'product'

export type FormSoDtRefType = FormSoDtProductListType

export type ModalIndexProductFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexProductFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type ModalIndexQuotationFilterAutoCompleteType = 'item_group_ids' | 'item_sub_group_ids'
export type ModalIndexQuotationFilterTextType = 'code' | 'name' | 'sku' | 'factory_code'

export type QSoIndexType = {
  page: number
  per_page: number
  parent_ids: number[]
  global: string
  order_column: string
  order_direction: string
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

  payment_id?: number | null
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
  head_is_vat?: number

  item_name?: string
  item_code?: string
  product_name?: string
  product_code?: string
  unit_name?: string
}

export type FormSoDtBomListType = ProductListType & SoDtBomType

export type OptionalSoRefType = {
  ref_id?: number | null
  item_type: SoDtItemType
  item_id?: number | null
  product_id?: number | null
}

export type WidgetSingleType = {
  id: number;
  name: string;
  status: string;
  symbol: string;
  code: any;
  transactions: number;
  amount: number;
  order_count: number;
  total_qty: number;
  grand_total: number;
  icon: string;
  color: string;
  border: string;
  widget_type: WidgetType;
};

export type WidgetType = 'sales_orders' | 'tickets'
