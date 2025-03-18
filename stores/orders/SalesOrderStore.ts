import { generateSoBoms, initCheckedSoDt } from '~/composables/maps/salesOrderComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormSoDtBomListType, FormSoDtProductListType, FormSalesOrderType, IndexSalesOrderType, QIndexProductsType, QIndexType, SoDtBomType, SoDtType, QIndexQuotationsType } from '~/types/sales-orders/SalesOrderType'

const useSalesOrderStore = defineStore('SalesOrderStore', {
  state: () => ({
    form: {
      id: null,
    } as FormSalesOrderType,
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
      qIndexQuotations: {
        page: 1,
        per_page: 10,
        item_group_ids: [],
        item_sub_group_ids: [],
        customer_id: null,
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        order_column: 'name',
        order_direction: 'desc'
      } as QIndexQuotationsType,
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
      } as PaginationMeta
    },
    loading: {
      formLoading: false,
      editPageLoading: false,

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
    },
    optionRefBtnRef: [
      {
        cta: "Ms. Product",
        key: "products",
        icon: "mdi-alpha-m-box-outline",
        count: 0,
        type: "button",
      },
      {
        cta: "Quotation",
        key: "quotations",
        icon: "mdi-offer",
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

    async show() {
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/sales-orders/show-sales-order',
          {
            id: this.form.id
          }
        )
        this.form = response.data.data[0]
        this.itemsCheck.checkMain = initCheckedSoDt(this.form.so_dts)

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
          '/v1/sales-orders/create-sales-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formSalesOrderCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/orders/sales-orders/edit/${response.data.data[0].id}`)

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
          '/v1/sales-orders/update-sales-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formSalesOrderCreateEdit)
        )

        // navigateTo(`/masters/customizations/sales-orders/edit/${response.data.data[0].id}`)

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
          '/v1/sales-orders/delete-sales-order',
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

                if (resProduct.ref_id === checkProduct.ref_id) {
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

      let params = this.queryModal.qIndexQuotations

      if (this.isOpenModal.boms) {
        params = this.queryModal.qIndexBoms
      }
      try {
        const response = await useMyFetch().post(
          '/v1/quotations/index-quotation',
          params
        )

        if (this.isOpenModal.quotations) {
          this.metaModal.indexQuotations = response.data

          if (this.itemsCheck.checkQuotations.length > 0) {
            this.itemsCheck.checkQuotations.forEach((checkQuotation: FormSoDtProductListType, iCheckQuotation: number) => {
              (this.metaModal.indexQuotations.data as FormSoDtProductListType[]).forEach((resQuotation: FormSoDtProductListType, iResQuotation: number) => {
                console.log('checkQuotation', iCheckQuotation, checkQuotation);

                if (resQuotation.ref_id === checkQuotation.ref_id) {
                  console.log('resQuotation', iResQuotation, resQuotation);

                  const combined = {
                    ...resQuotation,
                    ...checkQuotation
                  }

                  this.metaModal.indexQuotations.data[iResQuotation] = combined
                  this.itemsCheck.checkQuotations[iCheckQuotation] = combined
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
      if (this.isOpenModal.boms) {
        // this.itemsCheck.checkMain = generateSoDt(this.itemsCheck.checkProducts, 'boms', this.itemsCheck.checkMain)

        if (this.itemsCheck.checkBoms.length > 0) {
          console.log('select-itemcheck-product_id', this.openedModal.boms.product_id);

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

    handleClickClear() {
      this.form = cloneObject(useInitials.formSalesOrderCreateEdit);
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.errors = {};

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