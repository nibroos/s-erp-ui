import type { FormTaskType } from "./masters/TaskType";
import type { FormScheduleTaskType } from "./sales-orders/SalesOrderType";

type ActionTypeType = "items";

export type KanbanListActionsType = {
  title: string;
  key: string | number;
  emitKey: string;
  icon: string;
  type: "action" | "submenu";
  lists?: KanbanListActionsType[];
};

export type KanbanListTasksType = KanbanListActionsType & FormTaskType & FormScheduleTaskType

export type KanbanSectionListActionsType = {
  [key in ActionTypeType]: {
    title: string;
    key: string | number;
    // lists: {
    //   title: string;
    //   key: string;
    //   emitKey: string;
    //   icon: string;
    //   type: "action" | "submenu";
    //   lists?: {
    //     title: string;
    //     key: string;
    //     emitKey: string;
    //     icon: string;
    //     type: "action" | "submenu";
    //   }[];
    // }[];
    lists: KanbanListActionsType[];
  };
};
