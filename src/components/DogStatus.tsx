import React from 'react';
import { Battery, Wifi, MapPin, Activity, Camera, AlertTriangle } from 'lucide-react';
import { DogStatus as DogStatusType } from '../types';

interface DogStatusProps {
  status: DogStatusType;
}

const DogStatus: React.FC<DogStatusProps> = ({ status }) => {
  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Activity className="mr-2 text-cyan-400" size={20} />
        Dog Status
      </h3>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi size={16} className={status.online ? 'text-green-400' : 'text-red-400'} />
            <span className="text-slate-300 text-sm">Connection</span>
          </div>
          <span className={`text-sm font-medium ${status.online ? 'text-green-400' : 'text-red-400'}`}>
            {status.online ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Battery Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Battery size={16} className={getBatteryColor(status.battery)} />
            <span className="text-slate-300 text-sm">Battery</span>
          </div>
          <span className={`text-sm font-medium ${getBatteryColor(status.battery)}`}>
            {status.battery}%
          </span>
        </div>

        {/* Current Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-slate-300 text-sm">Action</span>
          </div>
          <span className="text-sm font-medium text-cyan-400">
            {status.currentAction}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-slate-300 text-sm">Location</span>
          </div>
          <span className="text-sm font-medium text-slate-300">
            {status.location}
          </span>
        </div>

        {/* Camera Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera size={16} className={status.cameraActive ? 'text-green-400' : 'text-slate-400'} />
            <span className="text-slate-300 text-sm">Camera</span>
          </div>
          <span className={`text-sm font-medium ${status.cameraActive ? 'text-green-400' : 'text-slate-400'}`}>
            {status.cameraActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Security Alert */}
        {status.intruderDetected && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} className="text-red-400 animate-pulse" />
              <span className="text-slate-300 text-sm">Security</span>
            </div>
            <span className="text-sm font-medium text-red-400 animate-pulse">
              ALERT
            </span>
          </div>
        )}
        {/* Status Indicator */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status.intruderDetected ? 'bg-red-400' : 
              status.online ? 'bg-green-400' : 'bg-red-400'
            } animate-pulse`} />
            <span className="text-slate-300 text-sm font-medium">
              {status.intruderDetected ? 'Security Alert Active' :
               status.online ? 'Ready for commands' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogStatus;