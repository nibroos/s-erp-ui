import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { FormSalesOrderType } from '~/types/sales-orders/SalesOrderType'
import useSalesOrderStore from './SalesOrderStore'

const useScheduleStore = defineStore('ScheduleStore', {
  state: () => ({
    form: {} as FormSalesOrderType,
    queryModal: {
      qListIndex: {
        start_at: '',
        end_at: '',
      } as Record<string, any>,
    },
    metaModal: {
      index: {
        data: [] as any,
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    formLoading: false,
    isOpen: {
      plusEvent: false,
      detailEvent: false,
      createEvent: false,
    },
    modalData: {
      plusEvents: [] as any[],
      detailEvents: [] as any[],
      selectedPlusEvent: {} as any,
    }
  }),

  actions: {
    async indexSchedule() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/index-calendar',
          this.queryModal.qListIndex
        )

        this.metaModal.index = response.data

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      } finally {
        this.metaModal.index.loading = false
      }
    },

    async show() {
      try {
        const response = await useMyFetch().post(
          '/v1/item-groups/show-item-group',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      }
    },

    getAllEventsByDate(date: string) {
      this.isOpen.plusEvent = true

      console.log('getAllEventsByDate', date);

      // get all events by date from metaModal.index.data, get between start_at and end_at
      if (!this.metaModal.index.data) {
        this.modalData.plusEvents = []
        return []
      }

      const events = this.metaModal.index.data.filter((event: any) => {

        const startDate = new Date(event.start).toISOString().split('T')[0]
        const endDate = new Date(event.end).toISOString().split('T')[0]
        console.log('event-start-end', startDate, endDate);

        return startDate <= date && endDate >= date
      })

      console.log('events', events);

      this.modalData.plusEvents = events

      return events
    },

    openDetailEventModal(event: any) {
      this.isOpen.detailEvent = true
      this.modalData.selectedPlusEvent = event

      useSalesOrderStore().show(event.sales_order_id)
    },

  },
  persist: [
    {
      paths: ['queryModal'],
      storage: localStorage
    }
  ]
})

export default useScheduleStore


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useScheduleStore, import.meta.hot))
}