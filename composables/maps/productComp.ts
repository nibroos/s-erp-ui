import type { CreateBomsRequestType, CreateMsItemUnitsRequestType } from "~/types/masters/ProductType";

export function generateItemUnit(
  data:
    | CreateMsItemUnitsRequestType[],
  checkMain: CreateMsItemUnitsRequestType[],
): CreateMsItemUnitsRequestType[] {
  return data.map((item: CreateMsItemUnitsRequestType) => {
    return {
      ...item,
      ...checkMain.find((mainItem: CreateMsItemUnitsRequestType) => mainItem.unit_id ==
        item.unit_id) || {}
    }
  })
}
export function generateItemBom(
  data:
    | CreateBomsRequestType[],
  checkMain: CreateBomsRequestType[],
): CreateBomsRequestType[] {
  // return data.map((item: CreateBomsRequestType) => {
  //   return {
  //     ...item,
  //     ...checkMain.find((mainItem: CreateBomsRequestType) => mainItem.product_item_id ==
  //       item.product_item_id) || {}
  //   }
  // })

  // remove not included item on checkMain, compare to data. combine with data
  let updatedList: CreateBomsRequestType[] = []

  if (checkMain.length == 0) {
    return data
  }

  checkMain.forEach((mainItem: CreateBomsRequestType, iMainItem: number) => {
    const foundItem = data.find((item: CreateBomsRequestType) => item.ref_id == mainItem.ref_id)
    if (foundItem) {
      updatedList[iMainItem] = {
        ...foundItem,
        ...mainItem
      }
    } else {
      updatedList[iMainItem] = mainItem
    }
  })

  // get all item from data that not included in checkMain
  updatedList = updatedList.concat(
    data.filter((item: CreateBomsRequestType) => {
      return !checkMain.some((mainItem: CreateBomsRequestType) => mainItem.ref_id == item.ref_id)
    })
  )

  return updatedList
}

// export function defineQuoItemTypeQuotation(
//   item: QuoDtType
// ): QuoDtItemType {
//   return (item.boms && item.boms.length > 0) || (item.quo_dts_boms && item.quo_dts_boms.length > 0) ? 'product' : 'item'
// }

// export function updateQuoRefsModalFromMain(
//   checkMain: QuoDtType[],
//   checkOpened: QuoDtRefType,
//   checkProducts: FormQuoDtProductListType[]
// ): any[] {

//   let updatedList: any[] = []
//   checkMain.forEach((mainItem: QuoDtType, iMainItem: number) => {
//     if (mainItem.ref_type != checkOpened) {
//       return
//     }

//     if (checkProducts.length > 0) {
//       checkProducts.forEach((prodItem: FormQuoDtProductListType, iProdItem: number) => {
//         if (mainItem.ref_id == prodItem.ref_id) {

//           const combined = {
//             ...prodItem,
//             ...mainItem,
//           }

//           updatedList[iMainItem] = combined
//         }
//       })
//     } else {
//       updatedList[iMainItem] = mainItem
//     }

//   })

//   return updatedList
// }