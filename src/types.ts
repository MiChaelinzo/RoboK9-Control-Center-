export interface Command {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'movement' | 'advanced' | 'tricks' | 'patrol' | 'entertainment' | 'security';
  emoji: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  commandExecuted?: string;
}

export interface DogStatus {
  online: boolean;
  battery: number;
  currentAction: string;
  location: string;
  cameraActive: boolean;
  intruderDetected: boolean;
  lastIntruderAlert?: Date;
  emotion: 'happy' | 'excited' | 'calm' | 'alert' | 'sleepy' | 'playful' | 'protective';
  nightVisionMode: boolean;
  learningMode: boolean;
  skillsLearned: string[];
  conversationMode: boolean;
}

export interface HealthData {
  heartRate: number;
  steps: number;
  bloodPressure: { systolic: number; diastolic: number };
  bloodOxygen: number;
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high';
  lastSync: Date;
  deviceConnected: boolean;
  deviceType: 'apple_watch' | 'fitbit' | 'samsung' | 'smartphone' | 'none';
  anomaliesDetected: HealthAnomaly[];
  emergencyContactsEnabled: boolean;
  healthKitConnected: boolean;
  fitnessGoals: FitnessGoals;
  weeklyActivity: WeeklyActivity;
  riskFactors: RiskFactor[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
  taken: boolean;
  importance: 'critical' | 'important' | 'routine';
}

export interface HealthReminder {
  id: string;
  type: 'medication' | 'exercise' | 'hydration' | 'checkup' | 'custom';
  title: string;
  message: string;
  scheduledTime: Date;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface HealthAnomaly {
  id: string;
  type: 'heart_rate_spike' | 'blood_pressure_high' | 'oxygen_low' | 'irregular_rhythm' | 'stress_critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  value: number;
  normalRange: { min: number; max: number };
  description: string;
  actionTaken: boolean;
  resolved: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: 'family' | 'friend' | 'doctor' | 'caregiver' | 'emergency';
  phone: string;
  email?: string;
  priority: number;
  autoNotify: boolean;
}

export interface FitnessGoals {
  dailySteps: number;
  weeklyExerciseMinutes: number;
  targetHeartRate: { min: number; max: number };
  weightGoal?: number;
  caloriesBurnGoal: number;
  activeGoals: string[];
}

export interface WeeklyActivity {
  totalSteps: number;
  totalExerciseMinutes: number;
  averageHeartRate: number;
  caloriesBurned: number;
  workoutsCompleted: number;
  restDays: number;
  progressPercentage: number;
}

export interface RiskFactor {
  id: string;
  type: 'hypertension' | 'diabetes' | 'heart_disease' | 'obesity' | 'smoking' | 'family_history';
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recommendations: string[];
}

export interface PredictiveInsight {
  id: string;
  type: 'cardiovascular_risk' | 'diabetes_risk' | 'hypertension_risk' | 'sleep_disorder' | 'stress_burnout' | 'nutritional_deficiency';
  riskLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  confidence: number; // 0-1
  timeframe: '1_week' | '1_month' | '3_months' | '6_months' | '1_year';
  description: string;
  factors: string[];
  recommendations: string[];
  preventiveActions: string[];
  createdAt: Date;
  validUntil: Date;
}

export interface NutritionData {
  id: string;
  date: Date;
  meals: Meal[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  waterIntake: number; // in ml
  supplements: Supplement[];
  nutritionScore: number; // 0-100
  deficiencies: string[];
  recommendations: string[];
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: Date;
  foods: Food[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    vitamins: { [key: string]: number };
    minerals: { [key: string]: number };
  };
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timeTaken: Date;
  type: 'vitamin' | 'mineral' | 'protein' | 'omega3' | 'probiotic' | 'other';
}

export interface EnvironmentalData {
  id: string;
  timestamp: Date;
  location: string;
  airQuality: {
    aqi: number; // Air Quality Index 0-500
    pm25: number; // PM2.5 particles
    pm10: number; // PM10 particles
    ozone: number;
    co2: number;
    status: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  };
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure: number; // hPa
  uvIndex: number;
  noiseLevel: number; // dB
  lightLevel: number; // lux
  allergens: {
    pollen: number;
    dust: number;
    mold: number;
  };
  correlations: EnvironmentalCorrelation[];
}

export interface EnvironmentalCorrelation {
  factor: string;
  healthMetric: string;
  correlation: number; // -1 to 1
  significance: 'low' | 'moderate' | 'high';
  description: string;
}

export interface ClinicalValidation {
  algorithmId: string;
  validationType: 'peer_review' | 'clinical_trial' | 'fda_clearance' | 'ce_marking' | 'iso_certification';
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  certificationBody: string;
  validationDate?: Date;
  expiryDate?: Date;
  studyResults?: {
    sensitivity: number;
    specificity: number;
    accuracy: number;
    sampleSize: number;
    studyDuration: string;
  };
  clinicalPartners: string[];
  regulatoryApprovals: string[];
}

export interface HealthcareProvider {
  id: string;
  name: string;
  specialty: string;
  institution: string;
  licenseNumber: string;
  email: string;
  phone: string;
  dataAccessLevel: 'basic' | 'full' | 'emergency_only';
  consentGiven: boolean;
  consentDate: Date;
  lastDataShare: Date;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'mixed';
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  targetHeartRate?: { min: number; max: number };
  caloriesBurn: number;
}

export interface Exercise {
  name: string;
  duration: number; // seconds
  reps?: number;
  sets?: number;
  restTime: number; // seconds
  instructions: string[];
  targetMuscles: string[];
}