<script setup lang="ts">
interface IProps {
  class?: string;
  current?: number;
  tabs?: string[];
}
const props = withDefaults(defineProps<IProps>(), {
  class: "",
  current: 0,
  tabs: () => [],
});

const currentTab = ref<unknown>(props.current);

const emits = defineEmits(["update:current"]);

const handleChange = (value: any) => {
  emits("update:current", value);
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
  <v-tabs
    v-model="currentTab"
    selected-class="text-grey-darken-4"
    center-active
    density="compact"
    :class="[
      props.class,
      'w-full !bg-grey1 dark:!bg-dark2 dark:text-primary1 transition-all ease-in-out',
    ]"
  >
    <v-tab
      v-for="(tab, index) in tabs"
      :key="index"
      :title="tab"
      :value="index"
      slider-color="brown-lighten-1"
      density="compact"
      :class="
        classMerge(
          '!bg-grey1 dark:!bg-dark1 dark:!text-primary1 transition-all ease-in-out',
          currentTab === index
            ? 'bg-white dark:bg-dark1'
            : '!bg-grey1 dark:!bg-dark3'
        )
      "
    >
      {{ tab }}
    </v-tab>
  </v-tabs>
</template>
