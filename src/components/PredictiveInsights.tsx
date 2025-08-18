import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Shield, Calendar, Target, Lightbulb, Activity } from 'lucide-react';
import { PredictiveInsight, HealthData, NutritionData, EnvironmentalData } from '../types';

interface PredictiveInsightsProps {
  insights: PredictiveInsight[];
  healthData: HealthData;
  nutritionData?: NutritionData;
  environmentalData?: EnvironmentalData;
  onGenerateInsights: () => void;
  onAcceptRecommendation: (insightId: string, actionId: string) => void;
}

const PredictiveInsights: React.FC<PredictiveInsightsProps> = ({
  insights,
  healthData,
  nutritionData,
  environmentalData,
  onGenerateInsights,
  onAcceptRecommendation
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('3_months');
  const [activeTab, setActiveTab] = useState<'insights' | 'trends' | 'prevention'>('insights');

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very_low': return 'text-green-400 border-green-400 bg-green-500/10';
      case 'low': return 'text-blue-400 border-blue-400 bg-blue-500/10';
      case 'moderate': return 'text-yellow-400 border-yellow-400 bg-yellow-500/10';
      case 'high': return 'text-orange-400 border-orange-400 bg-orange-500/10';
      case 'very_high': return 'text-red-400 border-red-400 bg-red-500/10';
      default: return 'text-slate-400 border-slate-400 bg-slate-500/10';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very_low': return <Shield className="text-green-400" size={20} />;
      case 'low': return <Shield className="text-blue-400" size={20} />;
      case 'moderate': return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'high': return <AlertTriangle className="text-orange-400" size={20} />;
      case 'very_high': return <AlertTriangle className="text-red-400 animate-pulse" size={20} />;
      default: return <Activity className="text-slate-400" size={20} />;
    }
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case '1_week': return '1 Week';
      case '1_month': return '1 Month';
      case '3_months': return '3 Months';
      case '6_months': return '6 Months';
      case '1_year': return '1 Year';
      default: return timeframe;
    }
  };

  const filteredInsights = insights.filter(insight => 
    selectedTimeframe === 'all' || insight.timeframe === selectedTimeframe
  );

  const highRiskInsights = filteredInsights.filter(i => ['high', 'very_high'].includes(i.riskLevel));
  const moderateRiskInsights = filteredInsights.filter(i => i.riskLevel === 'moderate');
  const lowRiskInsights = filteredInsights.filter(i => ['low', 'very_low'].includes(i.riskLevel));

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="text-purple-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Predictive Health Insights</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
          >
            <option value="all">All Timeframes</option>
            <option value="1_week">1 Week</option>
            <option value="1_month">1 Month</option>
            <option value="3_months">3 Months</option>
            <option value="6_months">6 Months</option>
            <option value="1_year">1 Year</option>
          </select>
          
          <button
            onClick={onGenerateInsights}
            className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            title="Generate New Insights"
          >
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'insights', label: 'Insights', icon: Brain },
          { id: 'trends', label: 'Trends', icon: TrendingUp },
          { id: 'prevention', label: 'Prevention', icon: Shield }
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

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {/* High Risk Insights */}
          {highRiskInsights.length > 0 && (
            <div>
              <h4 className="text-red-400 font-semibold mb-3 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                High Risk Predictions
              </h4>
              {highRiskInsights.map(insight => (
                <div key={insight.id} className={`p-4 rounded-lg border ${getRiskColor(insight.riskLevel)} mb-3`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getRiskIcon(insight.riskLevel)}
                      <div>
                        <h5 className="font-semibold text-white mb-1">{insight.description}</h5>
                        <div className="flex items-center space-x-4 text-sm opacity-80">
                          <span>Risk: {insight.riskLevel.replace('_', ' ')}</span>
                          <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                          <span>Timeframe: {getTimeframeLabel(insight.timeframe)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-sm font-medium mb-2">Contributing Factors:</h6>
                    <div className="flex flex-wrap gap-2">
                      {insight.factors.map((factor, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 rounded text-xs">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium mb-2">Preventive Actions:</h6>
                    <div className="space-y-2">
                      {insight.preventiveActions.map((action, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{action}</span>
                          <button
                            onClick={() => onAcceptRecommendation(insight.id, `action_${index}`)}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Moderate Risk Insights */}
          {moderateRiskInsights.length > 0 && (
            <div>
              <h4 className="text-yellow-400 font-semibold mb-3 flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Moderate Risk Predictions
              </h4>
              {moderateRiskInsights.map(insight => (
                <div key={insight.id} className={`p-3 rounded-lg border ${getRiskColor(insight.riskLevel)} mb-2`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(insight.riskLevel)}
                      <span className="font-medium text-white">{insight.description}</span>
                    </div>
                    <span className="text-xs opacity-70">{getTimeframeLabel(insight.timeframe)}</span>
                  </div>
                  <div className="text-sm opacity-80">
                    Key factors: {insight.factors.slice(0, 3).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Low Risk Insights */}
          {lowRiskInsights.length > 0 && (
            <div>
              <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                <Shield size={16} className="mr-2" />
                Low Risk / Positive Trends
              </h4>
              {lowRiskInsights.map(insight => (
                <div key={insight.id} className={`p-3 rounded-lg border ${getRiskColor(insight.riskLevel)} mb-2`}>
                  <div className="flex items-center space-x-2">
                    {getRiskIcon(insight.riskLevel)}
                    <span className="font-medium text-white">{insight.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredInsights.length === 0 && (
            <div className="text-center py-8">
              <Brain className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-slate-400">No insights available for selected timeframe</p>
              <button
                onClick={onGenerateInsights}
                className="mt-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                Generate Insights
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h5 className="font-medium text-white mb-2">Health Trend Analysis</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Heart Rate Variability</span>
                  <span className="text-green-400">↗ Improving</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Sleep Quality</span>
                  <span className="text-blue-400">→ Stable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Stress Levels</span>
                  <span className="text-yellow-400">↗ Increasing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Activity Level</span>
                  <span className="text-green-400">↗ Improving</span>
                </div>
              </div>
            </div>

            {nutritionData && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h5 className="font-medium text-white mb-2">Nutrition Trends</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Protein Intake</span>
                    <span className="text-green-400">Adequate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Hydration</span>
                    <span className="text-yellow-400">Below Target</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Fiber Intake</span>
                    <span className="text-red-400">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Sugar Intake</span>
                    <span className="text-orange-400">High</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {environmentalData && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h5 className="font-medium text-white mb-3">Environmental Correlations</h5>
              <div className="space-y-3">
                {environmentalData.correlations.map((correlation, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="text-white text-sm">{correlation.factor}</span>
                      <span className="text-slate-400 text-xs ml-2">→ {correlation.healthMetric}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        correlation.significance === 'high' ? 'bg-red-500/20 text-red-400' :
                        correlation.significance === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {correlation.significance}
                      </span>
                      <span className="text-slate-300 text-sm">
                        {correlation.correlation > 0 ? '+' : ''}{(correlation.correlation * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prevention Tab */}
      {activeTab === 'prevention' && (
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="text-green-400" size={16} />
              <span className="text-green-400 font-semibold">Personalized Prevention Plan</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/50 rounded">
                <h6 className="text-white font-medium mb-2">Cardiovascular Health</h6>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Maintain 150 minutes of moderate exercise weekly</li>
                  <li>• Keep sodium intake below 2300mg daily</li>
                  <li>• Monitor blood pressure twice weekly</li>
                </ul>
              </div>
              
              <div className="p-3 bg-slate-800/50 rounded">
                <h6 className="text-white font-medium mb-2">Metabolic Health</h6>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Increase fiber intake to 25-30g daily</li>
                  <li>• Limit added sugars to less than 10% of calories</li>
                  <li>• Consider intermittent fasting 2-3 days per week</li>
                </ul>
              </div>
              
              <div className="p-3 bg-slate-800/50 rounded">
                <h6 className="text-white font-medium mb-2">Mental Health</h6>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Practice 10 minutes of meditation daily</li>
                  <li>• Maintain 7-9 hours of quality sleep</li>
                  <li>• Limit screen time 1 hour before bed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveInsights;