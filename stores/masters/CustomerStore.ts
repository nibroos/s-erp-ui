import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormInvDtProductListType } from '~/types/inventories/InventoryType'
import type { CustomerType, FormCustomerType } from '~/types/masters/CustomerType'

const useCustomerStore = defineStore('CustomerStore', {
  state: () => ({
    form: {} as FormCustomerType,
    queryModal: {
      qListIndex: {
        page: 1,
        per_page: 100,
        global: '',
        order_column: 'name',
        order_direction: 'desc'
      } as Record<string, any>,
      qIndexHardwareProducts: {
        page: 1,
        per_page: 100,
        global: '',
        order_column: 'name',
        order_direction: 'desc'
      } as Record<string, any>,
      qIndexSoftwareProducts: {
        page: 1,
        per_page: 100,
        global: '',
        order_column: 'name',
        order_direction: 'desc'
      } as Record<string, any>,
    },
    metaModal: {
      index: {
        data: [] as any,
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSoftwareProducts: {
        data: [] as any,
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexHardwareProducts: {
        data: [] as any,
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
    },
    itemsCheck: {
      checkPayload: [] as any,
      checkMainSoftwareProducts: [] as any[],
      checkMainHardwareProducts: [] as any[],
      checkSoftwareProducts: [] as FormInvDtProductListType[],
      checkHardwareProducts: [] as FormInvDtProductListType[],
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    formLoading: false,
    isOpenModal: {
      software: false,
      hardware: false,
    },
    optionRefBtn: {
      software: [
        {
          cta: "+ Add Item",
          key: "products",
          icon: "mdi-alpha-s-circle-outline",
          count: 0,
          type: "button",
          // textClass: 'text-grey1'
        },
      ] as RefBtnType[],
      hardware: [
        {
          cta: "+ Add Item",
          key: "products",
          icon: "mdi-alpha-h-circle-outline",
          count: 0,
          type: "button",
          // textClass: 'text-grey1'
        },
      ] as RefBtnType[],
    }
  }),

  actions: {
    async indexCustomer() {
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

    async show() {
      try {
        const response = await useMyFetch().post(
          '/v1/customers/show-customer',
          this.form
        )
        this.form = {
          ...this.form,
          ...response.data.data[0]
        }

        // filter lowercase
        this.itemsCheck.checkMainSoftwareProducts = response.data.data[0].customer_contracts.filter((item: any) => item.item_group_name.toLowerCase() == 'software')
        this.itemsCheck.checkMainHardwareProducts = response.data.data[0].customer_contracts.filter((item: any) => item.item_group_name.toLowerCase() == 'hardware')

        this.form.pic_emails = response.data.data[0].pic_emails

        // let emails = [];
        // if (!this.form.pic_emails || this.form.pic_emails.length == 0 || this.form.pic_emails?.length !== 10) {
        //   // for 10x
        //   for (let i = 0; i < 10; i++) {
        //     emails.push({
        //       id: null,
        //       name: "-",
        //       is_main: 0,
        //     });
        //   }

        //   this.form.pic_emails = emails;
        // }
        // console.log('emails store', emails);
        console.log('this.form', this.form);


        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      }
    },

    async store() {
      if (!!this.formLoading) return
      this.formLoading = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )

      if (!isConfirmed) {
        this.formLoading = false
        return
      }

      this.form.is_crm = 0;
      try {
        const response = await useMyFetch().post(
          '/v1/customers/create-customer',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formCustomerCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/masters/customers/edit/${response.data.data[0].id}`)

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
        this.formLoading = false
      }
    },

    async update() {
      if (!!this.formLoading) return
      this.formLoading = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )

      if (!isConfirmed) {
        this.formLoading = false
        return
      }

      try {
        let id = this.form.id

        // where product_id != null
        const checkMainSoftwareProducts = this.itemsCheck.checkMainSoftwareProducts.filter((item: any) => item.product_id != null)
        const checkMainHardwareProducts = this.itemsCheck.checkMainHardwareProducts.filter((item: any) => item.product_id != null)

        this.form.customer_contracts = [
          ...checkMainSoftwareProducts,
          ...checkMainHardwareProducts,
        ]

        const response = await useMyFetch().post(
          '/v1/customers/update-customer',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formCustomerCreateEdit)
        )

        // navigateTo(`/masters/customers/edit/${response.data.data[0].id}`)

        this.form.id = id
        this.show()

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
        this.formLoading = false
      }
    },

    async delete(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/customers/delete-customer',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async restore(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/customers/restore-customer',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    onClickDeleteSelected(item: any, index: number, type: 'software' | 'hardware' = 'software') {
      if (type == 'software') {
        this.itemsCheck.checkMainSoftwareProducts.splice(index, 1);
      } else if (type == 'hardware') {
        this.itemsCheck.checkMainHardwareProducts.splice(index, 1);
      }
    },

    async onClickOpenModalOptionRefBtn(ref: RefBtnType) {
      if (ref.key == "software") {
        this.itemsCheck.checkSoftwareProducts = this.itemsCheck.checkMainSoftwareProducts;
        this.isOpenModal.software = true;
      } else if (ref.key == "hardware") {
        this.itemsCheck.checkHardwareProducts = this.itemsCheck.checkMainHardwareProducts;
        this.isOpenModal.hardware = true;
      }

      await this.fetchModalFilter();
    },


    async fetchModalFilter() {
      if (this.isOpenModal.software) {
        await this.indexProduct();
      }
      else if (this.isOpenModal.hardware) {
        await this.indexProduct();
      }
    },

    async indexProduct() {
      let params
      if (this.isOpenModal.software) {
        if (this.metaModal.indexSoftwareProducts.loading) return
        this.metaModal.indexSoftwareProducts.loading = true

        params = this.queryModal.qIndexSoftwareProducts
      } else if (this.isOpenModal.hardware) {
        if (this.metaModal.indexHardwareProducts.loading) return
        this.metaModal.indexHardwareProducts.loading = true
        params = this.queryModal.qIndexHardwareProducts
      }

      try {
        const response = await useMyFetch().post(
          '/v1/products/index-product',
          params
        )

        if (this.isOpenModal.software) {
          this.metaModal.indexSoftwareProducts = response.data
        } else if (this.isOpenModal.hardware) {
          this.metaModal.indexHardwareProducts = response.data
        }

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      }
      finally {
        this.metaModal.indexSoftwareProducts.loading = false
      }
    },

  },
  persist: [
    {
      paths: ['queryModal'],
      storage: localStorage
    }
  ]
})

export default useCustomerStore