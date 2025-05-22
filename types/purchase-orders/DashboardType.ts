export type IndexDashboardType = {

}


export type QIndexDashboardDonut = {
  page: number
  per_page: number
  invoice_type: 'invoice_dp' | 'invoice_sales' | 'invoice_maintenance' | null
  start_at?: string
  end_at?: string
  global: string
  order_column: string
  order_direction: string
}
