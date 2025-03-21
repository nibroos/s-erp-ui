import { generateSoBoms, initCheckedSoDt } from '~/composables/maps/salesOrderComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { FormVatType } from '~/types/masters/VatType'
import type { FormSoDtBomListType, FormSoDtProductListType, FormSalesOrderType, IndexSalesOrderType, QIndexProductsType, QIndexType, SoDtBomType, SoDtType, QIndexQuotationsType, SoDtDiscType } from '~/types/sales-orders/SalesOrderType'

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
        order_column: 'due_at',
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
      }
    },
    currencySymbolLabel: '' as string | null,
    formLayout: {
      title: "Basic Information",
      parentPath: "/orders/sales-orders",
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
                console.log('checkQuotation', iCheckQuotation, checkQuotation);

                if (resQuotation.quo_dt_id === checkQuotation.ref_id && checkQuotation.ref_type === 'quotations') {
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
        this.formLayout.summary.total_qty.value = 0
        this.formLayout.summary.total_discount.value = 0
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
      this.form.address = data.address;

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
        if (!item.is_lock_vat) {
          item.vat_id = data.id as number;
          item.vat_perc = Number(data.num);
        }
        // }
      });

      this.calculateTotalAmount();
    },

    autocompleteVatDt(data: FormVatType, soDtType: SoDtType) {
      soDtType.vat_perc = Number(data.num);
      soDtType.is_lock_vat = 1
      this.calculateTotalAmount();
    },

    autocompletePph23Dt(data: FormPph23Type, soDtType: SoDtType) {
      soDtType.pph23_perc = Number(data.num);
      soDtType.is_lock_pph23 = 1
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
        item.is_lock_vat = 0;
      });

      this.calculateTotalAmount();
    },

    removeVatDt(soDtType: SoDtType) {
      soDtType.is_lock_vat = 0
      if (!soDtType.vat_id) {
        soDtType.vat_perc = 0;
        soDtType.vat_perc_am = 0;
      }

      this.calculateTotalAmount();
    },

    removePph23Dt(soDtType: SoDtType) {
      soDtType.is_lock_pph23 = 0
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
        item.is_lock_pph23 = 0;
      });

      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type, oldId: number | null) {
      this.form.pph23_perc = Number(data.num);

      // apply to all childs
      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
        // if (!item.pph23_id) {
        if (!item.is_lock_pph23) {
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
      this.selectItemRefModal();
      this.countSelectedReferences();
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
      this.form.order_type_id = data.order_type_id;
      this.form.currency_id = data.currency_id;
      this.form.exchange_rate = data.exchange_rate;
      // this.form.vat_id = data.head_vat_id;
      // this.form.pph23_id = data.head_pph23_id;
      // this.form.disc_am = data.head_disc_am as number;
      // this.form.disc_perc = data.head_disc_perc as number;
    },

    calculateTotalAmount() {
      this.itemsCheck.checkMain.forEach((item: SoDtType) => {
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
        item.disc_final = 0;
        if (discPercentage || discAmount) {
          item.disc_perc_num = discPercNum;
          item.disc_perc_am = discPercAm;
          item.disc_final = discFinal;
          item.disc_type = discType;
        }

        item.vat_perc_am = 0;

        if (!!item.vat_id) {
          item.vat_perc_am = discFinal * ((item.vat_perc ?? 0) / 100);
        }

        item.pph23_perc_am = 0;

        if (!!item.pph23_id) {
          item.pph23_perc_am = discFinal * ((item.pph23_perc ?? 0) / 100);
        }

        item.total_am = discFinal + item.vat_perc_am - item.pph23_perc_am;
      });

      // header calculation
      this.form.subtotal = this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + item.total_am,
        0
      );

      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + item.qty,
        0
      );

      this.form.total_vat = this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + (item.vat_perc_am as number),
        0
      );

      this.form.total_pph23 = this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + (item.pph23_perc_am as number),
        0
      );

      // this.form.total_discount = item.disc_perc_am + item.disc_am + this.form.disc_am + this.form.disc_perc_am;
      let itemsDiscount = this.itemsCheck.checkMain.reduce(
        (acc: number, item: SoDtType) => acc + item.disc_perc_am + item.disc_am,
        0
      );

      const discPercentageHead = Number((this.form.disc_perc ?? 0) / 100);
      const discAmountHead = Number(this.form.disc_am ?? 0);

      let discPercPriceSellHead = Number(this.form.subtotal * discPercentageHead);
      let discPercAmHead = Number(
        this.form.subtotal - (discPercPriceSellHead ?? 0)
      );

      this.form.disc_type = null;
      this.form.disc_perc_am = 0;

      this.form.total_discount = discAmountHead + itemsDiscount;
      if (!!discPercPriceSellHead) {
        this.form.total_discount = discPercPriceSellHead + discAmountHead;
      }

      let discType: SoDtDiscType = null;

      let discFinal = 0;
      if (!!discAmountHead && discAmountHead > 0) {
        discType = "a";
      } else if (!!discPercentageHead && discPercentageHead > 0) {
        discType = "p";
      } else if (
        !!discAmountHead &&
        discAmountHead > 0 &&
        !!discPercentageHead &&
        discPercentageHead > 0
      ) {
        discType = "all";
      }

      discFinal = discPercAmHead - discAmountHead;
      if (discFinal <= 0) {
        discFinal = this.form.subtotal;
      }

      if (this.form.disc_perc) {
        this.form.disc_perc_am = discPercPriceSellHead;
      }

      this.form.disc_final = 0;
      if (discAmountHead || discPercentageHead) {
        this.form.disc_type = discType;
        this.form.disc_final = discFinal;
      }

      // if (!!this.form.vat_id) {
      //   this.form.total_vat = discFinal * ((this.form.vat_perc ?? 0) / 100);
      // }

      // if (!!this.form.pph23_id) {
      // this.form.total_pph23 = discFinal * ((this.form.pph23_perc ?? 0) / 100);
      // }

      this.form.grand_total =
        discFinal + this.form.total_vat - this.form.total_pph23;

      if (this.formLayout.summary) {
        this.formLayout.summary.total_amount.value = this.form.subtotal;
        this.formLayout.summary.total_qty.value = this.form.total_qty;
        this.formLayout.summary.total_discount.value = this.form.total_discount;
        this.formLayout.summary.total_vat.value = this.form.total_vat;
        this.formLayout.summary.total_pph23.value = this.form.total_pph23;
        this.formLayout.summary.grand_total.value = this.form.grand_total;

        // TODO foreach currency symbol
      }

      let response = {
        summary: {
          total_amount: this.form.subtotal,
          total_qty: this.form.total_qty,
          total_discount: this.form.total_discount,
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
      paths: ['queryModal', 'formTabSalesOrder'],
      storage: localStorage
    }
  ]
})

export default useSalesOrderStore