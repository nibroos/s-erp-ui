import type { VAutocomplete, VDataTable } from 'vuetify/components'
import type {
  DisplayColumnType,
  ReferenceDisplayType
} from './DatatableClientType'
import type {
  AutocompleteClientType,
  AutocompleteType
} from './AutocompleteType'
import type { DatePickerLightType } from './DatePickerLightType'
import type { MethodAttributeType } from './DatatableClientType'

// type ReadonlyHeaders = VDataTable['$props']['headers']
// type ReadonlyHeaders = VDataTable['$props']['headers']
// type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : never
// type ReadonlyDataTableHeader = UnwrapReadonlyArray<ReadonlyHeaders>

export type MethodAttributeSelectableType = {
  type?: DisplayColumnType
  show?: boolean
  display?: string // column name
  dateFormat?: string // 'DD/MM/YYYY' | 'DD/MM/YYYY HH:mm' etc
  reference?: ReferenceDisplayType
  rules?: any[]
  others?: AutocompleteType & AutocompleteClientType & DatePickerLightType
}

export type FieldSelectableType = {
  key: string
  title?: string
  align?: 'start' | 'center' | 'end' | undefined
  width?: string | number
  minWidth?: string
  maxWidth?: string
  sortable?: boolean
  value?: string
  placeholder?: string
  class?: string
  cellClass?: string[]
  show?: boolean
  headerProps?: Record<string, any>,
  cellProps?: Record<string, any>,
}

export type GeneratedFieldSelectableType = {
  key: string
  title?: string
  value?: string
  placeholder?: string
  cellClass?: string[]
  index?: MethodAttributeSelectableType | boolean
}

export type SelectTableType = {
  modelValue?: any
  title?: string
  key?: string
  value?: string
  label?: string
  align?: 'start' | 'center' | 'end' | undefined
  width?: string | number
  minWidth?: string
  maxWidth?: string
  cta?: string
  noIcon?: boolean
  class?: string
  btnClass?: string
  textClass?: string
  disabled?: boolean
  loading?: boolean | undefined
  disabledTextClass?: string
  disabledClass?: string
  activateLoading?: boolean
  isLoadingDefault?: boolean
  isNoText?: boolean
  appendIcon?: string
  icon?: string
  iconClass?: string
  itemValue?: string
  displayKey?: string
  isDisplayMultipleKey?: boolean
  displaySingleMultipleKeys?: string[]
  displayMultipleSeparator?: string
  maxLengthDisplay?: number | string
  isQuickSelect?: boolean
  searchPlaceholder?: string
  noTitle?: boolean
  queryModal?: Record<string, any>
  isEdit?: boolean
  noAction?: boolean
  noDelete?: boolean
  show?: boolean
  sortable?: boolean
  editLink?: string
  createOption?: CreateOptionSelectableType

  // Modal
  showModal?: boolean
  modalSize?: string
  modalTitle?: string
  modalHeaderClass?: string
  modalHeaderTextClass?: string
  modalCustomClass?: string
  modalParentClass?: string
  api?: string
  methodApi?: 'get' | 'post'
  detailApi?: string
  detailMethodApi?: 'get' | 'post'
  selectedDetailApi?: string
  selectedDetailMethodApi?: 'get' | 'post'
  deleteApi?: string
  deleteMethodApi?: 'post' | 'delete'

  selectStrategy?: 'single' | 'page' | 'all' | undefined

  itemsProp?: string
  mappingDetail?: string
  totalProp?: string

  // Table
  height?: string
  multiple?: boolean
  returnObject?: boolean
  customFilters?: any[]
  fields?: FieldSelectableType[]
  filters?: FilterSelectableType[]
}

export type FilterSelectableType = {
  key: string
  title?: string
  value?: string
  placeholder?: string
  class?: string
  cellClass?: string[]
  show?: boolean
} & MethodAttributeSelectableType

export type CreateOptionSelectableType = {
  title?: string
  cta?: string
  link?: string
  icon?: string
  class?: string
  cellClass?: string[]
  show?: boolean
}