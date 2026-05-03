'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateAdminResto } from '@/src/hooks/mutation/adminResto/create'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Passwords } from '@/src/components/molecules/inputs/passwords'
import { Emails } from '@/src/components/molecules/inputs/emails'
import { Inputs } from '@/src/components/molecules/inputs/inputs'

export default function CreateAdminRestoPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { mutate, isPending } = useCreateAdminResto()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    })

    const [confirmPassword, setConfirmPassword] = useState('')

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    })

    const validate = () => {
        const newErrors = { name: '', email: '', password: '', confirmPassword: '', phone: '' }
        let valid = true

        if (!form.name.trim()) {
            newErrors.name = 'Name is required'
            valid = false
        }

        if (!form.email.trim()) {
            newErrors.email = 'Email is required'
            valid = false
        }

        if (!form.password.trim()) {
            newErrors.password = 'Password is required'
            valid = false
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            valid = false
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm password is required'
            valid = false
        } else if (form.password !== confirmPassword) {
            newErrors.confirmPassword = 'Password does not match'
            valid = false
        }

        if (!form.phone.trim()) {
            newErrors.phone = 'Phone is required'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const handleSubmit = () => {
        if (!validate()) return

        mutate(form, {
            onSuccess: () => {
                router.push('/dashboard/admin-restaurant')
            },
            onError: (err) => {
                console.error(err)
            },
        })
    }

    return (
        <div className='w-full'>
            {/* Header */}
            <section className="flex justify-between items-center mb-6">
                <h6 className="text-xl font-semibold">Create Admin Restaurant</h6>
                <Link
                    href="/dashboard/admin-resto"
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                >
                    {t('label.back')}
                </Link>
            </section>

            {/* Form */}
            <div className="bg-white rounded-lg shadow p-6 w-full space-y-4">
                <Inputs
                    label={t('label.name')}
                    value={form.name}
                    onChange={(val) => setForm((prev) => ({ ...prev, name: val }))}
                    error={errors.name}
                    required
                    placeholder="Budi Santoso"
                />

                <Emails
                    label="Email"
                    value={form.email}
                    onChange={(val) => setForm((prev) => ({ ...prev, email: val }))}
                    error={errors.email}
                    required
                    placeholder="owner@example.com"
                />

                <Passwords
                    label={t('label.password')}
                    value={form.password}
                    onChange={(val) => setForm((prev) => ({ ...prev, password: val }))}
                    error={errors.password}
                    required
                    placeholder="Min. 6 characters"
                />

                <Passwords
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(val) => setConfirmPassword(val)}
                    error={errors.confirmPassword}
                    required
                    placeholder="Re-enter password"
                />

                <Inputs
                    label={t('label.phone')}
                    value={form.phone}
                    onChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
                    error={errors.phone}
                    required
                    placeholder="08123456789"
                />

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Saving...' : t('label.save')}
                    </button>
                    <Link
                        href="/dashboard/admin-restaurant"
                        className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                    >
                        {t('label.cancel')}
                    </Link>
                </div>
            </div>
        </div>
    )
}