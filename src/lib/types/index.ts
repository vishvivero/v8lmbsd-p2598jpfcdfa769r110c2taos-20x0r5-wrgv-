export interface Profile {
  id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
  monthly_payment: number | null;
  preferred_currency: string | null;
  is_admin: boolean | null;
  selected_strategy: string;
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number;
  banker_name: string;
  currency_symbol: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  category: string;
  next_payment_date?: string;
}
