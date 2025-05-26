<script setup lang="ts">
import useCustomerStore from "~/stores/masters/CustomerStore";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type { FormProductCompType } from "~/types/masters/ProductType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const props = withDefaults(defineProps<FormProductCompType>(), {
  id: null,
  isOpen: false,
});

const emits = defineEmits(["submit:form", "update:isOpen"]);

const isOpen = ref(props.isOpen);

const customerStore = useCustomerStore();
const {
  tabFormIndex,
  form,
  errors,
  metaModal,
  itemsCheck,
  queryModal,
  optionRefBtn,
} = storeToRefs(customerStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Create Customer",
});

const parentLink = ref("");
const getParentLink = (link: string) => {
  parentLink.value = link;
};

const headersCustomer = ref<FieldSelectableType[]>([
  {
    title: "Name",
    key: "name",
    value: "name",
    align: "start",
    sortable: true,
  },
  {
    title: "Shortname",
    key: "shortname",
    value: "shortname",
    align: "start",
    sortable: true,
  },
  {
    title: "Code",
    key: "code",
    value: "code",
    align: "start",
    sortable: true,
  },
  {
    title: "Phone",
    key: "phone",
    value: "phone",
    align: "start",
    sortable: true,
  },
  {
    title: "Email",
    key: "email",
    value: "email",
    align: "start",
    sortable: true,
  },
  {
    title: "Address",
    key: "address",
    value: "address",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer Type",
    key: "customer_type_name",
    value: "customer_type_name",
    align: "start",
    sortable: true,
  },
]);

const headersSoftware = ref<FieldSelectableType[]>([
  {
    title: "Solution",
    key: "product_id",
    value: "product_id",
    align: "start",
    sortable: true,
  },
  {
    title: "Agreement Date",
    key: "agree_at",
    value: "agree_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Contract Due Date",
    key: "due_at",
    value: "due_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Price",
    key: "price",
    value: "price",
    align: "start",
    sortable: true,
  },
  {
    title: "Payment Type",
    key: "payment_type_id",
    value: "payment_type_id",
    align: "start",
    sortable: true,
  },
  {
    key: "action",
    title: "Action",
    sortable: false,
    headerProps: { class: "cursor-pointer action-table sticky-right" },
    cellProps: {
      class: "action-table sticky-right",
    },
  },
]);

const headersHardware = ref<FieldSelectableType[]>([
  {
    title: "Product Name",
    key: "product_id",
    value: "product_id",
    align: "start",
    sortable: true,
  },
  {
    title: "Qty Installed",
    key: "qty",
    value: "qty",
    align: "start",
    sortable: true,
  },
  {
    title: "Installation Date",
    key: "installation_at",
    value: "installation_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Warranty Date",
    key: "warranty_at",
    value: "warranty_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Remark",
    key: "remark",
    value: "remark",
    align: "start",
    sortable: true,
  },
  {
    key: "action",
    title: "Action",
    sortable: false,
    headerProps: { class: "cursor-pointer action-table sticky-right" },
    cellProps: {
      class: "action-table sticky-right",
    },
  },
]);

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/crm/customers",
  tabs: [],
  currentTab: tabFormIndex.value,
  // mode: "edit",
  button: {
    create: {
      show: false,
      // cta: "Create New",
      path: "/crm/customers/create",
    },
    save: {
      show: true,
      loading: false,
      type: "submit",
    },
    clear: {
      show: true,
      loading: false,
    },
  },
  permission: {
    name: ["c_ms"],
    isActive: true,
  },
} as FormLayoutType);

const initialFormLayout = () => {
  formLayout.value.currentTab = tabFormIndex.value;
  formLayout.value.button = {
    create: {
      show: true,
      cta: "Create New",
      path: "/crm/customers/create",
    },
    cancel: {
      show: false,
    },
    save: {
      show: true,
      loading: false,
      type: "submit",
    },
    clear: {
      show: true,
    },
  };

  if (!!props.id) {
    formLayout.value.mode = "edit";

    if (!!formLayout.value.button?.save && !!formLayout.value.button.create) {
      formLayout.value.button.save.cta = "Update";
      formLayout.value.button.create.show = true;
    }
  }
};

// const formSchema = z.object({
//   name: customRules.required("name", form.value.name),
//   item_group_id: customRules.required(
//     "item_group_id",
//     form.value.item_group_id
//   ),
// });

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
  form.value.is_crm = 1;

  try {
    await customerStore.update().then((res) => {
      isOpen.value = false;
      emits("submit:form", res);

      // if (props.type === "page") {
      //   navigateTo(`/crm/customers`);
      // }

      navigateTo(`/crm/customers`);
    });
  } catch (error) {
    console.error("Validation error:", error);
  }
};

const handleClickClear = () => {
  form.value = cloneObject(useInitials.formCustomerCreateEdit);
  itemsCheck.value.checkMainSoftwareProducts = [];
  itemsCheck.value.checkMainHardwareProducts = [];
  errors.value = {};
};

const isShowHeaderSoftware = ref(true);
const isShowHeaderHardware = ref(true);

const router = useRouter();

watch(
  () => isOpen.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      emits("update:isOpen", newVal);
    }
  },
  { immediate: true }
);

const labelForm = ref("Add Sales Order");
const initialEmails = () => {
  form.value.pic_emails = [];
  console.log("form.value.pic_emails", form.value.pic_emails);
  // insert 10 empty objects into the form
  for (let i = 0; i < 10; i++) {
    console.log("form.value.pic_emails 1", i);
    form.value.pic_emails.push({
      id: null,
      name: "",
      is_main: 0,
    });
  }
};

const addNewRow = (type: "software" | "hardware") => {
  if (type === "software") {
    itemsCheck.value.checkMainSoftwareProducts.push({
      id: null,
      name: "",
      is_main: 0,
    });
  } else if (type === "hardware") {
    itemsCheck.value.checkMainHardwareProducts.push({
      id: null,
      name: "",
      is_main: 0,
    });
  }
};

const onClickSelectedCustomer = (item: any) => {
  console.log("onClickSelected", item);
  if (!props.id) {
    console.log("onClickSelected B", item);
    form.value = {
      ...item,
    };

    itemsCheck.value.checkMainSoftwareProducts = item.customer_contracts.filter(
      (item: any) => item.item_group_name.toLowerCase() == "software"
    );
    itemsCheck.value.checkMainHardwareProducts = item.customer_contracts.filter(
      (item: any) => item.item_group_name.toLowerCase() == "hardware"
    );
  }
};

watch(
  () => form.value.pic_emails,
  (newVal) => {
    if (!newVal || newVal.length == 0) {
      // for 10x
      let emails = [];
      for (let i = 0; i < 10; i++) {
        emails.push({
          id: null,
          name: "-",
          is_main: 0,
        });
      }

      form.value.pic_emails = emails;
    }
  },
  { deep: true }
);

watch(
  () => itemsCheck.value.checkMainSoftwareProducts,
  (newVal) => {
    if (newVal.length == 0) {
      itemsCheck.value.checkMainSoftwareProducts.push({
        id: null,
        product_id: null,
        item_name: "",
        is_main: 0,
      });
    }
  },
  { deep: true }
);

watch(
  () => itemsCheck.value.checkMainHardwareProducts,
  (newVal) => {
    if (newVal.length == 0) {
      itemsCheck.value.checkMainHardwareProducts.push({
        id: null,
        product_id: null,
        item_name: "",
        is_main: 0,
      });
    }
  },
  { deep: true }
);

onMounted(async () => {
  handleClickClear();
  form.value.id = Number(router.currentRoute.value.params.id);
  // initialEmails();

  if (!!props.id) {
    initialFormLayout();
    form.value.id = Number(props.id);
    labelForm.value = "Edit Customer";
    formLayout.value.mode = "edit";

    useHead({
      title: "Edit Customer",
    });
  }

  if (!!form.value.id) {
    Promise.all([customerStore.show()]);
  }
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="handleClickClear"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #header>
        <form
          class="w-full flex flex-col gap-2"
          @submit.prevent="handleSubmit()"
        >
          <div
            :class="
              classMerge(
                'grid grid-cols-6 gap-2',
                Object.keys(errors).length > 0
                  ? '!items-start'
                  : '!items-center'
              )
            "
          >
            <div class="sm:col-span-1">
              <d-select-table
                api="/v1/customers/index-customer"
                detail-api="/v1/customers/show-customer"
                method-api="post"
                detail-method-api="post"
                mapping-detail="data[0]"
                total-prop="meta.total"
                label="Customer"
                v-model="form.id"
                :query="{
                  is_crm: 0,
                  is_active: 1,
                }"
                class="col-span-2 lg:col-span-1"
                is-quick-select
                is-initial-load
                modal-custom-class="!w-4/5"
                max-length-display="50"
                :fields="useStatics.headersCustomer"
                :filters="useStatics.filtersCustomer"
                :disabled="!!props.id"
                @click:selected-detail="
                  (item: any) => {
                    onClickSelectedCustomer(item);
                  }
                "
              />
            </div>
            <div class="sm:col-span-1 col-span-2">
              <d-text-area-input
                v-model="form.address"
                :label="`Address`"
                :placeholder="`Address`"
                class=""
                :auto-grow="false"
                disabled
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.phone"
                :label="`Phone`"
                :placeholder="`Phone`"
                :type="'phone'"
                disabled
                :errors="[errors.phone]"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.email"
                :label="`Email`"
                :placeholder="`Email`"
                disabled
                :errors="[errors.email]"
                :type="'email'"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.pic"
                :label="`PIC`"
                :placeholder="`PIC`"
                disabled
                :errors="[errors.pic]"
              />
            </div>

            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.owner_name"
                :label="`Owner Name`"
                :placeholder="`Owner Name`"
                :errors="[errors.owner_name]"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.owner_phone"
                :label="`Owner Phone`"
                :placeholder="`Owner Phone`"
                :errors="[errors.owner_phone]"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.owner_email"
                :label="`Owner Email`"
                :placeholder="`Owner Email`"
                :errors="[errors.owner_email]"
                :type="'email'"
              />
            </div>

            <div class="sm:col-span-1">
              <d-autocomplete
                v-model="form.category_type_id"
                :query="{
                  is_active: 1,
                }"
                api="/v1/category-types/index-category-type"
                single-api="/v1/category-types/show-category-type"
                page-end-prop="meta.next_page_url"
                item-title="name"
                item-value="id"
                method-api="post"
                inner-search-key="global"
                label="Category Type"
                :errors="errors.category_type_id"
              ></d-autocomplete>
            </div>
            <div class="sm:col-span-1">
              <d-date-picker-light
                v-model="form.contract_date"
                label="Contract Date"
              ></d-date-picker-light>
            </div>

            <div class="sm:col-span-1">
              <d-switch-status
                v-model="form.is_contract"
                :label="`Contract`"
                :true-value="1"
                :false-value="0"
              />
            </div>

            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.pic_name"
                :label="`PIC Name`"
                :placeholder="`PIC Name`"
                :errors="[errors.pic_name]"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.pic_phone"
                :label="`PIC Phone`"
                :placeholder="`PIC Phone`"
                :errors="[errors.pic_phone]"
              />
            </div>
            <div v-for="(item, index) in form.pic_emails" class="sm:col-span-1">
              <d-text-input
                v-model="item.name"
                :label="`PIC Email ${index + 1}`"
                :placeholder="`PIC Email ${index + 1}`"
                :errors="[errors.pic_email]"
                :type="'email'"
              />
            </div>
          </div>

          <div
            :class="
              classMerge(
                'grid grid-cols-6 gap-2',
                Object.keys(errors).length > 0
                  ? '!items-start'
                  : '!items-center'
              )
            "
          >
            <div class="sm:col-span-1 col-span-3">
              <d-text-area-input
                v-model="form.remark"
                :label="`Remark`"
                :placeholder="`Remark`"
                class=""
                :auto-grow="false"
              />
            </div>
          </div>
          <d-button type="submit" class="!hidden"></d-button>
        </form>
      </template>
      <div class="flex flex-col gap-3">
        <div
          :class="
            classMerge(
              'overflow-y-auto p-3 relative !border border-solid border-zinc-400 dark:border-dark1'
            )
          "
        >
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <d-button
                  @click="isShowHeaderSoftware = !isShowHeaderSoftware"
                  icon="mdi-eye-off"
                  is-no-text
                  class="p-1 dark:bg-transparent rounded-full ease-in-out transition-all hover:bg-scDarker3 dark:hover:bg-zinc-600 !bg-sc"
                  text-class="text-zinc-100 dark:text-primary1"
                  icon-class="text-zinc-100 dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="show/hide column"
                  icon-size="18"
                ></d-button>
                <h3 class="text-lg font-semibold dark:text-white">
                  Solution Information
                </h3>
              </div>
              <div class="flex gap-2 items-center">
                <d-option-ref-btn
                  :refs="optionRefBtn.software"
                  class="col-span-2"
                  @click:ref="
                    () => {
                      addNewRow('software');
                    }
                  "
                >
                </d-option-ref-btn>
              </div>
            </div>

            <v-data-table-virtual
              v-if="isShowHeaderSoftware"
              :items="itemsCheck.checkMainSoftwareProducts ?? []"
              :headers="headersSoftware"
              item-value="uid"
              density="compact"
              height="200"
              fixed-header
              :class="
                classMerge(
                  'col-span-3 sm:col-span-1 table-hover'
                  // isShowHeaderSoftware ? '' : 'hidden'
                )
              "
              :header-props="{
                class: '!bg-scLightest dark:!bg-scDarker whitespace-nowrap',
              }"
              :row-props="{
                class: 'whitespace-nowrap',
              }"
            >
              <template #item.product_id="{ item }">
                <d-select-table
                  api="/v1/products/index-product"
                  detail-api="/v1/products/index-product"
                  is-quick-select
                  method-api="post"
                  detail-method-api="post"
                  mapping-detail="data[0]"
                  total-prop="meta.total"
                  label="Solution"
                  v-model="item.product_id"
                  class=""
                  :query="{
                    prod_type: 'product',
                    group_type: 'Software',
                  }"
                  :return-object="false"
                  is-initial-load
                  modal-custom-class="!w-4/5"
                  :fields="useInitials.productFieldsFilterConfig.fields"
                  :filters="useInitials.productFieldsFilterConfig.filters"
                />
              </template>
              <template #item.price="{ item }">
                <d-num-v-format
                  v-model="item.price"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  label=""
                  class="w-full"
                />
              </template>
              <template #item.payment_type_id="{ item }">
                <d-autocomplete
                  v-model="item.payment_type_id"
                  :query="{
                    is_active: 1,
                  }"
                  api="/v1/payment-types/index-payment-type"
                  single-api="/v1/payment-types/show-payment-type"
                  page-end-prop="meta.next_page_url"
                  item-title="name"
                  item-value="id"
                  method-api="post"
                  inner-search-key="global"
                  label=""
                  :errors="errors.payment_type_id"
                ></d-autocomplete>
              </template>
              <template #item.agree_at="{ item }">
                <div class="!w-full">
                  <d-date-picker-light
                    v-model="item.agree_at"
                    label=""
                    placeholder="Agreement Date"
                    dp-class="!w-full"
                  ></d-date-picker-light>
                </div>
              </template>
              <template #item.due_at="{ item }">
                <div class="!w-full">
                  <d-date-picker-light
                    v-model="item.due_at"
                    label=""
                    placeholder="Due Date"
                    dp-class="!w-full"
                  ></d-date-picker-light>
                </div>
              </template>
              <template #item.remark="{ item }">
                <d-text-area-input
                  v-model="item.remark"
                  :label="``"
                  :placeholder="`Remark`"
                  class="w-full"
                />
              </template>
              <template #item.action="{ item, index }">
                <div class="action-button flex gap-2">
                  <d-bt
                    @click="
                      () => {
                        customerStore.onClickDeleteSelected(
                          item,
                          index,
                          'software'
                        );
                      }
                    "
                    icon="mdi-delete"
                    is-no-text
                    class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                    icon-class="text-cancel dark:text-primary1"
                    rounded="xl"
                    size=""
                    cta="delete"
                    icon-size="16"
                    :is-notif="true"
                    :notif-text="`${item.name ?? item.item_name} deleted`"
                  ></d-bt>
                </div>
              </template>
            </v-data-table-virtual>
          </div>
        </div>

        <div
          :class="
            classMerge(
              'overflow-y-auto p-3 relative !border border-solid border-zinc-400 dark:border-dark1'
            )
          "
        >
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <div class="flex gap-2 items-center">
                <d-button
                  @click="isShowHeaderHardware = !isShowHeaderHardware"
                  icon="mdi-eye-off"
                  is-no-text
                  class="p-1 dark:bg-transparent rounded-full ease-in-out transition-all hover:bg-scDarker3 dark:hover:bg-zinc-600 !bg-sc"
                  text-class="text-zinc-100 dark:text-primary1"
                  icon-class="text-zinc-100 dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="show/hide column"
                  icon-size="18"
                ></d-button>
                <h3 class="text-lg font-semibold dark:text-white">
                  Hardware Information
                </h3>
              </div>
              <div class="flex gap-2 items-center">
                <d-option-ref-btn
                  :refs="optionRefBtn.hardware"
                  class="col-span-2"
                  @click:ref="
                    () => {
                      addNewRow('hardware');
                    }
                  "
                >
                </d-option-ref-btn>
              </div>
            </div>
            <v-data-table-virtual
              v-if="isShowHeaderHardware"
              :items="itemsCheck.checkMainHardwareProducts ?? []"
              :headers="headersHardware"
              item-value="uid"
              density="compact"
              height="200"
              fixed-header
              :class="
                classMerge(
                  'col-span-3 sm:col-span-1 table-hover'
                  // isShowHeaderHardware ? '' : 'hidden'
                )
              "
              :header-props="{
                class: '!bg-scLightest dark:!bg-scDarker whitespace-nowrap',
              }"
              :row-props="{
                class: 'whitespace-nowrap',
              }"
            >
              <template #item.product_id="{ item }">
                <d-select-table
                  api="/v1/products/index-product"
                  detail-api="/v1/products/index-product"
                  is-quick-select
                  method-api="post"
                  detail-method-api="post"
                  mapping-detail="data[0]"
                  total-prop="meta.total"
                  label="Hardware"
                  v-model="item.product_id"
                  class=""
                  :query="{
                    prod_type: 'product',
                    group_type: 'Hardware',
                  }"
                  :return-object="false"
                  is-initial-load
                  modal-custom-class="!w-4/5"
                  :fields="useInitials.productFieldsFilterConfig.fields"
                  :filters="useInitials.productFieldsFilterConfig.filters"
                />
              </template>
              <template #item.qty="{ item }">
                <d-num-v-format
                  v-model="item.qty"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  label=""
                  class="w-full"
                />
              </template>
              <template #item.installation_at="{ item }">
                <div class="!w-full">
                  <d-date-picker-light
                    v-model="item.installation_at"
                    label=""
                    placeholder="Installation Date"
                    dp-class="!w-full"
                  ></d-date-picker-light>
                </div>
              </template>
              <template #item.warranty_at="{ item }">
                <div class="!w-full">
                  <d-date-picker-light
                    v-model="item.warranty_at"
                    label=""
                    placeholder="Warranty Date"
                    dp-class="!w-full"
                  ></d-date-picker-light>
                </div>
              </template>
              <template #item.remark="{ item }">
                <d-text-area-input
                  v-model="item.remark"
                  :label="``"
                  :placeholder="`Remark`"
                  class="w-full"
                />
              </template>
              <template #item.action="{ item, index }">
                <div class="action-button flex gap-2">
                  <d-bt
                    @click="
                      () => {
                        customerStore.onClickDeleteSelected(
                          item,
                          index,
                          'hardware'
                        );
                      }
                    "
                    icon="mdi-delete"
                    is-no-text
                    class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                    icon-class="text-cancel dark:text-primary1"
                    rounded="xl"
                    size=""
                    cta="delete"
                    icon-size="16"
                    :is-notif="true"
                    :notif-text="`${item.name ?? item.item_name} deleted`"
                  ></d-bt>
                </div>
              </template>
            </v-data-table-virtual>
          </div>
        </div>
      </div>
    </d-form-layout>
  </div>
</template>