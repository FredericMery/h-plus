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
  const [deadlineInput, setDeadlineInput] = useState("");

  if (!open) return null;

  const parseDate = (value: string) => {
    const [day, month, year] = value.split("/");
    if (!day || !month || !year) return null;
    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div className="bg-[#111] p-6 rounded-2xl w-full max-w-md">

        <h2 className="text-lg mb-4">
          Nouvelle tâche ({activeType})
        </h2>

        <input
          type="text"
          placeholder="Nom de la tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/10"
        />

        <input
          type="text"
          placeholder="Deadline (JJ/MM/AAAA)"
          value={deadlineInput}
          onChange={(e) => setDeadlineInput(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/10"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-400">
            Annuler
          </button>

          <button
            onClick={() => {
              if (!title) return;

              const deadline = parseDate(deadlineInput);
              addTask(title, activeType, deadline);

              setTitle("");
              setDeadlineInput("");
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
