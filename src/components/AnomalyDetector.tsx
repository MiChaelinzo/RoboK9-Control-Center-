import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Heart, Activity, Shield, Clock, CheckCircle, X } from 'lucide-react';
import { HealthAnomaly, EmergencyContact } from '../types';

interface AnomalyDetectorProps {
  anomalies: HealthAnomaly[];
  emergencyContacts: EmergencyContact[];
  onResolveAnomaly: (anomalyId: string) => void;
  onContactEmergency: (contactId: string, anomalyId: string) => void;
  onDismissAnomaly: (anomalyId: string) => void;
}

const AnomalyDetector: React.FC<AnomalyDetectorProps> = ({
  anomalies,
  emergencyContacts,
  onResolveAnomaly,
  onContactEmergency,
  onDismissAnomaly
}) => {
  const [activeAnomalies, setActiveAnomalies] = useState<HealthAnomaly[]>([]);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState<string | null>(null);

  useEffect(() => {
    setActiveAnomalies(anomalies.filter(a => !a.resolved));
  }, [anomalies]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/20 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-500/20 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/20 text-yellow-400';
      case 'low': return 'border-blue-500 bg-blue-500/20 text-blue-400';
      default: return 'border-slate-500 bg-slate-500/20 text-slate-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="animate-pulse" size={20} />;
      case 'high': return <AlertTriangle size={20} />;
      case 'medium': return <Activity size={20} />;
      case 'low': return <Heart size={20} />;
      default: return <Shield size={20} />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const criticalAnomalies = activeAnomalies.filter(a => a.severity === 'critical');
  const highAnomalies = activeAnomalies.filter(a => a.severity === 'high');
  const otherAnomalies = activeAnomalies.filter(a => !['critical', 'high'].includes(a.severity));

  if (activeAnomalies.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-center space-x-2 text-green-400">
          <CheckCircle size={24} />
          <h3 className="text-lg font-semibold">All Systems Normal</h3>
        </div>
        <p className="text-slate-400 text-center mt-2">No health anomalies detected</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="text-red-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Health Anomaly Detection</h3>
        </div>
        <div className="text-sm text-slate-400">
          {activeAnomalies.length} active alert{activeAnomalies.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {/* Critical Anomalies */}
        {criticalAnomalies.map(anomaly => (
          <div key={anomaly.id} className={`p-4 rounded-lg border-2 ${getSeverityColor(anomaly.severity)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(anomaly.severity)}
                <div>
                  <div className="font-semibold text-white mb-1">
                    CRITICAL: {anomaly.description}
                  </div>
                  <div className="text-sm opacity-90 mb-2">
                    Value: {anomaly.value} (Normal: {anomaly.normalRange.min}-{anomaly.normalRange.max})
                  </div>
                  <div className="text-xs opacity-70">
                    Detected at {formatTime(anomaly.detectedAt)}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEmergencyDialog(anomaly.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  title="Contact Emergency Services"
                >
                  <Phone size={16} />
                </button>
                <button
                  onClick={() => onResolveAnomaly(anomaly.id)}
                  className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  title="Mark as Resolved"
                >
                  <CheckCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* High Priority Anomalies */}
        {highAnomalies.map(anomaly => (
          <div key={anomaly.id} className={`p-3 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(anomaly.severity)}
                <div>
                  <div className="font-medium text-white mb-1">
                    {anomaly.description}
                  </div>
                  <div className="text-sm opacity-90 mb-1">
                    Value: {anomaly.value} (Normal: {anomaly.normalRange.min}-{anomaly.normalRange.max})
                  </div>
                  <div className="text-xs opacity-70">
                    {formatTime(anomaly.detectedAt)}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEmergencyDialog(anomaly.id)}
                  className="p-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                  title="Contact Caregiver"
                >
                  <Phone size={14} />
                </button>
                <button
                  onClick={() => onResolveAnomaly(anomaly.id)}
                  className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  title="Resolve"
                >
                  <CheckCircle size={14} />
                </button>
                <button
                  onClick={() => onDismissAnomaly(anomaly.id)}
                  className="p-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-colors"
                  title="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Other Anomalies */}
        {otherAnomalies.map(anomaly => (
          <div key={anomaly.id} className={`p-3 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(anomaly.severity)}
                <div>
                  <div className="text-white font-medium">{anomaly.description}</div>
                  <div className="text-xs opacity-70">{formatTime(anomaly.detectedAt)}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onResolveAnomaly(anomaly.id)}
                  className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                >
                  <CheckCircle size={12} />
                </button>
                <button
                  onClick={() => onDismissAnomaly(anomaly.id)}
                  className="p-1 bg-slate-500/20 text-slate-400 rounded hover:bg-slate-500/30 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Contact Dialog */}
      {showEmergencyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
            <div className="space-y-3 mb-6">
              {emergencyContacts
                .sort((a, b) => a.priority - b.priority)
                .map(contact => (
                <button
                  key={contact.id}
                  onClick={() => {
                    onContactEmergency(contact.id, showEmergencyDialog);
                    setShowEmergencyDialog(null);
                  }}
                  className="w-full p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{contact.name}</div>
                      <div className="text-slate-400 text-sm capitalize">{contact.relationship}</div>
                    </div>
                    <div className="text-slate-300 text-sm">{contact.phone}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEmergencyDialog(null)}
                className="flex-1 p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Call 911/emergency services
                  window.open('tel:911', '_self');
                  setShowEmergencyDialog(null);
                }}
                className="flex-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Call 911
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomalyDetector;