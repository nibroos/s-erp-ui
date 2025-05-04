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
import type { FormSoDtBomListType, FormSoDtProductListType, FormSalesOrderType, IndexSalesOrderType, QSoIndexType, SoDtBomType, SoDtType, QIndexQuotationsType, SoDtDiscType, FormScheduleType, SalesOrderAttachmentsType, WidgetSingleType } from '~/types/sales-orders/SalesOrderType'
import useScheduleStore from './ScheduleStore'

const useSalesOrderStore = defineStore('SalesOrderStore', {
  state: () => ({
    form: {
      id: null,
    } as FormSalesOrderType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'order_at',
        order_direction: 'desc'
      } as QSoIndexType,

      qIndexProducts: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        order_column: 'name',
        order_direction: 'desc'
      } as QIndexProductsType,
      qIndexQuotations: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        quotation_ids: [],
        customer_id: null,
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        order_column: 'due_at',
        order_direction: 'desc'
      } as QIndexQuotationsType,
      qIndexBoms: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        order_column: 'name',
        order_direction: 'desc'
      } as QIndexProductsType
    },
    metaModal: {
      index: {
        data: [] as IndexSalesOrderType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexProducts: {
        data: [] as FormSoDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexQuotations: {
        data: [] as FormSoDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexBoms: {
        data: [] as FormSoDtBomListType[],
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
      imageDownloadLoading: false,
      widgetLoading: false,
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    itemsCheck: {
      checkMain: [] as SoDtType[],
      checkProducts: [] as FormSoDtProductListType[],
      checkBoms: [] as SoDtBomType[],
      checkQuotations: [] as FormSoDtProductListType[],
    },
    isOpenModal: {
      products: false,
      boms: false,
      quotations: false,
      attachment_imgs: false,
      attachment_opened: 0,
    },
    optionRefBtnRef: [
      {
        cta: "Ms. Product",
        key: "products",
        icon: "mdi-alpha-m-box-outline",
        count: 0,
        type: "button",
        // textClass: 'text-grey1'
      },
      {
        cta: "Quotation",
        key: "quotations",
        icon: "mdi-offer",
        count: 0,
        type: "button",
        // textClass: 'text-grey1'
      },
    ] as RefBtnType[],
    openedModal: {
      boms: {
        id: null as number | null,
        index: null as number | null,
        product_id: null as number | null,
        product_uuid: '' as string
      },
      attachment_img: {} as SalesOrderAttachmentsType,
    },
    currencySymbolLabel: '' as string | null,
    referenceOptions: {
      vats: [] as FormVatType[],
    },
    modals: {
      attachment_imgs: [] as SalesOrderAttachmentsType[],
    },
    headAutocomplete: {
      quo: {
        customer_id: null as number | null | undefined,
        order_type_id: null as number | null | undefined,
        currency_id: null as number | null | undefined,
        exchange_rate: 0 as number | null | undefined,
        is_vat: 0 as number | null | undefined,
        vat_id: null as number | null | undefined,
        vat_perc: 0,
        pph23_id: null as number | null | undefined,
        pph23_perc: 0,
        markup_perc: 0,
        disc_am: 0,
        disc_perc: 0,
        remark: '' as string | null | undefined,
      }
    },
    formLayout: {
      title: "Basic Information",
      parentPath: "/sales/sales-orders",
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
    async indexSalesOrder() {
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
          '/v1/sales-orders/widget-sales-order',
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
          '/v1/sales-orders/show-sales-order',
          {
            id: this.form.id
          }
        )

        this.form.schedule = {} as FormScheduleType

        this.form = response.data.data[0]
        if (!this.form.schedule) {
          this.form.is_scheduled = 0
          this.form.schedule = useInitials.formSalesOrderCreateEdit.schedule
          console.log("!this.form.schedule", this.form.schedule);

          // this.form.schedule.title = this.form.po_buyer_no
        } else {
          this.form.is_scheduled = 1
        }

        if (!this.form.attachments) {
          this.form.attachments = []
        } else {
          this.modals.attachment_imgs = this.form.attachments.filter((item: SalesOrderAttachmentsType) => {
            return item.file_type.includes('image')
          })
        }

        this.form.deleted_files = []

        this.itemsCheck.checkMain = initCheckedSoDt(this.form.so_dts)

        // this.itemsCheck.checkProducts = updateSoRefsModalFromMain(
        //   this.itemsCheck.checkMain,
        //   "products",
        //   this.itemsCheck.checkProducts
        // );

        // this.itemsCheck.checkQuotations = updateSoRefsModalFromMain(
        //   this.itemsCheck.checkMain,
        //   "quotations",
        //   this.itemsCheck.checkQuotations
        // );

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      } finally {
        this.loading.editPageLoading = false
        this.updateRefsModal();
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
          files: undefined // Remove files from regular data
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/sales-orders/create-sales-order',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formSalesOrderCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/sales/sales-orders`)

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
          files: undefined // Remove files from regular data
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/sales-orders/update-sales-order',
          // this.form,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        this.form = JSON.parse(
          JSON.stringify(useInitials.formSalesOrderCreateEdit)
        )

        // navigateTo(`/masters/customizations/sales-orders/edit/${response.data.data[0].id}`)

        this.form.id = id
        await this.show()

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        navigateTo(`/sales/sales-orders`)

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

        this.form.ref_type = 'sales_orders'

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
          ...this.form.schedule,
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

        // useScheduleStore().isOpen.detailEvent = false

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
          ...this.form.schedule,
          files: undefined // Remove files from regular data
        }
        formData.append('data', JSON.stringify(regularData))

        const response = await useMyFetch().post(
          '/v1/sales-orders/create-schedule',
          // this.form.schedule
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        useScheduleStore().isOpen.createEvent = false

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
          '/v1/sales-orders/delete-schedule',
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
          '/v1/sales-orders/delete-sales-order',
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
          '/v1/sales-orders/restore-sales-order',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async indexProduct() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      let params = this.queryModal.qIndexProducts

      if (this.isOpenModal.boms) {
        params = this.queryModal.qIndexBoms
      }
      try {
        const response = await useMyFetch().post(
          '/v1/products/index-product',
          params
        )

        if (this.isOpenModal.products) {
          this.metaModal.indexProducts = response.data

          if (this.itemsCheck.checkProducts.length > 0) {
            this.itemsCheck.checkProducts.forEach((checkProduct: FormSoDtProductListType, iCheckProduct: number) => {
              (this.metaModal.indexProducts.data as FormSoDtProductListType[]).forEach((resProduct: FormSoDtProductListType, iResProduct: number) => {
                // console.log('checkProduct', iCheckProduct, checkProduct);

                if (resProduct.ref_id === checkProduct.ref_id && checkProduct.ref_type === 'products') {
                  // console.log('resProduct', iResProduct, resProduct);

                  const combined = {
                    ...resProduct,
                    ...checkProduct
                  }

                  this.metaModal.indexProducts.data[iResProduct] = combined
                  this.itemsCheck.checkProducts[iCheckProduct] = combined
                }
              })
            })
          }
        }

        if (this.isOpenModal.boms) {
          this.metaModal.indexBoms = response.data

          if (this.itemsCheck.checkBoms.length > 0) {
            let generatedBoms = generateSoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)

            generatedBoms.forEach((checkBom: SoDtBomType, iCheckBom: number) => {
              (this.metaModal.indexBoms.data as SoDtBomType[]).forEach((resBom: FormSoDtBomListType, iResBom: number) => {

                if (resBom.ref_id === checkBom.item_id) {
                  // console.log('checkBom', iCheckBom, checkBom);
                  // console.log('checkResBom', iResBom, resBom);
                  // console.log('resBom', iResBom, resBom);

                  const combined = {
                    ...resBom,
                    ...checkBom
                  }

                  this.metaModal.indexBoms.data[iResBom] = combined
                  this.itemsCheck.checkBoms[iCheckBom] = combined
                }
              })
            })
          }
        }

        // return this.metaModal.indexProducts
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.index.loading = false
      }
    },

    async indexQuotation() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      if (this.itemsCheck.checkQuotations.length > 0) {
        this.queryModal.qIndexQuotations.quotation_ids = this.itemsCheck.checkQuotations.map((item: FormSoDtProductListType) => (item.quotation_id ?? item.ref_id as number))
      }

      let params = this.queryModal.qIndexQuotations

      if (this.isOpenModal.boms) {
        params = this.queryModal.qIndexBoms
      }

      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/index-ref-quo-dt',
          params
        )

        if (this.isOpenModal.quotations) {
          this.metaModal.indexQuotations = response.data

          if (this.itemsCheck.checkQuotations.length > 0) {
            this.itemsCheck.checkQuotations.forEach((checkQuotation: FormSoDtProductListType, iCheckQuotation: number) => {
              (this.metaModal.indexQuotations.data as FormSoDtProductListType[]).forEach((resQuotation: FormSoDtProductListType, iResQuotation: number) => {

                if (
                  resQuotation.quo_dt_id === checkQuotation.quo_dt_id ||
                  resQuotation.quo_dt_id === checkQuotation.ref_id
                ) {

                  const combined = {
                    ...resQuotation,
                    ...checkQuotation
                  }

                  this.metaModal.indexQuotations.data[iResQuotation] = combined
                  this.itemsCheck.checkQuotations[iCheckQuotation] = combined
                }
              })
            })

            this.autocompleteQuotation(this.itemsCheck.checkQuotations[0]);
          }
        }

        if (this.isOpenModal.boms) {
          this.metaModal.indexBoms = response.data

          if (this.itemsCheck.checkBoms.length > 0) {
            let generatedBoms = generateSoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)

            generatedBoms.forEach((checkBom: SoDtBomType, iCheckBom: number) => {
              (this.metaModal.indexBoms.data as SoDtBomType[]).forEach((resBom: FormSoDtBomListType, iResBom: number) => {

                if (resBom.ref_id === checkBom.item_id) {
                  // console.log('checkBom', iCheckBom, checkBom);
                  // console.log('checkResBom', iResBom, resBom);
                  // console.log('resBom', iResBom, resBom);

                  const combined = {
                    ...resBom,
                    ...checkBom
                  }

                  this.metaModal.indexBoms.data[iResBom] = combined
                  this.itemsCheck.checkBoms[iCheckBom] = combined
                }
              })
            })
          }
        }

        // return this.metaModal.indexQuotations
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.index.loading = false
      }
    },

    selectItemRefModal() {
      if (this.isOpenModal.products) {
        this.itemsCheck.checkMain = generateSoDt(this.itemsCheck.checkProducts, 'products', this.itemsCheck.checkMain)
        this.isOpenModal.products = false
      }
      if (this.isOpenModal.quotations) {
        this.itemsCheck.checkMain = generateSoDt(this.itemsCheck.checkQuotations, 'quotations', this.itemsCheck.checkMain)
        this.isOpenModal.quotations = false
      }
      if (this.isOpenModal.boms) {
        // this.itemsCheck.checkMain = generateSoDt(this.itemsCheck.checkProducts, 'boms', this.itemsCheck.checkMain)

        if (this.itemsCheck.checkBoms.length > 0) {

          this.itemsCheck.checkBoms = generateSoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)
        } else {
          this.itemsCheck.checkBoms = []
        }
        this.itemsCheck.checkMain[this.openedModal.boms.index as number].so_dts_boms = this.itemsCheck.checkBoms
        this.isOpenModal.boms = false
      }
    },

    clickClearRefs() {
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []

      this.countSelectedReferences()
    },

    handleClearQuery() {
      this.queryModal.qIndexProducts = {
        page: 1,
        per_page: 10,
        item_group_ids: [],
        item_sub_group_ids: [],
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        order_column: 'name',
        order_direction: 'desc'
      }
    },

    resetSummary() {
      if (this.formLayout?.summary) {
        this.formLayout.summary.total_amount.value = 0;
        // this.formLayout.summary.total_qty.value = 0
        this.formLayout.summary.total_discount.value = 0
        this.formLayout.summary.total_after_disc.value = 0
        this.formLayout.summary.total_vat.value = 0
        this.formLayout.summary.total_pph23.value = 0
        this.formLayout.summary.grand_total.value = 0
      }
    },

    handleClickClear() {
      this.form = cloneObject(useInitials.formSalesOrderCreateEdit);
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.errors = {};

      this.resetSummary()
      this.countSelectedReferences()
    },

    countSelectedReferences() {

      this.optionRefBtnRef.map((item) => {
        if (item.key == "products") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "products"
          ).length;
        } else if (item.key == "quotations") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "quotations"
          ).length;
        }
      });
    },

    updateRefsModal() {
      // this.itemsCheck.checkProducts = updateRefsModalFromMain(
      //   this.itemsCheck.checkMain,
      //   "products",
      //   this.itemsCheck.checkProducts
      // );

      this.countSelectedReferences();
    },

    autocompleteCustomer(data: any) {
      this.form.email = data.email;
      this.form.phone = data.phone;
      this.form.customer_code = data.shortname;

      if (!!data.currency_id && !this.form.currency_id) {
        this.form.currency_id = data.currency_id
      }

      if (!this.form.ship_dest) {
        this.form.ship_dest = data.address;
      }

      if (!!data.id) {
        this.queryModal.qIndexQuotations.customer_id = data.id;
        this.queryModal.qIndexQuotations.customer_ids = [data.id];
      }
    },

    autocompleteVat(data: FormVatType) {
      this.form.vat_perc = Number(data.num);

      // apply to all childs
      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        // if (!item.vat_id) {
        if (!!item.is_vat) {
          item.vat_id = data.id as number;
          item.vat_perc = Number(data.num);
        }
        // }
      });

      this.calculateTotalAmount();
    },

    autocompleteVatDt(data: FormVatType, soDtType: SoDtType) {
      soDtType.vat_perc = Number(data.num);
      this.calculateTotalAmount();
    },

    autocompletePph23Dt(data: FormPph23Type, soDtType: SoDtType) {
      soDtType.pph23_perc = Number(data.num);
      this.calculateTotalAmount();
    },

    removeVat() {
      this.form.vat_perc = 0;

      this.calculateTotalAmount();
    },

    removeAllVat() {
      this.form.vat_id = null;
      this.form.vat_perc = 0;
      this.form.total_vat = 0;

      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        item.vat_id = null;
        item.vat_perc = 0;
        item.vat_perc_am = 0;
        item.is_vat = 0;
      });

      this.calculateTotalAmount();
    },

    removeVatDt(soDtType: SoDtType) {
      if (!soDtType.vat_id) {
        soDtType.vat_perc = 0;
        soDtType.vat_perc_am = 0;
      }

      this.calculateTotalAmount();
    },

    removePph23Dt(soDtType: SoDtType) {
      if (!soDtType.pph23_id) {
        soDtType.pph23_perc = 0;
        soDtType.pph23_perc_am = 0;
      }

      this.calculateTotalAmount();
    },

    removePph() {
      this.form.pph23_perc = 0;
      this.form.total_pph23 = 0;

      // remove all childs
      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        item.pph23_id = null;
        item.pph23_perc = 0;
        item.pph23_perc_am = 0;
      });

      this.calculateTotalAmount();
    },

    removeAllPph() {
      this.form.pph23_id = null;
      this.form.pph23_perc = 0;

      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        item.pph23_id = null;
        item.pph23_perc = 0;
        item.pph23_perc_am = 0;
        item.is_pph23 = 0;
      });

      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type) {
      this.form.pph23_perc = Number(data.num);

      // apply to all childs
      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        // if (!item.pph23_id) {
        if (!!item.is_pph23) {
          item.pph23_id = data.id as number;
          item.pph23_perc = Number(data.num);
        }
        // }
      });

      this.calculateTotalAmount();
    },

    autocompleteCurrency(data: FormCurrencyType) {
      this.form.exchange_rate = Number(data.num);
      this.currencySymbolLabel = data.symbol;

      this.calculateTotalAmount();
    },

    closeAllModal() {
      this.isOpenModal.quotations = false;
      this.isOpenModal.products = false;
      this.isOpenModal.boms = false;
    },

    onClickUpdateProductsModal() {

      if (this.isOpenModal.quotations) {
        this.form.order_type_id = this.headAutocomplete.quo.order_type_id;
        this.form.currency_id = this.headAutocomplete.quo.currency_id;
        this.form.exchange_rate = this.headAutocomplete.quo.exchange_rate;
        this.form.is_vat = this.headAutocomplete.quo.is_vat as number;
        this.form.vat_id = this.headAutocomplete.quo.vat_id;
        this.form.vat_perc = this.headAutocomplete.quo.vat_perc as number;
        this.form.pph23_id = this.headAutocomplete.quo.pph23_id;
        this.form.pph23_perc = this.headAutocomplete.quo.pph23_perc as number;
        // this.form.markup_perc = this.headAutocomplete.quo.markup_perc as number;
        this.form.disc_am = this.headAutocomplete.quo.disc_am as number;
        this.form.disc_perc = this.headAutocomplete.quo.disc_perc as number;
        this.form.remark = this.headAutocomplete.quo.remark

        console.log('onClickUpdateProductsModal', this.form);

      }
      this.selectItemRefModal();
      this.countSelectedReferences();

      console.log('onClickUpdateProductsModal-1', this.headAutocomplete.quo);
      console.log('onClickUpdateProductsModal-isOpenModal', this.isOpenModal.quotations);

      this.closeAllModal();

    },

    onClickDeleteSelected(item: any, index: number) {
      this.itemsCheck.checkMain.splice(index, 1);

      this.countSelectedReferences();
    },

    onClickUpdateBomsModal() {
      // console.log("item, onClickUpdateBomsModal", itemsCheck.value.checkBoms);
      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();
    },

    async onClickOpenModalOptionRefBtn(ref: RefBtnType) {
      this.isOpenModal.products = false;

      if (ref.key == "products") {
        this.itemsCheck.checkProducts = updateSoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "products",
          this.itemsCheck.checkProducts
        );

        this.countSelectedReferences();
        this.isOpenModal.products = true;
      } else if (ref.key == "quotations") {
        this.itemsCheck.checkQuotations = updateSoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "quotations",
          this.itemsCheck.checkQuotations
        );

        this.countSelectedReferences();
        this.isOpenModal.quotations = true;
      }

      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.products || this.isOpenModal.boms) {
        await this.indexProduct();
      } else if (this.isOpenModal.quotations) {
        if (!!this.form.customer_id) {
          this.queryModal.qIndexQuotations.customer_id = this.form.customer_id;
          this.queryModal.qIndexQuotations.customer_ids = [this.form.customer_id];
        } else {
          this.queryModal.qIndexQuotations.customer_id = null;
          this.queryModal.qIndexQuotations.customer_ids = [];
        }
        await this.indexQuotation();
      }
      // } else if (showModal.value.listWip) {
      //   // queryModal.value.qListWip.customer_id = form.value.customer_id
      //   // queryModal.value.qListWip.mode = 'OUT'

      //   await useInventoryIn.getAllDataRequestWIP()
      // }
    },

    async fetchDataServerFetch(options: { [key: string]: any }) {
      if (this.isOpenModal.products) {
        this.queryModal.qIndexProducts.page = options.page;
        this.queryModal.qIndexProducts.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexProducts.order_column = options.sortBy[0].key;
          this.queryModal.qIndexProducts.order_direction = options.sortBy[0].order;
        } else {
          this.queryModal.qIndexProducts.order_column = "";
          this.queryModal.qIndexProducts.order_direction = "";
        }
      }

      if (this.isOpenModal.boms) {
        this.queryModal.qIndexBoms.page = options.page;
        this.queryModal.qIndexBoms.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexBoms.order_column = options.sortBy[0].key;
          this.queryModal.qIndexBoms.order_direction = options.sortBy[0].order;
        } else {
          this.queryModal.qIndexBoms.order_column = "";
          this.queryModal.qIndexBoms.order_direction = "";
        }
      }

      if (this.isOpenModal.quotations) {
        this.queryModal.qIndexQuotations.page = options.page;
        this.queryModal.qIndexQuotations.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexQuotations.order_column = options.sortBy[0].key;
          this.queryModal.qIndexQuotations.order_direction =
            options.sortBy[0].order;
        } else {
          this.queryModal.qIndexQuotations.order_column = "";
          this.queryModal.qIndexQuotations.order_direction = "";
        }
      }

      await this.fetchModalFilter();
    },

    async onClickOpenModalBOM(
      item: FormSoDtProductListType,
      index: number
    ) {
      this.openedModal.boms.index = index;
      this.openedModal.boms.id = item.ref_id;
      this.openedModal.boms.product_id = item.item_id as number;
      this.openedModal.boms.product_uuid = item.product_uuid as string;

      this.itemsCheck.checkBoms = item.so_dts_boms;
      this.isOpenModal.boms = true;
      await this.indexProduct();
    },

    onClickDeleteBom(
      index: number,
      indexBom: number,
      internalItem: any
    ) {
      const item = this.itemsCheck.checkMain[index];
      if (item && item.so_dts_boms) {
        item.so_dts_boms.splice(indexBom, 1);
      }

      this.calculateTotalAmount();
    },

    autocompleteQuotation(data: FormSoDtProductListType) {
      this.form.customer_id = data.customer_id;
      this.headAutocomplete.quo.order_type_id = data.order_type_id;
      this.headAutocomplete.quo.currency_id = data.currency_id;
      this.headAutocomplete.quo.exchange_rate = data.exchange_rate;
      this.headAutocomplete.quo.vat_id = data.head_vat_id;
      this.headAutocomplete.quo.vat_perc = data.head_vat_perc as number;
      this.headAutocomplete.quo.pph23_id = data.head_pph23_id;
      this.headAutocomplete.quo.pph23_perc = data.head_pph23_perc as number;
      // this.headAutocomplete.quo.markup_perc = data.head_markup_perc as number;
      this.headAutocomplete.quo.disc_am = data.head_disc_am as number;
      this.headAutocomplete.quo.disc_perc = data.head_disc_perc as number;
      this.headAutocomplete.quo.remark = data.head_remark
      this.headAutocomplete.quo.is_vat = data.head_is_vat as number;
    },

    removeQuotation() {
      // this.form.customer_id = null;
      // this.form.order_type_id = null;
      // this.form.currency_id = null;
      // this.form.exchange_rate = 1;
      // this.form.vat_id = null;
      // this.form.vat_perc = 0;
      // this.form.pph23_id = null;
      // this.form.pph23_perc = 0;
      // this.form.markup_perc = 0;
      // this.form.disc_am = 0;
      // this.form.disc_perc = 0;
      // this.form.remark = '';
      this.queryModal.qIndexQuotations.quotation_ids = [];
      this.indexQuotation();
    },

    autocompleteMarkup(value: number) {
      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        if (!item.is_lock_markup) {
          item.markup_perc = value;
        }
      });
    },

    calculateMarkup(soDt: SoDtType) {
      if (!soDt.is_lock_price_sell) {
        soDt.markup_perc_am = soDt.price_buy * (soDt.markup_perc ?? 0) / 100;
        soDt.price_sell = soDt.price_buy + (soDt.price_buy * (soDt.markup_perc ?? 0) / 100);
      }
    },

    onClickLockMarkup(quoDt: SoDtType) {
      if (!!quoDt.is_lock_markup) {
        quoDt.is_lock_markup = 0;
      } else {
        quoDt.is_lock_markup = 1;
      }
    },

    onClickLockPriceSell(quoDt: SoDtType) {
      if (!!quoDt.is_lock_price_sell) {
        quoDt.is_lock_price_sell = 0;
      } else {
        quoDt.is_lock_price_sell = 1;
      }
    },

    calculateDtPrice(soDt: SoDtType) {
      if (!!soDt.so_dts_boms && soDt.so_dts_boms.length > 0) {
        soDt.price_buy = soDt.so_dts_boms.reduce(
          (acc: number, item: SoDtBomType) => acc + item.subtotal_buy,
          0
        );
      }
      else if (!!soDt.quo_dts_boms && soDt.quo_dts_boms.length > 0) {
        soDt.price_buy = soDt.quo_dts_boms.reduce(
          (acc: number, item: SoDtBomType) => acc + item.subtotal_buy,
          0
        );
      }
      else if (!!soDt.boms && soDt.boms.length > 0) {
        soDt.price_buy = soDt.boms.reduce(
          (acc: number, item: SoDtBomType) => acc + item.subtotal_buy,
          0
        );
      }

      this.calculateMarkup(soDt);
    },

    calculatePrice(soDtBom: SoDtBomType, soDt: SoDtType) {
      soDtBom.subtotal_buy = soDtBom.price_buy * soDtBom.qty;

      if (!!soDt.so_dts_boms && soDt.so_dts_boms.length > 0) {
        soDt.price_buy = soDt.so_dts_boms.reduce(
          (acc: number, item: SoDtBomType) => acc + item.subtotal_buy,
          0
        );
      }
      else if (!!soDt.quo_dts_boms && soDt.quo_dts_boms.length > 0) {
        soDt.price_buy = soDt.quo_dts_boms.reduce(
          (acc: number, item: SoDtBomType) => acc + item.subtotal_buy,
          0
        );
      }
      else if (!!soDt.boms && soDt.boms.length > 0) {
        soDt.price_buy = soDt.boms.reduce(
          (acc: number, item: SoDtBomType) => acc + item.subtotal_buy,
          0
        );
      }

      this.calculateMarkup(soDt);
    },

    onClickSwitchVAT(data: any) {
      if (!data) {
        this.form.vat_id = null;
        this.form.vat_perc = 0;
        this.form.total_vat = 0;
      } else {
        this.form.vat_id = this.referenceOptions.vats[0].id as number;
      }
    },

    calculateTotalAmount() {
      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        // if (!!item.so_dts_boms) {
        //   item.so_dts_boms.forEach((bom: SoDtBomType) => {
        //     this.calculatePrice(bom, item);
        //   });
        // }

        if (!!item.disc_perc && item.disc_perc > 0) {
          item.disc_am = 0;
        } else if (!!item.disc_am && item.disc_am > 0) {
          item.disc_perc = 0;
        }

        const discPercentage = Number((item.disc_perc ?? 0) / 100);
        const discAmount = Number(item.disc_am);
        const priceSell = Number(item.price_sell);
        const priceBuy = Number(item.price_buy);
        const qty = Number(item.qty);
        const subtotalSell = Number(priceSell * qty);
        const subtotalBuy = Number(priceBuy * qty);

        const discPercPriceSell = Number(priceSell * discPercentage);
        const discPercNum = Number(priceSell - discPercPriceSell);
        // const subDiscPercAm = Number(qty * discPercNum);
        const discPercAm = Number(subtotalSell * discPercentage);
        const subDiscPercAm = Number(subtotalSell - discPercAm);

        item.subtotal_sell = subtotalSell;
        item.subtotal_buy = subtotalBuy;

        let discType: SoDtDiscType = null;

        let discFinal = 0;
        if (!!discAmount && discAmount > 0) {
          discType = "a";
          //   discFinal = subtotalSell - discAmount;
        } else if (!!discPercentage && discPercentage > 0) {
          discType = "p";
          //   discFinal = subDiscPercAm;
        } else if (
          !!discAmount &&
          discAmount > 0 &&
          !!discPercentage &&
          discPercentage > 0
        ) {
          discType = "all";
          // discFinal = subDiscPercAm - discAmount;
        }

        // discFinal = subDiscPercAm;
        discFinal = subDiscPercAm - discAmount;
        if (discFinal <= 0) {
          discFinal = subtotalSell;
        }

        item.disc_perc_num = 0;
        item.disc_perc_am = 0;
        item.disc_final = discFinal
        if (discPercentage) {
          item.disc_perc_num = discPercNum;
          item.disc_perc_am = discPercAm;
        }

        item.vat_perc_am = 0;

        item.pph23_perc_am = 0;

        item.total_am = item.disc_final + item.vat_perc_am - item.pph23_perc_am;
      });

      // header calculation
      this.form.subtotal = this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + item.subtotal_sell,
        0
      );

      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + item.qty,
        0
      );

      this.form.disc_final = Number(this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + (item.disc_perc_am + item.disc_am),
        0
      ));

      this.form.disc_perc_am = 0

      if (!!this.form.disc_perc) {
        // this.form.disc_perc_am = this.form.disc_final * (((this.form.disc_perc ?? 0) / 100));

        let discPercAm = this.itemsCheck.checkMain.reduce(
          (acc: number, item: SoDtType) => {
            return acc + (item.total_am * (this.form.disc_perc / 100));
          },
          0
        );

        this.form.disc_perc_am = discPercAm;
      }

      // // this.form.total_discount = item.disc_perc_am + item.disc_am + this.form.disc_am + this.form.disc_perc_am;
      this.form.total_discount = this.form.disc_final + this.form.disc_perc_am + this.form.disc_am;
      if (this.form.total_discount < 0) {
        this.form.total_discount = 0
      }

      this.form.total_after_disc = this.form.subtotal - this.form.total_discount;

      this.form.disc_type = null;
      if (!!this.form.vat_id) {
        let totalAmIsVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: SoDtType) => {
            if (!!item.is_vat) {
              return acc + item.total_am;
            }
            return acc;
          },
          0
        );

        let discPercAmVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: SoDtType) => {
            if (!!item.is_vat) {
              return acc + (item.total_am * (this.form.disc_perc / 100));
            }
            return acc;
          },
          0
        );

        this.form.total_vat = (totalAmIsVat - (discPercAmVat + this.form.disc_am)) * ((this.form.vat_perc ?? 0) / 100)
        console.log('calculateTotalAmount-total_vat', this.form.total_vat);

        if (this.form.total_vat < 0) {
          this.form.total_vat = 0;
        }
      }

      if (!!this.form.pph23_id) {
        let subtotalIsPph23 = this.itemsCheck.checkMain.reduce(
          (acc: number, item: SoDtType) => {
            if (!!item.is_pph23) {
              return acc + item.subtotal_sell;
            }
            return acc;
          },
          0
        );
        this.form.total_pph23 = subtotalIsPph23 * ((this.form.pph23_perc ?? 0) / 100);
      }

      this.form.grand_total =
        this.form.subtotal - this.form.total_discount + this.form.total_vat - this.form.total_pph23;

      if (this.formLayout.summary) {
        console.log('calculateTotalAmount-summary-total_vat', this.form.total_vat);
        this.formLayout.summary.total_amount.value = this.form.subtotal;
        this.formLayout.summary.total_after_disc.value = this.form.total_after_disc;
        this.formLayout.summary.total_discount.value = this.form.total_discount;
        this.formLayout.summary.total_vat.value = this.form.total_vat;
        this.formLayout.summary.total_pph23.value = this.form.total_pph23;
        this.formLayout.summary.grand_total.value = this.form.grand_total;

        // if (this.form.grand_total < 0) {
        //   this.form.grand_total = 0;
        //   this.formLayout.summary.grand_total.value = 0;
        // }

        // TODO foreach currency symbol
      }

      let response = {
        summary: {
          total_amount: this.form.subtotal,
          total_after_disc: this.form.total_after_disc,
          total_discount: this.form.total_discount,
          total_vat: this.form.total_vat,
          total_pph23: this.form.total_pph23,
          grand_total: this.form.grand_total,
        },
      }

      return response
    },

    handleUploadFile(event: Event) {
      console.log('file', event);
      // const input = event.target as HTMLInputElement
      // if (input.files) {
      // this.form.files = Array.from(input.files)
      // }
    },

    handleDeleteFile(attachments: SalesOrderAttachmentsType | File, index: number) {
      if ((attachments as SalesOrderAttachmentsType).id) {
        this.form.attachments.splice(index, 1);
        this.form.deleted_files.push((attachments as SalesOrderAttachmentsType).id);
      }
    },

    async handleExistingFile(attachments: SalesOrderAttachmentsType, index: number) {

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to delete this file?',
        'Data will be deleted permanently when you update this sales order',
      )

      if (!isConfirmed) {
        return
      }

      try {
        this.form.attachments.splice(index, 1);
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

    async goToSalesOrder(id: number) {
      await navigateTo(`/sales/sales-orders/edit/${id}`);
    },

    openModalAttachmentImg(isOpen: boolean, attachment: SalesOrderAttachmentsType) {
      this.isOpenModal.attachment_imgs = isOpen

      // find index attachment by id
      this.isOpenModal.attachment_opened = this.modals.attachment_imgs.findIndex((item: SalesOrderAttachmentsType) => item.id === attachment.id)
      // this.openedModal.attachment_img = attachment
    }
  },
  persist: [
    {
      paths: ['queryModal', 'formTabSalesOrder'],
      storage: localStorage
    }
  ]
})

export default useSalesOrderStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalesOrderStore, import.meta.hot))
}