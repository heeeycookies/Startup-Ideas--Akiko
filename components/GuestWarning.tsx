
import React from 'react';

interface GuestWarningProps {
  onContinue: () => void;
}

const GuestWarning: React.FC<GuestWarningProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-center mb-4 text-white">Continuing as Guest</h3>
        <p className="text-slate-400 text-center mb-8 leading-relaxed">
          You're opting for a faster checkout! <br/>
          <span className="text-blue-400 font-medium">Please note:</span> Guest users are not eligible for local cashback and merchant promotions.
        </p>
        <button
          onClick={onContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          Got it, Continue
        </button>
      </div>
    </div>
  );
};

export default GuestWarning;
