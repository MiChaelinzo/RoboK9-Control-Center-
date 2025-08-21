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

## Device Integration Setup 📱⌚

### Smartwatch Connection

#### Apple Watch (HealthKit) 🍎
1. **Enable HealthKit Integration:**
   - Open the RoboK9 app in your browser
   - Navigate to Health Monitor section
   - Click "Connect HealthKit" button
   - Grant permissions for:
     - Heart Rate ❤️
     - Steps 👣
     - Blood Pressure 🩺
     - Blood Oxygen 🫁
     - Sleep Analysis 😴
     - Workout Data 🏃

2. **iOS Shortcuts Setup:**
   ```
   Create iOS Shortcut → Add "Get Health Sample" 
   → Select data types → Run shortcut hourly
   ```

#### Samsung Galaxy Watch 🌟
1. **Samsung Health Integration:**
   - Install Samsung Health app
   - Enable data sharing in Privacy settings
   - Connect via Samsung Health API
   - Sync data: Heart rate, steps, sleep, stress

2. **Galaxy Watch Active Features:**
   - Continuous heart rate monitoring
   - Blood oxygen tracking (SpO2)
   - Sleep stage analysis
   - Stress level detection

#### Fitbit Integration 🏃‍♂️
1. **Fitbit Web API Setup:**
   - Register app at [dev.fitbit.com](https://dev.fitbit.com)
   - Get Client ID and Secret
   - OAuth 2.0 authentication flow
   - Sync: Heart rate, activity, sleep data

2. **Supported Fitbit Devices:**
   - Fitbit Sense (ECG, stress, SpO2)
   - Fitbit Versa series
   - Fitbit Charge series
   - Fitbit Inspire series

### Environmental Sensors 🌍

#### Air Quality Monitors

**PurpleAir Sensors 💜**
```bash
# Get your sensor ID from map.purpleair.com
API_KEY=your_purpleair_api_key
SENSOR_ID=your_sensor_id
```
- Real-time PM2.5, PM10 data
- Temperature and humidity
- Air quality index (AQI)

**IQAir AirVisual 🌬️**
```bash
# Register at airvisual.com/api
IQAIR_API_KEY=your_iqair_api_key
LOCATION=your_city_name
```
- Professional-grade AQI data
- Pollution forecasts
- Health recommendations

**Awair Element 🏠**
```bash
# Local network integration
AWAIR_DEVICE_IP=192.168.1.xxx
AWAIR_TOKEN=your_device_token
```
- Indoor air quality monitoring
- CO2, VOCs, particulates
- Temperature, humidity, noise

#### Weather Stations ⛅

**Davis Vantage Pro2 🌡️**
- Professional weather monitoring
- UV index, solar radiation
- Wind speed and direction
- Barometric pressure trends

**Ambient Weather WS-2902 📊**
- WiFi-enabled weather station
- Real-time data to cloud
- Lightning detection
- Soil temperature sensors

### Smart Home Integration 🏡

#### Philips Hue (Circadian Lighting) 💡
```javascript
// Auto-adjust lighting based on health data
if (stressLevel === 'high') {
  setLighting('warm', 'dim');
} else if (sleepTime) {
  setLighting('red', 'minimal');
}
```

#### Nest Thermostat 🌡️
- Temperature optimization for sleep
- Humidity control for respiratory health
- Energy-efficient climate management

#### Smart Air Purifiers 🌪️
- Dyson Pure series integration
- Auto-activation on poor AQI
- HEPA filtration control

### Medical Device Integration 🏥

#### Blood Pressure Monitors
**Omron HeartGuide 📱**
- Wearable BP monitoring
- Bluetooth connectivity
- Irregular heartbeat detection

**Withings BPM Connect 🔗**
- WiFi-enabled BP cuff
- Automatic data sync
- Multi-user support

#### Glucose Monitors (for Diabetics)
**Dexcom G6 CGM 📈**
- Continuous glucose monitoring
- Real-time alerts
- Trend analysis

**FreeStyle Libre 🩸**
- Flash glucose monitoring
- 14-day sensor wear
- Smartphone integration

### Setup Instructions by Device Type 🔧

#### For iOS Users (iPhone + Apple Watch)
1. **Health App Permissions:**
   ```
   Settings → Privacy & Security → Health → RoboK9 App
   Enable: All Categories → Allow
   ```

2. **Automatic Sync Setup:**
   - Background App Refresh: ON
   - Location Services: ON (for environmental data)
   - Notifications: ON (for health alerts)

#### For Android Users (Samsung/Wear OS)
1. **Google Fit Integration:**
   ```
   Google Fit → Settings → Connected Apps
   Add RoboK9 → Grant Permissions
   ```

2. **Samsung Health Setup:**
   ```
   Samsung Health → Settings → Permissions
   Third-party Apps → Add RoboK9
   ```

#### Environmental Sensor Network
1. **Create Sensor Dashboard:**
   - Register devices on manufacturer platforms
   - Get API keys for each service
   - Configure location-based monitoring

2. **Data Correlation Setup:**
   ```javascript
   // Example: Link air quality to respiratory symptoms
   if (aqi > 100 && symptoms.includes('cough')) {
     sendAlert('High AQI may be affecting your respiratory health');
   }
   ```

### Troubleshooting Device Connections 🔧

**Common Issues:**
- **Bluetooth Connection:** Restart both devices, clear Bluetooth cache
- **WiFi Sensors:** Check network connectivity, firewall settings
- **API Limits:** Monitor rate limits, upgrade plans if needed
- **Battery Life:** Enable power-saving modes on wearables

**Data Sync Problems:**
- Force sync in device apps
- Check internet connectivity
- Verify API credentials
- Clear app cache and restart

### Privacy & Security 🔒
- All health data encrypted in transit and at rest
- HIPAA-compliant data handling
- User controls data sharing permissions
- Regular security audits and updates
- Option to store data locally only

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
