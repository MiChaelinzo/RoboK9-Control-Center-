import React from 'react';
import { Battery, Wifi, MapPin, Activity, Camera, AlertTriangle, Heart, Brain } from 'lucide-react';
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

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'excited':
        return 'text-yellow-400';
      case 'calm':
      case 'sleepy':
        return 'text-blue-400';
      case 'alert':
      case 'protective':
        return 'text-red-400';
      case 'playful':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return '😊';
      case 'excited':
        return '🤩';
      case 'calm':
        return '😌';
      case 'alert':
        return '👀';
      case 'sleepy':
        return '😴';
      case 'playful':
        return '🐕';
      case 'protective':
        return '🛡️';
      default:
        return '🤖';
    }
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
            {status.cameraActive ? (status.nightVisionMode ? 'IR Mode' : 'Active') : 'Inactive'}
          </span>
        </div>
        
        {/* Emotional State */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart size={16} className={getEmotionColor(status.emotion)} />
            <span className="text-slate-300 text-sm">Emotion</span>
          </div>
          <span className={`text-sm font-medium ${getEmotionColor(status.emotion)} flex items-center space-x-1`}>
            <span>{getEmotionEmoji(status.emotion)}</span>
            <span className="capitalize">{status.emotion}</span>
          </span>
        </div>
        
        {/* Learning Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain size={16} className={status.learningMode ? 'text-purple-400' : 'text-slate-400'} />
            <span className="text-slate-300 text-sm">Learning</span>
          </div>
          <span className={`text-sm font-medium ${status.learningMode ? 'text-purple-400' : 'text-slate-400'}`}>
            {status.learningMode ? 'Active' : 'Standby'}
          </span>
        </div>
        
        {/* Skills Learned */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-slate-300 text-sm">Skills</span>
          </div>
          <span className="text-sm font-medium text-purple-400">
            {status.skillsLearned.length}
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