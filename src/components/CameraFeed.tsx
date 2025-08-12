import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, AlertTriangle, Eye, Maximize2 } from 'lucide-react';

interface CameraFeedProps {
  isActive: boolean;
  onToggle: () => void;
  intruderDetected: boolean;
  onIntruderAlert: (detected: boolean) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ 
  isActive, 
  onToggle, 
  intruderDetected, 
  onIntruderAlert 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate intruder detection
  useEffect(() => {
    if (!isActive || !detectionEnabled) return;

    const interval = setInterval(() => {
      // Simulate random intruder detection (5% chance every 10 seconds)
      if (Math.random() < 0.05) {
        onIntruderAlert(true);
        setTimeout(() => onIntruderAlert(false), 5000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isActive, detectionEnabled, onIntruderAlert]);

  // Simulate camera feed with animated overlay
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid overlay
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Draw scanning line
      const scanY = (Math.sin(time) * 0.5 + 0.5) * canvas.height;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();
      
      // Draw detection zones
      if (detectionEnabled) {
        ctx.strokeStyle = intruderDetected ? '#ef4444' : '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        // Draw corner markers
        const cornerSize = 20;
        const corners = [
          [50, 50], [canvas.width - 50, 50],
          [50, canvas.height - 50], [canvas.width - 50, canvas.height - 50]
        ];
        
        corners.forEach(([x, y]) => {
          ctx.strokeRect(x - cornerSize/2, y - cornerSize/2, cornerSize, cornerSize);
        });
      }
      
      // Draw timestamp
      ctx.fillStyle = '#06b6d4';
      ctx.font = '12px monospace';
      ctx.fillText(new Date().toLocaleTimeString(), 10, 20);
      
      // Draw status indicators
      ctx.fillStyle = isActive ? '#10b981' : '#ef4444';
      ctx.fillText(`● REC ${isActive ? 'ON' : 'OFF'}`, 10, canvas.height - 10);
      
      if (intruderDetected) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('⚠ INTRUDER DETECTED', canvas.width / 2 - 80, 40);
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, intruderDetected, detectionEnabled]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Camera className="text-cyan-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Live Camera Feed</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDetectionEnabled(!detectionEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              detectionEnabled 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
            title="Toggle Detection"
          >
            <Eye size={16} />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
          
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
            }`}
          >
            {isActive ? <CameraOff size={16} /> : <Camera size={16} />}
          </button>
        </div>
      </div>

      <div className={`relative ${isFullscreen ? 'fixed inset-4 z-50 bg-slate-900 rounded-xl p-4' : ''}`}>
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700"
          >
            ✕
          </button>
        )}
        
        <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-full object-cover"
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90">
              <div className="text-center">
                <CameraOff className="mx-auto mb-2 text-slate-500" size={32} />
                <p className="text-slate-400">Camera Feed Disabled</p>
              </div>
            </div>
          )}
          
          {intruderDetected && (
            <div className="absolute top-2 left-2 flex items-center space-x-2 bg-red-500/90 text-white px-3 py-1 rounded-lg animate-pulse">
              <AlertTriangle size={16} />
              <span className="font-semibold">INTRUDER ALERT</span>
            </div>
          )}
          
          {isActive && (
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-mono">LIVE</span>
            </div>
          )}
        </div>
      </div>
      
      {intruderDetected && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle size={16} />
            <span className="font-semibold">Security Alert</span>
          </div>
          <p className="text-red-300 text-sm mt-1">
            Motion detected in restricted area. Initiating security protocol.
          </p>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;