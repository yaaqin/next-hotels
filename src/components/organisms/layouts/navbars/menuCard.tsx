"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, Clock01Icon, Settings01Icon, BookOpen02Icon, Globe02Icon } from "hugeicons-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useQueryClient } from "@tanstack/react-query";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type Lang = "idn" | "eng" | "jpn" | "chn";

const languages: { value: Lang; label: string; flag: string }[] = [
  { value: "idn", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { value: "eng", label: "English", flag: "🇬🇧" },
  { value: "jpn", label: "日本語", flag: "🇯🇵" },
  { value: "chn", label: "中文", flag: "🇨🇳" },
];

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const { t } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const { language: selected, setLanguage } = useLanguageStore();
  const queryClient = useQueryClient();

  const handleChangeLanguage = (lang: Lang) => {
    setLanguage(lang);
    setLangOpen(false);
    queryClient.invalidateQueries();
  };

  const selectedLang = languages.find((l) => l.value === selected);

  const MENU_ITEMS = [
    {
      label: t("text.navbar.menu.profile"),
      description: t("text.navbar.menu.profileDesk"),
      icon: UserIcon,
      path: "/profile",
    },
    {
      label: t("text.navbar.menu.activity"),
      description: t("text.navbar.menu.activityDesk"),
      icon: BookOpen02Icon,
      path: "/recent-activity",
    },
    {
      label: t("text.navbar.menu.history"),
      description: t("text.navbar.menu.historyDesk"),
      icon: Clock01Icon,
      path: "/history",
    },
    // {
    //   label: t("text.navbar.menu.setting"),
    //   description: t("text.navbar.menu.settingDesk"),
    //   icon: Settings01Icon,
    //   path: "/setting",
    // },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-8 text-gray-400 hover:text-gray-900 transition-colors duration-200 text-2xl font-light"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Inner Content */}
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 flex gap-6">

            {/* Left — Image / Mood */}
            <motion.div
              className="hidden md:flex w-1/2 h-[75vh] rounded-3xl overflow-hidden relative bg-gray-100 items-end"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src="https://cdn.yaaqin.xyz/hotel/1774412241173-htol.jpg"
                alt="Account"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-8 bg-gradient-to-t from-black/60 to-transparent w-full">
                <p className="text-white/70 text-xs tracking-widest uppercase mb-1">
                  Marina Bay Sand
                </p>
                <h2 className="text-white text-2xl font-semibold leading-tight">
                  {t("text.navbar.menu.yourAccount")}, <br /> {t("text.navbar.menu.yourWay")}
                </h2>
              </div>
            </motion.div>

            {/* Right — Menu List */}
            <motion.div
              className="w-full md:w-1/2 rounded-3xl border border-blue-100 flex flex-col justify-center px-6 md:px-10 py-10 md:py-12"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <p className="text-xs tracking-widest uppercase text-blue-400 mb-2">
                {t("text.navbar.menu.navigate")}
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                {t("text.navbar.menu.where")}?
              </h3>

              <div className="flex flex-col gap-3">
                {MENU_ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    >
                      <Link
                        href={item.path}
                        onClick={onClose}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-xl border border-blue-100 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                          <Icon size={18} className="text-blue-500" />
                        </span>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                        <span className="ml-auto text-gray-300 group-hover:text-blue-400 transition-colors text-lg">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Language Switcher */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + MENU_ITEMS.length * 0.08, duration: 0.4 }}
                  className="relative"
                >
                  <button
                    onClick={() => setLangOpen((prev) => !prev)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-blue-100 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors flex-shrink-0">
                      <Globe02Icon size={15} className="text-blue-500" />
                    </span>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-none mb-0.5">
                        {t("label.language")}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {selectedLang?.flag} {selectedLang?.label}
                      </p>
                    </div>
                    <span
                      className={`ml-auto text-gray-300 group-hover:text-blue-400 transition-all duration-200 text-sm flex-shrink-0 ${langOpen ? "rotate-90" : ""
                        }`}
                    >
                      →
                    </span>
                  </button>
                  {/* Dropdown */}
                  <AnimatePresence>
                    {langOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scaleY: 0.97 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 bg-white border border-blue-100 rounded-xl shadow-md overflow-hidden"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.value}
                            onClick={() => handleChangeLanguage(lang.value)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-xs transition-colors hover:bg-blue-50 ${selected === lang.value
                                ? "font-semibold text-blue-600 bg-blue-50/60"
                                : "text-gray-600"
                              }`}
                          >
                            <span className="text-sm">{lang.flag}</span>
                            <span>{lang.label}</span>
                            {selected === lang.value && (
                              <span className="ml-auto text-blue-400 text-[10px]">✓</span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}