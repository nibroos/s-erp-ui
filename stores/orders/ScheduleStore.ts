import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { FormSalesOrderType, FormScheduleType } from '~/types/sales-orders/SalesOrderType'
import useSalesOrderStore from './SalesOrderStore'

const useScheduleStore = defineStore('ScheduleStore', {
  state: () => ({
    form: {} as FormScheduleType,
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
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
      imageDownloadLoading: false,
    },
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

    async show(id?: number | string | string[] | undefined) {
      if (id) {
        this.form.id = id as number
      } else {
        this.form.id = this.form.id
      }

      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/show-schedule',
          this.form
        )

        this.form = response.data.data[0]
        useSalesOrderStore().form.schedule = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      } finally {
        this.loading.editPageLoading = false
      }
    },

    getAllEventsByDate(date: string) {
      this.isOpen.plusEvent = true

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

      this.modalData.plusEvents = events

      return events
    },

    openDetailEventModal(event: any) {
      this.isOpen.detailEvent = true
      this.modalData.selectedPlusEvent = event

      if (event.sales_order_id) {
        useSalesOrderStore().show(event.sales_order_id)
      } else {
        this.show(event.id)
      }
    },

    openCreateEventModal() {
      this.isOpen.createEvent = true;
      // this.modalData.selectedPlusEvent = event

      useSalesOrderStore().form.is_scheduled = 1
      useSalesOrderStore().form.schedule = useInitials.formSalesOrderCreateEdit.schedule
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