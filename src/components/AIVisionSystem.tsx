import React, { useRef, useEffect, useState } from 'react';
import { Camera, Eye, Brain, Activity, AlertTriangle, Zap } from 'lucide-react';
import { AdvancedAIService } from '../services/advancedAIService';

interface AIVisionSystemProps {
  isActive: boolean;
  onToggle: () => void;
}

interface DetectionResults {
  poses: any[];
  faces: any[];
  emotions: { [key: string]: number };
  activity: {
    name: string;
    confidence: number;
    calories: number;
    riskFactors: string[];
  };
  healthInsights: {
    posture: string;
    movement: string;
    engagement: string;
    alerts: string[];
  };
}

const AIVisionSystem: React.FC<AIVisionSystemProps> = ({ isActive, onToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectionResults, setDetectionResults] = useState<DetectionResults>({
    poses: [],
    faces: [],
    emotions: {},
    activity: { name: 'idle', confidence: 0, calories: 0, riskFactors: [] },
    healthInsights: { posture: 'unknown', movement: 'minimal', engagement: 'low', alerts: [] }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const aiService = AdvancedAIService.getInstance();

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive]);

  useEffect(() => {
    let animationFrame: number;
    
    if (isActive && stream) {
      const processFrame = async () => {
        if (videoRef.current && canvasRef.current && !isProcessing) {
          setIsProcessing(true);
          await analyzeFrame();
          setIsProcessing(false);
        }
        animationFrame = requestAnimationFrame(processFrame);
      };
      
      processFrame();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, stream, isProcessing]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const analyzeFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Detect poses
      const poses = await aiService.detectPose(video);
      
      // Detect faces
      const faces = await aiService.detectFaces(video);
      
      // Analyze emotions if faces detected
      let emotions = {};
      if (faces.length > 0) {
        const face = faces[0];
        if (face.keypoints) {
          const landmarks = face.keypoints.map((kp: any) => [kp.x, kp.y]).flat();
          const emotionResult = await aiService.recognizeEmotion(landmarks);
          emotions = emotionResult.emotions;
        }
      }

      // Analyze movement patterns
      const activity = await aiService.analyzeMovementPattern(poses);

      // Generate health insights
      const healthInsights = generateHealthInsights(poses, faces, emotions, activity);

      // Draw overlays
      drawDetectionOverlays(ctx, poses, faces, canvas.width, canvas.height);

      setDetectionResults({
        poses,
        faces,
        emotions,
        activity,
        healthInsights
      });

    } catch (error) {
      console.error('Frame analysis error:', error);
    }
  };

  const generateHealthInsights = (poses: any[], faces: any[], emotions: any, activity: any) => {
    const insights = {
      posture: 'unknown',
      movement: 'minimal',
      engagement: 'low',
      alerts: [] as string[]
    };

    // Posture analysis
    if (poses.length > 0) {
      const pose = poses[0];
      const keypoints = pose.keypoints;
      
      const leftShoulder = keypoints.find((kp: any) => kp.name === 'left_shoulder');
      const rightShoulder = keypoints.find((kp: any) => kp.name === 'right_shoulder');
      const nose = keypoints.find((kp: any) => kp.name === 'nose');

      if (leftShoulder && rightShoulder && nose) {
        const shoulderMidpoint = {
          x: (leftShoulder.x + rightShoulder.x) / 2,
          y: (leftShoulder.y + rightShoulder.y) / 2
        };

        const headForward = Math.abs(nose.x - shoulderMidpoint.x) > 30;
        const shouldersUneven = Math.abs(leftShoulder.y - rightShoulder.y) > 20;

        if (headForward) {
          insights.posture = 'forward head posture';
          insights.alerts.push('Forward head posture detected - adjust screen height');
        } else if (shouldersUneven) {
          insights.posture = 'uneven shoulders';
          insights.alerts.push('Uneven shoulders - check workspace ergonomics');
        } else {
          insights.posture = 'good alignment';
        }
      }
    }

    // Movement analysis
    if (activity.name !== 'idle') {
      insights.movement = activity.name;
      if (activity.riskFactors.length > 0) {
        insights.alerts.push(...activity.riskFactors);
      }
    }

    // Engagement analysis based on emotions
    const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b, ['neutral', 0]
    );

    if (dominantEmotion[1] > 0.6) {
      if (['happy', 'surprise'].includes(dominantEmotion[0])) {
        insights.engagement = 'high';
      } else if (['sad', 'angry', 'fear'].includes(dominantEmotion[0])) {
        insights.engagement = 'low';
        insights.alerts.push(`Detected ${dominantEmotion[0]} emotion - consider taking a break`);
      }
    }

    return insights;
  };

  const drawDetectionOverlays = (ctx: CanvasRenderingContext2D, poses: any[], faces: any[], width: number, height: number) => {
    // Draw pose keypoints
    poses.forEach(pose => {
      pose.keypoints.forEach((keypoint: any) => {
        if (keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#00ff00';
          ctx.fill();
        }
      });

      // Draw pose connections
      const connections = [
        ['left_shoulder', 'right_shoulder'],
        ['left_shoulder', 'left_elbow'],
        ['left_elbow', 'left_wrist'],
        ['right_shoulder', 'right_elbow'],
        ['right_elbow', 'right_wrist'],
        ['left_hip', 'right_hip'],
        ['left_shoulder', 'left_hip'],
        ['right_shoulder', 'right_hip'],
        ['left_hip', 'left_knee'],
        ['left_knee', 'left_ankle'],
        ['right_hip', 'right_knee'],
        ['right_knee', 'right_ankle']
      ];

      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;

      connections.forEach(([start, end]) => {
        const startPoint = pose.keypoints.find((kp: any) => kp.name === start);
        const endPoint = pose.keypoints.find((kp: any) => kp.name === end);

        if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          ctx.stroke();
        }
      });
    });

    // Draw face bounding boxes
    faces.forEach(face => {
      const { xMin, yMin, width: faceWidth, height: faceHeight } = face.box;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(xMin, yMin, faceWidth, faceHeight);
    });
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'text-green-400',
      sad: 'text-blue-400',
      angry: 'text-red-400',
      fear: 'text-purple-400',
      surprise: 'text-yellow-400',
      disgust: 'text-orange-400',
      neutral: 'text-slate-400'
    };
    return colors[emotion] || 'text-slate-400';
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="text-purple-400" size={20} />
          <h3 className="text-lg font-semibold text-white">AI Vision System</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <div className="flex items-center space-x-2 text-purple-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-xs">Processing</span>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isActive ? <Camera size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Feed */}
        <div className="relative">
          <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
            {isActive ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="absolute inset-0 w-full h-full"
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Eye className="mx-auto mb-2 text-slate-500" size={32} />
                  <p className="text-slate-400">AI Vision Inactive</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          {/* Activity Detection */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="text-green-400" size={16} />
              <span className="text-green-400 font-semibold">Activity Analysis</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Current Activity:</span>
                <span className="text-white capitalize">{detectionResults.activity.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Confidence:</span>
                <span className="text-white">{Math.round(detectionResults.activity.confidence * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Calories/min:</span>
                <span className="text-white">{detectionResults.activity.calories}</span>
              </div>
            </div>
          </div>

          {/* Emotion Detection */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="text-purple-400" size={16} />
              <span className="text-purple-400 font-semibold">Emotion Recognition</span>
            </div>
            <div className="space-y-2">
              {Object.entries(detectionResults.emotions).map(([emotion, confidence]) => (
                <div key={emotion} className="flex justify-between items-center">
                  <span className={`capitalize ${getEmotionColor(emotion)}`}>{emotion}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${getEmotionColor(emotion).replace('text-', 'bg-')}`}
                        style={{ width: `${(confidence as number) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-300 text-sm">{Math.round((confidence as number) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Insights */}
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="text-yellow-400" size={16} />
              <span className="text-yellow-400 font-semibold">Health Insights</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Posture:</span>
                <span className="text-white capitalize">{detectionResults.healthInsights.posture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Movement:</span>
                <span className="text-white capitalize">{detectionResults.healthInsights.movement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Engagement:</span>
                <span className="text-white capitalize">{detectionResults.healthInsights.engagement}</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {detectionResults.healthInsights.alerts.length > 0 && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="text-orange-400" size={16} />
                <span className="text-orange-400 font-semibold">Health Alerts</span>
              </div>
              <div className="space-y-1">
                {detectionResults.healthInsights.alerts.map((alert, index) => (
                  <div key={index} className="text-orange-300 text-sm">• {alert}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVisionSystem;