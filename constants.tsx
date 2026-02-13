
import { PaymentMethod } from './types';

export const PAYMENT_METHODS: PaymentMethod[] = [
  { 
    id: 'visa', 
    name: 'Visa', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg', 
    type: 'card', 
    category: 'Credit/Debit' 
  },
  { 
    id: 'mc', 
    name: 'Mastercard', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', 
    type: 'card', 
    category: 'Credit/Debit' 
  },
  { 
    id: 'apple', 
    name: 'Apple Pay', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg', 
    type: 'wallet', 
    category: 'Wallets' 
  },
  { 
    id: 'google', 
    name: 'Google Pay', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg', 
    type: 'wallet', 
    category: 'Wallets' 
  },
  { 
    id: 'grab', 
    name: 'GrabPay', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/GrabPay_logo.svg', 
    type: 'wallet', 
    category: 'Regional' 
  },
  { 
    id: 'uber', 
    name: 'Uber Wallet', 
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg', 
    type: 'wallet', 
    category: 'Regional' 
  },
];

export const APP_THEME = {
  bg: 'bg-slate-950',
  card: 'bg-slate-900/80 border-slate-800',
  accent: 'blue-500',
  text: 'text-slate-200',
  header: 'text-white font-bold',
};
