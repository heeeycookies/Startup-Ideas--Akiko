
import React, { useRef, useEffect, useState } from 'react';

interface ScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<{message: string, type: 'permission' | 'hardware' | 'unknown'} | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const startCamera = async () => {
    setError(null);
    setIsDetecting(false);
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
        
        // Simulated successful scan for demo after 3 seconds
        const scanTimeout = setTimeout(() => {
          handleAutoScan();
        }, 3000);

        return () => clearTimeout(scanTimeout);
      }
    } catch (err: any) {
      console.error("Scanner Error:", err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError({
          message: "Camera access was denied. Please click the camera icon in your browser's address bar to reset permissions, then try again.",
          type: 'permission'
        });
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError({
          message: "No camera detected. Please ensure your device has a functional camera connected.",
          type: 'hardware'
        });
      } else {
        setError({
          message: "An unexpected error occurred while starting the camera: " + err.message,
          type: 'unknown'
        });
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [retryCount]);

  const handleAutoScan = () => {
    // Simulated PayNow standard QR string
    const mockQRData = "00020101021226480009SG.PAYNOW010120213201402246R030105204000053037025802SG5913MERCHANT NAME6009SINGAPORE62070103SG16304";
    onScan(mockQRData);
  };

  const handleManualEntry = () => {
    // Directly trigger simulated success for users without cameras
    handleAutoScan();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
      <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-900/80 backdrop-blur-md">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-500/5">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-3">
              {error.type === 'permission' ? 'Permission Needed' : 'Camera Not Ready'}
            </h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              {error.message}
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setRetryCount(prev => prev + 1)}
                className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                Try Re-connecting
              </button>
              <button
                onClick={handleManualEntry}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold transition-all border border-slate-700"
              >
                Use Manual Entry
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* High-tech Scanning UI Overlay */}
            <div className="absolute inset-0 border-[48px] border-slate-950/60 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full border border-blue-500/30 rounded-3xl relative">
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_2.5s_ease-in-out_infinite] z-20" />
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-xl" />
                
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
              </div>
            </div>
            
            {isDetecting && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-blue-600/20 backdrop-blur-xl rounded-full border border-blue-500/30 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                  <span className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em]">Scanning Network...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-12 w-full max-w-sm flex flex-col gap-4">
        {!error && (
           <button
            onClick={handleManualEntry}
            className="w-full bg-slate-900 border border-slate-800 text-slate-400 py-4 rounded-2xl font-bold hover:text-white transition-all"
          >
            Can't scan? Enter code
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full text-slate-500 font-bold py-2 hover:text-slate-300 transition-colors"
        >
          Cancel and Go Back
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
