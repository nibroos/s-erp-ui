import type { SummaryPartType } from "~/components/d/SummaryLayout.vue"
import type { ProductBomListType, ProductListType } from "../masters/ProductType"
import type { QuoDtsType } from "../quotations/QuotationType"
import type { FormTaskType } from "../masters/TaskType"
import type { KanbanListTasksType } from "../KanbanBoardType"
import type { FormScheduleType, WidgetType } from "../sales-orders/SalesOrderType"

export type StatusTicketType = 'OPEN' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED'
export type PriorityTicketType = 'LOW' | 'MEDIUM' | 'HIGH'

export type IndexTicketType = {
  id: number
  ticket_id: number | null
  customer_id: number | null
  branch_id: number | null
  product_id: string | null
  priority_type?: PriorityTicketType
  ticket_no: string
  title: string
  issue_desc: string
  issue_solution: string
  remark: string | null
  status: StatusTicketType
  is_scheduled?: number

  reported_at: string | null
  created_by_id: number | null
  updated_by_id: number | null
  deleted_by_id: number | null
  created_by_name: string | null
  updated_by_name: string | null
  deleted_by_name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null

  product_name: string | null
}

export type FormTicketType = {
  id?: number | null | undefined | string | string[]
  customer_id?: number | null
  branch_id?: number | null
  product_id?: number | null
  ref_type?: string | null
  rev_no?: number | null
  priority_type?: PriorityTicketType
  status: StatusTicketType
  is_scheduled?: number
  ticket_no?: string
  title: string
  issue_desc?: string
  issue_solution?: string
  remark?: string | null
  reported_at: string

  schedule: FormScheduleType | null
  issue_attachments: TicketAttachmentsType[]
  solution_attachments: TicketAttachmentsType[]
  issue_files?: File[]
  solution_files?: File[]
  deleted_issue_files: number[]
  deleted_solution_files: number[]

  selected_solution_attachments: number[]

  address?: string

  summary?: Record<string, SummaryPartType>

  customer_code?: string
}

export type TicketAttachmentsType = {
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

  is_checked?: number
}

export type QTicketIndexType = {
  page: number
  per_page: number
  parent_ids: number[]
  global: string
  order_column: string
  order_direction: string
}

export type TicketWidgetSingleType = {
  id: number;
  name: string;
  status: StatusTicketType;
  symbol: string;
  code: any;
  transactions: number;
  amount: number;
  ticket_count: number;
  icon: string;
  color: string;
  border: string;
  base: string;
  widget_type: WidgetType
};
