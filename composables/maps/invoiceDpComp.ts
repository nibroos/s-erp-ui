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
    ref_id: item.ref_id as number,
    ref_dt_id: item.ref_dt_id as number,
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
  let newRefItems: InvoiceDpDtType[]
  let updatedList: InvoiceDpDtType[] = []

  let selectedRefList = {
    so: [] as InvoiceDpDtType[],
  }

  selectedRefList.so = checkMain.filter((item: InvoiceDpDtType) => {
    return item.ref_type == 'so'
  })

  newRefItems = checkSelected.map((dt: FormInvoiceDpDtRefType): InvoiceDpDtType => {
    if (dt.item_type === 'product') {
      dt.product_type = 'product';
    } else {
      dt.product_type = 'item';
    }
    
    return convertInvoiceDpItemRefProduct(dt, checkOpened)
  })
  
  if (checkOpened == 'so') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened]]
  }

  return updatedList
}

export function updateInvoiceDpRefsModalFromMain(
  checkMain: InvoiceDpDtType[],
  checkOpened: InvoiceDpRefType,
  checkProducts: FormInvoiceDpDtProductListType[]
): any[] {
  let updatedList: any[] = []

  let selectedRefList: InvoiceDpDtType[]

  selectedRefList = checkMain.filter((itemMain: InvoiceDpDtType) => {
    return (itemMain.ref_type == checkOpened)
  })

  if (checkProducts.length > 0) {
    selectedRefList.forEach((mainItem: InvoiceDpDtType) => {
      checkProducts.forEach((prodItem: FormInvoiceDpDtProductListType) => {
        if (
          (mainItem.ref_type == 'so' && mainItem.ref_id == prodItem.ref_id && mainItem.ref_dt_id == prodItem.ref_dt_id)
        ) {
          let combined: any = {
            ...prodItem,
            ...mainItem,
          }

          combined = convertInvoiceDpItemRefProduct(combined, checkOpened)

          updatedList.push(combined)
        }
      })
    })
  } else {
    updatedList = selectedRefList
  }

  return updatedList
}

export function initCheckedInvoiceDpDt(
  checkMain: InvoiceDpDtType[],
): InvoiceDpDtType[] {
  let updatedList: InvoiceDpDtType[] = []

  checkMain.forEach((mainItem: InvoiceDpDtType, iMainItem: number) => {
    updatedList[iMainItem] = {
      ...mainItem,
      uid: randomId(),
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
