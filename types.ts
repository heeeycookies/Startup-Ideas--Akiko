
export type AppView = 'welcome' | 'home' | 'scan' | 'payment-confirm' | 'card-entry' | 'success' | 'rates' | 'top-up';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'wallet' | 'bank';
  category: string;
}

export interface MerchantDetails {
  name: string;
  uen: string;
  amount?: number;
  currency: string;
  verified: boolean;
}

export interface UserState {
  isGuest: boolean;
  selectedMethod?: PaymentMethod;
  balance: number;
}
