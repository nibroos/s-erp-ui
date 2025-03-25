import type { ProductBomListType } from "~/types/masters/ProductType"
import type { FormPoDtProductListType, FormPoDtRefType, PoDtBomType, PoDtRefType, PoDtType } from "~/types/purchase-orders/PurchaseOrderType"

export const generatePoBoms = (bom: PoDtBomType[] | ProductBomListType[], productUuid: string, type: 'product' | 'bom' = 'product', productId: number): any[] => {
  return bom.map((bomItem: PoDtBomType | ProductBomListType) => {
    const randomUuid = randomId()

    return {
      ...bomItem,
      uid: randomUuid,
      product_uuid: productUuid,
      item_id: bomItem.product_item_id ?? bomItem.bom_id ?? bomItem.item_id ?? bomItem.ref_id,
      name: bomItem.item_name ?? bomItem.name,
      code: bomItem.item_code ?? bomItem.code,
      sku: bomItem.item_sku ?? bomItem.sku,
      barcode: bomItem.item_barcode ?? bomItem.barcode,
      factory_code: bomItem.item_factory_code ?? bomItem.factory_code,
      specification: bomItem.item_specification ?? bomItem.specification,
      item_name: bomItem.item_name ?? bomItem.name,
      item_code: bomItem.item_code ?? bomItem.code,
      item_sku: bomItem.item_sku ?? bomItem.sku,
      item_barcode: bomItem.item_barcode ?? bomItem.barcode,
      item_factory_code: bomItem.item_factory_code ?? bomItem.factory_code,
      item_unit_name: bomItem.unit_name ?? bomItem.item_unit_name,
      product_id: productId,
    }
  })
}

const isItemTypeProduct = (item: FormPoDtProductListType): boolean => {
  return (item.boms && item.boms.length > 0) ||
    (item.po_dt_boms && item.po_dt_boms.length > 0)
}

export function convertPoItemRefProduct(
  item: FormPoDtProductListType,
  refType: PoDtRefType
): PoDtType {
  let productUuid = randomId()
  let productId = item.product_id ?? item.ref_id

  if (!!item.boms) {
    item.boms = generatePoBoms(item.boms, productUuid, 'bom', productId)
  }

  if (!!item.po_dt_boms) {
    item.po_dt_boms = generatePoBoms(item.po_dt_boms, productUuid, 'bom', productId)
  }

  let refId = null
  let itemId = null

  if (refType === 'products') {
    refId = item.product_id
    itemId = item.product_id
  }
  // SO and RO implementations will be added later
  /* 
  else if (refType === 'so') {
    refId = item.so_dt_id
    itemId = item.item_id
  } 
  else if (refType === 'ro') {
    refId = item.ro_dt_id
    itemId = item.item_id
  }
  */

  let poDtsBoms
  if (item.boms) {
    poDtsBoms = item.boms
  } else if (item.po_dt_boms) {
    poDtsBoms = item.po_dt_boms
  }

  let discountType: PoDtDiscType = null;
  if (item.discount_percentage && item.discount_percentage > 0) {
    discountType = 'percentage';
  } else if (item.discount_amount && item.discount_amount > 0) {
    discountType = 'amount';
  }

  const data: PoDtType = {
    ...item,
    uid: randomId(),
    id: item.po_dt_id ?? null,
    po_id: item.po_id,
    item_unit_id: item.item_unit_id,
    vat_id: item.vat_id || null, 
    pph23_id: item.pph23_id || null, 
    is_vat: item.is_vat || 0, 
    is_pph23: item.is_pph23 || 0,
    ref_id: refId as number,
    product_id: productId,
    product_uuid: productUuid,
    ref_type: refType,
    product_type: isItemTypeProduct(item) ? 'product' : 'item',
    remark: item.remark,
    need_qty: item.need_qty || 0,
    qty: item.qty || 0,
    price: (item.price_buy || 0) as number,
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
    po_dt_boms: poDtsBoms,

    item_name: item.name ?? item.item_name ?? item.product_name,
    item_code: item.code ?? item.item_code ?? item.product_code,
    product_name: item.name ?? item.item_name ?? item.product_name,
    product_code: item.code ?? item.item_code ?? item.product_code,
    unit_name: item.unit_name,
  }

  delete data.boms

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
    return item.ref_type === 'products'
  })

  /* 
  selectedRefList.so = checkMain.filter((item: PoDtType) => {
    return item.ref_type === 'so'
  })

  selectedRefList.ro = checkMain.filter((item: PoDtType) => {
    return item.ref_type === 'ro'
  })
  */

  newRefItems = data.map((dt: FormPoDtRefType): PoDtType => {
    return convertPoItemRefProduct(dt as FormPoDtProductListType, checkOpened)
  })

  if (checkOpened === 'products') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [
      ...selectedRefList[checkOpened], 
      // ...selectedRefList.so, 
      // ...selectedRefList.ro
    ]
  }
  /* 
  else if (checkOpened === 'so') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products, ...selectedRefList.ro]
  }
  else if (checkOpened === 'ro') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products, ...selectedRefList.so]
  }
  */

  return updatedList
}

export function defineItemTypePurchaseOrder(
  item: PoDtType
): string {
  return (item.boms && item.boms.length > 0) || (item.po_dt_boms && item.po_dt_boms.length > 0) ? 'product' : 'item'
}

export function updatePoRefsModalFromMain(
  checkMain: PoDtType[],
  checkOpened: PoDtRefType,
  checkProducts: FormPoDtProductListType[]
): any[] {
  let updatedList: any[] = []

  let selectedRefList: PoDtType[]

  selectedRefList = checkMain.filter((item: PoDtType) => {
    return (item.ref_type === checkOpened) && (item.ref_type === 'products')
    // For future implementation: || item.ref_type === 'so' || item.ref_type === 'ro'
  })

  if (checkProducts.length > 0) {
    selectedRefList.forEach((item: PoDtType) => {
      checkProducts.forEach((prodItem: FormPoDtProductListType) => {
        if (
          (item.ref_type === 'products' && item.ref_id === prodItem.ref_id)
          // For future implementation:
          // || (item.ref_type === 'so' && item.ref_id === prodItem.so_dt_id)
          // || (item.ref_type === 'ro' && item.ref_id === prodItem.ro_dt_id)
        ) {
          let combined: any = {
            ...prodItem,
            ...item,
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
