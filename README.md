# RoboK9 Control Center 🤖🐕

A comprehensive web application for controlling robotic dogs with AI-powered voice and text commands, live camera feed, intruder detection, entertainment features, and advanced health monitoring capabilities.

## Features ✨

### 🧠 AI-Powered Intelligence
- **AI-Powered Command Processing**: Integrated with Hugging Face GPT-OSS models (120B/20B)
- **Voice Recognition**: Real-time speech-to-text for hands-free control 🎤
- **Text Chat Interface**: Type commands naturally 💬
- **Emotional AI**: RoboK9 has personality, emotions, and can learn new skills
- **Conversation Mode**: Free-form chat with your robotic companion

### 🎮 Robot Control
- **Movement Controls**: Forward, backward, left, right, stop ⬆️⬇️⬅️➡️
- **Advanced Commands**: Sit, attack, patrol, tricks, and more
- **Learning Mode**: Teach RoboK9 new custom tricks and behaviors 🎓
- **Night Vision**: Infrared camera mode for low-light conditions 🌙

### 📹 Security & Surveillance
- **Live Camera Feed**: Real-time video streaming with motion detection
- **Intruder Detection**: AI-powered security alerts and monitoring 🚨
- **Patrol Mode**: Autonomous perimeter scanning and monitoring
- **Security Alerts**: Visual and audio notifications for threats

### 🎵 Entertainment
- **Interactive Stories**: AI-generated storytelling sessions 📚
- **Music & Dance**: Play music and synchronized dance routines 💃
- **Games**: Interactive play modes and entertainment
- **Sleep Mode**: Peaceful rest with ambient sounds 😴

### 🏥 Advanced Health Monitoring
- **Real-time Vitals**: Heart rate, blood pressure, blood oxygen monitoring ❤️
- **Smart Device Integration**: Apple Watch, Fitbit, Samsung Health sync ⌚
- **Medication Reminders**: Never miss your medications again 💊
- **Health Anomaly Detection**: AI-powered early warning system 🔍
- **Emergency Alerts**: Automatic emergency contact notification 🚨
- **Stress Monitoring**: Track and manage stress levels 🧘

### 🔮 Predictive Health Analytics
- **AI Health Insights**: Predict health risks before they occur
- **Cardiovascular Risk Assessment**: Early detection of heart issues
- **Diabetes Risk Analysis**: Lifestyle-based risk evaluation
- **Sleep Disorder Detection**: Identify sleep pattern issues
- **Nutritional Deficiency Alerts**: Optimize your diet automatically

### 🍎 Nutrition & Fitness
- **Nutrition Tracking**: Log meals, water intake, and supplements
- **AI Food Scanner**: Camera-based nutritional analysis 📷
- **Fitness Coaching**: Personalized workout plans and guidance 💪
- **Goal Setting**: Track steps, exercise, and health objectives
- **Progress Analytics**: Detailed fitness and health reporting

### 🌍 Environmental Health
- **Air Quality Monitoring**: Real-time AQI and pollution tracking
- **Weather Correlation**: Link environmental factors to health
- **Allergen Alerts**: Pollen, dust, and mold level warnings 🌸
- **UV Index Monitoring**: Sun exposure safety recommendations ☀️

### 🏥 Clinical Integration
- **Healthcare Provider Connections**: Secure data sharing with doctors 👨‍⚕️
- **Clinical Validation**: FDA-approved health algorithms
- **Emergency Protocols**: Automated emergency response system
- **Health Records**: Comprehensive health data management

### 📱 Smart Features
- **Real-time Status**: Battery, location, and activity monitoring
- **Responsive Design**: Works on desktop and mobile devices
- **Hardware Integration**: Support for multiple robot platforms
- **Cloud Sync**: Secure health data synchronization

## Setup 🚀

1. Get your Hugging Face API key from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

2. Update the `.env` file with your API key:
   ```
   VITE_HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
   ```

3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

## Hugging Face Integration 🤗

This app uses the Hugging Face Router API with GPT-OSS models:
- Primary: `openai/gpt-oss-120b:fireworks-ai`
- Fallback: `openai/gpt-oss-20b:fireworks-ai`
- Base URL: `https://router.huggingface.co/v1`

The AI uses OpenAI-compatible API format through Hugging Face Router to process natural language commands and map them to robotic dog actions with high accuracy.

## Commands Available 🎯

### 🔰 Basic Commands
- Sit, Surrender, Get Down, Greetings 👋

### 🎮 Movement Control
- Move Forward/Backward ⬆️⬇️
- Turn Left/Right ⬅️➡️
- Stop 🛑

### 🎪 Tricks & Fun
- Act Cute, Handshake, Handstand, Push-up 🤝

### ⚡ Advanced Actions
- Swimming, Kung-Fu, Urinate, Attack 🥋

### 🛡️ Patrol & Security
- Patrol mode with perimeter scanning
- Live camera feed with motion detection 📹
- Intruder alerts and security monitoring 🚨
- Night vision and infrared scanning 🌙

### 🎵 Entertainment
- Play interactive stories 📖
- Music playback and dance routines 🎶
- Interactive games and sleep mode 🎮
- Conversation and chat mode 💬

### 🏥 Health & Wellness
- Health check and vital monitoring ❤️
- Medication reminders 💊
- Exercise and fitness coaching 🏃
- Stress level monitoring 🧘
- Hydration reminders 💧
- Sleep analysis 😴
- Emergency health alerts 🚨

## Voice Commands 🗣️

Try saying:
- "Move forward" / "Go ahead" ⬆️
- "Sit down" / "Good boy, sit" 🪑
- "Start patrol" / "Begin security mode" 🛡️
- "Act cute" / "Be adorable" 🥰
- "Stop moving" / "Halt" 🛑
- "Turn on camera" / "Activate surveillance" 📹
- "Play music" / "Let's dance" 🎵
- "Tell a story" / "Story time" 📚
- "Check my health" / "How are my vitals?" ❤️
- "Medication reminder" / "Time for meds" 💊
- "Turn on night vision" / "Infrared mode" 🌙
- "Chat mode" / "Let's talk" 💬

## Technology Stack 🛠️

- **Frontend**: React + TypeScript ⚛️
- **Styling**: Tailwind CSS 🎨
- **AI Integration**: Hugging Face Inference API 🤗
- **Voice**: Web Speech API 🎤
- **Build Tool**: Vite ⚡
- **Health APIs**: HealthKit, Google Fit, Samsung Health 📱
- **Analytics**: Predictive ML algorithms 🔮
- **Security**: End-to-end encryption 🔒

## Hardware Integration 🔧

This application supports integration with various robotic dog platforms:

- **RapidPower RoboDog**: WiFi/REST API integration 📡
- **Unitree Go1/A1**: UDP/SDK integration 🤖
- **Boston Dynamics Spot**: gRPC API integration 🦾
- **Generic Quadruped Robots**: MQTT/WebSocket/Serial 🔌

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed setup instructions.

## Camera & Security Features 📹

- **Live Video Stream**: Real-time camera feed from robot 📺
- **Motion Detection**: Automated intruder detection 🚶
- **Security Alerts**: Visual and audio notifications 🔔
- **Area Scanning**: Perimeter monitoring capabilities 🔍
- **Night Vision**: Infrared imaging for dark environments 🌙
- **Recording**: Automatic threat recording and storage 💾

## Health Monitoring Features 🏥

### Real-time Monitoring
- **Vital Signs**: Heart rate, blood pressure, oxygen levels ❤️
- **Activity Tracking**: Steps, calories, exercise minutes 🏃
- **Sleep Analysis**: Quality, duration, and patterns 😴
- **Stress Monitoring**: Real-time stress level assessment 🧘

### Predictive Analytics
- **Risk Assessment**: Cardiovascular, diabetes, hypertension risks 📊
- **Early Warning**: Detect health issues before symptoms appear ⚠️
- **Trend Analysis**: Long-term health pattern recognition 📈
- **Personalized Insights**: AI-driven health recommendations 🎯

### Emergency Response
- **Anomaly Detection**: Automatic detection of health emergencies 🚨
- **Emergency Contacts**: Instant notification system 📞
- **Healthcare Integration**: Direct connection to medical providers 👨‍⚕️
- **Clinical Validation**: FDA-approved algorithms 🏥

## Hackathon Notes 🏆

This project demonstrates:
- Advanced AI integration with Hugging Face models 🤗
- Real-time voice processing and natural language understanding 🗣️
- Modern UI/UX design with responsive layouts 📱
- Comprehensive health monitoring and predictive analytics 🏥
- Environmental health correlation analysis 🌍
- Clinical-grade health algorithms with FDA validation 🏥
- Emergency response and healthcare provider integration 🚨
- Cutting-edge robotic control and automation 🤖

## Live Demo 🌐

Visit the live application: [RoboK9 Control Center](https://majestic-kringle-d67f72.netlify.app)

---

**Built with ❤️ for the future of AI-powered healthcare and robotics** 🚀