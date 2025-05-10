import { initCheckedInvDt } from '~/composables/maps/inventoryComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { QIndexProductsType } from '~/types/masters/ProductType'
import type { FormVatType } from '~/types/masters/VatType'
import type { FormInventoryType, IndexInventoryType, QInvIndexType, InvDtType, QIndexSalesOrdersType, InvDtDiscType, FormInvDtProductListType, QIndexPurchaseOrdersType, QIndexInventoryInsType, QInvStockIndexType, QInvStatusIndexType } from '~/types/inventories/InventoryType'

const useInventoryStore = defineStore('InventoryStore', {
  state: () => ({
    form: {
      id: null,
    } as FormInventoryType,
    queryModal: {
      qIndexIn: {
        page: 1,
        per_page: 100,
        io_type: 'INVENTORY_IN',
        parent_ids: [],
        global: '',
        order_column: 'ingoing_at',
        order_direction: 'desc'
      } as QInvIndexType,
      qIndexOut: {
        page: 1,
        per_page: 100,
        io_type: 'INVENTORY_OUT',
        parent_ids: [],
        global: '',
        order_column: 'ingoing_at',
        order_direction: 'desc'
      } as QInvIndexType,
      qIndexInventoryStatus: {
        page: 1,
        per_page: 100,
        item_ids: [],
        item_group_ids: [],
        item_sub_group_ids: [],
        global: '',
        product_id: null,
        warehouse_id: null,
        item_id: null,
        branch_id: null,
        date_type: '',
        start_date: '',
        end_date: '',
        order_column: 'ingoing_at',
        order_direction: 'desc'
      } as QInvStatusIndexType,
      qIndexStock: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        warehouse_id: null,
        item_id: null,
        branch_id: null,
        order_column: 'id',
        order_direction: 'desc'
      } as QInvStockIndexType,
      qIndexStockClosings: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        start_at: '',
        end_at: '',
        warehouse_id: null,
        item_id: null,
        branch_id: null,
        global: '',
        order_column: 'closing_at',
        order_direction: 'desc'
      } as QInvStockIndexType,

      qIndexProducts: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        prod_type: 'single',
        order_column: 'name',
        order_direction: 'desc'
      } as QIndexProductsType,
      qIndexSalesOrders: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        sales_order_ids: [],
        customer_id: null,
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        order_column: 'order_at',
        order_direction: 'desc'
      } as QIndexSalesOrdersType,
      qIndexPurchaseOrders: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        sales_order_ids: [],
        customer_id: null,
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        order_column: 'po_date',
        order_direction: 'desc'
      } as QIndexPurchaseOrdersType,
      qIndexInventoryIns: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        sales_order_ids: [],
        customer_id: null,
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        io_type: 'INVENTORY_IN',
        order_column: 'ingoing_at',
        order_direction: 'desc'
      } as QIndexInventoryInsType,
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
        data: [] as IndexInventoryType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexStockClosings: {
        data: [] as IndexInventoryType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexProducts: {
        data: [] as FormInvDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSalesOrders: {
        data: [] as FormInvDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexPurchaseOrders: {
        data: [] as FormInvDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexInventoryIns: {
        data: [] as FormInvDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexInventoryStatus: {
        data: [] as FormInvDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
      createClosing: false,
      createOrUpdateAdjustment: false,
    },
    tabFormIndex: 0,
    tabIndex: {
      indexStock: 0,
    },
    errors: {} as Record<string, any>,
    itemsCheck: {
      checkMain: [] as InvDtType[],
      checkProducts: [] as FormInvDtProductListType[],
      checkSalesOrders: [] as FormInvDtProductListType[],
      checkPurchaseOrders: [] as FormInvDtProductListType[],
      checkInventoryIns: [] as FormInvDtProductListType[],
    },
    isOpenModal: {
      products: false,
      so: false,
      po: false,
      inv_in: false,
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
        cta: "Purchase Order",
        key: "po",
        icon: "mdi-alpha-p-circle-outline",
        count: 0,
        type: "button",
        // textClass: 'text-grey1'
      },
    ] as RefBtnType[],
    optionRefBtnRefOut: [
      {
        cta: "Sales Order",
        key: "so",
        icon: "mdi-alpha-s-circle-outline",
        count: 0,
        type: "button",
        // textClass: 'text-grey1'
      },
      {
        cta: "Inventory In",
        key: "inv_in",
        icon: "mdi-clock-in",
        count: 0,
        type: "button",
        // textClass: 'text-grey1'
      },
      {
        cta: "Ms. Product",
        key: "products",
        icon: "mdi-alpha-m-box-outline",
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
      }
    },
    currencySymbolLabel: '' as string | null,
    headAutocomplete: {
      so: {
        customer_id: null as number | null | undefined,
        io_type_id: null as number | null | undefined,
        currency_id: null as number | null | undefined,
        exchange_rate: 0 as number | null | undefined,
        vat_id: null as number | null | undefined,
        vat_perc: 0,
        pph23_id: null as number | null | undefined,
        pph23_perc: 0,
        markup_perc: 0,
        disc_am: 0,
        disc_perc: 0,
        remark: '' as string | null | undefined,
        is_vat: 0 as number | null | undefined,
        delivery_date: null as string | null | undefined,
        payment_term_id: null as number | null | undefined,
        ship_dest: null as string | null | undefined,
      }
    },
    formLayout: {
      title: "Basic Information",
      parentPath: "/inventories/in",
      currentTab: 0,
      tabs: ["Items", "Remark"],
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
    referenceOptions: {
      vats: [] as FormVatType[],
    },
    formOpnameSingle: {
      isOpen: false,
      id: '',
      item_id: '',
      warehouse_id: '',
      item_name: '',
      warehouse_name: '',
      date_adjustment: '',
      qty: 0,
      qty_adjustment: 0,
      prev_adjustment_date: ''
    },
    formClosing: {
      isOpen: false,
      end_closing_at: new Date().toISOString().split('T')[0],
      password: ''
    },
    loadingCsv: {
      closing: false,
      basic: false
    }
  }),

  actions: {

    async indexStockClosings() {
      if (this.metaModal.indexStockClosings.loading) return
      this.metaModal.indexStockClosings.loading = true

      let params = this.queryModal.qIndexStockClosings

      try {
        const response = await useMyFetch().post(
          '/v1/inventories/stocks/index-stock-closings',
          params
        )

        this.metaModal.indexStockClosings = response.data

        // return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexStockClosings.loading = false
      }
    },
    async createClosing() {
      const isConfirmed = await useAlert.showPopupConfirmation(
        "Are you sure proceed this action?",
        "This action cannot be undone."
      );
      if (!isConfirmed) {
        this.loading.createClosing = false
        return
      }

      try {
        const response = await useMyFetch().post(
          '/v1/inventories/stocks/create-stock-closing',
          this.formClosing
        )
        this.formClosing.end_closing_at = ''
        useAlert.hideAlert();
        useAlert.alertSuccess(response.data.message);
        this.indexStockClosings();
        this.formClosing.isOpen = false;

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
      }
    },

    async createOrUpdateAdjustment() {
      if (this.loading.createOrUpdateAdjustment) return
      this.loading.createOrUpdateAdjustment = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        "Are you sure proceed this action?",
        "This action cannot be undone."
      );
      if (!isConfirmed) {
      }
      try {
        const response = await useMyFetch().post(
          '/api/inventories/stocks/create-update-adjustment',
          this.formOpnameSingle
        )
        this.formOpnameSingle = JSON.parse(
          JSON.stringify(useInitials.formCreateEditOpnameSingle)
        )

        useAlert.hideAlert();
        useAlert.alertSuccess(response.data.message);
        this.indexStockClosings();
        this.formOpnameSingle.isOpen = false;
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
      }
    },

    async show() {
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/inventories/show-inventory',
          {
            id: this.form.id
          }
        )

        this.form = response.data.data[0]

        this.itemsCheck.checkMain = initCheckedInvDt(this.form.inv_dts)

        // this.itemsCheck.checkProducts = updateInvRefsModalFromMain(
        //   this.itemsCheck.checkMain,
        //   "products",
        //   this.itemsCheck.checkProducts
        // );

        // this.itemsCheck.checkSalesOrders = updateInvRefsModalFromMain(
        //   this.itemsCheck.checkMain,
        //   "sales_orders",
        //   this.itemsCheck.checkSalesOrders
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
        const response = await useMyFetch().post(
          '/v1/inventories/create-inventory',
          this.form
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        let routeAfter = `/inventories/in`
        if (this.form.io_type == 'INVENTORY_OUT') {
          routeAfter = '/inventories/out'
        }
        navigateTo(routeAfter)

        this.form = JSON.parse(
          JSON.stringify(useInitials.formInventoryCreateEdit)
        )

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
          '/v1/inventories/update-inventory',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInventoryCreateEdit)
        )

        // navigateTo(`/masters/customizations/inventories/edit/${response.data.data[0].id}`)

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
          '/v1/inventories/create-inventory',
          this.form
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        let routeAfter = `/inventories/in`
        if (this.form.io_type == 'INVENTORY_OUT') {
          routeAfter = '/inventories/out'
        }
        navigateTo(routeAfter)

        this.form = JSON.parse(
          JSON.stringify(useInitials.formInventoryCreateEdit)
        )

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
          '/v1/inventories/update-inventory',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInventoryCreateEdit)
        )

        // navigateTo(`/masters/customizations/inventories/edit/${response.data.data[0].id}`)

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
          '/v1/inventories/delete-inventory',
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
          '/v1/inventories/restore-inventory',
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

      this.queryModal.qIndexProducts.prod_type = 'single'
      let params = this.queryModal.qIndexProducts

      try {
        const response = await useMyFetch().post(
          '/v1/products/index-product-bom',
          params
        )

        if (this.isOpenModal.products) {
          this.metaModal.indexProducts = response.data

          if (this.itemsCheck.checkProducts.length > 0) {
            this.itemsCheck.checkProducts.forEach((checkProduct: FormInvDtProductListType, iCheckProduct: number) => {
              checkProduct.uid = randomId() as string
              (this.metaModal.indexProducts.data as FormInvDtProductListType[]).forEach((resProduct: FormInvDtProductListType, iResProduct: number) => {
                resProduct.uid = randomId() as string
                // console.log('checkProduct', iCheckProduct, checkProduct);

                if (checkProduct.ref_type === 'products' &&
                  (!!resProduct.ref_product_id && !!checkProduct.ref_product_id && resProduct.ref_product_id === checkProduct.ref_product_id) ||
                  (!!resProduct.ref_product_bom_id && !!checkProduct.ref_product_bom_id && resProduct.ref_product_bom_id === checkProduct.ref_product_bom_id)
                ) {
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

        // return this.metaModal.indexProducts
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.index.loading = false
      }
    },

    async indexSalesOrder() {
      if (this.metaModal.indexSalesOrders.loading) return
      this.metaModal.indexSalesOrders.loading = true

      if (this.itemsCheck.checkSalesOrders.length > 0) {
        // this.queryModal.qIndexSalesOrders.sales_order_ids = this.itemsCheck.checkSalesOrders.map((item: FormInvDtProductListType) => (item.sales_order_id as number))
        this.queryModal.qIndexSalesOrders.customer_id = this.itemsCheck.checkSalesOrders[0].customer_id
      }

      let params = this.queryModal.qIndexSalesOrders

      try {
        const response = await useMyFetch().post(
          '/v1/inventories/index-ref-so-dt',
          params
        )

        if (this.isOpenModal.so) {
          this.metaModal.indexSalesOrders = response.data

          if (this.itemsCheck.checkSalesOrders.length > 0) {
            this.itemsCheck.checkSalesOrders.forEach((checkSalesOrder: FormInvDtProductListType, iCheckSalesOrder: number) => {
              checkSalesOrder.uid = randomId() as string
              (this.metaModal.indexSalesOrders.data as FormInvDtProductListType[]).forEach((resSalesOrder: FormInvDtProductListType, iResSalesOrder: number) => {
                resSalesOrder.uid = randomId() as string

                if (
                  checkSalesOrder.ref_type === 'so' &&
                  (resSalesOrder.ref_so_dt_id && resSalesOrder.ref_so_dt_id === checkSalesOrder.ref_so_dt_id) ||
                  (resSalesOrder.ref_so_dt_bom_id && resSalesOrder.ref_so_dt_bom_id === checkSalesOrder.ref_so_dt_bom_id)
                ) {

                  console.log('abc', resSalesOrder.ref_so_dt_id, checkSalesOrder.ref_so_dt_id);

                  const combined = {
                    ...resSalesOrder,
                    ...checkSalesOrder
                  }

                  this.metaModal.indexSalesOrders.data[iResSalesOrder] = combined
                  this.itemsCheck.checkSalesOrders[iCheckSalesOrder] = combined
                }
              })
            })

            this.autocompleteSalesOrder(this.itemsCheck.checkSalesOrders[0]);
          }
        }

        // return this.metaModal.indexSalesOrders
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexSalesOrders.loading = false
      }
    },

    async indexPurchaseOrder() {
      if (this.metaModal.indexPurchaseOrders.loading) return
      this.metaModal.indexPurchaseOrders.loading = true

      let params = this.queryModal.qIndexPurchaseOrders

      try {
        const response = await useMyFetch().post(
          '/v1/inventories/index-ref-po-dt',
          params
        )

        if (this.isOpenModal.po) {
          this.metaModal.indexPurchaseOrders = response.data

          if (this.itemsCheck.checkPurchaseOrders.length > 0) {
            this.itemsCheck.checkPurchaseOrders.forEach((checkPurchaseOrder: FormInvDtProductListType, iCheckPurchaseOrder: number) => {
              checkPurchaseOrder.uid = randomId() as string
              (this.metaModal.indexPurchaseOrders.data as FormInvDtProductListType[]).forEach((resPurchaseOrder: FormInvDtProductListType, iResPurchaseOrder: number) => {
                resPurchaseOrder.uid = randomId() as string

                if (
                  checkPurchaseOrder.ref_type === 'po' &&
                  (resPurchaseOrder.ref_po_dt_id && resPurchaseOrder.ref_po_dt_id === checkPurchaseOrder.ref_po_dt_id) ||
                  (resPurchaseOrder.ref_po_dt_bom_id && resPurchaseOrder.ref_po_dt_bom_id === checkPurchaseOrder.ref_po_dt_bom_id)
                ) {

                  const combined = {
                    ...resPurchaseOrder,
                    ...checkPurchaseOrder
                  }

                  this.metaModal.indexPurchaseOrders.data[iResPurchaseOrder] = combined
                  this.itemsCheck.checkPurchaseOrders[iCheckPurchaseOrder] = combined
                }
              })
            })

            this.autocompletePurchaseOrder(this.itemsCheck.checkPurchaseOrders[0]);
          }
        }

        // return this.metaModal.indexPurchaseOrders
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexPurchaseOrders.loading = false
      }
    },

    async indexInventoryIn() {
      if (this.metaModal.indexInventoryIns.loading) return
      this.metaModal.indexInventoryIns.loading = true

      let params = this.queryModal.qIndexInventoryIns

      try {
        const response = await useMyFetch().post(
          '/v1/inventories/index-ref-inv-dt',
          params
        )

        if (this.isOpenModal.inv_in) {
          this.metaModal.indexInventoryIns = response.data

          if (this.itemsCheck.checkInventoryIns.length > 0) {
            this.itemsCheck.checkInventoryIns.forEach((checkInventory: FormInvDtProductListType, iCheckInventory: number) => {
              checkInventory.uid = randomId() as string
              (this.metaModal.indexInventoryIns.data as FormInvDtProductListType[]).forEach((resInventory: FormInvDtProductListType, iResInventory: number) => {
                resInventory.uid = randomId() as string

                if (
                  checkInventory.ref_type === 'inv_in' &&
                  (!!resInventory.ref_inv_dt_id && !!checkInventory.ref_inv_dt_id && resInventory.ref_inv_dt_id === checkInventory.ref_inv_dt_id)
                ) {

                  console.log('abc', resInventory.ref_inv_dt_id, checkInventory.ref_inv_dt_id);

                  const combined = {
                    ...resInventory,
                    ...checkInventory
                  }

                  this.metaModal.indexInventoryIns.data[iResInventory] = combined
                  this.itemsCheck.checkInventoryIns[iCheckInventory] = combined
                }
              })
            })
          }
        }

        // return this.metaModal.indexInventoryIns
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexInventoryIns.loading = false
      }
    },

    async indexInventoryStatus() {
      if (this.metaModal.indexInventoryStatus.loading) return
      this.metaModal.indexInventoryStatus.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/inventories/index-inventory-status',
          this.queryModal.qIndexInventoryStatus
        )

        this.metaModal.indexInventoryStatus = response.data

        // return this.metaModal.indexInventoryStatus
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.indexInventoryStatus.loading = false
      }
    },

    selectItemRefModal() {
      if (this.isOpenModal.products) {
        this.itemsCheck.checkMain = generateInvDt(this.itemsCheck.checkProducts, 'products', this.itemsCheck.checkMain)
        this.isOpenModal.products = false
      }
      if (this.isOpenModal.so) {
        this.itemsCheck.checkMain = generateInvDt(this.itemsCheck.checkSalesOrders, 'so', this.itemsCheck.checkMain)
        this.isOpenModal.so = false
      }
      if (this.isOpenModal.po) {
        this.itemsCheck.checkMain = generateInvDt(this.itemsCheck.checkPurchaseOrders, 'po', this.itemsCheck.checkMain)
        this.isOpenModal.po = false
      }
      if (this.isOpenModal.inv_in) {
        this.itemsCheck.checkMain = generateInvDt(this.itemsCheck.checkInventoryIns, 'inv_in', this.itemsCheck.checkMain)
        this.isOpenModal.inv_in = false
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

    resetSummary() {
      if (this.formLayout?.summary) {
        this.formLayout.summary.total_amount.value = 0;
        this.formLayout.summary.total_vat.value = 0
        this.formLayout.summary.total_pph23.value = 0
        this.formLayout.summary.grand_total.value = 0
      }
    },

    handleClickClear() {
      this.form = cloneObject(useInitials.formInventoryCreateEdit);
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.errors = {};
      this.form.warehouse_id = AuthStore().authUser.data?.warehouse_id

      this.resetSummary()
      this.countSelectedReferences()
    },

    handleClickClearInvStatus() {
      this.queryModal.qIndexInventoryStatus = cloneObject(useInitials.qIndexInvStatus)
    },

    countSelectedReferences() {

      this.optionRefBtnRef.map((item) => {
        if (item.key == "products") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "products"
          ).length;
        } else if (item.key == "po") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "po"
          ).length;
        }
      });
      this.optionRefBtnRefOut.map((item) => {
        if (item.key == "products") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "products"
          ).length;
        } else if (item.key == "so") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "so"
          ).length;
        } else if (item.key == "inv_in") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "inv_in"
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
      this.form.address = data.address;
      this.form.ship_dest = data.address;
      this.form.customer_code = data.shortname;

      if (!!data.id) {
        this.queryModal.qIndexSalesOrders.customer_id = data.id;
        this.queryModal.qIndexSalesOrders.customer_ids = [data.id];
      }
    },

    autocompleteVat(data: FormVatType) {
      this.form.vat_perc = Number(data.num);

      // apply to all childs
      this.itemsCheck.checkMain.forEach((item: InvDtType) => {
        // if (!item.vat_id) {
        if (!!item.is_vat) {
          item.vat_id = data.id as number;
          item.vat_perc = Number(data.num);
        }
        // }
      });

      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type) {
      this.form.pph23_perc = Number(data.num);

      // apply to all childs
      this.itemsCheck.checkMain.forEach((item: InvDtType) => {
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
      this.isOpenModal.so = false;
      this.isOpenModal.po = false;
      this.isOpenModal.inv_in = false;
      this.isOpenModal.products = false;
    },

    onClickUpdateProductsModal() {
      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();

      if (this.itemsCheck.checkSalesOrders.length > 0) {
        this.autocompleteSalesOrder(this.itemsCheck.checkSalesOrders[0]);
      }
      if (this.itemsCheck.checkPurchaseOrders.length > 0) {
        this.autocompletePurchaseOrder(this.itemsCheck.checkPurchaseOrders[0]);
      }

      console.log("ingoing_at", this.form.ingoing_at);

      this.form.io_type_id = this.form.io_type_id ?? this.headAutocomplete.so.io_type_id
      this.form.currency_id = this.form.currency_id ?? this.headAutocomplete.so.currency_id;
      this.form.exchange_rate = this.form.exchange_rate ?? this.headAutocomplete.so.exchange_rate;
      this.form.vat_id = this.form.vat_id ?? this.headAutocomplete.so.vat_id;
      this.form.vat_perc = this.form.vat_perc ?? this.headAutocomplete.so.vat_perc as number;
      this.form.pph23_id = this.form.pph23_id ?? this.headAutocomplete.so.pph23_id;
      this.form.pph23_perc = this.form.pph23_perc ?? this.headAutocomplete.so.pph23_perc as number;
      this.form.remark = this.form.remark ?? this.headAutocomplete.so.remark
      this.form.payment_term_id = this.form.payment_term_id ?? this.headAutocomplete.so.payment_term_id
      this.form.ingoing_at = !this.form.ingoing_at ? (this.headAutocomplete.so.delivery_date as string) : this.form.ingoing_at
      this.form.is_vat = this.form.is_vat ?? this.headAutocomplete.so.is_vat
      this.form.exchange_rate = this.form.exchange_rate ?? this.headAutocomplete.so.exchange_rate

      if (this.form.io_type === 'INVENTORY_OUT') {
        this.form.ship_dest = (this.form.ship_dest ?? this.headAutocomplete.so.ship_dest as string)
      }
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
        this.itemsCheck.checkProducts = updateInvRefsModalFromMain(
          this.itemsCheck.checkMain,
          "products",
          this.itemsCheck.checkProducts
        );

        this.countSelectedReferences();
        this.isOpenModal.products = true;
      } else if (ref.key == "so") {
        this.itemsCheck.checkSalesOrders = updateInvRefsModalFromMain(
          this.itemsCheck.checkMain,
          "so",
          this.itemsCheck.checkSalesOrders
        );

        this.countSelectedReferences();
        this.isOpenModal.so = true;
      } else if (ref.key == "po") {
        this.itemsCheck.checkPurchaseOrders = updateInvRefsModalFromMain(
          this.itemsCheck.checkMain,
          "po",
          this.itemsCheck.checkPurchaseOrders
        );

        this.countSelectedReferences();
        this.isOpenModal.po = true;
      } else if (ref.key == "inv_in") {
        this.itemsCheck.checkInventoryIns = updateInvRefsModalFromMain(
          this.itemsCheck.checkMain,
          "inv_in",
          this.itemsCheck.checkInventoryIns
        );

        this.countSelectedReferences();
        this.isOpenModal.inv_in = true;
      }

      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.products) {
        await this.indexProduct();
      } else if (this.isOpenModal.so) {
        if (!!this.form.customer_id) {
          this.queryModal.qIndexSalesOrders.customer_id = this.form.customer_id;
          this.queryModal.qIndexSalesOrders.customer_ids = [this.form.customer_id];
        } else {
          this.queryModal.qIndexSalesOrders.customer_id = null;
          this.queryModal.qIndexSalesOrders.customer_ids = [];
        }
        await this.indexSalesOrder();
      } else if (this.isOpenModal.inv_in) {
        await this.indexInventoryIn();
      } else if (this.isOpenModal.po) {
        if (!!this.form.customer_id) {
          this.queryModal.qIndexPurchaseOrders.customer_id = this.form.customer_id;
          this.queryModal.qIndexPurchaseOrders.customer_ids = [this.form.customer_id];
        } else {
          this.queryModal.qIndexPurchaseOrders.customer_id = null;
          this.queryModal.qIndexPurchaseOrders.customer_ids = [];
        }
        await this.indexPurchaseOrder();
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

      if (this.isOpenModal.so) {
        this.queryModal.qIndexSalesOrders.page = options.page;
        this.queryModal.qIndexSalesOrders.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexSalesOrders.order_column = options.sortBy[0].key;
          this.queryModal.qIndexSalesOrders.order_direction =
            options.sortBy[0].order;
        } else {
          this.queryModal.qIndexSalesOrders.order_column = "";
          this.queryModal.qIndexSalesOrders.order_direction = "";
        }
      }

      if (this.isOpenModal.po) {
        this.queryModal.qIndexPurchaseOrders.page = options.page;
        this.queryModal.qIndexPurchaseOrders.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexPurchaseOrders.order_column = options.sortBy[0].key;
          this.queryModal.qIndexPurchaseOrders.order_direction =
            options.sortBy[0].order;
        } else {
          this.queryModal.qIndexPurchaseOrders.order_column = "";
          this.queryModal.qIndexPurchaseOrders.order_direction = "";
        }
      }

      if (this.isOpenModal.inv_in) {
        this.queryModal.qIndexInventoryIns.page = options.page;
        this.queryModal.qIndexInventoryIns.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexInventoryIns.order_column = options.sortBy[0].key;
          this.queryModal.qIndexInventoryIns.order_direction =
            options.sortBy[0].order;
        } else {
          this.queryModal.qIndexInventoryIns.order_column = "";
          this.queryModal.qIndexInventoryIns.order_direction = "";
        }
      }

      await this.fetchModalFilter();
    },

    async onClickOpenModalBOM(
      item: FormInvDtProductListType,
      index: number
    ) {
      this.openedModal.boms.index = index;
      this.openedModal.boms.id = item.ref_id;
      this.openedModal.boms.product_id = item.item_id as number;
      this.openedModal.boms.product_uuid = item.product_uuid as string;

      await this.indexProduct();
    },

    autocompleteSalesOrder(data: FormInvDtProductListType) {
      this.form.customer_id = data.customer_id;
      this.headAutocomplete.so.io_type_id = data.io_type_id;
      this.headAutocomplete.so.currency_id = data.currency_id;
      this.headAutocomplete.so.exchange_rate = data.exchange_rate;
      this.headAutocomplete.so.vat_id = data.head_vat_id;
      this.headAutocomplete.so.vat_perc = data.head_vat_perc as number;
      this.headAutocomplete.so.pph23_id = data.head_pph23_id;
      this.headAutocomplete.so.pph23_perc = data.head_pph23_perc as number;
      this.headAutocomplete.so.remark = data.head_remark
      this.headAutocomplete.so.ship_dest = data.ship_dest
    },

    autocompletePurchaseOrder(data: FormInvDtProductListType) {
      this.form.customer_id = data.customer_id;
      this.headAutocomplete.so.currency_id = data.currency_id;
      this.headAutocomplete.so.exchange_rate = data.exchange_rate;
      this.headAutocomplete.so.vat_id = data.head_vat_id;
      this.headAutocomplete.so.vat_perc = data.head_vat_perc as number;
      this.headAutocomplete.so.pph23_id = data.head_pph23_id;
      this.headAutocomplete.so.pph23_perc = data.head_pph23_perc as number;
      this.headAutocomplete.so.remark = data.head_remark
      this.headAutocomplete.so.delivery_date = data.delivery_date
      this.headAutocomplete.so.vat_id = data.vat_id
      this.headAutocomplete.so.pph23_id = data.pph23_id
      this.headAutocomplete.so.is_vat = data.is_vat
      this.headAutocomplete.so.currency_id = data.currency_id
      this.headAutocomplete.so.payment_term_id = data.payment_term_id
      this.headAutocomplete.so.exchange_rate = data.exchange_rate

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

    removeSalesOrder() {
      // this.form.customer_id = null;
      // this.form.io_type_id = null;
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
      this.queryModal.qIndexSalesOrders.sales_order_ids = [];
      this.indexSalesOrder();
    },

    calculateTotalAmount() {
      this.itemsCheck.checkMain.forEach((item: InvDtType) => {
        // if (!!item.inv_dts_boms) {
        //   item.inv_dts_boms.forEach((bom: InvDtBomType) => {
        //     this.calculatePrice(bom, item);
        //   });
        // }

        const priceSell = Number(item.price_sell);
        const priceBuy = Number(item.price_buy);
        const qty = Number(item.qty);
        const subtotalSell = Number(priceSell * qty);
        const subtotalBuy = Number(priceBuy * qty);

        item.subtotal_sell = subtotalSell;
        item.subtotal_buy = subtotalBuy;
      });

      // header calculation
      this.form.subtotal = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvDtType) => acc + item.subtotal_sell,
        0
      );

      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvDtType) => acc + item.qty,
        0
      );

      this.form.grand_total =
        this.form.subtotal - this.form.total_vat - this.form.total_pph23;

      if (this.formLayout.summary) {
        this.formLayout.summary.total_amount.value = this.form.subtotal;
        this.formLayout.summary.total_vat.value = this.form.total_vat;
        this.formLayout.summary.total_pph23.value = this.form.total_pph23;
        this.formLayout.summary.grand_total.value = this.form.grand_total;

        // TODO foreach currency symbol
      }

      let response = {
        summary: {
          total_amount: this.form.subtotal,
          total_vat: this.form.total_vat,
          total_pph23: this.form.total_pph23,
          grand_total: this.form.grand_total,
        },
      }

      return response
    },
  },
  persist: [
    {
      paths: ['queryModal', 'formTabInventory', 'tabIndex'],
      storage: localStorage
    }
  ]
})

export default useInventoryStore