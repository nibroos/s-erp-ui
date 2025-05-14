import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { FormSalesOrderType, FormScheduleType, SalesOrderAttachmentsType } from '~/types/sales-orders/SalesOrderType'
import useSalesOrderStore from './SalesOrderStore'
import useTicketStore from '../supports/TicketStore'

const useScheduleStore = defineStore('ScheduleStore', {
  state: () => ({
    form: {} as FormScheduleType,
    queryModal: {
      qListIndex: {
        start_at: '',
        end_at: '',
        per_page: 10000,
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
    isOpenModal: {
      products: false,
      boms: false,
      quotations: false,
      attachment_imgs: false,
      attachment_opened: 0,
    },
    modals: {
      attachment_imgs: [] as SalesOrderAttachmentsType[],
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
        useSalesOrderStore().modals.attachment_imgs = this.form.attachments.filter((item: SalesOrderAttachmentsType) => {
          return item.file_type.includes('image')
        })

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      } finally {
        this.loading.editPageLoading = false
      }
    },

    async updateSchedule() {
      if (!!this.loading.formLoading) return
      this.loading.formLoading = true

      let actionText = 'update'

      if (!this.form.is_scheduled) {
        actionText = 'delete'
      }

      const isConfirmed = await useAlert.showPopupConfirmation(
        `Are you sure to ${actionText} this data?`,
        `Schedule will be ${actionText}d`
      )

      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }

      try {
        let id = this.form.id

        this.form.ref_type = 'schedules'

        const formData = new FormData()

        // Handle files first
        if (this.form.files) {
          if (Array.isArray(this.form.files)) {
            this.form.files.forEach((file, index) => {
              formData.append(`files`, file)
            })
          } else {
            formData.append('files', this.form.files)
          }
        }

        // Handle regular data
        const regularData = {
          ...this.form,
          ref_type: this.form.ref_type,
          deleted_files: this.form.deleted_files,
          attachments: this.form.attachments,
          files: undefined // Remove files from regular data
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/sales-orders/update-schedule',
          // this.form.schedule
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        // this.isOpen.detailEvent = false

        // navigateTo(`/masters/customizations/sales-orders/edit/${response.data.data[0].id}`)

        this.form.id = id
        // await this.show()

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        return response
      } catch (error: any) {
        const responseData = error.response.data
        console.log('Failed To Create Data', error.response.data)
        let errors = ''

        if (typeof responseData.errors === 'object') {
          await Promise.all(
            Object.keys(responseData.errors).map((row: any) => {
              errors += `- ${responseData.errors[row][0]} <br />`
              this.errors[row] = responseData.errors[row][0]
            })
          )
        }
        useAlert.alertError(errors + `<br /> ${responseData.message}`)

        return error.response.data
      } finally {
        this.loading.formLoading = false
      }
    },

    async deleteSchedule(id: number | string | string[] | undefined) {
      this.form.id = id as number

      const isConfirmed = await useAlert.showPopupConfirmation(
        `Are you sure to delete this data?`,
        `Schedule will be deleted`
      )

      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }

      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/delete-schedule',
          {
            id: this.form.id,
          }
        )

        useAlert.alertSuccess(response.data.message)

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async handleExistingFile(attachments: SalesOrderAttachmentsType, index: number) {

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to delete this file?',
        'Data will be deleted permanently when you update this schedule.',
      )

      if (!isConfirmed) {
        return
      }

      try {
        this.form.attachments.splice(index, 1);

        if (!this.form.deleted_files) {
          this.form.deleted_files = []
        }
        this.form.deleted_files.push(attachments.id);
      }
      catch (error) {
        console.error('Error deleting file:', error);
        useAlert.alertError('Failed to delete file. Please try again later.');
      } finally {
        this.loading.formLoading = false
      }
    },

    async handleDownloadFile(attachments: SalesOrderAttachmentsType) {
      if (this.loading.imageDownloadLoading) return
      this.loading.imageDownloadLoading = true

      try {
        const config = useRuntimeConfig();
        const FILE_BASE_URL = config.public.BASE_URL_IMAGE;
        const url = `${FILE_BASE_URL}/${attachments.file_url}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = attachments.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);

      } catch (error) {
        console.error("Error downloading file:", error);
        useAlert.alertError('Failed to download file. Please try again later.');
      } finally {
        this.loading.imageDownloadLoading = false;
      }
    },

    handleViewFullPageFile(attachments: SalesOrderAttachmentsType) {
      if (this.loading.imageDownloadLoading) return

      this.loading.imageDownloadLoading = true

      try {
        const config = useRuntimeConfig();
        const FILE_BASE_URL = config.public.BASE_URL_IMAGE;
        const url = `${FILE_BASE_URL}/${attachments.file_url}`;
        const filename = attachments.file_name;
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";

        // Append to body temporarily
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Clean up
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
      finally {
        this.loading.imageDownloadLoading = false
      }
    },

    openModalAttachmentImg(isOpen: boolean, attachment: SalesOrderAttachmentsType) {
      this.isOpenModal.attachment_imgs = isOpen

      // find index attachment by id
      this.isOpenModal.attachment_opened = this.modals.attachment_imgs.findIndex((item: SalesOrderAttachmentsType) => item.id === attachment.id)
      // this.openedModal.attachment_img = attachment
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

      console.log('event', event.module_type);

      if (event.sales_order_id && event.module_type === 'sales_orders') {
        console.log('event1', event);
        useSalesOrderStore().show(event.sales_order_id)
      } else if (event.sales_order_id && event.module_type === 'tickets') {
        console.log('event2', event);
        useTicketStore().show(event.sales_order_id)
      } else if (event.module_type === 'schedules') {
        console.log('event3', event);
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