<script setup lang="ts">
import useCustomerStore from "~/stores/masters/CustomerStore";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const customerStore = useCustomerStore();
const { tabFormIndex, form, errors } = storeToRefs(customerStore);

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

const filtersCustomer = ref<FilterSelectableType[]>([
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Address",
    key: "address",
  },
  {
    title: "Customer Type",
    key: "customer_type_ids",
    type: "autocomplete",
    display: "name",
    others: {
      methodApi: "post",
      api: "/v1/customer-types/index-customer-type",
      singleApi: "/v1/customer-types/index-customer-type",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Customer Type",
      innerSearchKey: "global",
    },
  },
]);

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/masters/customers",
  tabs: [],
  currentTab: tabFormIndex.value,
  button: {
    clear: {
      show: true,
    },
  },
  permission: {
    name: ["c_ms"],
    isActive: true,
  },
} as FormLayoutType);

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

  await customerStore.store();
};

const handleClickClear = () => {
  form.value = cloneObject(useInitials.formCustomerCreateEdit);
  errors.value = {};
};

onMounted(() => {
  form.value.id = null;
  handleClickClear();
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <l-top-menu :top-menu="topMenuMasterTab" :parent_link="parentLink">
    </l-top-menu>
    <l-top-menu
      :top-menu="topMenuCustomizationTab"
      parent_link=""
      @update:parent-link="getParentLink"
    >
    </l-top-menu>

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
            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.name"
                :label="`Name`"
                :placeholder="`Name`"
                :errors="[errors.name]"
              >
              </d-text-input>
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.code"
                :label="`Code`"
                :placeholder="`Code`"
                :errors="[errors.code]"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.shortname"
                :label="`Shortname`"
                :placeholder="`Shortname`"
                :errors="[errors.shortname]"
              />
            </div>
            <div class="sm:col-span-1">
              <div class="lg:col-span-3 sm:col-span-6">
                <d-select-table
                  api="/v1/customers/index-customer"
                  detail-api="/v1/customers/index-customer"
                  method-api="post"
                  detail-method-api="post"
                  mapping-detail="data[0]"
                  total-prop="meta.total"
                  label="Agent"
                  v-model="form.agent_id"
                  class="col-span-2 lg:col-span-3 sm:col-span-6"
                  is-quick-select
                  modal-custom-class="!w-4/5"
                  :fields="useStatics.headersCustomer"
                  :filters="useStatics.filtersCustomer"
                />
              </div>
            </div>
            <div class="sm:col-span-1">
              <d-autocomplete
                v-model="form.customer_type_id"
                api="/v1/customer-types/index-customer-type"
                single-api="/v1/customer-types/show-customer-type"
                page-end-prop="meta.next_page_url"
                item-title="name"
                item-value="id"
                method-api="post"
                inner-search-key="global"
                label="Customer Type"
                :errors="errors.customer_type_id"
              ></d-autocomplete>
            </div>
            <div class="sm:col-span-1">
              <d-autocomplete
                v-model="form.currency_id"
                api="/v1/currencies/index-currency"
                single-api="/v1/currencies/show-currency"
                page-end-prop="meta.next_page_url"
                item-title="name"
                item-value="id"
                method-api="post"
                inner-search-key="global"
                label="Currency"
                :errors="errors.currency_id"
              ></d-autocomplete>
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.pic"
                :label="`PIC`"
                :placeholder="`PIC`"
                :errors="[errors.pic]"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.phone"
                :label="`Phone`"
                :placeholder="`Phone`"
                :type="'phone'"
                :errors="[errors.phone]"
              />
            </div>
            <div class="sm:col-span-1">
              <d-text-input
                v-model="form.email"
                :label="`Email`"
                :placeholder="`Email`"
                :errors="[errors.email]"
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
                v-model="form.address"
                :label="``"
                :placeholder="`Address`"
                class=""
                :auto-grow="false"
                :rows="3"
              />
            </div>
            <div class="sm:col-span-1 col-span-3">
              <d-text-area-input
                v-model="form.remark"
                :label="``"
                :placeholder="`Remark`"
                class=""
                :auto-grow="false"
                :rows="3"
              />
            </div>
            <div class="sm:col-span-1">
              <d-switch-status v-model="form.status" :label="`Status`" />
            </div>
          </div>
          <d-button type="submit" class="!hidden"></d-button>
        </form>
      </template>
      <!-- <template #content> </template> -->
    </d-form-layout>
  </div>
</template>