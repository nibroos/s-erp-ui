<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useTicketStore from "~/stores/supports/TicketStore";
import type {
  FormQuoDtBomListType,
  QuoDtBomType,
  QuoDtType,
} from "~/types/quotations/QuotationType";
import type {
  FormProductCompType,
  ProductBomListType,
} from "~/types/masters/ProductType";
import useCompanyProfileStore from "~/stores/masters/CompanyProfileStore";

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
const { company } = AuthStore();

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
</script>

<template>
  <div>
    <d-bt
      :cta="'View Email'"
      :class="
        classMerge(
          'h-[2.5rem] px-3 flex gap-3 rounded-lg !bg-primary1 border !border-solid !border-sc transition-all ease-in-out hover:!bg-scLightest w-max dark:!bg-dark1  dark:hover:!bg-dark2'
        )
      "
      :text-class="classMerge('text-sc dark:text-primary1 mx-auto !font-bold')"
      icon="mdi-eye"
      icon-class="text-sc dark:text-primary1"
      type="button"
      @click="isOpenModal.email_view = true"
    />

    <modals-final-modal
      :is-open="isOpenModal.email_view"
      size="xl"
      custom-class="overflow-y-auto"
      label="View Email Content"
      parent-class="!z-[1501]"
      @update:is-open="isOpenModal.email_view = $event"
    >
      <div style="width: 100%; height: 100%">
        <div>{{ company.company_name }}</div>
        <div>{{ company.company_address }}</div>
        <div>{{ company.company_email }}</div>
        <div>{{ company.company_website }}</div>
        <div>{{ company.company_phone }}</div>
        <img
          :src="company.company_logo"
          alt="Company Logo"
          width="100"
          height="100"
        />
        <div>Kepada Yth. {{ form?.customer_code }}</div>

        <div>
          {{ form.issue_solution }}
        </div>

        <div>Terima kasih atas kerjasamanya.</div>

        <!-- CTA Contact CS -->
        <a href="https://wa.me/6281212345678" target="_blank">
          Contact CS Yubi
        </a>
      </div>
    </modals-final-modal>
  </div>
</template>

<style scoped>
</style>