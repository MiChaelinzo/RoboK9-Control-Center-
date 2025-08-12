-----

# 🤖 RoboK9 Control Center

A futuristic web interface for controlling robotic companions through AI, voice, and live video. This app provides a seamless bridge between human intention and robotic action.

## ✨ Key Features

  * **🗣️ Multi-Modal Control**: Issue commands via **voice recognition**, a **text-based chat**, or pre-built **action buttons**.
  * **🧠 Advanced AI**: Powered by **Hugging Face GPT-OSS models** for sophisticated natural language understanding, turning conversational phrases into precise actions.
  * **🎥 Live Security Feed**: A real-time camera stream with an animated scanning overlay, **intruder detection alerts**, and a fullscreen view.
  * **🎵 Engaging Entertainment**: Command your RoboK9 to **tell stories**, **play music**, perform **dance routines**, or engage in interactive games.
  * **🔌 Comprehensive Hardware Support**: Comes with a detailed guide for integrating with real-world robotics platforms.
  * **📱 Responsive & Modern UI**: A sleek, dark-themed interface with glassmorphism effects that works flawlessly on both desktop and mobile.

-----

## 🛠️ Technology Stack

  * **Frontend**: **React**, **TypeScript**, **Vite**
  * **Styling**: **Tailwind CSS**
  * **AI Integration**: **Hugging Face Router API**
  * **Voice I/O**: **Web Speech API** (Speech Recognition & Synthesis)

-----

## ⚙️ Setup & Installation

Follow these steps to run the application locally.

#### 1\. Clone the Repository

```bash
git clone [<your-repo-url>](https://github.com/MiChaelinzo/RoboK9-Control-Center-.git)
cd <[your-repo-directory](RoboK9-Control-Center-)>
```

#### 2\. Install Dependencies

```bash
npm install
```

#### 3\. Configure Environment

Get your free API key from **[huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)**. Then, create a `.env` file in the project's root directory and add your key:

```
VITE_HUGGINGFACE_API_KEY='hf_your_actual_api_key_here'
```

> **Note**: The app includes a mock AI fallback and will still function without an API key, but natural language processing will be disabled.

#### 4\. Run the App

```bash
npm run dev
```

Navigate to `http://localhost:5173` (or the address shown in your terminal).

-----

## 🧠 Hugging Face Integration

This app leverages the Hugging Face Router API to process complex commands using powerful Large Language Models.

  * **Primary Model**: `openai/gpt-oss-120b:fireworks-ai`
  * **Fallback Model**: `openai/gpt-oss-20b:fireworks-ai`
  * **Endpoint**: `https://router.huggingface.co/v1`

This setup allows the app to interpret nuanced user requests with high accuracy and translate them into specific robotic actions.

-----

## 🐾 Available Commands

A wide range of commands are supported across several categories:

| Category | Commands |
| :--- | :--- |
| **Basic** | Sit, Surrender, Get Down, Greetings |
| **Movement** | Move Forward/Backward, Turn Left/Right, Stop/Halt |
| **Tricks & Fun** | Act Cute, Handshake, Handstand, Push-up, Urinate |
| **Advanced** | Swimming, Kung-Fu, Attack |
| **Security**| Patrol Mode, Scan for Intruders, Turn Camera On/Off |
| **Entertainment** | Play Story, Play Music, Dance, Play Games, Sleep Mode |

-----

## 🎤 Sample Voice Commands

Try saying:

  * "Turn on the camera and scan for intruders."
  * "Go forward and then turn left."
  * "Play some music and start dancing."
  * "Tell me a bedtime story."
  * "Good boy, act cute\!"

-----

## 🔌 Hardware Integration

This project is designed for real-world application. A comprehensive guide is included for connecting the interface to various robotics platforms:

  * **RapidPower RoboDog** (WiFi/REST API)
  * **Unitree Go1/A1** (UDP/SDK)
  * **Boston Dynamics Spot** (gRPC API)
  * **Generic Quadruped Robots** (MQTT/WebSocket/Serial)

For detailed instructions, see the **[INTEGRATION\_GUIDE.md](https://github.com/MiChaelinzo/RoboK9-Control-Center-/blob/main/INTEGRATION_GUIDE.md)** file.

-----

## 🏆 Hackathon Submission Highlights

This project excels in several key areas:

  * **Best in Robotics**: It directly addresses the challenge of intuitive Human-Robot Interaction (HRI) by making a complex robot controllable through natural language.
  * **For Humanity**: It's designed as a potential assistive technology for users with mobility impairments and can be adapted for safety applications like search-and-rescue.
  * **Most Useful Fine-tune**: It demonstrates a practical "functional fine-tune" of a general LLM, adapting it into a specialized engine for translating human speech into machine commands.
