import type { FormPoDtProductListType, FormPoDtRefType, PoDtProductType, PoDtRefType, PoDtType } from "~/types/purchase-orders/PurchaseOrderType"

export function defineItemTypePurchaseOrder(
  item: FormPoDtProductListType
): PoDtProductType {
  if (item.product_type) {
    return item.product_type;
  }

  return (item.boms && item.boms.length > 0) ? 'product' : 'item'
}

export function convertPoItemRefProduct(
  item: FormPoDtProductListType,
  refType: PoDtRefType
): PoDtType {
  let productUuid = randomId()
  let productId = item.product_id ?? item.item_id ?? item.ref_id

  const productType = defineItemTypePurchaseOrder(item)

  const data: PoDtType = {
    ...item,
    uid: randomId(),
    id: item.po_dt_id ?? null,
    po_id: item.po_id,
    item_unit_id: item.item_unit_id,
    vat_id: item.vat_id,
    ref_so_dt_id: item.ref_so_dt_id,
    ref_so_dt_bom_id: item.ref_so_dt_bom_id,
    ref_product_id: item.ref_product_id ?? item.product_id,
    pph23_id: item.pph23_id,
    ref_id: item.ref_id as number,
    product_id: productId,
    bom_id: item.bom_id || null,
    product_type: productType,
    product_uuid: productUuid,
    ref_type: refType,
    remark: item.remark,
    need_qty: item.need_qty || 0,
    qty: item.qty || 1,
    price: (item.price || item.price_buy || 0) as number,
    subtotal: item.subtotal || 0,
    discount_amount: item.discount_amount || 0,
    discount_percentage: item.discount_percentage || 0,
    discount_percentage_num: item.discount_percentage_num || 0,
    discount_percentage_amount: item.discount_percentage_amount || 0,
    discount_final: item.discount_final || 0,
    discount_type: item.discount_type || null,
    is_vat: item.is_vat || 0,
    is_pph23: item.is_pph23 || 0,
    total_amount: item.total_amount || 0,

    item_name: item.item_name ?? item.name ?? item.product_name,
    item_code: item.item_code ?? item.code ?? item.product_code,
    product_name: item.item_name ?? item.name ?? item.product_name,
    product_code: item.item_code ?? item.code ?? item.product_code,
    unit_name: item.unit_name,
    expired_at: (item.expired_at as string)
  }

  return data
}

export function generatePoDt(
  data: FormPoDtRefType[],
  checkOpened: PoDtRefType,
  checkMain: PoDtType[],
): PoDtType[] {
  let newRefItems: PoDtType[]
  let updatedList: PoDtType[] = []

  let selectedRefList = {
    products: [] as PoDtType[],
    so: [] as PoDtType[],
    ro: [] as PoDtType[],
  }

  selectedRefList.products = checkMain.filter((item: PoDtType) => {
    return item.ref_type == 'products'
  })

  selectedRefList.so = checkMain.filter((item: PoDtType) => {
    return item.ref_type == 'so'
  })

  selectedRefList.ro = checkMain.filter((item: PoDtType) => {
    return item.ref_type == 'ro'
  })

  newRefItems = data.map((dt: FormPoDtRefType): PoDtType => {
    return convertPoItemRefProduct(dt as FormPoDtProductListType, checkOpened)
  })

  if (checkOpened == 'products') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList.so, ...selectedRefList.ro, ...selectedRefList[checkOpened]]
  } else if (checkOpened == 'so') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products, ...selectedRefList.ro]
  } else if (checkOpened == 'ro') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products, ...selectedRefList.so]
  }

  return updatedList
}

export function updatePoRefsModalFromMain(
  checkMain: PoDtType[],
  checkOpened: PoDtRefType,
  checkProducts: FormPoDtProductListType[]
): any[] {
  let updatedList: any[] = []

  let selectedRefList: PoDtType[]

  selectedRefList = checkMain.filter((itemMain: PoDtType) => {
    return (itemMain.ref_type == checkOpened)
  })

  if (checkProducts.length > 0) {
    selectedRefList.forEach((mainItem: PoDtType) => {
      checkProducts.forEach((prodItem: FormPoDtProductListType) => {
        if (
          (mainItem.ref_type == 'products' && mainItem.ref_product_id == prodItem.ref_product_id) ||
          (mainItem.ref_type == 'so' && (mainItem.ref_so_dt_id == prodItem.ref_so_dt_id || mainItem.ref_so_dt_bom_id == prodItem.ref_so_dt_bom_id))
          // (mainItem.ref_type == 'ro' && mainItem.ref_id == prodItem.ref_id)
        ) {
          let combined: any = {
            ...prodItem,
            ...mainItem,
          }

          combined = convertPoItemRefProduct(combined, checkOpened)

          updatedList.push(combined)
        }
      })
    })
  } else {
    updatedList = selectedRefList
  }

  return updatedList
}

export function initCheckedPoDt(
  checkMain: PoDtType[],
): PoDtType[] {
  let updatedList: PoDtType[] = []

  checkMain.forEach((mainItem: PoDtType, iMainItem: number) => {
    updatedList[iMainItem] = {
      ...mainItem,
      uid: randomId(),
    }
  })

  return updatedList
}

function randomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
