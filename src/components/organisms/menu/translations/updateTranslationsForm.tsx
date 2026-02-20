"use client";

import React, { useEffect, useState } from "react";
import Buttons from "@/src/components/atoms/buttons";
import { Inputs } from "@/src/components/molecules/inputs/inputs";
import { Translation } from "@/src/models/menu/detailTranslations";
import { useMenuMultiTranslation } from "@/src/hooks/mutation/menu/useMenuMultiTranslation";

type Lang = "idn" | "eng" | "jpn" | "chn";

const LANG_LABEL: Record<Lang, string> = {
  idn: "IDN",
  eng: "ENG",
  jpn: "JPN",
  chn: "CHN",
};

const ALL_LANGS: Lang[] = ["idn", "eng", "jpn", "chn"];

export default function MenuTranslationForm({
  initialData,
  onSubmit,
}: {
  initialData?: Translation[];
  onSubmit: (payload: { lang: Lang; name: string }[]) => void;
}) {

// di onSubmit form
// const handleSubmit = (payload: { lang: string; name: string }[]) => {
//   mutate(
//     { translations: payload },
//     {
//       onSuccess: () => console.log('translations saved'),
//       onError: (err) => console.error(err),
//     },
//   );
// };

  const [form, setForm] = useState<Record<Lang, string>>({
    idn: "",
    eng: "",
    jpn: "",
    chn: "",
  });

  // Inject value dari data existing
  useEffect(() => {
    if (!initialData || initialData.length === 0) return;

    const next = { ...form };
    initialData.forEach((t) => {
      if (t.lang in next) {
        next[t.lang as Lang] = t.name;
      }
    });
    setForm(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (lang: Lang, value: string) => {
    setForm((prev) => ({ ...prev, [lang]: value }));
  };

  const handleSubmit = () => {
    const payload = ALL_LANGS
      .map((lang) => ({ lang, name: form[lang].trim() }))
      .filter((t) => t.name.length > 0);

    if (payload.length === 0) return;
    onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      <h5 className="text-xl">Update Translation</h5>

      <div className="grid grid-cols-2 gap-6">
        {ALL_LANGS.map((lang) => (
          <div key={lang} className="rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold">{LANG_LABEL[lang]}</h3>
            <Inputs
              label="Name"
              value={form[lang]}
              onChange={(v) => handleChange(lang, v)}
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