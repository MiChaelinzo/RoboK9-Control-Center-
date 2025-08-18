import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplets, Moon, Zap, Watch, Pill, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { HealthData, Medication, HealthReminder } from '../types';

interface HealthMonitorProps {
  healthData: HealthData;
  medications: Medication[];
  reminders: HealthReminder[];
  onMedicationTaken: (medicationId: string) => void;
  onReminderCompleted: (reminderId: string) => void;
  onSyncHealthData: () => void;
}

const HealthMonitor: React.FC<HealthMonitorProps> = ({
  healthData,
  medications,
  reminders,
  onMedicationTaken,
  onReminderCompleted,
  onSyncHealthData
}) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'medications' | 'reminders'>('vitals');

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { status: 'low', color: 'text-blue-400' };
    if (hr > 100) return { status: 'high', color: 'text-red-400' };
    return { status: 'normal', color: 'text-green-400' };
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-500/10';
      case 'medium': return 'border-yellow-400 bg-yellow-500/10';
      case 'low': return 'border-green-400 bg-green-500/10';
      default: return 'border-slate-400 bg-slate-500/10';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'text-red-400';
      case 'important': return 'text-yellow-400';
      case 'routine': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const overdueMedications = medications.filter(med => 
    !med.taken && new Date() > med.nextDose
  );

  const upcomingReminders = reminders.filter(reminder => 
    !reminder.completed && new Date() < reminder.scheduledTime
  ).slice(0, 3);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Heart className="text-red-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Health Monitor</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-xs ${
            healthData.deviceConnected ? 'text-green-400' : 'text-red-400'
          }`}>
            <Watch size={12} />
            <span>{healthData.deviceConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <button
            onClick={onSyncHealthData}
            className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            title="Sync Health Data"
          >
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'vitals', label: 'Vitals', icon: Activity },
          { id: 'medications', label: 'Meds', icon: Pill },
          { id: 'reminders', label: 'Reminders', icon: AlertCircle }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
              activeTab === id
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div className="space-y-4">
          {/* Heart Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart size={16} className={getHeartRateStatus(healthData.heartRate).color} />
              <span className="text-slate-300 text-sm">Heart Rate</span>
            </div>
            <span className={`text-sm font-medium ${getHeartRateStatus(healthData.heartRate).color}`}>
              {healthData.heartRate} BPM
            </span>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity size={16} className="text-blue-400" />
              <span className="text-slate-300 text-sm">Steps Today</span>
            </div>
            <span className="text-sm font-medium text-blue-400">
              {healthData.steps.toLocaleString()}
            </span>
          </div>

          {/* Blood Pressure */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap size={16} className="text-purple-400" />
              <span className="text-slate-300 text-sm">Blood Pressure</span>
            </div>
            <span className="text-sm font-medium text-purple-400">
              {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
            </span>
          </div>

          {/* Blood Oxygen */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets size={16} className="text-cyan-400" />
              <span className="text-slate-300 text-sm">Blood Oxygen</span>
            </div>
            <span className="text-sm font-medium text-cyan-400">
              {healthData.bloodOxygen}%
            </span>
          </div>

          {/* Sleep */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon size={16} className="text-indigo-400" />
              <span className="text-slate-300 text-sm">Sleep Last Night</span>
            </div>
            <span className="text-sm font-medium text-indigo-400">
              {healthData.sleepHours}h
            </span>
          </div>

          {/* Stress Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-red-400" />
              <span className="text-slate-300 text-sm">Stress Level</span>
            </div>
            <span className={`text-sm font-medium capitalize ${getStressColor(healthData.stressLevel)}`}>
              {healthData.stressLevel}
            </span>
          </div>

          {/* Last Sync */}
          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
              <Watch size={12} />
              <span>Last sync: {healthData.lastSync.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div className="space-y-3">
          {overdueMedications.length > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-400 mb-2">
                <AlertCircle size={16} />
                <span className="font-semibold">Overdue Medications</span>
              </div>
              {overdueMedications.map(med => (
                <div key={med.id} className="text-red-300 text-sm">
                  {med.name} - {med.dosage}
                </div>
              ))}
            </div>
          )}

          {medications.map(medication => (
            <div
              key={medication.id}
              className={`p-3 rounded-lg border ${
                medication.taken 
                  ? 'border-green-500/30 bg-green-500/10' 
                  : new Date() > medication.nextDose
                  ? 'border-red-500/30 bg-red-500/10'
                  : 'border-slate-600 bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Pill size={16} className={getImportanceColor(medication.importance)} />
                    <span className="text-white font-medium">{medication.name}</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {medication.dosage} • {medication.frequency}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Next: {formatTime(medication.nextDose)}
                  </div>
                </div>
                
                <button
                  onClick={() => onMedicationTaken(medication.id)}
                  disabled={medication.taken}
                  className={`p-2 rounded-lg transition-colors ${
                    medication.taken
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                  }`}
                >
                  {medication.taken ? <CheckCircle size={16} /> : <Pill size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="space-y-3">
          {upcomingReminders.map(reminder => (
            <div
              key={reminder.id}
              className={`p-3 rounded-lg border ${getPriorityColor(reminder.priority)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} className="text-cyan-400" />
                    <span className="text-white font-medium">{reminder.title}</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {reminder.message}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {formatTime(reminder.scheduledTime)}
                  </div>
                </div>
                
                <button
                  onClick={() => onReminderCompleted(reminder.id)}
                  className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  <CheckCircle size={16} />
                </button>
              </div>
            </div>
          ))}

          {upcomingReminders.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto mb-2 text-green-400" size={32} />
              <p className="text-slate-400">All reminders completed!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthMonitor;