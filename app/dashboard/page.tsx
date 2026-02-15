"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuthStore } from "@/store/authStore";
import FloatingButton from "@/components/FloatingButton";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const {
    tasks,
    fetchTasks,
    updateStatus,
    addTask,
    deleteTask,
    activeType,
    setActiveType,
    subscribeRealtime,
  } = useTaskStore();

  const [selectedTaskId, setSelectedTaskId] =
    useState<string | null>(null);

  const [showArchived, setShowArchived] =
    useState(false);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const statuses = [
    "todo",
    "in_progress",
    "waiting",
    "done",
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-600";
      case "in_progress":
        return "bg-blue-100 text-blue-600";
      case "waiting":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    subscribeRealtime();
  }, [user]);

  return (
    <div className="p-6">

      {/* 🔥 TEST THEME CARRE */}
      <div className="w-24 h-24 bg-[var(--primary)] rounded-xl mb-6" />

      {/* TYPE SELECTOR */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveType("perso")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            activeType === "perso"
              ? "bg-[var(--primary)] text-white shadow"
              : "bg-[var(--primary-soft)] text-gray-600"
          }`}
        >
          Perso
        </button>

        <button
          onClick={() => setActiveType("pro")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            activeType === "pro"
              ? "bg-[var(--primary)] text-white shadow"
              : "bg-[var(--primary-soft)] text-gray-600"
          }`}
        >
          Pro
        </button>
      </div>

      {/* ARCHIVE TOGGLE */}
      <div className="mb-4">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="text-sm text-gray-500 underline"
        >
          {showArchived
            ? "Voir tâches actives"
            : "Voir archives"}
        </button>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks
          .filter(
            (task) =>
              task.type === activeType &&
              task.archived === showArchived
          )
          .map((task) => (
            <div key={task.id}>
              <div
                onClick={() =>
                  setSelectedTaskId(
                    selectedTaskId === task.id
                      ? null
                      : task.id
                  )
                }
                className={`bg-[var(--card-bg)] p-4 rounded-2xl shadow-sm flex justify-between items-center cursor-pointer active:scale-[0.98] transition border-l-4 ${
                  task.deadline &&
                  new Date(task.deadline) <
                    new Date(new Date().toDateString())
                    ? "border-red-500"
                    : "border-[var(--border-soft)]"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {task.title}
                  </span>

                  {task.deadline && (
                    <span
                      className={`text-[11px] mt-1 ${
                        new Date(task.deadline) <
                        new Date(new Date().toDateString())
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      📅{" "}
                      {new Date(
                        task.deadline
                      ).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${getStatusStyle(
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
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    🗑
                  </button>
                </div>
              </div>

              {selectedTaskId === task.id && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(task.id, status);
                        setSelectedTaskId(null);
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition ${
                        status === task.status
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--primary-soft)] hover:bg-gray-300"
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

      {/* FLOATING BUTTON */}
      <FloatingButton
        onClick={() => setShowForm(true)}
      />

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-[var(--primary)]/30 flex items-end justify-center z-50">
          <div className="bg-[var(--card-bg)] w-full max-w-md p-6 rounded-t-3xl shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Nouvelle tâche ({activeType})
            </h2>

            <input
              type="text"
              placeholder="Titre"
              value={newTitle}
              onChange={(e) =>
                setNewTitle(e.target.value)
              }
              className="w-full p-3 border rounded-xl mb-4"
            />

            <input
              type="date"
              value={newDeadline}
              onChange={(e) =>
                setNewDeadline(e.target.value)
              }
              className="w-full p-3 border rounded-xl mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-500"
              >
                Annuler
              </button>

              <button
                onClick={() => {
                  if (!newTitle) return;

                  addTask(
                    newTitle,
                    activeType,
                    newDeadline || null
                  );

                  setNewTitle("");
                  setNewDeadline("");
                  setShowForm(false);
                }}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
