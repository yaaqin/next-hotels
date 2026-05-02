'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { ProposalType } from '@/src/models/partnerProposal/create'
import { useCreateProposal } from '@/src/hooks/mutation/partnerProposal/create'
import { Inputs } from '../../../molecules/inputs/inputs'
import { Selects } from '../../../molecules/inputs/selects'

const proposalTypeOptions = [
  { id: 1, value: ProposalType.SUBSCRIPTION, label: 'Subscription' },
  { id: 2, value: ProposalType.REVENUE_SHARE, label: 'Revenue Share' },
]

export default function CreateProposalPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { mutate, isPending } = useCreateProposal()

  const [form, setForm] = useState({
    restaurantSiteId: '',
    type: '' as ProposalType | '',
    flatFeeMonthly: '',
    monthlyCapIdr: '',
    surchargeAfterCapPct: '',
    revenueSharePct: '',
    freePeriodDays: '',
    startDate: '',
    note: '',
  })

  const [errors, setErrors] = useState({
    restaurantSiteId: '',
    type: '',
    flatFeeMonthly: '',
    monthlyCapIdr: '',
    surchargeAfterCapPct: '',
    revenueSharePct: '',
    freePeriodDays: '',
    startDate: '',
  })

  const isSubscription = form.type === ProposalType.SUBSCRIPTION
  const isRevenueShare = form.type === ProposalType.REVENUE_SHARE

  const validate = () => {
    const newErrors = {
      restaurantSiteId: '',
      type: '',
      flatFeeMonthly: '',
      monthlyCapIdr: '',
      surchargeAfterCapPct: '',
      revenueSharePct: '',
      freePeriodDays: '',
      startDate: '',
    }
    let valid = true

    if (!form.restaurantSiteId.trim()) {
      newErrors.restaurantSiteId = 'Restaurant Site ID is required'
      valid = false
    }

    if (!form.type) {
      newErrors.type = 'Type is required'
      valid = false
    }

    if (!form.startDate) {
      newErrors.startDate = 'Start date is required'
      valid = false
    }

    if (isSubscription) {
      if (!form.flatFeeMonthly) {
        newErrors.flatFeeMonthly = 'Flat fee monthly is required'
        valid = false
      }
      if (!form.monthlyCapIdr) {
        newErrors.monthlyCapIdr = 'Monthly cap is required'
        valid = false
      }
      if (!form.surchargeAfterCapPct) {
        newErrors.surchargeAfterCapPct = 'Surcharge after cap is required'
        valid = false
      }
    }

    if (isRevenueShare) {
      if (!form.revenueSharePct) {
        newErrors.revenueSharePct = 'Revenue share % is required'
        valid = false
      }
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return

    mutate({
      restaurantSiteId: form.restaurantSiteId,
      type: form.type as ProposalType,
      flatFeeMonthly: isSubscription ? Number(form.flatFeeMonthly) : null,
      monthlyCapIdr: isSubscription ? Number(form.monthlyCapIdr) : null,
      surchargeAfterCapPct: isSubscription ? Number(form.surchargeAfterCapPct) : null,
      revenueSharePct: isRevenueShare ? Number(form.revenueSharePct) : null,
      freePeriodDays: form.freePeriodDays ? Number(form.freePeriodDays) : null,
      startDate: form.startDate,
      note: form.note,
    }, {
      onSuccess: () => {
        router.push('/dashboard/partnership-proposal')
      },
      onError: (err) => {
        console.error(err)
      },
    })
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="flex justify-between items-center">
        <h6 className="text-xl font-semibold">Create Partnership Proposal</h6>
        <Link
          href="/dashboard/partner-proposal"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
        >
          {t('label.back')}
        </Link>
      </section>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 max-w-lg space-y-4">

        <Inputs
          label="Restaurant Site ID"
          value={form.restaurantSiteId}
          onChange={(val) => setForm((prev) => ({ ...prev, restaurantSiteId: val }))}
          error={errors.restaurantSiteId}
          required
          placeholder="c751cbc3-558d-4de5-85b8-b30179e92a0d"
        />

        <Selects
          label="Type"
          value={form.type}
          onChange={(val) => setForm((prev) => ({ ...prev, type: val as ProposalType }))}
          options={proposalTypeOptions}
          error={errors.type}
          required
          placeholder="Select type"
        />

        {/* Subscription Fields */}
        {isSubscription && (
          <>
            <Inputs
              label="Flat Fee Monthly (IDR)"
              value={form.flatFeeMonthly}
              onChange={(val) => setForm((prev) => ({ ...prev, flatFeeMonthly: val }))}
              error={errors.flatFeeMonthly}
              required
              placeholder="5000000"
            />
            <Inputs
              label="Monthly Cap (IDR)"
              value={form.monthlyCapIdr}
              onChange={(val) => setForm((prev) => ({ ...prev, monthlyCapIdr: val }))}
              error={errors.monthlyCapIdr}
              required
              placeholder="200000000"
            />
            <Inputs
              label="Surcharge After Cap (%)"
              value={form.surchargeAfterCapPct}
              onChange={(val) => setForm((prev) => ({ ...prev, surchargeAfterCapPct: val }))}
              error={errors.surchargeAfterCapPct}
              required
              placeholder="10"
            />
          </>
        )}

        {/* Revenue Share Fields */}
        {isRevenueShare && (
          <Inputs
            label="Revenue Share (%)"
            value={form.revenueSharePct}
            onChange={(val) => setForm((prev) => ({ ...prev, revenueSharePct: val }))}
            error={errors.revenueSharePct}
            required
            placeholder="15"
          />
        )}

        {/* Common Fields */}
        <Inputs
          label="Free Period (Days)"
          value={form.freePeriodDays}
          onChange={(val) => setForm((prev) => ({ ...prev, freePeriodDays: val }))}
          placeholder="7"
        />

        <Inputs
          label="Start Date"
          value={form.startDate}
          onChange={(val) => setForm((prev) => ({ ...prev, startDate: val }))}
          error={errors.startDate}
          required
          placeholder="2026-06-01"
        />

        <Inputs
          label="Note"
          value={form.note}
          onChange={(val) => setForm((prev) => ({ ...prev, note: val }))}
          placeholder="Optional note..."
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
            href="/dashboard/partner-proposal"
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            {t('label.cancel')}
          </Link>
        </div>
      </div>

    </div>
  )
}