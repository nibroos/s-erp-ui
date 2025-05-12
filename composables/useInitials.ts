// import Form from 'vform'
import { random } from 'lodash'
import type { Pagination } from '~/interfaces/LaravelPaginationInterface'
import type { AutocompleteType } from '~/types/AutocompleteType'
import type { FormInventoryType, QInvStatusIndexType, QInvStockIndexType } from '~/types/inventories/InventoryType'
import type { FormInvoiceAdjustmentType } from '~/types/invoice-adjustments/InvoiceAdjustmentType'
import type { FormInvoiceDpType } from '~/types/invoice-dps/InvoiceDpType'
import type { FormInvoiceMaintenanceType } from '~/types/invoice-maintenances/InvoiceMaintenanceType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormCustomerType } from '~/types/masters/CustomerType'
import type { FormItemGroupType } from '~/types/masters/ItemGroupType'
import type { FormItemSubGroupType } from '~/types/masters/ItemSubGroupType'
import type { FormProductType } from '~/types/masters/ProductType'
import type { FormPurchaseOrderType } from '~/types/purchase-orders/PurchaseOrderType'
import type { FormQuotationType } from '~/types/quotations/QuotationType'
import type { FormSalesInvoiceType } from '~/types/sales-invoices/SalesInvoiceType'
import type { FormSalesOrderType, FormScheduleStepType } from '~/types/sales-orders/SalesOrderType'
import type { FieldSelectableType, FilterSelectableType, FormOptionSelectableType } from '~/types/SelectTableType'
import type { FormTicketType } from '~/types/tickets/TicketType'

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

const formVatCreateEdit = {
  name: '',
  description: '',
  remark: '',
  status: 1,
  item_group_id: null,
} as FormItemGroupType

const formPph23CreateEdit = {
  name: '',
  description: '',
  remark: '',
  status: 1,
  item_group_id: null,
} as FormItemGroupType

const formTaskCreateEdit = {
  name: '',
  description: '',
  remark: '',
  status: 1,
  task_id: null,
} as FormItemGroupType

const formUnitCreateEdit = {
  name: '',
  description: '',
  remark: '',
  status: 1,
  unit_id: null,
} as FormItemGroupType

const formCustomerCreateEdit = {
  id: null,
  customer_type_id: null,
  agent_id: null,
  currency_id: null,
  name: '',
  phone: null,
  email: null,
  address: null,
  shortname: null,
  remark: null,
  pic: null,
  status: 1,
} as FormCustomerType

const formCurrencyCreateEdit = {
  name: '',
  num: 0,
  description: '',
  remark: '',
  symbol: '',
  status: 1,
  currency_id: null,
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
  remark: "Price not include VAT",
  status: "WAITING",
  is_approved: 0,
  is_vat: 0,
  is_pph23: 0,
  exchange_rate: null,
  vat_perc: 0,
  vat_perc_am: 0,
  markup_perc: 0,
  disc_am: 0,
  disc_perc: 0,
  disc_perc_am: 0,
  disc_final: 0,
  disc_type: null,
  pph23_perc: 0,
  total_qty: 0,
  subtotal: 0,
  total_discount: 0,
  total_after_disc: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  due_at: new Date().toISOString().split('T')[0],
  expired_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

  quo_dts: [],

  email: "",
  phone: "",
  address: "",
} as FormQuotationType

const formSalesOrderCreateEdit = {
  id: null,
  customer_id: null,
  order_type_id: null,
  currency_id: null,
  vat_id: null,
  payment_id: null,
  pph23_id: null,
  branch_id: null,
  sales_order_no: "",
  po_buyer_no: "",
  remark: "Price not include VAT",
  status: "PROCESS",
  ref_type: "sales_orders",
  exchange_rate: null,
  vat_perc: 0,
  vat_perc_am: 0,
  disc_am: 0,
  disc_perc: 0,
  disc_perc_am: 0,
  disc_final: 0,
  disc_type: null,
  pph23_perc: 0,
  is_vat: 0,
  is_pph23: 0,
  is_scheduled: 0,
  total_qty: 0,
  subtotal: 0,
  total_discount: 0,
  total_after_disc: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  order_at: new Date().toISOString().split('T')[0],
  // shipping default 7 days
  shipping_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  agree_at: "",
  due_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  expired_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

  so_dts: [],

  schedule: {
    id: null,
    sales_order_id: null,
    customer_id: null,
    assignee_id: null,
    schedule_no: "",
    title: "",
    module_type: "sales_orders",
    ref_type: "sales_orders",
    start_at: new Date().toISOString().split('T')[0],
    end_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    // generate random hex color
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    status: "WAITING",
    remark: "",
    steps_id: 1,
    attachments: [],
    deleted_files: [],
    files: [],
  },

  attachments: [],
  files: [],
  deleted_files: [],

  email: "",
  phone: "",
  address: "",
} as FormSalesOrderType

const formTicketCreateEdit = {
  id: null,
  customer_id: null,
  branch_id: null,
  ticket_no: "",
  title: "",
  remark: "",
  status: "OPEN",
  priority_type: "LOW",
  is_scheduled: 0,
  reported_at: new Date().toISOString().split('T')[0],

  schedule: {
    id: null,
    sales_order_id: null,
    customer_id: null,
    assignee_id: null,
    schedule_no: "",
    title: "",
    module_type: "tickets",
    ref_type: "tickets",
    start_at: new Date().toISOString().split('T')[0],
    end_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    // generate random hex color
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    status: "WAITING",
    remark: "",
    steps_id: 1,
    attachments: [],
    deleted_files: [],
    files: [],
  },

  issue_attachments: [],
  issue_files: [],
  deleted_issue_files: [],

  solution_attachments: [],
  solution_files: [],
  deleted_solution_files: [],

  // email: "",
  // phone: "",
  address: "",
} as FormTicketType

const formPurchaseOrderCreateEdit = {
  id: null,
  customer_id: null,
  purchase_type_id: null,
  currency_id: null,
  vat_id: null,
  payment_term_id: null,
  shipping_term_id: null,
  pph23_id: null,
  branch_id: null,
  po_no: '',
  customer_code: '',
  po_date: new Date().toISOString().split('T')[0],
  delivery_date: '',
  shipping_destination: '',
  remark: null,
  status: 'PROCESS',
  exchange_rate: 0,
  discount_percentage: 0,
  discount_amount: 0,
  discount_percentage_amount: 0,
  discount_final_header: 0,
  discount_amount_product: 0,
  discount_type: null,
  pph23_percentage: 0,
  vat_percentage: 0,
  total_amount_products: 0,
  total_after_disc: 0,
  total_qty: 0,
  subtotal: 0,
  total_discount: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  po_dts: [],
  email: '',
  phone: '',
  address: '',
  summary: {
    total_amount_products: {
      label: "Sub Amount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_discount: {
      label: "Total Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    subtotal: {
      label: "After Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_vat: {
      label: "Total VAT",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_pph23: {
      label: "Total PPH23",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    grand_total: {
      label: "Grand Total",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
  }
} as FormPurchaseOrderType

const productFieldsFilterConfig = {
  fields: [
    {
      title: "Group",
      key: "item_group_name",
      value: "item_group_name",
      align: "start",
      sortable: true,
    },
    {
      title: "Sub Group",
      key: "item_sub_group_name",
      value: "item_sub_group_name",
      align: "start",
      sortable: true,
    },
    {
      title: "Code",
      key: "code",
      value: "code",
      align: "start",
      sortable: true,
    },
    {
      title: "Name",
      key: "name",
      value: "name",
      align: "start",
      sortable: true,
    },
    {
      title: "SKU",
      key: "sku",
      value: "sku",
      align: "start",
      sortable: true,
    },
    {
      title: "Factory Code",
      key: "factory_code",
      value: "factory_code",
      align: "start",
      sortable: true,
    },
    {
      title: "Specification",
      key: "specification",
      value: "specification",
      align: "start",
      sortable: true,
    },
    {
      title: "Price Sell",
      key: "price_sell",
      value: "price_sell",
      align: "end",
      sortable: true,
    },
    {
      title: "Price Buy",
      key: "price_buy",
      value: "price_buy",
      align: "end",
      sortable: true,
    },
    {
      title: "Tpb Code",
      key: "tpb_code",
      value: "tpb_code",
      align: "start",
      sortable: true,
    },
  ] as FieldSelectableType[],
  filters: [
    {
      title: "Group",
      key: "item_group_ids",
      type: "autocomplete",
      others: {
        methodApi: "post",
        api: "/v1/item-groups/index-item-group",
        singleApi: "/v1/item-groups/index-item-group",
        mappingDetail: "data",
        itemsProp: "data",
        pageEndProp: "meta.next_page_url",
        itemTitle: "name",
        itemValue: "id",
        label: "Roles",
        innerSearchKey: "global",
        multiple: true,
        returnObject: false,
        itemColor: "brown-lighten-2",
      } as AutocompleteType,
    },
    {
      title: "Sub Group",
      key: "item_sub_group_ids",
      type: "autocomplete",
      others: {
        methodApi: "post",
        api: "/v1/item-sub-groups/index-item-sub-group",
        singleApi: "/v1/item-sub-groups/index-item-sub-group",
        mappingDetail: "data",
        itemsProp: "data",
        pageEndProp: "meta.next_page_url",
        itemTitle: "name",
        itemValue: "id",
        label: "Roles",
        innerSearchKey: "global",
        multiple: true,
        returnObject: false,
        itemColor: "brown-lighten-2",
      } as AutocompleteType,
    },
    {
      title: "Code",
      key: "code",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "SKU",
      key: "sku",
    },
    {
      title: "Factory Code",
      key: "factory_code",
    },
  ] as FilterSelectableType[],
}
const formInventoryCreateEdit = {
  id: null,
  customer_id: null,
  currency_id: null,
  vat_id: null,
  payment_id: null,
  pph23_id: null,
  branch_id: null,
  remark: "",
  status: "DELIVERY",
  exchange_rate: null,
  vat_perc: 0,
  vat_perc_am: 0,
  pph23_perc: 0,
  total_qty: 0,
  subtotal: 0,
  total_discount: 0,
  total_after_disc: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  ingoing_at: new Date().toISOString().split('T')[0],
  do_at: new Date().toISOString().split('T')[0],
  invoice_at: new Date().toISOString().split('T')[0],
  agree_at: "",
  is_vat: 0,
  is_pph23: 0,
  do_no: '',
  surat_jalan_no: '',
  invoice_no: '',
  ship_dest: '',
  // warehouse_id: null,
  io_type_id: null,
  payment_term_id: null,
  inventory_no: '',

  inv_dts: [],

  email: "",
  phone: "",
  address: "",
} as FormInventoryType

const formInvoiceDpCreateEdit = {
  id: null,
  customer_id: null,
  currency_id: 116,
  payment_term_id: null,
  vat_id: null,
  pph23_id: null,
  branch_id: null,
  bank_id: null,
  invoice_no: '',
  invoice_date: new Date().toISOString().split('T')[0],
  exchange_rate: 1,
  remark: "Price not include VAT",
  status: 'UNPAID',
  pph23_percentage: 0,
  vat_percentage: 0,
  discount_amount: 0,
  discount_percentage: 0,
  discount_percentage_amount: 0,
  discount_final: 0,
  discount_type: null,
  dp_percentage: 0,
  subtotal: 0,
  total_amount_products: 0,
  total_dp_products: 0,
  total_qty: 0,
  total_discount: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  invoice_dp_dts: [],

  email: "",
  phone: "",
  address: "",

  summary: {
    total_amount: {
      label: "Sub Amount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_discount: {
      label: "Total Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_after_disc: {
      label: "After Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_vat: {
      label: "Total VAT",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_pph23: {
      label: "Total PPH23",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_dp: {
      label: "Total DP",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    grand_total: {
      label: "Grand Total",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
  }
} as FormInvoiceDpType

const defaultSteps: FormScheduleStepType[] = [
  {
    uuid: randomId(),
    title: 'Step 1',
    remark: 'Remark',
    order_item: 0,
    stepIndex: 0,
    schedule_id: null,
    color: 'text-indigo-600',
    entity_id: null,
    entity_type: 'steps',
    // start date range 7 days from now
    start_at: new Date().toISOString().split('T')[0],
    end_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: []
  },
  {
    uuid: randomId(),
    title: 'Step 2',
    remark: "Remark",
    order_item: 1,
    stepIndex: 1,
    schedule_id: null,
    color: 'text-blue-600',
    entity_id: null,
    entity_type: 'steps',
    // start date range 7 days from previous step
    start_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_at: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: []
  },
  {
    uuid: randomId(),
    title: 'Step 3',
    remark: 'Remark',
    order_item: 2,
    stepIndex: 2,
    schedule_id: null,
    color: 'text-amber-600',
    entity_id: null,
    entity_type: 'steps',
    start_at: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_at: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: []
  },
  {
    uuid: randomId(),
    title: 'Step 4',
    remark: 'Remark',
    order_item: 3,
    stepIndex: 3,
    schedule_id: null,
    color: 'text-amber-600',
    entity_id: null,
    entity_type: 'steps',
    start_at: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_at: new Date(new Date().getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: []
  },
  {
    uuid: randomId(),
    title: 'Step 5',
    remark: 'Remark',
    order_item: 4,
    stepIndex: 4,
    schedule_id: null,
    color: 'text-emerald-600',
    entity_id: null,
    entity_type: 'steps',
    start_at: new Date(new Date().getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_at: new Date(new Date().getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: []
  },
]

const defaultListSteps = [{
  id: 1,
  name: 'backlog, to do, in progress, done',
  steps: defaultSteps,
}]

const formOptionDefault: FormOptionSelectableType = {
  creatable: false,
  editable: false,
  mode: '',
  keyDif: random(0, 1000),
  editApi: '',
  createApi: '',
  // key?: string
  // show?: boolean
  // title?: string
  // message?: (props: { label: string }) => string
  // size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  // headerClass?: string
  // headerTextClass?: string
  // contentClass?: string
  // customClass?: string
  // confirmText?: string
  // cancelText?: string
  // confirmClass?: string
  // cancelClass?: string
  // confirmTextClass?: string
  // cancelTextClass?: string
  modal: {
    key: randomId(),
    show: false,
    title: 'Create',
    // message: (props: { title: string }) => `Are you sure you want to ${props.title}?`,
    size: 'md',
    // headerClass: 'bg-primary text-white',
    // headerTextClass: 'text-white',
    // contentClass: 'bg-white',
    // customClass: 'bg-white',
    confirmText: 'Create', // Edit
    cancelText: 'Cancel'
  }
}

const formCompanyProfileCreateEdit = {
  id: null,
  parent_id: null,
  vat_id: null,
  pph23_id: null,
  is_primary: 0,
  payment_id: null,
  company_name: '',
  company_owner_name: '',
  company_sign_name: '',
  company_city: '',
  company_province: '',
  company_district: '',
  company_postal_code: '',
  company_address: '',
  company_phone: '',
  company_email: '',
  company_website: '',
  company_sign: null,
  company_logo: null,
  company_description: '',
  company_remark: '',
  company_status: 1,
  company_options_json: null,
  bank_informations: []
}

const formSalesInvoiceCreateEdit = {
  id: null,
  customer_id: null,
  currency_id: 116,
  payment_term_id: null,
  vat_id: null,
  pph23_id: null,
  branch_id: null,
  bank_id: null,
  invoice_no: '',
  invoice_date: new Date().toISOString().split('T')[0],
  exchange_rate: 1,
  remark: "Price not include VAT",
  rev_no: 0,
  status: 'UNPAID',
  pph23_percentage: 0,
  vat_percentage: 0,
  discount_amount: 0,
  discount_percentage: 0,
  discount_percentage_amount: 0,
  discount_final: 0,
  discount_type: null,
  subtotal: 0,
  total_amount_products: 0,
  total_dp_products: 0,
  total_balance_products: 0,
  total_qty: 0,
  total_discount: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  sales_invoice_dts: [],

  email: "",
  phone: "",
  address: "",

  summary: {
    total_amount: {
      label: "Sub Amount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_discount: {
      label: "Total Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_after_disc: {
      label: "After Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_vat: {
      label: "Total VAT",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_pph23: {
      label: "Total PPH23",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_dp: {
      label: "Total DP",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_balance: {
      label: "Total Balance",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    grand_total: {
      label: "Grand Total",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
  }
} as FormSalesInvoiceType

const formInvoiceAdjustmentCreateEdit = {
  id: null,
  customer_id: null,
  currency_id: 116,
  bank_id: null,
  invoice_no: '',
  // payment_date: new Date().toISOString().split('T')[0],
  payment_date: '',
  payment_amount: 0,
  exchange_rate: 1,
  reference: null,
  ref_start_date: '',
  ref_end_date: '',
  remark: '',
  total_invoice: 0,
  total_adjustment: 0,
  total_balance: 0,
  total_admin_bank: 0,
  grand_total: 0,
  adjustment_dts: [],

  email: '',
  phone: '',
  address: '',
  customer_code: ''
} as FormInvoiceAdjustmentType

const formInvoiceMaintenanceCreateEdit = {
  id: null,
  customer_id: null,
  currency_id: 116,
  payment_term_id: null,
  vat_id: null,
  pph23_id: null,
  branch_id: null,
  bank_id: null,
  invoice_no: '',
  invoice_date: new Date().toISOString().split('T')[0],
  exchange_rate: 1,
  remark: "Price not include VAT",
  rev_no: 0,
  status: 'UNPAID',
  approved_status: 'PENDING',
  pph23_percentage: 0,
  vat_percentage: 0,
  discount_amount: 0,
  discount_percentage: 0,
  discount_percentage_amount: 0,
  discount_final: 0,
  discount_type: null,
  subtotal: 0,
  total_amount_products: 0,
  total_dp_products: 0,
  total_balance_products: 0,
  total_qty: 0,
  total_discount: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  invoice_maintenance_dts: [],

  email: "",
  phone: "",
  address: "",

  summary: {
    total_amount: {
      label: "Sub Amount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_discount: {
      label: "Total Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_after_disc: {
      label: "After Discount",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    total_vat: {
      label: "Total VAT",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_pph23: {
      label: "Total PPH23",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_dp: {
      label: "Total DP",
      symbol: '',
      value: 0,
      percentage: 0,
      format: {
        precision: 2,
      },
    },
    total_balance: {
      label: "Total Balance",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
    grand_total: {
      label: "Grand Total",
      symbol: '',
      value: 0,
      format: {
        precision: 2,
      },
    },
  }
} as FormInvoiceMaintenanceType

const formCreateEditOpnameSingle = {
  isOpen: false,
  id: null as number | null,
  item_id: null as number | null,
  warehouse_id: null as number | null,
  adjustment_date: new Date().toISOString().split('T')[0],
  qty: 0
}

const qIndexStockClosings = {
  page: 1,
  per_page: 100,
  parent_ids: [],
  start_at: '',
  end_at: new Date().toISOString().split('T')[0],
  warehouse_id: null,
  item_id: null,
  branch_id: null,
  global: '',
  order_column: 'item_name',
  order_direction: 'desc'
} as QInvStockIndexType

const qIndexInvStatus = {
  page: 1,
  per_page: 100,
  item_ids: [],
  item_group_ids: [],
  item_sub_group_ids: [],
  global: '',
  product_id: null,
  warehouse_id: null,
  item_id: null,
  branch_id: null,
  date_type: '',
  start_date: '',
  end_date: '',
  order_column: 'ingoing_at',
  order_direction: 'desc'
} as QInvStatusIndexType

type UseInitialsType = {
  pagination: typeof pagination;
  perPageOptions: typeof perPageOptions;
  formItemSubGroupCreateEdit: typeof formItemSubGroupCreateEdit;
  formItemGroupCreateEdit: typeof formItemGroupCreateEdit;
  formCurrencyCreateEdit: typeof formCurrencyCreateEdit;
  formProductCreateEdit: typeof formProductCreateEdit;
  formQuotationCreateEdit: typeof formQuotationCreateEdit;
  formSalesOrderCreateEdit: typeof formSalesOrderCreateEdit;
  productFieldsFilterConfig: {
    fields: FieldSelectableType[];
    filters: FilterSelectableType[];
  };
  formPaymentTermCreateEdit: typeof formPaymentTermCreateEdit;
  formShippingTermCreateEdit: typeof formShippingTermCreateEdit;
  formPurchaseTypeCreateEdit: typeof formPurchaseTypeCreateEdit;
  formInventoryCreateEdit: typeof formInventoryCreateEdit;
  formIOTypeCreateEdit: typeof formIOTypeCreateEdit;
  formWarehouseCreateEdit: typeof formWarehouseCreateEdit;
  formAccountSettingEdit: typeof formAccountSettingEdit;
  formPurchaseOrderCreateEdit: typeof formPurchaseOrderCreateEdit;
  formTaskCreateEdit: typeof formTaskCreateEdit;
  formUnitCreateEdit: typeof formUnitCreateEdit;
  defaultListSteps: typeof defaultListSteps;
  defaultSteps: typeof defaultSteps;
  formOptionDefault: typeof formOptionDefault;
  formCompanyProfileCreateEdit: typeof formCompanyProfileCreateEdit;
  formSalesInvoiceCreateEdit: typeof formSalesInvoiceCreateEdit;
  formInvoiceDpCreateEdit: typeof formInvoiceDpCreateEdit;
  formCustomerCreateEdit: typeof formCustomerCreateEdit;
  formInvoiceAdjustmentCreateEdit: typeof formInvoiceAdjustmentCreateEdit;
  formInvoiceMaintenanceCreateEdit: typeof formInvoiceMaintenanceCreateEdit;
  formVatCreateEdit: typeof formVatCreateEdit;
  formPph23CreateEdit: typeof formPph23CreateEdit;
  formCreateEditOpnameSingle: typeof formCreateEditOpnameSingle;
  qIndexStockClosings: typeof qIndexStockClosings;
  qIndexInvStatus: typeof qIndexInvStatus;
  formTicketCreateEdit: typeof formTicketCreateEdit;
}

export const useInitials: UseInitialsType = {
  pagination,
  perPageOptions,
  formItemSubGroupCreateEdit,
  formItemGroupCreateEdit,
  formCurrencyCreateEdit,
  formProductCreateEdit,
  formQuotationCreateEdit,
  formSalesOrderCreateEdit,
  productFieldsFilterConfig,
  formPaymentTermCreateEdit,
  formShippingTermCreateEdit,
  formPurchaseTypeCreateEdit,
  formInventoryCreateEdit,
  formIOTypeCreateEdit,
  formWarehouseCreateEdit,
  formAccountSettingEdit,
  formPurchaseOrderCreateEdit,
  formTaskCreateEdit,
  formUnitCreateEdit,
  defaultListSteps,
  defaultSteps,
  formOptionDefault,
  formInvoiceDpCreateEdit,
  formCompanyProfileCreateEdit,
  formSalesInvoiceCreateEdit,
  formCustomerCreateEdit,
  formInvoiceAdjustmentCreateEdit,
  formInvoiceMaintenanceCreateEdit,
  formVatCreateEdit,
  formPph23CreateEdit,
  formCreateEditOpnameSingle,
  qIndexStockClosings,
  qIndexInvStatus,
  formTicketCreateEdit,
}
