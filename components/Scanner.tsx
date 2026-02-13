
import React, { useRef, useEffect, useState } from 'react';

interface ScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let detectionTimer: any;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsDetecting(true);
          
          // Automatic Scanning Logic:
          // In this simulated environment, we automatically "detect" the code
          // after the camera has been open for 2.5 seconds.
          detectionTimer = setTimeout(() => {
            handleAutoScan();
          }, 2500);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera permission denied or not found.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (detectionTimer) clearTimeout(detectionTimer);
    };
  }, []);

  const handleAutoScan = () => {
    // Simulated QR content for PayNow/PayLah bridge
    const mockQRData = "00020101021226480009SG.PAYNOW010120213201402246R030105204000053037025802SG5913MERCHANT NAME6009SINGAPORE62070103SG16304";
    onScan(mockQRData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-square bg-slate-900 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-center p-8 text-slate-400">
            {error}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Grid */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-blue-400 rounded-xl relative">
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_2s_ease-in-out_infinite] z-20" />
                
                <div className="absolute inset-0 animate-pulse bg-blue-400/5" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-lg" />
              </div>
            </div>
            
            {isDetecting && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600/20 backdrop-blur-md rounded-full border border-blue-500/30">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">Scanning QR...</span>
              </div>
            )}
          </>
        )}
      </div>

      <p className="mt-8 text-slate-300 text-center max-w-xs text-sm font-medium">
        Scan will begin automatically once a QR is detected within the frame.
      </p>

      <div className="mt-12">
        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-slate-700"
        >
          Cancel
        </button>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
