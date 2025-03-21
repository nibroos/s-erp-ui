<script setup lang="ts">
import useIOTypeStore from "~/stores/masters/IOTypeStore";
import type { FormLayoutType } from "~/types/FormLayoutType";

const ioTypeStore = useIOTypeStore();
const { tabFormIndex, form, errors } = storeToRefs(ioTypeStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit IO Types",
});

const parentLink = ref("");
const getParentLink = (link: string) => {
  parentLink.value = link;
};

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/masters/customizations/io-types",
  mode: "edit",
  currentTab: tabFormIndex.value,
  button: {
    create: {
      show: true,
      cta: "Create New",
      path: "/masters/customizations/io-types/create",
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
    name: ["u_ms"],
    isActive: true,
  },
} as FormLayoutType);

const typeOptions = ref([
  { text: 'INVENTORY', value: 'INVENTORY' },
]);

const ioTypeOptions = ref([
  { text: 'INVENTORY_IN', value: 'INVENTORY_IN' },
  { text: 'INVENTORY_OUT', value: 'INVENTORY_OUT' },
]);

const handleSubmit = async () => {
  await ioTypeStore.update();
};

const handleClickClear = () => {
  form.value = cloneObject(useInitials.formIOTypeCreateEdit);
  errors.value = {};
};

const router = useRouter();

watch(() => form.value.io_type, (newIoType) => {
  if (newIoType === 'INVENTORY_IN') {
    form.value.group_id = 36;
  } else if (newIoType === 'INVENTORY_OUT') {
    form.value.group_id = 37;
  }
});

onMounted(async () => {
  form.value.id = Number(router.currentRoute.value.params.id);
  Promise.all([ioTypeStore.show()]);
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
          :class="
            classMerge(
              'grid grid-cols-7 gap-2',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit()"
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
          <div class="sm:col-span-1 flex flex-col">
            <d-text-input
              v-model="form.code"
              :label="`Code`"
              :placeholder="`Code`"
              :errors="[errors.code]"
            >
            </d-text-input>
          </div>
          <div class="sm:col-span-1 flex flex-col">
            <d-autocomplete-client
              v-model="form.type"
              :label="`Type`"
              :placeholder="`Select type`"
              :errors="[errors.type]"
              :items="typeOptions"
              item-title="text"
              item-value="value"
              :return-object="false"
              clearable
            >
            </d-autocomplete-client>
          </div>
          <div class="sm:col-span-1 flex flex-col">
            <d-autocomplete-client
              v-model="form.io_type"
              :label="`In/Out Type`"
              :placeholder="`Select in/out type`"
              :errors="[errors.io_type]"
              :items="ioTypeOptions"
              item-title="text"
              item-value="value"
              :return-object="false"
              clearable
            >
            </d-autocomplete-client>
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.description"
              :label="`Description`"
              :placeholder="`Description`"
              :errors="[errors.description]"
            />
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.remark"
              :label="`Remark`"
              :placeholder="`Remark`"
              :errors="[errors.remark]"
            />
          </div>
          <div class="sm:col-span-1">
            <d-switch-status
              v-model="form.status"
              :label="`Status`"
              :true-value="1"
              :false-value="0"
            />
          </div>
          <input type="hidden" v-model="form.group_id" />
          <d-button type="submit" class="!hidden"></d-button>
        </form>
      </template>
    </d-form-layout>
  </div>
</template>
