import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormItemSubGroupType } from '~/types/masters/ItemSubGroupType'
import type { CreateBomsRequestType, CreateMsItemUnitsRequestType, FormProductType, ProductListType } from '~/types/masters/ProductType'
import type { FormUnitType, UnitType } from '~/types/masters/UnitType'

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
    conditions: {
      isProduct: true,
    },
    tabs: ['BOM', 'Conversions', 'Remarks'],
    formTabProduct: {
      boms: 0,
      conversions: 1,
      remarks: 2,
    },
    selectedDetail: {
      unit: {} as FormUnitType,
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
        this.itemsCheck.checkMainBoms = this.form.boms
        this.itemsCheck.checkBoms = this.form.boms
        this.itemsCheck.checkMainUnits = this.form.units
        this.itemsCheck.checkUnits = this.form.units

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
        navigateTo(`/masters/products`)

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

        console.log("id", id);

        this.form.id = id

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        await this.show()

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
        const response = await useMyFetch().post(
          '/v1/products/create-product',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formProductCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        // navigateTo(`/masters/products`)

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

        const response = await useMyFetch().post(
          '/v1/products/update-product',
          this.form
        )

        this.form = JSON.parse(
          JSON.stringify(useInitials.formProductCreateEdit)
        )

        // navigateTo(`/masters/customizations/products/edit/${response.data.data[0].id}`)

        console.log("id", id);

        this.form.id = id

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        // await this.show()

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
        console.log('ProductStore-response', response.data.data);

        this.metaModal.indexBoms = response.data

        this.metaModal.indexBoms.data.forEach((prod: ProductListType, iProd: number) => {
          prod.product_item_id = prod.ref_id
          this.itemsCheck.checkBoms.forEach((checkBom: CreateBomsRequestType, iCheckBom: number) => {
            // if (prod.ref_id == checkBom.product_item_id) {
            if (prod.ref_id == checkBom.ref_id) {
              // prod.id = null
              let combine = {
                ...prod,
                ...checkBom
              }

              this.itemsCheck.checkBoms[iCheckBom] = combine
              this.metaModal.indexBoms.data[iProd] = combine
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
        this.metaModal.indexUnits = response.data

        this.metaModal.indexUnits.data.forEach((unit: UnitType, iUnit: number) => {
          this.itemsCheck.checkUnits.forEach((checkUnit: CreateMsItemUnitsRequestType, iCheckUnit: number) => {
            if (unit.unit_id == checkUnit.unit_id) {
              // unit.id = null
              let combine = {
                ...unit,
                ...checkUnit
              }

              this.itemsCheck.checkUnits[iCheckUnit] = combine
              this.metaModal.indexUnits.data[iUnit] = combine
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
      this.form = cloneObject(useInitials.formProductCreateEdit);
      this.itemsCheck.checkMainUnits = []
      this.itemsCheck.checkUnits = []
      this.itemsCheck.checkMainBoms = []
      this.itemsCheck.checkBoms = []
      this.errors = {};
    },

    async onClickOpenModalOptionRefBtn(ref: RefBtnType) {
      // this.itemsCheck.checkBoms = updateSoRefsModalFromMain(
      //   this.itemsCheck.checkMainBoms,
      //   this.itemsCheck.checkBoms
      // );

      console.log('ref', ref);

      this.isOpenModal.units = false;
      if (ref.key == "units") {
        this.isOpenModal.units = true;
        console.log('ref.key1', ref.key, this.isOpenModal.units);
      } else if (ref.key == "boms") {
        this.isOpenModal.boms = true;
        console.log('ref.key2', ref.key, this.isOpenModal.boms);

      }
      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.boms) {
        await this.indexBom();
      } else if (this.isOpenModal.units) {
        await this.indexUnit()
      }
    },
    onSelectedUnit(selected: FormUnitType | null) {
      console.log('onSelectedUnit', selected);

      this.selectedDetail.unit = {} as FormUnitType
      if (selected !== null) {
        this.selectedDetail.unit = selected
      }

      this.calculateUnits()
    },
    onSelectedSubGroup(selected: FormItemSubGroupType | null) {
      if (selected !== null && selected.group_name.toLowerCase() == 'product') {
        this.conditions.isProduct = true
        this.tabs = ['BOM', 'Conversions', 'Remarks']
        this.formTabProduct.boms = 0
        this.formTabProduct.conversions = 1
        this.formTabProduct.remarks = 2
      } else {
        this.tabFormIndex = 0
        this.conditions.isProduct = false
        this.itemsCheck.checkBoms = []
        this.itemsCheck.checkMainBoms = []

        this.tabs = ['Conversions', 'Remarks']
        this.formTabProduct.conversions = 0
        this.formTabProduct.remarks = 1
      }
    },
    calculateUnits() {
      console.log('calculateUnits-checkMainUnits.length', this.itemsCheck.checkMainUnits.length, this.loading.formLoading, this.form.id);

      console.log('show-loading2', this.loading.formLoading);
      // let checkUnitIndex = this.itemsCheck.checkMainUnits.findIndex((checkUnit: CreateMsItemUnitsRequestType) => {
      //   return checkUnit.unit_id == this.form.item_unit_id
      // })

      // this.itemsCheck.checkMainUnits[checkUnitIndex]

      console.log('calculateUnits1', this.itemsCheck.checkMainUnits);

      if (!this.form.item_unit_id || this.form.item_unit_id == 0) {
        this.itemsCheck.checkMainUnits = []
        return;
      }
      // if item_unit_id is not found, then add new unit
      const isFound = this.itemsCheck.checkMainUnits.find((checkUnit: CreateMsItemUnitsRequestType) => {
        return checkUnit.unit_id == this.form.item_unit_id
      })
      if (!isFound) {
        console.log('calculateUnits2-notfound', this.itemsCheck.checkMainUnits);
        console.log('calculateUnits2-notfound2', this.form);

        this.itemsCheck.checkMainUnits.push({
          unit_id: this.form.item_unit_id as number,
          conversion: 1,
          price_sell: this.form.price_sell || 0,
          price_buy: this.form.price_buy || 0,
          name: this.selectedDetail.unit.name,
        })
      }

      this.itemsCheck.checkMainUnits = this.itemsCheck.checkMainUnits.map((checkUnit: CreateMsItemUnitsRequestType) => {
        if (checkUnit.unit_id == this.form.item_unit_id) {
          checkUnit.conversion = 1
          checkUnit.price_sell = this.form.price_sell || 0
          checkUnit.price_buy = this.form.price_buy || 0
        } else {
          checkUnit.price_sell = checkUnit.conversion * (this.form.price_sell || 0)
          checkUnit.price_buy = checkUnit.conversion * (this.form.price_buy || 0)
        }
        return checkUnit
      })

      console.log('calculateUnits', this.itemsCheck.checkMainUnits);

    }

  },
  persist: [
    {
      paths: ['queryModal'],
      storage: localStorage
    }
  ]
})

export default useProductStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}