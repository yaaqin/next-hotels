import { AdjustmentType, PriceRule, PriceRulePayload, RuleType } from '@/src/models/priceProposal/create';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

interface RuleColumnMeta {
  itemId: string;
  onUpdate: (ruleId: string, patch: Partial<PriceRulePayload>) => void;
  onRemove: (ruleId: string) => void;
}

const ruleTypeOptions: RuleType[] = ['WEEKEND', 'DATE_RANGE', 'SPECIFIC_DATE'];
const adjustmentOptions: AdjustmentType[] = ['FIXED_PRICE', 'PERCENTAGE', 'FIXED_AMOUNT'];
const priorityOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

const inputClass =
  'border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full';

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatInputDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function parseInputDate(str: string | undefined): Date | undefined {
  if (!str) return undefined
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function formatDisplay(str: string | undefined): string {
  if (!str) return "Pick a date"
  const date = parseInputDate(str)
  return date?.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) ?? "Pick a date"
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

function DatePicker({
  value,
  onChange,
  disableBefore,
}: {
  value: string | undefined
  onChange: (val: string) => void
  disableBefore?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1 text-sm text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full min-w-[130px]">
          <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className={value ? "text-gray-800" : "text-gray-400"}>
            {formatDisplay(value)}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[200]" align="start">
        <Calendar
          mode="single"
          selected={parseInputDate(value)}
          onSelect={(date) => date && onChange(formatInputDate(date))}
          disabled={(date) => disableBefore ? date < parseInputDate(disableBefore)! : false}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── ValueInput ───────────────────────────────────────────────────────────────

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
      onChange={(e) => { e.target.dataset.dirty = 'true' }}
      className={`${inputClass} w-28`}
      min={0}
    />
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

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
          <option key={t} value={t}>{t.replace('_', ' ')}</option>
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
          <DatePicker
            value={rule.date ?? ''}
            onChange={(val) => meta.onUpdate(rule.id, { date: val })}
          />
        )
      }

      if (rule.type === 'DATE_RANGE') {
        return (
          <div className="flex gap-1 items-center">
            <DatePicker
              value={rule.start_date ?? ''}
              onChange={(val) => meta.onUpdate(rule.id, { start_date: val })}
            />
            <span className="text-gray-400 text-xs shrink-0">–</span>
            <DatePicker
              value={rule.end_date ?? ''}
              onChange={(val) => meta.onUpdate(rule.id, { end_date: val })}
              disableBefore={rule.start_date}
            />
          </div>
        )
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
        onChange={(e) => meta.onUpdate(row.original.id, { adjustment: e.target.value as AdjustmentType })}
        className={inputClass}
      >
        {adjustmentOptions.map((a) => (
          <option key={a} value={a}>{a.replace('_', ' ')}</option>
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
        onChange={(e) => meta.onUpdate(row.original.id, { priority: Number(e.target.value) })}
        className={`${inputClass} w-24`}
      >
        {priorityOptions.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => meta.onRemove(row.original.id)}
        className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
      >
        Remove
      </button>
    ),
  },
];