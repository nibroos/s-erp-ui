import { generateQuoBoms, initCheckedQuoDt } from '~/composables/maps/quotationComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { QIndexProductsType } from '~/types/masters/ProductType'
import type { FormVatType } from '~/types/masters/VatType'
import type { FormQuoDtBomListType, FormQuoDtProductListType, FormQuotationType, IndexQuotationType, QQuoIndexType, QuoDtBomType, QuoDtDiscType, QuoDtType } from '~/types/quotations/QuotationType'
import type { WidgetSingleType } from '~/types/sales-orders/SalesOrderType'

const useQuotationStore = defineStore('QuotationStore', {
  state: () => ({
    form: {
      id: null,
    } as FormQuotationType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'quo_no',
        order_direction: 'desc'
      } as QQuoIndexType,

      qIndexProducts: {
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
      } as QIndexProductsType,
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
      } as PaginationMeta,
      indexWidgets: {
        data: [] as WidgetSingleType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
      pdfLoading: false,
      loadingCsv: false,
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
    },
    currencySymbolLabel: '',
    referenceOptions: {
      vats: [] as FormVatType[],
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

    async indexWidget() {
      if (this.metaModal.indexWidgets.loading) return
      this.metaModal.indexWidgets.loading = true

      let params = this.queryModal.qIndex

      try {
        const response = await useMyFetch().post(
          '/v1/quotations/widget-quotation',
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

      this.tabFormIndex = 0

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
        navigateTo(`/sales/quotations`)

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

      this.tabFormIndex = 0

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
        // await this.show()
        navigateTo(`/sales/quotations`)

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

      this.tabFormIndex = 0

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
        // navigateTo(`/sales/quotations`)

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

      this.tabFormIndex = 0

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
        // await this.show()
        // navigateTo(`/sales/quotations`)

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
            let generatedBoms = generateQuoBoms(this.itemsCheck.checkBoms, this.openedModal.boms.product_uuid, 'bom', this.openedModal.boms.product_id as number)

            generatedBoms.forEach((checkBom: QuoDtBomType, iCheckBom: number) => {
              (this.metaModal.indexBoms.data as QuoDtBomType[]).forEach((resBom: FormQuoDtBomListType, iResBom: number) => {

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

    selectItemRefModal() {
      if (this.isOpenModal.products) {
        this.itemsCheck.checkMain = generateQuoDt(this.itemsCheck.checkProducts, 'products', this.itemsCheck.checkMain, this.form)
        this.isOpenModal.products = false
      }
      if (this.isOpenModal.boms) {
        // this.itemsCheck.checkMain = generateQuoDt(this.itemsCheck.checkProducts, 'boms', this.itemsCheck.checkMain)

        if (this.itemsCheck.checkBoms.length > 0) {
          // console.log('select-itemcheck-product_id', this.openedModal.boms.product_id);

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
    },

    autocompleteVat(data: FormVatType) {
      this.form.vat_perc = Number(data.num);

      // apply to all childs
      this.itemsCheck.checkMain.forEach((item: QuoDtType) => {
        if (!!item.is_vat) {
          item.vat_id = data.id as number;
          item.vat_perc = Number(data.num);
        }
      });

      this.calculateTotalAmount();
    },

    autocompleteVatDt(data: FormVatType, soDtType: QuoDtType) {
      soDtType.vat_perc = Number(data.num);
      this.calculateTotalAmount();
    },

    autocompletePph23Dt(data: FormPph23Type, soDtType: QuoDtType) {
      soDtType.pph23_perc = Number(data.num);
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

      this.itemsCheck.checkMain.forEach((item: QuoDtType) => {
        item.vat_id = null;
        item.vat_perc = 0;
        item.vat_perc_am = 0;
      });

      this.calculateTotalAmount();
    },

    removeVatDt(soDtType: QuoDtType) {
      if (!soDtType.vat_id) {
        soDtType.vat_perc = 0;
        soDtType.vat_perc_am = 0;
      }

      this.calculateTotalAmount();
    },

    removePph23Dt(soDtType: QuoDtType) {
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
      this.itemsCheck.checkMain.forEach((item: QuoDtType) => {
        item.pph23_id = null;
        item.pph23_perc = 0;
        item.pph23_perc_am = 0;
      });

      this.calculateTotalAmount();
    },

    removeAllPph() {
      this.form.pph23_id = null;
      this.form.pph23_perc = 0;

      this.itemsCheck.checkMain.forEach((item: QuoDtType) => {
        item.pph23_id = null;
        item.pph23_perc = 0;
        item.pph23_perc_am = 0;
      });

      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type) {
      this.form.pph23_perc = Number(data.num);

      // apply to all childs
      this.itemsCheck.checkMain.forEach((item: QuoDtType) => {
        if (!!item.is_pph23) {
          item.pph23_id = data.id as number;
          item.pph23_perc = Number(data.num);
        }
      });

      this.calculateTotalAmount();
    },

    autocompleteCurrency(data: FormCurrencyType) {
      this.form.exchange_rate = Number(data.num);
      this.currencySymbolLabel = data.symbol ?? '';

      this.calculateTotalAmount();
    },

    autocompleteCustomer(data: any) {
      this.form.email = data.email;
      this.form.phone = data.phone;
      this.form.address = data.address;
      this.form.customer_code = data.shortname

      if (!!data.currency_id && !this.form.currency_id) {
        this.form.currency_id = data.currency_id
      }
    },

    // calculatePriceSell(priceSell: number, iQuoDt: number) {
    //   console.log('priceSell', priceSell, iQuoDt);

    //   this.itemsCheck.checkMain[iQuoDt].price_sell = priceSell;
    // },

    calculatePrice(quoDtBom: QuoDtBomType, quoDt: QuoDtType) {
      quoDtBom.subtotal_buy = quoDtBom.price_buy * quoDtBom.qty;

      if (!quoDt.is_lock_price_buy) {
        if (!!quoDt.quo_dts_boms && quoDt.quo_dts_boms.length > 0) {
          quoDt.price_buy = quoDt.quo_dts_boms.reduce(
            (acc: number, item: QuoDtBomType) => acc + item.subtotal_buy,
            0
          );
        } else if (!!quoDt.boms && quoDt.boms.length > 0) {
          quoDt.price_buy = quoDt.boms.reduce(
            (acc: number, item: QuoDtBomType) => acc + item.subtotal_buy,
            0
          );
        }
      }

      this.calculateMarkup(quoDt);
      // if (!quoDt.is_lock_price_sell) {
      //   quoDt.markup_perc_am = quoDt.price_buy * (quoDt.markup_perc ?? 0) / 100;
      //   quoDt.price_sell = quoDt.price_buy + (quoDt.price_buy * (quoDt.markup_perc ?? 0) / 100);
      // }
    },

    autocompleteMarkup(value: number) {
      this.itemsCheck.checkMain.forEach((item: QuoDtType) => {
        if (!item.is_lock_markup && value != 0) {
          item.markup_perc = value;
        }
      });
    },

    calculateMarkup(quoDt: QuoDtType) {
      if (!quoDt.is_lock_price_sell) {
        quoDt.markup_perc_am = quoDt.price_buy * (quoDt.markup_perc ?? 0) / 100;
        quoDt.price_sell = quoDt.price_buy + (quoDt.price_buy * (quoDt.markup_perc ?? 0) / 100);
      }
    },

    onClickLockMarkup(quoDt: QuoDtType) {
      if (!!quoDt.is_lock_markup) {
        quoDt.is_lock_markup = 0;
      } else {
        quoDt.is_lock_markup = 1;
      }
    },

    onClickLockPriceSell(quoDt: QuoDtType) {
      if (!!quoDt.is_lock_price_sell) {
        quoDt.is_lock_price_sell = 0;
      } else {
        quoDt.is_lock_price_sell = 1;
      }
    },

    onClickLockPriceBuy(quoDt: QuoDtType) {
      if (!!quoDt.is_lock_price_buy) {
        quoDt.is_lock_price_buy = 0;
      } else {
        quoDt.is_lock_price_buy = 1;
      }
    },

    closeAllModal() {
      this.isOpenModal.products = false;
      this.isOpenModal.boms = false;
    },

    onClickUpdateProductsModal() {
      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();
    },

    onClickUpdateBomsModal() {
      // console.log("item, onClickUpdateBomsModal", itemsCheck.value.checkBoms);
      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();
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

    calculateTotalAmount() {
      this.itemsCheck.checkMain.forEach((item: QuoDtType) => {
        if (!!item.quo_dts_boms) {
          item.quo_dts_boms.forEach((bom: QuoDtBomType) => {
            this.calculatePrice(bom, item);
          });
        }

        // let priceSell = item.price_buy + (item.price_buy * (item.markup_perc ?? 0) / 100);

        if (!!item.disc_perc && item.disc_perc > 0) {
          item.disc_am = 0;
        } else if (!!item.disc_am && item.disc_am > 0) {
          item.disc_perc = 0;
        }

        const priceSell = Number(item.price_sell);
        const priceBuy = Number(item.price_buy);
        let discPercentage = Number((item.disc_perc ?? 0) / 100);
        let discAmount = Number(item.disc_am);

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

        let discType: QuoDtDiscType = null;

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
        item.disc_final = discFinal
        if (discPercentage) {
          item.disc_perc_num = discPercNum;
          item.disc_perc_am = discPercAm;
        }

        item.disc_type = discType;

        item.vat_perc_am = 0;

        // if (!!item.vat_id) {
        //   item.vat_perc_am = item.disc_final * ((item.vat_perc ?? 0) / 100);
        // }

        item.pph23_perc_am = 0;

        // if (!!item.pph23_id) {
        //   item.pph23_perc_am = item.disc_final * ((item.pph23_perc ?? 0) / 100);
        // }

        item.total_am = item.disc_final + item.vat_perc_am - item.pph23_perc_am;
      });

      // header calculation
      this.form.subtotal = this.itemsCheck.checkMain.reduce(
        (acc: number, item: QuoDtType) => acc + item.subtotal_sell,
        0
      );

      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: QuoDtType) => acc + item.qty,
        0
      );

      this.form.disc_final = Number(this.itemsCheck.checkMain.reduce(
        (acc: number, item: QuoDtType) => acc + (item.disc_perc_am + item.disc_am),
        0
      ));

      this.form.disc_perc_am = 0

      if (!!this.form.disc_perc) {
        // this.form.disc_perc_am = this.form.disc_final * (((this.form.disc_perc ?? 0) / 100));
        // this.form.disc_perc_am = (this.form.subtotal - this.form.disc_final) * (((this.form.disc_perc ?? 0) / 100));

        let discPercAm = this.itemsCheck.checkMain.reduce(
          (acc: number, item: QuoDtType) => {
            return acc + (item.total_am * (this.form.disc_perc / 100));
          },
          0
        );

        this.form.disc_perc_am = discPercAm;
      }

      // // this.form.total_discount = item.disc_perc_am + item.disc_am + this.form.disc_am + this.form.disc_perc_am;
      this.form.total_discount = this.form.disc_final + this.form.disc_perc_am + this.form.disc_am;
      if (this.form.total_discount < 0) {
        this.form.total_discount = 0;
      }

      this.form.total_after_disc = this.form.subtotal - this.form.total_discount;

      this.form.disc_type = null;

      if (!!this.form.vat_id) {
        let totalAmIsVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: QuoDtType) => {
            if (!!item.is_vat) {
              return acc + item.total_am;
            }
            return acc;
          },
          0
        );

        let discPercAmVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: QuoDtType) => {
            if (!!item.is_vat) {
              return acc + (item.total_am * (this.form.disc_perc / 100));
            }
            return acc;
          },
          0
        );

        this.form.total_vat = (totalAmIsVat - (discPercAmVat + this.form.disc_am)) * ((this.form.vat_perc ?? 0) / 100)

        if (this.form.total_vat < 0) {
          this.form.total_vat = 0;
        }
      }

      if (!!this.form.pph23_id) {
        let subtotalIsPph23 = this.itemsCheck.checkMain.reduce(
          (acc: number, item: QuoDtType) => {
            if (!!item.is_pph23) {
              return acc + item.subtotal_sell;
            }
            return acc;
          },
          0
        );
        this.form.total_pph23 = subtotalIsPph23 * ((this.form.pph23_perc ?? 0) / 100);
      }

      this.form.grand_total =
        this.form.subtotal - this.form.total_discount + this.form.total_vat - this.form.total_pph23;
    },

    goToQuotation(id: number) {
      navigateTo(`/sales/quotations/edit/${id}`);
    },

    async onClickPDF() {
      if (!!this.loading.pdfLoading) return
      this.loading.pdfLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/quotations/pdf-quotation',
          {
            ...this.form,
            company: AuthStore().company
          }
        )

        console.log('response', response.data);

        const { data } = response.data
        window.open(data.link, '_blank')


        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      } finally {
        this.loading.pdfLoading = false
      }
    },
    async exportCSV() {
      if (this.loading.loadingCsv) return
      this.loading.loadingCsv = true

      try {
        const response = await useMyFetch().post(
          `/api/quotations/csv-quotation`,
          this.queryModal.qIndex,
          {
            responseType: 'blob',
            headers: {
              'Content-Type': 'text/csv',
              Accept: 'text/csv'
            }
          }
        )
        return response
      } catch (error: any) {
        console.error('FAILED TO EXPORT CSV:', error)
        throw error
      } finally {
        this.loading.loadingCsv = false
      }
    },


  },
  persist: [
    {
      paths: ['queryModal', 'formTabQuotation'],
      storage: localStorage
    }
  ]
})

export default useQuotationStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuotationStore, import.meta.hot))
}