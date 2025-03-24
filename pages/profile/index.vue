<script setup lang="ts">
import useAccountSettingStore from "~/stores/masters/AccountSettingStore";
import type { FormLayoutType } from "~/types/FormLayoutType";

const accountSettingStore = useAccountSettingStore();
const { tabFormIndex, form, errors } = storeToRefs(accountSettingStore);
const config = useRuntimeConfig();

const originalFormData = ref(null);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Account Settings",
});

const parentLink = ref("");
const getParentLink = (link: string) => {
  parentLink.value = link;
};

const rolesDisplay = computed(() => {
  if (form.value.roles && Array.isArray(form.value.roles)) {
    return form.value.roles.join(', ');
  }
  return '';
});

const imagePreview = ref('');

const profileImageUrl = computed(() => {
  if (imagePreview.value) {
    return imagePreview.value; 
  } else if (form.value.profile_image_url) {
    if (form.value.profile_image_url.startsWith('http')) {
      return form.value.profile_image_url;
    } else {
      const imagePath = form.value.profile_image_url.startsWith('./') 
        ? form.value.profile_image_url.substring(1) 
        : form.value.profile_image_url.startsWith('/') 
          ? form.value.profile_image_url 
          : '/' + form.value.profile_image_url;
          
      return `${config.public.BASE_URL_IMAGE}${imagePath}`;
    }
  }
  return null;
});

onMounted(async () => {
  await accountSettingStore.show();
  originalFormData.value = JSON.parse(JSON.stringify(form.value));
});

const handleUpdate = async () => {
  const result = await accountSettingStore.update();
  imagePreview.value = '';
  
  if (result && result.data && result.data.status === 200) {
    await accountSettingStore.show();
    originalFormData.value = JSON.parse(JSON.stringify(form.value));
  }
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file) {
      form.value.profile_image = file;
      
      imagePreview.value = URL.createObjectURL(file);
    }
  }
};

const handleCancel = () => {
  if (originalFormData.value) {
    Object.keys(originalFormData.value).forEach(key => {
      if (key !== 'profile_image') {
        form.value[key] = originalFormData.value![key];
      }
    });
    
    form.value.password = '';
    form.value.password_confirmation = '';
    
    imagePreview.value = '';
    
    form.value.profile_image = null;
    
    Object.keys(errors.value).forEach(key => {
      errors.value[key] = '';
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <l-top-menu :top-menu="topMenuMasterTab" :parent_link="parentLink">
    </l-top-menu>

    <d-index-layout
      :config="{
        permission: {
          isActive: true,
          name: ['r_ms', 'u_ms'],
        },
      }"
    >
      <div class="w-full flex gap-5 p-5">
        <div
          class=" dark:bg-dark1 dark:text-primary1 w-2/5 shadow-sm border border-primary1 dark:border-dark1 rounded-md p-8"
        >
          <div class="flex w-full justify-end px-1 py-1">
            <span
              class="rounded-lg px-3 py-1 bg-green-100 dark:bg-dark2 text-green-700 dark:text-green-400 border !border-green-700"
            >
              Active
            </span>
          </div>
          <!-- Upload Image -->
          <div class="w-full flex items-center justify-center">
            <label for="profile-image" class="cursor-pointer">
              <div
                class="h-36 w-36 flex items-center justify-center rounded-full border-2 border-dark1 dark:border-primary1 border-dashed p-1 hover:bg-black hover:opacity-70 hover:duration-300"
              >
                <img 
                  v-if="profileImageUrl" 
                  :src="profileImageUrl" 
                  class="h-full w-full rounded-full object-cover"
                  alt="Profile Image"
                />
                <div v-else class="flex flex-col items-center justify-center text-center">
                  <v-icon size="large" color="#919EAB"> mdi-camera-plus </v-icon>
                  <div class="text-xs text-[#919EAB]">Upload photo</div>
                </div>
              </div>
              <input 
                id="profile-image" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleImageUpload"
              />
            </label>
          </div>
          <div class="w-full flex items-center justify-center mt-3">
            <span class="w-52 text-center text-xs">
              Allowed *.jpeg, *.jpg, *.png, *.gifmax size of 3.1 MB
            </span>
          </div>
        </div>

        <div
          class=" dark:bg-dark1 dark:text-primary1 w-3/5 shadow-sm border border-primary1 dark:border-dark1 rounded-md p-8"
        >
          <div class="w-full">
            <h1 class="text-2xl font-bold leading-9">Account Setting</h1>
            <p class="text-xs font-normal leading-4">
              You can update information using form below
            </p>
          </div>
          
          <div class="mt-5">
            <div class="grid h-full w-full grid-cols-2 gap-4">
              <d-text-input
                v-model="form.username"
                :label="`Username`"
                :placeholder="`Username`"
                :error-messages="errors.username"
              />
              <d-text-input
                v-model="form.name"
                :label="`Name`"
                :placeholder="`Name`"
                :error-messages="errors.name"
              />
              <d-text-input
                v-model="form.email"
                :label="`Email`"
                :placeholder="`Email`"
                :error-messages="errors.email"
              />
              <d-text-input
                v-model="form.phone_number"
                :label="`Phone Number`"
                :placeholder="`Phone Number`"
                :error-messages="errors.phone_number"
              />
              <div>
                <d-text-input
                  label="Role"
                  placeholder="Role"
                  disabled
                  :model-value="rolesDisplay"
                />
                <d-text-input
                  v-model="form.password"
                  label="Password"
                  placeholder="Password"
                  class="mt-4"
                  :error-messages="errors.password"
                />
                <d-text-input
                  v-model="form.password_confirmation"
                  label="Password Confirmation"
                  placeholder="Role"
                  class="mt-4"
                  :error-messages="errors.password_confirmation"
                />
              </div>
              <d-text-area-input
                v-model="form.address"
                label="Address"
                variant="outlined"
                density="compact"
                type="text"
                :rows="5.5"
                :error-messages="errors.address"
              ></d-text-area-input>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-5">
            <v-btn
              class="!border-2 !border-solid !border-rose-700 p-0 rounded-md bg-white dark:!bg-rose-700 transition-all ease-in-out hover:!bg-rose-50 dark:hover:!bg-rose-900"
              variant="outlined"
              @click="handleCancel"
            >
              <div class="text-rose-700 dark:text-white">
                Cancel
              </div>
            </v-btn>

            <v-btn
              color="#977669"
              :loading="accountSettingStore.formLoading"
              @click="handleUpdate"
            >
              Update
            </v-btn>
          </div>
        </div>
      </div>
    </d-index-layout>
  </div>
</template>
