import { HealthData, HealthAnomaly } from '../types';

export class AnomalyDetectionService {
  private static instance: AnomalyDetectionService;
  private baselineData: Map<string, number[]> = new Map();
  private thresholds = {
    heartRate: { min: 60, max: 100, criticalMin: 40, criticalMax: 150 },
    bloodPressure: { 
      systolic: { min: 90, max: 140, criticalMax: 180 },
      diastolic: { min: 60, max: 90, criticalMax: 110 }
    },
    bloodOxygen: { min: 95, criticalMin: 90 },
    stressLevel: { moderate: 60, high: 80, critical: 95 }
  };

  private constructor() {
    this.initializeBaselines();
  }

  static getInstance(): AnomalyDetectionService {
    if (!AnomalyDetectionService.instance) {
      AnomalyDetectionService.instance = new AnomalyDetectionService();
    }
    return AnomalyDetectionService.instance;
  }

  private initializeBaselines(): void {
    // Initialize with some baseline data for comparison
    this.baselineData.set('heartRate', [72, 68, 75, 70, 73, 69, 71]);
    this.baselineData.set('systolic', [120, 118, 122, 119, 121, 117, 120]);
    this.baselineData.set('diastolic', [80, 78, 82, 79, 81, 77, 80]);
    this.baselineData.set('bloodOxygen', [98, 97, 99, 98, 97, 98, 99]);
  }

  analyzeHealthData(currentData: HealthData): HealthAnomaly[] {
    const anomalies: HealthAnomaly[] = [];
    const timestamp = new Date();

    // Heart Rate Analysis
    const heartRateAnomalies = this.analyzeHeartRate(currentData.heartRate, timestamp);
    anomalies.push(...heartRateAnomalies);

    // Blood Pressure Analysis
    const bpAnomalies = this.analyzeBloodPressure(currentData.bloodPressure, timestamp);
    anomalies.push(...bpAnomalies);

    // Blood Oxygen Analysis
    const oxygenAnomalies = this.analyzeBloodOxygen(currentData.bloodOxygen, timestamp);
    anomalies.push(...oxygenAnomalies);

    // Stress Level Analysis
    const stressAnomalies = this.analyzeStressLevel(currentData.stressLevel, timestamp);
    anomalies.push(...stressAnomalies);

    // Pattern Analysis (looking for trends)
    const patternAnomalies = this.analyzePatterns(currentData, timestamp);
    anomalies.push(...patternAnomalies);

    // Update baseline data
    this.updateBaselines(currentData);

    return anomalies;
  }

  private analyzeHeartRate(heartRate: number, timestamp: Date): HealthAnomaly[] {
    const anomalies: HealthAnomaly[] = [];

    if (heartRate <= this.thresholds.heartRate.criticalMin) {
      anomalies.push({
        id: `hr_critical_low_${timestamp.getTime()}`,
        type: 'heart_rate_spike',
        severity: 'critical',
        detectedAt: timestamp,
        value: heartRate,
        normalRange: { min: this.thresholds.heartRate.min, max: this.thresholds.heartRate.max },
        description: 'Critical bradycardia detected - extremely low heart rate',
        actionTaken: false,
        resolved: false
      });
    } else if (heartRate >= this.thresholds.heartRate.criticalMax) {
      anomalies.push({
        id: `hr_critical_high_${timestamp.getTime()}`,
        type: 'heart_rate_spike',
        severity: 'critical',
        detectedAt: timestamp,
        value: heartRate,
        normalRange: { min: this.thresholds.heartRate.min, max: this.thresholds.heartRate.max },
        description: 'Critical tachycardia detected - extremely high heart rate',
        actionTaken: false,
        resolved: false
      });
    } else if (heartRate < this.thresholds.heartRate.min) {
      anomalies.push({
        id: `hr_low_${timestamp.getTime()}`,
        type: 'heart_rate_spike',
        severity: 'medium',
        detectedAt: timestamp,
        value: heartRate,
        normalRange: { min: this.thresholds.heartRate.min, max: this.thresholds.heartRate.max },
        description: 'Low heart rate detected',
        actionTaken: false,
        resolved: false
      });
    } else if (heartRate > this.thresholds.heartRate.max) {
      anomalies.push({
        id: `hr_high_${timestamp.getTime()}`,
        type: 'heart_rate_spike',
        severity: 'high',
        detectedAt: timestamp,
        value: heartRate,
        normalRange: { min: this.thresholds.heartRate.min, max: this.thresholds.heartRate.max },
        description: 'Elevated heart rate detected',
        actionTaken: false,
        resolved: false
      });
    }

    return anomalies;
  }

  private analyzeBloodPressure(bp: { systolic: number; diastolic: number }, timestamp: Date): HealthAnomaly[] {
    const anomalies: HealthAnomaly[] = [];

    // Systolic pressure analysis
    if (bp.systolic >= this.thresholds.bloodPressure.systolic.criticalMax) {
      anomalies.push({
        id: `bp_sys_critical_${timestamp.getTime()}`,
        type: 'blood_pressure_high',
        severity: 'critical',
        detectedAt: timestamp,
        value: bp.systolic,
        normalRange: { min: this.thresholds.bloodPressure.systolic.min, max: this.thresholds.bloodPressure.systolic.max },
        description: 'Hypertensive crisis - critically high systolic pressure',
        actionTaken: false,
        resolved: false
      });
    } else if (bp.systolic > this.thresholds.bloodPressure.systolic.max) {
      anomalies.push({
        id: `bp_sys_high_${timestamp.getTime()}`,
        type: 'blood_pressure_high',
        severity: 'high',
        detectedAt: timestamp,
        value: bp.systolic,
        normalRange: { min: this.thresholds.bloodPressure.systolic.min, max: this.thresholds.bloodPressure.systolic.max },
        description: 'High systolic blood pressure detected',
        actionTaken: false,
        resolved: false
      });
    }

    // Diastolic pressure analysis
    if (bp.diastolic >= this.thresholds.bloodPressure.diastolic.criticalMax) {
      anomalies.push({
        id: `bp_dia_critical_${timestamp.getTime()}`,
        type: 'blood_pressure_high',
        severity: 'critical',
        detectedAt: timestamp,
        value: bp.diastolic,
        normalRange: { min: this.thresholds.bloodPressure.diastolic.min, max: this.thresholds.bloodPressure.diastolic.max },
        description: 'Critically high diastolic pressure detected',
        actionTaken: false,
        resolved: false
      });
    } else if (bp.diastolic > this.thresholds.bloodPressure.diastolic.max) {
      anomalies.push({
        id: `bp_dia_high_${timestamp.getTime()}`,
        type: 'blood_pressure_high',
        severity: 'high',
        detectedAt: timestamp,
        value: bp.diastolic,
        normalRange: { min: this.thresholds.bloodPressure.diastolic.min, max: this.thresholds.bloodPressure.diastolic.max },
        description: 'High diastolic blood pressure detected',
        actionTaken: false,
        resolved: false
      });
    }

    return anomalies;
  }

  private analyzeBloodOxygen(oxygen: number, timestamp: Date): HealthAnomaly[] {
    const anomalies: HealthAnomaly[] = [];

    if (oxygen <= this.thresholds.bloodOxygen.criticalMin) {
      anomalies.push({
        id: `oxygen_critical_${timestamp.getTime()}`,
        type: 'oxygen_low',
        severity: 'critical',
        detectedAt: timestamp,
        value: oxygen,
        normalRange: { min: this.thresholds.bloodOxygen.min, max: 100 },
        description: 'Critical hypoxemia - dangerously low blood oxygen',
        actionTaken: false,
        resolved: false
      });
    } else if (oxygen < this.thresholds.bloodOxygen.min) {
      anomalies.push({
        id: `oxygen_low_${timestamp.getTime()}`,
        type: 'oxygen_low',
        severity: 'high',
        detectedAt: timestamp,
        value: oxygen,
        normalRange: { min: this.thresholds.bloodOxygen.min, max: 100 },
        description: 'Low blood oxygen saturation detected',
        actionTaken: false,
        resolved: false
      });
    }

    return anomalies;
  }

  private analyzeStressLevel(stressLevel: string, timestamp: Date): HealthAnomaly[] {
    const anomalies: HealthAnomaly[] = [];

    if (stressLevel === 'high') {
      // Convert stress level to numeric for analysis
      const stressValue = 85; // Simulated high stress value

      anomalies.push({
        id: `stress_high_${timestamp.getTime()}`,
        type: 'stress_critical',
        severity: 'medium',
        detectedAt: timestamp,
        value: stressValue,
        normalRange: { min: 0, max: 60 },
        description: 'High stress levels detected - consider relaxation techniques',
        actionTaken: false,
        resolved: false
      });
    }

    return anomalies;
  }

  private analyzePatterns(currentData: HealthData, timestamp: Date): HealthAnomaly[] {
    const anomalies: HealthAnomaly[] = [];

    // Check for irregular heart rhythm patterns
    const heartRateHistory = this.baselineData.get('heartRate') || [];
    if (heartRateHistory.length >= 3) {
      const recentVariability = this.calculateVariability(heartRateHistory.slice(-3));
      if (recentVariability > 20) {
        anomalies.push({
          id: `rhythm_irregular_${timestamp.getTime()}`,
          type: 'irregular_rhythm',
          severity: 'medium',
          detectedAt: timestamp,
          value: recentVariability,
          normalRange: { min: 0, max: 15 },
          description: 'Irregular heart rhythm pattern detected',
          actionTaken: false,
          resolved: false
        });
      }
    }

    return anomalies;
  }

  private calculateVariability(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private updateBaselines(currentData: HealthData): void {
    // Update heart rate baseline
    const heartRateHistory = this.baselineData.get('heartRate') || [];
    heartRateHistory.push(currentData.heartRate);
    if (heartRateHistory.length > 20) heartRateHistory.shift(); // Keep last 20 readings
    this.baselineData.set('heartRate', heartRateHistory);

    // Update blood pressure baselines
    const systolicHistory = this.baselineData.get('systolic') || [];
    systolicHistory.push(currentData.bloodPressure.systolic);
    if (systolicHistory.length > 20) systolicHistory.shift();
    this.baselineData.set('systolic', systolicHistory);

    const diastolicHistory = this.baselineData.get('diastolic') || [];
    diastolicHistory.push(currentData.bloodPressure.diastolic);
    if (diastolicHistory.length > 20) diastolicHistory.shift();
    this.baselineData.set('diastolic', diastolicHistory);

    // Update blood oxygen baseline
    const oxygenHistory = this.baselineData.get('bloodOxygen') || [];
    oxygenHistory.push(currentData.bloodOxygen);
    if (oxygenHistory.length > 20) oxygenHistory.shift();
    this.baselineData.set('bloodOxygen', oxygenHistory);
  }

  // Machine learning-based anomaly detection (simplified)
  detectAnomaliesML(currentData: HealthData): HealthAnomaly[] {
    const anomalies: HealthAnomaly[] = [];
    
    // Simple outlier detection using z-score
    const heartRateHistory = this.baselineData.get('heartRate') || [];
    if (heartRateHistory.length >= 10) {
      const mean = heartRateHistory.reduce((sum, val) => sum + val, 0) / heartRateHistory.length;
      const stdDev = Math.sqrt(
        heartRateHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / heartRateHistory.length
      );
      
      const zScore = Math.abs((currentData.heartRate - mean) / stdDev);
      
      if (zScore > 3) { // 3 standard deviations from mean
        anomalies.push({
          id: `ml_anomaly_${Date.now()}`,
          type: 'heart_rate_spike',
          severity: zScore > 4 ? 'critical' : 'high',
          detectedAt: new Date(),
          value: currentData.heartRate,
          normalRange: { min: mean - 2 * stdDev, max: mean + 2 * stdDev },
          description: `Statistical anomaly detected (z-score: ${zScore.toFixed(2)})`,
          actionTaken: false,
          resolved: false
        });
      }
    }

    return anomalies;
  }

  // Personalized thresholds based on user's historical data
  updatePersonalizedThresholds(userId: string, historicalData: HealthData[]): void {
    if (historicalData.length < 30) return; // Need sufficient data

    // Calculate personalized heart rate thresholds
    const heartRates = historicalData.map(d => d.heartRate);
    const hrMean = heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length;
    const hrStdDev = Math.sqrt(
      heartRates.reduce((sum, hr) => sum + Math.pow(hr - hrMean, 2), 0) / heartRates.length
    );

    this.thresholds.heartRate = {
      min: Math.max(40, hrMean - 2 * hrStdDev),
      max: Math.min(120, hrMean + 2 * hrStdDev),
      criticalMin: Math.max(30, hrMean - 3 * hrStdDev),
      criticalMax: Math.min(180, hrMean + 3 * hrStdDev)
    };

    console.log(`Updated personalized thresholds for user ${userId}:`, this.thresholds.heartRate);
  }
}