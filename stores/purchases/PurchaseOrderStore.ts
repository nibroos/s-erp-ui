import { generatePoBoms, initCheckedPoDt } from '~/composables/maps/purchaseOrderComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { FormVatType } from '~/types/masters/VatType'
import type { FormPoDtBomListType, FormPoDtProductListType, FormPurchaseOrderType, IndexPurchaseOrderType, QIndexProductsType, QIndexType, PoDtBomType, PoDtType, PoDtDiscType } from '~/types/purchase-orders/PurchaseOrderType'

const usePurchaseOrderStore = defineStore('PurchaseOrderStore', {
  state: () => ({
    form: {
      id: null,
    } as FormPurchaseOrderType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 10,
        parent_ids: [],
        global: '',
        order_column: 'id',
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
        order_column: 'id',
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
        order_column: 'id',
        order_direction: 'desc'
      } as QIndexProductsType
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
      } as PaginationMeta,
      indexBoms: {
        data: [] as FormPoDtBomListType[],
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
      checkBoms: [] as PoDtBomType[],
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
      // Add RO and SO references later
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
      parentPath: "/purchases/purchase-orders",
      currentTab: 0,
      tabs: ["Items", "Payments", "Remark", "Schedule", "Attachments"],
      button: {
        clear: {
          show: true,
        },
      },
      summary: {
        total_amount: {
          label: "Total Amount",
          symbol: '',
          value: 0,
          format: {
            precision: 2,
          },
        },
        total_qty: {
          label: "Total Qty",
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

      this.form.vat_percentage = this.form.vat_perc;
      this.form.pph23_percentage = this.form.pph23_perc;

      try {
        const response = await useMyFetch().post(
          '/v1/purchase-orders/create-purchase-order',
          this.form
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/purchases/purchase-orders/edit/${response.data.data[0].id}`)

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

      this.form.vat_percentage = this.form.vat_perc;
      this.form.pph23_percentage = this.form.pph23_perc;

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
          '/v1/purchase-orders/delete-purchase-order',
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
          '/v1/purchase-orders/restore-purchase-order',
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
            this.itemsCheck.checkProducts.forEach((checkProduct: FormPoDtProductListType, iCheckProduct: number) => {
              (this.metaModal.indexProducts.data as FormPoDtProductListType[]).forEach((resProduct: FormPoDtProductListType, iResProduct: number) => {
                if (resProduct.ref_id === checkProduct.ref_id && checkProduct.ref_type === 'products') {
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
            let generatedBoms = generatePoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)

            generatedBoms.forEach((checkBom: PoDtBomType, iCheckBom: number) => {
              (this.metaModal.indexBoms.data as PoDtBomType[]).forEach((resBom: FormPoDtBomListType, iResBom: number) => {
                if (resBom.ref_id === checkBom.item_id) {
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

        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response?.data);
      } finally {
        this.metaModal.index.loading = false
      }
    },

    selectItemRefModal() {
      if (this.isOpenModal.products) {
        this.itemsCheck.checkMain = generatePoDt(this.itemsCheck.checkProducts, 'products', this.itemsCheck.checkMain)
        this.isOpenModal.products = false
      }
      if (this.isOpenModal.boms) {
        if (this.itemsCheck.checkBoms.length > 0) {
          this.itemsCheck.checkBoms = generatePoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)
        } else {
          this.itemsCheck.checkBoms = []
        }
        this.itemsCheck.checkMain[this.openedModal.boms.index as number].po_dts_boms = this.itemsCheck.checkBoms
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
        order_column: 'id',
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
      this.form = cloneObject(useInitials.formPurchaseOrderCreateEdit);
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
        }
        // Add RO and SO references later
      });
    },

    updateRefsModal() {
      this.countSelectedReferences();
    },

    autocompleteSupplier(data: any) {
      this.form.email = data.email;
      this.form.phone = data.phone;
      this.form.address = data.address;
    },

    autocompleteVat(data: FormVatType) {
      this.form.vat_perc = Number(data.num);
      this.form.vat_percentage = Number(data.num);
      
      this.updateAllItemsVat(data.id, Number(data.num));
      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type) {
      this.form.pph23_perc = Number(data.num);
      this.form.pph23_percentage = Number(data.num);
      
      this.updateAllItemsPph23(data.id, Number(data.num));
      this.calculateTotalAmount();
    },

    removeVat() {
      this.form.vat_perc = 0;
      this.form.vat_percentage = 0;
      
      this.updateAllItemsVat(null, 0);
      this.calculateTotalAmount();
    },

    removePph() {
      this.form.pph23_perc = 0;
      this.form.pph23_percentage = 0;
      
      this.updateAllItemsPph23(null, 0);
      this.calculateTotalAmount();
    },

    removeVatDt(poDtType: PoDtType) {
      if (!poDtType.vat_id) {
        poDtType.vat_perc = 0;
        poDtType.vat_perc_am = 0;
      }
      this.calculateTotalAmount();
    },

    autocompleteCurrency(data: FormCurrencyType) {
      this.form.exchange_rate = Number(data.num);
      this.currencySymbolLabel = data.symbol;
      this.calculateTotalAmount();
    },

    closeAllModal() {
      this.isOpenModal.products = false;
      this.isOpenModal.boms = false;
    },

    onClickUpdateProductsModal() {
      this.selectItemRefModal();
    
      if (this.form.vat_id) {
        this.updateAllItemsVat(this.form.vat_id, this.form.vat_perc);
      }
      
      if (this.form.pph23_id) {
        this.updateAllItemsPph23(this.form.pph23_id, this.form.pph23_perc);
      }
      
      this.countSelectedReferences();
      this.closeAllModal();
    },

    onClickDeleteSelected(item: any, index: number) {
      this.itemsCheck.checkMain.splice(index, 1);
      this.countSelectedReferences();
    },

    onClickUpdateBomsModal() {
      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();
    },

    updateAllItemsVat(vatId: number | null, vatPerc: number) {
      if (vatId) {
        this.itemsCheck.checkMain.forEach((item: PoDtType) => {
          if (item.is_vat === 1) {
            item.vat_id = vatId;
            item.vat_perc = vatPerc;
          }
        });
      } else {
        this.itemsCheck.checkMain.forEach((item: PoDtType) => {
          item.vat_id = null;
          item.vat_perc = 0;
          item.is_vat = 0;
        });
      }
      this.calculateTotalAmount();
    },
    
    updateAllItemsPph23(pph23Id: number | null, pph23Perc: number) {
      if (pph23Id) {
        this.itemsCheck.checkMain.forEach((item: PoDtType) => {
          if (item.is_pph23 === 1) {
            item.pph23_id = pph23Id;
            item.pph23_perc = pph23Perc;
          }
        });
      } else {
        this.itemsCheck.checkMain.forEach((item: PoDtType) => {
          item.pph23_id = null;
          item.pph23_perc = 0;
          item.is_pph23 = 0;
        });
      }
      this.calculateTotalAmount();
    },

    updateItemVat(item: PoDtType, vatId: number | null, vatPerc: number) {
      item.vat_id = vatId;
      item.vat_perc = vatPerc;
      item.is_vat = vatId ? 1 : 0;
      this.calculateTotalAmount();
    },

    updateItemPph23(item: PoDtType, pph23Id: number | null, pph23Perc: number) {
      item.pph23_id = pph23Id;
      item.pph23_perc = pph23Perc;
      item.is_pph23 = pph23Id ? 1 : 0;
      this.calculateTotalAmount();
    },

    setDiscountType(item: PoDtType | FormPurchaseOrderType) {
      if ('discount_percentage' in item && 'discount_amount' in item) {
        if (item.discount_percentage && item.discount_percentage > 0) {
          item.discount_type = 'percentage';
        } else if (item.discount_amount && item.discount_amount > 0) {
          item.discount_type = 'amount';
        } else {
          item.discount_type = null;
        }
      }
    },

    async onClickOpenModalOptionRefBtn(ref: RefBtnType) {
      this.isOpenModal.products = false;

      if (ref.key == "products") {
        this.itemsCheck.checkProducts = updatePoRefsModalFromMain(
          this.itemsCheck.checkMain,
          "products",
          this.itemsCheck.checkProducts
        );

        this.countSelectedReferences();
        this.isOpenModal.products = true;
      }
      // Add RO and SO references later

      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.products || this.isOpenModal.boms) {
        await this.indexProduct();
      }
      // Add RO and SO references later
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

      await this.fetchModalFilter();
    },

    async onClickOpenModalBOM(
      item: FormPoDtProductListType,
      index: number
    ) {
      this.openedModal.boms.index = index;
      this.openedModal.boms.id = item.ref_id;
      this.openedModal.boms.product_id = item.item_id as number;
      this.openedModal.boms.product_uuid = item.product_uuid as string;

      this.itemsCheck.checkBoms = item.po_dts_boms;
      this.isOpenModal.boms = true;
      await this.indexProduct();
    },

    onClickDeleteBom(
      index: number,
      indexBom: number,
      internalItem: any
    ) {
      const item = this.itemsCheck.checkMain[index];
      if (item && item.po_dts_boms) {
        item.po_dts_boms.splice(indexBom, 1);
      }

      this.calculateTotalAmount();
    },

    calculatePrice(item: any, parentItem: any) {
      if (item && parentItem) {
        item.subtotal = Number(item.qty || 0) * Number(item.price || 0);
        
        if (parentItem.po_dt_boms && parentItem.po_dt_boms.length > 0) {
          const totalBomAmount = parentItem.po_dt_boms.reduce(
            (acc: number, bomItem: any) => acc + Number(bomItem.subtotal || 0),
            0
          );
          
          parentItem.bom_total = totalBomAmount;
        }
      } else if (item) {
        item.subtotal = Number(item.qty || 0) * Number(item.price || 0);
        
        item.discount_percentage_amount = 0;
        item.discount_final = 0;
        
        if (item.discount_percentage && item.discount_percentage > 0) {
          const discountPercentageDecimal = Number(item.discount_percentage) / 100;
          item.discount_percentage_amount = item.subtotal * discountPercentageDecimal;
          
          let discountedAmount = item.subtotal - item.discount_percentage_amount;
          
          if (item.discount_amount && item.discount_amount > 0) {
            discountedAmount -= Number(item.discount_amount);
          }
          
          item.total_amount = Math.max(0, discountedAmount);
          item.discount_final = item.subtotal - item.total_amount;
        } else if (item.discount_amount && item.discount_amount > 0) {
          const discountedAmount = item.subtotal - Number(item.discount_amount);
          
          item.total_amount = Math.max(0, discountedAmount);
          item.discount_final = item.subtotal - item.total_amount;
        } else {
          item.total_amount = item.subtotal;
          item.discount_final = 0;
        }
        
        if (item.po_dt_boms && item.po_dt_boms.length > 0) {
          item.po_dt_boms.forEach((bomItem: any) => {
            bomItem.subtotal = Number(bomItem.qty || 0) * Number(bomItem.price || 0);
          });
          
          const totalBomAmount = item.po_dt_boms.reduce(
            (acc: number, bomItem: any) => acc + Number(bomItem.subtotal || 0),
            0
          );
          
          item.bom_total = totalBomAmount;
        }
      }
      
      this.calculateTotalAmount();
      
      return item;
    },
    calculateTotalAmount() {
      let totalSubtotal = 0;
      let totalDiscountProducts = 0;
      let totalVatableAmount = 0;
      let totalPph23Amount = 0;
      
      this.itemsCheck.checkMain.forEach((item: PoDtType) => {
        const subtotal = Number(item.qty || 0) * Number(item.price || 0);
        item.subtotal = subtotal;
        
        let productDiscount = 0;
        let productTotalAfterDiscount = subtotal;
        
        if (item.discount_percentage && item.discount_percentage > 0) {
          const discPercentage = Number(item.discount_percentage) / 100;
          item.discount_percentage_amount = subtotal * discPercentage;
          productDiscount += item.discount_percentage_amount;
          productTotalAfterDiscount -= item.discount_percentage_amount;
        }
        
        if (item.discount_amount && item.discount_amount > 0) {
          productDiscount += Number(item.discount_amount);
          productTotalAfterDiscount -= Number(item.discount_amount);
        }

        item.discount_final = productDiscount;
        
        productTotalAfterDiscount = Math.max(0, productTotalAfterDiscount);
        item.total_amount = productTotalAfterDiscount;
        
        totalSubtotal += subtotal;
        totalDiscountProducts += productDiscount;
        
        if (item.is_vat === 1) {
          totalVatableAmount += productTotalAfterDiscount;
        }
        
        if (item.is_pph23 === 1) {
          totalPph23Amount += productTotalAfterDiscount;
        }

        this.setDiscountType(item);
      });

      this.form.total_amount_products = this.itemsCheck.checkMain.reduce(
        (acc: number, item: PoDtType) => acc + Number(item.total_amount || 0),
        0
      );
      
      this.form.subtotal = totalSubtotal;

      this.form.vat_percentage = this.form.vat_perc;
      this.form.pph23_percentage = this.form.pph23_perc;
      
      let globalDiscount = 0;
      let totalAfterProductDiscounts = totalSubtotal - totalDiscountProducts;
      
      if (this.form.discount_percentage && this.form.discount_percentage > 0) {
        const globalDiscPercentage = Number(this.form.discount_percentage) / 100;
        this.form.discount_percentage_amount = totalAfterProductDiscounts * globalDiscPercentage;
        globalDiscount = this.form.discount_percentage_amount;
      } else if (this.form.discount_amount && this.form.discount_amount > 0) {
        globalDiscount = Number(this.form.discount_amount);
      }
      
      this.form.discount_amount_product = totalDiscountProducts;
      this.form.discount_final_header = globalDiscount;
      
      this.form.total_discount = totalDiscountProducts + globalDiscount;
      
      const totalAfterAllDiscounts = totalAfterProductDiscounts - globalDiscount;
      
      this.form.total_vat = 0;
      if (this.form.vat_id && this.form.vat_perc > 0) {
        this.form.total_vat = totalVatableAmount * (Number(this.form.vat_perc) / 100);
      }
      
      this.form.total_pph23 = 0;
      if (this.form.pph23_id && this.form.pph23_perc > 0) {
        this.form.total_pph23 = totalPph23Amount * (Number(this.form.pph23_perc) / 100);
      }
      
      this.form.grand_total = totalAfterAllDiscounts + this.form.total_vat - this.form.total_pph23;
      
      this.form.grand_total = Math.max(0, this.form.grand_total);

      this.setDiscountType(this.form);
      
      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: PoDtType) => acc + Number(item.qty || 0),
        0
      );
      
      if (this.formLayout?.summary) {
        this.formLayout.summary.total_amount.value = this.form.subtotal;
        this.formLayout.summary.total_qty.value = this.form.total_qty;
        this.formLayout.summary.total_discount.value = this.form.total_discount;
        this.formLayout.summary.total_vat.value = this.form.total_vat;
        this.formLayout.summary.total_pph23.value = this.form.total_pph23;
        this.formLayout.summary.grand_total.value = this.form.grand_total;
        
        if (this.currencySymbolLabel) {
          this.formLayout.summary.total_amount.symbol = this.currencySymbolLabel;
          this.formLayout.summary.total_discount.symbol = this.currencySymbolLabel;
          this.formLayout.summary.total_vat.symbol = this.currencySymbolLabel;
          this.formLayout.summary.total_pph23.symbol = this.currencySymbolLabel;
          this.formLayout.summary.grand_total.symbol = this.currencySymbolLabel;
        }
      }
      
      return {
        summary: {
          total_amount: this.form.subtotal,
          total_qty: this.form.total_qty,
          total_discount: this.form.total_discount,
          total_vat: this.form.total_vat,
          total_pph23: this.form.total_pph23,
          grand_total: this.form.grand_total,
        },
      };
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
