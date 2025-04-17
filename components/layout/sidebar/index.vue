<script setup lang="ts">
// import { useMasterUser } from "~/stores/MasterData/AccountSetting";
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import { useAuth } from "#imports";
import type { AuthUserDataType } from "~/types/AuthType";

// const User = useMasterUser();
// const { data } = storeToRefs(User);
const router = useRouter();

const data: AuthUserDataType =
  AuthStore().authUser.data ?? ({} as AuthUserDataType);

const token = localStorage.getItem("_token");
const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL_IMAGE;
const layoutState = useLayoutsStore();
const { isCloseSidebar, lastVisitedMasterRoute } = storeToRefs(layoutState);
// AuthStore().getAbilities()
// AuthStore().getCompanyProfile();

const itemShippings = [
  {
    title: "Shipping Order",
    icon: "mdi-truck-delivery-outline",
    link: "/shipping-order",
    permissions: ["SHIPPING_READ"],
  },
];

const itemOrders = [
  {
    title: "Quotations",
    icon: "mdi-cart-outline",
    link: "/sales/quotations",
    permissions: ["r_sos"],
  },
  {
    title: "Sales Order",
    icon: "mdi-cart-outline",
    link: "/sales/sales-orders",
    permissions: ["r_sos"],
  },
];

const itemSales = [
  {
    title: "Invoice DP",
    icon: "mdi-credit-card-outline",
    link: "/invoices/invoice-dps",
    permissions: ["r_sos"],
  },
  {
    title: "Sales Invoices",
    icon: "mdi-credit-card-outline",
    link: "/invoices/sales-invoices",
    permissions: ["r_sos"],
  },
  {
    title: "Sales Adjustment",
    icon: "mdi-printer-pos-sync-outline",
    link: "/invoices/sales-adjustments",
    permissions: ["r_sos"],
  },
];

const itemPurchase = [
  {
    title: "Request Order",
    icon: "mdi-credit-card-outline",
    link: "/purchase/request-order",
    permissions: ["r_pos"],
  },
  {
    title: "Purchase Order",
    icon: "mdi-credit-card-outline",
    link: "/purchases/purchase-orders",
    permissions: ["r_pos"],
  },
  {
    title: "Purchase Invoice",
    icon: "mdi-credit-card-outline",
    link: "/purchases/purchase-invoice",
    permissions: ["r_pos"],
  },
  {
    title: "Purchase Adjustment",
    icon: "mdi-credit-card-outline",
    link: "/purchases/purchase-adjustment",
    permissions: ["r_pos"],
  },
];

const itemInventory = [
  {
    title: "Inventory IN",
    icon: "mdi-credit-card-outline",
    link: "/inventories/in",
    permissions: ["r_invs"],
  },
  {
    title: "Inventory OUT",
    icon: "mdi-credit-card-outline",
    link: "/inventories/out",
    permissions: ["r_invs"],
  },
  {
    title: "Inventory Status",
    icon: "mdi-credit-card-outline",
    link: "/inventories/status",
    permissions: ["r_invs"],
  },
  {
    title: "Card Stock",
    icon: "",
    link: "/inventories/stock",
    permissions: ["r_invs"],
  },
  {
    title: "BC Tracking",
    icon: "",
    link: "/inventories/bc-tracking",
    permissions: ["r_invs"],
  },
  {
    title: "Pabean Document",
    icon: "mdi-file-sign",
    link: "/inventories/pabean-document",
    permissions: ["r_invs"],
  },
];

const itemExim = [
  {
    title: "Lp. Pemasukan Barang",
    icon: "mdi-credit-card-outline",
    link: "/inventories/exim/bc1",
    permissions: ["r_invs"],
  },
  {
    title: "Lp. Pengeluaran Barang",
    icon: "mdi-credit-card-outline",
    link: "/inventories/exim/bc2",
    permissions: ["r_invs"],
  },
  {
    title: "Lp. Posisi Barang",
    icon: "mdi-credit-card-outline",
    link: "/inventories/exim/bc3",
    permissions: ["r_invs"],
  },
  {
    title: "Lp. Pertanggungjawaban Mutasi Barang",
    icon: "mdi-credit-card-outline",
    link: "/inventories/exim/bc4",
    permissions: ["r_invs"],
  },
  {
    title: "Lp. Pertanggungjawaban Mutasi Barang Jadi",
    icon: "mdi-credit-card-outline",
    link: "/inventories/exim/bc5",
    permissions: ["r_invs"],
  },
  {
    title: "Lp. Pertanggungjawaban Mutasi Barang dan Sisa Scrap",
    icon: "mdi-credit-card-outline",
    link: "/inventories/exim/bc6",
    permissions: ["r_invs"],
  },
  {
    title:
      "Lp. Pertanggungjawaban Mutasi Mesin dan Peralatan Perkantoran Kawasan Berikat",
    icon: "mdi-credit-card-outline",
    link: "/inventories/exim/bc7",
    permissions: ["r_invs"],
  },
];

const itemProduction = [
  {
    title: "Production Plan",
    icon: "",
    link: "/production/production-plan",
    permissions: ["r_prod"],
  },
  {
    title: "Request Plan",
    icon: "",
    link: "/request-plan",
    permissions: ["r_prod"],
  },
  // {
  //   title: "Work Order",
  //   icon: "",
  //   link: "/#",
  // permissions: ['r_prod']
  // },
  {
    title: "Work In Progress",
    icon: "",
    link: "/production/work-in-progress",
    permissions: ["r_prod"],
  },
];

const itemMaster = [
  {
    title: "Master User",
    icon: "mdi-account-outline",
    link: "/masters/master-user",
    permissions: ["r_ms"],
  },
];

const itemDashboard = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    link: "/dashboard",
    permissions: ["r"],
  },
];

const isPermissionAllChildExists = (parentName: string) => {
  let joinPermissions = [];

  let dashboard = ["dashboard"];
  let management = [
    "orders",
    "sales",
    "purchase",
    "inventory",
    "production",
    "shipping",
  ];
  let master = ["master", "style"];

  switch (parentName) {
    case "management":
      // get all permissions from management
      joinPermissions = itemOrders
        .concat(itemSales)
        .concat(itemPurchase)
        .concat(itemInventory)
        .concat(itemProduction)
        .map((item) => item.permissions.join());
      return useAuth.permit(joinPermissions);
    case "master":
      // get all permissions from master
      joinPermissions = itemMaster.map((item) => item.permissions.join());
      return useAuth.permit(joinPermissions);
    case "dashboard":
      // get all permissions from dashboard
      joinPermissions = itemDashboard.map((item) => item.permissions.join());
      return useAuth.permit(joinPermissions);
    default:
      return false;
  }
};

const isPermissionOnChildExists = (parentName: string): boolean => {
  let childPermissions = [];

  switch (parentName) {
    case "sos":
      // itemOrders
      childPermissions = itemOrders.map((item) => item.permissions.join());
      return useAuth.permit(childPermissions);
    case "sos":
      // itemSales
      childPermissions = itemSales.map((item) => item.permissions.join());
      return useAuth.permit(childPermissions);
    case "ms":
      // itemPurchase
      childPermissions = itemMaster.map((item) => item.permissions.join());
      return useAuth.permit(childPermissions);
    case "pos":
      // itemPurchase
      childPermissions = itemPurchase.map((item) => item.permissions.join());
      return useAuth.permit(childPermissions);
    case "invs":
      // itemInventory
      childPermissions = itemInventory.map((item) => item.permissions.join());
      return useAuth.permit(childPermissions);
    case "prod":
      // itemProduction
      childPermissions = itemProduction.map((item) => item.permissions.join());
      return useAuth.permit(childPermissions);
    default:
      return false;
  }
};

const isExpanded = ref(false);

const handleExpanded = (value: boolean) => {
  isExpanded.value = value;
};
const handleMouseHover = () => {
  if (isCloseSidebar.value == true) {
    if (!isExpanded.value) {
      useDebouncedRef(handleExpanded(true), 1000);
    } else {
      useDebouncedRef(handleExpanded(false), 1000);
    }
  }
};

const handleClickSampleDiagram = () => {
  router
    .push("/sample-diagram")
    .then(() => {
      window.location.reload(); // Force reload after navigation
    })
    .catch((err) => {
      console.error("Failed to navigate:", err);
    });
};

watch(isCloseSidebar, (newValue) => {
  if (!newValue) {
    isExpanded.value = true;
  } else {
    isExpanded.value = false;
  }
});

onMounted(async () => {
  // if (token) {
  //   await Promise.all([AuthStore().getAbilities()]);
  // }
});
</script>

<template>
  <div
    class="flex h-full flex-col items-center justify-between bg-scDarker3 dark:bg-dark2"
    @mouseenter="handleMouseHover"
    @mouseleave="handleMouseHover"
  >
    <div class="flex w-full flex-col gap-y-5 py-5">
      <!-- Logo App -->
      <div class="flex w-full justify-center">
        <!-- <img
          v-if="isExpanded"
          src="/images/D-new-logo.png"
          alt="img-login"
          class="h-full w-40 object-contain"
        />
        <img
          v-else
          src="/images/D-only-new-logo.png"
          alt="img-login"
          class="w-7 object-contain"
        /> -->
      </div>

      <!-- Menu List -->
      <div class="max-h-[80vh] w-full overflow-y-auto">
        <v-list
          v-if="useAuth.permit('r')"
          color="#fff"
          density="compact"
          lines="one"
        >
          <v-list-item-title
            v-if="isPermissionAllChildExists('r') && isExpanded"
            class="mb-2 ml-4 !text-sm"
            style="font-size: 12px"
          >
            DASHBOARD
          </v-list-item-title>

          <v-list-item class="!text-primary1" to="/dashboard" rounded="lg">
            <template #prepend>
              <v-icon>mdi-view-dashboard-outline</v-icon>
            </template>

            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          v-if="isPermissionOnChildExists('ms')"
          color="#fff"
          density="compact"
        >
          <v-list-item-title
            v-if="isPermissionAllChildExists('ms') && isExpanded"
            class="mb-2 ml-4 !text-sm"
            style="font-size: 12px"
          >
            MASTER
          </v-list-item-title>

          <v-list-item
            v-if="useAuth.permit('r_ms')"
            color="#898F99"
            :to="lastVisitedMasterRoute"
            rounded="lg"
            class="!text-primary1"
          >
            <template #prepend>
              <v-icon>mdi-wrench</v-icon>
            </template>

            <v-list-item-title>Master Data</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <!-- list Management -->
        <v-list color="#fff" density="comfortable">
          <v-list-item-title
            v-if="isPermissionAllChildExists('management') && isExpanded"
            class="mb-2 ml-4 !text-sm"
            style="font-size: 12px"
          >
            MANAGEMENT
          </v-list-item-title>

          <v-list-group v-if="isPermissionOnChildExists('sos')" value="Orders">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-cart-outline"
                title="Sales"
                density="compact"
                rounded="lg"
              ></v-list-item>
            </template>
            <template v-for="(item, i) in itemOrders" :key="i">
              <v-list-item
                v-if="useAuth.permit(item.permissions)"
                :title="item.title"
                :to="item.link"
                variant="text"
                rounded="lg"
                density="compact"
                color="#898F99"
                class="!text-primary1"
              ></v-list-item>
            </template>
          </v-list-group>
          <v-list-group v-if="isPermissionOnChildExists('sos')" value="Sales">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-credit-card-outline"
                title="Invoice"
                density="compact"
                rounded="lg"
                color="#898F99"
                class="!text-primary1"
              ></v-list-item>
            </template>
            <template v-for="(item, i) in itemSales" :key="i">
              <v-list-item
                v-if="useAuth.permit(item.permissions)"
                :title="item.title"
                :to="item.link"
                variant="text"
                rounded="lg"
                density="compact"
                color="#898F99"
                class="!text-primary1"
              ></v-list-item>
            </template>
          </v-list-group>

          <v-list-group
            v-if="isPermissionOnChildExists('pos')"
            value="Purchase"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                rounded="lg"
                prepend-icon="mdi-cart-variant"
                title="Purchase"
                density="compact"
              ></v-list-item>
            </template>

            <template v-for="(item, i) in itemPurchase" :key="i">
              <v-list-item
                v-if="useAuth.permit(item.permissions)"
                :title="item.title"
                :to="item.link"
                variant="text"
                rounded="lg"
                density="compact"
                color="#898F99"
              ></v-list-item>
            </template>
          </v-list-group>

          <v-list-group
            v-if="isPermissionOnChildExists('invs')"
            value="Inventory"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                rounded="lg"
                prepend-icon="mdi-warehouse"
                title="Inventory"
                density="compact"
                class="!text-primary1"
              ></v-list-item>
            </template>

            <template v-for="(item, i) in itemInventory" :key="i">
              <v-list-item
                v-if="useAuth.permit(item.permissions)"
                :title="item.title"
                :to="item.link"
                variant="text"
                rounded="lg"
                density="compact"
                class="!text-primary1"
                color="#898F99"
              ></v-list-item>
            </template>
          </v-list-group>

          <v-list-item
            v-if="useAuth.permit('EXIM_READ')"
            color="#898F99"
            to="/inventories/exim"
            rounded="lg"
          >
            <template #prepend>
              <v-icon>mdi-file-sign</v-icon>
            </template>

            <v-list-item-title>EXIM</v-list-item-title>
          </v-list-item>
          <!-- <v-list-group value="Exim">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                rounded="lg"
                prepend-icon="mdi-file-sign"
                title="Exim"
                density="compact"
              ></v-list-item>
            </template>

            <template
              v-for="(item, i) in itemExim"
              :key="i"
            >
              <div
                :title="item.title"
                class=""
              >
                <v-list-item
                  v-if="useAuth.permit(item.permissions)"
                  :title="item.title"
                  :to="item.link"
                  variant="text"
                  rounded="lg"
                  density="compact"
                  color="#898F99"
                ></v-list-item>
              </div>
            </template>
          </v-list-group> -->

          <!-- <v-list-group
            v-if="isPermissionOnChildExists('production')"
            value="Production"
          >
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                rounded="lg"
                prepend-icon="mdi-tune-vertical"
                title="Production"
                density="compact"
              ></v-list-item>
            </template>

            <template v-for="(item, i) in itemProduction" :key="i">
              <v-list-item
                v-if="useAuth.permit(item.permissions)"
                :title="item.title"
                :to="item.link"
                variant="text"
                rounded="lg"
                density="compact"
                color="#898F99"
              ></v-list-item>
            </template>
          </v-list-group> -->

          <!-- List static -->
          <!-- <template v-for="(item, i) in itemShippings" :key="i">
            <v-list-item
              v-if="useAuth.permit(item.permissions)"
              :value="item"
              color="#898F99"
              rounded="lg"
              :to="item.link"
              :title="item.title"
            >
              <template #prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
            </v-list-item>
          </template> -->
        </v-list>
      </div>
    </div>

    <!-- Profile Account -->
    <div
      class="flex h-[77px] w-full cursor-pointer items-center justify-stretch gap-x-5 bg-sc dark:bg-dark1 transition-all ease-in-out hover:bg-scDarker hover:dark:bg-dark1/80 lg:px-2"
      @click="navigateTo('/profile')"
    >
      <v-avatar
        :image="`${BASE_URL}/storage/app/public/master/users/${data?.avatar_url}`"
        size="40"
      ></v-avatar>
      <div>
        <p class="text-sm font-normal">{{ data?.name }}</p>
        <span class="text-xs font-normal text-primaryDarker">
          {{ data?.roles[0] }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
* {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: thin;
  scrollbar-color: #898f99 #121c2b;
}
</style>
