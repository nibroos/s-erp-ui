import { convertInvoiceMaintenanceItemRefProduct, generateInvoiceMaintenanceDt, initCheckedInvoiceMaintenanceDt, updateInvoiceMaintenanceRefsModalFromMain } from '~/composables/maps/InvoiceMaintenanceComp'
import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { RefBtnType } from '~/types/components/OptionRefBtnType'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { FormPph23Type } from '~/types/masters/Pph23Type'
import type { FormVatType } from '~/types/masters/VatType'
import type {
  FormInvoiceMaintenanceDtProductListType,
  FormInvoiceMaintenanceDtRefType,
  FormInvoiceMaintenanceType,
  IndexInvoiceMaintenanceType,
  InvoiceMaintenanceDtType,
  InvoiceMaintenanceRefType,
  QIndexSalesOrdersType,
  QInvoiceMaintenanceIndexType
} from '~/types/invoice-maintenances/InvoiceMaintenanceType'
import type { WidgetSingleType } from '~/types/sales-orders/SalesOrderType'

const useInvoiceMaintenanceStore = defineStore('InvoiceMaintenanceStore', {
  state: () => ({
    form: {
      id: null,
    } as FormInvoiceMaintenanceType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'invoice_date',
        order_direction: 'desc'
      } as QInvoiceMaintenanceIndexType,

      qIndexSalesOrders: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'invoice_date',
        order_direction: 'desc'
      } as QIndexSalesOrdersType,

      qRepeatInvoice: {
        page: 1,
        per_page: 100,
        customer_ids: [],
        start_date: '',
        end_date: '',
        status: '',
        global: '',
        invoice_no: '',
        order_column: '',
        order_direction: 'desc'
      } as QRepeatInvoiceMaintenanceIndexType,
    },
    metaModal: {
      index: {
        data: [] as IndexInvoiceMaintenanceType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexSalesOrders: {
        data: [] as FormInvoiceMaintenanceDtProductListType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexWidgets: {
        data: [] as WidgetSingleType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      repeatInvoice: {
        data: [] as IndexInvoiceMaintenanceType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
      widgetLoading: false,
      pdfLoading: false,
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    itemsCheck: {
      checkMain: [] as InvoiceMaintenanceDtType[],
      checkSalesOrders: [] as FormInvoiceMaintenanceDtProductListType[],
    },
    selectedRepeatInvoices: [] as any[],
    isOpenModal: {
      salesOrders: false,
      repeatInvoice: false,
    },
    optionRefBtnRef: [
      {
        cta: "Sales Order",
        key: "salesOrders",
        icon: "mdi-cart-outline",
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
        due_at: '' as string | null | undefined,
        due_date: '' as string | null | undefined,
      }
    },
    formLayout: {
      title: "Basic Information",
      parentPath: "/invoices/invoice-maintenances",
      currentTab: 0,
      tabs: ["Items", "Remark"],
      button: {
        clear: {
          show: true,
        },
      },
    } as FormLayoutType,
    selectedBankDetails: {
      company_name: '',
      bank_name: '',
      account_number: '',
      account_name: ''
    },
    repeatForm: {
      title: '',
      invoice_date: '',
      due_date: '',
      remark: ''
    } as {
      title: string,
      invoice_date: string,
      due_date: string,
      remark: string
    },
  }),

  actions: {
    async indexInvoiceMaintenance() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/index-invoice-maintenance',
          this.queryModal.qIndex
        )

        this.metaModal.index = response.data

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice maintenances!')
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
          '/v1/invoice-maintenances/widget-invoice-maintenance',
          params
        )

        this.metaModal.indexWidgets = response.data
        let widgets = mapWidgets(response.data.data)
        this.metaModal.indexWidgets.data = widgets

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Widget Data', error.response?.data);
      } finally {
        this.metaModal.indexWidgets.loading = false
      }
    },

    async show() {
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/show-invoice-maintenance',
          {
            id: typeof this.form.id === 'string' ? parseInt(this.form.id) : this.form.id
          }
        )

        this.form = response.data.data[0]

        this.form.is_vat = this.form.vat_id ? 1 : 0
        this.form.is_pph23 = this.form.pph23_id ? 1 : 0

        if (!this.form.email && this.form.customer_id) {
          await this.fetchCustomerDetails(this.form.customer_id);
        }

        if (this.form.invoice_maintenance_dts && this.form.invoice_maintenance_dts.length > 0) {
          this.form.invoice_maintenance_dts.forEach(item => {
            item.product_code = item.item_code;
            item.product_name = item.item_name;
          });
        }

        this.itemsCheck.checkMain = initCheckedInvoiceMaintenanceDt(this.form.invoice_maintenance_dts || [])

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice maintenance details!')
      } finally {
        this.loading.editPageLoading = false
        this.updateRefsModal()
      }
    },

    async fetchCustomerDetails(customerId: number) {
      try {
        const response = await useMyFetch().post(
          '/v1/customers/index-customer',
          {
            id: customerId
          }
        )

        if (response.data && response.data.data && response.data.data.length > 0) {
          const customerData = response.data.data[0];
          this.autocompleteCustomer(customerData);
        }
      } catch (error) {
        console.log('Failed to fetch customer details', error);
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
        this.updateAllItemsVat();
        this.updateAllItemsPph23();

        this.form.invoice_maintenance_dts = [...this.itemsCheck.checkMain]
        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/create-invoice-maintenance',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInvoiceMaintenanceCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/invoices/invoice-maintenances`)

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
        let id = typeof this.form.id === 'string' ? parseInt(this.form.id) : this.form.id;

        this.updateAllItemsVat();
        this.updateAllItemsPph23();

        this.form.invoice_maintenance_dts = [...this.itemsCheck.checkMain]

        this.form.id = id;

        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/update-invoice-maintenance',
          this.form
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInvoiceMaintenanceCreateEdit)
        )

        this.form.id = id
        await this.show()

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        navigateTo(`/invoices/invoice-maintenances`)

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
          '/v1/invoice-maintenances/delete-invoice-maintenance',
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
          '/v1/invoice-maintenances/restore-invoice-maintenance',
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

      if (this.form.customer_id) {
        this.queryModal.qIndexSalesOrders.customer_id = this.form.customer_id
      }

      try {
        if (!this.queryModal.qIndexSalesOrders.specific_ids && this.itemsCheck.checkMain && this.itemsCheck.checkMain.length > 0) {
          const soItems = this.itemsCheck.checkMain.filter(item => item.ref_type === 'so');
          if (soItems.length > 0) {
            this.queryModal.qIndexSalesOrders.specific_ids = soItems.map(item => item.ref_dt_id).join(',');
          }
        }

        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/index-ref-so-dt',
          this.queryModal.qIndexSalesOrders
        )

        if (this.isOpenModal.salesOrders) {
          this.metaModal.indexSalesOrders = response.data

          if (this.itemsCheck.checkMain.length > 0) {
            const selectedItems: FormInvoiceMaintenanceDtProductListType[] = [];

            (this.metaModal.indexSalesOrders.data as FormInvoiceMaintenanceDtProductListType[]).forEach((resSO: FormInvoiceMaintenanceDtProductListType, iResSO: number) => {
              const existingItem = this.itemsCheck.checkMain.find(item =>
                item.ref_type === 'so' &&
                ((item.ref_id === resSO.sales_order_id && item.ref_dt_id === resSO.id) ||
                  (item.ref_id === resSO.ref_id && item.ref_dt_id === resSO.ref_dt_id))
              );

              if (existingItem) {
                const combined = {
                  ...resSO,
                  ref_type: 'so',
                  ref_id: resSO.sales_order_id || resSO.ref_id,
                  ref_dt_id: resSO.id || resSO.ref_dt_id,
                  qty: existingItem.qty,
                  is_vat: existingItem.is_vat,
                  is_pph23: existingItem.is_pph23,
                  vat_id: existingItem.vat_id,
                  pph23_id: existingItem.pph23_id
                };

                selectedItems.push(combined);

                this.metaModal.indexSalesOrders.data[iResSO] = combined;
              }
            });

            this.itemsCheck.checkSalesOrders = selectedItems;
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
        this.itemsCheck.checkMain = generateInvoiceMaintenanceDt(this.itemsCheck.checkSalesOrders, 'so', this.itemsCheck.checkMain)
        this.isOpenModal.salesOrders = false
      }
    },

    clickClearRefs() {
      const currentSpecificIds = this.queryModal.qIndexSalesOrders.specific_ids;
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkSalesOrders = []

      this.queryModal.qIndexSalesOrders.specific_ids = currentSpecificIds;

      this.countSelectedReferences()
    },

    handleClearQuery() {
      this.queryModal.qIndexSalesOrders = {
        page: 1,
        per_page: 100,
        sales_order_ids: [],
        customer_ids: [],
        customer_id: null,
        order_column: '',
        order_direction: 'desc',
        so_no: '',
        po_buyer_no: '',
        product_code: '',
        product_name: '',
        global: '',
        order_type_id: null,
        item_type: null,
        // invoice_id: currentInvoiceId
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
        this.formLayout.summary.total_balance.value = 0
        this.formLayout.summary.grand_total.value = 0
      }
    },

    handleClickClear() {
      const currentInvoiceNo = this.form.invoice_no;
      const currentId = this.form.id;
      const isEditMode = !!currentId;

      this.form = cloneObject(useInitials.formInvoiceMaintenanceCreateEdit)

      if (isEditMode) {
        this.form.id = currentId;
        this.form.invoice_no = currentInvoiceNo;
      }

      this.itemsCheck.checkMain = []
      this.itemsCheck.checkSalesOrders = []
      this.errors = {}

      this.queryModal.qIndexSalesOrders.customer_id = null;
      this.queryModal.qIndexSalesOrders.customer_ids = [];

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
      this.itemsCheck.checkSalesOrders = updateInvoiceMaintenanceRefsModalFromMain(
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

      this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
        if (!!item.is_vat) {
          item.vat_id = data.id as number;
          item.vat_percentage = Number(data.num);
        }
      });

      this.calculateTotalAmount();
    },

    autocompleteVatDt(data: FormVatType, invoiceMaintenanceDtType: InvoiceMaintenanceDtType) {
      invoiceMaintenanceDtType.vat_percentage = Number(data.num);
      this.calculateTotalAmount();
    },

    removeVat() {
      this.form.vat_percentage = 0;
      this.calculateTotalAmount();
    },

    updateAllItemsVat() {
      if (this.form.vat_id) {
        this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
          if (item.is_vat) {
            item.vat_id = this.form.vat_id;
            item.vat_percentage = this.form.vat_percentage;
          }
        });
      }
    },

    updateAllItemsPph23() {
      if (this.form.pph23_id) {
        this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
          if (item.is_pph23) {
            item.pph23_id = this.form.pph23_id;
            item.pph23_percentage = this.form.pph23_percentage;
          }
        });
      }
    },

    removeAllVat() {
      this.form.vat_id = null;
      this.form.vat_percentage = 0;
      this.form.total_vat = 0;

      this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
        item.vat_id = null;
        item.vat_percentage = 0;
        item.is_vat = 0;
      });

      this.calculateTotalAmount();
    },

    removeVatDt(invoiceMaintenanceDtType: InvoiceMaintenanceDtType) {
      if (!invoiceMaintenanceDtType.vat_id) {
        invoiceMaintenanceDtType.vat_percentage = 0;
      }

      this.calculateTotalAmount();
    },

    removePph23Dt(invoiceMaintenanceDtType: InvoiceMaintenanceDtType) {
      if (!invoiceMaintenanceDtType.pph23_id) {
        invoiceMaintenanceDtType.pph23_percentage = 0;
      }

      this.calculateTotalAmount();
    },

    removePph() {
      this.form.pph23_percentage = 0;
      this.form.total_pph23 = 0;

      this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
        item.pph23_id = null;
        item.pph23_percentage = 0;
      });

      this.calculateTotalAmount();
    },

    removeAllPph() {
      this.form.pph23_id = null;
      this.form.pph23_percentage = 0;

      this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
        item.pph23_id = null;
        item.pph23_percentage = 0;
        item.is_pph23 = 0;
      });

      this.calculateTotalAmount();
    },

    autocompletePph(data: FormPph23Type) {
      this.form.pph23_percentage = Number(data.num);

      this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
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
      if (this.isOpenModal.salesOrders && this.itemsCheck.checkSalesOrders.length > 0) {
        const firstSelectedItem = this.itemsCheck.checkSalesOrders[0];

        if (!this.form.customer_id && firstSelectedItem.customer_id) {
          this.form.customer_id = firstSelectedItem.customer_id;

          if (firstSelectedItem.customer_id) {
            this.fetchCustomerDetails(firstSelectedItem.customer_id);
          }
        }

        if (!this.form.currency_id && firstSelectedItem.currency_id) {
          this.form.currency_id = firstSelectedItem.currency_id;
          this.form.exchange_rate = firstSelectedItem.exchange_rate || 1;
        }

        let hasVat = false;
        let hasPph23 = false;

        const pph23Counts = new Map<number, number>();
        let maxPph23Count = 0;
        let mostCommonPph23Id: number | null = null;
        let mostCommonPph23Percentage = 0;

        this.itemsCheck.checkSalesOrders.forEach(item => {
          if (item.is_vat === 1) {
            hasVat = true;
          }

          if (item.is_pph23 === 1) {
            hasPph23 = true;

            // Check if head_pph23_id exists and add it to the count
            if (item.head_pph23_id) {
              const currentCount = (pph23Counts.get(item.head_pph23_id) || 0) + 1;
              pph23Counts.set(item.head_pph23_id, currentCount);

              if (currentCount > maxPph23Count) {
                maxPph23Count = currentCount;
                mostCommonPph23Id = item.head_pph23_id;
                mostCommonPph23Percentage = item.head_pph23_percentage || 0;
              }
            }
          }
        });

        if (hasVat && !this.form.is_vat) {
          this.form.is_vat = 1;
          this.onClickSwitchVAT(true);
        }

        // Fix: Set PPH23 ID and percentage even if form.pph23_id is already set
        if (hasPph23 && mostCommonPph23Id) {
          this.form.pph23_id = mostCommonPph23Id;
          this.form.pph23_percentage = mostCommonPph23Percentage;
          this.form.is_pph23 = 1;
        }

        if ((!this.form.discount_amount || this.form.discount_amount === 0) &&
          (!this.form.discount_percentage || this.form.discount_percentage === 0)) {

          if (firstSelectedItem.head_disc_am && firstSelectedItem.head_disc_am > 0) {
            this.form.discount_amount = firstSelectedItem.head_disc_am;
            this.form.discount_percentage = 0;
          }
          else if (firstSelectedItem.head_disc_perc && firstSelectedItem.head_disc_perc > 0) {
            this.form.discount_percentage = firstSelectedItem.head_disc_perc;
            this.form.discount_amount = 0;
          }
        }

        if (!this.form.remark && firstSelectedItem.head_remark) {
          this.form.remark = firstSelectedItem.head_remark;
        }

        this.form.due_date = firstSelectedItem.due_at;
        this.form.bank_id = firstSelectedItem.payment_id;
      }

      const existingItems = [...this.itemsCheck.checkMain];

      this.selectItemRefModal();

      this.countSelectedReferences();
      this.closeAllModal();
      this.calculateTotalAmount();
    },

    onClickDeleteSelected(item: any, index: number) {
      this.itemsCheck.checkMain.splice(index, 1);
      this.countSelectedReferences();
      this.calculateTotalAmount();
    },

    async onClickOpenModalOptionRefBtn(ref: RefBtnType) {
      if (ref.key == "salesOrders") {
        this.itemsCheck.checkSalesOrders = updateInvoiceMaintenanceRefsModalFromMain(
          this.itemsCheck.checkMain,
          "so",
          this.itemsCheck.checkSalesOrders
        );

        this.queryModal.qIndexSalesOrders.invoice_id = this.form.id;

        this.countSelectedReferences();
        this.isOpenModal.salesOrders = true;
      }

      await this.fetchModalFilter();
    },

    async fetchModalFilter() {
      if (this.isOpenModal.salesOrders) {
        if (!!this.queryModal.qIndexSalesOrders.customer_id) {
          this.queryModal.qIndexSalesOrders.customer_ids = [this.queryModal.qIndexSalesOrders.customer_id];
        } else {
          this.queryModal.qIndexSalesOrders.customer_ids = [];
        }

        if (this.form.id) {
          this.queryModal.qIndexSalesOrders.invoice_id = this.form.id;
        } else {
          this.queryModal.qIndexSalesOrders.invoice_id = null;
        }

        if (this.itemsCheck.checkMain && this.itemsCheck.checkMain.length > 0) {
          const soItems = this.itemsCheck.checkMain.filter(item => item.ref_type === 'so');
          if (soItems.length > 0) {
            this.queryModal.qIndexSalesOrders.specific_ids = soItems.map(item => item.ref_dt_id).join(',');
          }
        }
        await this.indexSalesOrder();
      }
    },

    async fetchDataServerFetch(options: { [key: string]: any }) {
      if (this.isOpenModal.salesOrders) {
        this.queryModal.qIndexSalesOrders.page = options.page;
        this.queryModal.qIndexSalesOrders.per_page = options.itemsPerPage;

        if (options.sortBy && options.sortBy.length > 0) {
          this.queryModal.qIndexSalesOrders.order_column = options.sortBy[0].key;
          this.queryModal.qIndexSalesOrders.order_direction = options.sortBy[0].order;
        } else {
          this.queryModal.qIndexSalesOrders.order_column = "";
          this.queryModal.qIndexSalesOrders.order_direction = "desc";
        }
      }

      await this.fetchModalFilter();
    },

    autocompleteBankInfo(data: any) {
      this.form.bank_id = data.id;
      this.selectedBankDetails = {
        company_name: data.company_name,
        bank_name: data.name,
        account_number: data.account_number,
        account_name: data.account_name
      };
    },

    autocompleteSalesOrder(data: FormInvoiceMaintenanceDtProductListType) {
      this.form.customer_id = data.customer_id;
      this.headAutocomplete.so.due_at = data.due_at;
      this.headAutocomplete.so.due_date = data.due_at;
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

    async onClickSwitchVAT(value: boolean) {
      if (!value) {
        this.form.vat_id = null;
        this.form.vat_percentage = 0;
        this.form.total_vat = 0;
      } else if (!this.form.vat_id) {
        const applicableVat = await this.getApplicableVat(this.form.invoice_date);

        if (applicableVat) {
          this.form.vat_id = applicableVat.id as number;
          this.form.vat_percentage = Number(applicableVat.num);

          this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
            if (item.is_vat) {
              item.vat_id = applicableVat.id as number;
              item.vat_percentage = Number(applicableVat.num);
            }
          });

          this.calculateTotalAmount();
        }
      }
    },

    calculateTotalAmount() {
      this.itemsCheck.checkMain.forEach((item: InvoiceMaintenanceDtType) => {
        const price = Number(item.price);
        const qty = Number(item.qty);
        item.subtotal = price * qty;

        const discount = Number(item.discount || 0);
        item.total_amount = item.subtotal - discount;

        // Calculate total_balance
        item.total_balance = item.total_amount - (item.total_dp || 0);
      });

      this.form.subtotal = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceMaintenanceDtType) => acc + item.subtotal,
        0
      );

      this.form.total_qty = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceMaintenanceDtType) => acc + item.qty,
        0
      );

      const totalItemDiscount = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceMaintenanceDtType) => acc + (item.discount || 0),
        0
      );

      this.form.total_amount_products = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceMaintenanceDtType) => acc + item.total_amount,
        0
      );

      this.form.discount_percentage_amount = 0;
      this.form.discount_final = 0;

      if (this.form.discount_percentage > 0) {
        this.form.discount_percentage_amount = this.form.total_amount_products * (this.form.discount_percentage / 100);
        this.form.discount_final = this.form.discount_percentage_amount;
        this.form.discount_type = 'percentage';
      } else if (this.form.discount_amount > 0) {
        this.form.discount_final = this.form.discount_amount;
        this.form.discount_type = 'amount';
      }

      this.form.total_discount = totalItemDiscount + this.form.discount_final;

      this.form.total_dp_products = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceMaintenanceDtType) => acc + (item.total_dp || 0),
        0
      );

      this.form.total_balance_products = this.itemsCheck.checkMain.reduce(
        (acc: number, item: InvoiceMaintenanceDtType) => acc + (item.total_balance || 0),
        0
      );

      if (!!this.form.vat_id) {
        let totalAmIsVat = this.itemsCheck.checkMain.reduce(
          (acc: number, item: InvoiceMaintenanceDtType) => {
            if (!!item.is_vat) {
              return acc + item.total_balance;
            }
            return acc;
          },
          0
        );

        totalAmIsVat = totalAmIsVat - (totalAmIsVat * (this.form.discount_percentage / 100));

        this.form.total_vat = totalAmIsVat * ((this.form.vat_percentage ?? 0) / 100);
      } else {
        this.form.total_vat = 0;
      }

      if (!!this.form.pph23_id) {
        let totalBalanceIsPph23 = this.itemsCheck.checkMain.reduce(
          (acc: number, item: InvoiceMaintenanceDtType) => {
            if (!!item.is_pph23) {
              return acc + item.total_balance;
            }
            return acc;
          },
          0
        );

        this.form.total_pph23 = totalBalanceIsPph23 * ((this.form.pph23_percentage ?? 0) / 100);
      } else {
        this.form.total_pph23 = 0;
      }

      this.form.grand_total = this.form.total_balance_products - this.form.discount_final + this.form.total_vat - this.form.total_pph23;

      if (this.form.grand_total < 0) {
        this.form.grand_total = 0;
      }

      if (this.formLayout.summary) {
        this.formLayout.summary.total_amount.value = this.form.total_amount_products;
        this.formLayout.summary.total_discount.value = this.form.discount_final;
        this.formLayout.summary.total_vat.value = this.form.total_vat;
        this.formLayout.summary.total_pph23.value = this.form.total_pph23;
        this.formLayout.summary.total_dp.value = this.form.total_dp_products;
        this.formLayout.summary.total_balance.value = this.form.total_balance_products;
        this.formLayout.summary.grand_total.value = this.form.grand_total;
      }

      return {
        summary: {
          total_amount: this.form.total_amount_products,
          total_discount: this.form.discount_final,
          total_vat: this.form.total_vat,
          total_pph23: this.form.total_pph23,
          total_dp: this.form.total_dp_products,
          total_balance: this.form.total_balance_products,
          grand_total: this.form.grand_total,
        },
      };
    },

    onClickSwitchVatDt(item: InvoiceMaintenanceDtType, value: boolean) {
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

    onClickSwitchPph23Dt(item: InvoiceMaintenanceDtType, value: boolean) {
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
            order_column: 'date_at',
            order_direction: 'desc'
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
          '/v1/invoice-maintenances/update-status-invoice-maintenance',
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
    },

    async approveInvoiceMaintenance(ids: number[] | number | string | string[] | undefined) {
      try {
        const idsArray = Array.isArray(ids) ? ids : [ids];

        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/approve-invoice-maintenance',
          {
            ids: idsArray
          }
        )

        useAlert.alertSuccess(response.data.message)
        return response
      } catch (error: any) {
        console.log('Failed To Approve Invoice Maintenance', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to approve invoice maintenance!')
      }
    },

    async sendEmailInvoicesMaintenance(ids: number[] | number | string | string[] | undefined) {
      try {
        const idsArray = Array.isArray(ids) ? ids : [ids];

        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/emails-invoice-maintenance',
          {
            ids: idsArray
          }
        )

        useAlert.alertSuccess(response.data.message)
        return response
      } catch (error: any) {
        console.log('Failed To Email Invoice Maintenance', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to emails invoice maintenance!')
      }
    },

    async cancelApprovalInvoiceMaintenance(ids: number[] | number | string | string[] | undefined) {
      try {
        const idsArray = Array.isArray(ids) ? ids : [ids];

        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/cancel-approve-invoice-maintenance',
          {
            ids: idsArray
          }
        )

        useAlert.alertSuccess(response.data.message)
        return response
      } catch (error: any) {
        console.log('Failed To Cancel Approval Invoice Maintenance', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to cancel approval for invoice maintenance!')
      }
    },

    async getApplicableVat(invoiceDate: string) {
      try {
        if (!this.referenceOptions.vats || this.referenceOptions.vats.length === 0) {
          await this.fetchVatOptions();
        }

        if (!this.referenceOptions.vats || this.referenceOptions.vats.length === 0) {
          return null;
        }

        const invoiceDateObj = new Date(invoiceDate);

        const sortedVats = [...this.referenceOptions.vats].sort((a, b) => {
          const dateA = new Date(a.date_at || '1970-01-01');
          const dateB = new Date(b.date_at || '1970-01-01');
          return dateB.getTime() - dateA.getTime();
        });

        let applicableVat = null;
        for (const vat of sortedVats) {
          const vatDateAt = new Date(vat.date_at || '1970-01-01');
          if (invoiceDateObj >= vatDateAt) {
            applicableVat = vat;
            break;
          }
        }

        if (!applicableVat && sortedVats.length > 0) {
          applicableVat = sortedVats[sortedVats.length - 1];
        }

        return applicableVat;
      } catch (error) {
        console.error('Error getting applicable VAT:', error);
        return null;
      }
    },

    async indexRepeatInvoiceMaintenance() {
      if (this.metaModal.repeatInvoice.loading) return
      this.metaModal.repeatInvoice.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/index-invoice-maintenance',
          this.queryModal.qRepeatInvoice
        )

        this.metaModal.repeatInvoice = response.data

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Repeat Invoice Data', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice maintenances for repeat!')
      } finally {
        this.metaModal.repeatInvoice.loading = false
      }
    },

    async repeatSelectedInvoices() {
      if (this.selectedRepeatInvoices.length === 0) {
        useAlert.alertError('Please select at least one invoice to repeat');
        return;
      }

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Repeat Invoice Confirmation',
        `Are you sure you want to repeat ${this.selectedRepeatInvoices.length} selected invoice(s)?`
      );

      if (!isConfirmed) return;

      try {
        const selectedInvoices = this.metaModal.repeatInvoice.data.filter(
          invoice => this.selectedRepeatInvoices.includes(invoice.id)
        );

        const invoiceUpdates = selectedInvoices.map(invoice => ({
          id: invoice.id,
          title: invoice.title,
          invoice_date: invoice.invoice_date,
          due_date: invoice.due_date,
          remark: invoice.remark
        }));

        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/repeat-invoice-maintenance',
          {
            invoices: invoiceUpdates,
            default_title: this.repeatForm.title || null,
            default_invoice_date: this.repeatForm.invoice_date || null,
            default_due_date: this.repeatForm.due_date || null,
            default_remark: this.repeatForm.remark || null
          }
        );

        useAlert.alertSuccess(response.data.message || 'Invoices repeated successfully');
        this.closeRepeatModal();
        this.indexInvoiceMaintenance();

        setTimeout(() => {
          window.location.href = '/invoices/invoice-maintenances';
        }, 1000);

        return response;
      } catch (error: any) {
        console.log('Failed to repeat invoices', error?.response?.data);
        useAlert.alertError(error?.response?.data?.message || 'Failed to repeat invoices');
      }
    },

    async onClickPDF() {
      this.form.invoice_maintenance_dts = this.itemsCheck.checkMain

      if (!!this.loading.pdfLoading) return
      this.loading.pdfLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/pdf-invoice-maintenance',
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
    openRepeatModal() {
      this.isOpenModal.repeatInvoice = true;
      this.selectedRepeatInvoices = [];
      this.repeatForm = {
        title: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        remark: ''
      };
      this.indexRepeatInvoiceMaintenance();
    },

    closeRepeatModal() {
      this.isOpenModal.repeatInvoice = false;
    },

    fetchRepeatDataServerFetch(options: { [key: string]: any }) {
      this.queryModal.qRepeatInvoice.page = options.page;
      this.queryModal.qRepeatInvoice.per_page = options.itemsPerPage;

      if (options.sortBy && options.sortBy.length > 0) {
        this.queryModal.qRepeatInvoice.order_column = options.sortBy[0].key;
        this.queryModal.qRepeatInvoice.order_direction = options.sortBy[0].order;
      } else {
        this.queryModal.qRepeatInvoice.order_column = "invoice_date";
        this.queryModal.qRepeatInvoice.order_direction = "desc";
      }

      this.indexRepeatInvoiceMaintenance();
    },

    async handleRepeatFilterChange() {
      this.queryModal.qRepeatInvoice.page = 1;
      await this.indexRepeatInvoiceMaintenance();
    },

    clearRepeatFilters() {
      this.queryModal.qRepeatInvoice = {
        page: 1,
        per_page: 100,
        customer_ids: [],
        global: '',
        order_column: 'invoice_date',
        order_direction: 'desc',
        invoice_no: '',
        start_date: '',
        end_date: '',
        status: null
      };
      this.indexRepeatInvoiceMaintenance();
    },

    generateSelectedInvoices() {
      if (!this.selectedRepeatInvoices || this.selectedRepeatInvoices.length === 0) {
        useAlert.alertError('Please select at least one invoice to update');
        return;
      }

      const { title, invoice_date, due_date, remark } = this.repeatForm;

      this.metaModal.repeatInvoice.data = this.metaModal.repeatInvoice.data.map(invoice => {
        if (this.selectedRepeatInvoices.includes(invoice.id)) {
          return {
            ...invoice,
            title: title || invoice.title,
            invoice_date: invoice_date || invoice.invoice_date,
            due_date: due_date || invoice.due_date,
            remark: remark || invoice.remark
          };
        }
        return invoice;
      });
    },

    setSelectedRepeatInvoices(invoices: any[]) {
      this.selectedRepeatInvoices = [...invoices];
    },

    async exportToCsv() {
      if (this.metaModal.index.loading) return;
      this.metaModal.index.loading = true;

      try {
        const response = await useMyFetch().post(
          '/v1/invoice-maintenances/csv-invoice-maintenance',
          this.queryModal.qIndex,
          {
            responseType: 'blob'
          }
        );

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const jsonData = await response.json();
          useAlert.alertError(jsonData.message || 'Failed to generate CSV file');
        } else {
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0];
          a.download = `invoice_maintenance_${dateStr}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          // useAlert.alertSuccess('CSV file downloaded successfully');
        }

        return response;
      } catch (error: any) {
        console.log('Failed To Export CSV', error);
        useAlert.alertError('Failed to export CSV!');
      } finally {
        this.metaModal.index.loading = false;
      }
    }
    // goToInvoiceMaintenance(id: number) {
    //   navigateTo(`/invoices/invoice-maintenances/edit/${id}`);
    // }     
  },
  persist: [
    {
      paths: ['queryModal', 'formTabInvoiceMaintenance'],
      storage: localStorage
    }
  ]
})

function cloneObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export default useInvoiceMaintenanceStore
