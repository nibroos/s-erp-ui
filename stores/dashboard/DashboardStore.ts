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
import type { IndexDashboardType } from '~/types/purchase-orders/DashboardType'
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
      indexWidgets: {
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

  },
  persist: [
    {
      paths: [],
      storage: localStorage
    }
  ]
})

export default useDashboardStore

