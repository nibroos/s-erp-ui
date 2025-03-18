import type { ProductBomListType } from "~/types/masters/ProductType"
import type { FormSoDtProductListType, FormSoDtRefType, SoDtBomType, SoDtItemType, SoDtRefType, SoDtType } from "~/types/sales-orders/SalesOrderType"

export const generateSoBoms = (bom: SoDtBomType[] | ProductBomListType[], productUuid: string, type: 'product' | 'bom' = 'product', productId: number): any[] => {
  return bom.map((bomItem: SoDtBomType | ProductBomListType) => {
    const randomUuid = randomId()

    if (type === 'bom') {
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
    } else {
      return {
        ...bomItem,
        uid: randomUuid,
        product_uuid: productUuid,
        item_id: bomItem.bom_id ?? bomItem.item_id ?? bomItem.ref_id,
        name: bomItem.name ?? bomItem.item_name,
        code: bomItem.code ?? bomItem.item_code,
        sku: bomItem.sku ?? bomItem.item_sku,
        barcode: bomItem.barcode ?? bomItem.item_barcode,
        factory_code: bomItem.factory_code ?? bomItem.item_factory_code,
        specification: bomItem.item_specification,
        item_name: bomItem.name ?? bomItem.item_name,
        item_code: bomItem.code ?? bomItem.item_code,
        item_sku: bomItem.sku ?? bomItem.item_sku,
        item_barcode: bomItem.barcode ?? bomItem.item_barcode,
        item_factory_code: bomItem.factory_code ?? bomItem.item_factory_code,
        product_id: productId,
      }
    }
  })
}

export function convertSoItemRefProduct(
  item: FormSoDtProductListType,
): SoDtType {
  console.log('convertSoItemRefProduct-item', item);

  let itemType: SoDtItemType = item.boms && item.boms.length > 0 ? 'product' : 'item'
  let productUuid = randomId()
  let productId = item.product_id ?? item.ref_id

  if (!!item.boms) {
    item.boms = generateSoBoms(item.boms, productUuid, 'bom', productId)
  }

  if (!!item.so_dts_boms) {
    item.so_dts_boms = generateSoBoms(item.so_dts_boms, productUuid, 'bom', productId)
  }

  const data: SoDtType = {
    ...item,
    uid: randomId(),
    id: item.so_dt_id ?? null,
    sales_order_id: item.sales_order_id,
    item_unit_id: item.item_unit_id,
    vat_id: item.vat_id,
    ref_id: item.product_id as number,
    item_id: item.product_id as number,
    product_uuid: productUuid,
    ref_type: 'products',
    remark: item.remark,
    vat_perc: item.vat_perc || 0,
    vat_perc_am: item.vat_perc_am || 0,
    item_type: itemType,
    qty: item.qty || 0,
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
    so_dts_boms: item.so_dts_boms ?? item.boms,

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
  data:
    | FormSoDtRefType[],
  checkOpened:
    | SoDtRefType,
  checkMain: SoDtType[],
): SoDtType[] {
  // let generatedList: SoDtType[] = []

  // const generatedList = data.map((dt: FormSoDtRefType): SoDtType => {
  //   // if (useInventoryInStore().showModal.listPO) {
  //   //   return convertPoRefToListItem(dt as PoTableCheck, invType)
  //   // }
  //   console.log('generateSoDt-checkMain', checkMain);

  //   if (checkOpened == 'products') {

  //     return convertSoItemRefProduct(dt)
  //   } else {
  //     return dt as unknown as SoDtType
  //   }
  // })

  let newRefItems: SoDtType[]
  let removedRefItems: SoDtType[]
  let updatedList: SoDtType[]

  if (checkOpened == 'products') {
    newRefItems = data.map((dt: FormSoDtRefType): SoDtType => {
      return convertSoItemRefProduct(dt)
    })

    removedRefItems = checkMain.filter((rmItem: SoDtType) => {
      return !newRefItems.some((newItem: SoDtType) => {
        return newItem.ref_id == rmItem.ref_id
      })
    })
    updatedList = [...newRefItems]

    console.log('generateSoDt-prod-newRefItems', newRefItems);
    console.log('generateSoDt-prod-removedRefItems', removedRefItems);
    console.log('generateSoDt-prod-updatedList', updatedList);

  } else {
    newRefItems = data as unknown as SoDtType[]
    removedRefItems = checkMain.filter((item: SoDtType) => {
      return !newRefItems.some((newItem: SoDtType) => {
        return newItem.ref_id == item.ref_id
      })
    })
    updatedList = [...newRefItems]

    console.log('generateSoDt-else-newRefItems', newRefItems);
    console.log('generateSoDt-else-removedRefItems', removedRefItems);
    console.log('generateSoDt-else-updatedList', updatedList);
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
  checkMain.forEach((mainItem: SoDtType, iMainItem: number) => {
    if (mainItem.ref_type != checkOpened) {
      return
    }

    if (checkProducts.length > 0) {
      checkProducts.forEach((prodItem: FormSoDtProductListType, iProdItem: number) => {
        console.log('updateSoRefsModalFromMain-mainItem-base', iProdItem, mainItem);
        if (mainItem.ref_id == prodItem.ref_id) {
          console.log('updateSoRefsModalFromMain-mainItem-found', iProdItem, mainItem);

          const combined = {
            ...prodItem,
            ...mainItem,
          }

          updatedList[iMainItem] = combined
        }
      })
    } else {
      updatedList[iMainItem] = mainItem
    }

  })

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