<script setup lang="ts">
import type { OptionRefBtnType } from "~/types/components/OptionRefBtnType";

const props = withDefaults(defineProps<OptionRefBtnType>(), {
  class: "",
  current: 0,
  refs: () => [],
});

const currentTab = ref<unknown>(props.current);

const emits = defineEmits(["update:current", "update:refs", "click:ref"]);

const handleChange = (value: any) => {
  emits("update:current", value);
};

const onClick = (ref: any) => {
  emits("click:ref", ref);
};

onMounted(() => {
  currentTab.value = props.current;
});

watch(
  () => currentTab.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      handleChange(newVal);
    }
  }
);
</script>

<template>
  <div :class="classMerge('flex', props.class)">
    <d-bt
      v-for="(ref, index) in props.refs"
      :key="index"
      :class="
        classMerge(
          '!border !border-solid p-2 gap-1 text-dark1 !border-grey3 dark:border-dark1 transition-all ease-in-out dark:bg-dark2 dark:hover:bg-dark1 dark:text-primary1',
          index == 0 ? 'rounded-l-lg' : '',
          index == refs.length - 1 ? 'rounded-r-lg' : '',
          ref.class
        )
      "
      :text-class="classMerge('text-sm font-normal gap-1', ref.textClass)"
      :icon-class="classMerge('text-dark1', ref.iconClass)"
      :icon="ref.icon"
      :type="ref.type"
      :cta="ref.cta"
      :disabled="ref.disabled"
      :loading="ref.loading"
      @click="() => onClick(ref)"
    >
      <template #append-cta="{ item }">
        <slot :name="`append-cta-${ref.key}`" :item="item">
          ({{ ref.count }})
        </slot>
      </template>
    </d-bt>
  </div>
</template>
