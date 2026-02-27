import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { CreatePriceProposalPayload, PriceItem, PriceItemPayload, PriceProposalFormState, PriceRule, PriceRulePayload } from '@/src/models/priceProposal/create';

interface PriceProposalStore {
  form: PriceProposalFormState;

  // Form field setters
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;

  // Item actions
  addItem: () => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, patch: Partial<Omit<PriceItem, 'id' | 'rules'>>) => void;

  // Rule actions
  addRule: (itemId: string) => void;
  removeRule: (itemId: string, ruleId: string) => void;
  updateRule: (itemId: string, ruleId: string, patch: Partial<Omit<PriceRule, 'id'>>) => void;

  // Helpers
  getPayload: () => CreatePriceProposalPayload;
  reset: () => void;
}

const defaultRule = (): PriceRule => ({
  id: uuidv4(),
  type: 'WEEKEND',
  adjustment: 'FIXED_PRICE',
  value: 0,
  priority: 50,
});

const defaultItem = (): PriceItem => ({
  id: uuidv4(),
  room_type_id: '',
  base_price: 0,
  rules: [defaultRule()],
});

const initialForm: PriceProposalFormState = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  items: [],
};

const initialState = {
  form: initialForm,
};

export const usePriceProposalStore = create<PriceProposalStore>((set, get) => ({
  ...initialState,

  setTitle: (title) => set((s) => ({ form: { ...s.form, title } })),
  setDescription: (description) => set((s) => ({ form: { ...s.form, description } })),
  setStartDate: (start_date) => set((s) => ({ form: { ...s.form, start_date } })),
  setEndDate: (end_date) => set((s) => ({ form: { ...s.form, end_date } })),

  addItem: () =>
    set((s) => ({
      form: { ...s.form, items: [...s.form.items, defaultItem()] },
    })),

  removeItem: (itemId) =>
    set((s) => ({
      form: { ...s.form, items: s.form.items.filter((i) => i.id !== itemId) },
    })),

  updateItem: (itemId, patch) =>
    set((s) => ({
      form: {
        ...s.form,
        items: s.form.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
      },
    })),

  addRule: (itemId) =>
    set((s) => ({
      form: {
        ...s.form,
        items: s.form.items.map((i) =>
          i.id === itemId ? { ...i, rules: [...i.rules, defaultRule()] } : i
        ),
      },
    })),

  removeRule: (itemId, ruleId) =>
    set((s) => ({
      form: {
        ...s.form,
        items: s.form.items.map((i) =>
          i.id === itemId
            ? { ...i, rules: i.rules.filter((r) => r.id !== ruleId) }
            : i
        ),
      },
    })),

  updateRule: (itemId, ruleId, patch) =>
    set((s) => ({
      form: {
        ...s.form,
        items: s.form.items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                rules: i.rules.map((r) => (r.id === ruleId ? { ...r, ...patch } : r)),
              }
            : i
        ),
      },
    })),

  getPayload: (): CreatePriceProposalPayload => {
    const { form } = get();
    return {
      title: form.title,
      description: form.description,
      start_date: form.start_date,
      end_date: form.end_date,
      items: form.items.map(({ id: _id, rules, ...itemRest }): PriceItemPayload => ({
        ...itemRest,
        rules: rules.map(({ id: _rid, ...ruleRest }): PriceRulePayload => ruleRest),
      })),
    };
  },

  reset: () => set({ ...initialState }),
}));