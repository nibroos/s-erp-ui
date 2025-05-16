
export type SentEmailType = {
  id: number
  ref_id: number | null
  sender_id: number | null
  ref_type: string | null
  from_email: string | null
  to_email: string | null
  subject: string | null
  remark: string | null
  error_message: string | null
  status: string | null
  created_by_id: number | null
  updated_by_id: number | null
  deleted_by_id: number | null
  deleted_at: string | null
  created_at: string | null
  updated_at: string | null
  log_json: string | null
  created_by_name: string | null
  updated_by_name: string | null
  deleted_by_name: string | null
}