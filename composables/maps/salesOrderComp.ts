import type { ProductBomListType } from "~/types/masters/ProductType"
import type { FormSoDtProductListType, FormSoDtRefType, OptionalSoRefType, SoDtBomType, SoDtItemType, SoDtRefType, SoDtType } from "~/types/sales-orders/SalesOrderType"

export const generateSoBoms = (bom: SoDtBomType[] | ProductBomListType[], productUuid: string, type: 'product' | 'bom' = 'product', productId: number): any[] => {
  return bom.map((bomItem: SoDtBomType | ProductBomListType) => {
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
      qty: bomItem.qty ?? 1,
    }
  })
}

const isItemTypeProduct = (item: FormSoDtProductListType): boolean => {
  return (item.boms && item.boms.length > 0) ||
    (item.so_dts_boms && item.so_dts_boms.length > 0) ||
    (item.quo_dts_boms && item.quo_dts_boms.length > 0)
}

export function convertSoItemRefProduct(
  item: FormSoDtProductListType,
  refType: SoDtRefType
): SoDtType {
  // console.log('convertSoItemRefProduct-item', item);

  let productUuid = randomId()

  console.log('convertSoItemRefProduct-item', item);

  let productId = item.product_id ?? item.ref_id

  console.log('convertSoItemRefProduct-productId', productId);
  if (!!item.boms) {
    item.boms = generateSoBoms(item.boms, productUuid, 'bom', productId)
  }

  if (!!item.so_dts_boms) {
    productId = item.item_id
    item.so_dts_boms = generateSoBoms(item.so_dts_boms, productUuid, 'bom', productId)
  }

  if (!!item.quo_dts_boms) {
    item.quo_dts_boms = generateSoBoms(item.quo_dts_boms, productUuid, 'bom', productId)
  }

  let optional: OptionalSoRefType = {
    ref_id: null,
    item_id: null,
    product_id: null,
    item_type: isItemTypeProduct(item) ? 'product' : 'item'
  }

  if (refType == 'products') {
    optional.ref_id = item.product_id
    optional.item_id = item.product_id
  } else if (refType == 'quotations') {
    optional.ref_id = item.quo_dt_id ?? item.ref_id
    optional.item_id = item.item_id
  }

  let soDtsBoms
  if (item.boms) {
    soDtsBoms = item.boms
  } else if (item.so_dts_boms) {
    soDtsBoms = item.so_dts_boms
  } else if (item.quo_dts_boms) {
    soDtsBoms = item.quo_dts_boms
  }

  const data: SoDtType = {
    ...item,
    uid: randomId(),
    id: item.so_dt_id ?? null,
    sales_order_id: item.sales_order_id,
    item_unit_id: item.item_unit_id,
    vat_id: item.vat_id,
    ref_id: optional.ref_id as number,
    item_id: optional.item_id as number,
    product_uuid: productUuid,
    ref_type: refType,
    remark: item.remark,
    vat_perc: item.vat_perc || 0,
    vat_perc_am: item.vat_perc_am || 0,
    item_type: optional.item_type,
    qty: item.qty || 1,
    price_sell: (item.price_sell || 0) as number,
    price_buy: (item.price_buy || 0) as number,
    subtotal_sell: item.subtotal_sell || 0,
    subtotal_buy: item.subtotal_buy || 0,
    disc_am: item.disc_am || 0,
    disc_perc: item.disc_perc || 0,
    disc_perc_num: item.disc_perc_num || 0,
    disc_perc_am: item.disc_perc_am || 0,
    disc_final: item.disc_final || 0,
    disc_type: item.disc_type || null,
    total_am: item.total_am || 0,
    so_dts_boms: soDtsBoms,

    item_name: item.name ?? item.item_name ?? item.product_name,
    item_code: item.code ?? item.item_code ?? item.product_code,
    product_name: item.name ?? item.item_name ?? item.product_name,
    product_code: item.code ?? item.item_code ?? item.product_code,
    unit_name: item.unit_name,
  }

  // remove boms
  delete data.boms

  return data
}

export function generateSoDt(
  checkSelected:
    | FormSoDtRefType[],
  checkOpened:
    | SoDtRefType,
  checkMain: SoDtType[],
): SoDtType[] {
  let newRefItems: SoDtType[]
  let updatedList: SoDtType[] = []

  let selectedRefList = {
    products: [] as SoDtType[],
    quotations: [] as SoDtType[],
  }

  selectedRefList.products = checkMain.filter((item: SoDtType) => {
    return item.ref_type == 'products'
  })

  selectedRefList.quotations = checkMain.filter((item: SoDtType) => {
    return item.ref_type == 'quotations'
  })

  // filter new ref items
  newRefItems = checkSelected.map((dt: FormSoDtRefType): SoDtType => {
    return convertSoItemRefProduct(dt, checkOpened)
  })
  if (checkOpened == 'products') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList.quotations, ...selectedRefList[checkOpened]]
  } else if (checkOpened == 'quotations') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products]

  }

  return updatedList
}

export function defineItemTypeSalesOrder(
  item: SoDtType
): SoDtItemType {
  return (item.boms && item.boms.length > 0) || (item.so_dts_boms && item.so_dts_boms.length > 0) ? 'product' : 'item'
}

export function updateSoRefsModalFromMain(
  checkMain: SoDtType[],
  checkOpened: SoDtRefType,
  checkProducts: FormSoDtProductListType[]
): any[] {
  let updatedList: any[] = []

  let selectedRefList: SoDtType[]

  // if (checkOpened == 'products') {
  selectedRefList = checkMain.filter((itemMain: SoDtType) => {
    return (itemMain.ref_type == checkOpened)
    // && (itemMain.ref_type == 'products' || itemMain.ref_type == 'quotations')
  })

  if (checkProducts.length > 0) {
    selectedRefList.forEach((mainItem: SoDtType) => {
      checkProducts.forEach((prodItem: FormSoDtProductListType) => {

        if (
          (mainItem.ref_type == 'quotations' && mainItem.ref_id == prodItem.ref_id) ||
          (mainItem.ref_type == 'products' && mainItem.ref_id == prodItem.ref_id)
        ) {
          let combined: any = {
            ...prodItem,
            ...mainItem,
          }

          combined = convertSoItemRefProduct(combined, checkOpened)

          updatedList.push(combined)
        }
      })
    })
  } else {
    updatedList = selectedRefList
  }

  return updatedList
}

export function initCheckedSoDt(
  checkMain: SoDtType[],
): SoDtType[] {
  let updatedList: SoDtType[] = []

  checkMain.forEach((mainItem: SoDtType, iMainItem: number) => {
    updatedList[iMainItem] = {
      ...mainItem,
      uid: randomId(),
    }
  })

  return updatedList
}