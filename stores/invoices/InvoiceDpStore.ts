import { convertInvoiceDpItemRefProduct, generateInvoiceDpDt, initCheckedInvoiceDpDt, updateInvoiceDpRefsModalFromMain } from '~/composables/maps/invoiceDpComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { FormVatType } from '~/types/masters/VatType'
import type { 
  FormInvoiceDpDtProductListType, 
  FormInvoiceDpDtRefType, 
  FormInvoiceDpType, 
  IndexInvoiceDpType, 
  InvoiceDpDtType, 
  InvoiceDpRefType, 
  QIndexSalesOrdersType, 
  QInvoiceDpIndexType 
} from '~/types/invoice-dps/InvoiceDpType'

const useInvoiceDpStore = defineStore('InvoiceDpStore', {
  state: () => ({
    form: {
      id: null,
    } as FormInvoiceDpType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'invoice_date',
        order_direction: 'desc'
      } as QInvoiceDpIndexType,

      qIndexSalesOrders: {
        page: 1,
        per_page: 100,
        sales_order_ids: [],
        customer_ids: [],
        customer_id: null,
        order_column: 'order_at',
        order_direction: 'desc'
      } as QIndexSalesOrdersType
    },
    metaModal: {
      index: {
        data: [] as IndexInvoiceDpType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSalesOrders: {
        data: [] as FormInvoiceDpDtProductListType[],
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
      checkMain: [] as InvoiceDpDtType[],
      checkSalesOrders: [] as FormInvoiceDpDtProductListType[],
    },
    isOpenModal: {
      salesOrders: false,
    },
    optionRefBtnRef: [
      {
        cta: "Sales Order",
        key: "salesOrders",
        icon: "mdi-file-document-outline",
        count: 0,
        type: "button",
      },
    ] as RefBtnType[],
    openedModal: {
      so: {
        id: null as number | null,
        index: null as number | null,
      }
    },
    currencySymbolLabel: '' as string | null,
    referenceOptions: {
      vats: [] as FormVatType[],
    },
    headAutocomplete: {
      so: {
        customer_id: null as number | null | undefined,
        currency_id: null as number | null | undefined,
        exchange_rate: 0 as number | null | undefined,
        is_vat: 0 as number | null | undefined,
        vat_id: null as number | null | undefined,
        vat_percentage: 0,
        pph23_id: null as number | null | undefined,
        pph23_percentage: 0,
        discount_amount: 0,
        discount_percentage: 0,
        remark: '' as string | null | undefined,
        is_pph23: 0 as number | null | undefined,
      }
    },
    formLayout: {
      title: "Basic Information",
      parentPath: "/invoices/invoice-dps",
      currentTab: 0,
      tabs: ["Items", "Remark", "Attachments"],
      button: {
        clear: {
          show: true,
        },
      },
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
        total_dp: {
          label: "Total DP",
          symbol: '',
          value: 0,
          percentage: 30,
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
    async indexInvoiceDp() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/invoice-dps/index-invoice-dp',
          this.queryModal.qIndex
        )
        
        this.metaModal.index = response.data
        
        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice DPs!')
      } finally {
        this.metaModal.index.loading = false
      }
    },

    async show() {
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/invoice-dps/show-invoice-dp',
          {
            id: this.form.id
          }
        )

        this.form = response.data.data[0]
        if (!this.form.attachments) {
          this.form.attachments = []
        }
        
        this.itemsCheck.checkMain = initCheckedInvoiceDpDt(this.form.invoice_dp_dts || [])

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice DP details!')
      } finally {
        this.loading.editPageLoading = false
        this.updateRefsModal()
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
          '/v1/invoice-dps/create-invoice-dp',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInvoiceDpCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/invoices/invoice-dps`)

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
          '/v1/invoice-dps/update-invoice-dp',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInvoiceDpCreateEdit)
        )

        this.form.id = id
        await this.show()

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        navigateTo(`/invoices/invoice-dps`)

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
          '/v1/invoice-dps/delete-invoice-dp',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Delete Data', error.response.data)
        useAlert.alertError(error.response.data.message)
      }
    },

    async restore(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/invoice-dps/restore-invoice-dp',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Restore Data', error.response.data)
        useAlert.alertError(error.response.data.message)
      }
    },

    async indexSalesOrder() {
      if (this.metaModal.indexSalesOrders.loading) return
      this.metaModal.indexSalesOrders.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/invoice-dps/index-ref-so-dt',
          this.queryModal.qIndexSalesOrders
        )

        if (this.isOpenModal.salesOrders) {
          this.metaModal.indexSalesOrders = response.data

          if (this.itemsCheck.checkSalesOrders.length > 0) {
            this.itemsCheck.checkSalesOrders.forEach((checkSO: FormInvoiceDpDtProductListType, iCheckSO: number) => {
              (this.metaModal.indexSalesOrders.data as FormInvoiceDpDtProductListType[]).forEach((resSO: FormInvoiceDpDtProductListType, iResSO: number) => {
                if (resSO.ref_id === checkSO.ref_id && resSO.ref_dt_id === checkSO.ref_dt_id && checkSO.ref_type === 'so') {
                  const combined = {
                    ...resSO,
                    ...checkSO
                  }

                  this.metaModal.indexSalesOrders.data[iResSO] = combined
                  this.itemsCheck.checkSalesOrders[iCheckSO] = combined
                }
              })
            })
          }

          if (this.itemsCheck.checkSalesOrders.length > 0) {
            this.autocompleteSalesOrder(this.itemsCheck.checkSalesOrders[0])
          }
        }

        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Sales Order Data', error.response?.data)
      } finally {
        this.metaModal.indexSalesOrders.loading = false
      }
    },

    selectItemRefModal() {
      if (this.isOpenModal.salesOrders) {
        this.itemsCheck.checkMain = generateInvoiceDpDt(this.itemsCheck.checkSalesOrders, 'so', this.itemsCheck.checkMain)
        this.isOpenModal.salesOrders = false
      }
    },

    clickClearRefs() {
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkSalesOrders = []

      this.countSelectedReferences()
    },

    handleClearQuery() {
      this.queryModal.qIndexSalesOrders = {
        page: 1,
        per_page: 10,
        sales_order_ids: [],
        customer_ids: [],
        customer_id: null,
        order_column: 'order_at',
        order_direction: 'desc'
      }
    },

    resetSummary() {
      if (this.formLayout?.summary) {
        this.formLayout.summary.total_amount.value = 0
        this.formLayout.summary.total_discount.value = 0
        this.formLayout.summary.total_after_disc.value = 0
        this.formLayout.summary.total_vat.value = 0
        this.formLayout.summary.total_pph23.value = 0
        this.formLayout.summary.total_dp.value = 0
        this.formLayout.summary.grand_total.value = 0
      }
    },
    handleClickClear() {
      this.form = cloneObject(useInitials.formInvoiceDpCreateEdit)
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkSalesOrders = []
      this.errors = {}

      this.resetSummary()
      this.countSelectedReferences()
    },

    countSelectedReferences() {
      this.optionRefBtnRef.map((item) => {
        if (item.key == "salesOrders") {
          item.count = this.itemsCheck.checkMain.filter(
            (item) => item.ref_type == "so"
          ).length;
        }
      });
    },

    updateRefsModal() {
      this.itemsCheck.checkSalesOrders = updateInvoiceDpRefsModalFromMain(
        this.itemsCheck.checkMain,
        "so",
        this.itemsCheck.checkSalesOrders
      );

      this.countSelectedReferences();
    },

    autocompleteCustomer(data: any) {
      this.form.email = data.email;
      this.form.phone = data.phone;
      this.form.customer_code = data.shortname;

      if (!!data.currency_id && !this.form.currency_id) {
        this.form.currency_id = data.currency_id
      }

      if (!this.form.address) {
        this.form.address = data.address;
      }

      if (!!data.id) {
        this.queryModal.qIndexSalesOrders.customer_id = data.id;
        this.queryModal.qIndexSalesOrders.customer_ids = [data.id];
      }
    },

    autocompleteVat(data: FormVatType) {
      this.form.vat_percentage = Number(data.num);

      this.itemsCheck.checkMain.forEach((item: InvoiceDpDtType) => {
        if (!!item.is_vat) {
          item.vat_id = data.id as number;
          item.vat_percentage = Number(data.num);
        }
      });

      this.calculateTotalAmount();
    },

    autocompleteVatDt(data: FormVatType, invoiceDpDtType: InvoiceDpDtType) {
      invoiceDpDtType.vat_percentage = Number(data.num);
      this.calculateTotalAmount();
    },

    autocompletePph23Dt(data: FormPph23Type, invoiceDpDtType: InvoiceDpDtType) {
      invoiceDpDtType.pph23_percentage = Number(data.num);
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

      this.itemsCheck.checkMain.forEach((item: InvoiceDpDtType) => {
        item.vat_id = null;
        item.vat_percentage = 0;
        item.is_vat = 0;
      });

      this.calculateTotalAmount();
    },

    removeVatDt(invoiceDpDtType: InvoiceDpDtType) {
      if (!invoiceDpDtType.vat_id) {
        invoiceDpDtType.vat_percentage = 0;
      }

      this.calculateTotalAmount();
    },

    removePph23Dt(invoiceDpDtType: InvoiceDpDtType) {
      if (!invoiceDpDtType.pph23_id) {
        invoiceDpDtType.pph23_percentage = 0;
      }

      this.calculateTotalAmount();
    },

    removePph() {
      this.form.pph23_percentage = 0;
      this.form.total_pph23 = 0;

      this.itemsCheck.checkMain.forEach((item: InvoiceDpDtType) => {
        item.pph23_id = null;
        item.pph23_percentage = 0;
      });

      this.calculateTotalAmount();
    },

    removeAllPph() {
      this.form.pph23_id = null;
      this.form.pph23_percentage = 0;

      this.itemsCheck.checkMain.forEach((item: InvoiceDpDtType) => {
        item.pph23_id = null;
        item.pph23_percentage = 0;
        item.is_pph23 = 0;
      });

      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type) {
      this.form.pph23_percentage = Number(data.num);

      this.itemsCheck.checkMain.forEach((item: InvoiceDpDtType) => {
        if (!!item.is_pph23) {
          item.pph23_id = data.id as number;
          item.pph23_percentage = Number(data.num);
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
      this.isOpenModal.salesOrders = false;
    },

    onClickUpdateProductsModal() {
      if (this.isOpenModal.salesOrders) {
        this.form.customer_id = this.headAutocomplete.so.customer_id;
        this.form.currency_id = this.headAutocomplete.so.currency_id;
        this.form.exchange_rate = this.headAutocomplete.so.exchange_rate;
        this.form.is_vat = this.headAutocomplete.so.is_vat as number;
        this.form.vat_id = this.headAutocomplete.so.vat_id;
        this.form.vat_percentage = this.headAutocomplete.so.vat_percentage as number;
        this.form.pph23_id = this.headAutocomplete.so.pph23_id;
        this.form.pph23_percentage = this.headAutocomplete.so.pph23_percentage as number;
        this.form.discount_amount = this.headAutocomplete.so.discount_amount as number;
        this.form.discount_percentage = this.headAutocomplete.so.discount_percentage as number;
        this.form.remark = this.headAutocomplete.so.remark;
      }
      
      this.selectItemRefModal();
      this.countSelectedReferences();
      this.closeAllModal();
    },

    onClickDeleteSelected(item: any, index: number) {
      this.itemsCheck.checkMain.splice(index, 1);
      this.countSelectedReferences();
      this.calculateTotalAmount();
    },

    async onClickOpenModalOptionRefBtn(ref: RefBtnType) {
      if (ref.key == "salesOrders") {
        this.itemsCheck.checkSalesOrders = updateInvoiceDpRefsModalFromMain(
          this.itemsCheck.checkMain,
          "so",
          this.itemsCheck.checkSalesOrders
        );

        this.countSelectedReferences();
        this.isOpenModal.salesOrders = true;
      }

      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.salesOrders) {
        if (!!this.form.customer_id) {
          this.queryModal.qIndexSalesOrders.customer_id = this.form.customer_id;
          this.queryModal.qIndexSalesOrders.customer_ids = [this.form.customer_id];
        } else {
          this.queryModal.qIndexSalesOrders.customer_id = null;
          this.queryModal.qIndexSalesOrders.customer_ids = [];
        }
        await this.indexSalesOrder();
      }
    },

    async fetchDataServerFetch(options: { [key: string]: any }) {
      if (this.isOpenModal.salesOrders) {
        this.queryModal.qIndexSalesOrders.page = options.page;
        this.queryModal.qIndexSalesOrders.per_page = options.itemsPerPage;

        if (options.sortBy.length > 0) {
          this.queryModal.qIndexSalesOrders.order_column = options.sortBy[0].key;
          this.queryModal.qIndexSalesOrders.order_direction = options.sortBy[0].order;
        } else {
          this.queryModal.qIndexSalesOrders.order_column = "";
          this.queryModal.qIndexSalesOrders.order_direction = "";
        }
      }

      await this.fetchModalFilter();
    },

    autocompleteSalesOrder(data: FormInvoiceDpDtProductListType) {
      this.form.customer_id = data.customer_id;
      this.headAutocomplete.so.currency_id = data.currency_id;
      this.headAutocomplete.so.exchange_rate = data.exchange_rate;
      this.headAutocomplete.so.vat_id = data.head_vat_id;
      this.headAutocomplete.so.vat_percentage = data.head_vat_percentage as number;
      this.headAutocomplete.so.pph23_id = data.head_pph23_id;
      this.headAutocomplete.so.pph23_percentage = data.head_pph23_percentage as number;
      this.headAutocomplete.so.discount_amount = data.head_discount_amount as number;
      this.headAutocomplete.so.discount_percentage = data.head_discount_percentage as number;
      this.headAutocomplete.so.remark = data.head_remark;
      this.headAutocomplete.so.is_vat = data.head_is_vat as number;
      this.headAutocomplete.so.is_pph23 = data.head_is_pph23 as number;
    },

    removeSalesOrder() {
      this.queryModal.qIndexSalesOrders.sales_order_ids = [];
      this.indexSalesOrder();
    },

    onClickSwitchVAT(data: any) {
      if (!data) {
        this.form.vat_id = null;
        this.form.vat_percentage = 0;
        this.form.total_vat = 0;
      } else {
        this.form.vat_id = this.referenceOptions.vats[0].id as number;
      }
    },

    calculateTotalAmount() {
      this.itemsCheck.checkMain.forEach((item: InvoiceDpDtType) => {
        if (!!item.discount_percentage && item.discount_percentage > 0) {
          item.discount_amount = 0;
        } else if (!!item.discount_amount && item.discount_amount > 0) {
          item.discount_percentage = 0;
        }

        const discPercentage = Number((item.discount_percentage ?? 0) / 100);
        const discAmount = Number(item.discount_amount);
        const price = Number(item.price);
        const qty = Number(item.qty);
        const subtotal = Number(price * qty);
        const dpPercentage = Number((item.dp_percentage ?? 0) / 100);

        const discPercPrice = Number(price * discPercentage);
        const discPercNum = Number(price - discPercPrice);
        const discPercAm = Number(subtotal * discPercentage);
        const subDiscPercAm = Number(subtotal - discPercAm);

        item.subtotal = subtotal;

        let discType = null;

        let discFinal = 0;
        if (!!discAmount && discAmount > 0) {
          discType = "amount";
        } else if (!!discPercentage && discPercentage > 0) {
          discType = "percentage";
        }

        discFinal = subDiscPercAm - discAmount;
        if (discFinal <= 0) {
          discFinal = subtotal;
        }

        item.discount_percentage_num = 0;
        item.discount_percentage_amount = 0;
        item.discount_final = discFinal;
        if (discPercentage) {
          item.discount_percentage_num = discPercNum;
          item.discount_percentage_amount = discPercAm;
        }

        item.total_amount = item.discount_final;
        item.total_dp = item.total_amount * dpPercentage;
      });

      this.form.subtotal = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceDpDtType) => acc + item.subtotal,
        0
      );

      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceDpDtType) => acc + item.qty,
        0
      );

      this.form.discount_final = Number(this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceDpDtType) => acc + (item.discount_percentage_amount + item.discount_amount),
        0
      ));

      this.form.discount_percentage_amount = 0;

      if (!!this.form.discount_percentage) {
        let discPercAm = this.itemsCheck.checkMain.reduce(
          (acc: number, item: InvoiceDpDtType) => {
            return acc + (item.total_amount * (this.form.discount_percentage / 100));
          },
          0
        );

        this.form.discount_percentage_amount = discPercAm;
      }

      this.form.total_discount = this.form.discount_final + this.form.discount_percentage_amount + this.form.discount_amount;
      if (this.form.total_discount < 0) {
        this.form.total_discount = 0;
      }

      const total_after_disc = this.form.subtotal - this.form.total_discount;

      this.form.discount_type = null;
      if (!!this.form.vat_id) {
        let totalAmIsVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: InvoiceDpDtType) => {
            if (!!item.is_vat) {
              return acc + item.total_amount;
            }
            return acc;
          },
          0
        );

        let discPercAmVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: InvoiceDpDtType) => {
            if (!!item.is_vat) {
              return acc + (item.total_amount * (this.form.discount_percentage / 100));
            }
            return acc;
          },
          0
        );

        this.form.total_vat = (totalAmIsVat - (discPercAmVat + this.form.discount_amount)) * ((this.form.vat_percentage ?? 0) / 100);
        if (this.form.total_vat < 0) {
          this.form.total_vat = 0;
        }
      }

      if (!!this.form.pph23_id) {
        let subtotalIsPph23 = this.itemsCheck.checkMain.reduce(
          (acc: number, item: InvoiceDpDtType) => {
            if (!!item.is_pph23) {
              return acc + item.subtotal;
            }
            return acc;
          },
          0
        );
        this.form.total_pph23 = subtotalIsPph23 * ((this.form.pph23_percentage ?? 0) / 100);
      }

      this.form.total_amount_products = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceDpDtType) => acc + item.total_amount,
        0
      );

      this.form.total_dp_products = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceDpDtType) => acc + item.total_dp,
        0
      );

      this.form.grand_total = this.form.total_dp_products + this.form.total_vat - this.form.total_pph23;

      if (this.formLayout.summary) {
        this.formLayout.summary.total_amount.value = this.form.subtotal;
        this.formLayout.summary.total_after_disc.value = total_after_disc;
        this.formLayout.summary.total_discount.value = this.form.total_discount;
        this.formLayout.summary.total_vat.value = this.form.total_vat;
        this.formLayout.summary.total_pph23.value = this.form.total_pph23;
        this.formLayout.summary.total_dp.value = this.form.total_dp_products;
        this.formLayout.summary.total_dp.percentage = this.form.dp_percentage;
        this.formLayout.summary.grand_total.value = this.form.grand_total;
      }

      let response = {
        summary: {
          total_amount: this.form.subtotal,
          total_after_disc: total_after_disc,
          total_discount: this.form.total_discount,
          total_vat: this.form.total_vat,
          total_pph23: this.form.total_pph23,
          total_dp: this.form.total_dp_products,
          grand_total: this.form.grand_total,
        },
      }

      return response
    },

    handleUploadFile(file: any) {
      console.log('file', file);
    },

    handleDeleteFile(index: number) {
      console.log('index', index);
      this.form.attachments.splice(index, 1);
    },

    updateDpPercentage(value: number) {
      this.form.dp_percentage = value;
      
      this.itemsCheck.checkMain.forEach((item: InvoiceDpDtType) => {
        item.dp_percentage = value;
        item.total_dp = item.total_amount * (value / 100);
      });
      
      this.calculateTotalAmount();
    },

    updateItemDpPercentage(item: InvoiceDpDtType, value: number) {
      item.dp_percentage = value;
      item.total_dp = item.total_amount * (value / 100);
      
      this.calculateTotalAmount();
    },

    onClickSwitchVatDt(item: InvoiceDpDtType, value: boolean) {
      item.is_vat = value ? 1 : 0;
      
      if (!value) {
        item.vat_id = null;
        item.vat_percentage = 0;
      } else if (this.form.vat_id) {
        item.vat_id = this.form.vat_id;
        item.vat_percentage = this.form.vat_percentage;
      }
      
      this.calculateTotalAmount();
    },

    onClickSwitchPph23Dt(item: InvoiceDpDtType, value: boolean) {
      item.is_pph23 = value ? 1 : 0;
      
      if (!value) {
        item.pph23_id = null;
        item.pph23_percentage = 0;
      } else if (this.form.pph23_id) {
        item.pph23_id = this.form.pph23_id;
        item.pph23_percentage = this.form.pph23_percentage;
      }
      
      this.calculateTotalAmount();
    },

    async fetchVatOptions() {
      try {
        const response = await useMyFetch().post(
          '/v1/vats/index-vat',
          {
            page: 1,
            per_page: 100,
            global: '',
            order_column: 'name',
            order_direction: 'asc'
          }
        )
        
        this.referenceOptions.vats = response.data.data
        
        return response
      } catch (error: any) {
        console.log('Failed To Fetch VAT Options', error?.response?.data)
      }
    },

    async changeStatus(id: number | string | string[] | undefined, status: string) {
      try {
        const response = await useMyFetch().post(
          '/v1/invoice-dps/update-status-invoice-dp',
          {
            id: id,
            status: status
          }
        )
        
        useAlert.alertSuccess(response.data.message)
        return response
      } catch (error: any) {
        console.log('Failed To Change Status', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to change status!')
      }
    }
  },
  persist: [
    {
      paths: ['queryModal', 'formTabInvoiceDp'],
      storage: localStorage
    }
  ]
})

function cloneObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export default useInvoiceDpStore


