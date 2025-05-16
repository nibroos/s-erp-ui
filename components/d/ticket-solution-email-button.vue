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
import { VuetifyViewer } from "vuetify-pro-tiptap";

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
const authStore = AuthStore();
const { company } = storeToRefs(authStore);

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
      <!-- <div style="width: 100%; height: 100%">
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

        <a href="https://wa.me/6281212345678" target="_blank">
          Contact CS Yubi
        </a>
      </div> -->
      <!-- <div class="email-container">
        <div class="email-header">
          <div class="company-name">PT Yubi Technology</div>
          <div class="company-details">
            Casing Bukit Group Block, G5 Stop Sealing, Jkt Utava, DKJ Jakarta
            14240<br />
            msengroup.aldnet.com | www.yubiteck.com<br />
            +62 21 - 224520281931 +62 815 1002 0656
          </div>
        </div>

        <div class="email-body">
          <div class="recipient">Kepada Yth. Tim PT Global Komputama,</div>

          <div class="greeting">Dengan hormat,</div>

          <div class="solution-content">
            <div class="solution-title">
              Solusi untuk Masalah Sinkronisasi Data
            </div>

            <div class="solution-details">
              Kami informasikan bahwa sejak pukul 08.00 WIB telah terjadi
              gangquan pada proses pemanggilan API, yang menyebabkan
              sinkronisasi data otomatis mengalami kegagalan, sehingga data
              laporan tidak tampil di dashboard.
            </div>

            <div class="status-update">
              <strong>Tindakan yang telah dilakukan:</strong><br />
              Tim teknis kami telah melakukan tindakan perbalkan dengan
              melakukan refresh database dan restart pada job scheduler.

              <div class="status-resolved" style="margin-top: 10px">
                Saat ini, fungsi sinkronisasi telah kembali normal, dan data
                laporan sudah dapat diakses seperti biasa di dashboard.
              </div>
            </div>

            <p>
              Kami mohon maaf atas kelidaknyamanan yang tempat ditimbulkan, dan
              kami berkomitmen untuk terus menjaga stabilitas sistem.
            </p>
          </div>
        </div>

        <div class="email-footer">
          <div class="signature">
            Hormat kami,<br />
            <strong>{{ company.company_name }}</strong
            ><br />
            Customer Support
          </div>

          <a href="https://wa.me/6281510020656" class="cta-button">
            Contact CS 👋
          </a>

          <div class="contact-info">
            Untuk pertanyaan lebih lanjut, hubungi kami di
            {{ company.company_phone }} atau email {{ company.company_email }}.
          </div>
        </div>
      </div> -->
      <div class="email-container">
        <!-- Header -->
        <div class="email-header">
          <div class="company-name">{{ company.company_name }}</div>
          <div class="company-details">
            <div style="color: gray">
              {{ company.company_address }}
            </div>
            <div style="color: black; margin-top: 0.5rem">
              {{ company.company_website }}
            </div>
            <div style="color: black">{{ company.company_phone }}</div>
          </div>
        </div>

        <!-- Body -->
        <div class="email-body">
          <div class="recipient">Kepada Yth. {{ form.customer_name }},</div>

          <div class="greeting">Dengan hormat,</div>

          <p>Berikut adalah detail laporan masalah dan tanggapan kami:</p>

          <!-- Accordion Section -->
          <div class="accordion">
            <!-- Client Issue -->
            <div class="accordion-section">
              <strong>Laporan Masalah</strong>
              <div class="issue-content">
                <div class="timestamp">
                  Dilaporkan pada: {{ form.reported_at }}
                </div>
                <d-rich-text
                  v-model="form.issue_desc"
                  disabled
                  readonly
                  hide-toolbar
                />
              </div>
            </div>

            <!-- Your Response -->
            <div class="accordion-section" style="margin-top: 1rem">
              <strong>Tanggapan & Solusi</strong>
              <div class="solution-content">
                <div class="timestamp">
                  Ditangani pada: {{ form.updated_at }}
                </div>
                <d-rich-text
                  v-model="form.issue_solution"
                  disabled
                  readonly
                  hide-toolbar
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="email-footer">
          <div class="signature">
            Hormat kami,<br />
            <strong>{{ company.company_name }}</strong
            ><br />
          </div>

          <a href="https://wa.me/6281510020656" class="cta-button">
            Hubungi CS 👋
          </a>

          <div class="contact-info">
            Untuk pertanyaan lebih lanjut, hubungi kami di
            {{ company.company_phone }} atau email {{ company.company_email }}.
          </div>
        </div>
      </div>
    </modals-final-modal>
  </div>
</template>

<!-- <style scoped>
/* Base Styles */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

/* Email Container */
.email-container {
  max-width: 600px;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Header */
.email-header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  border-bottom: 4px solid #3498db;
}

.company-logo {
  max-width: 120px;
  height: auto;
  margin-bottom: 15px;
}

.company-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 5px;
}

.company-details {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 5px;
  line-height: 1.4;
}

/* Body */
.email-body {
  padding: 25px;
}

.recipient {
  font-weight: 600;
  margin-bottom: 20px;
}

.greeting {
  margin-bottom: 15px;
}

.solution-content {
  margin-bottom: 25px;
}

.solution-title {
  color: #3498db;
  font-weight: 600;
  margin-bottom: 10px;
}

.solution-details {
  background-color: #f8f9fa;
  padding: 15px;
  border-left: 3px solid #3498db;
  margin: 15px 0;
  border-radius: 0 4px 4px 0;
}

.status-update {
  background-color: #e8f4fd;
  padding: 12px;
  border-radius: 4px;
  margin: 15px 0;
  font-size: 14px;
}

.status-resolved {
  color: #27ae60;
  font-weight: 600;
}

/* Footer */
.email-footer {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #eaeaea;
}

.signature {
  margin-bottom: 20px;
}

.cta-button {
  display: inline-block;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-weight: 600;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
}

.contact-info {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 15px;
}
</style> -->
<style scoped>
/* Base Styles */
/* Base Styles */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

/* Email Container */
.email-container {
  max-width: 1500px;
  margin: 20px auto;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Header */
.email-header {
  padding: 20px;
  border-top: 4px dotted #e4e4e7;
  border-bottom: 4px dotted #e4e4e7;
}

.company-name {
  font-size: 22px;
  color: #3498db;
  font-weight: 700;
  margin-bottom: 5px;
}

.company-details {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 5px;
  line-height: 1.4;
}

/* Body */
.email-body {
  padding: 25px;
}

.recipient {
  font-weight: 600;
  margin-bottom: 20px;
}

.greeting {
  margin-bottom: 15px;
}

/* Accordion Styles */
.accordion {
  margin: 20px 0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.accordion-section {
  margin: 0 0 0 0;
  /* border-bottom: 1px solid #eaeaea; */
}

.accordion-section:last-child {
  border-bottom: none;
}

.accordion-header {
  /* background-color: #f8f9fa; */
  padding: 15px;
  cursor: pointer;
  position: relative;
  font-weight: 600;
  transition: background-color 0.3s;
  width: 100%;
}

.accordion-header:hover {
  background-color: #e9ecef;
}

.accordion-header:after {
  position: absolute;
  right: 15px;
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.3s;
}

.accordion-checkbox {
  display: none;
}

.accordion-content {
  max-height: 0;
  transition: max-height 0.3s ease-out;
  background-color: #fff;
}

.accordion-checkbox:checked + .accordion-header + .accordion-content {
  max-height: 500px;
  /* Adjust based on content */
}

/* Content Styles */
.issue-content {
  padding: 15px;
  margin-top: 5px;
  background-color: #fff9f9;
  border-left: 3px solid #e74c3c;
}

.solution-content {
  padding: 15px;
  margin-top: 5px;
  background-color: #f8f9fa;
  border-left: 3px solid #3498db;
}

.timestamp {
  font-size: 12px;
  color: #7f8c8d;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 10px;
}

.status-open {
  background-color: #f39c12;
  color: white;
}

.status-resolved {
  background-color: #27ae60;
  color: white;
}

/* Footer */
.email-footer {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #eaeaea;
}

.signature {
  margin-bottom: 20px;
}

.cta-button {
  display: inline-block;
  background-color: rgb(204, 234, 247);
  color: #2980b9;
  text-decoration: none;
  padding: 12px 25px;
  border-radius: 4px;
  font-weight: 600;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
  color: white !important;
}

.contact-info {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 15px;
}
</style>