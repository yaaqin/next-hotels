"use client";

import React, { useEffect, useState } from "react";
import Buttons from "@/src/components/atoms/buttons";
import { Inputs } from "@/src/components/molecules/inputs/inputs";

type Lang = "idn" | "eng" | "jpn" | "chn";

export interface RoomTypeFormInitialData {
  translations: {
    lang: Lang;
    name: string;
    desk: string;
  }[];
}

const LANG_LABEL: Record<Lang, string> = {
  idn: "IDN",
  eng: "ENG",
  jpn: "JPN",
  chn: "CHN",
};

export default function RoomTypeMultiTranslationForm({
  initialData,
  onSubmit,
}: {
  initialData?: {
    translations: {
      lang: Lang;
      name: string;
      desk: string;
    }[];
  };
  onSubmit: (payload: {
    translations: { lang: Lang; name: string; desk: string }[];
  }) => void;
}) {
  const [form, setForm] = useState({
    idn: { name: "", desk: "" },
    eng: { name: "", desk: "" },
    jpn: { name: "", desk: "" },
    chn: { name: "", desk: "" },
  });

  // 🔥 inject default value dari backend
  useEffect(() => {
    if (!initialData?.translations) return;

    const next = { ...form };

    initialData.translations.forEach((t) => {
      next[t.lang] = {
        name: t.name,
        desk: t.desk,
      };
    });

    setForm(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (
    lang: Lang,
    field: "name" | "desk",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const payload = Object.entries(form)
      .map(([lang, value]) => ({
        lang: lang as Lang,
        name: value.name.trim(),
        desk: value.desk.trim(),
      }))
      // minimal 1 object yang diisi
      .filter((t) => t.name || t.desk);

    if (payload.length === 0) return;

    onSubmit({ translations: payload });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {(Object.keys(form) as Lang[]).map((lang) => (
          <div
            key={lang}
            className="rounded-xl border p-4 space-y-3"
          >
            <h3 className="font-semibold">{LANG_LABEL[lang]}</h3>

            <Inputs
              label="Name"
              value={form[lang].name}
              onChange={(v) => handleChange(lang, "name", v)}
            />

            <Inputs
              label="Desk"
              value={form[lang].desk}
              onChange={(v) => handleChange(lang, "desk", v)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Buttons label="Save" onClick={handleSubmit} />
      </div>
    </div>
  );
}
