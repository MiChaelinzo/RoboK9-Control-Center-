import React, { useState, useEffect } from 'react';
import { Shield, Camera, AlertTriangle, Clock, MapPin, Eye, Lock, Unlock } from 'lucide-react';
import { SecurityEvent } from '../types';

interface SecurityCenterProps {
  onSecurityEvent?: (event: SecurityEvent) => void;
}

const SecurityCenter: React.FC<SecurityCenterProps> = ({ onSecurityEvent }) => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityMode, setSecurityMode] = useState<'disarmed' | 'home' | 'away'>('home');
  const [isArmed, setIsArmed] = useState(true);

  useEffect(() => {
    // Simulate security events
    const interval = setInterval(() => {
      if (isArmed && Math.random() < 0.1) { // 10% chance every 30 seconds
        const eventTypes = ['motion_detected', 'perimeter_breach', 'camera_offline'];
        const locations = ['Front Door', 'Backyard', 'Living Room', 'Kitchen', 'Garage'];
        
        const newEvent: SecurityEvent = {
          id: `event_${Date.now()}`,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)] as any,
          severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
          timestamp: new Date(),
          location: locations[Math.floor(Math.random() * locations.length)],
          description: 'Motion detected in monitored area',
          resolved: false,
          responseTime: Math.floor(Math.random() * 5) + 1
        };

        setSecurityEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
        
        if (onSecurityEvent) {
          onSecurityEvent(newEvent);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isArmed, onSecurityEvent]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/50';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'motion_detected': return <Eye size={16} />;
      case 'intruder_alert': return <AlertTriangle size={16} />;
      case 'perimeter_breach': return <Shield size={16} />;
      case 'camera_offline': return <Camera size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const resolveEvent = (eventId: string) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, resolved: true } : event
    ));
  };

  const unresolvedEvents = securityEvents.filter(event => !event.resolved);
  const criticalEvents = unresolvedEvents.filter(event => event.severity === 'critical');

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Security Center</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isArmed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isArmed ? 'ARMED' : 'DISARMED'}
          </div>
          
          <button
            onClick={() => setIsArmed(!isArmed)}
            className={`p-2 rounded-lg transition-colors ${
              isArmed 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isArmed ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>
      </div>

      {/* Security Mode Selection */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { mode: 'disarmed', label: 'Disarmed', color: 'bg-slate-600' },
          { mode: 'home', label: 'Home', color: 'bg-blue-500' },
          { mode: 'away', label: 'Away', color: 'bg-red-500' }
        ].map(({ mode, label, color }) => (
          <button
            key={mode}
            onClick={() => setSecurityMode(mode as any)}
            className={`p-2 rounded-lg text-white text-sm font-medium transition-colors ${
              securityMode === mode ? color : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Critical Alerts */}
      {criticalEvents.length > 0 && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="text-red-400 animate-pulse" size={16} />
            <span className="text-red-400 font-semibold">Critical Security Alerts</span>
          </div>
          {criticalEvents.map(event => (
            <div key={event.id} className="text-red-300 text-sm">
              {event.description} - {event.location}
            </div>
          ))}
        </div>
      )}

      {/* Recent Events */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Recent Events</h4>
        
        {securityEvents.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {securityEvents.map(event => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${getSeverityColor(event.severity)} ${
                  event.resolved ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getEventIcon(event.type)}
                    <div>
                      <div className="font-medium text-white text-sm">
                        {event.description}
                      </div>
                      <div className="flex items-center space-x-4 text-xs opacity-70 mt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{event.timestamp.toLocaleTimeString()}</span>
                        </div>
                        {event.responseTime && (
                          <span>Response: {event.responseTime}s</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!event.resolved && (
                    <button
                      onClick={() => resolveEvent(event.id)}
                      className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                      title="Mark as Resolved"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="mx-auto mb-2 text-green-400" size={32} />
            <p className="text-slate-400">All secure - no recent events</p>
          </div>
        )}
      </div>

      {/* Security Stats */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-400">
              {securityEvents.filter(e => e.resolved).length}
            </div>
            <div className="text-xs text-slate-400">Resolved</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-400">
              {unresolvedEvents.length}
            </div>
            <div className="text-xs text-slate-400">Active</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-400">
              {securityEvents.length}
            </div>
            <div className="text-xs text-slate-400">Total Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;