import type { FieldSelectableType, FilterSelectableType } from "~/types/SelectTableType"

export const topMenuMasterTab = [
  {
    title: "User",
    number: 'users',
    icon: "mdi-account-circle-outline",
    link: "/masters/users",
    link2: "/masters/users/create",
    permissions: ["r_users"],
  },
  {
    title: "Company Profile",
    number: 'company-profiles',
    icon: "mdi-domain",
    link: "/masters/company-profiles/edit/1",
    permissions: ["r_roles"],
  },
  {
    title: "Customer Type",
    number: 'customer-types',
    icon: "mdi-layers-outline",
    link: "/masters/customer-types",
    link2: "/masters/customer-types/create",
    permissions: ["r_ms"],
  },
  {
    title: "Customer",
    number: 'customers',
    icon: "mdi-book-account-outline",
    link: "/masters/customers",
    link2: "/masters/customers/create",
    permissions: ["r_ms"],
  },
  {
    title: "Products",
    number: 'products',
    icon: "mdi-treasure-chest-outline",
    link: "/masters/products",
    link2: "/masters/products/create-product",
    permissions: ["r_items"],
  },
  {
    title: "Unit",
    number: 'units',
    icon: "mdi-bookshelf",
    link: "/masters/units",
    link2: "/masters/units/create",
    permissions: ["r_ms"],
  },
  {
    title: "Warehouse",
    number: 'warehouses',
    icon: "mdi-warehouse",
    link: "/masters/warehouses",
    link2: "/masters/warehouses/create-warehouse",
    permissions: ["r_ms"],
  },
  {
    title: "Role & Permission",
    number: 'roles',
    icon: "mdi-shield-check-outline",
    link: "/masters/roles",
    link2: "/masters/roles/create-role-permission",
    permissions: ["r_roles"],
  },
  {
    title: "Customization",
    number: 'customizations',
    icon: "mdi-note-edit-outline",
    link: "/masters/customizations",
    permissions: ["r_ms"],
  },
]

export const topMenuCustomizationTab = [
  {
    title: "Item Group",
    number: 'item-groups',
    icon: "mdi-account-circle-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/item-groups",
    link2: "/masters/customizations/item-groups/create",
    permissions: ["r_ms"],
  },
  {
    title: "Item Sub Group",
    number: 'item-sub-groups',
    icon: "mdi-domain",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/item-sub-groups",
    link2: "/masters/customizations/item-sub-groups/create",
    permissions: ["r_ms"],
  },
  {
    title: "Currency",
    number: 'currencies',
    icon: "mdi-layers-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/currencies",
    link2: "/masters/customizations/currencies/create",
    permissions: ["r_ms"],
  },
  {
    title: "VAT",
    number: 'vats',
    icon: "mdi-book-account-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/vats",
    link2: "/masters/customizations/vats/create",
    permissions: ["r_ms"],
  },
  {
    title: "PPH23",
    number: 'pph23s',
    icon: "mdi-book-account-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/pph23s",
    link2: "/masters/customizations/pph23s/create",
    permissions: ["r_ms"],
  },
  {
    title: "In/Out Type",
    number: 'io-types',
    icon: "mdi-transfer",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/io-types",
    link2: "/masters/customizations/io-types/create",
    permissions: ["r_ms"],
  },
  {
    title: "Order Type",
    number: 'order-types',
    icon: "mdi-book-account-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/order-types",
    link2: "/masters/customizations/order-types/create",
    permissions: ["r_ms"],
  },
  {
    title: "Payment Term",
    number: 'payment-terms',
    icon: "mdi-treasure-chest-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/payment-terms",
    link2: "/masters/customizations/payment-terms/create",
    permissions: ["r_ms"],
  },
  {
    title: "Payment Method",
    number: 'payment-methods',
    icon: "mdi-bookshelf",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/payment-methods",
    link2: "/masters/customizations/payment-methods/create",
    permissions: ["r_ms"],
  },
  {
    title: "Shipping Term",
    number: 'shipping-terms',
    icon: "mdi-warehouse",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/shipping-terms",
    link2: "/masters/customizations/shipping-terms/create",
    permissions: ["r_ms"],
  },
  {
    title: "Shipping Method",
    number: 'shipping-methods',
    icon: "mdi-shield-check-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/shipping-methods",
    link2: "/masters/customizations/shipping-methods/create",
    permissions: ["r_ms"],
  },
  {
    title: "Purchase Type",
    number: 'purchase-types',
    icon: "mdi-tag-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/purchase-types",
    link2: "/masters/customizations/purchase-types/create",
    permissions: ["r_ms"],
  },
  {
    title: "Tasks",
    number: 'tasks',
    icon: "mdi-book-edit-outline",
    parent_link: "/masters/customizations",
    link: "/masters/customizations/tasks",
    link2: "/masters/customizations/tasks/create",
    permissions: ["r_ms"],
  },
]

const QuoIndexStatus = [
  {
    value: 'WAITING',
    title: 'Waiting',
    color: 'grey',
  },
  {
    value: 'APPROVED',
    title: 'Approved',
    color: 'green',
  },
  {
    value: 'PENDING',
    title: 'Pending',
    color: 'orange',
  },
  {
    value: 'CANCELED',
    title: 'Canceled',
    color: 'red',
  },
]

const QuoIndexDateType = [
  {
    value: 'expired_at',
    title: 'Expired Date',
  },
  {
    value: 'due_at',
    title: 'Due Date',
  },
]

const formStatusQuotation = [
  { id: 'WAITING', name: 'WAITING' },
  { id: 'APPROVED', name: 'APPROVED' },
  { id: 'PENDING', name: 'PENDING' },
  { id: 'CANCELED', name: 'CANCELED' },
]

const formApprovedQuotation = [
  { code: 0, name: 'Not Approved' },
  { code: 1, name: 'Approved' },
]

const formTabQuotation = {
  items: 0,
  remarks: 1,
}

const SoIndexStatus = [
  // WAITING, PROCESS, SHIPPED, PENDING, CANCEL, INVOICE, FINISH
  {
    value: 'PROCESS',
    title: 'Process',
    color: 'blue',
  },
  {
    value: 'DELIVERY',
    title: 'Delivery',
    color: 'green',
  },
  {
    value: 'SCHEDULE',
    title: 'Schedule',
    color: 'orange',
  },
  {
    value: 'INVOICE',
    title: 'Invoice',
    color: 'purple',
  },
  {
    value: 'CANCELED',
    title: 'Canceled',
    color: 'red',
  },
  {
    value: 'FINISH',
    title: 'Finish',
    color: 'cyan',
  },
]

const ticketIndexStatus = [
  // { id: 'OPEN', name: 'OPEN' },
  // { id: 'IN PROGRESS', name: 'IN PROGRESS' },
  // { id: 'RESOLVED', name: 'RESOLVED' },
  // { id: 'CLOSED', name: 'CLOSED' },
  {
    value: 'OPEN',
    title: 'Open',
    color: 'blue',
  },
  {
    value: 'IN PROGRESS',
    title: 'In Progress',
    color: 'orange',
  },
  {
    value: 'RESOLVED',
    title: 'Resolved',
    color: 'green',
  },
  {
    value: 'CLOSED',
    title: 'Closed',
    color: 'red',
  },
]

const SoIndexDateType = [
  {
    value: 'order_at',
    title: 'Order Date',
  },
  {
    value: 'shipping_at',
    title: 'Shipping Date',
  },
  {
    value: 'agree_at',
    title: 'Agree Date',
  },
  {
    value: 'due_at',
    title: 'Due Date',
  },
]

const formStatusSalesOrder = [
  { id: 'PROCESS', name: 'PROCESS' },
  // { id: 'DELIVERY', name: 'DELIVERY' },
  // { id: 'SCHEDULE', name: 'SCHEDULE' },
  { id: 'INVOICE', name: 'INVOICE' },
  { id: 'CANCELED', name: 'CANCELED' },
  { id: 'HOLDING', name: 'HOLDING' },
  { id: 'FINISH', name: 'FINISH' },
]

const formStatusTicket = [
  { id: 'OPEN', name: 'OPEN' },
  { id: 'IN PROGRESS', name: 'IN PROGRESS' },
  { id: 'RESOLVED', name: 'RESOLVED' },
  { id: 'CLOSED', name: 'CLOSED' },
]

const priorityTypes = [
  { id: 'HIGH', name: 'HIGH' },
  { id: 'MEDIUM', name: 'MEDIUM' },
  { id: 'LOW', name: 'LOW' },
]

const dashboardInvoiceType = [
  { id: 'invoice_dp', name: 'INVOICE DP' },
  { id: 'invoice_sales', name: 'INVOICE SALES' },
  { id: 'invoice_maintenance', name: 'INVOICE MAINTENANCE' },
]

const formTabSalesOrder = {
  // payments: 0,
  items: 0,
  remarks: 1,
  schedules: 2,
  attachments: 3,
}

const formTabTicket = {
  // payments: 0,
  solution: 0,
  schedules: 1,
  remarks: 2,
  sent_emails: 3,
}

const POIndexStatus = [
  {
    value: 'PROCESS',
    title: 'Process',
    color: 'blue',
  },
  {
    value: 'FINISH',
    title: 'Finish',
    color: 'green',
  },
  {
    value: 'PARTIAL',
    title: 'Partial',
    color: 'orange',
  },
  {
    value: 'CANCELED',
    title: 'Canceled',
    color: 'red',
  },
]

const formStatusPurchaseOrder = [
  { id: 'PROCESS', name: 'PROCESS' },
  { id: 'FINISH', name: 'FINISH' },
  { id: 'PARTIAL', name: 'PARTIAL' },
  { id: 'CANCELED', name: 'CANCELED' },
]

const POIndexDateType = [
  {
    value: 'po_date',
    title: 'PO Date',
  },
  {
    value: 'delivery_date',
    title: 'Delivery Date',
  },
]

const formTabPurchaseOrder = {
  // payments: 0,
  items: 0,
  remarks: 1,
  attachments: 2,
}

const formTabProduct = {
  boms: 0,
  units: 1,
  remarks: 2,
}

const orderTypes = {
  sales: 129,
  maintenance: 130,
  project: 131,
  service: 132,
}

const invIndexStatus = [
  {
    value: 'DELIVERY',
    title: 'Delivery',
    color: 'green',
  },
  {
    value: 'INVOICE',
    title: 'Invoice',
    color: 'purple',
  },
  {
    value: 'CANCELED',
    title: 'Canceled',
    color: 'red',
  },
  {
    value: 'FINISH',
    title: 'Finish',
    color: 'cyan',
  },
]

const invIndexDateType = [
  {
    value: 'ingoing_at',
    title: 'IN Date',
  },
  {
    value: 'shipping_at',
    title: 'Shipping Date',
  },
  {
    value: 'do_at',
    title: 'DO Date',
  },
  {
    value: 'invoice_at',
    title: 'Invoice Date',
  },
]

const invOutdexDateType = [
  {
    value: 'ingoing_at',
    title: 'OUT Date',
  },
  {
    value: 'shipping_at',
    title: 'Shipping Date',
  },
  {
    value: 'do_at',
    title: 'DO Date',
  },
  {
    value: 'invoice_at',
    title: 'Invoice Date',
  },
]

const formStatusInventory = [
  { id: 'DELIVERY', name: 'DELIVERY' },
  { id: 'INVOICE', name: 'INVOICE' },
  { id: 'CANCELED', name: 'CANCELED' },
  { id: 'FINISH', name: 'FINISH' },
]

const formTabInventory = {
  items: 0,
  remarks: 1,
  attachments: 2,
}

const defaultForm = {
  currency_id: 116,
  order_type_id: 129,
}

const InvoiceDpIndexStatus = [
  {
    value: 'UNPAID',
    title: 'Unpaid',
    color: 'orange',
  },
  {
    value: 'PAID',
    title: 'Paid',
    color: 'green',
  },
  {
    value: 'CANCELLED',
    title: 'Cancelled',
    color: 'grey',
  },
]

const formTabInvoiceDp = {
  items: 0,
  remarks: 1,
}

const formStatusInvoiceDp = [
  { id: 'UNPAID', name: 'UNPAID' },
  // { id: 'PAID', name: 'PAID' },
  { id: 'CANCELLED', name: 'CANCELLED' },
]

const SalesInvoiceIndexStatus = [
  {
    value: 'UNPAID',
    title: 'Unpaid',
    color: 'orange',
  },
  {
    value: 'PAID',
    title: 'Paid',
    color: 'green',
  },
  {
    value: 'CANCELLED',
    title: 'Cancelled',
    color: 'grey',
  },
]

const formTabSalesInvoice = {
  items: 0,
  remarks: 1,
}

const formStatusSalesInvoice = [
  { id: 'UNPAID', name: 'UNPAID' },
  // { id: 'PAID', name: 'PAID' },
  { id: 'CANCELLED', name: 'CANCELLED' },
]

const MaintenanceInvoiceIndexStatus = [
  {
    value: 'UNPAID',
    title: 'Unpaid',
    color: 'orange',
  },
  {
    value: 'PAID',
    title: 'Paid',
    color: 'green',
  },
  {
    value: 'CANCELLED',
    title: 'Cancelled',
    color: 'grey',
  },
]

const formTabInvoiceMaintenance = {
  items: 0,
  remarks: 1
}

const formStatusInvoiceMaintenance = [
  { id: 'UNPAID', name: 'UNPAID' },
  // { id: 'PAID', name: 'PAID' },
  { id: 'CANCELLED', name: 'CANCELLED' },
]

const initialColorsStatus = [
  {
    name: "Total",
    icon: "material-symbols:receipt-rounded",
    color: "text-[#00B8D9]",
    border: "border-[#00B8D9]",
    base: "[#00B8D9]",
    hex: "#3085fe",
  },
  {
    name: "Order",
    code: "bg-yellow-100 text-yellow-700 border !border-yellow-700",
    icon: "mdi:cart",
    color: "text-yellow-700",
    border: "border-yellow-700",
    base: "yellow-700",
  },
  {
    name: "Process",
    icon: "material-symbols:nest-clock-farsight-analog",
    color: "text-sky-700",
    border: "border-sky-700",
    base: "sky-700",
  },
  {
    name: "Procsess",
    icon: "material-symbols:nest-clock-farsight-analog",
    color: "text-sky-700",
    border: "border-sky-700",
    base: "sky-700",
  },
  {
    name: "Unpaid",
    code: "bg-orange-100 text-orange-700 border !border-orange-700",
    icon: "mdi:receipt-text-minus-outline",
    color: "text-orange-700",
    border: "border-orange-700",
    base: "orange-700",
    hex: "#dc3545",
    // --
  },
  {
    name: "Partial",
    icon: "mdi:receipt-text-minus-outline",
    color: "text-amber-700",
    border: "border-amber-700",
    base: "amber-700",
  },
  {
    name: "production",
    code: "bg-indigo-100 text-indigo-700 border !border-indigo-700",
    icon: "material-symbols:nest-clock-farsight-analog",
    color: "text-indigo-700",
    border: "border-indigo-700",
    base: "indigo-700",
  },
  {
    name: "Shipping",
    icon: "gridicons:shipping",
    color: "text-fuchsia-700",
    border: "border-fuchsia-700",
    base: "fuchsia-700",
  },
  {
    name: "Invoice",
    code: "bg-blue-100 text-blue-700 border !border-blue-700",
    icon: "material-symbols:payments",
    color: "text-blue-700",
    border: "border-blue-700",
    base: "blue-700",
  },
  {
    name: "Finish",
    icon: "material-symbols:check-circle-rounded",
    color: "text-[#36B37E]",
    border: "border-[#36B37E]",
    base: "[#36B37E]",
  },
  {
    name: "Paid",
    code: "bg-emerald-100 text-emerald-700 border !border-emerald-700",
    icon: "material-symbols:check-circle-rounded",
    color: "text-emerald-700",
    border: "border-emerald-700",
    base: "emerald-700",
    hex: "#36B37E",
    // --
  },
  {
    name: "Cancel",
    code: "bg-rose-100 text-rose-700 border !border-rose-700",
    icon: "material-symbols:cancel",
    color: "text-rose-700",
    border: "border-rose-700",
    base: "rose-700",
    hex: "#FF5630",
  },
  {
    name: "Canceled",
    code: "bg-rose-100 text-rose-700 border !border-rose-700",
    icon: "material-symbols:cancel",
    color: "text-rose-700",
    border: "border-rose-700",
    base: "rose-700",
    hex: "#cc9a06",
  },
  // holding
  {
    name: "Holding",
    code: "bg-amber-100 text-amber-700 border !border-amber-700",
    icon: "material-symbols:pause-circle-outline",
    color: "text-amber-700",
    border: "border-amber-700",
    base: "amber-700",
  },
  {
    name: "Pending",
    code: "bg-orange-100 text-orange-700 border !border-orange-700",
    icon: "material-symbols:pending-actions",
    color: "text-orange-700",
    border: "border-orange-700",
    base: "orange-700",
  },
  // waiting, approved
  {
    name: "Waiting",
    code: "bg-gray-100 text-gray-700 border !border-gray-700",
    icon: "material-symbols:hourglass-empty",
    color: "text-gray-700",
    border: "border-gray-700",
    base: "gray-700",
  },
  {
    name: "Approved",
    code: "bg-green-100 text-green-700 border !border-green-700",
    icon: "material-symbols:check-circle-rounded",
    color: "text-green-700",
    border: "border-green-700",
    base: "green-700",
  },
  {
    name: "Open",
    code: "bg-emerald-100 text-emerald-700 border !border-emerald-700",
    icon: "material-symbols:add-circle-rounded",
    color: "text-emerald-700",
    border: "border-emerald-700",
    base: "emerald-700",
  },
  {
    name: "In Progress",
    code: "bg-amber-100 text-amber-700 border !border-amber-700",
    icon: "material-symbols:nest-clock-farsight-analog",
    color: "text-amber-700",
    border: "border-amber-700",
    base: "amber-700",
  },
  {
    name: "Resolved",
    code: "bg-blue-100 text-blue-700 border !border-blue-700",
    icon: "material-symbols:check-circle-rounded",
    color: "text-blue-700",
    border: "border-blue-700",
    base: "blue-700",
  },
  {
    name: "Closed",
    code: "bg-red-100 text-red-700 border !border-red-700",
    icon: "material-symbols:cancel",
    color: "text-red-700",
    border: "border-red-700",
    base: "red-700",
  },
]

const headersCustomer: FieldSelectableType[] = [
  {
    title: "Name",
    key: "name",
    value: "name",
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
    title: "Phone",
    key: "phone",
    value: "phone",
    align: "start",
    sortable: true,
  },
  {
    title: "Email",
    key: "email",
    value: "email",
    align: "start",
    sortable: true,
  },
  {
    title: "Address",
    key: "address",
    value: "address",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer Type",
    key: "customer_type_name",
    value: "customer_type_name",
    align: "start",
    sortable: true,
  },
];

const filtersCustomer: FilterSelectableType[] = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Address",
    key: "address",
  },
  {
    title: "Customer Type",
    key: "customer_type_id",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/customer-types/index-customer-type",
      singleApi: "/v1/customer-types/index-customer-type",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Customer Type",
      innerSearchKey: "global",
    },
  },
];

const RequestOrderIndexStatus = [
  {
    value: 'PENDING',
    title: 'Pending',
    color: 'orange',
  },
  {
    value: 'APPROVED',
    title: 'Approved',
    color: 'blue',
  },
  {
    value: 'CANCELED',
    title: 'Canceled',
    color: 'grey',
  },
]

const formStatusRequestOrder = [
  { id: 'PENDING', name: 'PENDING' },
  // { id: 'APPROVED', name: 'APPROVED' },
  { id: 'CANCELED', name: 'CANCELED' },
]

const formTabRequestOrder = {
  items: 0,
  remarks: 1,
}

const headerSentEmails: FieldSelectableType[] = [
  // ref_type, to_email, subject, remark, error_message, status, created_at, created_by_name
  { title: "ID", key: "id", sortable: true },
  { title: "Email", key: "to_email", sortable: true },
  { title: "Subject", key: "subject", sortable: true },
  { title: "Remark", key: "remark", sortable: true },
  { title: "Error Message", key: "error_message", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Created By", key: "created_by_name", sortable: true },
  { title: "Created At", key: "created_at", sortable: true },
]

export const useStatics = {
  QuoIndexStatus,
  QuoIndexDateType,
  formTabQuotation,
  formStatusQuotation,
  formApprovedQuotation,
  SoIndexStatus,
  SoIndexDateType,
  invIndexStatus,
  invIndexDateType,
  formTabProduct,
  formTabSalesOrder,
  formStatusSalesOrder,
  formStatusInventory,
  formTabInventory,
  orderTypes,
  POIndexStatus,
  POIndexDateType,
  formTabPurchaseOrder,
  formStatusPurchaseOrder,
  defaultForm,
  InvoiceDpIndexStatus,
  formTabInvoiceDp,
  formStatusInvoiceDp,
  SalesInvoiceIndexStatus,
  formTabSalesInvoice,
  formStatusSalesInvoice,
  MaintenanceInvoiceIndexStatus,
  formTabInvoiceMaintenance,
  formStatusInvoiceMaintenance,
  invOutdexDateType,
  initialColorsStatus,
  headersCustomer,
  filtersCustomer,
  RequestOrderIndexStatus,
  formStatusRequestOrder,
  formTabRequestOrder,
  formStatusTicket,
  formTabTicket,
  priorityTypes,
  ticketIndexStatus,
  headerSentEmails,
  dashboardInvoiceType,
}
