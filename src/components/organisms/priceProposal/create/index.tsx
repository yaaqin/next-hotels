'use client';

import { CreatePriceProposalPayload } from "@/src/models/priceProposal/create";
import { usePriceProposalStore } from "@/src/stores/priceProposal/create";
import PriceItemCard from "./priceItemCard";
import Buttons from "@/src/components/atoms/buttons";
import { useCreatePriceProposal } from "@/src/hooks/mutation/priceProposal/create";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { useEffect } from "react";
import { usePriceProposalCreatableSites } from "@/src/hooks/query/priceProposal/creatableSites";
import { SelectSiteModal } from "./SelectSiteModal";

function formatInputDate(date: Date): string {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

function parseInputDate(str: string): Date | undefined {
    if (!str) return undefined
    const [y, m, d] = str.split("-").map(Number)
    return new Date(y, m - 1, d)
}

function formatDisplay(str: string): string {
    if (!str) return "Pick a date"
    const date = parseInputDate(str)
    return date?.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) ?? "Pick a date"
}

interface CreatePriceProposalFormProps {
    onSubmit?: (payload: CreatePriceProposalPayload) => void | Promise<void>;
    isLoading?: boolean;
}

export default function CreatePriceProposalForm({
    onSubmit,
    // isLoading = false,
}: CreatePriceProposalFormProps) {
    const {
        form,
        setSiteCode,
        setTitle,
        setDescription,
        setStartDate,
        setEndDate,
        addItem,
        getPayload,
        reset,
    } = usePriceProposalStore();

    const router = useRouter();
    const { mutate, isPending } = useCreatePriceProposal()

    // Akun cabang → cabang dikunci dari akun. Akun pusat → pilih lewat popup.
    const { data: creatable, isLoading: isLoadingSites, error: sitesError } = usePriceProposalCreatableSites();
    const lockedSiteCode = creatable?.data.lockedSiteCode ?? null;
    const sites = creatable?.data.sites ?? [];
    const selectedSite = sites.find((s) => s.siteCode === form.site_code);

    useEffect(() => {
        if (!creatable) return;
        if (lockedSiteCode) {
            if (form.site_code !== lockedSiteCode) setSiteCode(lockedSiteCode);
        } else if (form.site_code && !selectedSite) {
            // Sisa pilihan dari sesi/akun lain yang tidak berlaku lagi
            setSiteCode('');
        }
    }, [creatable, lockedSiteCode, form.site_code, selectedSite, setSiteCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = getPayload();
        mutate(payload, {
            onSuccess: () => {
                reset();
                if (!lockedSiteCode) setSiteCode('');
                router.push('/dashboard/price-proposal');
            },
        });
    };

    if (isLoadingSites) {
        return <div className="py-16 text-center text-sm text-gray-400">Memuat...</div>;
    }

    if (sitesError) {
        return (
            <div className="py-16 text-center text-sm text-gray-500">
                Akun kamu tidak punya akses untuk membuat price proposal.
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full mx-auto">
            {!lockedSiteCode && !form.site_code && (
                <SelectSiteModal
                    sites={sites}
                    onSelect={setSiteCode}
                    onClose={() => router.push('/dashboard/price-proposal')}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Create Price Proposal</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Fill in the proposal details and add room pricing items.</p>
                </div>
                {selectedSite && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {selectedSite.nama}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                            Harga dalam {selectedSite.currency}
                        </span>
                        {!lockedSiteCode && (
                            <button
                                type="button"
                                onClick={() => setSiteCode('')}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Ganti cabang
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Proposal Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Proposal Info
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. OTW Libur Lebaran"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Description
                        </label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Pricing Lebaran + 2 long weekend"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                    <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className={form.start_date ? "text-gray-800" : "text-gray-400"}>
                                        {formatDisplay(form.start_date)}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[200]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={parseInputDate(form.start_date)}
                                    onSelect={(date) => date && setStartDate(formatInputDate(date))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                    <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className={form.end_date ? "text-gray-800" : "text-gray-400"}>
                                        {formatDisplay(form.end_date)}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[200]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={parseInputDate(form.end_date)}
                                    onSelect={(date) => date && setEndDate(formatInputDate(date))}
                                    disabled={(date) => form.start_date ? date < parseInputDate(form.start_date)! : false}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Price Items */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Price Items
                    </h3>
                    <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                        <span className="text-base leading-none">+</span> Add Item
                    </button>
                </div>

                {form.items.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                        No items added yet. Click <strong>+ Add Item</strong> to get started.
                    </div>
                )}

                {form.items.map((item, index) => (
                    <PriceItemCard key={item.id} item={item} index={index} />
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Buttons
                    label="Reset"
                    onClick={reset}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                />
                <Buttons
                    onClick={handleSubmit}
                    label={isPending ? 'Submitting...' : 'Create Proposal'}
                    disable={isPending}
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                />
            </div>
        </div>
    );
}