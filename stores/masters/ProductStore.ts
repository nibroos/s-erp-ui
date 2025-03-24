import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { CreateBomsRequestType, CreateMsItemUnitsRequestType, FormProductType, ProductListType } from '~/types/masters/ProductType'
import type { UnitType } from '~/types/masters/UnitType'

const useProductStore = defineStore('ProductStore', {
  state: () => ({
    form: {
      id: null,
      item_sub_group_id: null,
      item_unit_id: null,
      code: "",
      factory_code: "",
      name: "",
      sku: "",
      barcode: "",
      specification: "",
      description: "",
      remark: "",
      status: 1,
      expired_at: null,
      is_vat: 1,
      is_pph23: 1,
      units: [] as CreateMsItemUnitsRequestType[],
      boms: [] as CreateBomsRequestType[],
    } as FormProductType,
    queryModal: {
      qListIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'name',
        order_direction: 'desc'
      } as Record<string, any>,
      qListUnits: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'name',
        order_direction: 'desc'
      } as Record<string, any>,
      qListBoms: {
        page: 1,
        per_page: 100,
        parent_ids: [],
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
      indexUnits: {
        data: [] as any,
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexBoms: {
        data: [] as any,
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
    },
    tabFormIndex: 0,
    itemsCheck: {
      checkMainUnits: [] as CreateMsItemUnitsRequestType[],
      checkUnits: [] as CreateMsItemUnitsRequestType[],
      checkMainBoms: [] as CreateBomsRequestType[],
      checkBoms: [] as CreateBomsRequestType[],
    },
    errors: {} as Record<string, any>,
    isOpenModal: {
      units: false,
      boms: false,
    },
  }),

  actions: {
    async indexProduct() {
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
          '/v1/products/show-product',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
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
        const response = await useMyFetch().post(
          '/v1/products/create-product',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formProductCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/masters/customizations/products/edit/${response.data.data[0].id}`)

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

        const response = await useMyFetch().post(
          '/v1/products/update-product',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formProductCreateEdit)
        )

        // navigateTo(`/masters/customizations/products/edit/${response.data.data[0].id}`)

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
        this.loading.formLoading = false
      }
    },

    async delete(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/products/delete-product',
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
          '/v1/products/restore-product',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async indexBom() {
      if (this.metaModal.index.loading) return
      this.metaModal.indexBoms.loading = true

      let params = this.queryModal.qListBoms

      try {
        const response = await useMyFetch().post(
          '/v1/products/index-product',
          params
        )
        this.metaModal.indexBoms.data = response.data.data

        this.metaModal.indexBoms.data.forEach((prod: ProductListType, iProd: number) => {
          this.itemsCheck.checkBoms.forEach((checkBom: CreateBomsRequestType, iCheckBom: number) => {
            if (prod.id == checkBom.product_item_id) {
              prod.id = null
              this.itemsCheck.checkBoms[iCheckBom] = {
                ...prod,
                ...checkBom
              }
            }
          })
        })

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      } finally {
        this.metaModal.indexBoms.loading = false
      }
    },

    async indexUnit() {
      if (this.metaModal.index.loading) return
      this.metaModal.indexUnits.loading = true

      let params = this.queryModal.qListUnits

      try {
        const response = await useMyFetch().post(
          '/v1/units/index-unit',
          params
        )
        this.metaModal.indexUnits.data = response.data.data

        this.metaModal.indexUnits.data.forEach((unit: UnitType, iUnit: number) => {
          this.itemsCheck.checkUnits.forEach((checkUnit: CreateMsItemUnitsRequestType, iCheckUnit: number) => {
            if (unit.unit_id == checkUnit.unit_id) {
              unit.id = null
              this.itemsCheck.checkUnits[iCheckUnit] = {
                ...unit,
                ...checkUnit
              }
            }
          })
        })

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      } finally {
        this.metaModal.indexUnits.loading = false
      }
    },

    selectItemRefModal() {
      if (this.isOpenModal.units) {
        this.itemsCheck.checkMainUnits = generateItemUnit(this.itemsCheck.checkUnits, this.itemsCheck.checkMainUnits)
        this.isOpenModal.units = false
      }
      if (this.isOpenModal.boms) {
        this.itemsCheck.checkMainBoms = generateItemBom(this.itemsCheck.checkBoms, this.itemsCheck.checkMainBoms)
        this.isOpenModal.units = false
      }
    },

    clickClearRefs() {
      this.itemsCheck.checkMainUnits = []
      this.itemsCheck.checkMainBoms = []
      this.itemsCheck.checkUnits = []
      this.itemsCheck.checkBoms = []
    },

    handleClearQuery() {
      this.queryModal.qListBoms = {
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
      }
    },

    handleClickClear() {
      this.form = cloneObject(useInitials.formQuotationCreateEdit);
      this.itemsCheck.checkMainUnits = []
      this.itemsCheck.checkUnits = []
      this.itemsCheck.checkMainBoms = []
      this.itemsCheck.checkBoms = []
      this.errors = {};
    },

  },
  persist: [
    {
      paths: ['queryModal'],
      storage: localStorage
    }
  ]
})

export default useProductStore