// import Form from 'vform'
import type { Pagination } from '~/interfaces/LaravelPaginationInterface'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormItemGroupType } from '~/types/masters/ItemGroupType'
import type { FormItemSubGroupType } from '~/types/masters/ItemSubGroupType'
import type { FormProductType } from '~/types/masters/ProductType'
import type { FormQuotationType } from '~/types/quotations/QuotationType'

const pagination = {
  current_page: 1,
  first_page_url: '',
  from: 0,
  data: [],
  last_page: 0,
  last_page_url: '',
  links: [],
  next_page_url: '',
  path: '',
  per_page: 0,
  prev_page_url: '',
  to: 0,
  total: 0,
  loading: false
} as any as Pagination<any[]>

const perPageOptions = [10, 20, 50, 100]

const formItemSubGroupCreateEdit = {
  name: '',
  description: '',
  remark: '',
  status: 1,
  item_group_id: null,
} as FormItemSubGroupType

const formItemGroupCreateEdit = {
  name: '',
  description: '',
  remark: '',
  status: 1,
  item_group_id: null,
} as FormItemGroupType

const formCurrencyCreateEdit = {
  name: '',
  num: 0,
  description: '',
  remark: '',
  symbol: '',
  status: 1,
  item_group_id: null,
} as FormCurrencyType

const formPaymentTermCreateEdit = {
  id: null,
  name: '',
  description: '',
  remark: '',
  status: 1,
}

const formShippingTermCreateEdit = {
  id: null,
  name: '',
  description: '',
  remark: '',
  status: 1,
}

const formPurchaseTypeCreateEdit = {
  id: null,
  name: '',
  code: '',
  description: '',
  remark: '',
  status: 1,
}

const formIOTypeCreateEdit = {
  id: null,
  name: '',
  code: '',
  type: '',
  io_type: '',
  description: '',
  remark: '',
  status: 1,
}

const formWarehouseCreateEdit = {
  id: null,
  name: '',
  code: '',
  description: '',
  remark: '',
  status: 1,
}

const formAccountSettingEdit = {
  id: null,
  name: '',
  username: '',
  phone_number: '',
  address: '',
  email: '',
  password: '',
  password_confirmation: '',
  profile_image: null,
  profile_image_url: null,
  roles: [],
}

const formProductCreateEdit = {
  id: null,
  item_sub_group_id: null,
  item_unit_id: null,
  code: "",
  factory_code: "",
  name: "",
  sku: "",
  barcode: "",
  specification: "",
  description: "",
  remark: "",
  status: 1,
  expired_at: null,
} as FormProductType

const formQuotationCreateEdit = {
  id: null,
  customer_id: null,
  order_type_id: null,
  currency_id: null,
  vat_id: null,
  payment_id: null,
  pph23_id: null,
  branch_id: null,
  quo_no: "",
  title: "",
  remark: "",
  status: "WAITING",
  is_approved: 0,
  exchange_rate: null,
  vat_perc: 0,
  vat_perc_am: 0,
  disc_am: 0,
  disc_perc: 0,
  disc_perc_am: 0,
  disc_final: 0,
  disc_type: null,
  pph23_perc: 0,
  total_qty: 0,
  subtotal: 0,
  total_discount: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  due_at: "",
  expired_at: "",

  quo_dts: [],

  email: "",
  phone: "",
  address: "",
} as FormQuotationType

export const useInitials = {
  pagination,
  perPageOptions,
  formItemSubGroupCreateEdit,
  formItemGroupCreateEdit,
  formCurrencyCreateEdit,
  formProductCreateEdit,
  formQuotationCreateEdit,
  formPaymentTermCreateEdit,
  formShippingTermCreateEdit,
  formPurchaseTypeCreateEdit,
  formIOTypeCreateEdit,
  formWarehouseCreateEdit,
  formAccountSettingEdit
}
