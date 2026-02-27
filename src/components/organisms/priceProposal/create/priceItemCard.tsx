import { PriceItem, PriceRulePayload } from "@/src/models/priceProposal/create";
import { usePriceProposalStore } from "@/src/stores/priceProposal/create";
import RuleTable from "./ruleTable";
import { Selects } from "@/src/components/molecules/inputs/selects";
import { useRoomTypeList } from "@/src/hooks/query/roomTypes";
import { mapRoomTypeToOptions } from "@/src/utils/roomType/mapRoomTypeTranslations";
import { Inputs } from "@/src/components/molecules/inputs/inputs";

interface PriceItemCardProps {
    item: PriceItem;
    index: number;
}

export default function PriceItemCard({ item, index }: PriceItemCardProps) {
    const { removeItem, updateItem, addRule, removeRule, updateRule } = usePriceProposalStore();
    const { data: roomType } = useRoomTypeList()

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
            {/* Card Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Item #{index + 1}</h3>
                <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                    Remove Item
                </button>
            </div>

            {/* Item Fields */}
            <div className="grid grid-cols-2 gap-4 items-center">
                <Selects label={"Room Type ID"} value={item.room_type_id} options={mapRoomTypeToOptions(roomType)} onChange={(e) => updateItem(item.id, { room_type_id: e })} />
                {/* <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Room Type ID
          </label>
          <input
            type="text"
            value={item.room_type_id}
            onChange={(e) => updateItem(item.id, { room_type_id: e.target.value })}
            placeholder="e.g. DELUXE"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

                {/* <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Base Price
                    </label>
                    <input
                        type="number"
                        value={item.base_price}
                        onChange={(e) => updateItem(item.id, { base_price: Number(e.target.value) })}
                        placeholder="e.g. 399999"
                        min={0}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div> */}
                <Inputs label={"Base Price"} value={`${item.base_price}`} numberOnly onChange={(e) => updateItem(item.id, { base_price: Number(e) })}/>
            </div>

            {/* Rules Table */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Rules
                </label>
                <RuleTable
                    itemId={item.id}
                    rules={item.rules}
                    onAdd={() => addRule(item.id)}
                    onRemove={(ruleId: string) => removeRule(item.id, ruleId)}
                    onUpdate={(ruleId: string, patch: Partial<PriceRulePayload>) => updateRule(item.id, ruleId, patch)}
                />
            </div>
        </div>
    );
}