<script setup lang="ts">
import useTicketStore from "~/stores/supports/TicketStore";
const ticketStore = useTicketStore();
const { isOpenModal, modals } = storeToRefs(ticketStore);
</script>

<template>
  <modals-final-modal
    :is-open="isOpenModal.issue_attachment_imgs"
    size="xl"
    custom-class="overflow-y-auto"
    label="List of Uploaded Image"
    parent-class="!z-[1501]"
    @update:is-open="isOpenModal.issue_attachment_imgs = $event"
  >
    <v-carousel
      height="500"
      progress="brown"
      v-model="isOpenModal.issue_attachment_opened"
      class="pt-2"
    >
      <v-carousel-item
        v-for="(issue_attachment, i) in modals.issue_attachment_imgs"
        :key="i"
      >
        <div class="flex gap-2 pt-2">
          <div class="w-2/3">
            <lazy-d-img
              v-if="issue_attachment.file_type.includes('image')"
              :aspect-ratio="1"
              :alt="issue_attachment.file_name"
              :src="issue_attachment.file_url"
              :cover="false"
              width="100%"
              class="border border-solid border-grey3 h-[25rem] cursor-pointer ease-in-out scale-95 hover:scale-100 transition-all"
              @click="ticketStore.handleViewFullPageFile(issue_attachment)"
            />
          </div>
          <div class="grid grid-cols-1 content-start gap-4 grow">
            <d-text-input
              v-model="issue_attachment.file_name"
              :label="`Name`"
              :placeholder="`Name`"
              class="h-[2rem]"
            />
            <d-text-area-input
              v-model="issue_attachment.remark"
              :label="`Remark`"
              :placeholder="`Remark`"
              class=""
              :auto-grow="false"
              :rows="3"
            />
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </modals-final-modal>
</template>