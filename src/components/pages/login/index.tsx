'use client'
import { useLoginPinMutation } from '@/src/hooks/mutation/useLoginPinMutation';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Images from '../../atoms/images';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const { t } = useTranslation()

    const { mutate, isPending, isError, error } = useLoginPinMutation();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate(
            {
                identifier: username,
                password,
            },
            {
                onSuccess: () => {
                    router.push("/dashboard");
                },
            }
        );
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
        console.log('Google login clicked');
        console.log('nickname==>', username)
        console.log("password==>", password)
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden">

                {/* Left Side - Login Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center p-2">
                                <Images src='https://id.marinabaysands.com/content/dam/marinabaysands/secondary-navigation/logo-white-svg.svg' width={35} height={35} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">MBS</h1>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('text.login.welcome')}</h2>
                    <p className="text-gray-500 mb-8">{t('text.login.desk')}</p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                                required
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-end">
                            {/* <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label> */}
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </button>

                        {/* Divider */}
                        {/* <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div> */}

                        {/* Google Login Button */}
                        {/* <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-gray-700 font-medium">Continue with Google</span>
                        </button> */}
                    </form>

                    {/* Sign Up Link */}
                    {/* <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign up now
                        </a>
                    </p> */}
                </div>

                {/* Right Side - Image/Dashboard Preview */}
                <div className="hidden lg:block bg-gradient-to-br from-blue-600 to-blue-800 p-12 relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-center">
                        <div className="mb-8">
                            <h3 className="text-3xl font-bold text-white mb-4">Get more with less</h3>
                            <p className="text-blue-100">
                                Waydev analyzes your codebase from GitHub, GitLab, Azure DevOps & Bitbucket
                                to help you bring out the best in your engineer's work.
                            </p>
                        </div>

                        {/* Dashboard Preview Image Placeholder */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="bg-white rounded-lg shadow-2xl p-4">
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1 bg-gray-100 rounded h-8"></div>
                                    <div className="flex-1 bg-gray-100 rounded h-8"></div>
                                    <div className="flex-1 bg-gray-100 rounded h-8"></div>
                                </div>
                                <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded h-32 mb-4"></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded h-16"></div>
                                    <div className="bg-blue-100 rounded h-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}