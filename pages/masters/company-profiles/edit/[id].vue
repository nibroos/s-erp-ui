<script setup lang="ts">
import useCompanyProfileStore from "~/stores/masters/CompanyProfileStore";
import type { FormLayoutType } from "~/types/FormLayoutType";

const companyProfileStore = useCompanyProfileStore();
const { tabFormIndex, form, errors, formLoading } =
  storeToRefs(companyProfileStore);
const config = useRuntimeConfig();
const route = useRoute();

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit Company Profile",
});

const parentLink = ref("");
const getParentLink = (link: string) => {
  parentLink.value = link;
};

const handleSubmit = async () => {
  await companyProfileStore.update();
};

const handleClickClear = async () => {
  const currentId = form.value.id;

  form.value = JSON.parse(
    JSON.stringify(useInitials.formCompanyProfileCreateEdit)
  );

  form.value.id = currentId;

  errors.value = {};
  logoPreview.value = "";
  signaturePreview.value = "";
};

const logoPreview = ref("");

const logoImageUrl = computed(() => {
  if (logoPreview.value) {
    return logoPreview.value;
  } else if (form.value.company_logo) {
    if (typeof form.value.company_logo === "string") {
      if (form.value.company_logo.startsWith("http")) {
        return form.value.company_logo;
      } else {
        const imagePath = form.value.company_logo.startsWith("./")
          ? form.value.company_logo.substring(1)
          : form.value.company_logo.startsWith("/")
          ? form.value.company_logo
          : "/" + form.value.company_logo;

        return `${config.public.BASE_URL_IMAGE}${imagePath}`;
      }
    }
  }
  return null;
});

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file) {
      form.value.company_logo = file;
      logoPreview.value = URL.createObjectURL(file);
    }
  }
};

const handleLogoDelete = () => {
  form.value.company_logo = null;
  logoPreview.value = "";
};

// Signature handling
const signaturePreview = ref("");

const signatureImageUrl = computed(() => {
  if (signaturePreview.value) {
    return signaturePreview.value;
  } else if (form.value.company_sign) {
    if (typeof form.value.company_sign === "string") {
      if (form.value.company_sign.startsWith("http")) {
        return form.value.company_sign;
      } else {
        const imagePath = form.value.company_sign.startsWith("./")
          ? form.value.company_sign.substring(1)
          : form.value.company_sign.startsWith("/")
          ? form.value.company_sign
          : "/" + form.value.company_sign;

        return `${config.public.BASE_URL_IMAGE}${imagePath}`;
      }
    }
  }
  return null;
});

const handleSignatureUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file) {
      form.value.company_sign = file;
      signaturePreview.value = URL.createObjectURL(file);
    }
  }
};

const handleSignatureDelete = () => {
  form.value.company_sign = null;
  signaturePreview.value = "";
};

// Bank information handling
const createEmptyBankInfo = () => {
  return {
    id: null,
    name: "",
    account_number: "",
    account_name: "",
    description: "",
  };
};

const addBankInfo = () => {
  if (!form.value.bank_informations) {
    form.value.bank_informations = [];
  }
  form.value.bank_informations.push(createEmptyBankInfo());
};

const removeBankInfo = (index: number) => {
  if (form.value.bank_informations && form.value.bank_informations.length > 0) {
    form.value.bank_informations.splice(index, 1);
  }
};

onMounted(async () => {
  // Set the ID from the route parameter
  form.value.id = route.params.id;

  // Fetch the company profile data
  await companyProfileStore.show();

  // Initialize bank_informations if it's empty
  if (
    !form.value.bank_informations ||
    form.value.bank_informations.length === 0
  ) {
    form.value.bank_informations = [createEmptyBankInfo()];
  }
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <l-top-menu :top-menu="topMenuMasterTab" :parent_link="parentLink">
    </l-top-menu>

    <div class="bg-white dark:bg-scDarker rounded-lg shadow-sm p-4">
      <div class="border border-[#212529] rounded-lg p-5">
        <div class="flex justify-between items-center mb-4 border-b pb-3">
          <div>
            <h1 class="text-xl font-semibold text-[#212529] dark:text-white">
              Basic Information
            </h1>
            <p class="text-[#6C757D] text-sm mt-1">
              Fill all company profile information data
            </p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="px-4 py-2 bg-[#695149] text-white rounded hover:bg-[#4d3a34] flex items-center gap-1"
              @click="handleSubmit"
              :disabled="formLoading"
            >
              <v-icon size="small">mdi-content-save</v-icon>
              <span>{{ formLoading ? "Updating..." : "Update" }}</span>
            </button>

            <button
              type="button"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-1"
              @click="handleClickClear"
            >
              <v-icon size="small">mdi-refresh</v-icon>
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div class="mb-3">
          <p class="text-[16.5px] font-medium text-[#6C757D]">
            Company Information
          </p>
        </div>

        <!-- Form content -->
        <form
          :class="
            classMerge(
              'flex',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="w-1/5">
            <div class="sm:col-span-1 flex flex-col">
              <div class="flex items-start gap-4">
                <div
                  class="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center"
                >
                  <img
                    v-if="logoImageUrl"
                    :src="logoImageUrl"
                    alt="Company Logo"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="flex flex-col items-center justify-center text-center"
                  >
                    <v-icon size="large" color="#919EAB"> mdi-image </v-icon>
                    <div class="text-xs text-[#919EAB] mt-1">No Logo</div>
                  </div>
                </div>
                <div class="flex flex-col gap-2 mt-1">
                  <div class="text-[15.5px] text-[#344051]">Company Logo</div>
                  <div class="flex gap-2">
                    <label
                      class="cursor-pointer px-3 py-1 bg-[#695149] text-white rounded text-[14.5px] hover:bg-[#4d3a34]"
                    >
                      Upload
                      <input
                        type="file"
                        class="hidden"
                        accept="image/*"
                        @change="handleLogoUpload"
                      />
                    </label>
                    <button
                      type="button"
                      class="px-3 py-1 bg-[#e4e4e4] rounded text-[14.5px] hover:bg-[#c4c4c4]"
                      @click="handleLogoDelete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="errors.company_logo" class="text-red-500 text-xs mt-1">
                {{ errors.company_logo }}
              </div>
            </div>

            <div class="sm:col-span-1 flex flex-col mt-3">
              <div class="flex items-start gap-4">
                <div
                  class="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center"
                >
                  <img
                    v-if="signatureImageUrl"
                    :src="signatureImageUrl"
                    alt="Company Signature"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="flex flex-col items-center justify-center text-center"
                  >
                    <v-icon size="large" color="#919EAB">
                      mdi-signature
                    </v-icon>
                    <div class="text-xs text-[#919EAB] mt-1">No Sign</div>
                  </div>
                </div>
                <div class="flex flex-col gap-2 mt-1">
                  <div class="text-[15.5px] text-[#344051]">Signature</div>
                  <div class="flex gap-2">
                    <label
                      class="cursor-pointer px-3 py-1 bg-[#695149] text-white rounded text-[14.5px] hover:bg-[#4d3a34]"
                    >
                      Upload
                      <input
                        type="file"
                        class="hidden"
                        accept="image/*"
                        @change="handleSignatureUpload"
                      />
                    </label>
                    <button
                      type="button"
                      class="px-3 py-1 bg-[#e4e4e4] rounded text-[14.5px] hover:bg-[#c4c4c4]"
                      @click="handleSignatureDelete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="errors.company_sign" class="text-red-500 text-xs mt-1">
                {{ errors.company_sign }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-5 gap-4 w-4/5">
            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_name"
                :label="`Company Name`"
                :placeholder="`Company Name`"
                :errors="[errors.company_name]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_owner_name"
                :label="`Owner Name`"
                :placeholder="`Owner Name`"
                :errors="[errors.company_owner_name]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_phone"
                :label="`Phone Number`"
                :placeholder="`Phone Number`"
                :errors="[errors.company_phone]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_email"
                :label="`Email`"
                :placeholder="`Email`"
                :errors="[errors.company_email]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_email_password"
                type="password"
                :label="`Password`"
                :placeholder="`Password`"
                :errors="[errors.company_email_password]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_website"
                :label="`Website`"
                :placeholder="`Website`"
                :errors="[errors.company_website]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_city"
                :label="`City`"
                :placeholder="`City`"
                :errors="[errors.company_city]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_province"
                :label="`Province`"
                :placeholder="`Province`"
                :errors="[errors.company_province]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_district"
                :label="`District`"
                :placeholder="`District`"
                :errors="[errors.company_district]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_postal_code"
                :label="`Postal Code`"
                :placeholder="`Postal Code`"
                :errors="[errors.company_postal_code]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 flex flex-col">
              <d-text-input
                v-model="form.company_address"
                :label="`Address`"
                :placeholder="`Address`"
                :errors="[errors.company_address]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-1 col-span-2 flex flex-col">
              <d-text-input
                v-model="form.company_remark"
                :label="`Remark`"
                :placeholder="`Remark`"
                :errors="[errors.company_remark]"
              >
              </d-text-input>
            </div>

            <div class="sm:col-span-3 col-span-2 flex flex-col">
              <d-text-input
                v-model="form.company_description"
                :label="`Description`"
                :placeholder="`Description`"
                :errors="[errors.company_description]"
              >
              </d-text-input>
            </div>

            <!-- <div class="sm:col-span-1">
            <d-switch-status v-model="form.company_status" :label="`Status`" />
          </div>
          
          <div class="sm:col-span-1">
            <d-switch-status v-model="form.is_primary" :label="`Default`" />
          </div> -->
          </div>

          <d-button type="submit" class="!hidden"></d-button>
        </form>
      </div>

      <!-- Bank Information section -->
      <div class="border border-[#212529] rounded-lg p-5 mt-5">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-[#6C757D]">Bank Information</h2>
          <button
            type="button"
            class="px-3 py-1 bg-[#695149] text-white rounded text-[14.5px] hover:bg-[#4d3a34]"
            @click="addBankInfo"
          >
            + Add Bank
          </button>
        </div>

        <v-data-table-virtual
          :items="form.bank_informations || []"
          :headers="[
            {
              title: 'No',
              key: 'no',
              align: 'start',
              sortable: false,
              width: '50px',
            },
            { title: 'Bank Name', key: 'name', align: 'start', sortable: true },
            {
              title: 'Account Number',
              key: 'account_number',
              align: 'start',
              sortable: true,
            },
            {
              title: 'Account Name',
              key: 'account_name',
              align: 'start',
              sortable: true,
            },
            {
              title: 'Description',
              key: 'description',
              align: 'start',
              sortable: true,
            },
            { title: 'Action', key: 'action', align: 'start', sortable: false },
          ]"
          item-value="id"
          density="compact"
          class="table-hover"
          :header-props="{
            class: '!bg-scLightest dark:!bg-scDarker whitespace-nowrap',
          }"
          :row-props="{
            class: 'whitespace-nowrap',
          }"
        >
          <template #item.no="{ index }">
            <div class="text-center">{{ index + 1 }}</div>
          </template>

          <template #item.name="{ item }">
            <d-text-input
              v-model="item.name"
              :label="``"
              :placeholder="`Bank Name`"
              class="w-full"
            />
          </template>

          <template #item.account_number="{ item }">
            <d-text-input
              v-model="item.account_number"
              :label="``"
              :placeholder="`Account Number`"
              class="w-full"
            />
          </template>

          <template #item.account_name="{ item }">
            <d-text-input
              v-model="item.account_name"
              :label="``"
              :placeholder="`Account Name`"
              class="w-full"
            />
          </template>

          <template #item.description="{ item }">
            <d-text-input
              v-model="item.description"
              :label="``"
              :placeholder="`Description`"
              class="w-full"
            />
          </template>

          <template #item.action="{ item, index }">
            <div class="action-button">
              <d-bt
                @click="removeBankInfo(index)"
                icon="mdi-delete"
                is-no-text
                class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                icon-class="text-cancel dark:text-primary1"
                rounded="xl"
                cta="delete"
                icon-size="16"
                :is-notif="true"
                :notif-text="`Bank information deleted`"
              ></d-bt>
            </div>
          </template>

          <template #no-data>
            <div class="text-center py-4 text-gray-500">
              No bank information added. Click "Add Bank" to add a new bank.
            </div>
          </template>
        </v-data-table-virtual>
      </div>
    </div>
  </div>
</template>
