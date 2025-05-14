import type { FormRoDtProductListType, FormRoDtRefType, RoDtProductType, RoDtRefType, RoDtType } from "~/types/request-orders/RequestOrderType"

export function defineItemTypeRequestOrder(
  item: FormRoDtProductListType
): RoDtProductType {
  if (item.product_type) {
    return item.product_type;
  }

  return (item.boms && item.boms.length > 0) ? 'product' : 'item'
}

export function convertRoItemRefProduct(
  item: FormRoDtProductListType,
  refType: RoDtRefType
): RoDtType {
  let productUuid = randomId()
  let productId = item.product_id ?? item.item_id ?? item.ref_id

  const productType = defineItemTypeRequestOrder(item)

  const data: RoDtType = {
    ...item,
    uid: randomId(),
    id: item.id ?? null,
    request_order_id: item.request_order_id,
    item_unit_id: item.item_unit_id,
    ref_id: item.ref_id as number,
    product_id: productId,
    item_id: item.item_id || null,
    product_type: productType,
    product_uuid: productUuid,
    ref_type: refType,
    remark: item.remark,
    order_product_qty: item.order_product_qty || 0,
    order_item_qty: item.order_item_qty || 0,
    wh_qty: item.wh_qty || 0,
    req_qty: item.req_qty || 1,
    price_sell: item.price_sell || 0,

    product_name: item.product_name ?? item.product_name,
    product_code: item.product_code ?? item.product_code,
    item_name: item.item_name ?? item.name ?? item.product_name,
    item_code: item.item_code ?? item.code ?? item.product_code,
    unit_name: item.unit_name
  }

  return data
}

export function generateRoDt(
  data: FormRoDtRefType[],
  checkOpened: RoDtRefType,
  checkMain: RoDtType[],
): RoDtType[] {
  let newRefItems: RoDtType[]
  let updatedList: RoDtType[] = []

  let selectedRefList = {
    products: [] as RoDtType[],
    so: [] as RoDtType[],
  }

  selectedRefList.products = checkMain.filter((item: RoDtType) => {
    return item.ref_type == 'products'
  })

  selectedRefList.so = checkMain.filter((item: RoDtType) => {
    return item.ref_type == 'so'
  })

  newRefItems = data.map((dt: FormRoDtRefType): RoDtType => {
    return convertRoItemRefProduct(dt as FormRoDtProductListType, checkOpened)
  })

  if (checkOpened == 'products') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList.so, ...selectedRefList[checkOpened]]
  } else if (checkOpened == 'so') {
    selectedRefList[checkOpened] = [...newRefItems]
    updatedList = [...selectedRefList[checkOpened], ...selectedRefList.products]
  }

  return updatedList
}

export function updateRoRefsModalFromMain(
  checkMain: RoDtType[],
  checkOpened: RoDtRefType,
  checkProducts: FormRoDtProductListType[]
): any[] {
  let updatedList: any[] = []

  let selectedRefList: RoDtType[]

  selectedRefList = checkMain.filter((itemMain: RoDtType) => {
    return (itemMain.ref_type == checkOpened)
  })

  if (checkProducts.length > 0) {
    selectedRefList.forEach((mainItem: RoDtType) => {
      checkProducts.forEach((prodItem: FormRoDtProductListType) => {
        if (
          (mainItem.ref_type == 'products' && (
            !!mainItem.product_id && !!prodItem.product_id && mainItem.product_id == prodItem.product_id
          )) ||
          // (mainItem.ref_type == 'so' && (
          //   (!!mainItem.ref_id && !!prodItem.ref_id && mainItem.ref_id == prodItem.ref_id)
          // ))
          (mainItem.ref_type == 'so' && (
            (!!mainItem.ref_id && !!prodItem.ref_id && mainItem.ref_id == prodItem.ref_id) &&
            (!!mainItem.sales_order_id && !!prodItem.sales_order_id && mainItem.sales_order_id == prodItem.sales_order_id)
          ))
        ) {
          let combined: any = {
            ...prodItem,
            ...mainItem,
          }

          combined = convertRoItemRefProduct(combined, checkOpened)

          updatedList.push(combined)
        }
      })
    })
  } else {
    updatedList = selectedRefList
  }

  return updatedList
}

export function initCheckedRoDt(
  checkMain: RoDtType[],
): RoDtType[] {
  let updatedList: RoDtType[] = []

  checkMain.forEach((mainItem: RoDtType, iMainItem: number) => {
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
