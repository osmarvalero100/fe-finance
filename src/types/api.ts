// API Types for Personal Finance API

export interface UserRegister {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface BodyLoginAuthLoginPost {
  username: string;
  password: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  category_type: 'expense' | 'income';
  parent_id?: number;
  is_active?: boolean;
}

export interface CategoryResponse {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  category_type: 'expense' | 'income';
  parent_id?: number;
  is_active?: boolean;
  id: number;
  user_id: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  category_type?: 'expense' | 'income';
  parent_id?: number;
  is_active?: boolean;
}

export interface TagCreate {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

export interface TagResponse {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TagUpdate {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

export interface PaymentMethodCreate {
  name: string;
  description?: string;
  payment_type: string;
  institution?: string;
  account_number?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface PaymentMethodResponse {
  name: string;
  description?: string;
  payment_type: string;
  institution?: string;
  account_number?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  is_active?: boolean;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodUpdate {
  name?: string;
  description?: string;
  payment_type?: string;
  institution?: string;
  account_number?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface ExpenseCreate {
  amount: number;
  description: string;
  category_id: number;
  date: string;
  payment_method_id?: number;
  is_recurring?: boolean;
  recurring_frequency?: string;
  tag_ids?: number[];
  notes?: string;
}

export interface ExpenseResponse {
  amount: number;
  description: string;
  category_id: number;
  date: string;
  payment_method_id?: number;
  is_recurring?: boolean;
  recurring_frequency?: string;
  tag_ids?: number[];
  notes?: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  category?: CategoryResponse;
  payment_method?: PaymentMethodResponse;
  tags?: TagResponse[];
}

export interface ExpenseUpdate {
  amount?: number;
  description?: string;
  category_id?: number;
  date?: string;
  payment_method_id?: number;
  is_recurring?: boolean;
  recurring_frequency?: string;
  tag_ids?: number[];
  notes?: string;
}

export interface IncomeCreate {
  amount: number;
  description: string;
  source: string;
  date: string;
  is_recurring?: boolean;
  recurring_frequency?: string;
  category_id?: number;
  tag_ids?: number[];
  notes?: string;
}

export interface IncomeResponse {
  amount: number;
  description: string;
  source: string;
  date: string;
  is_recurring?: boolean;
  recurring_frequency?: string;
  category_id?: number;
  tag_ids?: number[];
  notes?: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  category?: CategoryResponse;
  tags?: TagResponse[];
}

export interface IncomeUpdate {
  amount?: number;
  description?: string;
  source?: string;
  date?: string;
  is_recurring?: boolean;
  recurring_frequency?: string;
  category_id?: number;
  tag_ids?: number[];
  notes?: string;
}

export interface InvestmentCreate {
  name: string;
  symbol?: string;
  investment_type: string;
  amount_invested: number;
  current_value?: number;
  purchase_date: string;
  quantity?: number;
  purchase_price?: number;
  current_price?: number;
  broker_platform?: string;
  fees?: number;
  taxes?: number;
  dividends_earned?: number;
  is_active?: boolean;
  maturity_date?: string;
  risk_level?: string;
  sector?: string;
  notes?: string;
}

export interface InvestmentResponse {
  name: string;
  symbol?: string;
  investment_type: string;
  amount_invested: number;
  current_value?: number;
  purchase_date: string;
  quantity?: number;
  purchase_price?: number;
  current_price?: number;
  broker_platform?: string;
  fees?: number;
  taxes?: number;
  dividends_earned?: number;
  is_active?: boolean;
  maturity_date?: string;
  risk_level?: string;
  sector?: string;
  notes?: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface InvestmentUpdate {
  name?: string;
  symbol?: string;
  investment_type?: string;
  amount_invested?: number;
  current_value?: number;
  purchase_date?: string;
  quantity?: number;
  purchase_price?: number;
  current_price?: number;
  broker_platform?: string;
  fees?: number;
  taxes?: number;
  dividends_earned?: number;
  is_active?: boolean;
  maturity_date?: string;
  risk_level?: string;
  sector?: string;
  notes?: string;
}

export interface FinancialProductCreate {
  name: string;
  product_type: string;
  institution: string;
  account_number?: string;
  balance?: number;
  interest_rate?: number;
  minimum_balance?: number;
  monthly_fee?: number;
  credit_limit?: number;
  available_credit?: number;
  payment_due_date?: number;
  minimum_payment?: number;
  is_active?: boolean;
  opening_date?: string;
  maturity_date?: string;
  currency?: string;
  notes?: string;
}

export interface FinancialProductResponse {
  name: string;
  product_type: string;
  institution: string;
  account_number?: string;
  balance?: number;
  interest_rate?: number;
  minimum_balance?: number;
  monthly_fee?: number;
  credit_limit?: number;
  available_credit?: number;
  payment_due_date?: number;
  minimum_payment?: number;
  is_active?: boolean;
  opening_date?: string;
  maturity_date?: string;
  currency?: string;
  notes?: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialProductUpdate {
  name?: string;
  product_type?: string;
  institution?: string;
  account_number?: string;
  balance?: number;
  interest_rate?: number;
  minimum_balance?: number;
  monthly_fee?: number;
  credit_limit?: number;
  available_credit?: number;
  payment_due_date?: number;
  minimum_payment?: number;
  is_active?: boolean;
  opening_date?: string;
  maturity_date?: string;
  currency?: string;
  notes?: string;
}

export interface DebtCreate {
  name: string;
  debt_type: string;
  lender: string;
  original_amount: number;
  current_balance: number;
  interest_rate: number;
  minimum_payment: number;
  payment_due_date?: number;
  loan_start_date: string;
  expected_end_date?: string;
  is_paid_off?: boolean;
  paid_off_date?: string;
  currency?: string;
  collateral?: string;
  notes?: string;
}

export interface DebtResponse {
  name: string;
  debt_type: string;
  lender: string;
  original_amount: number;
  current_balance: number;
  interest_rate: number;
  minimum_payment: number;
  payment_due_date?: number;
  loan_start_date: string;
  expected_end_date?: string;
  is_paid_off?: boolean;
  paid_off_date?: string;
  currency?: string;
  collateral?: string;
  notes?: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface DebtUpdate {
  name?: string;
  debt_type?: string;
  lender?: string;
  original_amount?: number;
  current_balance?: number;
  interest_rate?: number;
  minimum_payment?: number;
  payment_due_date?: number;
  loan_start_date?: string;
  expected_end_date?: string;
  is_paid_off?: boolean;
  paid_off_date?: string;
  currency?: string;
  collateral?: string;
  notes?: string;
}

export interface BudgetCreate {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  currency?: string;
  is_active?: boolean;
  budget_items?: BudgetItemCreate[];
}

export interface BudgetItemCreate {
  category_id: number;
  budgeted_amount: number | string;
  notes?: string;
}

export interface BudgetItemResponse {
  category_id: number;
  budgeted_amount: string;
  notes?: string;
  id: number;
  budget_id: number;
  spent_amount: string;
  created_at: string;
  updated_at: string;
  category?: CategoryResponse;
}

export interface BudgetItemUpdate {
  budgeted_amount?: number | string;
  notes?: string;
}

export interface BudgetResponse {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  currency?: string;
  is_active?: boolean;
  id: number;
  user_id: number;
  total_budgeted: string;
  total_spent: string;
  created_at: string;
  updated_at: string;
  budget_items?: BudgetItemResponse[];
}

export interface BudgetUpdate {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  currency?: string;
  is_active?: boolean;
}

export interface BudgetComparison {
  budget_id: number;
  budget_name: string;
  category_id: number;
  category_name: string;
  budgeted_amount: string;
  spent_amount: string;
  remaining_amount: string;
  percentage_used: string;
  status: string;
}

export interface BudgetSummary {
  total_budgeted: string;
  total_spent: string;
  total_remaining: string;
  percentage_used: string;
  categories_under_budget: number;
  categories_on_budget: number;
  categories_over_budget: number;
  comparisons: BudgetComparison[];
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// Summary types (for endpoints that return objects)
export interface ExpensesSummaryByCategory {
  [key: string]: any; // Adjust based on actual response
}

export interface IncomesSummaryBySource {
  [key: string]: any;
}

export interface IncomesSummaryByCategory {
  [key: string]: any;
}

export interface InvestmentsSummaryByType {
  [key: string]: any;
}

export interface TotalInvestmentPerformance {
  [key: string]: any;
}

export interface FinancialProductsSummaryByType {
  [key: string]: any;
}

export interface TotalFinancialBalance {
  [key: string]: any;
}

export interface DebtsSummaryByType {
  [key: string]: any;
}

export interface TotalDebtBalance {
  [key: string]: any;
}