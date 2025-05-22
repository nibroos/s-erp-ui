import { generatePoDt, initCheckedPoDt, updatePoRefsModalFromMain } from '~/composables/maps/purchaseOrderComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { QIndexSalesOrdersType } from '~/types/inventories/InventoryType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { FormVatType } from '~/types/masters/VatType'
import type { IndexDashboardType, QIndexDashboardDonut } from '~/types/purchase-orders/DashboardType'
import type { QIndexType } from '~/types/purchase-orders/PurchaseOrderType'
import type { SoDtDiscType, WidgetSingleType } from '~/types/sales-orders/SalesOrderType'

const useDashboardStore = defineStore('DashboardStore', {
  state: () => ({
    queryModal: {
      qIndexSalesByStatus: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: '',
        order_direction: 'desc'
      } as QIndexType,
      qIndexSalesByOrderType: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: '',
        order_direction: 'desc'
      } as QIndexType,
      qIndexSalesByBestCustomer: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: '',
        order_direction: 'desc'
      } as QIndexType,
      qIndexInvoiceMaintenance: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'due_date',
        order_direction: 'asc'
      } as QIndexType,
      qIndexDonut: {
        page: 1,
        per_page: 100,
        global: '',
        invoice_type: null,
        start_at: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        end_at: new Date().toISOString().split('T')[0],
        order_column: '',
        order_direction: ''
      } as QIndexDashboardDonut,
      qIndexSalesOrderLine: {
        page: 1,
        per_page: 100,
        global: '',
        invoice_type: null,
        start_at: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        end_at: new Date().toISOString().split('T')[0],
        order_column: '',
        order_direction: ''
      } as QIndexDashboardDonut,
    },
    metaModal: {
      index: {
        data: [] as IndexDashboardType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSalesByStatus: {
        data: [] as IndexDashboardType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSalesByOrderType: {
        data: [] as IndexDashboardType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSalesByBestCustomer: {
        data: [] as IndexDashboardType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexInvoiceMaintenance: {
        data: [] as IndexDashboardType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexWidgets: {
        data: [] as WidgetSingleType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexDonut: {
        data: [] as WidgetSingleType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSalesOrderLine: {
        data: [] as WidgetSingleType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    itemsCheck: {
    },
    isOpenModal: {
      bestCustomer: false,
      invoiceMaintenance: false,
    },
  }),

  actions: {
    async indexDashboard() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        useAlert.alertSuccess('Login successfully.')

      } catch (error: any) {
        useAlert.alertError(error?.response?.data?.message || 'Login Failed!')

      } finally {
        this.metaModal.index.loading = false
      }
    },

    async indexSalesByStatus() {
      if (this.metaModal.indexSalesByStatus.loading) return
      this.metaModal.indexSalesByStatus.loading = true

      let params = this.queryModal.qIndexSalesByStatus

      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/widget-sales-order-by-status',
          params
        )

        this.metaModal.indexWidgets = response.data
        let widgets = mapWidgets(response.data.data)
        this.metaModal.indexSalesByStatus.data = widgets

        // return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexSalesByStatus.loading = false
      }
    },

    async indexSalesByOrderType() {
      if (this.metaModal.indexSalesByOrderType.loading) return
      this.metaModal.indexSalesByOrderType.loading = true

      let params = this.queryModal.qIndexSalesByOrderType

      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/widget-sales-order-by-order-type',
          params
        )

        this.metaModal.indexWidgets = response.data
        let widgets = mapWidgets(response.data.data)
        this.metaModal.indexSalesByOrderType.data = widgets

        // return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexSalesByOrderType.loading = false
      }
    },

    async indexSalesByBestCustomer() {
      if (this.metaModal.indexSalesByBestCustomer.loading) return
      this.metaModal.indexSalesByBestCustomer.loading = true

      let params = this.queryModal.qIndexSalesByBestCustomer

      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/widget-sales-order-by-best-customer',
          params
        )

        this.metaModal.indexWidgets = response.data
        let widgets = mapWidgets(response.data.data)
        this.metaModal.indexSalesByBestCustomer.data = widgets

        // return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexSalesByBestCustomer.loading = false
      }
    },

    async indexInvoiceMaintenance() {
      if (this.metaModal.indexInvoiceMaintenance.loading) return
      this.metaModal.indexInvoiceMaintenance.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/index-invoice-maintenance',
          this.queryModal.qIndexInvoiceMaintenance
        )

        this.metaModal.indexInvoiceMaintenance = response.data

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice maintenances!')
      } finally {
        this.metaModal.indexInvoiceMaintenance.loading = false
      }
    },

    async indexWidgetDonut() {
      if (this.metaModal.indexDonut.loading) return
      this.metaModal.indexDonut.loading = true

      let params = this.queryModal.qIndexDonut

      try {
        let apiUrl = '/v1/invoice-dps/widget-invoice-dp'
        if (params.invoice_type == null) {
          params.invoice_type = 'invoice_sales'
          apiUrl = '/v1/sales-invoices/widget-sales-invoice'
        } else if (params.invoice_type == 'invoice_dp') {
          apiUrl = '/v1/invoice-dps/widget-invoice-dp'
        } else if (params.invoice_type == 'invoice_sales') {
          apiUrl = '/v1/sales-invoices/widget-sales-invoice'
        } else if (params.invoice_type == 'invoice_maintenance') {
          apiUrl = '/v1/invoice-maintenances/widget-invoice-maintenance'
        }

        const response = await useMyFetch().post(
          apiUrl,
          params
        )

        this.metaModal.indexDonut = response.data
        let widgets = mapWidgets(response.data.data)
        this.metaModal.indexDonut.data = widgets

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Widget Data', error.response?.data);
      } finally {
        this.metaModal.indexDonut.loading = false
      }
    },

    async indexSalesOrderLine() {
      if (this.metaModal.indexSalesOrderLine.loading) return
      this.metaModal.indexSalesOrderLine.loading = true

      let params = this.queryModal.qIndexSalesOrderLine

      try {
        let apiUrl = '/v1/sales-orders/widget-line-sales-order'

        const response = await useMyFetch().post(
          apiUrl,
          params
        )

        this.metaModal.indexSalesOrderLine = response.data

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Widget Data', error.response?.data);
      } finally {
        this.metaModal.indexSalesOrderLine.loading = false
      }
    },

    clearDonutFilter() {
      this.queryModal.qIndexDonut.start_at = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
      this.queryModal.qIndexDonut.end_at = new Date().toISOString().split('T')[0]
      this.queryModal.qIndexDonut.invoice_type = null
    },

    clearLineFilter() {
      this.queryModal.qIndexDonut.start_at = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
      this.queryModal.qIndexDonut.end_at = new Date().toISOString().split('T')[0]
    },

  },
  persist: [
    {
      paths: ['queryModal'],
      storage: localStorage
    }
  ]
})

export default useDashboardStore

