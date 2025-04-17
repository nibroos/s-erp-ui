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
  { id: 'DELIVERY', name: 'DELIVERY' },
  { id: 'SCHEDULE', name: 'SCHEDULE' },
  { id: 'INVOICE', name: 'INVOICE' },
  { id: 'CANCELED', name: 'CANCELED' },
  { id: 'HOLDING', name: 'HOLDING' },
  { id: 'FINISH', name: 'FINISH' },
]

const formTabSalesOrder = {
  // payments: 0,
  items: 0,
  remarks: 1,
  schedules: 2,
  attachments: 3,
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
    color: 'Orange',
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
    color: 'red',
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
  { id: 'PAID', name: 'PAID' },
  { id: 'CANCELLED', name: 'CANCELLED' },
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
  formStatusInvoiceDp
}
