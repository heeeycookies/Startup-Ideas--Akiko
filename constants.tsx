import { PaymentMethod } from './types';

export const PAYMENT_METHODS: PaymentMethod[] = [
  { 
    id: 'visa', 
    name: 'Visa', 
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/visa.svg', 
    type: 'card', 
    category: 'Credit/Debit' 
  },
  { 
    id: 'mc', 
    name: 'Mastercard', 
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mastercard.svg', 
    type: 'card', 
    category: 'Credit/Debit' 
  },
  { 
    id: 'apple', 
    name: 'Apple Pay', 
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/applepay.svg', 
    type: 'wallet', 
    category: 'Wallets' 
  },
  { 
    id: 'google', 
    name: 'Google Pay', 
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlepay.svg', 
    type: 'wallet', 
    category: 'Wallets' 
  },
  { 
    id: 'grab', 
    name: 'Grab', 
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/grab.svg', 
    type: 'wallet', 
    category: 'Regional' 
  },
  { 
    id: 'uber', 
    name: 'Uber', 
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/uber.svg', 
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