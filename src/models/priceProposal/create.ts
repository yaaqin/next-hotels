export type RuleType = 'SPECIFIC_DATE' | 'DATE_RANGE' | 'WEEKEND';
export type AdjustmentType = 'FIXED_PRICE' | 'PERCENTAGE' | 'FIXED_AMOUNT';

// Runtime model — includes local `id` for table keys
export interface PriceRule {
  id: string;
  type: RuleType;
  date?: string;
  start_date?: string;
  end_date?: string;
  adjustment: AdjustmentType;
  value: number;
  priority: number;
}

export interface PriceItem {
  id: string;
  room_type_id: string;
  base_price: number;
  rules: PriceRule[];
}

// API payload types — no `id` fields
export interface PriceRulePayload {
  type: RuleType;
  date?: string;
  start_date?: string;
  end_date?: string;
  adjustment: AdjustmentType;
  value: number;
  priority: number;
}

export interface PriceItemPayload {
  room_type_id: string;
  base_price: number;
  rules: PriceRulePayload[];
}

export interface CreatePriceProposalPayload {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  items: PriceItemPayload[];
}

export interface PriceProposalFormState {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  items: PriceItem[];
}