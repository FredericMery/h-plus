"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";

type Section = {
  id: string;
  name: string;
  search_template: string | null;
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
        .order("created_at", { ascending: false });

      setItems(itemData || []);
    };

    init();
  }, [slug, user]);

  const addItem = async () => {
    if (!user || !section || !title) return;

    let uploadedImageUrl: string | null = null;

    if (imageFile) {
      const fileName = `${user.id}-${Date.now()}`;

      const { error } = await supabase.storage
        .from("memory-images")
        .upload(fileName, imageFile, {
          upsert: false,
        });

      if (!error) {
        const { data } = supabase.storage
          .from("memory-images")
          .getPublicUrl(fileName);

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
    const confirmDelete = confirm("Supprimer cette entrée ?");
    if (!confirmDelete) return;

    await supabase
      .from("memory_items")
      .delete()
      .eq("id", id);

    setItems(items.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    setTitle("");
    setRating(0);
    setExtraData({});
    setImageFile(null);
    setShowForm(false);
  };

  const buildSearchUrl = (item: Item) => {
    if (!section?.search_template) return null;

    let query = section.search_template;

    query = query.replace(/\$\{title\}/g, item.title);

    Object.entries(item.extra_data || {}).forEach(([key, value]) => {
      query = query.replace(
        new RegExp(`\\$\\{${key}\\}`, "g"),
        String(value)
      );
    });

    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  if (!section) return <div>Loading...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          {section.name}
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm"
        >
          +
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Nouvelle entrée
            </h2>

            <input
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4"
            />

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="mb-4"
            />

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Note (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
                className="w-24 p-2 border rounded-xl"
              />
            </div>

            {fields.map((field) => (
              <input
                key={field.id}
                placeholder={field.label}
                value={extraData[field.field_key] || ""}
                onChange={(e) =>
                  setExtraData({
                    ...extraData,
                    [field.field_key]: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-xl mb-3"
              />
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={resetForm}
                className="text-gray-500"
              >
                Annuler
              </button>

              <button
                onClick={addItem}
                className="bg-black text-white px-4 py-2 rounded-xl"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTE */}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              const url = buildSearchUrl(item);
              if (url) window.open(url, "_blank");
            }}
            className="bg-white p-6 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg">
                {item.title}
              </h2>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="text-gray-400 hover:text-red-500 transition text-sm"
              >
                🗑
              </button>
            </div>

            {item.image_url && (
              <div className="relative w-full h-40 overflow-hidden rounded-xl">
                <img
                  src={item.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.style.display = "none")
                  }
                />
              </div>
            )}

            {item.rating !== null && (
              <p className="text-sm text-gray-500">
                ⭐ {item.rating}/5
              </p>
            )}

            {Object.entries(item.extra_data || {}).map(
              ([key, value]) => (
                <p
                  key={key}
                  className="text-sm text-gray-600"
                >
                  <strong>{key}:</strong> {String(value)}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
