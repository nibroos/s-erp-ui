import type { ProductBomListType } from "~/types/masters/ProductType"
import type { FormInvoiceDpDtProductListType, FormInvoiceDpDtRefType, InvoiceDpDtBomType, InvoiceDpDtType, InvoiceDpRefType } from "~/types/invoice-dps/InvoiceDpType"

export const convertInvoiceDpItemRefProduct = (
  item: FormInvoiceDpDtProductListType,
  refType: InvoiceDpRefType
): InvoiceDpDtType => {
  let productUuid = randomId()

  let productId = item.product_id ?? item.ref_id

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
    product_type: item.product_type || 'item',
    remark: item.remark,
    dp_percentage: item.dp_percentage,
    is_vat: item.is_vat || 0,
    is_pph23: item.is_pph23 || 0,
    qty: item.qty || 1,
    price: item.price || 0,
    subtotal: item.subtotal || 0,
    discount_amount: item.discount_amount || 0,
    discount_percentage: item.discount_percentage || 0,
    discount_percentage_num: item.discount_percentage_num || 0,
    discount_percentage_amount: item.discount_percentage_amount || 0,
    discount_final: item.discount_final || 0,
    discount_type: item.discount_type || null,
    total_amount: item.total_amount || 0,
    total_dp: item.total_dp || 0,
    
    item_name: item.name ?? item.item_name ?? item.product_name,
    item_code: item.code ?? item.item_code ?? item.product_code,
    product_name: item.name ?? item.item_name ?? item.product_name,
    product_code: item.code ?? item.item_code ?? item.product_code,
    unit_name: item.unit_name,
    
    invoice_dp_dt_boms: item.invoice_dp_dt_boms || []
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
