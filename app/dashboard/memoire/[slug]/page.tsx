"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";

type Section = {
  id: string;
  name: string;
  search_template: string | null;
  allow_image: boolean;
};

type Field = {
  id: string;
  label: string;
  field_key: string;
};

type Item = {
  id: string;
  title: string;
  image_url: string | null;
  rating: number | null;
  extra_data: Record<string, string>;
};

export default function SectionPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const user = useAuthStore((s) => s.user);

  const [section, setSection] = useState<Section | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [extraData, setExtraData] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user || !slug) return;

    const init = async () => {
      const { data: sectionData } = await supabase
        .from("memory_sections")
        .select("*")
        .eq("slug", slug)
        .eq("user_id", user.id)
        .single();

      if (!sectionData) return;

      setSection(sectionData);

      const { data: fieldData } = await supabase
        .from("memory_section_fields")
        .select("*")
        .eq("section_id", sectionData.id);

      setFields(fieldData || []);

      const { data: itemData } = await supabase
        .from("memory_items")
        .select("*")
        .eq("section_id", sectionData.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setItems(itemData || []);
    };

    init();
  }, [slug, user]);

  const addItem = async () => {
    if (!user || !section || !title) return;

    let uploadedImageUrl: string | null = null;

    if (imageFile && section.allow_image) {
      const filePath = `${user.id}/${Date.now()}`;

      const { error } = await supabase.storage
        .from("memory-images")
        .upload(filePath, imageFile);

      if (!error) {
        const { data } = supabase.storage
          .from("memory-images")
          .getPublicUrl(filePath);

        uploadedImageUrl = data.publicUrl;
      }
    }

    const { data } = await supabase
      .from("memory_items")
      .insert([
        {
          title,
          image_url: uploadedImageUrl,
          rating,
          extra_data: extraData,
          section_id: section.id,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (data) {
      setItems([data, ...items]);
      resetForm();
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Supprimer cette entrée ?")) return;

    await supabase.from("memory_items").delete().eq("id", id);
    setItems(items.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    setTitle("");
    setRating(0);
    setExtraData({});
    setImageFile(null);
    setShowForm(false);
  };

  if (!section) return <div>Loading...</div>;

  return (
    <div className="text-blue-950">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          {section.name}
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm hover:opacity-80 transition"
        >
          + Fiche
        </button>
      </div>

      {/* MODAL FORMULAIRE PREMIUM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-50 w-full max-w-xl rounded-3xl shadow-xl p-8 space-y-6">

            <h2 className="text-xl font-semibold">
              Nouvelle fiche mémoire
            </h2>

            {/* TITRE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Titre
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* PHOTO */}
            {section.allow_image && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full"
                />
              </div>
            )}

            {/* NOTE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Note
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${
                      rating >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* CHAMPS PERSONNALISÉS */}
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-medium">
                  {field.label}
                </label>
                <input
                  value={extraData[field.field_key] || ""}
                  onChange={(e) =>
                    setExtraData({
                      ...extraData,
                      [field.field_key]: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            ))}

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600"
              >
                Annuler
              </button>

              <button
                onClick={addItem}
                className="px-6 py-2 bg-black text-white rounded-xl hover:opacity-80 transition"
              >
                Ajouter
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LISTE FICHES */}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg">
                {item.title}
              </h2>

              <button
                onClick={() => deleteItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition text-sm"
              >
                🗑
              </button>
            </div>

            {item.image_url && (
              <img
                src={item.image_url}
                className="w-full h-40 object-cover rounded-xl"
              />
            )}

            {item.rating && (
              <div className="text-yellow-500 text-sm">
                {"★".repeat(item.rating)}
              </div>
            )}

            {Object.entries(item.extra_data || {}).map(([key, value]) => {
              const field = fields.find((f) => f.field_key === key);
              return (
                <p key={key} className="text-sm text-gray-600">
                  <strong>{field?.label || key}:</strong> {value}
                </p>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
}
