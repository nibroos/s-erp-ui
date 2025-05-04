import { generatePoDt, initCheckedPoDt, updatePoRefsModalFromMain } from '~/composables/maps/purchaseOrderComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { QIndexSalesOrdersType } from '~/types/inventories/InventoryType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { FormVatType } from '~/types/masters/VatType'
import type { FormPoDtProductListType, FormPurchaseOrderType, IndexPurchaseOrderType, PoDtDiscType, PoDtRefType, PoDtType, QIndexProductsType, QIndexType } from '~/types/purchase-orders/PurchaseOrderType'
import type { SoDtDiscType, WidgetSingleType } from '~/types/sales-orders/SalesOrderType'

const usePurchaseOrderStore = defineStore('PurchaseOrderStore', {
  state: () => ({
    form: {
      id: null,
      status: "PROCESS",
      po_date: new Date().toISOString().split('T')[0]
    } as FormPurchaseOrderType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'po_date',
        order_direction: 'desc'
      } as QIndexType,

      qIndexProducts: {
        page: 1,
        per_page: 100,
        item_group_ids: [],
        item_sub_group_ids: [],
        product_bom_ids: [],
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        prod_type: 'single',
        order_column: 'name',
        order_direction: 'desc'
      } as QIndexProductsType,
      qIndexSo: {
        page: 1,
        per_page: 1000,
        item_group_ids: [],
        item_sub_group_ids: [],
        sales_order_ids: [],
        customer_id: null,
        code: '',
        name: '',
        sku: '',
        factory_code: '',
        date_type: 'order_at',
        order_column: 'order_at',
        order_direction: 'desc'
      } as QIndexSalesOrdersType,
      qIndexRo: {
        page: 1,
        per_page: 100,
        order_column: 'created_at',
        order_direction: 'desc'
      } as QIndexType
    },
    metaModal: {
      index: {
        data: [] as IndexPurchaseOrderType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexProducts: {
        data: [] as FormPoDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta<FormPoDtProductListType>,
      indexSo: {
        data: [] as FormPoDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexRo: {
        data: [] as FormPoDtProductListType[],
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
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    itemsCheck: {
      checkMain: [] as PoDtType[],
      checkProducts: [] as FormPoDtProductListType[],
      checkSo: [] as FormPoDtProductListType[],
      checkRo: [] as FormPoDtProductListType[],
    },
    isOpenModal: {
      products: false,
      so: false,
      ro: false,
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
      {
        cta: "Request Order",
        key: "ro",
        icon: "mdi-clipboard-text-outline",
        count: 0,
        type: "button",
      },
    ] as RefBtnType[],
    currencySymbolLabel: '' as string | null,
    headAutocomplete: {
      customer_id: null as number | null | undefined,
      purchase_type_id: null as number | null | undefined,
      currency_id: null as number | null | undefined,
      exchange_rate: 0 as number | null | undefined,
      vat_id: null as number | null | undefined,
      vat_percentage: 0,
      pph23_id: null as number | null | undefined,
      pph23_percentage: 0,
      discount_amount: 0,
      discount_percentage: 0,
      remark: '' as string | null | undefined,
    },
    formLayout: {
      title: "Basic Information",
      parentPath: "/purchases/purchase-orders",
      currentTab: 0,
      tabs: ["Items", "Payments", "Remark", "Attachments"],
      button: {
        clear: {
          show: true,
        },
      },
      summary: {
        subtotal: {
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
    parentProductsSelected: [] as number[],
    referenceOptions: {
      vats: [] as FormVatType[],
    },
  }),

  actions: {
    async indexPurchaseOrder() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        useAlert.alertSuccess('Login successfully.')

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
          '/v1/purchase-orders/widget-purchase-order',
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

    async show() {
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/purchase-orders/show-purchase-order',
          {
            id: this.form.id
          }
        )
        this.form = response.data.data[0]
        this.itemsCheck.checkMain = initCheckedPoDt(this.form.po_dts)

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
          '/v1/purchase-orders/create-purchase-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formPurchaseOrderCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/purchases/purchase-orders`)

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
          '/v1/purchase-orders/update-purchase-order',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formPurchaseOrderCreateEdit)
        )

        this.form.id = id
        // await this.show()

        navigateTo(`/purchases/purchase-orders`)
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
          '/v1/purchase-orders/delete-purchase-order',
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
          '/v1/purchase-orders/restore-purchase-order',
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
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      this.queryModal.qIndexProducts.prod_type = 'single'
      let params = this.queryModal.qIndexProducts

      try {
        const response = await useMyFetch().post(
          '/v1/products/index-product',
          params
        )

        if (this.isOpenModal.products) {
          this.metaModal.indexProducts = response.data

          // uid
          this.metaModal.indexProducts.data.forEach((product: FormPoDtProductListType) => {
            product.uid = randomId()
          })

          if (this.itemsCheck.checkProducts.length > 0) {
            this.itemsCheck.checkProducts.forEach((checkProduct: FormPoDtProductListType, iCheckProduct: number) => {
              (this.metaModal.indexProducts.data as FormPoDtProductListType[]).forEach((resProduct: FormPoDtProductListType, iResProduct: number) => {
                console.log('resProduct.ref_product_id', resProduct.ref_product_id, "checkProduct.ref_product_id", checkProduct.ref_product_id);

                if (resProduct.ref_product_id === checkProduct.ref_product_id && checkProduct.ref_type === 'products') {
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
        this.metaModal.index.loading = false
      }
    },

    async indexSalesOrder() {
      if (this.metaModal.indexSo.loading) return
      this.metaModal.indexSo.loading = true

      let params = this.queryModal.qIndexSo

      try {
        const response = await useMyFetch().post(
          '/v1/purchase-orders/index-ref-so-dt',
          params
        )

        if (this.isOpenModal.so) {
          this.metaModal.indexSo = response.data

          if (this.itemsCheck.checkSo.length > 0) {
            this.itemsCheck.checkSo.forEach((checkSo: FormPoDtProductListType, iCheckSo: number) => {
              (this.metaModal.indexSo.data as FormPoDtProductListType[]).forEach((resSo: FormPoDtProductListType, iResSo: number) => {
                if (
                  (resSo.ref_so_dt_id && resSo.ref_so_dt_id === checkSo.ref_so_dt_id) ||
                  (resSo.ref_so_dt_bom_id && resSo.ref_so_dt_bom_id === checkSo.ref_so_dt_bom_id)) {
                  const combined = {
                    ...resSo,
                    ...checkSo
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

    async indexRequisitionOrder() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      let params = this.queryModal.qIndexRo

      try {
        const response = await useMyFetch().post(
          '/v1/purchase-orders/index-ref-ro-dt',
          params
        )

        if (this.isOpenModal.ro) {
          this.metaModal.indexRo = response.data

          if (this.itemsCheck.checkRo.length > 0) {
            this.itemsCheck.checkRo.forEach((checkRo: FormPoDtProductListType, iCheckRo: number) => {
              (this.metaModal.indexRo.data as FormPoDtProductListType[]).forEach((resRo: FormPoDtProductListType, iResRo: number) => {
                if (resRo.ref_id === checkRo.ref_id) {
                  const combined = {
                    ...resRo,
                    ...checkRo
                  }

                  this.metaModal.indexRo.data[iResRo] = combined
                  this.itemsCheck.checkRo[iCheckRo] = combined
                }
              })
            })
          }
        }

        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.index.loading = false
      }
    },

    selectItemRefModal() {
      if (this.isOpenModal.products) {
        // const flattenedItems: FormPoDtProductListType[] = [];

        // this.parentProductsSelected = [];

        // this.itemsCheck.checkProducts.forEach(product => {
        //   if (defineItemTypePurchaseOrder(product) === 'product') {
        //     this.parentProductsSelected.push(product.ref_id);

        //     if (product.boms && product.boms.length > 0) {
        //       product.boms.forEach(bom => {
        //         flattenedItems.push({
        //           ...bom,
        //           ref_type: 'products',
        //           product_id: bom.product_id || bom.item_id || bom.ref_id,
        //           product_name: bom.item_name,
        //           product_code: bom.item_code,
        //           unit_name: bom.item_unit_name || bom.unit_name,
        //           price: bom.price_buy || 0,
        //           qty: (bom.qty && bom.qty > 0) ? bom.qty : 1,
        //           discount_amount: 0,
        //           discount_percentage: 0,
        //           subtotal: (bom.price_buy || 0) * ((bom.qty && bom.qty > 0) ? bom.qty : 1),
        //           total_amount: (bom.price_buy || 0) * ((bom.qty && bom.qty > 0) ? bom.qty : 1),
        //           product_type: 'bom',
        //           parent_product_ref_id: product.ref_id,
        //           is_vat: product.is_vat || 0,
        //           is_pph23: product.is_pph23 || 0,
        //         } as FormPoDtProductListType);
        //       });
        //     }
        //   } else {
        //     flattenedItems.push({
        //       ...product,
        //       qty: (product.qty && product.qty > 0) ? product.qty : 1,
        //       subtotal: (product.price || product.price_buy || 0) * ((product.qty && product.qty > 0) ? product.qty : 1),
        //       total_amount: (product.price || product.price_buy || 0) * ((product.qty && product.qty > 0) ? product.qty : 1),
        //     });
        //   }
        // });

        this.itemsCheck.checkMain = generatePoDt(this.itemsCheck.checkProducts, 'products', this.itemsCheck.checkMain);

        if (this.form.vat_id) {
          this.itemsCheck.checkMain.forEach(item => {
            if (item.is_vat) {
              item.vat_id = this.form.vat_id;
            }
          });
        }

        if (this.form.pph23_id) {
          this.itemsCheck.checkMain.forEach(item => {
            if (item.is_pph23) {
              item.pph23_id = this.form.pph23_id;
            }
          });
        }

        this.isOpenModal.products = false;
      }

      if (this.isOpenModal.so) {
        this.itemsCheck.checkMain = generatePoDt(this.itemsCheck.checkSo, 'so', this.itemsCheck.checkMain);
        this.isOpenModal.so = false;
      }

      if (this.isOpenModal.ro) {
        this.itemsCheck.checkMain = generatePoDt(this.itemsCheck.checkRo, 'ro', this.itemsCheck.checkMain);
        this.isOpenModal.ro = false;
      }
    },

    clickClearRefs() {
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.itemsCheck.checkSo = []
      this.itemsCheck.checkRo = []

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
        this.formLayout.summary.subtotal.value = 0
        this.formLayout.summary.total_discount.value = 0
        this.formLayout.summary.total_after_disc.value = 0;
        this.formLayout.summary.total_vat.value = 0
        this.formLayout.summary.total_pph23.value = 0
        this.formLayout.summary.grand_total.value = 0
      }
    },

    handleClickClear() {
      this.form = cloneObject(useInitials.formPurchaseOrderCreateEdit);
      this.form.status = "PROCESS";
      // this.form.po_no = this.generatePoNumber();
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkProducts = []
      this.itemsCheck.checkSo = []
      this.itemsCheck.checkRo = []
      this.errors = {};

      this.parentProductsSelected = [];
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
        } else if (item.key == "ro") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "ro"
          ).length;
        }
      });
    },

    updateRefsModal() {
      this.itemsCheck.checkProducts = updatePoRefsModalFromMain(
        this.itemsCheck.checkMain,
        "products",
        this.itemsCheck.checkProducts
      );

      this.itemsCheck.checkSo = updatePoRefsModalFromMain(
        this.itemsCheck.checkMain,
        "so",
        this.itemsCheck.checkSo
      );

      this.itemsCheck.checkRo = updatePoRefsModalFromMain(
        this.itemsCheck.checkMain,
        "ro",
        this.itemsCheck.checkRo
      );

      this.countSelectedReferences();
    },

    autocompleteCustomer(data: any) {
      this.form.email = data.email;
      this.form.phone = data.phone;
      this.form.address = data.address;
      this.form.customer_code = data.shortname;

      if (!!data.currency_id && !this.form.currency_id) {
        this.form.currency_id = data.currency_id
      }
    },

    autocompleteVat(data: FormVatType) {
      this.form.vat_percentage = Number(data.num);
      this.headAutocomplete.vat_id = this.form.vat_id;
      this.headAutocomplete.vat_percentage = this.form.vat_percentage;

      this.itemsCheck.checkMain.forEach((item: PoDtType) => {
        if (item.is_vat) {
          item.vat_id = data.id as number;
          item.vat_perc = Number(data.num);
        }
      });

      this.calculateTotalAmount();
    },

    autocompleteIsVat() {
      if (this.referenceOptions.vats.length === 0) return;

      if (!!this.form.is_vat) {
        this.form.vat_id = this.referenceOptions.vats[0].id as number;
      } else {
        this.form.vat_id = null;
      }
    },

    autocompleteVatDt(data: FormVatType, poDtType: PoDtType) {
      poDtType.vat_id = data.id as number;
      this.calculateTotalAmount();
    },

    autocompletePph23Dt(data: FormPph23Type, poDtType: PoDtType) {
      poDtType.pph23_id = data.id as number;
      this.calculateTotalAmount();
    },

    removeVat() {
      this.form.vat_percentage = 0;
      this.calculateTotalAmount();
    },

    removeAllVat() {
      this.form.vat_id = null;
      this.form.vat_percentage = 0;
      this.form.total_vat = 0;

      this.itemsCheck.checkMain.forEach((item: PoDtType) => {
        item.vat_id = null;
        item.is_vat = 0;
      });

      this.calculateTotalAmount();
    },

    removeVatDt(poDtType: PoDtType) {
      poDtType.vat_id = null;
      poDtType.is_vat = 0;
      this.calculateTotalAmount();
    },

    removePph23Dt(poDtType: PoDtType) {
      poDtType.pph23_id = null;
      poDtType.is_pph23 = 0;
      this.calculateTotalAmount();
    },

    removePph() {
      this.form.pph23_percentage = 0;
      this.form.total_pph23 = 0;
      this.calculateTotalAmount();
    },

    removeAllPph() {
      this.form.pph23_id = null;
      this.form.pph23_percentage = 0;
      this.form.total_pph23 = 0;

      this.itemsCheck.checkMain.forEach((item: PoDtType) => {
        item.pph23_id = null;
        item.is_pph23 = 0;
      });

      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type) {
      this.form.pph23_percentage = Number(data.num);
      this.headAutocomplete.pph23_id = this.form.pph23_id;
      this.headAutocomplete.pph23_percentage = this.form.pph23_percentage;

      this.itemsCheck.checkMain.forEach((item: PoDtType) => {
        if (item.is_pph23) {
          item.pph23_id = data.id as number;
          item.pph23_perc = Number(data.num);
        }
      });

      this.calculateTotalAmount();
    },

    autocompleteCurrency(data: FormCurrencyType) {
      this.form.exchange_rate = Number(data.num);
      this.currencySymbolLabel = data.symbol;

      this.calculateTotalAmount();
    },

    closeAllModal() {
      this.isOpenModal.products = false;
      this.isOpenModal.so = false;
      this.isOpenModal.ro = false;
    },

    onClickUpdateProductsModal() {
      const currentValues = {
        purchase_type_id: this.form.purchase_type_id,
        currency_id: this.form.currency_id,
        exchange_rate: this.form.exchange_rate,
        vat_id: this.form.vat_id,
        vat_percentage: this.form.vat_percentage,
        pph23_id: this.form.pph23_id,
        pph23_percentage: this.form.pph23_percentage,
        discount_amount: this.form.discount_amount,
        discount_percentage: this.form.discount_percentage,
        remark: this.form.remark
      };

      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();

      this.form.purchase_type_id = currentValues.purchase_type_id;
      this.form.currency_id = currentValues.currency_id;
      this.form.exchange_rate = currentValues.exchange_rate;
      this.form.vat_id = currentValues.vat_id;
      this.form.vat_percentage = currentValues.vat_percentage;
      this.form.pph23_id = currentValues.pph23_id;
      this.form.pph23_percentage = currentValues.pph23_percentage;
      this.form.discount_amount = currentValues.discount_amount;
      this.form.discount_percentage = currentValues.discount_percentage;
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
        this.itemsCheck.checkProducts = [];

        // const directProducts = this.itemsCheck.checkMain.filter(item =>
        //   item.ref_type === 'products' && !item.parent_product_ref_id
        // );

        // directProducts.forEach(item => {
        //   const productInModal = this.metaModal.indexProducts.data.find(p => p.ref_id === item.ref_id);
        //   if (productInModal && !this.itemsCheck.checkProducts.some(p => p.ref_id === item.ref_id)) {
        //     this.itemsCheck.checkProducts.push(productInModal);
        //   }
        // });

        // this.parentProductsSelected.forEach(parentRefId => {
        //   const productInModal = this.metaModal.indexProducts.data.find(p => p.ref_id === parentRefId);
        //   if (productInModal && !this.itemsCheck.checkProducts.some(p => p.ref_id === parentRefId)) {
        //     this.itemsCheck.checkProducts.push(productInModal);
        //   }
        // });

        this.itemsCheck.checkProducts = updatePoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "products",
          this.itemsCheck.checkProducts
        );
        this.countSelectedReferences();
        this.isOpenModal.products = true;
      } else if (ref.key == "so") {
        this.itemsCheck.checkSo = updatePoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "so",
          this.itemsCheck.checkSo
        );

        this.countSelectedReferences();
        this.isOpenModal.so = true;
      } else if (ref.key == "ro") {
        this.itemsCheck.checkRo = updatePoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "ro",
          this.itemsCheck.checkRo
        );

        this.countSelectedReferences();
        this.isOpenModal.ro = true;
      }

      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.products) {
        await this.indexProduct();

        // this.metaModal.indexProducts.data.forEach(product => {
        //   const isParentSelected = this.parentProductsSelected.includes(product.ref_id);

        //   const isDirectlySelected = this.itemsCheck.checkMain.some(item =>
        //     item.ref_type === 'products' && item.ref_id === product.ref_id
        //   );

        //   if ((isParentSelected || isDirectlySelected) &&
        //     !this.itemsCheck.checkProducts.some(p => p.ref_id === product.ref_id)) {
        //     this.itemsCheck.checkProducts.push(product);
        //   }
        // });
      } else if (this.isOpenModal.so) {
        await this.indexSalesOrder();
      } else if (this.isOpenModal.ro) {
        await this.indexRequisitionOrder();
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

      if (this.isOpenModal.ro) {
        this.queryModal.qIndexRo.page = options.page;
        this.queryModal.qIndexRo.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexRo.order_column = options.sortBy[0].key;
          this.queryModal.qIndexRo.order_direction = options.sortBy[0].order;
        } else {
          this.queryModal.qIndexRo.order_column = "";
          this.queryModal.qIndexRo.order_direction = "";
        }
      }

      await this.fetchModalFilter();
    },

    calculateTotalAmount() {
      this.autocompleteIsVat()
      this.itemsCheck.checkMain.forEach((item: PoDtType) => {
        item.subtotal = item.qty * item.price;

        if (!!item.discount_percentage && item.discount_percentage > 0) {
          item.discount_amount = 0;
        } else if (!!item.discount_amount && item.discount_amount > 0) {
          item.discount_percentage = 0;
        }

        const discPercentage = Number((item.discount_percentage ?? 0) / 100);
        const discAmount = Number(item.discount_amount);
        const priceBuy = Number(item.price);
        const qty = Number(item.qty);
        const subtotalBuy = Number(priceBuy * qty);

        const discPercPriceSell = Number(priceBuy * discPercentage);
        const discPercNum = Number(priceBuy - discPercPriceSell);
        // const subDiscPercAm = Number(qty * discPercNum);
        const discPercAm = Number(subtotalBuy * discPercentage);
        const subDiscPercAm = Number(subtotalBuy - discPercAm);

        item.subtotal = subtotalBuy;

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
          discFinal = subtotalBuy;
        }

        item.discount_percentage_num = 0;
        item.discount_final = discFinal
        item.discount_percentage_num = discPercNum;
        item.discount_percentage_amount = discPercAm;
        if (discPercentage) {
        }

        item.vat_perc_am = 0;

        item.pph23_perc_am = 0;

        item.total_amount = item.discount_final + item.vat_perc_am - item.pph23_perc_am;
      });

      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: PoDtType) => acc + (item.qty || 0), 0
      );

      this.form.subtotal = this.itemsCheck.checkMain.reduce(
        (acc: number, item: PoDtType) => acc + (item.subtotal || 0), 0
      );

      this.form.total_amount_products = this.itemsCheck.checkMain.reduce(
        (acc: number, item: PoDtType) => acc + (item.total_amount || 0), 0
      );

      this.form.discount_amount_product = this.itemsCheck.checkMain.reduce(
        (acc: number, item: PoDtType) => acc + ((item.discount_amount + item.discount_percentage_amount) || 0), 0
      );

      this.form.discount_percentage_amount = 0

      if (!!this.form.discount_percentage) {
        // this.form.discount_percentage_amount = this.form.disc_final * (((this.form.discount_percentage ?? 0) / 100));

        let discPercAm = this.itemsCheck.checkMain.reduce(
          (acc: number, item: PoDtType) => {
            return acc + (item.total_amount * (this.form.discount_percentage / 100));
          },
          0
        );

        this.form.discount_percentage_amount = discPercAm;
      }

      this.form.total_discount = this.form.discount_amount_product + this.form.discount_percentage_amount + this.form.discount_amount;
      if (this.form.total_discount < 0) {
        this.form.total_discount = 0
      }

      const afterDiscount = this.form.subtotal - this.form.total_discount;
      this.form.total_after_disc = afterDiscount;


      this.form.total_vat = 0;
      if (!!this.form.vat_id) {
        let totalAmIsVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: PoDtType) => {
            if (!!item.is_vat) {
              return acc + item.total_amount;
            }
            return acc;
          },
          0
        );

        let discPercAmVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: PoDtType) => {
            if (!!item.is_vat) {
              return acc + (item.total_amount * (this.form.discount_percentage / 100));
            }
            return acc;
          },
          0
        );

        this.form.total_vat = (totalAmIsVat - (discPercAmVat + this.form.discount_amount)) * ((this.form.vat_percentage ?? 0) / 100)

        if (this.form.total_vat < 0) {
          this.form.total_vat = 0;
        }
      }

      this.form.total_pph23 = 0;
      if (!!this.form.pph23_id) {
        let subtotalIsPph23 = this.itemsCheck.checkMain.reduce(
          (acc: number, item: PoDtType) => {
            if (!!item.is_pph23) {
              return acc + item.subtotal;
            }
            return acc;
          },
          0
        );
        this.form.total_pph23 = subtotalIsPph23 * ((this.form.pph23_percentage ?? 0) / 100);
      }
      // if (this.form.vat_id) {
      //   const vatableAmount = this.itemsCheck.checkMain.reduce(
      //     (acc: number, item: PoDtType) => {
      //       if (item.is_vat) {
      //         return acc + (item.total_amount || 0);
      //       }
      //       return acc;
      //     }, 0
      //   );
      //   this.form.total_vat = (vatableAmount * (this.form.vat_percentage || 0)) / 100;
      // } else {
      //   this.form.total_vat = 0;
      // }

      // if (this.form.pph23_id) {
      //   const pph23Amount = this.itemsCheck.checkMain.reduce(
      //     (acc: number, item: PoDtType) => {
      //       if (item.is_pph23) {
      //         return acc + (item.total_amount || 0);
      //       }
      //       return acc;
      //     }, 0
      //   );
      //   this.form.total_pph23 = (pph23Amount * (this.form.pph23_percentage || 0)) / 100;
      // } else {
      //   this.form.total_pph23 = 0;
      // }

      this.form.grand_total = afterDiscount + this.form.total_vat - this.form.total_pph23;

      if (this.formLayout.summary) {
        this.formLayout.summary.subtotal.value = this.form.subtotal;
        this.formLayout.summary.total_discount.value = this.form.total_discount;
        this.formLayout.summary.total_after_disc.value = this.form.total_after_disc;
        this.formLayout.summary.total_vat.value = this.form.total_vat;
        this.formLayout.summary.total_pph23.value = this.form.total_pph23;
        this.formLayout.summary.grand_total.value = this.form.grand_total;

        if (this.currencySymbolLabel) {
          this.formLayout.summary.total_discount.symbol = this.currencySymbolLabel;
          this.formLayout.summary.subtotal.symbol = this.currencySymbolLabel;
          this.formLayout.summary.total_after_disc.symbol = this.currencySymbolLabel;
          this.formLayout.summary.total_vat.symbol = this.currencySymbolLabel;
          this.formLayout.summary.total_pph23.symbol = this.currencySymbolLabel;
          this.formLayout.summary.grand_total.symbol = this.currencySymbolLabel;
        }
      }

      return {
        summary: {
          subtotal: this.form.subtotal,
          total_discount: this.form.total_discount,
          total_after_disc: this.form.total_after_disc,
          total_vat: this.form.total_vat,
          total_pph23: this.form.total_pph23,
          grand_total: this.form.grand_total,
        },
      }
    },

    calculateDiscount(poDt: PoDtType) {
      if (poDt.discount_percentage && poDt.discount_percentage > 0) {
        poDt.discount_amount = 0;
        poDt.discount_type = 'percentage';
      } else if (poDt.discount_amount && poDt.discount_amount > 0) {
        poDt.discount_percentage = 0;
        poDt.discount_type = 'amount';
      } else {
        poDt.discount_type = null;
      }

      if (poDt.discount_type === 'percentage') {
        poDt.discount_percentage_amount = (poDt.subtotal * (poDt.discount_percentage || 0)) / 100;
        poDt.discount_final = poDt.discount_percentage_amount;
      } else if (poDt.discount_type === 'amount') {
        poDt.discount_final = poDt.discount_amount || 0;
      } else {
        poDt.discount_final = 0;
      }

      poDt.total_amount = poDt.subtotal - poDt.discount_final;

      this.calculateTotalAmount();
    },

    calculateHeaderDiscount() {
      if (this.form.discount_percentage && this.form.discount_percentage > 0) {
        this.form.discount_amount = 0;
        this.form.discount_type = 'percentage';
      } else if (this.form.discount_amount && this.form.discount_amount > 0) {
        this.form.discount_percentage = 0;
        this.form.discount_type = 'amount';
      } else {
        this.form.discount_type = null;
      }

      this.calculateTotalAmount();
    },

    toggleVatForItem(poDt: PoDtType) {
      poDt.is_vat = poDt.is_vat ? 0 : 1;
      this.calculateTotalAmount();
    },

    togglePph23ForItem(poDt: PoDtType) {
      poDt.is_pph23 = poDt.is_pph23 ? 0 : 1;
      this.calculateTotalAmount();
    },

    updateQuantity(poDt: PoDtType) {
      poDt.subtotal = poDt.qty * poDt.price;
      this.calculateDiscount(poDt);
    },

    updatePrice(poDt: PoDtType) {
      poDt.subtotal = poDt.qty * poDt.price;
      this.calculateDiscount(poDt);
    },

    generatePoNumber(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;

      const randomId = Math.floor(100000 + Math.random() * 900000);

      return `PO-${dateStr}-${randomId}`;
    }
  },
  persist: [
    {
      paths: ['queryModal', 'formTabPurchaseOrder'],
      storage: localStorage
    }
  ]
})

export default usePurchaseOrderStore

