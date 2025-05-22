import { useStatics } from './../../composables/useStatics';
import { generateRoDt, initCheckedRoDt, updateRoRefsModalFromMain } from '~/composables/maps/RequestOrderComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormRoDtProductListType, FormRequestOrderType, IndexRequestOrderType, QIndexRefProductType, QIndexRefSoType, QIndexType, RefProductForRoType, RefSoForRoType, RoDtRefType, RoDtType } from '~/types/request-orders/RequestOrderType'
import type { WidgetSingleType } from '~/types/sales-orders/SalesOrderType'

const useRequestOrderStore = defineStore('RequestOrderStore', {
  state: () => ({
    form: {
      id: null,
      status: "PENDING",
      request_date: new Date().toISOString().split('T')[0]
    } as FormRequestOrderType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        global: '',
        order_column: '',
        order_direction: 'desc'
      } as QIndexType,
      qIndexProducts: {
        page: 1,
        per_page: 100,
        product_code: '',
        product_name: '',
        item_code: '',
        item_name: '',
        order_column: '',
        order_direction: 'desc'
      } as QIndexRefProductType,
      qIndexSo: {
        page: 1,
        per_page: 1000,
        customer_id: null,
        sales_order_no: '',
        product_name: '',
        item_name: '',
        order_column: '',
        order_direction: 'desc'
      } as QIndexRefSoType
    },
    metaModal: {
      index: {
        data: [] as IndexRequestOrderType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexProducts: {
        data: [] as FormRoDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta<FormRoDtProductListType>,
      indexSo: {
        data: [] as FormRoDtProductListType[],
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
      pdfLoading: false,
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    itemsCheck: {
      checkMain: [] as RoDtType[],
      checkProducts: [] as FormRoDtProductListType[],
      checkSo: [] as FormRoDtProductListType[],
    },
    isOpenModal: {
      products: false,
      so: false,
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
        cta: "Sales Order",
        key: "so",
        icon: "mdi-cart-outline",
        count: 0,
        type: "button",
      },
    ] as RefBtnType[],
    formLayout: {
      title: "Basic Information",
      parentPath: "/purchases/request-orders",
      currentTab: 0,
      tabs: ["Items", "Remark"],
      button: {
        clear: {
          show: true,
        },
      },
      summary: {
        total_order_product_qty: {
          label: "Total Order Product Qty",
          value: 0,
          format: {
            precision: 2,
          },
        },
        total_order_item_qty: {
          label: "Total Order Item Qty",
          value: 0,
          format: {
            precision: 2,
          },
        },
        total_wh_qty: {
          label: "Total WH Qty",
          value: 0,
          format: {
            precision: 2,
          },
        },
        total_req_qty: {
          label: "Total Request Qty",
          value: 0,
          format: {
            precision: 2,
          },
        },
      },
    } as FormLayoutType,
  }),

  actions: {
    async indexRequestOrder() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/request-orders/index-request-order',
          this.queryModal.qIndex
        )
        
        this.metaModal.index = response.data
        return response

      } catch (error: any) {
        console.log('Failed To Fetch Data', error?.response?.data)

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
          '/v1/request-orders/widget-request-order',
          params
        )

        this.metaModal.indexWidgets = response.data
        let widgets = mapWidgets(response.data.data)
        this.metaModal.indexWidgets.data = widgets

      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexWidgets.loading = false
      }
    },

    async show() {
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const requestId = typeof this.form.id === 'string' ? parseInt(this.form.id, 10) : this.form.id

        const response = await useMyFetch().post(
          '/v1/request-orders/show-request-order',
          {
            id: this.form.id
          }
        )
        this.form = response.data.data[0]
        this.itemsCheck.checkMain = initCheckedRoDt(this.form.request_order_dts)

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
          '/v1/request-orders/create-request-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formRequestOrderCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/purchases/request-orders`)

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
          '/v1/request-orders/update-request-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formRequestOrderCreateEdit)
        )

        this.form.id = id

        navigateTo(`/purchases/request-orders`)
        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        return response
      } catch (error: any) {
        const responseData = error.response.data
        console.log('Failed To Update Data', error.response.data)
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
          '/v1/request-orders/create-request-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formRequestOrderCreateEdit)
        )

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

        const response = await useMyFetch().post(
          '/v1/request-orders/update-request-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formRequestOrderCreateEdit)
        )

        this.form.id = id

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        return response
      } catch (error: any) {
        const responseData = error.response.data
        console.log('Failed To Update Data', error.response.data)
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
          '/v1/request-orders/delete-request-order',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Delete Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async restore(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/request-orders/restore-request-order',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Restore Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async indexProduct() {
      if (this.metaModal.indexProducts.loading) return
      this.metaModal.indexProducts.loading = true

      let params = this.queryModal.qIndexProducts

      try {
        const response = await useMyFetch().post(
          '/v1/request-orders/index-ref-product',
          params
        )

        if (this.isOpenModal.products) {
          this.metaModal.indexProducts = response.data

          // Add uid to each product
          this.metaModal.indexProducts.data.forEach((product: FormRoDtProductListType) => {
            product.uid = randomId()
          })

          if (this.itemsCheck.checkProducts.length > 0) {
            this.itemsCheck.checkProducts.forEach((checkProduct: FormRoDtProductListType, iCheckProduct: number) => {
              checkProduct.uid = randomId() as string
                            (this.metaModal.indexProducts.data as FormRoDtProductListType[]).forEach((resProduct: FormRoDtProductListType, iResProduct: number) => {
                if (checkProduct.ref_type === 'products' && 
                    (!!resProduct.product_id && !!checkProduct.product_id && resProduct.product_id === checkProduct.product_id)) {
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

        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexProducts.loading = false
      }
    },

    async indexSalesOrder() {
      if (this.metaModal.indexSo.loading) return
      this.metaModal.indexSo.loading = true

      let params = this.queryModal.qIndexSo

      try {
        const response = await useMyFetch().post(
          '/v1/request-orders/index-ref-so-dt',
          params
        )

        if (this.isOpenModal.so) {
          this.metaModal.indexSo = response.data

          // Add uid to each SO item
          this.metaModal.indexSo.data.forEach((soItem: FormRoDtProductListType) => {
            // Create a unique ID combining sales_order_id and ref_id
            soItem.uid = randomId();
          })

          if (this.itemsCheck.checkSo.length > 0) {
            this.itemsCheck.checkSo.forEach((checkSo: FormRoDtProductListType, iCheckSo: number) => {
              checkSo.uid = checkSo.uid || randomId();
              (this.metaModal.indexSo.data as FormRoDtProductListType[]).forEach((resSo: FormRoDtProductListType, iResSo: number) => {
                // Match items based on both sales_order_id and ref_id
                if (resSo.sales_order_id === checkSo.sales_order_id && resSo.ref_id === checkSo.ref_id) {
                  const combined = {
                    ...resSo,
                    ...checkSo,
                    uid: checkSo.uid // Preserve the original uid
                  }

                  this.metaModal.indexSo.data[iResSo] = combined
                  this.itemsCheck.checkSo[iCheckSo] = combined
                }
              })
            })
          }
        }

        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexSo.loading = false
      }
    },

    selectItemRefModal() {
      if (this.isOpenModal.products) {
        this.itemsCheck.checkMain = generateRoDt(this.itemsCheck.checkProducts, 'products', this.itemsCheck.checkMain);
        this.isOpenModal.products = false;
      }

      if (this.isOpenModal.so) {
        this.itemsCheck.checkMain = generateRoDt(this.itemsCheck.checkSo, 'so', this.itemsCheck.checkMain);
        this.isOpenModal.so = false;
      }
    },

    clickClearRefs() {
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.itemsCheck.checkSo = []

      this.countSelectedReferences()
    },

    handleClearQuery() {
      if (this.isOpenModal.products) {
        this.queryModal.qIndexProducts = {
          page: 1,
          per_page: 100,
          item_group_id: null,
          item_sub_group_id: null,
          product_code: '',
          product_name: '',
          item_code: '',
          item_name: '',
          order_column: 'name',
          order_direction: 'desc'
        }
      } else if (this.isOpenModal.so) {
        this.queryModal.qIndexSo = {
          page: 1,
          per_page: 100,
          customer_id: null,
          sales_order_no: '',
          order_column: '',
          order_direction: 'desc'
        }
      }
    },

    resetSummary() {
      if (this.formLayout?.summary) {
        this.formLayout.summary.total_order_product_qty.value = 0
        this.formLayout.summary.total_order_item_qty.value = 0
        this.formLayout.summary.total_wh_qty.value = 0
        this.formLayout.summary.total_req_qty.value = 0
      }
    },

    handleClickClear() {
      this.form = cloneObject(useInitials.formRequestOrderCreateEdit);
      this.form.status = "PENDING";
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.itemsCheck.checkSo = []
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
        } else if (item.key == "so") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "so"
          ).length;
        }
      });
    },

    updateRefsModal() {
      this.itemsCheck.checkProducts = updateRoRefsModalFromMain(
        this.itemsCheck.checkMain,
        "products",
        this.itemsCheck.checkProducts
      );

      this.itemsCheck.checkSo = updateRoRefsModalFromMain(
        this.itemsCheck.checkMain,
        "so",
        this.itemsCheck.checkSo
      );

      this.countSelectedReferences();
    },

    closeAllModal() {
      this.isOpenModal.products = false;
      this.isOpenModal.so = false;
    },

    onClickUpdateProductsModal() {
      const currentValues = {
        branch_id: this.form.branch_id,
        warehouse_id: this.form.warehouse_id,
        remark: this.form.remark
      };

      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();

      this.form.branch_id = currentValues.branch_id;
      this.form.warehouse_id = currentValues.warehouse_id;
      this.form.remark = currentValues.remark;

      this.calculateTotalAmount();
    },

    onClickDeleteSelected(item: any, index: number) {
      this.itemsCheck.checkMain.splice(index, 1);
      this.countSelectedReferences();
      this.calculateTotalAmount();
    },

    async onClickOpenModalOptionRefBtn(ref: RefBtnType) {
      this.closeAllModal();

      if (ref.key == "products") {
        this.itemsCheck.checkProducts = updateRoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "products",
          this.itemsCheck.checkProducts
        );
        this.countSelectedReferences();
        this.isOpenModal.products = true;
      } else if (ref.key == "so") {
        this.itemsCheck.checkSo = updateRoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "so",
          this.itemsCheck.checkSo
        );

        this.queryModal.qIndexSo.warehouse_id = this.form.warehouse_id;

        this.countSelectedReferences();
        this.isOpenModal.so = true;
      }

      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.products) {
        await this.indexProduct();
      } else if (this.isOpenModal.so) {
        await this.indexSalesOrder();
      }
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

      if (this.isOpenModal.so) {
        this.queryModal.qIndexSo.page = options.page;
        this.queryModal.qIndexSo.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexSo.order_column = options.sortBy[0].key;
          this.queryModal.qIndexSo.order_direction = options.sortBy[0].order;
        } else {
          this.queryModal.qIndexSo.order_column = "";
          this.queryModal.qIndexSo.order_direction = "";
        }
      }

      await this.fetchModalFilter();
    },

    calculateTotalAmount() {
      this.form.grand_total_order_product_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: RoDtType) => acc + (item.order_product_qty || 0), 0
      );

      this.form.grand_total_order_item_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: RoDtType) => acc + (item.order_item_qty || 0), 0
      );

      this.form.grand_total_wh_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: RoDtType) => acc + (item.wh_qty || 0), 0
      );

      this.form.grand_total_req_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: RoDtType) => acc + (item.req_qty || 0), 0
      );

      if (this.formLayout.summary) {
        this.formLayout.summary.total_order_product_qty.value = this.form.grand_total_order_product_qty;
        this.formLayout.summary.total_order_item_qty.value = this.form.grand_total_order_item_qty;
        this.formLayout.summary.total_wh_qty.value = this.form.grand_total_wh_qty;
        this.formLayout.summary.total_req_qty.value = this.form.grand_total_req_qty;
      }

      return {
        summary: {
          total_order_product_qty: this.form.grand_total_order_product_qty,
          total_order_item_qty: this.form.grand_total_order_item_qty,
          total_wh_qty: this.form.grand_total_wh_qty,
          total_req_qty: this.form.grand_total_req_qty,
        },
      }
    },

    updateQuantity(roDt: RoDtType) {
      this.calculateTotalAmount();
    },

    generateRequestNumber(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;

      const randomId = Math.floor(100000 + Math.random() * 900000);

      return `RO-${dateStr}-${randomId}`;
    },

    async onClickPDF() {
      if (!!this.loading.pdfLoading) return
      this.loading.pdfLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/request-orders/pdf-request-order',
          {
            ...this.form,
            company: AuthStore().company
          }
        )

        const { data } = response.data
        window.open(data.link, '_blank')

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
        useAlert.alertError(error?.response?.data?.message || 'Failed to generate PDF!')
      } finally {
        this.loading.pdfLoading = false
      }
    },
  },
  persist: [
    {
      paths: ['queryModal', 'formTabRequestOrder'],
      storage: localStorage
    }
  ]
})

function randomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function cloneObject(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export default useRequestOrderStore
