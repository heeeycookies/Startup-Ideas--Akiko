
import React, { useState } from 'react';
import { AppView, PaymentMethod, MerchantDetails } from './types';
import { PAYMENT_METHODS, APP_THEME } from './constants';
import { analyzeMerchantQR, getTravelTip } from './services/geminiService';
import Scanner from './components/Scanner';
import GuestWarning from './components/GuestWarning';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('welcome');
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(PAYMENT_METHODS[0]);
  const [merchant, setMerchant] = useState<MerchantDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tip, setTip] = useState<string>("");
  const [balance, setBalance] = useState<number>(0.00);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const [baseAmount, setBaseAmount] = useState<number>(1);
  const rate = 0.74;

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ name: "Alex Traveler", email: `alex@${provider.toLowerCase()}.com` });
      setIsLoading(false);
      setView('home');
    }, 600);
  };

  const handleGuestEntry = () => {
    setShowGuestWarning(true);
  };

  const proceedAsGuest = () => {
    setShowGuestWarning(false);
    setView('home');
  };

  const handleScanSuccess = async (data: string) => {
    // Immediate transition to confirm view to feel snappier
    setView('payment-confirm');
    setIsLoading(true);
    
    // Default state while waiting for API
    setMerchant({
      name: "Detecting Merchant...",
      uen: "----",
      amount: 0.00,
      currency: "SGD",
      verified: false
    });

    const analysis = await analyzeMerchantQR(data);
    if (analysis) {
      setMerchant({
        name: analysis.name,
        uen: analysis.uen,
        amount: analysis.suggestedAmount || 10.00,
        currency: "SGD",
        verified: analysis.safetyScore > 80
      });
      // Fire and forget the tip to avoid blocking
      getTravelTip(analysis.category).then(setTip);
    } else {
      setMerchant({
        name: "Local Hawker Centre",
        uen: "T12345678G",
        amount: 10.00,
        currency: "SGD",
        verified: true
      });
    }
    setIsLoading(false);
  };

  const handleConfirmOrder = () => {
    if (balance >= (merchant?.amount || 0)) {
        handlePaymentSubmit();
    } else if (selectedMethod?.type === 'card') {
      setView('card-entry');
    } else {
      handlePaymentSubmit();
    }
  };

  const handlePaymentSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (balance >= (merchant?.amount || 0)) {
          setBalance(prev => prev - (merchant?.amount || 0));
      }
      setIsLoading(false);
      setView('success');
    }, 800);
  };

  const handleTopUp = (amt: number) => {
      setIsLoading(true);
      setTimeout(() => {
          setBalance(prev => prev + amt);
          setIsLoading(false);
          setView('home');
      }, 500);
  };

  const getLogoStyle = (id: string) => {
    if (id === 'apple' || id === 'uber') return { filter: 'brightness(0) invert(1)' };
    return {};
  };

  return (
    <div className={`min-h-screen ${APP_THEME.bg} text-slate-100 flex flex-col`}>
      <header className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-900/50">T</div>
          <span className="text-xl font-bold tracking-tight text-white">TouristPay</span>
        </div>
        {view !== 'welcome' && (
          <div className="px-3 py-1 bg-slate-900 rounded-full text-xs font-medium border border-slate-800 text-slate-400">
            {user ? user.name : 'Guest'}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full relative">
        {view === 'welcome' && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">Secure Payments for <span className="text-blue-500">Travelers</span></h1>
              <p className="text-slate-400 text-lg">Your global funds, bridged to local QR networks instantly.</p>
            </div>
            <div className="space-y-3 mb-10">
              <button onClick={() => handleSocialLogin('Google')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]">
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" className="w-5 h-5" alt="Google" /> Continue with Google
              </button>
              <button onClick={() => handleSocialLogin('Microsoft')} className="w-full bg-[#2f2f2f] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#3f3f3f] transition-all shadow-lg active:scale-[0.98]">
                <img src="https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg" className="w-5 h-5" alt="Microsoft" /> Continue with Microsoft
              </button>
              <button onClick={() => handleSocialLogin('Apple')} className="w-full bg-slate-100 text-slate-950 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all shadow-lg active:scale-[0.98]">
                <img src="https://www.vectorlogo.zone/logos/apple/apple-icon.svg" className="w-5 h-5" alt="Apple" /> Continue with Apple
              </button>
            </div>
            <div className="relative mb-10 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <span className="relative px-4 bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-widest">or</span>
            </div>
            <button onClick={handleGuestEntry} className="w-full bg-slate-900 border border-slate-800 text-slate-300 py-4 rounded-2xl font-bold transition-all hover:bg-slate-800">Explore as Guest</button>
            <div className="mt-12 flex justify-center items-center gap-6 opacity-40">
              <img src={PAYMENT_METHODS[0].icon} className="h-4 w-auto" alt="Visa" />
              <img src={PAYMENT_METHODS[1].icon} className="h-4 w-auto" alt="MC" />
              <img src={PAYMENT_METHODS[2].icon} style={getLogoStyle('apple')} className="h-5 w-auto" alt="Apple" />
            </div>
          </div>
        )}

        {view === 'home' && (
          <div className="flex-1 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 flex justify-between items-center shadow-lg">
              <div>
                <h2 className="text-slate-400 font-medium mb-1 uppercase text-[10px] tracking-widest">Digital Wallet Balance</h2>
                <div className="text-3xl font-black text-white">${balance.toFixed(2)} <span className="text-sm font-normal text-slate-500">SGD</span></div>
              </div>
              <button onClick={() => setView('top-up')} className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all active:scale-95">+ Top Up</button>
            </div>
            <button onClick={() => setView('scan')} className="group relative flex flex-col items-center justify-center bg-blue-600 aspect-square rounded-[2.5rem] shadow-2xl shadow-blue-900/40 mb-12 overflow-hidden active:scale-95 transition-all w-full max-w-[280px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent opacity-50"></div>
              <div className="relative z-10 w-24 h-24 border-2 border-white/20 rounded-2xl mb-4 flex items-center justify-center">
                <div className="w-16 h-1 bg-white/40 absolute top-1/2 -mt-0.5 w-full animate-pulse"></div>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h2v2H7zM15 7h2v2h-2zM7 15h2v2H7z" /></svg>
              </div>
              <span className="relative z-10 text-xl font-bold text-white tracking-widest uppercase">Scan QR</span>
            </button>
            <h3 className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-widest px-2">Global Sources</h3>
            <div className="grid grid-cols-2 gap-4">
              {PAYMENT_METHODS.map(method => (
                <button key={method.id} onClick={() => setSelectedMethod(method)} className={`p-4 h-24 rounded-2xl border transition-all flex flex-col justify-center items-center gap-2 ${selectedMethod?.id === method.id ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'}`}>
                  <div className="h-10 w-full flex items-center justify-center"><img src={method.icon} style={getLogoStyle(method.id)} className="max-h-full max-w-[90%] object-contain" alt={method.name} /></div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{method.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'top-up' && (
            <div className="flex-1 animate-in fade-in duration-500">
                <h2 className="text-2xl font-black mb-6">Top Up Wallet</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">
                    <label className="block text-slate-500 text-xs font-bold uppercase mb-4">Amount to Add (SGD)</label>
                    <div className="grid grid-cols-3 gap-3 mb-8">{[10, 20, 50, 100, 200, 500].map(amt => (
                        <button key={amt} onClick={() => handleTopUp(amt)} className="p-4 bg-slate-800 border border-slate-700 rounded-xl font-bold hover:bg-blue-600 hover:border-blue-500 transition-all text-sm">+${amt}</button>
                    ))}</div>
                </div>
                <button onClick={() => setView('home')} className="w-full text-slate-500 font-bold">Back to Dashboard</button>
            </div>
        )}

        {view === 'rates' && (
          <div className="flex-1 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-6">Exchange Rates</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6">
              <div className="mb-6">
                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">You Give (SGD)</label>
                <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700"><input type="number" value={baseAmount} onChange={(e) => setBaseAmount(Number(e.target.value))} className="bg-transparent text-2xl font-bold w-full outline-none text-blue-400" /><span className="font-bold">SGD</span></div>
              </div>
              <div className="flex items-center justify-center my-2"><div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div>
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">You Get (Estimated USD)</label>
                <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700"><div className="text-2xl font-bold w-full">{(baseAmount * rate).toFixed(2)}</div><span className="font-bold">USD</span></div>
              </div>
            </div>
          </div>
        )}

        {view === 'scan' && <Scanner onScan={handleScanSuccess} onClose={() => setView('home')} />}

        {view === 'payment-confirm' && merchant && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6 relative shadow-2xl">
              <h2 className="text-slate-400 text-xs font-bold uppercase mb-1">Paying To</h2>
              <div className="text-2xl font-black text-white mb-6">
                {merchant.name === "Detecting Merchant..." ? <div className="animate-pulse bg-slate-800 h-8 w-48 rounded"></div> : merchant.name}
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 mb-6 flex justify-between items-center">
                <div className="text-sm font-bold text-slate-400">Total</div>
                <div className="text-2xl font-black text-blue-400">
                  {merchant.name === "Detecting Merchant..." ? "---" : `$${merchant.amount?.toFixed(2)}`} <span className="text-xs font-normal text-slate-500">SGD</span>
                </div>
              </div>
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 mb-2">
                <p className="text-[10px] text-blue-400 leading-relaxed font-bold italic text-center">
                  "Bridge active: Converting {selectedMethod?.name} funds to PayNow Network."
                </p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex justify-between items-center">
              <div className="flex items-center gap-3"><img src={selectedMethod?.icon} style={getLogoStyle(selectedMethod?.id || '')} className="h-6 w-auto object-contain" alt={selectedMethod?.name} /><span className="font-bold">{selectedMethod?.name}</span></div>
              <button className="text-blue-500 text-xs font-bold hover:text-blue-400 transition-colors" onClick={() => setIsMethodModalOpen(true)}>Change</button>
            </div>
            <button disabled={isLoading} onClick={handleConfirmOrder} className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${isLoading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white shadow-blue-900/40 active:scale-95'}`}>
              {balance >= (merchant?.amount || 0) ? 'Pay with Balance' : 'Confirm & Continue'}
            </button>
          </div>
        )}

        {view === 'card-entry' && (
          <div className="flex-1 animate-in slide-in-from-right-10 duration-500">
            <h2 className="text-2xl font-black mb-6">Payment Details</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">
              <div className="mb-6 h-12 flex items-center justify-center"><img src={selectedMethod?.icon} style={getLogoStyle(selectedMethod?.id || '')} className="h-full object-contain" alt="Card Logo" /></div>
              <div className="space-y-4">
                <div><label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">Card Number</label><input type="text" placeholder="**** **** **** 4242" className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500 transition-colors font-mono" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">Expiry Date</label><input type="text" placeholder="MM / YY" className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500 font-mono" /></div>
                  <div><label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">CVV</label><input type="text" placeholder="***" className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500 font-mono" /></div>
                </div>
              </div>
            </div>
            <button onClick={handlePaymentSubmit} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-900/40 active:scale-95 transition-all">Pay ${merchant?.amount?.toFixed(2)} SGD</button>
          </div>
        )}

        {view === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-900/20"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
            <h1 className="text-3xl font-black mb-2 text-white">Bridge Successful!</h1>
            <p className="text-slate-400 mb-8 max-w-xs leading-relaxed">Paid <strong>${merchant?.amount?.toFixed(2)} SGD</strong> to {merchant?.name}.</p>
            <button onClick={() => setView('home')} className="w-full bg-slate-900 border border-slate-800 text-white py-4 rounded-2xl font-bold transition-all">Back to Dashboard</button>
          </div>
        )}
      </main>

      {view !== 'welcome' && view !== 'scan' && (
        <nav className="bg-slate-950 border-t border-slate-900 p-6 flex justify-around sticky bottom-0 z-20">
          <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' || view === 'top-up' ? 'text-blue-500' : 'text-slate-500'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[9px] font-black uppercase">Home</span></button>
          <button onClick={() => setView('scan')} className="flex flex-col items-center gap-1 text-slate-500"><div className="w-12 h-12 bg-blue-600 rounded-2xl -mt-10 shadow-lg shadow-blue-900/50 flex items-center justify-center text-white active:scale-90 transition-all border-4 border-slate-950"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h2v2H7zM15 7h2v2h-2zM7 15h2v2H7z" /></svg></div><span className="text-[9px] font-black uppercase">Scan</span></button>
          <button onClick={() => setView('rates')} className={`flex flex-col items-center gap-1 ${view === 'rates' ? 'text-blue-500' : 'text-slate-500'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[9px] font-black uppercase">Rates</span></button>
        </nav>
      )}

      {isMethodModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-slate-900 border-t border-slate-800 w-full max-w-lg rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-8"></div>
            <h3 className="text-xl font-bold mb-6 text-white text-center">Switch Payment Method</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {PAYMENT_METHODS.map(method => (
                <button key={method.id} onClick={() => { setSelectedMethod(method); setIsMethodModalOpen(false); }} className={`p-4 h-24 rounded-2xl border transition-all flex flex-col justify-center items-center gap-2 ${selectedMethod?.id === method.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'}`}>
                  <div className="h-10 w-full flex items-center justify-center"><img src={method.icon} style={getLogoStyle(method.id)} className="max-h-full max-w-[90%] object-contain" alt={method.name} /></div>
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{method.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setIsMethodModalOpen(false)} className="w-full bg-slate-800 text-slate-400 py-4 rounded-2xl font-bold hover:text-white transition-all">Cancel</button>
          </div>
        </div>
      )}

      {showGuestWarning && <GuestWarning onContinue={proceedAsGuest} />}
      
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-[0_0_30px_rgba(59,130,246,0.5)]">T</div>
             <div className="text-blue-500 font-bold tracking-widest uppercase text-xs">Bridge active...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
