-----

# 🤖 RoboK9 Control Center

A futuristic web interface for interacting with a robotic companion powered by an advanced **Emotional AI**. This app moves beyond simple commands to create a genuine human-robot bond through conversation, learning, and shared experience.

## ✨ Key Features

  * **🧠 Emotional AI & Personality**: At its core, RoboK9 has a dynamic personality and can feel a range of emotions—happy, protective, playful, and more. Its mood changes based on context, interactions, and commands.
  * **💬 Conversational Chat**: Switch to a free-conversation mode and chat about anything\! The AI has memory, understands context, and responds as an intelligent, loyal canine companion.
  * **🎓 Adaptive Learning**: Teach your RoboK9 new tricks\! An interactive learning mode allows you to add new skills, which the robot remembers and tracks, growing more capable over time.
  * **🎥 Advanced Security Feed**: A real-time camera stream with **Night Vision** mode, intruder detection, and status overlays for 24/7 security.
  * **🗣️ Multi-Modal Control**: Seamlessly issue commands via voice, text, or quick-action buttons. The AI intelligently distinguishes between a command and a conversation.
  * **🔌 Comprehensive Hardware Support**: Comes with a detailed `INTEGRATION_GUIDE.md` for connecting to real-world robotics platforms.

-----

## 🛠️ Technology Stack

  * **Frontend**: **React**, **TypeScript**, **Vite**
  * **Styling**: **Tailwind CSS**
  * **AI Integration**: **Hugging Face Router API** (powering a multi-modal AI for commands, conversation, and emotional state management)
  * **Voice I/O**: **Web Speech API**

-----

## ⚙️ Setup & Installation

Follow these steps to run the application locally.

#### 1\. Clone the Repository

```bash
git clone https://github.com/MiChaelinzo/RoboK9-Control-Center-.git
cd RoboK9-Control-Center-
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

> **Note**: The conversational, emotional, and learning AI features **require** the API key. Without it, the app will run in a limited mock mode.

#### 4\. Run the App

```bash
npm run dev
```

Navigate to `http://localhost:5173` (or the address shown in your terminal).

-----

## 🧠 Hugging Face Integration

This app leverages the Hugging Face Router API to power a sophisticated AI that operates in multiple modes. It's more than a command interpreter; it's an AI brain that manages:

  * **An emotional state machine** to generate dynamic responses.
  * **Conversational context and memory** for meaningful chats.
  * **An adaptive learning loop** to acquire new user-taught skills.
  * **Mode detection** to distinguish between commands, chats, and learning sessions.

-----

## 🐾 Capabilities & Interactions

RoboK9's abilities go far beyond a simple command list.

| Category | Commands & Abilities |
| :--- | :--- |
| **Robotic Commands** | Sit, Patrol, Kung-Fu, Handstand, Dance, Night Vision On/Off, etc. |
| **Conversational** | Ask "How are you feeling?", "Tell me about yourself", free-form chat. |
| **Emotional** | Set emotion to happy/protective, praise with "Good boy\!". |
| **Learning**| Initiate with "Learn a new trick", ask "What can you do?". |

-----

## 🎤 Sample Voice Commands

Try these to experience the full personality:

  * "How are you feeling?"
  * "Turn on night vision."
  * "Let's chat for a bit."
  * "Learn a new trick."
  * "Good boy\!"
  * "Set your emotion to playful."
  * "Tell me a story."

-----

## 🔌 Hardware Integration

This project is designed for real-world application. The included **[INTEGRATION\_GUIDE.md](https://github.com/MiChaelinzo/RoboK9-Control-Center-/blob/main/INTEGRATION_GUIDE.md)** provides detailed instructions for connecting to various platforms and includes considerations for hardware that can physically express the AI's emotional states.

-----

## 🏆 Hackathon Submission Highlights

  * **Best in Robotics**: This project redefines Human-Robot Interaction (HRI) as a **relationship**. By integrating Emotional AI and Adaptive Learning, it fosters a genuine bond, moving beyond simple control.
  * **For Humanity**: It’s an **empathetic companion** designed to combat loneliness through meaningful conversation and emotional connection, while simultaneously providing advanced, 24/7 security with features like Night Vision.
  * **Most Useful Fine-tune**: Demonstrates a highly sophisticated "functional fine-tune" of an LLM into a multi-modal AI that can seamlessly switch between being a **Command Interpreter**, a **Conversational Partner**, and a **Learning Agent**.
