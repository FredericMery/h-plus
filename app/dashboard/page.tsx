"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuthStore } from "@/store/authStore";
import TaskModal from "@/components/TaskModal";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const {
    tasks,
    fetchTasks,
    updateStatus,
    deleteTask,
    activeType,
    setActiveType,
    subscribeRealtime,
  } = useTaskStore();

  const [selectedTaskId, setSelectedTaskId] =
    useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);

  const statuses = ["todo", "in_progress", "waiting", "done"];

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    subscribeRealtime();
  }, [user]);

  useEffect(() => {
    setActiveType("pro");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">

      {/* HEADER ACTION BAR */}
      <div className="flex justify-between items-center mb-8">

        <div className="flex gap-3">
          <button
            onClick={() => setActiveType("pro")}
            className={`px-4 py-2 rounded-xl ${
              activeType === "pro"
                ? "bg-indigo-600"
                : "bg-white/10"
            }`}
          >
            PRO
          </button>

          <button
            onClick={() => setActiveType("perso")}
            className={`px-4 py-2 rounded-xl ${
              activeType === "perso"
                ? "bg-indigo-600"
                : "bg-white/10"
            }`}
          >
            PERSO
          </button>

          <Link
            href="/dashboard/memoire"
            className="px-4 py-2 rounded-xl bg-white/10"
          >
            MÉMOIRE
          </Link>
        </div>

        {/* SIMPLE + BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-xl bg-indigo-600 text-xl flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* TASKS */}
      <div className="space-y-4">
        {tasks
          .filter((task) => task.type === activeType && !task.archived)
          .map((task) => (
            <div
              key={task.id}
              className="bg-white/5 p-4 rounded-xl"
            >
              <div className="flex justify-between">
                <span>{task.title}</span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* MODAL */}
      <TaskModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
