# RoboK9 Control Center

A comprehensive web application for controlling robotic dogs with AI-powered voice and text commands, live camera feed, intruder detection, and entertainment features.

## Features

- **AI-Powered Command Processing**: Integrated with Hugging Face GPT-OSS models (120B/20B)
- **Voice Recognition**: Real-time speech-to-text for hands-free control
- **Text Chat Interface**: Type commands naturally
- **Movement Controls**: Forward, backward, left, right, stop
- **Advanced Commands**: Sit, attack, patrol, tricks, and more
- **Live Camera Feed**: Real-time video streaming with motion detection
- **Intruder Detection**: AI-powered security alerts and monitoring
- **Entertainment Features**: Play stories, music, dance routines, games
- **Real-time Status**: Battery, location, and activity monitoring
- **Responsive Design**: Works on desktop and mobile devices
- **Hardware Integration**: Support for multiple robot platforms

## Setup

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

## Hugging Face Integration

This app uses the Hugging Face Router API with GPT-OSS models:
- Primary: `openai/gpt-oss-120b:fireworks-ai`
- Fallback: `openai/gpt-oss-20b:fireworks-ai`
- Base URL: `https://router.huggingface.co/v1`

The AI uses OpenAI-compatible API format through Hugging Face Router to process natural language commands and map them to robotic dog actions with high accuracy.

## Commands Available

### Basic Commands
- Sit, Surrender, Get Down, Greetings

### Movement Control
- Move Forward/Backward
- Turn Left/Right
- Stop

### Tricks & Fun
- Act Cute, Handshake, Handstand, Push-up

### Advanced Actions
- Swimming, Kung-Fu, Urinate, Attack

### Patrol & Security
- Patrol mode with perimeter scanning
- Live camera feed with motion detection
- Intruder alerts and security monitoring

### Entertainment
- Play interactive stories
- Music playback and dance routines
- Interactive games and sleep mode

## Voice Commands

Try saying:
- "Move forward"
- "Sit down"
- "Start patrol"
- "Act cute"
- "Stop moving"
- "Turn on camera"
- "Play music"
- "Tell a story"

## Technology Stack

- React + TypeScript
- Tailwind CSS
- Hugging Face Inference API
- Web Speech API
- Vite

## Hardware Integration

This application supports integration with various robotic dog platforms:

- **RapidPower RoboDog**: WiFi/REST API integration
- **Unitree Go1/A1**: UDP/SDK integration  
- **Boston Dynamics Spot**: gRPC API integration
- **Generic Quadruped Robots**: MQTT/WebSocket/Serial

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed setup instructions.

## Camera & Security Features

- **Live Video Stream**: Real-time camera feed from robot
- **Motion Detection**: Automated intruder detection
- **Security Alerts**: Visual and audio notifications
- **Area Scanning**: Perimeter monitoring capabilities

## Hackathon Notes

This project demonstrates:
- Advanced AI integration with Hugging Face models
- Real-time voice processing
- Modern UI/UX design
- Responsive web application architecture