import type { ProductBomListType } from "~/types/masters/ProductType"
import type { FormInvoiceDpDtProductListType, FormInvoiceDpDtRefType, InvoiceDpDtBomType, InvoiceDpDtType, InvoiceDpRefType } from "~/types/invoice-dps/InvoiceDpType"

export const convertInvoiceDpItemRefProduct = (
  item: FormInvoiceDpDtProductListType,
  refType: InvoiceDpRefType
): InvoiceDpDtType => {
  let productUuid = randomId()
  let productId = item.product_id ?? item.ref_id

  const price = item.price_sell || 0;
  const qty = item.qty || 1;
  const subtotal = price * qty;

  const discount = item.disc_am || item.disc_perc_am || 0;
  
  let totalAmount = subtotal - discount;
  
  const dpPercentage = item.dp_percentage || 0;
  const totalDp = totalAmount * (dpPercentage / 100);

  const productType = item.product_type || (item.item_type === 'product' ? 'product' : 'item');

  let bomItems: InvoiceDpDtBomType[] = [];
  if (item.so_dts_boms && item.so_dts_boms.length > 0) {
    bomItems = item.so_dts_boms.map((bomItem: any): InvoiceDpDtBomType => {
      return {
        uid: randomId(),
        product_uuid: randomId(),
        product_id: bomItem.product_id || bomItem.item_id,
        item_id: bomItem.item_id,
        item_unit_id: bomItem.item_unit_id,
        item_sub_group_id: bomItem.item_sub_group_id,
        item_group_id: bomItem.item_group_id,
        item_sub_group_name: bomItem.item_sub_group_name,
        item_group_name: bomItem.item_group_name,
        gen_code: bomItem.gen_code,
        remark: bomItem.remark,
        qty: bomItem.qty,
        price_sell: bomItem.price_sell || 0,
        price_buy: bomItem.price_buy || 0,
        subtotal_sell: bomItem.subtotal_sell || 0,
        subtotal_buy: bomItem.subtotal_buy || 0,
        item_name: bomItem.item_name || bomItem.name,
        item_code: bomItem.item_code || bomItem.code,
        item_barcode: bomItem.item_barcode,
        item_sku: bomItem.item_sku,
        item_factory_code: bomItem.item_factory_code,
        item_specification: bomItem.item_specification,
        item_qty_stock: bomItem.item_qty_stock,
        unit_name: bomItem.unit_name
      };
    });
  }

  const data: InvoiceDpDtType = {
    uid: randomId(),
    id: item.invoice_dp_id ?? null,
    invoice_dp_id: item.invoice_dp_id,
    item_unit_id: item.item_unit_id,
    vat_id: item.vat_id,
    pph23_id: item.pph23_id,
    ref_id: item.sales_order_id as number,
    ref_dt_id: item.id as number,
    product_id: productId as number,
    product_uuid: productUuid,
    ref_type: refType,
    product_type: productType,
    item_type: item.item_type,
    remark: item.remark,
    dp_percentage: dpPercentage,
    is_vat: item.is_vat || 0,
    is_pph23: item.is_pph23 || 0,
    qty: qty,
    price: price,
    subtotal: subtotal,
    discount: discount,
    total_amount: totalAmount,
    total_dp: totalDp,
    
    item_name: item.name ?? item.item_name ?? item.product_name,
    item_code: item.code ?? item.item_code ?? item.product_code,
    product_name: item.name ?? item.item_name ?? item.product_name,
    product_code: item.code ?? item.item_code ?? item.product_code,
    unit_name: item.unit_name,
    
    ref_num: item.sales_order_no || '',
    
    invoice_dp_dt_boms: bomItems.length > 0 ? bomItems : (item.invoice_dp_dt_boms || []),
    
    so_dts_boms: item.so_dts_boms
  }

  return data
}

export function generateInvoiceDpDt(
  checkSelected: FormInvoiceDpDtRefType[],
  checkOpened: InvoiceDpRefType,
  checkMain: InvoiceDpDtType[],
): InvoiceDpDtType[] {
  let newRefItems: InvoiceDpDtType[] = []
  let updatedList: InvoiceDpDtType[] = []

  // Map item yang dipilih dari modal
  checkSelected.forEach((dt: FormInvoiceDpDtRefType) => {
    if (dt.item_type === 'product') {
      dt.product_type = 'product';
    } else {
      dt.product_type = 'item';
    }

    const existingItem = checkMain.find(item => 
      item.ref_type === checkOpened && 
      ((item.ref_id === (dt.sales_order_id || dt.ref_id) && 
      item.ref_dt_id === (dt.id || dt.ref_dt_id)) ||
      (item.ref_id === dt.ref_id && item.ref_dt_id === dt.ref_dt_id))
    );
    
    if (existingItem) {
      newRefItems.push({
        ...existingItem,
        ref_type: checkOpened,
        ref_id: dt.sales_order_id || dt.ref_id,
        ref_dt_id: dt.id || dt.ref_dt_id
      });
    } else {
      newRefItems.push(convertInvoiceDpItemRefProduct(dt, checkOpened));
    }
  });
  
  if (checkOpened === 'so') {
    updatedList = [...newRefItems];
  }

  return updatedList;
}

export function updateInvoiceDpRefsModalFromMain(
  checkMain: InvoiceDpDtType[],
  checkOpened: InvoiceDpRefType,
  checkProducts: FormInvoiceDpDtProductListType[]
): any[] {
  let updatedList: any[] = [];

  let selectedRefList: InvoiceDpDtType[] = checkMain.filter((itemMain: InvoiceDpDtType) => {
    return (itemMain.ref_type == checkOpened);
  });

  if (checkProducts.length > 0) {
    selectedRefList.forEach((mainItem: InvoiceDpDtType) => {
      let found = false;
      
      checkProducts.forEach((prodItem: FormInvoiceDpDtProductListType) => {
        if (
          (mainItem.ref_type == 'so' && 
           ((mainItem.ref_id == prodItem.sales_order_id && mainItem.ref_dt_id == prodItem.id) ||
           (mainItem.ref_id == prodItem.ref_id && mainItem.ref_dt_id == prodItem.ref_dt_id)))
        ) {
          found = true;
          
          let combined: any = {
            ...prodItem,
            ...mainItem,
            ref_type: mainItem.ref_type,
            ref_id: mainItem.ref_id,
            ref_dt_id: mainItem.ref_dt_id,
            sales_order_id: mainItem.ref_id,
            id: mainItem.ref_dt_id
          };

          updatedList.push(combined);
        }
      });
      
      if (!found) {
        updatedList.push(mainItem);
      }
    });
  } else {
    updatedList = selectedRefList;
  }

  return updatedList;
}

export function initCheckedInvoiceDpDt(
  checkMain: InvoiceDpDtType[],
): InvoiceDpDtType[] {
  let updatedList: InvoiceDpDtType[] = []

  checkMain.forEach((mainItem: InvoiceDpDtType, iMainItem: number) => {
    updatedList[iMainItem] = {
      ...mainItem,
      uid: randomId(),
      product_code: mainItem.item_code || mainItem.product_code,
      product_name: mainItem.item_name || mainItem.product_name,
      invoice_dp_dt_boms: mainItem.invoice_dp_dt_boms || mainItem.so_dts_boms || []
    }
  })

  return updatedList
}

function randomId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
