import React, { useEffect, useState } from "react";
import Images from "../../atoms/images";
import { MoonIcon, Sun01Icon } from "hugeicons-react";
import { queryClient } from "@/src/libs/react-query";

const LANG_OPTIONS = [
  { label: "Bahasa Indonesia", value: "idn" },
  { label: "English", value: "eng" },
  { label: "日本語", value: "jpn" },
  { label: "中文", value: "chn" },
];

const ProfileCardnavbar: React.FC<{
  name: string;
  email: string;
  avatarUrl: string;
}> = ({ name, email, avatarUrl }) => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<string>("idn");

  const isDark = theme === 'dark'

  // 🔹 init from localStorage
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") ?? "light";
    const savedLang = localStorage.getItem("language") ?? "idn";

    setTheme(savedTheme);
    setLanguage(savedLang);

    document.documentElement.classList.toggle(
      "dark",
      savedTheme === "dark"
    );
  }, []);

  // 🔹 change theme
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // 🔹 change language
  const changeLanguage = (value: string) => {
    setLanguage(value)
    localStorage.setItem("language", value)

    window.addEventListener("language-change", () => {
      queryClient.invalidateQueries()
    })

    window.dispatchEvent(
      new CustomEvent("language-change", {
        detail: { language: value },
      })
    )
  }


  return (
    <div className="relative">
      {/* Card */}
      <div className="flex items-center justify-between rounded-xl bg-[#459997] px-3 py-2">
        <div className="flex items-center gap-3">
          <Images
            src={avatarUrl}
            alt={name}
            width={30}
            height={30}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="leading-tight">
            <p className="text-xs font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-800">{email}</p>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-blue-300"
        >
          ⋮
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg z-50">
          {/* Language */}
          <div className="px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">
              Language
            </p>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full rounded-md border px-2 py-1 text-sm focus:outline-none"
            >
              {LANG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Theme */}
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-gray-700">Theme</p>
            <button
              onClick={toggleTheme}
              className="p-2 text-lg rounded-xl border border-zinc-300 dark:border-zinc-700"
            >
              {isDark ? <MoonIcon /> : <Sun01Icon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCardnavbar;
