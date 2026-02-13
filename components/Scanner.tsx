
import React, { useRef, useEffect, useState } from 'react';

interface ScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
    };
  }, []);

  const handleSimulateScan = () => {
    // In a real production app, we would use a library like jsQR to parse frames.
    // For this demonstration, we simulate a successful scan of a PayNow QR.
    onScan("00020101021226480009SG.PAYNOW010120213201402246R030105204000053037025802SG5913MERCHANT NAME6009SINGAPORE62070103SG16304");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-square bg-slate-900 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
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
                <div className="absolute inset-0 animate-pulse bg-blue-400/10" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-lg" />
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mt-8 text-slate-300 text-center max-w-xs">
        Point your camera at a PayNow or PayLah! QR code to bridge your payment.
      </p>

      <div className="mt-12 flex gap-4">
        <button
          onClick={handleSimulateScan}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all active:scale-95"
        >
          Simulate Scan
        </button>
        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
        >
          Cancel
        </button>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scanner;
