<script setup lang="ts">
import useWarehouseStore from "~/stores/masters/WarehouseStore";
import type { FormLayoutType } from "~/types/FormLayoutType";

const warehouseStore = useWarehouseStore();
const { tabFormIndex, form, errors } = storeToRefs(warehouseStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Create Warehouses",
});

const parentLink = ref("");
const getParentLink = (link: string) => {
  parentLink.value = link;
};

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/masters/warehouses",
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

const handleSubmit = async () => {
  await warehouseStore.store();
};

const handleClickClear = () => {
  form.value = cloneObject(useInitials.formWarehouseCreateEdit);
  errors.value = {};
};

onMounted(() => {
  handleClickClear();
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <l-top-menu :top-menu="topMenuMasterTab" :parent_link="parentLink">
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
              'grid grid-cols-6 gap-2',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
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
              :placeholder="`code`"
              :errors="[errors.code]"
            >
            </d-text-input>
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
            <d-switch-status v-model="form.status" :label="`Status`" />
          </div>
          <d-button type="submit" class="!hidden"></d-button>
        </form>
      </template>
    </d-form-layout>
  </div>
</template>
