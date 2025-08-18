import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award, Play, Pause, RotateCcw, Timer, Zap } from 'lucide-react';
import { FitnessGoals, WeeklyActivity, WorkoutPlan, Exercise } from '../types';

interface FitnessCoachProps {
  fitnessGoals: FitnessGoals;
  weeklyActivity: WeeklyActivity;
  workoutPlans: WorkoutPlan[];
  onStartWorkout: (planId: string) => void;
  onUpdateGoals: (goals: Partial<FitnessGoals>) => void;
  currentHeartRate: number;
}

const FitnessCoach: React.FC<FitnessCoachProps> = ({
  fitnessGoals,
  weeklyActivity,
  workoutPlans,
  onStartWorkout,
  onUpdateGoals,
  currentHeartRate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'goals'>('overview');
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && !isPaused && activeWorkout) {
      interval = setInterval(() => {
        setExerciseTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused, activeWorkout]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-400';
    if (percentage >= 75) return 'text-yellow-400';
    if (percentage >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHeartRateZone = (hr: number) => {
    if (hr < fitnessGoals.targetHeartRate.min) return { zone: 'Below Target', color: 'text-blue-400' };
    if (hr > fitnessGoals.targetHeartRate.max) return { zone: 'Above Target', color: 'text-red-400' };
    return { zone: 'Target Zone', color: 'text-green-400' };
  };

  const startWorkout = (plan: WorkoutPlan) => {
    setActiveWorkout(plan);
    setCurrentExercise(0);
    setExerciseTime(0);
    setIsWorkoutActive(true);
    setIsPaused(false);
    onStartWorkout(plan.id);
  };

  const nextExercise = () => {
    if (activeWorkout && currentExercise < activeWorkout.exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setExerciseTime(0);
    } else {
      // Workout completed
      setIsWorkoutActive(false);
      setActiveWorkout(null);
    }
  };

  const stepsProgress = (weeklyActivity.totalSteps / (fitnessGoals.dailySteps * 7)) * 100;
  const exerciseProgress = (weeklyActivity.totalExerciseMinutes / fitnessGoals.weeklyExerciseMinutes) * 100;
  const caloriesProgress = (weeklyActivity.caloriesBurned / fitnessGoals.caloriesBurnGoal) * 100;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="text-green-400" size={20} />
          <h3 className="text-lg font-semibold text-white">AI Fitness Coach</h3>
        </div>
        
        {currentHeartRate > 0 && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className={`text-sm font-medium ${getHeartRateZone(currentHeartRate).color}`}>
              {currentHeartRate} BPM - {getHeartRateZone(currentHeartRate).zone}
            </span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'workouts', label: 'Workouts', icon: Play },
          { id: 'goals', label: 'Goals', icon: Target }
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

      {/* Active Workout */}
      {activeWorkout && isWorkoutActive && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-green-400 font-semibold">{activeWorkout.name}</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button
                onClick={() => {
                  setIsWorkoutActive(false);
                  setActiveWorkout(null);
                }}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm text-green-300 mb-1">
              <span>Exercise {currentExercise + 1} of {activeWorkout.exercises.length}</span>
              <span>{formatTime(exerciseTime)}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExercise + 1) / activeWorkout.exercises.length) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="text-white">
            <h5 className="font-medium mb-2">{activeWorkout.exercises[currentExercise].name}</h5>
            <div className="text-sm text-slate-300 mb-2">
              {activeWorkout.exercises[currentExercise].instructions[0]}
            </div>
            <button
              onClick={nextExercise}
              className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {currentExercise < activeWorkout.exercises.length - 1 ? 'Next Exercise' : 'Complete Workout'}
            </button>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Weekly Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Steps</span>
                <span className={`text-sm font-medium ${getProgressColor(stepsProgress)}`}>
                  {Math.round(stepsProgress)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(stepsProgress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                {weeklyActivity.totalSteps.toLocaleString()} / {(fitnessGoals.dailySteps * 7).toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Exercise</span>
                <span className={`text-sm font-medium ${getProgressColor(exerciseProgress)}`}>
                  {Math.round(exerciseProgress)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(exerciseProgress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                {weeklyActivity.totalExerciseMinutes} / {fitnessGoals.weeklyExerciseMinutes} min
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">Calories</span>
                <span className={`text-sm font-medium ${getProgressColor(caloriesProgress)}`}>
                  {Math.round(caloriesProgress)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">
                {weeklyActivity.caloriesBurned} / {fitnessGoals.caloriesBurnGoal} cal
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="text-purple-400" size={16} />
              <span className="text-purple-400 font-semibold">AI Recommendations</span>
            </div>
            <div className="space-y-2 text-sm text-purple-300">
              {stepsProgress < 70 && (
                <p>• Try taking a 10-minute walk after meals to boost your daily steps</p>
              )}
              {exerciseProgress < 50 && (
                <p>• You're behind on exercise goals. Consider a quick 15-minute workout today</p>
              )}
              {currentHeartRate > 0 && currentHeartRate < fitnessGoals.targetHeartRate.min && (
                <p>• Your heart rate is low. Time for some cardio to get in the target zone!</p>
              )}
              {weeklyActivity.restDays > 3 && (
                <p>• You've had {weeklyActivity.restDays} rest days. Your body is ready for activity!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workouts Tab */}
      {activeTab === 'workouts' && (
        <div className="space-y-4">
          {workoutPlans.map(plan => (
            <div key={plan.id} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium">{plan.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>{plan.duration} min</span>
                    <span className="capitalize">{plan.difficulty}</span>
                    <span className="capitalize">{plan.type}</span>
                    <span>{plan.caloriesBurn} cal</span>
                  </div>
                </div>
                <button
                  onClick={() => startWorkout(plan)}
                  disabled={isWorkoutActive}
                  className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={16} />
                </button>
              </div>
              <div className="text-xs text-slate-500">
                {plan.exercises.length} exercises
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <label className="block text-slate-300 text-sm mb-2">Daily Steps Goal</label>
              <input
                type="number"
                value={fitnessGoals.dailySteps}
                onChange={(e) => onUpdateGoals({ dailySteps: parseInt(e.target.value) })}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <label className="block text-slate-300 text-sm mb-2">Weekly Exercise (minutes)</label>
              <input
                type="number"
                value={fitnessGoals.weeklyExerciseMinutes}
                onChange={(e) => onUpdateGoals({ weeklyExerciseMinutes: parseInt(e.target.value) })}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <label className="block text-slate-300 text-sm mb-2">Target Heart Rate (min)</label>
              <input
                type="number"
                value={fitnessGoals.targetHeartRate.min}
                onChange={(e) => onUpdateGoals({ 
                  targetHeartRate: { ...fitnessGoals.targetHeartRate, min: parseInt(e.target.value) }
                })}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <label className="block text-slate-300 text-sm mb-2">Target Heart Rate (max)</label>
              <input
                type="number"
                value={fitnessGoals.targetHeartRate.max}
                onChange={(e) => onUpdateGoals({ 
                  targetHeartRate: { ...fitnessGoals.targetHeartRate, max: parseInt(e.target.value) }
                })}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="text-green-400" size={16} />
              <span className="text-green-400 font-semibold">Active Goals</span>
            </div>
            <div className="space-y-1">
              {fitnessGoals.activeGoals.map((goal, index) => (
                <div key={index} className="text-sm text-green-300">• {goal}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessCoach;