'use client';

import { CreatePriceProposalPayload } from "@/src/models/priceProposal/create";
import { usePriceProposalStore } from "@/src/stores/priceProposal/create";
import PriceItemCard from "./priceItemCard";
import Buttons from "@/src/components/atoms/buttons";
import { useCreatePriceProposal } from "@/src/hooks/mutation/priceProposal/create";
import { useRouter } from "next/navigation";

interface CreatePriceProposalFormProps {
    onSubmit?: (payload: CreatePriceProposalPayload) => void | Promise<void>;
    isLoading?: boolean;
}

export default function CreatePriceProposalForm({
    onSubmit,
    isLoading = false,
}: CreatePriceProposalFormProps) {
    const {
        form,
        setTitle,
        setDescription,
        setStartDate,
        setEndDate,
        addItem,
        getPayload,
        reset,
    } = usePriceProposalStore();
    
    const router = useRouter();
    const { mutate } = useCreatePriceProposal()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = getPayload();
        mutate(payload, {
            onSuccess: () => {
                reset();
                router.push('/dashboard/price-proposal');
            },
        });
    };

    return (
        <div className="space-y-6 w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Create Price Proposal</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Fill in the proposal details and add room pricing items.</p>
                </div>
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

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={form.start_date}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={form.end_date}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                <button
                    type="button"
                    onClick={reset}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Reset
                </button>
                <Buttons
                    onClick={handleSubmit}
                    label={isLoading ? 'Submitting...' : 'Create Proposal'}
                    disable={isLoading}
                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                />
            </div>
        </div>
    );
}