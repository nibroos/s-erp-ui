import type { VAutocomplete, VDataTable } from 'vuetify/components'
import type {
  DisplayColumnType,
  Modal,
  ReferenceDisplayType
} from './DatatableClientType'
import type {
  AutocompleteClientType,
  AutocompleteType
} from './AutocompleteType'
import type { DatePickerLightType } from './DatePickerLightType'
import type { MethodAttributeType } from './DatatableClientType'
import type { Pagination } from '~/interfaces/LaravelPaginationInterface'

// type ReadonlyHeaders = VDataTable['$props']['headers']
// type ReadonlyHeaders = VDataTable['$props']['headers']
// type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : never
// type ReadonlyDataTableHeader = UnwrapReadonlyArray<ReadonlyHeaders>

export type MethodAttributeSelectableType = {
  payload?: any
  type?: DisplayColumnType
  show?: boolean
  display?: string // column name
  dateFormat?: string // 'DD/MM/YYYY' | 'DD/MM/YYYY HH:mm' etc
  reference?: ReferenceDisplayType
  rules?: any[]
  others?: AutocompleteType & AutocompleteClientType & DatePickerLightType & SelectTableType
}

export type FieldSelectableType = {
  key: string
  title?: string
  align?: 'start' | 'center' | 'end' | undefined
  width?: string | number
  minWidth?: string
  maxWidth?: string
  sortable?: boolean
  value?: string | ((item: any) => string)
  placeholder?: string
  class?: string
  cellClass?: string[]
  show?: boolean
  headerProps?: Record<string, any>
  cellProps?: Record<string, any>
  children?: FieldSelectableType[]
} & MethodAttributeSelectableType

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
  key?: string | number
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
  headerTableClass?: string
  rowTableClass?: string
  fixedHeader?: boolean
  isSelectHidden?: boolean
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
  noPdf?: boolean
  isCsv?: boolean
  noFilter?: boolean
  show?: boolean
  sortable?: boolean
  editLink?: string
  createOption?: CreateOptionSelectableType
  formOptions?: FormOptionSelectableType
  tabs?: string[] | null;
  tabIndex?: number;
  isDefaultTabSlotExists?: boolean
  defaultTabName?: string
  isInitialLoad?: boolean
  defaultClearFilter?: Record<string, any>
  isInfinateScroll?: boolean
  pageEndProp?: string
  hideDefaultFooter?: boolean
  isRowNum?: boolean
  metaModal?: Pagination<any[]>
  isCustomHeader?: boolean

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
  pdfApi?: string
  pdfMethodApi?: 'post'
  csvApi?: string

  selectStrategy?: 'single' | 'page' | 'all' | undefined

  isResetWhenClose?: boolean
  isResetWhenOpen?: boolean

  itemsProp?: string
  mappingDetail?: string
  totalProp?: string
  metaProp?: string

  // Table
  height?: string
  multiple?: boolean
  returnObject?: boolean
  customFilters?: any[]
  fields?: FieldSelectableType[]
  filters?: FilterSelectableType[]
  query?: Record<string, any> // filter that not visible in filter
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

export type ButtonOptionSelectableType = {
  title?: string
  cta?: string
  link?: string
  icon?: string
  class?: string
  textClass?: string
  cellClass?: string[]
  show?: boolean
}

export type FormOptionSelectableType = {
  creatable?: boolean
  editable?: boolean
  mode: FormOptionModeSelectableType
  modal: Modal
  keyDif: number
  createApi?: string
  createMethodApi?: 'post'
  editApi?: string
  editMethodApi?: 'post'
} & ButtonOptionSelectableType

export type FormOptionModeSelectableType = 'edit' | 'create' | 'view' | ''

export type CreateOptionSelectableType = ButtonOptionSelectableType