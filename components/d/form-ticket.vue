<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useTicketStore from "~/stores/supports/TicketStore";
import type {
  OptionRefBtnType,
  RefBtnType,
} from "~/types/components/OptionRefBtnType";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { FormVatType } from "~/types/masters/VatType";
import type { FormPph23Type } from "~/types/masters/Pph23Type";
import type { FormCurrencyType } from "~/types/masters/CurrencyType";
import type {
  FormQuoDtBomListType,
  QuoDtBomType,
  QuoDtType,
} from "~/types/quotations/QuotationType";
import type {
  FormProductCompType,
  ProductBomListType,
} from "~/types/masters/ProductType";
import { debounce } from "lodash-es";

const props = withDefaults(defineProps<FormProductCompType>(), {
  id: null,
  isOpen: false,
});

const emits = defineEmits(["submit:form", "update:isOpen"]);

const id = ref(props.id);
const isOpen = ref(props.isOpen);

const router = useRouter();
const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const ticketStore = useTicketStore();
const {
  tabFormIndex,
  form,
  errors,
  isOpenModal,
  queryModal,
  metaModal,
  loading,
  openedModal,
  modals,
  selection,
  formLayout: summaryLayout,
  currencySymbolLabel,
} = storeToRefs(ticketStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Create Ticket",
});

const handleSubmit = async () => {
  // const validatedForm = formSchema.safeParse(form.value);

  // if (!validatedForm.success) {
  //   errors.value = {};
  //   console.log("log", validatedForm.error.errors);

  //   validatedForm.error.errors.map((ZodIssue) => {
  //     errors.value[ZodIssue.path[0]] = ZodIssue.message;
  //   });

  //   return;
  // }

  if (!!props.id) {
    form.value.id = Number(props.id);
    await ticketStore.updateModal().then((res) => {
      isOpen.value = false;
      emits("submit:form", res);

      if (props.type === "page") {
        navigateTo(`/crm/tickets`);
      }
    });
  } else {
    await ticketStore.storeModal().then((res) => {
      isOpen.value = false;
      emits("submit:form", res);

      if (props.type === "page") {
        navigateTo(`/crm/tickets`);
      }
    });
  }
};

const fetchInitialData = async () => {
  form.value.id = Number(id.value);
  await Promise.all([
    ticketStore.show(),
    // ticketStore.indexProduct(),
    // ticketStore.indexQuotation(),
  ]);
};

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/crm/tickets",
  currentTab: tabFormIndex.value,
  tabs: ["Solutions", "Schedule", "Remark", "Sent Email"],
  button: {
    // create: {
    //   path: "/crm/tickets/create",
    // },
    save: {
      show: true,
      loading: false,
      type: "submit",
    },
    clear: {
      show: true,
    },
  },
  // permission: {
  //   name: ["c_ms"],
  //   isActive: true,
  // },
} as FormLayoutType);

const initialFormLayout = () => {
  formLayout.value.currentTab = tabFormIndex.value;

  formLayout.value.button = {
    create: {
      path: "/crm/tickets/create",
    },
    save: {
      show: true,
      loading: false,
      type: "submit",
    },
    clear: {
      show: true,
    },
  } as NonNullable<typeof formLayout.value.button>;

  if (!!props.id) {
    formLayout.value.mode = "edit";

    if (!!formLayout.value.button?.save && !!formLayout.value.button.create) {
      formLayout.value.button.save.cta = "Update";
      formLayout.value.button.create.show = true;
    }
  }
};

const handleUpdateSchedule = () => {
  ticketStore.updateSchedule();
};

const kanbanBoardExposeRef = ref();

const nextTicket = ref<number | null>(null);
const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Issue Title",
    key: "title",
    value: "title",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Product",
    key: "product_name",
    value: "product_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Reported Date",
    key: "reported_at",
    value: "reported_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Priority",
    key: "priority_type",
    value: "priority_type",
    align: "start",
    sortable: true,
  },
  {
    title: "Status",
    key: "status",
    value: "status",
    align: "start",
    sortable: true,
  },
  {
    title: "Ticket No",
    key: "ticket_no",
    value: "ticket_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Created By",
    key: "created_by_name",
    value: "created_by_name",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Customers",
    key: "customer_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/customers/index-customer",
      singleApi: "/v1/customers/index-customer",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Roles",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Priority Type",
    key: "priority_types",
    type: "autocomplete-client",
    others: {
      items: useStatics.priorityTypes,
    },
  },
  {
    title: "Start Date",
    key: "start_date",
    type: "date",
  },
  {
    title: "End Date",
    key: "end_date",
    type: "date",
  },
  {
    title: "Product",
    key: "product_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/products/index-product",
      singleApi: "/v1/products/index-product",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Product",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.ticketIndexStatus,
    },
  },
  {
    title: "Ticket No",
    key: "ticket_no",
  },
  {
    title: "Issue Title",
    key: "title",
  },
]);

// Trigger the openModal method
const resetBoard = async () => {
  if (kanbanBoardExposeRef.value) {
    console.log("resetBoard-SO");

    kanbanBoardExposeRef.value.resetBoard();
  } else {
    console.error("openModal method is not available on kanbanBoardExposeRef");
  }

  // await openModal(filteredModalForms.value);
};

onMounted(async () => {
  ticketStore.handleClickClear();
  formLayout.value.currentTab = tabFormIndex.value;
  initialFormLayout();
  if (!!props.id) {
    await fetchInitialData();
    form.value.id = Number(props.id);
    formLayout.value.mode = "edit";
    formLayout.value.button.create = {
      path: "/supports/tickets/create",
      show: true,
    };

    useHead({
      title: "Edit Ticket",
    });
  }
  // ticketStore.updateRefsModal();
});

watchEffect(() => {
  if (topTitle.value != "CS Support") {
    topTitle.value = "CS Support";
  }
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="ticketStore.handleClickClear()"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #title-append>
        <d-select-table
          api="/v1/tickets/index-ticket"
          detail-api="/v1/tickets/index-ticket"
          method-api="post"
          detail-method-api="post"
          mapping-detail="data[0]"
          total-prop="meta.total"
          cta="Go To Ticket"
          label="Ticket"
          v-model="nextTicket"
          class="col-span-2 lg:col-span-1"
          is-quick-select
          @click:selected="
            (data) => {
              if (!!data) {
                ticketStore.goToTicket(data.id);
              }
            }
          "
          modal-custom-class="!w-4/5"
          :fields="fieldsConfig"
          :filters="filtersConfig"
        />
      </template>
      <template #header>
        <form
          :class="
            classMerge(
              'grid grid-cols-7 lg:grid-cols-1 gap-3',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="lg:col-span-7">
            <d-select-table
              api="/v1/customers/index-customer"
              detail-api="/v1/customers/index-customer"
              method-api="post"
              detail-method-api="post"
              mapping-detail="data[0]"
              total-prop="meta.total"
              label="Customer"
              v-model="form.customer_id"
              :query="{
                is_active: 1,
              }"
              class="col-span-2 lg:col-span-1"
              is-quick-select
              @click:selected="(data) => ticketStore.autocompleteCustomer(data)"
              modal-custom-class="!w-4/5"
              :fields="useStatics.headersCustomer"
              :filters="useStatics.filtersCustomer"
            />
          </div>
          <div class="lg:col-span-7 col-span-2">
            <d-text-input
              v-model="form.title"
              :label="`Issue Title`"
              :placeholder="`Issue Title`"
              :errors="errors.title"
            />
          </div>

          <d-select-table
            api="/v1/products/index-product"
            detail-api="/v1/products/index-product"
            method-api="post"
            detail-method-api="post"
            mapping-detail="data[0]"
            total-prop="meta.total"
            label="Program"
            v-model="form.product_id"
            class=""
            is-quick-select
            modal-custom-class="!w-4/5"
            :fields="useInitials.productFieldsFilterConfig.fields"
            :filters="useInitials.productFieldsFilterConfig.filters"
          />
          <div class="lg:col-span-7">
            <d-date-picker-light
              v-model="form.reported_at"
              label="Reported Date"
            ></d-date-picker-light>
          </div>
          <div class="lg:col-span-7">
            <d-autocomplete-client
              v-model="form.status"
              :items="useStatics.formStatusTicket"
              label="Status"
              item-value="id"
              item-title="name"
              :clearable="false"
            />
          </div>
          <div class="lg:col-span-7">
            <d-autocomplete-client
              v-model="form.priority_type"
              :items="useStatics.priorityTypes"
              label="Priority Type"
              item-value="id"
              item-title="name"
              :clearable="false"
            />
          </div>

          <div class="lg:col-span-7 col-span-7">
            <d-text-area-input
              v-model="form.address"
              :clearable="false"
              :label="``"
              :placeholder="`Address`"
              class="bg-zinc-200 cursor-not-allowed dark:bg-dark2"
              :auto-grow="false"
              :rows="2"
              is-static
            />
          </div>
          <div class="lg:col-span-7 col-span-7">
            <d-text-area-input
              v-model="form.issue_desc"
              :label="`Issue Description Information`"
              :placeholder="`Issue Description Information`"
              class=""
              :auto-grow="false"
              :rows="3"
            />
          </div>
          <div
            class="grid grid-cols-3 md:grid-cols-1 lg:col-span-7 col-span-7 gap-2"
          >
            <div class="lg:col-span-6">
              <v-file-upload
                v-model="form.issue_files"
                clearable
                density="compact"
                variant="compact"
                multiple
              >
                <template v-slot:item="{ props: itemProps }">
                  <v-file-upload-item v-bind="itemProps" lines="one" nav>
                    <template v-slot:prepend>
                      <v-avatar size="32" rounded></v-avatar>
                    </template>

                    <template v-slot:clear="{ props: clearProps }">
                      <v-btn
                        class="!text-cancel hover:!text-cancel2 !transition-all !ease-in-out"
                        v-bind="clearProps"
                      ></v-btn>
                    </template>
                  </v-file-upload-item>
                </template>
              </v-file-upload>
            </div>
            <div class="md:col-span-1 col-span-2 flex flex-col gap-2">
              <!-- attached files -->
              <div class="flex flex-col gap-2 dark:text-primary1">
                <span class="text-sm font-medium dark:text-primary1"
                  >Uploaded Files</span
                >
                <div>
                  <div
                    v-if="
                      !form.issue_attachments ||
                      form.issue_attachments.length == 0
                    "
                  >
                    <span
                      class="text-sm font-normal text-grey3 dark:text-primary1"
                      >No files attached</span
                    >
                  </div>
                  <div
                    v-else
                    class="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2 content-start"
                  >
                    <div
                      v-for="(file, index) in form.issue_attachments"
                      :key="index"
                      class="flex justify-between items-center gap-2 p-2 border border-solid border-grey2 hover:bg-grey1 dark:hover:bg-dark2 rounded-lg"
                    >
                      <div class="flex gap-2">
                        <lazy-d-img
                          v-if="file.file_type.includes('image')"
                          :aspect-ratio="1"
                          :alt="file.file_name"
                          :src="file.file_url"
                          width="50"
                          class="border border-solid border-grey3 cursor-pointer"
                          @click="
                            ticketStore.openModalIssueAttachmentImg(true, file)
                          "
                        ></lazy-d-img>

                        <div v-if="!file.file_type.includes('image')">
                          <v-icon
                            icon="mdi-file-document-outline"
                            class="text-sc dark:text-primary1"
                            size="50"
                          />
                        </div>

                        <div class="flex flex-col justify-center">
                          <input
                            v-model="file.file_name"
                            class="w-full text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-sc rounded px-1"
                          />
                          <div class="text-xs dark:text-grey1">
                            {{ shortenBytes(file.file_size) }}
                          </div>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <d-bt
                          v-if="file.file_type.includes('image')"
                          icon="mdi-information-outline"
                          is-no-text
                          class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                          icon-class="text-sc dark:text-primary1"
                          rounded="xl"
                          cta="full view"
                          icon-size="16"
                          :loading="loading.imageDownloadLoading"
                          @click="ticketStore.handleViewFullPageFile(file)"
                        ></d-bt>
                        <d-bt
                          icon="mdi-download"
                          is-no-text
                          class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                          icon-class="text-sc dark:text-primary1"
                          rounded="xl"
                          cta="download"
                          icon-size="16"
                          :loading="loading.imageDownloadLoading"
                          @click="ticketStore.handleDownloadFile(file)"
                        ></d-bt>
                        <d-bt
                          @click="
                            ticketStore.handleExistingIssueFile(file, index)
                          "
                          icon="mdi-delete"
                          is-no-text
                          class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                          icon-class="text-cancel dark:text-primary1"
                          rounded="xl"
                          cta="delete"
                          icon-size="16"
                        ></d-bt>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="flex flex-col gap-2">
              <div>
                <span class="text-sm font-medium dark:text-primary1"
                  >New Files</span
                >
              </div>
              <div class="">
                <div v-if="!form.files">
                  <span
                    class="text-sm font-normal text-grey3 dark:text-primary1"
                    >No files attached</span
                  >
                </div>
                <div
                  v-else
                  class="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2 content-start"
                >
                  <div
                    v-for="(file, index) in form.files"
                    :key="index"
                    class="flex justify-between items-center gap-2 p-2 border border-solid border-grey2 hover:bg-grey2 dark:hover:bg-dark2 rounded-lg"
                  >
                    <div class="flex gap-2">
                      <v-img
                        :aspect-ratio="1"
                        :src="file.url"
                        :alt="file.name"
                        width="50"
                        cover
                        class="border border-solid border-grey3"
                      ></v-img>

                      <div class="flex flex-col justify-center">
                        <span class="text-sm dark:text-primary1">{{
                          file.name
                        }}</span>
                        <span class="text-xs dark:text-grey1">{{
                          shortenBytes(file.size)
                        }}</span>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <d-bt
                        icon="mdi-download"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                        icon-class="text-sc dark:text-primary1"
                        rounded="xl"
                        cta="download"
                        icon-size="16"
                      ></d-bt>
                      <d-bt
                        @click="ticketStore.handleDeleteFile(file, index)"
                        icon="mdi-delete"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                        icon-class="text-cancel dark:text-primary1"
                        rounded="xl"
                        cta="delete"
                        icon-size="16"
                        :is-notif="true"
                        :notif-text="`${file.name} deleted`"
                      ></d-bt>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            </div>
          </div>
          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>
      <template #content>
        <div
          v-if="tabFormIndex == useStatics.formTabTicket.solution"
          class="grid grid-cols-3 sm:grid-cols-1 gap-3"
        >
          <div class="lg:col-span-7 col-span-3">
            <d-text-area-input
              v-model="form.issue_solution"
              :label="``"
              :placeholder="`Solution Information`"
              class=""
              :auto-grow="false"
              :rows="3"
            />
          </div>
          <div
            class="grid grid-cols-3 md:grid-cols-1 lg:col-span-7 col-span-7 gap-3"
          >
            <div class="lg:col-span-6">
              <v-file-upload
                v-model="form.solution_files"
                clearable
                density="compact"
                variant="compact"
                multiple
              >
                <template v-slot:item="{ props: itemProps }">
                  <v-file-upload-item v-bind="itemProps" lines="one" nav>
                    <template v-slot:prepend>
                      <v-avatar size="32" rounded></v-avatar>
                    </template>

                    <template v-slot:clear="{ props: clearProps }">
                      <v-btn
                        class="!text-cancel hover:!text-cancel2 !transition-all !ease-in-out"
                        v-bind="clearProps"
                      ></v-btn>
                    </template>
                  </v-file-upload-item>
                </template>
              </v-file-upload>
            </div>
            <div class="md:col-span-1 col-span-2 flex flex-col gap-2">
              <!-- attached files -->
              <div class="flex flex-col gap-2 dark:text-primary1">
                <div class="flex gap-2 items-center">
                  <span class="text-sm font-medium dark:text-primary1"
                    >Uploaded Files</span
                  >
                  <!-- <v-checkbox-btn
                    v-model="selection.select_all_solution_attachments"
                    class="flex items-center"
                    hide-details
                    density="compact"
                    :true-value="1"
                    :false-value="0"
                    :label="`Select All`"
                  /> -->
                </div>
                <div>
                  <div
                    v-if="
                      !form.solution_attachments ||
                      form.solution_attachments.length == 0
                    "
                  >
                    <span
                      class="text-sm font-normal text-grey3 dark:text-primary1"
                      >No files attached</span
                    >
                  </div>
                  <div
                    v-else
                    class="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2 content-start"
                  >
                    <div
                      v-for="(file, index) in form.solution_attachments"
                      :key="index"
                      class="flex justify-between items-center gap-2 p-2 border border-solid border-grey2 hover:bg-grey1 dark:hover:bg-dark2 rounded-lg"
                    >
                      <div class="flex gap-2 items-center">
                        <v-checkbox-btn
                          v-model="file.is_checked"
                          class="flex items-center"
                          hide-details
                          density="compact"
                          :true-value="1"
                          :false-value="0"
                        />

                        <lazy-d-img
                          v-if="file.file_type.includes('image')"
                          :aspect-ratio="1"
                          :alt="file.file_name"
                          :src="file.file_url"
                          width="50"
                          class="border border-solid border-grey3 cursor-pointer"
                          @click="
                            ticketStore.openModalSolutionAttachmentImg(
                              true,
                              file
                            )
                          "
                        ></lazy-d-img>

                        <div v-if="!file.file_type.includes('image')">
                          <v-icon
                            icon="mdi-file-document-outline"
                            class="text-sc dark:text-primary1"
                            size="50"
                          />
                        </div>

                        <div class="flex flex-col justify-center">
                          <input
                            v-model="file.file_name"
                            class="w-full text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-sc rounded px-1"
                          />
                          <div class="text-xs dark:text-grey1">
                            {{ shortenBytes(file.file_size) }}
                          </div>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <d-bt
                          v-if="file.file_type.includes('image')"
                          icon="mdi-information-outline"
                          is-no-text
                          class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                          icon-class="text-sc dark:text-primary1"
                          rounded="xl"
                          cta="full view"
                          icon-size="16"
                          :loading="loading.imageDownloadLoading"
                          @click="ticketStore.handleViewFullPageFile(file)"
                        ></d-bt>
                        <d-bt
                          icon="mdi-download"
                          is-no-text
                          class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                          icon-class="text-sc dark:text-primary1"
                          rounded="xl"
                          cta="download"
                          icon-size="16"
                          :loading="loading.imageDownloadLoading"
                          @click="ticketStore.handleDownloadFile(file)"
                        ></d-bt>
                        <d-bt
                          @click="
                            ticketStore.handleExistingSolutionFile(file, index)
                          "
                          icon="mdi-delete"
                          is-no-text
                          class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                          icon-class="text-cancel dark:text-primary1"
                          rounded="xl"
                          cta="delete"
                          icon-size="16"
                        ></d-bt>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="flex flex-col gap-2">
              <div>
                <span class="text-sm font-medium dark:text-primary1"
                  >New Files</span
                >
              </div>
              <div class="">
                <div v-if="!form.files">
                  <span
                    class="text-sm font-normal text-grey3 dark:text-primary1"
                    >No files attached</span
                  >
                </div>
                <div
                  v-else
                  class="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2 content-start"
                >
                  <div
                    v-for="(file, index) in form.files"
                    :key="index"
                    class="flex justify-between items-center gap-2 p-2 border border-solid border-grey2 hover:bg-grey2 dark:hover:bg-dark2 rounded-lg"
                  >
                    <div class="flex gap-2">
                      <v-img
                        :aspect-ratio="1"
                        :src="file.url"
                        :alt="file.name"
                        width="50"
                        cover
                        class="border border-solid border-grey3"
                      ></v-img>

                      <div class="flex flex-col justify-center">
                        <span class="text-sm dark:text-primary1">{{
                          file.name
                        }}</span>
                        <span class="text-xs dark:text-grey1">{{
                          shortenBytes(file.size)
                        }}</span>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <d-bt
                        icon="mdi-download"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                        icon-class="text-sc dark:text-primary1"
                        rounded="xl"
                        cta="download"
                        icon-size="16"
                      ></d-bt>
                      <d-bt
                        @click="ticketStore.handleDeleteFile(file, index)"
                        icon="mdi-delete"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                        icon-class="text-cancel dark:text-primary1"
                        rounded="xl"
                        cta="delete"
                        icon-size="16"
                        :is-notif="true"
                        :notif-text="`${file.name} deleted`"
                      ></d-bt>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            </div>

            <div class="flex gap-2 items-center">
              <d-bt
                v-if="!!props.id"
                :cta="'Send Email'"
                :class="
                  classMerge(
                    'h-[2.5rem] px-3 flex gap-3 rounded-lg !bg-sc transition-all ease-in-out hover:!bg-scDarker3 w-max'
                  )
                "
                :text-class="classMerge('text-white mx-auto !font-bold')"
                icon="mdi-email"
                icon-class="text-white"
                type="button"
                @click="ticketStore.sendSolutionEmail()"
              />
              <!-- <d-bt
                v-if="!!props.id"
                :cta="'View Email'"
                :class="
                  classMerge(
                    'h-[2.5rem] px-3 flex gap-3 rounded-lg !bg-primary1 border !border-solid !border-sc transition-all ease-in-out hover:!bg-scLightest w-max dark:!bg-dark1  dark:hover:!bg-dark2'
                  )
                "
                :text-class="
                  classMerge('text-sc dark:text-primary1 mx-auto !font-bold')
                "
                icon="mdi-eye"
                icon-class="text-sc dark:text-primary1"
                type="button"
                @click="isOpenModal.email_view = true"
              /> -->
              <d-ticket-solution-email-button />
            </div>
          </div>
        </div>
        <div v-if="tabFormIndex == useStatics.formTabTicket.remarks">
          <div class="lg:col-span-6">
            <d-text-area-input
              v-model="form.remark"
              :label="`Remark`"
              :placeholder="`Remark`"
              :errors="errors.remark"
            />
          </div>
        </div>
        <div
          v-if="tabFormIndex == useStatics.formTabTicket.schedules"
          class="flex flex-col gap-2"
        >
          <div class="flex gap-2 items-center">
            <d-switch-status
              v-model="form.is_scheduled"
              :label="`Schedule`"
              v-if="!form.is_scheduled"
              :true-value="1"
              :false-value="0"
            />

            <d-bt
              v-if="!form.is_scheduled && form.schedule && form.schedule.id"
              :cta="'Delete Schedule'"
              :class="
                classMerge(
                  'h-[2.5rem] px-2 rounded-lg !bg-sc transition-all ease-in-out hover:!bg-scDarker3'
                )
              "
              :text-class="classMerge('text-white mx-auto !font-bold')"
              :no-icon="true"
              type="button"
              @click="handleUpdateSchedule"
            />
          </div>
          <div v-if="form.is_scheduled && form.schedule != null">
            <div class="grid grid-cols-6 gap-2 items-center content-center">
              <div class="lg:col-span-6">
                <d-text-input
                  v-model="form.schedule.title"
                  :label="`Title`"
                  :placeholder="`Title`"
                  :errors="errors.title"
                />
              </div>

              <!-- assignee_id -->
              <div class="lg:col-span-6">
                <d-autocomplete
                  v-model="form.schedule.assignee_id"
                  :query="{
                    is_active: 1,
                  }"
                  api="/v1/users/index-user"
                  single-api="/v1/users/show-user"
                  page-end-prop="meta.next_page_url"
                  item-title="name"
                  item-value="id"
                  method-api="post"
                  inner-search-key="global"
                  label="Assignee"
                ></d-autocomplete>
              </div>

              <div class="lg:col-span-6">
                <d-date-picker-light
                  v-model="form.schedule.start_at"
                  label="Start Date"
                ></d-date-picker-light>
              </div>
              <div class="lg:col-span-6">
                <d-date-picker-light
                  v-model="form.schedule.end_at"
                  label="End Date"
                ></d-date-picker-light>
              </div>
              <div class="lg:col-span-6 col-span-2 flex gap-2 items-center">
                <v-menu
                  :close-on-content-click="false"
                  no-click-animation
                  :open-delay="0"
                  :close-delay="0"
                  transition="slide-y-transition"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      density="compact"
                      :class="
                        classMerge(
                          'dark:text-white hover:text-gray-500 min-h-[2.5rem] !border border-solid !border-zinc-400 dark:bg-dark3'
                        )
                      "
                      variant="flat"
                    >
                      <span :class="classMerge('text-xs dark:text-primary1')"
                        >Color</span
                      >
                      <div
                        :style="{
                          backgroundColor: form.schedule.color,
                          color: form.schedule.color ? 'white' : 'black',
                        }"
                        class="w-6 h-6 rounded-full border border-solid border-grey2 ml-2"
                      ></div>
                    </v-btn>
                  </template>
                  <v-color-picker
                    show-swatches
                    v-model="form.schedule.color"
                    :modes="['hex']"
                    hide-inputs
                  >
                  </v-color-picker>
                </v-menu>

                <d-bt
                  :cta="'Reset Schedule'"
                  :class="
                    classMerge(
                      '!bg-zinc-200 justify-self-end hover:!bg-grey2 dark:!bg-dark2 gap-1 dark:hover:!bg-dark1 text-sm transition-all ease-in-out !border-2 p-2 rounded-lg !border-zinc-200 dark:border-none w-max'
                    )
                  "
                  :text-class="
                    classMerge('text-scDarker dark:text-white mx-auto')
                  "
                  :icon-class="
                    classMerge('text-scDarker dark:text-white mx-auto')
                  "
                  icon="mdi-refresh"
                  type="button"
                  @click="resetBoard()"
                />

                <d-switch-status
                  v-model="form.is_scheduled"
                  v-if="form.is_scheduled"
                  :true-value="1"
                  :false-value="0"
                  label=""
                />
                <d-bt
                  v-if="!!props.id"
                  :cta="'Update Schedule'"
                  :class="
                    classMerge(
                      'min-h-[2.5rem] px-2 rounded-lg !bg-sc transition-all ease-in-out hover:!bg-scDarker3'
                    )
                  "
                  :text-class="classMerge('text-white mx-auto !font-bold')"
                  :no-icon="true"
                  type="button"
                  @click="handleUpdateSchedule"
                />
                <d-autocomplete-client
                  v-model="form.schedule.steps_id"
                  :items="useInitials.defaultSteps"
                  label="Steps"
                  item-value="id"
                  item-title="name"
                  :clearable="false"
                  disabled
                  max-length-display="90"
                  class="!hidden"
                />
              </div>
            </div>
            <div class="overflow-x-auto">
              <v-skeleton-loader
                height="240"
                type="image"
                :loading="loading.editPageLoading"
              >
                <schedule-ticket-board
                  ref="kanbanBoardExposeRef"
                  class="mt-2"
                  v-if="!loading.editPageLoading"
                />
              </v-skeleton-loader>
            </div>
          </div>
        </div>
      </template>
    </d-form-layout>

    <d-ticket-issue-attachments />
    <d-ticket-solution-attachments />
  </div>
</template>