import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, Wind, Sun, AlertTriangle, Leaf, Activity } from 'lucide-react';
import { EnvironmentalData, EnvironmentalCorrelation } from '../types';

interface EnvironmentalMonitorProps {
  environmentalData: EnvironmentalData;
  onRefreshData: () => void;
  showCorrelations: boolean;
}

const EnvironmentalMonitor: React.FC<EnvironmentalMonitorProps> = ({
  environmentalData,
  onRefreshData,
  showCorrelations
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'correlations' | 'history'>('current');

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400 bg-green-500/20';
    if (aqi <= 100) return 'text-yellow-400 bg-yellow-500/20';
    if (aqi <= 150) return 'text-orange-400 bg-orange-500/20';
    if (aqi <= 200) return 'text-red-400 bg-red-500/20';
    if (aqi <= 300) return 'text-purple-400 bg-purple-500/20';
    return 'text-red-600 bg-red-600/20';
  };

  const getAQIStatus = (status: string) => {
    const statusMap = {
      'good': { color: 'text-green-400', icon: '😊' },
      'moderate': { color: 'text-yellow-400', icon: '😐' },
      'unhealthy_sensitive': { color: 'text-orange-400', icon: '😷' },
      'unhealthy': { color: 'text-red-400', icon: '😨' },
      'very_unhealthy': { color: 'text-purple-400', icon: '🤢' },
      'hazardous': { color: 'text-red-600', icon: '☠️' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.good;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return 'text-blue-400';
    if (temp < 20) return 'text-cyan-400';
    if (temp < 30) return 'text-green-400';
    if (temp < 35) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-400';
    if (uv <= 5) return 'text-yellow-400';
    if (uv <= 7) return 'text-orange-400';
    if (uv <= 10) return 'text-red-400';
    return 'text-purple-400';
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    if (abs >= 0.3) return 'Weak';
    return 'Very Weak';
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return correlation > 0 ? 'text-red-400' : 'text-green-400';
    if (abs >= 0.5) return correlation > 0 ? 'text-orange-400' : 'text-blue-400';
    return 'text-slate-400';
  };

  const aqiStatus = getAQIStatus(environmentalData.airQuality.status);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Cloud className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Environmental Monitor</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-slate-400">
            {environmentalData.location}
          </div>
          <button
            onClick={onRefreshData}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            title="Refresh Data"
          >
            <Activity size={16} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'current', label: 'Current', icon: Cloud },
          { id: 'correlations', label: 'Health Impact', icon: Activity },
          { id: 'history', label: 'Trends', icon: Wind }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
              activeTab === id
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Current Conditions Tab */}
      {activeTab === 'current' && (
        <div className="space-y-6">
          {/* Air Quality */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold flex items-center">
                <Leaf className="mr-2 text-green-400" size={18} />
                Air Quality
              </h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAQIColor(environmentalData.airQuality.aqi)}`}>
                AQI {environmentalData.airQuality.aqi}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">{aqiStatus.icon}</div>
                <div className={`text-sm font-medium ${aqiStatus.color}`}>
                  {environmentalData.airQuality.status.replace('_', ' ')}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-white text-lg font-semibold">{environmentalData.airQuality.pm25}</div>
                <div className="text-slate-400 text-xs">PM2.5 μg/m³</div>
              </div>
              
              <div className="text-center">
                <div className="text-white text-lg font-semibold">{environmentalData.airQuality.pm10}</div>
                <div className="text-slate-400 text-xs">PM10 μg/m³</div>
              </div>
              
              <div className="text-center">
                <div className="text-white text-lg font-semibold">{environmentalData.airQuality.co2}</div>
                <div className="text-slate-400 text-xs">CO₂ ppm</div>
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <Thermometer className={`mx-auto mb-2 ${getTemperatureColor(environmentalData.temperature)}`} size={24} />
              <div className={`text-xl font-semibold ${getTemperatureColor(environmentalData.temperature)}`}>
                {environmentalData.temperature}°C
              </div>
              <div className="text-slate-400 text-sm">Temperature</div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <Droplets className="mx-auto mb-2 text-blue-400" size={24} />
              <div className="text-xl font-semibold text-blue-400">
                {environmentalData.humidity}%
              </div>
              <div className="text-slate-400 text-sm">Humidity</div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <Sun className={`mx-auto mb-2 ${getUVColor(environmentalData.uvIndex)}`} size={24} />
              <div className={`text-xl font-semibold ${getUVColor(environmentalData.uvIndex)}`}>
                {environmentalData.uvIndex}
              </div>
              <div className="text-slate-400 text-sm">UV Index</div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <Wind className="mx-auto mb-2 text-slate-400" size={24} />
              <div className="text-xl font-semibold text-white">
                {environmentalData.pressure}
              </div>
              <div className="text-slate-400 text-sm">Pressure hPa</div>
            </div>
          </div>

          {/* Allergens */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-white font-semibold mb-3">Allergen Levels</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-400">{environmentalData.allergens.pollen}</div>
                <div className="text-slate-400 text-sm">Pollen</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-400">{environmentalData.allergens.dust}</div>
                <div className="text-slate-400 text-sm">Dust</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-400">{environmentalData.allergens.mold}</div>
                <div className="text-slate-400 text-sm">Mold</div>
              </div>
            </div>
          </div>

          {/* Environmental Alerts */}
          {(environmentalData.airQuality.aqi > 100 || environmentalData.uvIndex > 7) && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="text-orange-400" size={16} />
                <span className="text-orange-400 font-semibold">Environmental Alerts</span>
              </div>
              <div className="space-y-1 text-sm text-orange-300">
                {environmentalData.airQuality.aqi > 100 && (
                  <div>• Air quality is unhealthy - limit outdoor activities</div>
                )}
                {environmentalData.uvIndex > 7 && (
                  <div>• High UV levels - use sun protection</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Health Correlations Tab */}
      {activeTab === 'correlations' && showCorrelations && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-3">Environmental Health Correlations</h4>
            <p className="text-purple-300 text-sm mb-4">
              AI analysis of how environmental factors correlate with your health metrics
            </p>
          </div>

          {environmentalData.correlations.map((correlation, index) => (
            <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    correlation.significance === 'high' ? 'bg-red-400' :
                    correlation.significance === 'moderate' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div>
                    <div className="text-white font-medium">{correlation.factor}</div>
                    <div className="text-slate-400 text-sm">affects {correlation.healthMetric}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${getCorrelationColor(correlation.correlation)}`}>
                    {correlation.correlation > 0 ? '+' : ''}{(correlation.correlation * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-400">
                    {getCorrelationStrength(correlation.correlation)}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-slate-300 mt-2">
                {correlation.description}
              </div>
              
              <div className={`mt-2 px-2 py-1 rounded text-xs ${
                correlation.significance === 'high' ? 'bg-red-500/20 text-red-400' :
                correlation.significance === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {correlation.significance} significance
              </div>
            </div>
          ))}

          {environmentalData.correlations.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-slate-400">No correlations detected yet</p>
              <p className="text-slate-500 text-sm">More data needed for analysis</p>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-white font-semibold mb-3">24-Hour Trends</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Air Quality</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-700 rounded-full">
                    <div className="w-3/4 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                  <span className="text-yellow-400 text-sm">Moderate</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Temperature</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-700 rounded-full">
                    <div className="w-2/3 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-green-400 text-sm">↗ Rising</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Humidity</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-700 rounded-full">
                    <div className="w-1/2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <span className="text-blue-400 text-sm">→ Stable</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-300">UV Index</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-slate-700 rounded-full">
                    <div className="w-5/6 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                  <span className="text-orange-400 text-sm">High</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2">Environmental Insights</h4>
            <div className="space-y-2 text-sm text-blue-300">
              <div>• Air quality typically improves in the evening</div>
              <div>• Your heart rate correlates with temperature changes</div>
              <div>• Sleep quality decreases when humidity is above 70%</div>
              <div>• Stress levels increase on high pollen days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentalMonitor;