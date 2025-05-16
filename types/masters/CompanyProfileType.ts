export type FormCompanyProfileType = {
  id?: number | null | undefined | string | string[]
  parent_id?: number | null
  vat_id?: number | null
  pph23_id?: number | null
  is_primary?: number | null
  payment_id?: number | null
  company_name: string
  company_owner_name?: string | null
  company_sign_name?: string | null
  company_city?: string | null
  company_province?: string | null
  company_district?: string | null
  company_postal_code?: string | null
  company_address?: string | null
  company_phone?: string | null
  company_email?: string | null
  company_website?: string | null
  company_sign?: string | File | null
  company_logo?: string | File | null
  company_description?: string | null
  company_remark?: string
  company_status?: number | null
  company_options_json?: any | null
  created_by_id?: number | null
  updated_by_id?: number | null
  deleted_by_id?: number | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  bank_informations?: BankInformationType[]
}

export type BankInformationType = {
  id?: number | null | undefined | string | string[]
  commpany_profile_id?: number | null
  name?: string | null
  account_number?: string | null
  account_name?: string | null
  description?: string | null
  created_by_id?: number | null
  updated_by_id?: number | null
  deleted_by_id?: number | null
  created_at?: string | null
  updated_at?: string | null
  deleted_at?: string | null
}
