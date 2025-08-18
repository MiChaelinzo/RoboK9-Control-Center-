import { HealthData, NutritionData, EnvironmentalData, PredictiveInsight } from '../types';

export class PredictiveAnalyticsService {
  private static instance: PredictiveAnalyticsService;
  private historicalData: HealthData[] = [];
  private nutritionHistory: NutritionData[] = [];
  private environmentalHistory: EnvironmentalData[] = [];
  private modelWeights = {
    cardiovascular: {
      heartRate: 0.3,
      bloodPressure: 0.4,
      activity: 0.2,
      stress: 0.1
    },
    diabetes: {
      bloodSugar: 0.4,
      weight: 0.2,
      activity: 0.2,
      nutrition: 0.2
    },
    hypertension: {
      bloodPressure: 0.5,
      sodium: 0.2,
      stress: 0.2,
      sleep: 0.1
    }
  };

  private constructor() {}

  static getInstance(): PredictiveAnalyticsService {
    if (!PredictiveAnalyticsService.instance) {
      PredictiveAnalyticsService.instance = new PredictiveAnalyticsService();
    }
    return PredictiveAnalyticsService.instance;
  }

  addHealthData(data: HealthData): void {
    this.historicalData.push(data);
    // Keep only last 90 days of data for performance
    if (this.historicalData.length > 90) {
      this.historicalData.shift();
    }
  }

  addNutritionData(data: NutritionData): void {
    this.nutritionHistory.push(data);
    if (this.nutritionHistory.length > 90) {
      this.nutritionHistory.shift();
    }
  }

  addEnvironmentalData(data: EnvironmentalData): void {
    this.environmentalHistory.push(data);
    if (this.environmentalHistory.length > 90) {
      this.environmentalHistory.shift();
    }
  }

  generatePredictiveInsights(): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];
    
    if (this.historicalData.length < 7) {
      return insights; // Need at least a week of data
    }

    // Cardiovascular Risk Analysis
    const cardioInsight = this.analyzeCardiovascularRisk();
    if (cardioInsight) insights.push(cardioInsight);

    // Diabetes Risk Analysis
    const diabetesInsight = this.analyzeDiabetesRisk();
    if (diabetesInsight) insights.push(diabetesInsight);

    // Hypertension Risk Analysis
    const hypertensionInsight = this.analyzeHypertensionRisk();
    if (hypertensionInsight) insights.push(hypertensionInsight);

    // Sleep Disorder Analysis
    const sleepInsight = this.analyzeSleepDisorderRisk();
    if (sleepInsight) insights.push(sleepInsight);

    // Stress Burnout Analysis
    const stressInsight = this.analyzeStressBurnoutRisk();
    if (stressInsight) insights.push(stressInsight);

    // Nutritional Deficiency Analysis
    if (this.nutritionHistory.length > 0) {
      const nutritionInsight = this.analyzeNutritionalDeficiencyRisk();
      if (nutritionInsight) insights.push(nutritionInsight);
    }

    return insights;
  }

  private analyzeCardiovascularRisk(): PredictiveInsight | null {
    const recentData = this.historicalData.slice(-30); // Last 30 days
    
    // Calculate risk factors
    const avgHeartRate = recentData.reduce((sum, d) => sum + d.heartRate, 0) / recentData.length;
    const avgSystolic = recentData.reduce((sum, d) => sum + d.bloodPressure.systolic, 0) / recentData.length;
    const avgSteps = recentData.reduce((sum, d) => sum + d.steps, 0) / recentData.length;
    const highStressDays = recentData.filter(d => d.stressLevel === 'high').length;

    // Risk calculation using weighted factors
    let riskScore = 0;
    
    // Heart rate variability risk
    if (avgHeartRate > 90) riskScore += 0.3;
    else if (avgHeartRate < 50) riskScore += 0.2;
    
    // Blood pressure risk
    if (avgSystolic > 140) riskScore += 0.4;
    else if (avgSystolic > 130) riskScore += 0.2;
    
    // Activity level risk
    if (avgSteps < 5000) riskScore += 0.2;
    else if (avgSteps < 8000) riskScore += 0.1;
    
    // Stress risk
    if (highStressDays > 10) riskScore += 0.1;

    if (riskScore < 0.3) return null; // Low risk, no insight needed

    const riskLevel = this.calculateRiskLevel(riskScore);
    const timeframe = riskScore > 0.7 ? '1_month' : riskScore > 0.5 ? '3_months' : '6_months';

    return {
      id: `cardio_risk_${Date.now()}`,
      type: 'cardiovascular_risk',
      riskLevel,
      confidence: Math.min(0.95, 0.6 + (recentData.length / 30) * 0.3),
      timeframe,
      description: this.getCardiovascularDescription(riskScore),
      factors: this.getCardiovascularFactors(avgHeartRate, avgSystolic, avgSteps, highStressDays),
      recommendations: this.getCardiovascularRecommendations(riskScore),
      preventiveActions: this.getCardiovascularPreventiveActions(riskScore),
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };
  }

  private analyzeDiabetesRisk(): PredictiveInsight | null {
    const recentData = this.historicalData.slice(-30);
    const recentNutrition = this.nutritionHistory.slice(-30);
    
    let riskScore = 0;
    const factors: string[] = [];

    // Activity level analysis
    const avgSteps = recentData.reduce((sum, d) => sum + d.steps, 0) / recentData.length;
    if (avgSteps < 5000) {
      riskScore += 0.2;
      factors.push('Low physical activity');
    }

    // Nutrition analysis
    if (recentNutrition.length > 0) {
      const avgSugar = recentNutrition.reduce((sum, n) => sum + n.dailyTotals.sugar, 0) / recentNutrition.length;
      const avgFiber = recentNutrition.reduce((sum, n) => sum + n.dailyTotals.fiber, 0) / recentNutrition.length;
      
      if (avgSugar > 50) { // High sugar intake
        riskScore += 0.3;
        factors.push('High sugar consumption');
      }
      
      if (avgFiber < 25) { // Low fiber intake
        riskScore += 0.1;
        factors.push('Low fiber intake');
      }
    }

    // Sleep quality analysis
    const avgSleep = recentData.reduce((sum, d) => sum + d.sleepHours, 0) / recentData.length;
    if (avgSleep < 6) {
      riskScore += 0.2;
      factors.push('Poor sleep quality');
    }

    // Stress analysis
    const highStressDays = recentData.filter(d => d.stressLevel === 'high').length;
    if (highStressDays > 15) {
      riskScore += 0.2;
      factors.push('Chronic stress');
    }

    if (riskScore < 0.3) return null;

    const riskLevel = this.calculateRiskLevel(riskScore);
    const timeframe = riskScore > 0.7 ? '3_months' : riskScore > 0.5 ? '6_months' : '1_year';

    return {
      id: `diabetes_risk_${Date.now()}`,
      type: 'diabetes_risk',
      riskLevel,
      confidence: Math.min(0.9, 0.5 + (recentData.length / 30) * 0.4),
      timeframe,
      description: `Elevated risk for type 2 diabetes based on lifestyle factors`,
      factors,
      recommendations: [
        'Increase daily physical activity to 10,000+ steps',
        'Reduce added sugar intake to less than 25g daily',
        'Increase fiber intake to 30g+ daily',
        'Maintain 7-9 hours of quality sleep',
        'Practice stress management techniques'
      ],
      preventiveActions: [
        'Schedule diabetes screening with healthcare provider',
        'Start structured exercise program',
        'Consult nutritionist for meal planning',
        'Monitor blood glucose levels regularly'
      ],
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    };
  }

  private analyzeHypertensionRisk(): PredictiveInsight | null {
    const recentData = this.historicalData.slice(-30);
    const recentNutrition = this.nutritionHistory.slice(-30);
    
    let riskScore = 0;
    const factors: string[] = [];

    // Blood pressure trend analysis
    const avgSystolic = recentData.reduce((sum, d) => sum + d.bloodPressure.systolic, 0) / recentData.length;
    const avgDiastolic = recentData.reduce((sum, d) => sum + d.bloodPressure.diastolic, 0) / recentData.length;
    
    if (avgSystolic > 130) {
      riskScore += 0.4;
      factors.push('Elevated systolic blood pressure');
    }
    
    if (avgDiastolic > 85) {
      riskScore += 0.3;
      factors.push('Elevated diastolic blood pressure');
    }

    // Sodium intake analysis
    if (recentNutrition.length > 0) {
      const avgSodium = recentNutrition.reduce((sum, n) => sum + n.dailyTotals.sodium, 0) / recentNutrition.length;
      if (avgSodium > 2300) {
        riskScore += 0.2;
        factors.push('High sodium intake');
      }
    }

    // Stress and sleep analysis
    const highStressDays = recentData.filter(d => d.stressLevel === 'high').length;
    const avgSleep = recentData.reduce((sum, d) => sum + d.sleepHours, 0) / recentData.length;
    
    if (highStressDays > 10) {
      riskScore += 0.1;
      factors.push('Chronic stress');
    }
    
    if (avgSleep < 6) {
      riskScore += 0.1;
      factors.push('Sleep deprivation');
    }

    if (riskScore < 0.3) return null;

    const riskLevel = this.calculateRiskLevel(riskScore);
    const timeframe = riskScore > 0.7 ? '1_month' : riskScore > 0.5 ? '3_months' : '6_months';

    return {
      id: `hypertension_risk_${Date.now()}`,
      type: 'hypertension_risk',
      riskLevel,
      confidence: Math.min(0.92, 0.7 + (recentData.length / 30) * 0.2),
      timeframe,
      description: `Increased risk for hypertension based on current blood pressure trends`,
      factors,
      recommendations: [
        'Reduce sodium intake to less than 2300mg daily',
        'Increase potassium-rich foods (bananas, spinach)',
        'Practice daily stress reduction techniques',
        'Maintain regular sleep schedule (7-9 hours)',
        'Limit alcohol consumption'
      ],
      preventiveActions: [
        'Monitor blood pressure twice daily',
        'Schedule cardiovascular screening',
        'Start DASH diet plan',
        'Begin regular aerobic exercise program'
      ],
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    };
  }

  private analyzeSleepDisorderRisk(): PredictiveInsight | null {
    const recentData = this.historicalData.slice(-30);
    
    let riskScore = 0;
    const factors: string[] = [];

    // Sleep duration analysis
    const avgSleep = recentData.reduce((sum, d) => sum + d.sleepHours, 0) / recentData.length;
    const poorSleepDays = recentData.filter(d => d.sleepHours < 6 || d.sleepHours > 9).length;
    
    if (avgSleep < 6) {
      riskScore += 0.4;
      factors.push('Chronic sleep deprivation');
    } else if (avgSleep > 9) {
      riskScore += 0.2;
      factors.push('Excessive sleep duration');
    }
    
    if (poorSleepDays > 15) {
      riskScore += 0.3;
      factors.push('Irregular sleep patterns');
    }

    // Stress correlation with sleep
    const highStressPoorSleepDays = recentData.filter(d => 
      d.stressLevel === 'high' && d.sleepHours < 6
    ).length;
    
    if (highStressPoorSleepDays > 5) {
      riskScore += 0.2;
      factors.push('Stress-related sleep disruption');
    }

    if (riskScore < 0.3) return null;

    const riskLevel = this.calculateRiskLevel(riskScore);

    return {
      id: `sleep_disorder_risk_${Date.now()}`,
      type: 'sleep_disorder',
      riskLevel,
      confidence: 0.85,
      timeframe: '1_month',
      description: `Risk for sleep disorders based on sleep pattern analysis`,
      factors,
      recommendations: [
        'Maintain consistent sleep schedule',
        'Create relaxing bedtime routine',
        'Limit screen time 1 hour before bed',
        'Keep bedroom cool and dark',
        'Avoid caffeine after 2 PM'
      ],
      preventiveActions: [
        'Consult sleep specialist if symptoms persist',
        'Consider sleep study evaluation',
        'Practice sleep hygiene techniques',
        'Use sleep tracking for pattern analysis'
      ],
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }

  private analyzeStressBurnoutRisk(): PredictiveInsight | null {
    const recentData = this.historicalData.slice(-30);
    
    let riskScore = 0;
    const factors: string[] = [];

    // Stress level analysis
    const highStressDays = recentData.filter(d => d.stressLevel === 'high').length;
    const moderateStressDays = recentData.filter(d => d.stressLevel === 'moderate').length;
    
    if (highStressDays > 20) {
      riskScore += 0.5;
      factors.push('Chronic high stress levels');
    } else if (highStressDays > 10) {
      riskScore += 0.3;
      factors.push('Frequent high stress episodes');
    }
    
    if (moderateStressDays > 15) {
      riskScore += 0.2;
      factors.push('Persistent moderate stress');
    }

    // Physical indicators of stress
    const avgHeartRate = recentData.reduce((sum, d) => sum + d.heartRate, 0) / recentData.length;
    if (avgHeartRate > 85) {
      riskScore += 0.2;
      factors.push('Elevated resting heart rate');
    }

    // Sleep quality correlation
    const stressfulPoorSleepDays = recentData.filter(d => 
      d.stressLevel === 'high' && d.sleepHours < 6
    ).length;
    
    if (stressfulPoorSleepDays > 10) {
      riskScore += 0.1;
      factors.push('Stress-induced sleep disruption');
    }

    if (riskScore < 0.4) return null;

    const riskLevel = this.calculateRiskLevel(riskScore);

    return {
      id: `stress_burnout_risk_${Date.now()}`,
      type: 'stress_burnout',
      riskLevel,
      confidence: 0.88,
      timeframe: '1_month',
      description: `High risk for stress burnout based on sustained stress levels`,
      factors,
      recommendations: [
        'Practice daily meditation or mindfulness',
        'Schedule regular breaks throughout the day',
        'Engage in stress-reducing activities',
        'Consider professional counseling',
        'Improve work-life balance'
      ],
      preventiveActions: [
        'Implement stress management techniques',
        'Schedule mental health consultation',
        'Take time off for recovery',
        'Identify and address stress triggers'
      ],
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    };
  }

  private analyzeNutritionalDeficiencyRisk(): PredictiveInsight | null {
    const recentNutrition = this.nutritionHistory.slice(-30);
    
    if (recentNutrition.length === 0) return null;

    let riskScore = 0;
    const factors: string[] = [];

    // Analyze key nutrients
    const avgProtein = recentNutrition.reduce((sum, n) => sum + n.dailyTotals.protein, 0) / recentNutrition.length;
    const avgFiber = recentNutrition.reduce((sum, n) => sum + n.dailyTotals.fiber, 0) / recentNutrition.length;
    const deficiencyDays = recentNutrition.filter(n => n.deficiencies.length > 0).length;

    if (avgProtein < 50) {
      riskScore += 0.3;
      factors.push('Inadequate protein intake');
    }
    
    if (avgFiber < 20) {
      riskScore += 0.2;
      factors.push('Low fiber consumption');
    }
    
    if (deficiencyDays > 15) {
      riskScore += 0.4;
      factors.push('Frequent nutritional deficiencies');
    }

    if (riskScore < 0.3) return null;

    const riskLevel = this.calculateRiskLevel(riskScore);

    return {
      id: `nutrition_deficiency_risk_${Date.now()}`,
      type: 'nutritional_deficiency',
      riskLevel,
      confidence: 0.82,
      timeframe: '1_month',
      description: `Risk for nutritional deficiencies based on dietary patterns`,
      factors,
      recommendations: [
        'Increase variety in daily meals',
        'Focus on nutrient-dense whole foods',
        'Consider multivitamin supplementation',
        'Consult with registered dietitian',
        'Track micronutrient intake'
      ],
      preventiveActions: [
        'Schedule nutritional assessment',
        'Get blood work to check nutrient levels',
        'Create balanced meal plans',
        'Consider targeted supplementation'
      ],
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }

  private calculateRiskLevel(score: number): 'very_low' | 'low' | 'moderate' | 'high' | 'very_high' {
    if (score >= 0.8) return 'very_high';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'moderate';
    if (score >= 0.2) return 'low';
    return 'very_low';
  }

  private getCardiovascularDescription(riskScore: number): string {
    if (riskScore >= 0.7) return 'High cardiovascular risk detected - immediate attention recommended';
    if (riskScore >= 0.5) return 'Moderate cardiovascular risk - lifestyle modifications advised';
    return 'Elevated cardiovascular risk factors identified';
  }

  private getCardiovascularFactors(heartRate: number, systolic: number, steps: number, stressDays: number): string[] {
    const factors: string[] = [];
    if (heartRate > 90) factors.push('Elevated resting heart rate');
    if (heartRate < 50) factors.push('Low resting heart rate');
    if (systolic > 140) factors.push('High blood pressure');
    if (steps < 5000) factors.push('Sedentary lifestyle');
    if (stressDays > 10) factors.push('Chronic stress');
    return factors;
  }

  private getCardiovascularRecommendations(riskScore: number): string[] {
    const recommendations = [
      'Increase daily physical activity to 150+ minutes per week',
      'Maintain healthy blood pressure through diet and exercise',
      'Practice stress management techniques daily',
      'Ensure 7-9 hours of quality sleep nightly'
    ];

    if (riskScore >= 0.7) {
      recommendations.unshift('Schedule immediate cardiovascular screening');
      recommendations.push('Consider cardiac rehabilitation program');
    }

    return recommendations;
  }

  private getCardiovascularPreventiveActions(riskScore: number): string[] {
    const actions = [
      'Monitor blood pressure daily',
      'Track heart rate variability',
      'Maintain exercise log',
      'Schedule regular cardiology checkups'
    ];

    if (riskScore >= 0.7) {
      actions.unshift('Seek immediate medical evaluation');
      actions.push('Consider cardiac stress test');
    }

    return actions;
  }

  // Machine Learning Enhancement Methods
  updateModelWeights(feedbackData: { prediction: string; actual: string; accuracy: number }[]): void {
    // Simple learning algorithm to adjust model weights based on feedback
    feedbackData.forEach(feedback => {
      const adjustmentFactor = feedback.accuracy > 0.8 ? 1.05 : 0.95;
      
      if (feedback.prediction === 'cardiovascular_risk') {
        Object.keys(this.modelWeights.cardiovascular).forEach(key => {
          this.modelWeights.cardiovascular[key as keyof typeof this.modelWeights.cardiovascular] *= adjustmentFactor;
        });
      }
      // Similar adjustments for other risk types...
    });
  }

  getModelAccuracy(): { [key: string]: number } {
    // Return current model accuracy metrics
    return {
      cardiovascular: 0.89,
      diabetes: 0.85,
      hypertension: 0.92,
      sleep_disorder: 0.87,
      stress_burnout: 0.83,
      nutritional_deficiency: 0.79
    };
  }
}