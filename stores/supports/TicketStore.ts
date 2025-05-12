import { generateSoBoms, initCheckedSoDt } from '~/composables/maps/salesOrderComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { QIndexProductsType } from '~/types/masters/ProductType'
import type { FormVatType } from '~/types/masters/VatType'
import type { FormTicketType, IndexTicketType, QTicketIndexType, TicketAttachmentsType, TicketWidgetSingleType } from '~/types/tickets/TicketType'
import useScheduleStore from '../orders/ScheduleStore'
import type { FormScheduleType } from '~/types/sales-orders/SalesOrderType'

const useTicketStore = defineStore('TicketStore', {
  state: () => ({
    form: {
      id: null,
    } as FormTicketType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'reported_at',
        order_direction: 'desc'
      } as QTicketIndexType,

    },
    metaModal: {
      index: {
        data: [] as IndexTicketType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexWidgets: {
        data: [] as TicketWidgetSingleType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
      imageDownloadLoading: false,
      widgetLoading: false,
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    isOpenModal: {
      products: false,
      boms: false,
      quotations: false,
      issue_attachment_imgs: false,
      issue_attachment_opened: 0,
      solution_attachment_imgs: false,
      solution_attachment_opened: 0,
    },
    openedModal: {
      issue_attachment_img: {} as TicketAttachmentsType,
      solution_attachment_img: {} as TicketAttachmentsType,
    },
    currencySymbolLabel: '' as string | null,
    referenceOptions: {
      vats: [] as FormVatType[],
    },
    modals: {
      issue_attachment_imgs: [] as TicketAttachmentsType[],
      solution_attachment_imgs: [] as TicketAttachmentsType[],
    },
    formLayout: {
      title: "Basic Information",
      parentPath: "/supports/tickets",
      currentTab: 0,
      tabs: ["Items", "Payments", "Remark", "Schedule", "Attachments"],
      button: {
        clear: {
          show: true,
        },
      },
      // permission: {
      //   name: ["c_ms"],
      //   isActive: true,
      // },
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
        grand_total: {
          label: "Grand Total",
          symbol: '',
          value: 0,

          format: {
            precision: 2,
          },
        },
      },
    } as FormLayoutType,
  }),

  actions: {
    async indexTicket() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        useAlert.alertSuccess('Login successfully.')

        // return response
      } catch (error: any) {
        useAlert.alertError(error?.response?.data?.message || 'Login Failed!')

      } finally {
        this.metaModal.index.loading = false
      }
    },

    async indexWidget() {
      if (this.metaModal.indexWidgets.loading) return
      this.metaModal.indexWidgets.loading = true

      let params = this.queryModal.qIndex

      try {
        const response = await useMyFetch().post(
          '/v1/tickets/widget-ticket',
          params
        )

        this.metaModal.indexWidgets = response.data
        let widgets = mapWidgets(response.data.data)
        this.metaModal.indexWidgets.data = widgets

        // return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexWidgets.loading = false
      }
    },

    async show(id?: number | string | string[] | undefined) {
      if (id) {
        this.form.id = id
      } else {
        this.form.id = this.form.id
      }

      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/tickets/show-ticket',
          {
            id: this.form.id
          }
        )

        this.form.schedule = {} as FormScheduleType

        this.form = response.data.data[0]
        if (!this.form.schedule) {
          this.form.is_scheduled = 0
          this.form.schedule = useInitials.formTicketCreateEdit.schedule
          console.log("!this.form.schedule", this.form.schedule);

          // this.form.schedule.title = this.form.po_buyer_no
        } else {
          this.form.is_scheduled = 1
        }

        if (!this.form.issue_attachments) {
          this.form.issue_attachments = []
        } else {
          this.modals.issue_attachment_imgs = this.form.issue_attachments.filter((item: TicketAttachmentsType) => {
            return item.file_type.includes('image')
          })
        }

        if (!this.form.solution_attachments) {
          this.form.solution_attachments = []
        } else {
          this.modals.solution_attachment_imgs = this.form.solution_attachments.filter((item: TicketAttachmentsType) => {
            return item.file_type.includes('image')
          })
        }

        this.form.deleted_issue_files = []
        this.form.deleted_solution_files = []

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      } finally {
        this.loading.editPageLoading = false
      }
    },

    async store() {
      if (!!this.loading.formLoading) return
      this.loading.formLoading = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )

      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }

      try {
        const formData = new FormData()

        if (!this.form.is_scheduled) {
          this.form.schedule = null
        }

        this.form.ref_type = 'sales_orders'

        // Handle files first
        if (this.form.issue_files) {
          if (Array.isArray(this.form.issue_files)) {
            this.form.issue_files.forEach((file, index) => {
              formData.append(`issue_files`, file)
            })
          } else {
            formData.append('issue_files', this.form.issue_files)
          }
        }

        // Handle files first
        if (this.form.solution_files) {
          if (Array.isArray(this.form.solution_files)) {
            this.form.solution_files.forEach((file, index) => {
              formData.append(`solution_files`, file)
            })
          } else {
            formData.append('solution_files', this.form.solution_files)
          }
        }

        // Handle regular data
        const regularData = {
          ...this.form,
          issue_files: undefined,
          solution_files: undefined
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/tickets/create-ticket',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formTicketCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/supports/tickets`)

        return response
      } catch (error: any) {
        const responseData = error.response.data
        console.log('Failed To Create Data', error.response.data)
        let errors = ''

        if (typeof responseData.errors === 'object') {
          await Promise.all(
            Object.keys(responseData.errors).map((row: any) => {
              errors += `- ${responseData.errors[row]} <br />`
              this.errors[row] = responseData.errors[row]
            })
          )
        }
        useAlert.alertError(errors + `<br /> ${responseData.message}`)

        return error.response.data
      } finally {
        this.loading.formLoading = false
      }
    },

    async update() {
      if (!!this.loading.formLoading) return
      this.loading.formLoading = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )

      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }

      try {
        let id = this.form.id

        if (!this.form.is_scheduled) {
          this.form.schedule = null
        }

        const formData = new FormData()

        // Object.keys(this.form).forEach(key => {
        //   const value = this.form[key as keyof typeof this.form]
        //   if (value !== null && value !== undefined) {
        //     if (key === 'files' && value instanceof File) {
        //       formData.append(key, value)
        //     }
        //     else if (key === 'so_dts' && Array.isArray(this.form[key])) {
        //       this.form[key].forEach((so_dt, index) => {
        //         formData.append(`${key}[${index}]`, JSON.stringify(so_dt))
        //       })
        //     }
        //     else {
        //       formData.append(key, value as string | Blob)
        //     }
        //   }
        // })

        this.form.ref_type = 'sales_orders'

        // Handle files first
        if (this.form.issue_files) {
          if (Array.isArray(this.form.issue_files)) {
            this.form.issue_files.forEach((file, index) => {
              formData.append(`issue_files`, file)
            })
          } else {
            formData.append('issue_files', this.form.issue_files)
          }
        }

        // Handle files first
        if (this.form.solution_files) {
          if (Array.isArray(this.form.solution_files)) {
            this.form.solution_files.forEach((file, index) => {
              formData.append(`solution_files`, file)
            })
          } else {
            formData.append('solution_files', this.form.solution_files)
          }
        }

        // Handle regular data
        const regularData = {
          ...this.form,
          issue_files: undefined,
          solution_files: undefined
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/tickets/update-ticket',
          // this.form,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        this.form = JSON.parse(
          JSON.stringify(useInitials.formTicketCreateEdit)
        )

        // navigateTo(`/masters/customizations/tickets/edit/${response.data.data[0].id}`)

        this.form.id = id
        await this.show()

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        navigateTo(`/supports/tickets`)

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

    autocompleteCustomer(data: any) {
      // this.form.email = data.email;
      // this.form.phone = data.phone;
      this.form.customer_code = data.shortname;
    },

    async storeModal() {
      if (!!this.loading.formLoading) return
      this.loading.formLoading = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )

      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }

      try {
        const formData = new FormData()

        if (!this.form.is_scheduled) {
          this.form.schedule = null
        }

        this.form.ref_type = 'sales_orders'

        // Handle files first
        if (this.form.issue_files) {
          if (Array.isArray(this.form.issue_files)) {
            this.form.issue_files.forEach((file, index) => {
              formData.append(`issue_files`, file)
            })
          } else {
            formData.append('issue_files', this.form.issue_files)
          }
        }

        // Handle files first
        if (this.form.solution_files) {
          if (Array.isArray(this.form.solution_files)) {
            this.form.solution_files.forEach((file, index) => {
              formData.append(`solution_files`, file)
            })
          } else {
            formData.append('solution_files', this.form.solution_files)
          }
        }

        // Handle regular data
        const regularData = {
          ...this.form,
          issue_files: undefined,
          solution_files: undefined
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/tickets/create-ticket',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formTicketCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        // navigateTo(`/supports/tickets`)

        return response
      } catch (error: any) {
        const responseData = error.response.data
        console.log('Failed To Create Data', error.response.data)
        let errors = ''

        if (typeof responseData.errors === 'object') {
          await Promise.all(
            Object.keys(responseData.errors).map((row: any) => {
              errors += `- ${responseData.errors[row]} <br />`
              this.errors[row] = responseData.errors[row]
            })
          )
        }
        useAlert.alertError(errors + `<br /> ${responseData.message}`)

        return error.response.data
      } finally {
        this.loading.formLoading = false
      }
    },

    async updateModal() {
      if (!!this.loading.formLoading) return
      this.loading.formLoading = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )

      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }

      try {
        let id = this.form.id

        if (!this.form.is_scheduled) {
          this.form.schedule = null
        }

        const formData = new FormData()

        // Object.keys(this.form).forEach(key => {
        //   const value = this.form[key as keyof typeof this.form]
        //   if (value !== null && value !== undefined) {
        //     if (key === 'files' && value instanceof File) {
        //       formData.append(key, value)
        //     }
        //     else if (key === 'so_dts' && Array.isArray(this.form[key])) {
        //       this.form[key].forEach((so_dt, index) => {
        //         formData.append(`${key}[${index}]`, JSON.stringify(so_dt))
        //       })
        //     }
        //     else {
        //       formData.append(key, value as string | Blob)
        //     }
        //   }
        // })

        this.form.ref_type = 'sales_orders'

        // Handle files first
        if (this.form.issue_files) {
          if (Array.isArray(this.form.issue_files)) {
            this.form.issue_files.forEach((file, index) => {
              formData.append(`issue_files`, file)
            })
          } else {
            formData.append('issue_files', this.form.issue_files)
          }
        }

        // Handle files first
        if (this.form.solution_files) {
          if (Array.isArray(this.form.solution_files)) {
            this.form.solution_files.forEach((file, index) => {
              formData.append(`solution_files`, file)
            })
          } else {
            formData.append('solution_files', this.form.solution_files)
          }
        }

        // Handle regular data
        const regularData = {
          ...this.form,
          issue_files: undefined,
          solution_files: undefined
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/tickets/update-ticket',
          // this.form,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        this.form = JSON.parse(
          JSON.stringify(useInitials.formTicketCreateEdit)
        )

        // navigateTo(`/masters/customizations/tickets/edit/${response.data.data[0].id}`)

        this.form.id = id
        await this.show()

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        // navigateTo(`/supports/tickets`)

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

    async updateSchedule() {
      if (!!this.loading.formLoading) return
      this.loading.formLoading = true

      let actionText = 'update'

      if (!this.form.is_scheduled && this.form.schedule && this.form.schedule.id) {
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
        if (!!this.form.schedule) {
          this.form.schedule.sales_order_id = id as number
          this.form.schedule.is_delete = 0
        }

        if (!this.form.is_scheduled && this.form.schedule) {
          this.form.schedule.id = null
          this.form.schedule.is_delete = 1
        }

        this.form.ref_type = 'tickets'

        const formData = new FormData()

        // Handle files first
        if (this.form.issue_files) {
          if (Array.isArray(this.form.issue_files)) {
            this.form.issue_files.forEach((file, index) => {
              formData.append(`issue_files`, file)
            })
          } else {
            formData.append('issue_files', this.form.issue_files)
          }
        }

        // Handle files first
        if (this.form.solution_files) {
          if (Array.isArray(this.form.solution_files)) {
            this.form.solution_files.forEach((file, index) => {
              formData.append(`solution_files`, file)
            })
          } else {
            formData.append('solution_files', this.form.solution_files)
          }
        }

        // Handle regular data
        const regularData = {
          ...this.form.schedule,
          ref_type: this.form.ref_type,
          deleted_issue_files: this.form.deleted_issue_files,
          issue_attachments: this.form.issue_attachments,
          solution_attachments: this.form.solution_attachments,
          issue_files: undefined,
          solution_files: undefined
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/tickets/update-schedule',
          // this.form.schedule
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        // useScheduleStore().isOpen.detailEvent = false

        // navigateTo(`/masters/customizations/tickets/edit/${response.data.data[0].id}`)

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

    async createSchedule() {
      if (!!this.loading.formLoading) return
      this.loading.formLoading = true

      let actionText = 'create'

      if (!this.form.is_scheduled && this.form.schedule && this.form.schedule.id) {
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
        if (!!this.form.schedule) {
          this.form.schedule.sales_order_id = id as number
          this.form.schedule.is_delete = 0
        }

        if (!this.form.is_scheduled && this.form.schedule) {
          this.form.schedule.id = null
          this.form.schedule.is_delete = 1
        }

        this.form.ref_type = 'sales_orders'

        const formData = new FormData()

        // Handle files first
        if (this.form.issue_files) {
          if (Array.isArray(this.form.issue_files)) {
            this.form.issue_files.forEach((file, index) => {
              formData.append(`issue_files`, file)
            })
          } else {
            formData.append('issue_files', this.form.issue_files)
          }
        }

        // Handle files first
        if (this.form.solution_files) {
          if (Array.isArray(this.form.solution_files)) {
            this.form.solution_files.forEach((file, index) => {
              formData.append(`solution_files`, file)
            })
          } else {
            formData.append('solution_files', this.form.solution_files)
          }
        }

        // Handle regular data
        const regularData = {
          ...this.form.schedule,
          ref_type: this.form.ref_type,
          issue_files: undefined,
          solution_files: undefined
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/tickets/create-schedule',
          // this.form.schedule
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        useScheduleStore().isOpen.createEvent = false

        // navigateTo(`/masters/customizations/tickets/edit/${response.data.data[0].id}`)

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
      this.form.id = id

      const isConfirmed = await useAlert.showPopupConfirmation(
        `Are you sure to delete this data?`,
        `Schedule will be deleted`
      )

      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }

      if (!this.form.schedule) {
        useAlert.alertError('Schedule not found')

        return;
      }

      try {
        const response = await useMyFetch().post(
          '/v1/tickets/delete-schedule',
          {
            id: this.form.schedule.id,
          }
        )

        useAlert.alertSuccess(response.data.message)

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async delete(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/tickets/delete-ticket',
          this.form
        )
        this.form = response.data.data[0]

        useAlert.alertSuccess(response.data.message)

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      } finally {
        this.form.id = null
      }
    },

    async restore(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/tickets/restore-ticket',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    handleClearQuery() {
    },

    handleClickClear() {
      this.form = cloneObject(useInitials.formTicketCreateEdit);
      this.errors = {};
    },

    async fetchModalFilter() {
    },

    async fetchDataServerFetch(options: { [key: string]: any }) {

      await this.fetchModalFilter();
    },

    handleUploadFile(event: Event) {
      console.log('file', event);
      // const input = event.target as HTMLInputElement
      // if (input.files) {
      // this.form.files = Array.from(input.files)
      // }
    },

    handleDeleteIssueFile(issue_attachments: TicketAttachmentsType | File, index: number) {
      if ((issue_attachments as TicketAttachmentsType).id) {
        this.form.issue_attachments.splice(index, 1);
        this.form.deleted_issue_files.push((issue_attachments as TicketAttachmentsType).id);
      }
    },

    handleDeleteSolutionFile(solution_attachments: TicketAttachmentsType | File, index: number) {
      if ((solution_attachments as TicketAttachmentsType).id) {
        this.form.solution_attachments.splice(index, 1);
        this.form.deleted_solution_files.push((solution_attachments as TicketAttachmentsType).id);
      }
    },

    async handleExistingIssueFile(issue_attachments: TicketAttachmentsType, index: number) {

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to delete this file?',
        'Data will be deleted permanently when you update this ticket',
      )

      if (!isConfirmed) {
        return
      }

      try {
        this.form.issue_attachments.splice(index, 1);
        this.form.deleted_issue_files.push(issue_attachments.id);
      }
      catch (error) {
        console.error('Error deleting file:', error);
        useAlert.alertError('Failed to delete file. Please try again later.');
      } finally {
        this.loading.formLoading = false
      }
    },

    async handleExistingSolutionFile(solution_attachments: TicketAttachmentsType, index: number) {

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to delete this file?',
        'Data will be deleted permanently when you update this ticket',
      )

      if (!isConfirmed) {
        return
      }

      try {
        this.form.solution_attachments.splice(index, 1);
        this.form.deleted_solution_files.push(solution_attachments.id);
      }
      catch (error) {
        console.error('Error deleting file:', error);
        useAlert.alertError('Failed to delete file. Please try again later.');
      } finally {
        this.loading.formLoading = false
      }
    },

    async handleDownloadFile(issue_attachments: TicketAttachmentsType) {
      if (this.loading.imageDownloadLoading) return
      this.loading.imageDownloadLoading = true

      try {
        const config = useRuntimeConfig();
        const FILE_BASE_URL = config.public.BASE_URL_IMAGE;
        const url = `${FILE_BASE_URL}/${issue_attachments.file_url}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = issue_attachments.file_name;
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

    handleViewFullPageFile(issue_attachments: TicketAttachmentsType) {
      if (this.loading.imageDownloadLoading) return

      this.loading.imageDownloadLoading = true

      try {
        const config = useRuntimeConfig();
        const FILE_BASE_URL = config.public.BASE_URL_IMAGE;
        const url = `${FILE_BASE_URL}/${issue_attachments.file_url}`;
        const filename = issue_attachments.file_name;
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

    async goToTicket(id: number) {
      await navigateTo(`/supports/tickets/edit/${id}`);
    },

    openModalIssueAttachmentImg(isOpen: boolean, issue_attachment: TicketAttachmentsType) {
      this.isOpenModal.issue_attachment_imgs = isOpen

      // find index issue_attachment by id
      this.isOpenModal.issue_attachment_opened = this.modals.issue_attachment_imgs.findIndex((item: TicketAttachmentsType) => item.id === issue_attachment.id)
      // this.openedModal.issue_attachment_img = issue_attachment
    },

    openModalSolutionAttachmentImg(isOpen: boolean, solution_attachment: TicketAttachmentsType) {
      this.isOpenModal.solution_attachment_imgs = isOpen

      // find index solution_attachment by id
      this.isOpenModal.solution_attachment_opened = this.modals.solution_attachment_imgs.findIndex((item: TicketAttachmentsType) => item.id === solution_attachment.id)
      // this.openedModal.issue_attachment_img = issue_attachment
    },
  },
  persist: [
    {
      paths: ['queryModal', 'formTabTicket'],
      storage: localStorage
    }
  ]
})

export default useTicketStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTicketStore, import.meta.hot))
}