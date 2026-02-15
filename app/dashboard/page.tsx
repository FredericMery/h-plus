"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuthStore } from "@/store/authStore";
import FloatingButton from "@/components/FloatingButton";
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

  const statuses = ["todo", "in_progress", "waiting", "done"];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500/20 text-green-400";
      case "in_progress":
        return "bg-indigo-500/20 text-indigo-400";
      case "waiting":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-white/10 text-gray-300";
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    subscribeRealtime();
  }, [user]);

  useEffect(() => {
    setActiveType("pro");
  }, []);

  return (
    <div className="space-y-8">

      {/* Quick Access */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveType("pro")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeType === "pro"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          PRO
        </button>

        <button
          onClick={() => setActiveType("perso")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeType === "perso"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          PERSO
        </button>

        <Link
          href="/dashboard/memoire"
          className="flex-1 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-400 text-center hover:bg-white/10 transition"
        >
          MÉMOIRE
        </Link>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks
          .filter((task) => task.type === activeType && !task.archived)
          .map((task) => (
            <div key={task.id}>
              <div
                onClick={() =>
                  setSelectedTaskId(
                    selectedTaskId === task.id ? null : task.id
                  )
                }
                className="w-full bg-white/[0.04] border border-white/5 p-5 rounded-2xl backdrop-blur-xl shadow-xl cursor-pointer transition hover:bg-white/[0.06]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm md:text-base font-medium">
                      {task.title}
                    </p>

                    {task.deadline && (
                      <p className="text-xs text-gray-500 mt-2">
                        📅 {new Date(task.deadline).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-[11px] px-3 py-1 rounded-full ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>

              {selectedTaskId === task.id && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(task.id, status);
                        setSelectedTaskId(null);
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition ${
                        status === task.status
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      <FloatingButton onClick={() => console.log("Add Task")} />
    </div>
  );
}
