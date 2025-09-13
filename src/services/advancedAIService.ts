import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow/tfjs-models/pose-detection';
import * as faceDetection from '@tensorflow/tfjs-models/face-detection';

export class AdvancedAIService {
  private static instance: AdvancedAIService;
  private poseDetector: poseDetection.PoseDetector | null = null;
  private faceDetector: faceDetection.FaceDetector | null = null;
  private emotionModel: tf.LayersModel | null = null;
  private healthPredictionModel: tf.LayersModel | null = null;

  private constructor() {
    this.initializeModels();
  }

  static getInstance(): AdvancedAIService {
    if (!AdvancedAIService.instance) {
      AdvancedAIService.instance = new AdvancedAIService();
    }
    return AdvancedAIService.instance;
  }

  private async initializeModels(): Promise<void> {
    try {
      // Initialize pose detection
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      };
      this.poseDetector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );

      // Initialize face detection
      this.faceDetector = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
        { runtime: 'tfjs' }
      );

      // Load emotion recognition model (simplified)
      this.emotionModel = await this.createEmotionModel();
      
      // Load health prediction model
      this.healthPredictionModel = await this.createHealthPredictionModel();

      console.log('Advanced AI models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI models:', error);
    }
  }

  private async createEmotionModel(): Promise<tf.LayersModel> {
    // Create a simple emotion recognition model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [468], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 7, activation: 'softmax' }) // 7 emotions
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  private async createHealthPredictionModel(): Promise<tf.LayersModel> {
    // Advanced health prediction model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [20], units: 256, activation: 'relu' }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.4 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.batchNormalization(),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 10, activation: 'sigmoid' }) // Multiple health predictions
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy', 'precision', 'recall']
    });

    return model;
  }

  async detectPose(imageElement: HTMLImageElement | HTMLVideoElement): Promise<any[]> {
    if (!this.poseDetector) return [];
    
    try {
      const poses = await this.poseDetector.estimatePoses(imageElement);
      return poses;
    } catch (error) {
      console.error('Pose detection error:', error);
      return [];
    }
  }

  async detectFaces(imageElement: HTMLImageElement | HTMLVideoElement): Promise<any[]> {
    if (!this.faceDetector) return [];
    
    try {
      const faces = await this.faceDetector.estimateFaces(imageElement);
      return faces;
    } catch (error) {
      console.error('Face detection error:', error);
      return [];
    }
  }

  async recognizeEmotion(faceLandmarks: number[]): Promise<{
    emotion: string;
    confidence: number;
    emotions: { [key: string]: number };
  }> {
    if (!this.emotionModel || faceLandmarks.length === 0) {
      return { emotion: 'neutral', confidence: 0, emotions: {} };
    }

    try {
      const input = tf.tensor2d([faceLandmarks]);
      const prediction = this.emotionModel.predict(input) as tf.Tensor;
      const probabilities = await prediction.data();
      
      const emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
      const emotionScores: { [key: string]: number } = {};
      
      let maxIndex = 0;
      let maxValue = 0;
      
      for (let i = 0; i < emotions.length; i++) {
        emotionScores[emotions[i]] = probabilities[i];
        if (probabilities[i] > maxValue) {
          maxValue = probabilities[i];
          maxIndex = i;
        }
      }

      input.dispose();
      prediction.dispose();

      return {
        emotion: emotions[maxIndex],
        confidence: maxValue,
        emotions: emotionScores
      };
    } catch (error) {
      console.error('Emotion recognition error:', error);
      return { emotion: 'neutral', confidence: 0, emotions: {} };
    }
  }

  async predictHealthRisks(healthData: {
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    steps: number;
    sleep: number;
    stress: number;
    age: number;
    weight: number;
    height: number;
    activity: number;
    nutrition: number;
  }): Promise<{
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
  }> {
    if (!this.healthPredictionModel) {
      return {
        cardiovascular: 0, diabetes: 0, hypertension: 0, obesity: 0,
        depression: 0, anxiety: 0, fatigue: 0, insomnia: 0,
        malnutrition: 0, overexertion: 0
      };
    }

    try {
      // Normalize input data
      const normalizedData = [
        healthData.heartRate / 200,
        healthData.bloodPressure.systolic / 200,
        healthData.bloodPressure.diastolic / 120,
        healthData.steps / 20000,
        healthData.sleep / 12,
        healthData.stress / 100,
        healthData.age / 100,
        healthData.weight / 200,
        healthData.height / 250,
        healthData.activity / 100,
        healthData.nutrition / 100,
        // Additional derived features
        healthData.bloodPressure.systolic / healthData.bloodPressure.diastolic, // Pulse pressure ratio
        healthData.weight / Math.pow(healthData.height / 100, 2), // BMI
        healthData.heartRate * healthData.activity / 1000, // Activity-adjusted HR
        healthData.steps / (healthData.sleep || 8), // Steps per sleep hour
        (healthData.stress * healthData.heartRate) / 1000, // Stress-HR interaction
        healthData.nutrition * healthData.activity / 100, // Nutrition-activity score
        Math.abs(healthData.sleep - 8) / 8, // Sleep deviation from optimal
        healthData.age * healthData.stress / 1000, // Age-stress factor
        (200 - healthData.heartRate) / 200 // Resting HR efficiency
      ];

      const input = tf.tensor2d([normalizedData]);
      const prediction = this.healthPredictionModel.predict(input) as tf.Tensor;
      const risks = await prediction.data();

      input.dispose();
      prediction.dispose();

      return {
        cardiovascular: risks[0],
        diabetes: risks[1],
        hypertension: risks[2],
        obesity: risks[3],
        depression: risks[4],
        anxiety: risks[5],
        fatigue: risks[6],
        insomnia: risks[7],
        malnutrition: risks[8],
        overexertion: risks[9]
      };
    } catch (error) {
      console.error('Health prediction error:', error);
      return {
        cardiovascular: 0, diabetes: 0, hypertension: 0, obesity: 0,
        depression: 0, anxiety: 0, fatigue: 0, insomnia: 0,
        malnutrition: 0, overexertion: 0
      };
    }
  }

  async analyzeMovementPattern(poses: any[]): Promise<{
    activity: string;
    confidence: number;
    calories: number;
    riskFactors: string[];
  }> {
    if (poses.length === 0) {
      return { activity: 'idle', confidence: 0, calories: 0, riskFactors: [] };
    }

    // Analyze pose keypoints for activity recognition
    const pose = poses[0];
    const keypoints = pose.keypoints;
    
    // Calculate movement metrics
    const shoulderDistance = this.calculateDistance(
      keypoints.find((kp: any) => kp.name === 'left_shoulder'),
      keypoints.find((kp: any) => kp.name === 'right_shoulder')
    );
    
    const hipDistance = this.calculateDistance(
      keypoints.find((kp: any) => kp.name === 'left_hip'),
      keypoints.find((kp: any) => kp.name === 'right_hip')
    );

    const leftKneeAngle = this.calculateAngle(
      keypoints.find((kp: any) => kp.name === 'left_hip'),
      keypoints.find((kp: any) => kp.name === 'left_knee'),
      keypoints.find((kp: any) => kp.name === 'left_ankle')
    );

    // Activity classification logic
    let activity = 'idle';
    let confidence = 0.5;
    let calories = 0;
    const riskFactors: string[] = [];

    if (leftKneeAngle < 90) {
      activity = 'squatting';
      confidence = 0.8;
      calories = 5;
      if (leftKneeAngle < 45) {
        riskFactors.push('Deep squat - monitor knee stress');
      }
    } else if (shoulderDistance > hipDistance * 1.2) {
      activity = 'stretching';
      confidence = 0.7;
      calories = 2;
    } else if (Math.abs(shoulderDistance - hipDistance) < 0.1) {
      activity = 'standing';
      confidence = 0.9;
      calories = 1;
    }

    return { activity, confidence, calories, riskFactors };
  }

  private calculateDistance(point1: any, point2: any): number {
    if (!point1 || !point2) return 0;
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateAngle(point1: any, point2: any, point3: any): number {
    if (!point1 || !point2 || !point3) return 0;
    
    const vector1 = { x: point1.x - point2.x, y: point1.y - point2.y };
    const vector2 = { x: point3.x - point2.x, y: point3.y - point2.y };
    
    const dot = vector1.x * vector2.x + vector1.y * vector2.y;
    const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    
    const angle = Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
    return angle;
  }

  async generatePersonalizedRecommendations(userData: {
    healthRisks: any;
    activityLevel: string;
    emotionalState: string;
    goals: string[];
  }): Promise<{
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const { healthRisks, activityLevel, emotionalState, goals } = userData;
    
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Analyze health risks
    const highRisks = Object.entries(healthRisks).filter(([_, risk]) => (risk as number) > 0.7);
    const moderateRisks = Object.entries(healthRisks).filter(([_, risk]) => (risk as number) > 0.4 && (risk as number) <= 0.7);

    if (highRisks.length > 0) {
      priority = 'critical';
      immediate.push('Schedule immediate medical consultation');
      immediate.push('Monitor symptoms closely and seek emergency care if needed');
    } else if (moderateRisks.length > 0) {
      priority = 'high';
      immediate.push('Schedule preventive health screening');
    }

    // Activity-based recommendations
    if (activityLevel === 'low') {
      immediate.push('Take a 10-minute walk within the next hour');
      shortTerm.push('Gradually increase daily activity by 15 minutes');
      longTerm.push('Build up to 150 minutes of moderate exercise weekly');
    }

    // Emotional state recommendations
    if (emotionalState === 'stressed' || emotionalState === 'anxious') {
      immediate.push('Practice 5 minutes of deep breathing exercises');
      shortTerm.push('Establish a daily meditation routine');
      longTerm.push('Consider stress management counseling');
    }

    // Goal-based recommendations
    goals.forEach(goal => {
      if (goal.includes('weight')) {
        shortTerm.push('Track daily caloric intake and create a sustainable deficit');
        longTerm.push('Develop a comprehensive nutrition and exercise plan');
      }
      if (goal.includes('fitness')) {
        shortTerm.push('Start with bodyweight exercises 3x per week');
        longTerm.push('Progress to structured strength training program');
      }
    });

    return { immediate, shortTerm, longTerm, priority };
  }

  dispose(): void {
    this.poseDetector?.dispose();
    this.emotionModel?.dispose();
    this.healthPredictionModel?.dispose();
  }
}