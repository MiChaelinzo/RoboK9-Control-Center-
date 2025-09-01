import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Eye, Thermometer, Droplets, Gauge } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  onWeatherUpdate?: (weather: WeatherData) => void;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    humidity: 65,
    pressure: 1013,
    windSpeed: 12,
    windDirection: 'NW',
    visibility: 10,
    uvIndex: 4,
    condition: 'partly_cloudy',
    forecast: [
      { day: 'Today', high: 24, low: 18, condition: 'partly_cloudy', icon: '⛅' },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'sunny', icon: '☀️' },
      { day: 'Wednesday', high: 23, low: 17, condition: 'rainy', icon: '🌧️' },
      { day: 'Thursday', high: 25, low: 19, condition: 'cloudy', icon: '☁️' },
      { day: 'Friday', high: 27, low: 21, condition: 'sunny', icon: '☀️' }
    ]
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate weather updates
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, Math.min(30, prev.windSpeed + (Math.random() - 0.5) * 3)),
        uvIndex: Math.max(0, Math.min(11, prev.uvIndex + (Math.random() - 0.5) * 1))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (onWeatherUpdate) {
      onWeatherUpdate(weather);
    }
  }, [weather, onWeatherUpdate]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="text-yellow-400" size={24} />;
      case 'partly_cloudy': return <Cloud className="text-blue-400" size={24} />;
      case 'cloudy': return <Cloud className="text-slate-400" size={24} />;
      case 'rainy': return <CloudRain className="text-blue-500" size={24} />;
      default: return <Sun className="text-yellow-400" size={24} />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return 'text-blue-400';
    if (temp < 20) return 'text-cyan-400';
    if (temp < 30) return 'text-green-400';
    return 'text-orange-400';
  };

  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-400';
    if (uv <= 5) return 'text-yellow-400';
    if (uv <= 7) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getWeatherIcon(weather.condition)}
          <h3 className="text-lg font-semibold text-white">Weather</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <div className="space-y-3">
        {/* Current Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer size={16} className={getTemperatureColor(weather.temperature)} />
            <span className="text-slate-300 text-sm">Temperature</span>
          </div>
          <span className={`text-sm font-medium ${getTemperatureColor(weather.temperature)}`}>
            {weather.temperature}°C
          </span>
        </div>

        {/* Humidity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets size={16} className="text-blue-400" />
            <span className="text-slate-300 text-sm">Humidity</span>
          </div>
          <span className="text-sm font-medium text-blue-400">
            {weather.humidity}%
          </span>
        </div>

        {isExpanded && (
          <>
            {/* Wind */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wind size={16} className="text-slate-400" />
                <span className="text-slate-300 text-sm">Wind</span>
              </div>
              <span className="text-sm font-medium text-slate-300">
                {weather.windSpeed} km/h {weather.windDirection}
              </span>
            </div>

            {/* UV Index */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sun size={16} className={getUVColor(weather.uvIndex)} />
                <span className="text-slate-300 text-sm">UV Index</span>
              </div>
              <span className={`text-sm font-medium ${getUVColor(weather.uvIndex)}`}>
                {weather.uvIndex}
              </span>
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye size={16} className="text-slate-400" />
                <span className="text-slate-300 text-sm">Visibility</span>
              </div>
              <span className="text-sm font-medium text-slate-300">
                {weather.visibility} km
              </span>
            </div>

            {/* Pressure */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gauge size={16} className="text-slate-400" />
                <span className="text-slate-300 text-sm">Pressure</span>
              </div>
              <span className="text-sm font-medium text-slate-300">
                {weather.pressure} hPa
              </span>
            </div>

            {/* 5-Day Forecast */}
            <div className="pt-3 border-t border-slate-700/50">
              <h4 className="text-white font-medium mb-3">5-Day Forecast</h4>
              <div className="space-y-2">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{day.icon}</span>
                      <span className="text-slate-300 text-sm">{day.day}</span>
                    </div>
                    <div className="text-slate-300 text-sm">
                      {day.high}°/{day.low}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;