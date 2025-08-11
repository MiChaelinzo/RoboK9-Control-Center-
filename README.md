# RoboK9 Control Center

A futuristic web application for controlling robotic dogs with AI-powered voice and text commands, built for hackathon submission.

## Features

- **AI-Powered Command Processing**: Integrated with Hugging Face GPT-OSS models (120B/20B)
- **Voice Recognition**: Real-time speech-to-text for hands-free control
- **Text Chat Interface**: Type commands naturally
- **Movement Controls**: Forward, backward, left, right, stop
- **Advanced Commands**: Sit, attack, patrol, tricks, and more
- **Real-time Status**: Battery, location, and activity monitoring
- **Responsive Design**: Works on desktop and mobile devices

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

## Voice Commands

Try saying:
- "Move forward"
- "Sit down"
- "Start patrol"
- "Act cute"
- "Stop moving"

## Technology Stack

- React + TypeScript
- Tailwind CSS
- Hugging Face Inference API
- Web Speech API
- Vite

## Hackathon Notes

This project demonstrates:
- Advanced AI integration with Hugging Face models
- Real-time voice processing
- Modern UI/UX design
- Responsive web application architecture
- Natural language command processing