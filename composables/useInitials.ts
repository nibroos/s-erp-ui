// import Form from 'vform'
import type { Pagination } from '~/interfaces/LaravelPaginationInterface'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormItemGroupType } from '~/types/masters/ItemGroupType'
import type { FormItemSubGroupType } from '~/types/masters/ItemSubGroupType'
import type { FormProductType } from '~/types/masters/ProductType'
import type { FormQuotationType } from '~/types/quotations/QuotationType'
import type { FormSalesOrderType } from '~/types/sales-orders/SalesOrderType'
import type { FieldSelectableType, FilterSelectableType } from '~/types/SelectTableType'

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
  expired_at: "",

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
  remark: "",
  status: "PROCESS",
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
  total_after_disc: 0,
  total_pph23: 0,
  total_vat: 0,
  grand_total: 0,
  order_at: new Date().toISOString().split('T')[0],
  shipping_at: new Date().toISOString().split('T')[0],
  agree_at: "",
  due_at: "",
  expired_at: "",

  so_dts: [],

  schedule: {
    id: null,
    sales_order_id: null,
    assignee_id: null,
    schedule_no: "",
    title: "",
    start_at: new Date().toISOString().split('T')[0],
    end_at: new Date().toISOString().split('T')[0],
    color: "",
    status: "WAITING",
    remark: "",
  },

  attachments: [],


  email: "",
  phone: "",
  address: "",
} as FormSalesOrderType

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
    {
      title: "Barcode",
      key: "barcode",
      value: "barcode",
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
      },
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
      },
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

export const useInitials: any = {
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
  formIOTypeCreateEdit,
  formWarehouseCreateEdit,
  formAccountSettingEdit
}
