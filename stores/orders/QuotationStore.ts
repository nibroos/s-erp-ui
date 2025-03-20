import { generateQuoBoms, initCheckedQuoDt } from '~/composables/maps/quotationComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormQuoDtBomListType, FormQuoDtProductListType, FormQuotationType, IndexQuotationType, QIndexProductsType, QIndexType, QuoDtBomType, QuoDtType } from '~/types/quotations/QuotationType'

const useQuotationStore = defineStore('QuotationStore', {
  state: () => ({
    form: {
      id: null,
    } as FormQuotationType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 10,
        parent_ids: [],
        global: '',
        order_column: 'name',
        order_direction: 'desc'
      } as QIndexType,

      qIndexProducts: {
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
      } as QIndexProductsType,
      qIndexBoms: {
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
      } as QIndexProductsType
    },
    metaModal: {
      index: {
        data: [] as IndexQuotationType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexProducts: {
        data: [] as FormQuoDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexBoms: {
        data: [] as FormQuoDtBomListType[],
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
      checkMain: [] as QuoDtType[],
      checkProducts: [] as FormQuoDtProductListType[],
      checkBoms: [] as QuoDtBomType[],
    },
    isOpenModal: {
      products: false,
      boms: false,
    },
    optionRefBtnRef: [
      {
        cta: "Ms. Product",
        key: "products",
        icon: "mdi-alpha-m-box-outline",
        count: 0,
        type: "button",
      },
    ] as RefBtnType[],
    openedModal: {
      boms: {
        id: null as number | null,
        index: null as number | null,
        product_id: null as number | null,
        product_uuid: '' as string
      }
    }
  }),

  actions: {
    async indexQuotation() {
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
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/quotations/show-quotation',
          {
            id: this.form.id
          }
        )
        this.form = response.data.data[0]
        this.itemsCheck.checkMain = initCheckedQuoDt(this.form.quo_dts)

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
        const response = await useMyFetch().post(
          '/v1/quotations/create-quotation',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formQuotationCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/orders/quotations/edit/${response.data.data[0].id}`)

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

        const response = await useMyFetch().post(
          '/v1/quotations/update-quotation',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formQuotationCreateEdit)
        )

        // navigateTo(`/masters/customizations/quotations/edit/${response.data.data[0].id}`)

        this.form.id = id
        await this.show()

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
          '/v1/quotations/delete-quotation',
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
          '/v1/quotations/restore-quotation',
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
            this.itemsCheck.checkProducts.forEach((checkProduct: FormQuoDtProductListType, iCheckProduct: number) => {
              (this.metaModal.indexProducts.data as FormQuoDtProductListType[]).forEach((resProduct: FormQuoDtProductListType, iResProduct: number) => {
                console.log('checkProduct', iCheckProduct, checkProduct);

                if (resProduct.ref_id === checkProduct.ref_id) {
                  console.log('resProduct', iResProduct, resProduct);

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
            let generatedBoms = generateQuoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)

            generatedBoms.forEach((checkBom: QuoDtBomType, iCheckBom: number) => {
              (this.metaModal.indexBoms.data as QuoDtBomType[]).forEach((resBom: FormQuoDtBomListType, iResBom: number) => {

                if (resBom.ref_id === checkBom.item_id) {
                  console.log('checkBom', iCheckBom, checkBom);
                  console.log('checkResBom', iResBom, resBom);
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

    selectItemRefModal() {
      if (this.isOpenModal.products) {
        this.itemsCheck.checkMain = generateQuoDt(this.itemsCheck.checkProducts, 'products', this.itemsCheck.checkMain)
        this.isOpenModal.products = false
      }
      if (this.isOpenModal.boms) {
        // this.itemsCheck.checkMain = generateQuoDt(this.itemsCheck.checkProducts, 'boms', this.itemsCheck.checkMain)

        if (this.itemsCheck.checkBoms.length > 0) {
          console.log('select-itemcheck-product_id', this.openedModal.boms.product_id);

          this.itemsCheck.checkBoms = generateQuoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)
        } else {
          this.itemsCheck.checkBoms = []
        }
        this.itemsCheck.checkMain[this.openedModal.boms.index as number].quo_dts_boms = this.itemsCheck.checkBoms
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

    handleClickClear() {
      this.form = cloneObject(useInitials.formQuotationCreateEdit);
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.errors = {};

      this.countSelectedReferences()
    },

    countSelectedReferences() {

      this.optionRefBtnRef.map((item) => {
        if (item.key == "products") {
          // item.count = itemsCheck.value.checkProducts.length;
          // count checkMain where ref_type = products
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "products"
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
    }

  },
  persist: [
    {
      paths: ['queryModal', 'formTabQuotation'],
      storage: localStorage
    }
  ]
})

export default useQuotationStore