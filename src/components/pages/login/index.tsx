'use client'
import { useLoginPinMutation } from '@/src/hooks/mutation/useLoginPinMutation';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Images from '../../atoms/images';
import { useTranslation } from 'react-i18next';
import { isSystemRole } from '@/src/constans/config';
import { LockPasswordIcon, MoonIcon, Sun01Icon, UserIcon } from 'hugeicons-react';
import { useThemeMode } from '@/src/hooks/useThemeMode';

const LOGO_URL = 'https://id.marinabaysands.com/content/dam/marinabaysands/secondary-navigation/logo-white-svg.svg'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { t } = useTranslation()
    const { isDark, toggleTheme } = useThemeMode()

    // Pesan error login sudah ditampilkan toast oleh interceptor axiosPublic
    const { mutate, isPending } = useLoginPinMutation();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate(
            {
                identifier: username,
                password,
            },
            {
                onSuccess: (res) => {
                    const accountType = res.data?.accountType;
                    if (accountType === 'RESTAURANT_ADMIN') {
                        router.push('/restaurant');
                    } else if (isSystemRole(res.data?.user?.role?.name)) {
                        router.push('/config-panel');
                    } else {
                        router.push('/dashboard');
                    }
                },
            }
        );
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-[#5b8ad0] via-[#3f6db5] to-[#2a4f8f] dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors">
            <div className="relative w-full max-w-5xl min-h-[580px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl shadow-blue-950/30 transition-colors">

                {/* Kiri: panel sambutan dengan lingkaran dekoratif */}
                <section className="relative hidden lg:flex flex-col justify-center pl-14 pr-28 text-white">
                    <div aria-hidden className="absolute -left-[35%] -top-[22%] h-[118%] aspect-square rounded-full bg-gradient-to-br from-[#4c7cc6] to-[#24498a] dark:from-blue-700 dark:to-blue-950" />
                    <div aria-hidden className="absolute -left-24 -bottom-40 w-80 h-80 rounded-full bg-gradient-to-tr from-[#2d5598] to-[#5585cf] dark:from-blue-950 dark:to-blue-800" />
                    <div aria-hidden className="absolute left-[52%] -bottom-6 w-44 h-44 rounded-full bg-gradient-to-br from-[#6b97da] to-[#2f5ba3] shadow-2xl shadow-blue-950/40 dark:from-blue-600 dark:to-blue-900" />

                    <div className="relative z-10 max-w-sm -mt-16">
                        <div className="flex items-center gap-2 mb-10">
                            <Images src={LOGO_URL} width={35} height={35} />
                            <span className="text-xl font-bold tracking-wide">MBS</span>
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-extrabold uppercase tracking-wider">{t('text.login.welcome')}</h1>
                        <p className="mt-3 text-lg font-semibold uppercase tracking-widest text-blue-100">{t('text.login.headline')}</p>
                        <p className="mt-5 text-sm leading-relaxed text-blue-100/80">{t('text.login.tagline')}</p>
                    </div>
                </section>

                {/* Kanan: form login */}
                <section className="relative flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-14">
                    <div aria-hidden className="absolute -right-12 -bottom-12 w-36 h-36 rounded-full bg-gradient-to-tr from-[#2d5598] to-[#6b97da] dark:from-blue-950 dark:to-blue-700" />

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={t('text.login.toggleTheme')}
                        title={t('text.login.toggleTheme')}
                        className="absolute top-5 right-5 p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                    >
                        {isDark ? <MoonIcon size={18} /> : <Sun01Icon size={18} />}
                    </button>

                    <div className="relative z-10 w-full max-w-sm mx-auto">
                        {/* Logo untuk layar kecil (panel kiri disembunyikan) */}
                        <div className="lg:hidden flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center p-2">
                                <Images src={LOGO_URL} width={35} height={35} />
                            </div>
                            <span className="text-2xl font-bold text-gray-800 dark:text-slate-100">MBS</span>
                        </div>

                        <h2 className="text-4xl font-bold text-gray-800 dark:text-slate-100">{t('text.login.title')}</h2>
                        <p className="mt-2 mb-8 text-sm text-gray-500 dark:text-slate-400">{t('text.login.desk')}</p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="flex items-center gap-3 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition">
                                <UserIcon size={20} className="shrink-0 text-gray-600 dark:text-slate-400" />
                                <label htmlFor="username" className="sr-only">{t('label.username')}</label>
                                <input
                                    type="text"
                                    id="username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t('placeholder.login.username')}
                                    className="w-full py-3.5 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition">
                                <LockPasswordIcon size={20} className="shrink-0 text-gray-600 dark:text-slate-400" />
                                <label htmlFor="password" className="sr-only">{t('label.password')}</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('placeholder.login.password')}
                                    className="w-full py-3.5 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500 outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-pressed={showPassword}
                                    className="shrink-0 text-xs font-bold tracking-wide text-[#2b4f8e] hover:text-[#4c7cc6] dark:text-blue-300 dark:hover:text-blue-200"
                                >
                                    {showPassword ? t('text.login.hidePassword') : t('text.login.showPassword')}
                                </button>
                            </div>

                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-medium text-[#2b4f8e] hover:text-[#4c7cc6] dark:text-blue-300 dark:hover:text-blue-200">
                                    {t('text.login.forgot')}
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-3.5 rounded-xl font-semibold text-white bg-[#2b4f8e] hover:bg-[#223f73] dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 transition"
                            >
                                {isPending ? t('text.login.submitting') : t('text.login.submit')}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}
