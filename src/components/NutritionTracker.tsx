import React, { useState, useEffect } from 'react';
import { Apple, Droplets, TrendingUp, Plus, Camera, Utensils, Award, AlertCircle } from 'lucide-react';
import { NutritionData, Meal, Food, Supplement } from '../types';

interface NutritionTrackerProps {
  nutritionData: NutritionData;
  onLogFood: (meal: Partial<Meal>) => void;
  onLogWater: (amount: number) => void;
  onLogSupplement: (supplement: Supplement) => void;
  onScanFood: () => void;
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({
  nutritionData,
  onLogFood,
  onLogWater,
  onLogSupplement,
  onScanFood,
  dailyGoals
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'meals' | 'water' | 'supplements'>('overview');
  const [waterAmount, setWaterAmount] = useState(250);
  const [showAddMeal, setShowAddMeal] = useState(false);

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'text-green-400';
    if (percentage >= 75) return 'text-yellow-400';
    if (percentage >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressWidth = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getNutritionGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-400' };
    if (score >= 80) return { grade: 'A', color: 'text-green-400' };
    if (score >= 70) return { grade: 'B', color: 'text-yellow-400' };
    if (score >= 60) return { grade: 'C', color: 'text-orange-400' };
    return { grade: 'D', color: 'text-red-400' };
  };

  const todaysMeals = nutritionData.meals.filter(meal => 
    meal.time.toDateString() === new Date().toDateString()
  );

  const mealsByType = {
    breakfast: todaysMeals.filter(m => m.type === 'breakfast'),
    lunch: todaysMeals.filter(m => m.type === 'lunch'),
    dinner: todaysMeals.filter(m => m.type === 'dinner'),
    snack: todaysMeals.filter(m => m.type === 'snack')
  };

  const nutritionGrade = getNutritionGrade(nutritionData.nutritionScore);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Apple className="text-green-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Nutrition Tracker</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${nutritionGrade.color}`}>
            <Award size={16} />
            <span className="font-bold">{nutritionGrade.grade}</span>
          </div>
          
          <button
            onClick={onScanFood}
            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            title="Scan Food"
          >
            <Camera size={16} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'meals', label: 'Meals', icon: Utensils },
          { id: 'water', label: 'Water', icon: Droplets },
          { id: 'supplements', label: 'Supplements', icon: Plus }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
              activeTab === id
                ? 'bg-green-500/20 text-green-400'
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
        <div className="space-y-6">
          {/* Daily Progress */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Calories</span>
                <span className={`text-sm font-medium ${getProgressColor(nutritionData.dailyTotals.calories, dailyGoals.calories)}`}>
                  {nutritionData.dailyTotals.calories}/{dailyGoals.calories}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressWidth(nutritionData.dailyTotals.calories, dailyGoals.calories)}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Protein</span>
                <span className={`text-sm font-medium ${getProgressColor(nutritionData.dailyTotals.protein, dailyGoals.protein)}`}>
                  {nutritionData.dailyTotals.protein}g/{dailyGoals.protein}g
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressWidth(nutritionData.dailyTotals.protein, dailyGoals.protein)}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Carbs</span>
                <span className={`text-sm font-medium ${getProgressColor(nutritionData.dailyTotals.carbs, dailyGoals.carbs)}`}>
                  {nutritionData.dailyTotals.carbs}g/{dailyGoals.carbs}g
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressWidth(nutritionData.dailyTotals.carbs, dailyGoals.carbs)}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Water</span>
                <span className={`text-sm font-medium ${getProgressColor(nutritionData.waterIntake, dailyGoals.water)}`}>
                  {nutritionData.waterIntake}ml/{dailyGoals.water}ml
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressWidth(nutritionData.waterIntake, dailyGoals.water)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nutrition Score */}
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-green-400 font-semibold">Daily Nutrition Score</h4>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${nutritionGrade.color}`}>
                  {nutritionData.nutritionScore}/100
                </div>
                <Award className={nutritionGrade.color} size={24} />
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${nutritionData.nutritionScore}%` }}
              />
            </div>
          </div>

          {/* Deficiencies & Recommendations */}
          {nutritionData.deficiencies.length > 0 && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="text-orange-400" size={16} />
                <span className="text-orange-400 font-semibold">Nutritional Deficiencies</span>
              </div>
              <div className="space-y-2">
                {nutritionData.deficiencies.map((deficiency, index) => (
                  <div key={index} className="text-orange-300 text-sm">
                    • {deficiency}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="text-purple-400" size={16} />
              <span className="text-purple-400 font-semibold">AI Nutrition Recommendations</span>
            </div>
            <div className="space-y-2">
              {nutritionData.recommendations.map((recommendation, index) => (
                <div key={index} className="text-purple-300 text-sm">
                  • {recommendation}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Meals Tab */}
      {activeTab === 'meals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-semibold">Today's Meals</h4>
            <button
              onClick={() => setShowAddMeal(true)}
              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {Object.entries(mealsByType).map(([mealType, meals]) => (
            <div key={mealType} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium capitalize">{mealType}</h5>
                <span className="text-slate-400 text-sm">
                  {meals.reduce((total, meal) => total + meal.totalCalories, 0)} cal
                </span>
              </div>
              
              {meals.length > 0 ? (
                <div className="space-y-2">
                  {meals.map(meal => (
                    <div key={meal.id} className="p-2 bg-slate-700/50 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white text-sm">
                            {meal.foods.map(food => food.name).join(', ')}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {meal.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-white">{meal.totalCalories} cal</div>
                          <div className="text-slate-400 text-xs">
                            P: {meal.macros.protein}g C: {meal.macros.carbs}g F: {meal.macros.fat}g
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-sm text-center py-4">
                  No {mealType} logged yet
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Water Tab */}
      {activeTab === 'water' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-cyan-500/20 rounded-full mb-4">
              <Droplets className="text-cyan-400" size={48} />
            </div>
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {nutritionData.waterIntake}ml
            </div>
            <div className="text-slate-400">
              of {dailyGoals.water}ml daily goal
            </div>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4">
            <div 
              className="bg-cyan-400 h-4 rounded-full transition-all duration-300"
              style={{ width: `${getProgressWidth(nutritionData.waterIntake, dailyGoals.water)}%` }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={waterAmount}
              onChange={(e) => setWaterAmount(parseInt(e.target.value))}
              className="flex-1 p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
              placeholder="Amount (ml)"
            />
            <button
              onClick={() => onLogWater(waterAmount)}
              className="px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              Log Water
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[250, 500, 750].map(amount => (
              <button
                key={amount}
                onClick={() => onLogWater(amount)}
                className="p-3 bg-slate-800/50 rounded-lg text-white hover:bg-slate-700/50 transition-colors"
              >
                {amount}ml
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Supplements Tab */}
      {activeTab === 'supplements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-semibold">Today's Supplements</h4>
            <button className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
              <Plus size={16} />
            </button>
          </div>

          {nutritionData.supplements.map(supplement => (
            <div key={supplement.id} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{supplement.name}</div>
                  <div className="text-slate-400 text-sm">{supplement.dosage}</div>
                  <div className="text-slate-500 text-xs">
                    {supplement.timeTaken.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  supplement.type === 'vitamin' ? 'bg-yellow-500/20 text-yellow-400' :
                  supplement.type === 'mineral' ? 'bg-blue-500/20 text-blue-400' :
                  supplement.type === 'protein' ? 'bg-red-500/20 text-red-400' :
                  supplement.type === 'omega3' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {supplement.type}
                </div>
              </div>
            </div>
          ))}

          {nutritionData.supplements.length === 0 && (
            <div className="text-center py-8">
              <Plus className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-slate-400">No supplements logged today</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionTracker;