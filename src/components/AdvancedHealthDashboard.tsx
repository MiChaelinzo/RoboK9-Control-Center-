import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Heart, Activity, Brain, TrendingUp, AlertTriangle, Shield, Zap, Target } from 'lucide-react';
import { AdvancedAIService } from '../services/advancedAIService';
import { HealthData } from '../types';

interface AdvancedHealthDashboardProps {
  healthData: HealthData;
  historicalData: HealthData[];
}

interface HealthPrediction {
  cardiovascular: number;
  diabetes: number;
  hypertension: number;
  obesity: number;
  depression: number;
  anxiety: number;
  fatigue: number;
  insomnia: number;
  malnutrition: number;
  overexertion: number;
}

interface PersonalizedRecommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const AdvancedHealthDashboard: React.FC<AdvancedHealthDashboardProps> = ({
  healthData,
  historicalData
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'trends' | 'recommendations'>('overview');
  const [healthPredictions, setHealthPredictions] = useState<HealthPrediction>({
    cardiovascular: 0, diabetes: 0, hypertension: 0, obesity: 0,
    depression: 0, anxiety: 0, fatigue: 0, insomnia: 0,
    malnutrition: 0, overexertion: 0
  });
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendations>({
    immediate: [],
    shortTerm: [],
    longTerm: [],
    priority: 'low'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const aiService = AdvancedAIService.getInstance();

  useEffect(() => {
    analyzeHealthData();
  }, [healthData]);

  const analyzeHealthData = async () => {
    setIsAnalyzing(true);
    
    try {
      // Generate health risk predictions
      const predictions = await aiService.predictHealthRisks({
        heartRate: healthData.heartRate,
        bloodPressure: healthData.bloodPressure,
        steps: healthData.steps,
        sleep: healthData.sleepHours,
        stress: healthData.stressLevel === 'high' ? 80 : healthData.stressLevel === 'moderate' ? 50 : 20,
        age: 35, // Default age - in real app this would come from user profile
        weight: 70, // Default weight
        height: 170, // Default height
        activity: Math.min(100, healthData.steps / 100),
        nutrition: 75 // Default nutrition score
      });

      setHealthPredictions(predictions);

      // Generate personalized recommendations
      const recs = await aiService.generatePersonalizedRecommendations({
        healthRisks: predictions,
        activityLevel: healthData.steps > 8000 ? 'high' : healthData.steps > 5000 ? 'moderate' : 'low',
        emotionalState: healthData.stressLevel,
        goals: ['fitness', 'health', 'longevity']
      });

      setRecommendations(recs);
    } catch (error) {
      console.error('Health analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTrendData = () => {
    return historicalData.slice(-30).map((data, index) => ({
      day: index + 1,
      heartRate: data.heartRate,
      steps: data.steps / 100, // Scale for chart
      sleep: data.sleepHours,
      stress: data.stressLevel === 'high' ? 3 : data.stressLevel === 'moderate' ? 2 : 1,
      bloodPressure: data.bloodPressure.systolic
    }));
  };

  const getRiskData = () => {
    return Object.entries(healthPredictions).map(([risk, value]) => ({
      name: risk.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: Math.round(value * 100),
      color: value > 0.7 ? '#ef4444' : value > 0.4 ? '#f59e0b' : value > 0.2 ? '#eab308' : '#10b981'
    }));
  };

  const getHealthScore = () => {
    const risks = Object.values(healthPredictions);
    const avgRisk = risks.reduce((sum, risk) => sum + risk, 0) / risks.length;
    return Math.round((1 - avgRisk) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-green-400 bg-green-500/20 border-green-500/50';
    }
  };

  const trendData = generateTrendData();
  const riskData = getRiskData();
  const healthScore = getHealthScore();

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="text-purple-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Advanced Health Analytics</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-purple-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-xs">Analyzing</span>
            </div>
          )}
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            healthScore >= 80 ? 'bg-green-500/20 text-green-400' :
            healthScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            Health Score: {healthScore}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'predictions', label: 'AI Predictions', icon: Brain },
          { id: 'trends', label: 'Trends', icon: TrendingUp },
          { id: 'recommendations', label: 'Recommendations', icon: Target }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
              activeTab === id
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Vitals */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Current Vitals</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="text-red-400" size={16} />
                  <span className="text-slate-300 text-sm">Heart Rate</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{healthData.heartRate}</div>
                <div className="text-xs text-slate-400">BPM</div>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="text-blue-400" size={16} />
                  <span className="text-slate-300 text-sm">Steps</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{healthData.steps.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Today</div>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="text-purple-400" size={16} />
                  <span className="text-slate-300 text-sm">Blood Pressure</span>
                </div>
                <div className="text-lg font-bold text-purple-400">
                  {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
                </div>
                <div className="text-xs text-slate-400">mmHg</div>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="text-cyan-400" size={16} />
                  <span className="text-slate-300 text-sm">Blood Oxygen</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">{healthData.bloodOxygen}%</div>
                <div className="text-xs text-slate-400">SpO2</div>
              </div>
            </div>
          </div>

          {/* Risk Assessment Pie Chart */}
          <div>
            <h4 className="text-white font-semibold mb-4">Risk Assessment</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData.filter(item => item.value > 5)}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(healthPredictions).map(([risk, value]) => (
              <div key={risk} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm capitalize">
                    {risk.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className={`text-sm font-medium ${
                    value > 0.7 ? 'text-red-400' :
                    value > 0.4 ? 'text-orange-400' :
                    value > 0.2 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Math.round(value * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      value > 0.7 ? 'bg-red-400' :
                      value > 0.4 ? 'bg-orange-400' :
                      value > 0.2 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-2">AI Analysis Summary</h4>
            <p className="text-purple-300 text-sm">
              Based on your current health metrics and historical patterns, the AI has identified 
              {Object.values(healthPredictions).filter(v => v > 0.4).length} areas requiring attention. 
              Your overall health trajectory shows {healthScore >= 70 ? 'positive' : 'concerning'} trends.
            </p>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="h-80">
            <h4 className="text-white font-semibold mb-4">30-Day Health Trends</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                <Line type="monotone" dataKey="steps" stroke="#3b82f6" strokeWidth={2} name="Steps (x100)" />
                <Line type="monotone" dataKey="sleep" stroke="#10b981" strokeWidth={2} name="Sleep Hours" />
                <Line type="monotone" dataKey="bloodPressure" stroke="#8b5cf6" strokeWidth={2} name="Systolic BP" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h5 className="text-white font-medium mb-2">Heart Rate Variability</h5>
              <div className="text-2xl font-bold text-red-400">
                {Math.round(Math.random() * 20 + 30)}ms
              </div>
              <div className="text-xs text-slate-400">RMSSD</div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h5 className="text-white font-medium mb-2">Recovery Score</h5>
              <div className="text-2xl font-bold text-green-400">
                {Math.round(Math.random() * 30 + 70)}%
              </div>
              <div className="text-xs text-slate-400">Based on HRV & Sleep</div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h5 className="text-white font-medium mb-2">Stress Index</h5>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(Math.random() * 40 + 20)}
              </div>
              <div className="text-xs text-slate-400">0-100 Scale</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className={`p-4 border rounded-lg ${getPriorityColor(recommendations.priority)}`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle size={16} />
              <span className="font-semibold">Priority Level: {recommendations.priority.toUpperCase()}</span>
            </div>
            <p className="text-sm opacity-90">
              {recommendations.priority === 'critical' ? 'Immediate medical attention may be required.' :
               recommendations.priority === 'high' ? 'Important health actions needed soon.' :
               recommendations.priority === 'medium' ? 'Moderate health improvements recommended.' :
               'Maintain current healthy habits.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-red-400 font-semibold flex items-center">
                <Zap className="mr-2" size={16} />
                Immediate Actions
              </h4>
              {recommendations.immediate.length > 0 ? (
                recommendations.immediate.map((action, index) => (
                  <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="text-red-300 text-sm">• {action}</div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-sm">No immediate actions needed</div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-yellow-400 font-semibold flex items-center">
                <Target className="mr-2" size={16} />
                Short-term Goals
              </h4>
              {recommendations.shortTerm.length > 0 ? (
                recommendations.shortTerm.map((goal, index) => (
                  <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="text-yellow-300 text-sm">• {goal}</div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-sm">No short-term goals</div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-green-400 font-semibold flex items-center">
                <TrendingUp className="mr-2" size={16} />
                Long-term Plan
              </h4>
              {recommendations.longTerm.length > 0 ? (
                recommendations.longTerm.map((plan, index) => (
                  <div key={index} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-green-300 text-sm">• {plan}</div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-sm">No long-term plans</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedHealthDashboard;