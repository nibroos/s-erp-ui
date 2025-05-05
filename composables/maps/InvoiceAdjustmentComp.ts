import type { 
  FormInvoiceAdjustmentDtInvoiceType, 
  InvoiceAdjustmentDtType, 
  InvoiceAdjustmentRefType 
} from "~/types/invoice-adjustments/InvoiceAdjustmentType"

export const convertInvoiceAdjustmentItemRef = (
  item: FormInvoiceAdjustmentDtInvoiceType,
  refType: InvoiceAdjustmentRefType
): InvoiceAdjustmentDtType => {
  const uid = randomId();
  
  const adjustmentAmount = item.adjustment_amount || 0;
  const adminBank = item.admin_bank || 0;
  const calculatedAmount = adjustmentAmount - adminBank;
  const totalAmount = calculatedAmount < 0 ? 0 : calculatedAmount;

  const data: InvoiceAdjustmentDtType = {
    uid,
    invoice_uuid: uid,
    ref_id: item.ref_id,
    ref_type: refType,
    invoice_no: item.invoice_no,
    invoice_date: item.invoice_date,
    invoice_amount: item.invoice_amount,
    total_adjustment: item.total_adjustment || 0,
    balance_amount: item.balance_amount,
    adjustment_amount: adjustmentAmount,
    admin_bank: adminBank,
    total_amount: totalAmount
  };

  return data;
};

export function generateInvoiceAdjustmentDt(
  selectedInvoices: FormInvoiceAdjustmentDtInvoiceType[],
  currentItems: InvoiceAdjustmentDtType[]
): InvoiceAdjustmentDtType[] {
  let newItems: InvoiceAdjustmentDtType[] = [];

  selectedInvoices.forEach((invoice: FormInvoiceAdjustmentDtInvoiceType) => {
    const existingItem = currentItems.find(item => 
      item.ref_type === invoice.ref_type && 
      item.ref_id === invoice.ref_id
    );
    
    if (existingItem) {
      // If it exists, keep the existing item
      newItems.push(existingItem);
    } else {
      // If it doesn't exist, convert and add the new item
      newItems.push(convertInvoiceAdjustmentItemRef(invoice, invoice.ref_type));
    }
  });

  return newItems;
}

export function updateInvoiceAdjustmentRefsFromMain(
  currentItems: InvoiceAdjustmentDtType[],
  availableInvoices: FormInvoiceAdjustmentDtInvoiceType[]
): FormInvoiceAdjustmentDtInvoiceType[] {
  let updatedList: FormInvoiceAdjustmentDtInvoiceType[] = [];

  if (availableInvoices.length > 0) {
    currentItems.forEach((mainItem: InvoiceAdjustmentDtType) => {
      let found = false;
      
      availableInvoices.forEach((invoice: FormInvoiceAdjustmentDtInvoiceType) => {
        if (mainItem.ref_id === invoice.ref_id && mainItem.ref_type === invoice.ref_type) {
          found = true;
          
          // Combine the properties from both objects
          const combined: FormInvoiceAdjustmentDtInvoiceType = {
            ...invoice,
            ...mainItem,
            ref_type: mainItem.ref_type,
            ref_id: mainItem.ref_id
          };

          updatedList.push(combined);
        }
      });
      
      if (!found) {
        // If the item is not found in available invoices, convert it to FormInvoiceAdjustmentDtInvoiceType
        updatedList.push({
          id: mainItem.id,
          invoice_uuid: mainItem.invoice_uuid,
          invoice_adjustment_id: mainItem.invoice_adjustment_id,
          ref_id: mainItem.ref_id,
          ref_type: mainItem.ref_type,
          invoice_no: mainItem.invoice_no,
          invoice_date: mainItem.invoice_date,
          invoice_amount: mainItem.invoice_amount,
          total_adjustment: mainItem.total_adjustment,
          balance_amount: mainItem.balance_amount,
          adjustment_amount: mainItem.adjustment_amount,
          admin_bank: mainItem.admin_bank,
          total_amount: mainItem.total_amount
        });
      }
    });
  } else {
    // If no available invoices, convert all current items
    updatedList = currentItems.map(item => ({
      id: item.id,
      invoice_uuid: item.invoice_uuid,
      invoice_adjustment_id: item.invoice_adjustment_id,
      ref_id: item.ref_id,
      ref_type: item.ref_type,
      invoice_no: item.invoice_no,
      invoice_date: item.invoice_date,
      invoice_amount: item.invoice_amount,
      total_adjustment: item.total_adjustment,
      balance_amount: item.balance_amount,
      adjustment_amount: item.adjustment_amount,
      admin_bank: item.admin_bank,
      total_amount: item.total_amount
    }));
  }

  return updatedList;
}

export function initCheckedInvoiceAdjustmentDt(
  currentItems: InvoiceAdjustmentDtType[],
): InvoiceAdjustmentDtType[] {
  return currentItems.map((item: InvoiceAdjustmentDtType, index: number) => {
    return {
      ...item,
      uid: item.uid || randomId()
    };
  });
}

function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function autoCalculateAdjustments(
  invoices: FormInvoiceAdjustmentDtInvoiceType[],
  paymentAmount: number
): { 
  selectedInvoices: FormInvoiceAdjustmentDtInvoiceType[],
  updatedInvoices: FormInvoiceAdjustmentDtInvoiceType[]
} {
  if (!invoices || invoices.length === 0 || paymentAmount <= 0) {
    return { selectedInvoices: [], updatedInvoices: [] };
  }

  const updatedInvoices = JSON.parse(JSON.stringify(invoices));
  const selectedInvoices: FormInvoiceAdjustmentDtInvoiceType[] = [];
  
  let remainingAmount = paymentAmount;

  updatedInvoices.forEach((invoice: FormInvoiceAdjustmentDtInvoiceType) => {
    invoice.selected = false;
    invoice.adjustment_amount = 0;
    invoice.admin_bank = 0;
    invoice.total_amount = 0;
  });

  for (let i = 0; i < updatedInvoices.length; i++) {
    const invoice = updatedInvoices[i];

    if (invoice.balance_amount <= 0) {
      continue;
    }

    if (remainingAmount >= invoice.balance_amount) {
      invoice.selected = true;
      invoice.adjustment_amount = invoice.balance_amount;
      remainingAmount -= invoice.balance_amount;
      selectedInvoices.push(invoice);
    } 
    else if (remainingAmount > 0) {
      invoice.selected = true;
      invoice.adjustment_amount = remainingAmount;
      remainingAmount = 0;
      selectedInvoices.push(invoice);
    } 
    else {
      invoice.selected = false;
      invoice.adjustment_amount = 0;
    }

    const calculatedAmount = (invoice.adjustment_amount || 0) - (invoice.admin_bank || 0);
    invoice.total_amount = calculatedAmount < 0 ? 0 : calculatedAmount;
   
    if (remainingAmount <= 0) {
      break;
    }
  }
  
  return { selectedInvoices, updatedInvoices };
}
