import { AdjustmentType, PriceRule, PriceRulePayload, RuleType } from '@/src/models/priceProposal/create';
import { ColumnDef } from '@tanstack/react-table';

interface RuleColumnMeta {
  itemId: string;
  onUpdate: (ruleId: string, patch: Partial<PriceRulePayload>) => void;
  onRemove: (ruleId: string) => void;
}

const ruleTypeOptions: RuleType[] = ['WEEKEND', 'DATE_RANGE', 'SPECIFIC_DATE'];
const adjustmentOptions: AdjustmentType[] = ['FIXED_PRICE', 'PERCENTAGE', 'FIXED_AMOUNT'];
const priorityOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 10); // [10, 20, ..., 100]

const inputClass =
  'border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full';

// Stable uncontrolled number input — avoids losing focus on every keystroke
function ValueInput({
  ruleId,
  initialValue,
  onUpdate,
}: {
  ruleId: string;
  initialValue: number;
  onUpdate: (ruleId: string, patch: Partial<PriceRulePayload>) => void;
}) {
  return (
    <input
      type="number"
      key={ruleId}
      defaultValue={initialValue}
      onBlur={(e) => onUpdate(ruleId, { value: Number(e.target.value) })}
      onChange={(e) => {
        // prevent losing cursor — commit on blur only
        e.target.dataset.dirty = 'true';
      }}
      className={`${inputClass} w-28`}
      min={0}
    />
  );
}

export const buildRuleColumns = (meta: RuleColumnMeta): ColumnDef<PriceRule>[] => [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <select
        value={row.original.type}
        onChange={(e) => meta.onUpdate(row.original.id, { type: e.target.value as RuleType })}
        className={inputClass}
      >
        {ruleTypeOptions.map((t) => (
          <option key={t} value={t}>
            {t.replace('_', ' ')}
          </option>
        ))}
      </select>
    ),
  },
  {
    id: 'date_fields',
    header: 'Date / Range',
    cell: ({ row }) => {
      const rule = row.original;
      if (rule.type === 'SPECIFIC_DATE') {
        return (
          <input
            type="date"
            value={rule.date ?? ''}
            onChange={(e) => meta.onUpdate(rule.id, { date: e.target.value })}
            className={inputClass}
          />
        );
      }
      if (rule.type === 'DATE_RANGE') {
        return (
          <div className="flex gap-1 items-center">
            <input
              type="date"
              value={rule.start_date ?? ''}
              onChange={(e) => meta.onUpdate(rule.id, { start_date: e.target.value })}
              className={inputClass}
            />
            <span className="text-gray-400 text-xs">–</span>
            <input
              type="date"
              value={rule.end_date ?? ''}
              onChange={(e) => meta.onUpdate(rule.id, { end_date: e.target.value })}
              className={inputClass}
            />
          </div>
        );
      }
      return <span className="text-gray-400 text-xs italic">N/A</span>;
    },
  },
  {
    accessorKey: 'adjustment',
    header: 'Adjustment',
    cell: ({ row }) => (
      <select
        value={row.original.adjustment}
        onChange={(e) =>
          meta.onUpdate(row.original.id, { adjustment: e.target.value as AdjustmentType })
        }
        className={inputClass}
      >
        {adjustmentOptions.map((a) => (
          <option key={a} value={a}>
            {a.replace('_', ' ')}
          </option>
        ))}
      </select>
    ),
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <ValueInput
        ruleId={row.original.id}
        initialValue={row.original.value}
        onUpdate={meta.onUpdate}
      />
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <select
        value={row.original.priority}
        onChange={(e) =>
          meta.onUpdate(row.original.id, { priority: Number(e.target.value) })
        }
        className={`${inputClass} w-24`}
      >
        {priorityOptions.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => meta.onRemove(row.original.id)}
          className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
        >
          Remove
        </button>
      </div>
    ),
  },
];