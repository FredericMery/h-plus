"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuthStore } from "@/store/authStore";
import TaskModal from "@/components/TaskModal";
import Link from "next/link";

const statuses = ["todo", "in_progress", "waiting", "done"];

const statusLabels: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  waiting: "En attente",
  done: "Terminé",
};

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

  const [showModal, setShowModal] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div className="flex gap-3">
          <button
            onClick={() => setActiveType("pro")}
            className={`px-4 py-2 rounded-xl ${
              activeType === "pro" ? "bg-indigo-600" : "bg-white/10"
            }`}
          >
            PRO
          </button>

          <button
            onClick={() => setActiveType("perso")}
            className={`px-4 py-2 rounded-xl ${
              activeType === "perso" ? "bg-indigo-600" : "bg-white/10"
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

        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-xl bg-indigo-600 text-xl flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks
          .filter((task) => task.type === activeType && !task.archived)
          .map((task) => (
            <div
              key={task.id}
              className="bg-white/5 p-4 rounded-xl cursor-pointer transition hover:bg-white/10"
              onClick={() =>
                setExpandedTaskId(
                  expandedTaskId === task.id ? null : task.id
                )
              }
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{task.title}</div>

                  {task.deadline && (
                    <div className="text-xs text-gray-400 mt-1">
                      Deadline :{" "}
                      {new Date(task.deadline).toLocaleDateString("fr-FR")}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="text-red-400"
                >
                  🗑
                </button>
              </div>

              {/* STATUTS affichés uniquement si cliqué */}
              {expandedTaskId === task.id && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(task.id, status);
                        setExpandedTaskId(null);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        task.status === status
                          ? "bg-indigo-600"
                          : "bg-white/10"
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      <TaskModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
