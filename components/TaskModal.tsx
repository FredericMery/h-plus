"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";

export default function TaskModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addTask, activeType } = useTaskStore();

  const [title, setTitle] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">

      <div className="bg-[#111] p-6 rounded-2xl w-full max-w-md">

        <h2 className="text-lg mb-4">
          Nouvelle tâche ({activeType})
        </h2>

        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/10"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-400"
          >
            Annuler
          </button>

          <button
            onClick={() => {
              if (!title) return;
              addTask(title, activeType, null);
              setTitle("");
              onClose();
            }}
            className="bg-indigo-600 px-4 py-2 rounded-lg"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
