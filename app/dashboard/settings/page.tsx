"use client";

import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase/client";
import { useUIStore } from "@/store/uiStore";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { mode, setMode, style, setStyle } = useUIStore();

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const resetMemory = async () => {
    if (!user) return;

    const confirmDelete = confirm(
      "Supprimer toutes vos données mémoire ?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("memory_items")
      .delete()
      .eq("user_id", user.id);

    await supabase
      .from("memory_sections")
      .delete()
      .eq("user_id", user.id);

    alert("Mémoire réinitialisée");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <h1 className="text-2xl font-semibold">
        Paramètres
      </h1>

      {/* APPARENCE */}
      <div className="bg-[var(--card-bg)] dark:bg-gray-800 p-6 rounded-2xl shadow-sm space-y-8">
        <h2 className="text-lg font-semibold">
          Apparence
        </h2>

        {/* MODE */}
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Mode
          </p>

          <div className="flex gap-3">
            {["light", "dark", "system"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
                  mode === m
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--primary-soft)] dark:bg-gray-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* STYLE */}
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Style d'interface
          </p>

          <div className="grid grid-cols-2 gap-3">
            {["apple", "startup", "colorful", "tech"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s as any)}
                  className={`p-4 rounded-xl text-sm capitalize transition ${
                    style === s
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* COMPTE */}
      <div className="bg-[var(--card-bg)] dark:bg-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="font-medium text-lg">
          Compte
        </h2>

        <p className="text-sm text-gray-500">
          Connecté en tant que :
        </p>

        <p className="font-medium">
          {user?.email}
        </p>

        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm"
        >
          Se déconnecter
        </button>
      </div>

      {/* MEMOIRE */}
      <div className="bg-[var(--card-bg)] dark:bg-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="font-medium text-lg">
          Mémoire
        </h2>

        <button
          onClick={resetMemory}
          className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm"
        >
          Réinitialiser mes données
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-[var(--card-bg)] dark:bg-gray-800 p-6 rounded-2xl shadow-sm space-y-4 border border-red-200">
        <h2 className="font-medium text-lg text-red-500">
          Zone dangereuse
        </h2>

        <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm">
          Supprimer mon compte (bientôt)
        </button>
      </div>
    </div>
  );
}
