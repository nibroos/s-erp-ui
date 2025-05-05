import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { FormLayoutType } from '~/types/FormLayoutType'
import type { FormCurrencyType } from '~/types/masters/CurrencyType'
import type { 
  FormInvoiceAdjustmentType, 
  IndexInvoiceAdjustmentType, 
  InvoiceAdjustmentDtType, 
  QInvoiceAdjustmentIndexType, 
  QIndexInvoicesType,
  FormInvoiceAdjustmentDtInvoiceType
} from '~/types/invoice-adjustments/InvoiceAdjustmentType'
import { 
  convertInvoiceAdjustmentItemRef, 
  generateInvoiceAdjustmentDt, 
  updateInvoiceAdjustmentRefsFromMain,
  initCheckedInvoiceAdjustmentDt
} from '~/composables/maps/InvoiceAdjustmentComp'

const useInvoiceAdjustmentStore = defineStore('InvoiceAdjustmentStore', {
  state: () => ({
    form: {
      id: null,
      payment_date: '',
      payment_amount: 0,
      total_invoice: 0,
      total_adjustment: 0,
      total_balance: 0,
      total_admin_bank: 0,
      grand_total: 0,
      adjustment_dts: []
    } as FormInvoiceAdjustmentType,
    queryModal: {
      qIndex: {
        page: 1,
        per_page: 100,
        parent_ids: [],
        global: '',
        order_column: 'payment_date',
        order_direction: 'desc'
      } as QInvoiceAdjustmentIndexType,

      qIndexInvoices: {
        page: 1,
        per_page: 100,
        invoice_ids: [],
        customer_ids: [],
        customer_id: null,
        order_column: '',
        order_direction: 'desc'
      } as QIndexInvoicesType
    },
    metaModal: {
      index: {
        data: [] as IndexInvoiceAdjustmentType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
      indexInvoices: {
        data: [] as FormInvoiceAdjustmentDtInvoiceType[],
        loading: false,
        meta: {} as Meta
      } as PaginationMeta
    },
    loading: {
      formLoading: false,
      editPageLoading: false,
      searchInvoicesLoading: false
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    itemsCheck: {
      checkMain: [] as InvoiceAdjustmentDtType[],
      checkInvoices: [] as FormInvoiceAdjustmentDtInvoiceType[],
    },
    currencySymbolLabel: '' as string | null,
    selectedBankDetails: {
      company_name: '',
      bank_name: '',
      account_number: '',
      account_name: ''
    },
    formLayout: {
      title: "Basic Information",
      parentPath: "/invoices/invoice-adjustments",
      currentTab: 0,
      tabs: ["Items", "Remark"],
      button: {
        clear: {
          show: true,
        },
      },
    } as FormLayoutType,
  }),

  actions: {
    async indexInvoiceAdjustment() {
      if (this.metaModal.index.loading) return
      this.metaModal.index.loading = true

      try {
        const response = await useMyFetch().post(
          '/v1/invoice-adjustments/index-invoice-adjustment',
          this.queryModal.qIndex
        )
        
        this.metaModal.index = response.data
        
        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error?.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice adjustments!')
      } finally {
        this.metaModal.index.loading = false
      }
    },

    // async show() {
    //   if (!!this.loading.editPageLoading) return
    //   this.loading.editPageLoading = true
    //   try {
    //     const response = await useMyFetch().post(
    //       '/v1/invoice-adjustments/show-invoice-adjustment',
    //       {
    //         id: typeof this.form.id === 'string' ? parseInt(this.form.id) : this.form.id
    //       }
    //     )
    
    //     this.form = response.data.data[0]
        
    //     if (!this.form.email && this.form.customer_id) {
    //       await this.fetchCustomerDetails(this.form.customer_id);
    //     }

    //     this.itemsCheck.checkMain = initCheckedInvoiceAdjustmentDt(this.form.adjustment_dts || []);
    
    //     return response
    //   } catch (error: any) {
    //     console.log('Failed To Fetch Data', error.response.data)
    //     useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice adjustment details!')
    //   } finally {
    //     this.loading.editPageLoading = false
    //   }
    // },

    async show() {
      if (!!this.loading.editPageLoading) return
      this.loading.editPageLoading = true
      try {
        const response = await useMyFetch().post(
          '/v1/invoice-adjustments/show-invoice-adjustment',
          {
            id: typeof this.form.id === 'string' ? parseInt(this.form.id) : this.form.id
          }
        )
    
        this.form = response.data.data[0]

        if (this.form.customer_id) {
          this.queryModal.qIndexInvoices.customer_id = this.form.customer_id;
          this.queryModal.qIndexInvoices.customer_ids = [this.form.customer_id];
        }
        
        if (!this.form.email && this.form.customer_id) {
          await this.fetchCustomerDetails(this.form.customer_id);
        }

        this.itemsCheck.checkMain = initCheckedInvoiceAdjustmentDt(this.form.adjustment_dts || []).map(item => ({
          ...item,
          selected: true
        }));
    
        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch invoice adjustment details!')
      } finally {
        this.loading.editPageLoading = false
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

      if (!this.validateForm()) {
        this.loading.formLoading = false
        return
      }
    
      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )
    
      if (!isConfirmed) {
        this.loading.formLoading = false
        return
      }
    
      try {
        this.transferSelectedInvoicesToCheckMain();

        const formToSubmit = JSON.parse(JSON.stringify(this.form));
        
        formToSubmit.adjustment_dts = this.itemsCheck.checkMain.map(item => {
          return {
            ...item,
            total_adjustment: item.adjustment_amount,
            balance_amount: item.invoice_amount - item.adjustment_amount
          };
        });
        
        const response = await useMyFetch().post(
          '/v1/invoice-adjustments/create-invoice-adjustment',
          formToSubmit
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInvoiceAdjustmentCreateEdit)
        )
    
        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/invoices/invoice-adjustments`)
    
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
    
      if (!this.validateForm()) {
        this.loading.formLoading = false
        return
      }
    
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
    
        const formToSubmit = JSON.parse(JSON.stringify(this.form));

        formToSubmit.adjustment_dts = this.itemsCheck.checkMain
          .filter(item => item.selected && item.adjustment_amount > 0)
          .map(item => {
            return {
              ...item,
              total_adjustment: item.adjustment_amount,
              balance_amount: item.invoice_amount - item.adjustment_amount
            };
          });
        
        formToSubmit.id = id;
    
        const response = await useMyFetch().post(
          '/v1/invoice-adjustments/update-invoice-adjustment',
          formToSubmit
        )
        this.form = JSON.parse(
          JSON.stringify(useInitials.formInvoiceAdjustmentCreateEdit)
        )
    
        this.form.id = id
        await this.show()
    
        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
    
        navigateTo(`/invoices/invoice-adjustments`)
    
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
          '/v1/invoice-adjustments/delete-invoice-adjustment',
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
          '/v1/invoice-adjustments/restore-invoice-adjustment',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Restore Data', error.response.data)
        useAlert.alertError(error.response.data.message)
      }
    },

    async searchInvoices() {
      if (this.loading.searchInvoicesLoading) return
      this.loading.searchInvoicesLoading = true
    
      try {
        const response = await useMyFetch().post(
          '/v1/invoice-adjustments/search-invoices',
          this.queryModal.qIndexInvoices
        )
    
        this.metaModal.indexInvoices = response.data
        
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Invoices Data', error.response?.data)
      } finally {
        this.loading.searchInvoicesLoading = false
      }
    },

    validateSearchReference() {
      let isValid = true;

      this.errors = {};

      if (!this.form.customer_id && !this.queryModal.qIndexInvoices.customer_id) {
        this.errors.customer_id = 'Customer is required';
        isValid = false;
      }
      
      if (!this.form.reference) {
        this.errors.reference = 'Reference type is required';
        isValid = false;
      }
      
      if (!this.form.ref_start_date) {
        this.errors.ref_start_date = 'Start date is required';
        isValid = false;
      }
      
      if (!this.form.ref_end_date) {
        this.errors.ref_end_date = 'End date is required';
        isValid = false;
      }
      
      return isValid;
    },

    // async searchReferenceInvoices() {
    //   if (!this.validateSearchReference()) {
    //     return;
    //   }
    
    //   if (this.loading.searchInvoicesLoading) return
    //   this.loading.searchInvoicesLoading = true
    
    //   try {
    //     const response = await useMyFetch().post(
    //       '/v1/invoice-adjustments/index-reference-invoices',
    //       {
    //         ref_type: this.form.reference,
    //         ref_start_date: this.form.ref_start_date,
    //         ref_end_date: this.form.ref_end_date,
    //         customer_id: this.queryModal.qIndexInvoices.customer_id
    //       }
    //     )
    
    //     this.metaModal.indexInvoices = response.data

    //     if (response.data && response.data.data && response.data.data.length > 0) {
    //       const invoiceWithBank = response.data.data.find(invoice => invoice.bank_id !== null);
          
    //       if (invoiceWithBank) {
    //         this.form.bank_id = invoiceWithBank.bank_id;

    //         try {
    //           const bankResponse = await useMyFetch().post(
    //             '/v1/company-profiles/show-bank-information',
    //             { id: invoiceWithBank.bank_id }
    //           );
              
    //           if (bankResponse.data && bankResponse.data.data && bankResponse.data.data.length > 0) {
    //             const bankData = bankResponse.data.data[0];
    //             this.autocompleteBankInfo(bankData);
    //           }
    //         } catch (error) {
    //           console.log('Failed to fetch bank details', error);
    //         }

    //         this.form.remark = invoiceWithBank.remark || '';
    //       } else {
    //         this.form.bank_id = null;
    //         this.selectedBankDetails = {
    //           company_name: '',
    //           bank_name: '',
    //           account_number: '',
    //           account_name: ''
    //         };

    //         this.form.remark = response.data.data[0].remark || '';
    //       }
    //     }
        
    //     return response.data
    //   } catch (error: any) {
    //     console.log('Failed To Fetch Reference Invoices Data', error.response?.data)
    //     useAlert.alertError(error?.response?.data?.message || 'Failed to fetch reference invoices!')
    //   } finally {
    //     this.loading.searchInvoicesLoading = false
    //   }
    // },

    async searchReferenceInvoices() {
      if (!this.validateSearchReference()) {
        return;
      }
    
      if (this.loading.searchInvoicesLoading) return
      this.loading.searchInvoicesLoading = true
    
      try {
        const customer_id = this.form.customer_id || this.queryModal.qIndexInvoices.customer_id;
        const response = await useMyFetch().post(
          '/v1/invoice-adjustments/index-reference-invoices',
          {
            ref_type: this.form.reference,
            ref_start_date: this.form.ref_start_date,
            ref_end_date: this.form.ref_end_date,
            customer_id: customer_id
          }
        )

        const referenceData = response.data.data || [];

        if (this.form.id) {
          const existingInvoicesMap = new Map();
          this.itemsCheck.checkMain.forEach(item => {
            existingInvoicesMap.set(item.invoice_no, item);
          });

          referenceData.forEach(item => {
            if (!existingInvoicesMap.has(item.invoice_no)) {
              const newItem = convertInvoiceAdjustmentItemRef(item, item.ref_type);
              newItem.selected = false;
              this.itemsCheck.checkMain.push(newItem);
            }
          });

          this.itemsCheck.checkMain.sort((a, b) => {
            const dateA = new Date(a.invoice_date);
            const dateB = new Date(b.invoice_date);
            return dateA.getTime() - dateB.getTime();
          });
        } else {
          this.metaModal.indexInvoices = response.data;
        }
    
        if (response.data && response.data.data && response.data.data.length > 0) {
          const invoiceWithBank = response.data.data.find(invoice => invoice.bank_id !== null);
          
          if (invoiceWithBank) {
            this.form.bank_id = invoiceWithBank.bank_id;
    
            try {
              const bankResponse = await useMyFetch().post(
                '/v1/company-profiles/show-bank-information',
                { id: invoiceWithBank.bank_id }
              );
              
              if (bankResponse.data && bankResponse.data.data && bankResponse.data.data.length > 0) {
                const bankData = bankResponse.data.data[0];
                this.autocompleteBankInfo(bankData);
              }
            } catch (error) {
              console.log('Failed to fetch bank details', error);
            }
    
            this.form.remark = invoiceWithBank.remark || '';
          } else {
            this.form.bank_id = null;
            this.selectedBankDetails = {
              company_name: '',
              bank_name: '',
              account_number: '',
              account_name: ''
            };
    
            this.form.remark = response.data.data[0].remark || '';
          }
        }
        
        return response.data
      } catch (error: any) {
        console.log('Failed To Fetch Reference Invoices Data', error.response?.data)
        useAlert.alertError(error?.response?.data?.message || 'Failed to fetch reference invoices!')
      } finally {
        this.loading.searchInvoicesLoading = false
      }
    },

    calculateTotalsFromSearchResults() {
      if (!this.metaModal.indexInvoices.data || this.metaModal.indexInvoices.data.length === 0) {
        return;
      }
    
      const selectedItems = this.metaModal.indexInvoices.data.filter(item => item.selected);
      
      this.form.total_invoice = selectedItems.reduce(
        (acc, item) => acc + (item.invoice_amount || 0), 0
      );
      
      this.form.total_adjustment = selectedItems.reduce(
        (acc, item) => acc + (item.adjustment_amount || 0), 0
      );

      const calculatedBalance = this.form.total_invoice - this.form.total_adjustment;
      this.form.total_balance = calculatedBalance < 0 ? 0 : calculatedBalance;
      
      this.form.total_admin_bank = selectedItems.reduce(
        (acc, item) => acc + (item.admin_bank || 0), 0
      );

      selectedItems.forEach(item => {
        const calculatedAmount = (item.adjustment_amount || 0) - (item.admin_bank || 0);
        item.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
      });
    
      const calculatedGrandTotal = selectedItems.reduce(
        (acc, item) => acc + (item.total_amount || 0), 0
      );
      this.form.grand_total = calculatedGrandTotal < 0 ? 0 : calculatedGrandTotal;
    
      if (this.formLayout.summary) {
        this.formLayout.summary.total_invoice.value = this.form.total_invoice;
        this.formLayout.summary.total_adjustment.value = this.form.total_adjustment;
        this.formLayout.summary.total_balance.value = this.form.total_balance;
        this.formLayout.summary.total_admin_bank.value = this.form.total_admin_bank;
        this.formLayout.summary.grand_total.value = this.form.grand_total;
      }
    },

    addInvoiceToAdjustment(invoice: FormInvoiceAdjustmentDtInvoiceType) {
      // Check if invoice already exists in the list
      const existingIndex = this.itemsCheck.checkMain.findIndex(
        item => item.ref_id === invoice.ref_id && item.ref_type === invoice.ref_type
      );
      
      if (existingIndex === -1) {
        // Convert the invoice to InvoiceAdjustmentDtType
        const newItem = convertInvoiceAdjustmentItemRef(invoice, invoice.ref_type);
        
        this.itemsCheck.checkMain.push(newItem);
        this.calculateTotalAmount();
      }
    },

    handleClearQuery() {
      this.queryModal.qIndexInvoices = {
        page: 1,
        per_page: 10,
        invoice_ids: [],
        customer_ids: [],
        customer_id: null,
        order_column: '',
        order_direction: 'desc',
        invoice_no: '',
        global: '',
        ref_start_date: '',
        ref_end_date: ''
      }

      this.form.reference = null;
      this.form.ref_start_date = '';
      this.form.ref_end_date = '';
    },

    handleClearReferenceQuery() {
      this.form.reference = null;
      this.form.ref_start_date = '';
      this.form.ref_end_date = '';
      this.queryModal.qIndexInvoices.customer_id = null;
      this.queryModal.qIndexInvoices.customer_ids = [];
    },

    resetSummary() {
      if (this.formLayout?.summary) {
        this.formLayout.summary.total_invoice.value = 0
        this.formLayout.summary.total_adjustment.value = 0
        this.formLayout.summary.total_balance.value = 0
        this.formLayout.summary.total_admin_bank.value = 0
        this.formLayout.summary.grand_total.value = 0
      }
    },
    
    handleClickClear() {
      const currentInvoiceNo = this.form.invoice_no;
      const currentId = this.form.id;
      const isEditMode = !!currentId;

      this.form = cloneObject(useInitials.formInvoiceAdjustmentCreateEdit)

      if (isEditMode) {
        this.form.id = currentId;
        this.form.invoice_no = currentInvoiceNo;
      }
      
      this.itemsCheck.checkMain = []
      this.itemsCheck.checkInvoices = []
      this.errors = {}

      this.queryModal.qIndexInvoices.customer_id = null;
      this.queryModal.qIndexInvoices.customer_ids = [];

      this.resetSummary()
      this.handleClearReferenceQuery()
      this.clearReferences()
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
        this.queryModal.qIndexInvoices.customer_id = data.id;
        this.queryModal.qIndexInvoices.customer_ids = [data.id];
      }
    },

    autocompleteCurrency(data: FormCurrencyType) {
      this.form.exchange_rate = Number(data.num);
      this.currencySymbolLabel = data.symbol;

      this.calculateTotalAmount();
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

    onClickDeleteSelected(item: any, index: number) {
      this.itemsCheck.checkMain.splice(index, 1);
      this.calculateTotalAmount();
    },

    // calculateTotalAmount() {
    //   this.itemsCheck.checkMain.forEach((item: InvoiceAdjustmentDtType) => {
    //     const calculatedAmount = item.adjustment_amount - item.admin_bank;
    //     item.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
    //   });
    
    //   this.form.total_invoice = this.itemsCheck.checkMain.reduce(
    //     (acc: number, item: InvoiceAdjustmentDtType) => acc + item.invoice_amount,
    //     0
    //   );
    
    //   this.form.total_adjustment = this.itemsCheck.checkMain.reduce(
    //     (acc: number, item: InvoiceAdjustmentDtType) => acc + item.adjustment_amount,
    //     0
    //   );

    //   const calculatedBalance = this.form.total_invoice - this.form.total_adjustment;
    //   this.form.total_balance = calculatedBalance < 0 ? 0 : calculatedBalance;
    
    //   this.form.total_admin_bank = this.itemsCheck.checkMain.reduce(
    //     (acc: number, item: InvoiceAdjustmentDtType) => acc + item.admin_bank,
    //     0
    //   );

    //   const calculatedGrandTotal = this.itemsCheck.checkMain.reduce(
    //     (acc: number, item: InvoiceAdjustmentDtType) => acc + item.total_amount,
    //     0
    //   );
    //   this.form.grand_total = calculatedGrandTotal < 0 ? 0 : calculatedGrandTotal;
    
    //   if (this.formLayout.summary) {
    //     this.formLayout.summary.total_invoice.value = this.form.total_invoice;
    //     this.formLayout.summary.total_adjustment.value = this.form.total_adjustment;
    //     this.formLayout.summary.total_balance.value = this.form.total_balance;
    //     this.formLayout.summary.total_admin_bank.value = this.form.total_admin_bank;
    //     this.formLayout.summary.grand_total.value = this.form.grand_total;
    //   }
    
    //   return {
    //     summary: {
    //       total_invoice: this.form.total_invoice,
    //       total_adjustment: this.form.total_adjustment,
    //       total_balance: this.form.total_balance,
    //       total_admin_bank: this.form.total_admin_bank,
    //       grand_total: this.form.grand_total,
    //     },
    //   };
    // },

    calculateTotalAmount() {
      const selectedItems = this.itemsCheck.checkMain.filter(item => item.selected);
      
      selectedItems.forEach((item: InvoiceAdjustmentDtType) => {
        const calculatedAmount = item.adjustment_amount - item.admin_bank;
        item.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
      });
 
      this.form.total_invoice = selectedItems.reduce(
        (acc: number, item: InvoiceAdjustmentDtType) => acc + item.invoice_amount,
        0
      );
    
      this.form.total_adjustment = selectedItems.reduce(
        (acc: number, item: InvoiceAdjustmentDtType) => acc + item.adjustment_amount,
        0
      );
    
      const calculatedBalance = this.form.total_invoice - this.form.total_adjustment;
      this.form.total_balance = calculatedBalance < 0 ? 0 : calculatedBalance;
    
      this.form.total_admin_bank = selectedItems.reduce(
        (acc: number, item: InvoiceAdjustmentDtType) => acc + item.admin_bank,
        0
      );
    
      const calculatedGrandTotal = selectedItems.reduce(
        (acc: number, item: InvoiceAdjustmentDtType) => acc + item.total_amount,
        0
      );
      this.form.grand_total = calculatedGrandTotal < 0 ? 0 : calculatedGrandTotal;
    
      if (this.formLayout.summary) {
        this.formLayout.summary.total_invoice.value = this.form.total_invoice;
        this.formLayout.summary.total_adjustment.value = this.form.total_adjustment;
        this.formLayout.summary.total_balance.value = this.form.total_balance;
        this.formLayout.summary.total_admin_bank.value = this.form.total_admin_bank;
        this.formLayout.summary.grand_total.value = this.form.grand_total;
      }
    
      return {
        summary: {
          total_invoice: this.form.total_invoice,
          total_adjustment: this.form.total_adjustment,
          total_balance: this.form.total_balance,
          total_admin_bank: this.form.total_admin_bank,
          grand_total: this.form.grand_total,
        },
      };
    },    

    updateAdjustmentAmount(item: InvoiceAdjustmentDtType, value: number) {
      item.adjustment_amount = value;

      if (item.adjustment_amount > item.balance_amount) {
        item.adjustment_amount = item.balance_amount;
      }
      
      this.calculateTotalAmount();
    },
    
    updateAdminBankAmount(item: InvoiceAdjustmentDtType, value: number) {
      item.admin_bank = value;
      this.calculateTotalAmount();
    },

    async fetchDataServerFetch(options: { [key: string]: any }) {
      this.queryModal.qIndexInvoices.page = options.page;
      this.queryModal.qIndexInvoices.per_page = options.itemsPerPage;
  
      if (options.sortBy && options.sortBy.length > 0) {
        this.queryModal.qIndexInvoices.order_column = options.sortBy[0].key;
        this.queryModal.qIndexInvoices.order_direction = options.sortBy[0].order;
      } else {
        this.queryModal.qIndexInvoices.order_column = "";
        this.queryModal.qIndexInvoices.order_direction = "desc";
      }
  
      await this.searchInvoices();
    },

    validateForm() {
      let isValid = true;
      this.errors = {};

      if (!this.form.customer_id) {
        this.errors.customer_id = 'Customer is required';
        isValid = false;
      }
      
      if (!this.form.currency_id) {
        this.errors.currency_id = 'Currency is required';
        isValid = false;
      }
      
      if (!this.form.payment_date) {
        this.errors.payment_date = 'Payment date is required';
        isValid = false;
      }
      
      if (!this.form.payment_amount || this.form.payment_amount <= 0) {
        this.errors.payment_amount = 'Payment amount must be greater than 0';
        isValid = false;
      }

      if (this.form.ref_start_date && !this.form.ref_end_date) {
        this.errors.ref_end_date = 'End date is required when start date is provided';
        isValid = false;
      }
      
      if (!this.form.ref_start_date && this.form.ref_end_date) {
        this.errors.ref_start_date = 'Start date is required when end date is provided';
        isValid = false;
      }

      if (!this.itemsCheck.checkMain.length) {
        this.errors.adjustment_dts = 'At least one invoice must be added';
        isValid = false;
      }

      const hasNonZeroAdjustment = this.itemsCheck.checkMain.some(item => item.adjustment_amount > 0);
      if (!hasNonZeroAdjustment) {
        useAlert.alertError('Please calculate adjustment amounts first using "Adjusted Amount Auto Calculate" or "Auto Calculate Selection"');
        isValid = false;
      }
      
      return isValid;
    },

    goToInvoiceAdjustment(id: number) {
      navigateTo(`/invoices/invoice-adjustments/edit/${id}`);
    },

    updateDateRange() {
      if (this.queryModal.qIndexInvoices.ref_start_date && this.queryModal.qIndexInvoices.ref_end_date) {
        this.searchInvoices();
      }
    },

    canAddInvoice(invoice: FormInvoiceAdjustmentDtInvoiceType): boolean {
      const exists = this.itemsCheck.checkMain.some(
        item => item.ref_id === invoice.ref_id && item.ref_type === invoice.ref_type
      );
      
      const hasBalance = invoice.balance_amount > 0;
      
      return !exists && hasBalance;
    },

    filterInvoicesByDateRange(startDate: string, endDate: string) {
      this.queryModal.qIndexInvoices.ref_start_date = startDate;
      this.queryModal.qIndexInvoices.ref_end_date = endDate;
      this.searchInvoices();
    },

    autoCalculateAdjustments() {
      if (this.itemsCheck.checkMain.length === 0 || this.form.payment_amount <= 0) {
        return;
      }

      let remainingAmount = this.form.payment_amount;
      let totalAdminBank = 0;

      this.itemsCheck.checkMain.forEach(item => {

        const adminBankPercentage = 0.01; // 1%
        item.admin_bank = Math.min(item.balance_amount * adminBankPercentage, remainingAmount);
        totalAdminBank += item.admin_bank;
        remainingAmount -= item.admin_bank;
      });

      remainingAmount = this.form.payment_amount - totalAdminBank;
      
      if (remainingAmount <= 0) {
        this.itemsCheck.checkMain.forEach(item => {
          item.adjustment_amount = 0;
        });
      } else {
        const totalBalance = this.itemsCheck.checkMain.reduce(
          (sum, item) => sum + item.balance_amount, 0
        );

        this.itemsCheck.checkMain.forEach(item => {
          const proportion = item.balance_amount / totalBalance;
          item.adjustment_amount = Math.min(
            Math.round((remainingAmount * proportion) * 1000) / 1000,
            item.balance_amount
          );
        });
      }

      this.calculateTotalAmount();
    },

    // autoCalculateSelection() {
    //   if (!this.form.payment_amount || this.form.payment_amount <= 0) {
    //     useAlert.alertError('Please enter a valid payment amount first');
    //     return;
    //   }
    
    //   const selectedItems = this.metaModal.indexInvoices.data.filter(item => item.selected);
      
    //   if (selectedItems.length === 0) {
    //     useAlert.alertError('No invoices selected for adjustment');
    //     return;
    //   }

    //   this.metaModal.indexInvoices.data.forEach(item => {
    //     if (!item.selected) {
    //       item.adjustment_amount = 0;
    //       item.total_amount = 0;
    //     }
    //   });

    //   const sortedSelectedItems = selectedItems.sort((a, b) => {
    //     const indexA = this.metaModal.indexInvoices.data.findIndex(item => 
    //       item.invoice_uuid === a.invoice_uuid && item.ref_type === a.ref_type);
    //     const indexB = this.metaModal.indexInvoices.data.findIndex(item => 
    //       item.invoice_uuid === b.invoice_uuid && item.ref_type === b.ref_type);
    //     return indexA - indexB;
    //   });
    
    //   let remainingAmount = this.form.payment_amount;
    //   sortedSelectedItems.forEach(item => {
    //     if (remainingAmount <= 0) {
    //       item.adjustment_amount = 0;
    //     } else if (remainingAmount >= item.balance_amount) {
    //       item.adjustment_amount = item.balance_amount;
    //       remainingAmount -= item.balance_amount;
    //     } else {
    //       item.adjustment_amount = remainingAmount;
    //       remainingAmount = 0;
    //     }

    //     const calculatedAmount = (item.adjustment_amount || 0) - (item.admin_bank || 0);
    //     item.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
    //   });
    
    //   this.calculateTotalsFromSearchResults();
    // },

    autoCalculateSelection() {
      if (!this.form.payment_amount || this.form.payment_amount <= 0) {
        useAlert.alertError('Please enter a valid payment amount first');
        return;
      }

      if (this.form.id && this.itemsCheck.checkMain.length > 0) {
        const adminBankValues = new Map();
        this.itemsCheck.checkMain.forEach(item => {
          adminBankValues.set(`${item.ref_type}-${item.ref_id}`, item.admin_bank);
        });

        this.itemsCheck.checkMain.forEach(item => {
          if (!item.selected) {
            item.adjustment_amount = 0;
            item.total_amount = 0;
          }
        });

        const selectedItems = this.itemsCheck.checkMain.filter(item => item.selected);
        
        if (selectedItems.length === 0) {
          useAlert.alertError('No invoices selected for adjustment');
          return;
        }

        const sortedSelectedItems = [...selectedItems].sort((a, b) => {
          const dateA = new Date(a.invoice_date);
          const dateB = new Date(b.invoice_date);
          return dateA.getTime() - dateB.getTime();
        });

        sortedSelectedItems.forEach(item => {
          item.adjustment_amount = 0;
          item.total_amount = 0;
        });
        
        let remainingAmount = this.form.payment_amount;

        for (let i = 0; i < sortedSelectedItems.length; i++) {
          const item = sortedSelectedItems[i];
          
          if (remainingAmount <= 0) break;

          const maxAdjustment = item.balance_amount + item.total_adjustment;
          
          if (maxAdjustment <= 0) continue;
          
          if (remainingAmount >= maxAdjustment) {
            item.adjustment_amount = maxAdjustment;
            remainingAmount -= maxAdjustment;
          } else {
            item.adjustment_amount = remainingAmount;
            remainingAmount = 0;
          }

          const key = `${item.ref_type}-${item.ref_id}`;
          if (adminBankValues.has(key)) {
            item.admin_bank = adminBankValues.get(key);
          }

          const calculatedAmount = item.adjustment_amount - item.admin_bank;
          item.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
        }
        
        this.calculateTotalAmount();
      } 
      else if (!this.metaModal.indexInvoices.data || this.metaModal.indexInvoices.data.length === 0) {
        useAlert.alertError('No invoices available for adjustment');
        return;
      } 
      else {
        const selectedItems = this.metaModal.indexInvoices.data.filter(item => item.selected);
        
        if (selectedItems.length === 0) {
          useAlert.alertError('No invoices selected for adjustment');
          return;
        }

        const adminBankValues = new Map();
        this.metaModal.indexInvoices.data.forEach(item => {
          if (item.admin_bank) {
            adminBankValues.set(`${item.ref_type}-${item.ref_id}`, item.admin_bank);
          }
        });

        this.metaModal.indexInvoices.data.forEach(item => {
          if (!item.selected) {
            item.adjustment_amount = 0;
            item.total_amount = 0;
          }
        });

        const sortedSelectedItems = [...selectedItems].sort((a, b) => {
          const dateA = new Date(a.invoice_date);
          const dateB = new Date(b.invoice_date);
          return dateA.getTime() - dateB.getTime();
        });

        sortedSelectedItems.forEach(item => {
          item.adjustment_amount = 0;
          item.total_amount = 0;
        });
        
        let remainingAmount = this.form.payment_amount;

        for (let i = 0; i < sortedSelectedItems.length; i++) {
          const item = sortedSelectedItems[i];
          
          if (remainingAmount <= 0) break;
          
          if (remainingAmount >= item.balance_amount) {
            item.adjustment_amount = item.balance_amount;
            remainingAmount -= item.balance_amount;
          } else {
            item.adjustment_amount = remainingAmount;
            remainingAmount = 0;
          }

          const key = `${item.ref_type}-${item.ref_id}`;
          if (adminBankValues.has(key)) {
            item.admin_bank = adminBankValues.get(key);
          }

          const calculatedAmount = (item.adjustment_amount || 0) - (item.admin_bank || 0);
          item.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
        }
        
        this.calculateTotalsFromSearchResults();
      }
    },    

    clearReferences() {
      this.metaModal.indexInvoices.data = [];
      this.itemsCheck.checkMain = [];
      
      this.form.total_invoice = 0;
      this.form.total_adjustment = 0;
      this.form.total_balance = 0;
      this.form.total_admin_bank = 0;
      this.form.grand_total = 0;

      if (this.formLayout.summary) {
        this.formLayout.summary.total_invoice.value = 0;
        this.formLayout.summary.total_adjustment.value = 0;
        this.formLayout.summary.total_balance.value = 0;
        this.formLayout.summary.total_admin_bank.value = 0;
        this.formLayout.summary.grand_total.value = 0;
      }
    },

    // autoAdjustedAmountCalculate() {
    //   if (!this.form.payment_amount || this.form.payment_amount <= 0) {
    //     useAlert.alertError('Please enter a valid payment amount first');
    //     return;
    //   }
      
    //   if (!this.metaModal.indexInvoices.data || this.metaModal.indexInvoices.data.length === 0) {
    //     useAlert.alertError('No invoices available for adjustment');
    //     return;
    //   }

    //   const adminBankValues = new Map();
    //   this.metaModal.indexInvoices.data.forEach(item => {
    //     if (item.admin_bank) {
    //       adminBankValues.set(`${item.ref_type}-${item.ref_id}`, item.admin_bank);
    //     }
    //   });
    
    //   this.metaModal.indexInvoices.data.forEach(item => {
    //     item.selected = false;
    //     item.adjustment_amount = 0;
    //     item.total_amount = 0;
    //   });
    
    //   const { updatedInvoices } = autoCalculateAdjustments(
    //     this.metaModal.indexInvoices.data,
    //     this.form.payment_amount
    //   );

    //   updatedInvoices.forEach(invoice => {
    //     const key = `${invoice.ref_type}-${invoice.ref_id}`;
    //     if (adminBankValues.has(key)) {
    //       invoice.admin_bank = adminBankValues.get(key);
    //     }
    //   });
    
    //   this.metaModal.indexInvoices.data = updatedInvoices;
    
    //   this.itemsCheck.checkMain = [];
    
    //   updatedInvoices.forEach(invoice => {
    //     if (invoice.selected) {
    //       const adjustmentItem = convertInvoiceAdjustmentItemRef(invoice, invoice.ref_type);
    //       adjustmentItem.adjustment_amount = invoice.adjustment_amount || 0;
    //       adjustmentItem.admin_bank = invoice.admin_bank || 0;
    //       this.itemsCheck.checkMain.push(adjustmentItem);
    //     }
    //   });
    
    //   this.calculateTotalsFromSearchResults();
    // },   

    autoAdjustedAmountCalculate() {
      if (!this.form.payment_amount || this.form.payment_amount <= 0) {
        useAlert.alertError('Please enter a valid payment amount first');
        return;
      }

      if (this.form.id && this.itemsCheck.checkMain.length > 0) {
        const adminBankValues = new Map();
        this.itemsCheck.checkMain.forEach(item => {
          adminBankValues.set(`${item.ref_type}-${item.ref_id}`, item.admin_bank);
        });
        
        const sortedItems = [...this.itemsCheck.checkMain].sort((a, b) => {
          const dateA = new Date(a.invoice_date);
          const dateB = new Date(b.invoice_date);
          return dateA.getTime() - dateB.getTime();
        });
        
        sortedItems.forEach(item => {
          item.selected = false;
          const maxAdjustment = item.balance_amount + item.total_adjustment;
          item.adjustment_amount = 0;
          item.total_amount = 0;
        });
        
        let remainingAmount = this.form.payment_amount;
        
        for (let i = 0; i < sortedItems.length; i++) {
          const item = sortedItems[i];
          
          if (remainingAmount <= 0) break;
          
          const maxAdjustment = item.balance_amount + item.total_adjustment;
          
          if (maxAdjustment <= 0) continue;
          
          item.selected = true;
          
          if (remainingAmount >= maxAdjustment) {
            item.adjustment_amount = maxAdjustment;
            remainingAmount -= maxAdjustment;
          } else {
            item.adjustment_amount = remainingAmount;
            remainingAmount = 0;
          }
          
          const key = `${item.ref_type}-${item.ref_id}`;
          if (adminBankValues.has(key)) {
            item.admin_bank = adminBankValues.get(key);
          }
          
          const calculatedAmount = item.adjustment_amount - item.admin_bank;
          item.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
        }
        
        this.calculateTotalAmount();
      } 
      else if (!this.metaModal.indexInvoices.data || this.metaModal.indexInvoices.data.length === 0) {
        useAlert.alertError('No invoices available for adjustment');
        return;
      } 
      else {
        const adminBankValues = new Map();
        this.metaModal.indexInvoices.data.forEach(item => {
          if (item.admin_bank) {
            adminBankValues.set(`${item.ref_type}-${item.ref_id}`, item.admin_bank);
          }
        });
      
        this.metaModal.indexInvoices.data.forEach(item => {
          item.selected = false;
          item.adjustment_amount = 0;
          item.total_amount = 0;
        });
      
        const { updatedInvoices } = autoCalculateAdjustments(
          this.metaModal.indexInvoices.data,
          this.form.payment_amount
        );
    
        updatedInvoices.forEach(invoice => {
          const key = `${invoice.ref_type}-${invoice.ref_id}`;
          if (adminBankValues.has(key)) {
            invoice.admin_bank = adminBankValues.get(key);
          }
        });
      
        this.metaModal.indexInvoices.data = updatedInvoices;

        this.itemsCheck.checkMain = [];
        
        updatedInvoices.forEach(invoice => {
          if (invoice.selected) {
            const adjustmentItem = convertInvoiceAdjustmentItemRef(invoice, invoice.ref_type);
            adjustmentItem.adjustment_amount = invoice.adjustment_amount || 0;
            adjustmentItem.admin_bank = invoice.admin_bank || 0;
            this.itemsCheck.checkMain.push(adjustmentItem);
          }
        });
      
        this.calculateTotalsFromSearchResults();
      }
    },    
    
    transferSelectedInvoicesToCheckMain() {
      if (!this.metaModal.indexInvoices.data || this.metaModal.indexInvoices.data.length === 0) {
        return;
      }
      
      const selectedInvoices = this.metaModal.indexInvoices.data.filter(item => item.selected);
      
      if (selectedInvoices.length === 0) {
        return;
      }

      this.itemsCheck.checkMain = [];
      
      selectedInvoices.forEach(invoice => {
        const adjustmentItem = convertInvoiceAdjustmentItemRef(invoice, invoice.ref_type);
        adjustmentItem.adjustment_amount = invoice.adjustment_amount || 0;
        adjustmentItem.admin_bank = invoice.admin_bank || 0;
        
        const calculatedAmount = adjustmentItem.adjustment_amount - adjustmentItem.admin_bank;
        adjustmentItem.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
        
        this.itemsCheck.checkMain.push(adjustmentItem);
      });
      
      this.calculateTotalAmount();
    }

  },
  persist: [
    {
      paths: ['queryModal'],
      storage: localStorage
    }
  ]
})

function cloneObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export default useInvoiceAdjustmentStore

