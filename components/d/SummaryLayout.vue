<script setup lang="ts">
export type SummaryPartType = {
  label: string;
  value: number | string;
  symbol?: string | null;
  suffix?: string | null;
  noValue?: boolean;
  percentage?: number;
  format: {
    precision: number;
  };
};

export type SummaryLayoutType = Record<string, SummaryPartType>;

const props = defineProps<{
  config?: SummaryLayoutType;
}>();
</script>

<template>
  <div
    v-if="props.config && Object.keys(props.config).length > 0"
    class="grid w-full auto-cols-auto grid-flow-col gap-3 font-medium text-zinc-500 dark:text-primary1"
  >
    <div
      v-for="(value, key) in props.config as Record<string, SummaryPartType>"
      :key="key"
      class="grid grid-cols-2 items-center gap-2"
    >
      <div
        class="whitespace-nowrap bg-zinc-100 dark:bg-dark1 px-2 py-3 text-[14px]"
      >
        {{ value.label }}
        {{ !!value.percentage ? `(${value.percentage} %)` : "" }}
      </div>
      <div class="w-full text-[14px]">
        <d-num-layout
          :symbol="value.symbol ?? ''"
          :value="value.value"
          :no-value="value.noValue"
          :suffix="value.suffix ?? ''"
          :min-precision="value.format?.precision ?? 3"
          :max-precision="value.format?.precision ?? 3"
        />
      </div>
    </div>
  </div>
</template>
