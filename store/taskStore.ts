import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "./authStore";

export type Task = {
  id: string;
  title: string;
  status: string;
  type: "perso" | "pro";
  deadline: string | null;
  user_id: string;
  archived: boolean;

};

type TaskState = {
  tasks: Task[];
  loading: boolean;

  activeType: "perso" | "pro";
  setActiveType: (type: "perso" | "pro") => void;

  fetchTasks: () => Promise<void>;
  addTask: (
  title: string,
  type: "perso" | "pro",
  deadline?: string | null
) => Promise<void>;

  updateStatus: (taskId: string, newStatus: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  subscribeRealtime: () => void;
};

let channel: any = null; // channel global unique

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  activeType: "perso",

  setActiveType: (type) => set({ activeType: type }),

  fetchTasks: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    set({ tasks: data || [] });
  },

  addTask: async (title, type, deadline = null) => {
  const user = useAuthStore.getState().user;
  if (!user) return;

  await supabase.from("tasks").insert([
    {
      title,
      type,
      status: "todo",
      deadline,
      user_id: user.id,
    },
  ]);
},


  updateStatus: async (taskId, newStatus) => {
  const updateData: any = { status: newStatus };

  if (newStatus === "done") {
    updateData.archived = true;
  }

  await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", taskId);
},

deleteTask: async (taskId) => {
  await supabase.from("tasks").delete().eq("id", taskId);
},



  subscribeRealtime: () => {
    if (channel) return; // évite double subscription

    channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload: any) => {
          const { eventType, new: newTask, old: oldTask } = payload;

          set((state) => {
            if (eventType === "INSERT") {
              return { tasks: [newTask, ...state.tasks] };
            }

            if (eventType === "UPDATE") {
              return {
                tasks: state.tasks.map((t) =>
                  t.id === newTask.id ? newTask : t
                ),
              };
            }

            if (eventType === "DELETE") {
              return {
                tasks: state.tasks.filter(
                  (t) => t.id !== oldTask.id
                ),
              };
            }

            return state;
          });
        }
      )
      .subscribe();
  },
}));
