import type { ProductBomListType } from "~/types/masters/ProductType"
import type { FormInvDtProductListType, FormInvDtRefType, OptionalInvRefType, InvDtItemType, InvDtRefType, InvDtType } from "~/types/inventories/InventoryType"

// export const generateSoBoms = (bom: InvDtBomType[] | ProductBomListType[], productUuid: string, type: 'product' | 'bom' = 'product', productId: number): any[] => {
//   return bom.map((bomItem: InvDtBomType | ProductBomListType) => {
//     const randomUuid = randomId()

//     return {
//       ...bomItem,
//       uid: randomUuid,
//       product_uuid: productUuid,
//       item_id: bomItem.product_item_id ?? bomItem.bom_id ?? bomItem.item_id ?? bomItem.ref_id,
//       name: bomItem.item_name ?? bomItem.name,
//       code: bomItem.item_code ?? bomItem.code,
//       sku: bomItem.item_sku ?? bomItem.sku,
//       barcode: bomItem.item_barcode ?? bomItem.barcode,
//       factory_code: bomItem.item_factory_code ?? bomItem.factory_code,
//       specification: bomItem.item_specification ?? bomItem.specification,
//       item_name: bomItem.item_name ?? bomItem.name,
//       item_code: bomItem.item_code ?? bomItem.code,
//       item_sku: bomItem.item_sku ?? bomItem.sku,
//       item_barcode: bomItem.item_barcode ?? bomItem.barcode,
//       item_factory_code: bomItem.item_factory_code ?? bomItem.factory_code,
//       item_unit_name: bomItem.unit_name ?? bomItem.item_unit_name,
//       product_id: productId,
//       qty: bomItem.qty ?? 1,
//     }
//   })
// }

export function convertInvItemRefProduct(
  item: FormInvDtProductListType,
  refType: InvDtRefType
): InvDtType {
  // console.log('convertInvItemRefProduct-item', item);

  let productUuid = randomId()
  let productId = item.product_id ?? item.ref_id

  let optional: OptionalInvRefType = {
    ref_id: null,
    item_id: null,
    product_id: null,
    item_type: item.item_type
  }

  if (refType == 'products') {
    optional.ref_id = item.product_id
  } else if (refType == 'so') {
    optional.ref_id = item.ref_id
  } else if (refType == 'po') {
    optional.ref_id = item.ref_id
  } else if (refType == 'inv_in') {
    optional.ref_id = item.ref_id
  }
  optional.item_id = item.item_id

  const data: InvDtType = {
    ...item,
    uid: randomId(),
    id: item.inv_dt_id ?? null,
    inventory_id: item.inventory_id,
    item_unit_id: item.item_unit_id,
    vat_id: item.vat_id,
    ref_so_dt_id: item.ref_so_dt_id,
    ref_so_dt_bom_id: item.ref_so_dt_bom_id,
    ref_po_dt_id: item.ref_po_dt_id,
    ref_po_dt_bom_id: item.ref_po_dt_bom_id,
    ref_inv_dt_id: item.ref_inv_dt_id,
    ref_product_id: item.ref_product_id,
    item_id: optional.item_id as number,
    product_uuid: productUuid,
    ref_type: refType,
    remark: item.remark,
    item_type: optional.item_type,
    qty: item.qty || 1,
    qty_out: item.qty_out,
    price_sell: (item.price_sell || 0) as number,
    price_buy: (item.price_buy || 0) as number,
    subtotal_sell: item.subtotal_sell || 0,
    subtotal_buy: item.subtotal_buy || 0,

    item_name: item.name ?? item.item_name ?? item.product_name,
    item_code: item.code ?? item.item_code ?? item.product_code,
    product_name: item.name ?? item.item_name ?? item.product_name,
    product_code: item.code ?? item.item_code ?? item.product_code,
    unit_name: item.unit_name,
  }

  return data
}

export function generateInvDt(
  data:
    | FormInvDtRefType[],
  checkOpened:
    | InvDtRefType,
  checkMain: InvDtType[],
): InvDtType[] {
  let newRefItems: InvDtType[]
  let updatedList: InvDtType[] = []

  let selectedRefList = {
    products: [] as InvDtType[],
    so: [] as InvDtType[],
    po: [] as InvDtType[],
    inv_in: [] as InvDtType[],
  }

  selectedRefList.products = checkMain.filter((item: InvDtType) => {
    return item.ref_type == 'products'
  })

  selectedRefList.so = checkMain.filter((item: InvDtType) => {
    return item.ref_type == 'so'
  })

  selectedRefList.po = checkMain.filter((item: InvDtType) => {
    return item.ref_type == 'po'
  })

  selectedRefList.inv_in = checkMain.filter((item: InvDtType) => {
    return item.ref_type == 'inv_in'
  })

  // filter new ref items
  newRefItems = data.map((dt: FormInvDtRefType): InvDtType => {
    return convertInvItemRefProduct(dt, checkOpened)
  })

  if (checkOpened == 'products') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList.so, ...selectedRefList[checkOpened]]
  } else if (checkOpened == 'so') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products]
  } else if (checkOpened == 'inv_in') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products]
  } else if (checkOpened == 'po') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products]
  }

  return updatedList
}

export function defineItemTypeInventory(
  item: InvDtType
): InvDtItemType {
  return item.item_type
}

export function updateInvRefsModalFromMain(
  checkMain: InvDtType[],
  checkOpened: InvDtRefType,
  checkProducts: FormInvDtProductListType[]
): any[] {
  let updatedList: any[] = []

  let selectedRefList: InvDtType[]

  // if (checkOpened == 'products') {
  selectedRefList = checkMain.filter((itemMain: InvDtType) => {
    return (itemMain.ref_type == checkOpened)
    // && (itemMain.ref_type == 'products' || itemMain.ref_type == 'quotations')
  })

  if (checkProducts.length > 0) {
    selectedRefList.forEach((mainItem: InvDtType) => {
      checkProducts.forEach((prodItem: FormInvDtProductListType) => {

        if (
          (mainItem.ref_type == 'so' && (mainItem.ref_so_dt_id == prodItem.ref_so_dt_id || mainItem.ref_so_dt_bom_id == prodItem.ref_so_dt_bom_id)) ||
          (mainItem.ref_type == 'po' && (mainItem.ref_po_dt_id == prodItem.ref_po_dt_id || mainItem.ref_po_dt_bom_id == prodItem.ref_po_dt_bom_id)) ||
          (mainItem.ref_type == 'inv_in' && mainItem.ref_inv_dt_id == prodItem.ref_inv_dt_id) ||
          (mainItem.ref_type == 'products' && mainItem.ref_product_id == prodItem.ref_product_id)
        ) {
          let combined: any = {
            ...prodItem,
            ...mainItem,
          }

          combined = convertInvItemRefProduct(combined, checkOpened)

          updatedList.push(combined)
        }
      })
    })
  } else {
    updatedList = selectedRefList
  }

  return updatedList
}

export function initCheckedInvDt(
  checkMain: InvDtType[],
): InvDtType[] {
  let updatedList: InvDtType[] = []

  checkMain.forEach((mainItem: InvDtType, iMainItem: number) => {
    updatedList[iMainItem] = {
      ...mainItem,
      uid: randomId(),
    }
  })

  return updatedList
}