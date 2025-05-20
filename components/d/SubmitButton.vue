<script setup lang="ts">
import { classMerge } from "#imports";

type IProps = {
  class?: string;
  submitClass?: string;
  clearClass?: string;
  csvClass?: string;
};

const props = withDefaults(defineProps<IProps>(), {
  class: "",
  submitClass: "",
  clearClass: "",
  csvClass: "",
});

const emits = defineEmits(["click:submit", "click:clear", "click:csv"]);
const handleClickSubmit = () => {
  emits("click:submit");
};

const handleClickClear = () => {
  emits("click:clear");
};

const handleClickCsv = () => {
  emits("click:csv");
};
</script>

<template>
  <div :class="classMerge('grid grid-cols-6 items-stretch gap-2', props.class)">
    <!-- <v-btn
      variant="tonal"
      height="35"
      density="comfortable"
      append-icon="mdi-magnify"
      class="text-none grow"
      rounded="sm"
      color="#006C9C"
      type="submit"
      @click="handleClickSubmit()"
    >
      Find
    </v-btn> -->
    <div class="grid grid-cols-7 gap-2 items-stretch col-span-3 sm:col-span-6">
      <d-button
        :cta="'Find'"
        :class="
          classMerge(
            '!bg-sc hover:!bg-scDarker col-span-3 text-white grow text-sm transition-all ease-in-out border-1.5 p-2 rounded-lg ',
            props.submitClass
          )
        "
        :text-class="classMerge('text-white mx-auto')"
        type="submit"
        size="xl"
        @click="handleClickSubmit()"
        icon="mdi-magnify"
      />
      <d-button
        :cta="'Clear'"
        :class="
          classMerge(
            'dark:!bg-dark2 hover:bg-scLightest col-span-2 !gap-6 grow dark:hover:!bg-dark1 text-sm transition-all ease-in-out !border-2 p-2 rounded-lg !border-solid !border-sc dark:!border-dark2 ',
            props.clearClass
          )
        "
        :text-class="classMerge('text-scDarker dark:text-white mx-auto')"
        icon-class="text-scDarker dark:text-white"
        type="button"
        size="xl"
        @click="handleClickClear()"
        icon="mdi-refresh"
      />
      <d-button
        :cta="'Download CSV'"
        :class="
          classMerge(
            'dark:!bg-dark2 hover:bg-[#b8fcdc] col-span-2 !gap-6 grow dark:hover:!bg-dark1 text-sm transition-all ease-in-out !border-2 p-2 rounded-lg !border-solid !border-[#198754] dark:!border-[#198754] ',
            props.csvClass
          )
        "
        :text-class="classMerge('text-[#198754] mx-auto')"
        :icon-class="'text-[#198754] dark:text-[#198754]'"
        type="button"
        size="xl"
        @click="handleClickCsv()"
        icon="mdi-file-table-outline"
      />
    </div>

    <slot name="append" />
  </div>
</template>
