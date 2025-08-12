# RoboK9 Integration Guide

## Hardware Integration for Programmable Robot Dogs

This guide explains how to integrate the RoboK9 Control Center with physical robotic dogs like RapidPower RoboDog, Unitree Go1, Boston Dynamics Spot, and other programmable quadruped robots.

## Supported Robot Platforms

### 1. RapidPower RoboDog
- **Connection**: WiFi/Ethernet
- **API**: REST API endpoints
- **SDK**: Python/C++ SDK available
- **Commands**: Full movement and trick support

### 2. Unitree Go1/A1
- **Connection**: UDP/TCP over WiFi
- **API**: Unitree SDK
- **Programming**: C++/Python
- **Features**: Advanced locomotion, camera integration

### 3. Boston Dynamics Spot
- **Connection**: gRPC API
- **SDK**: Spot SDK (Python)
- **Authentication**: OAuth 2.0
- **Capabilities**: Enterprise-grade features

### 4. Generic Quadruped Robots
- **Connection**: Serial/WiFi/Bluetooth
- **Protocols**: MQTT, WebSocket, HTTP
- **Standards**: ROS (Robot Operating System)

## Integration Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Web App       │    │   Bridge     │    │   Robot Dog     │
│   (Frontend)    │◄──►│   Server     │◄──►│   Hardware      │
│                 │    │   (Node.js)  │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/robotic-dog-control
cd robotic-dog-control
```

### Step 2: Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend bridge server dependencies
cd bridge-server
npm install
```

### Step 3: Configure Robot Connection

Create a `robot-config.json` file:

```json
{
  "robotType": "rapidpower", // or "unitree", "spot", "generic"
  "connection": {
    "type": "wifi", // or "ethernet", "serial", "bluetooth"
    "host": "192.168.1.100",
    "port": 8080,
    "baudRate": 115200, // for serial connections
    "apiKey": "your-robot-api-key"
  },
  "capabilities": {
    "movement": true,
    "camera": true,
    "audio": true,
    "sensors": true
  }
}
```

### Step 4: Set Up Bridge Server

The bridge server translates web commands to robot-specific protocols:

```javascript
// bridge-server/index.js
const express = require('express');
const WebSocket = require('ws');
const RobotController = require('./controllers/RobotController');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

// Initialize robot controller based on config
const robot = new RobotController(require('./robot-config.json'));

// WebSocket connection for real-time commands
wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const command = JSON.parse(message);
    const result = await robot.executeCommand(command);
    ws.send(JSON.stringify(result));
  });
});

app.listen(3001, () => {
  console.log('Bridge server running on port 3001');
});
```

## Robot-Specific Integration

### RapidPower RoboDog Integration

```python
# rapidpower_controller.py
import requests
import json

class RapidPowerController:
    def __init__(self, host, port):
        self.base_url = f"http://{host}:{port}/api/v1"
    
    def execute_command(self, command):
        endpoint_map = {
            'sit': '/commands/sit',
            'move_forward': '/movement/forward',
            'move_backward': '/movement/backward',
            'turn_left': '/movement/turn_left',
            'turn_right': '/movement/turn_right',
            'attack': '/actions/attack',
            'patrol': '/actions/patrol',
            'dance': '/entertainment/dance',
            'play_music': '/entertainment/music'
        }
        
        endpoint = endpoint_map.get(command['id'])
        if endpoint:
            response = requests.post(f"{self.base_url}{endpoint}", 
                                   json=command['parameters'])
            return response.json()
        
        return {"status": "error", "message": "Command not supported"}
    
    def get_camera_feed(self):
        response = requests.get(f"{self.base_url}/camera/stream")
        return response.content
    
    def get_status(self):
        response = requests.get(f"{self.base_url}/status")
        return response.json()
```

### Unitree Go1 Integration

```cpp
// unitree_controller.cpp
#include "unitree_legged_sdk/unitree_legged_sdk.h"

class UnitreeController {
private:
    UNITREE_LEGGED_SDK::UDP udp;
    UNITREE_LEGGED_SDK::HighCmd cmd = {0};
    UNITREE_LEGGED_SDK::HighState state = {0};

public:
    UnitreeController() {
        udp.InitCmdData(cmd);
    }
    
    void executeCommand(const std::string& command) {
        if (command == "sit") {
            cmd.mode = 1;
            cmd.gaitType = 0;
        } else if (command == "move_forward") {
            cmd.mode = 2;
            cmd.velocity[0] = 0.5f; // forward velocity
        } else if (command == "turn_left") {
            cmd.mode = 2;
            cmd.yawSpeed = 0.5f; // turn left
        }
        // Add more command mappings
        
        udp.SetSend(cmd);
        udp.Send();
    }
    
    void getStatus() {
        udp.Recv();
        udp.GetRecv(state);
        // Process state data
    }
};
```

### Boston Dynamics Spot Integration

```python
# spot_controller.py
import bosdyn.client
from bosdyn.client.robot_command import RobotCommandClient
from bosdyn.client.robot_state import RobotStateClient

class SpotController:
    def __init__(self, hostname, username, password):
        self.sdk = bosdyn.client.create_standard_sdk('RoboK9Controller')
        self.robot = self.sdk.create_robot(hostname)
        self.robot.authenticate(username, password)
        
        self.command_client = self.robot.ensure_client(
            RobotCommandClient.default_service_name)
        self.state_client = self.robot.ensure_client(
            RobotStateClient.default_service_name)
    
    def execute_command(self, command):
        if command['id'] == 'sit':
            sit_command = RobotCommandBuilder.synchro_sit_command()
            self.command_client.robot_command(sit_command)
        elif command['id'] == 'move_forward':
            # Implement movement commands
            pass
        # Add more command implementations
    
    def get_camera_feed(self):
        # Implement camera feed retrieval
        pass
```

## Camera Integration

### Real-time Video Streaming

```javascript
// camera-stream.js
const cv = require('opencv4nodejs');

class CameraStream {
    constructor(robotController) {
        this.robot = robotController;
        this.cap = new cv.VideoCapture(0); // or robot camera endpoint
    }
    
    startStream(ws) {
        setInterval(() => {
            const frame = this.cap.read();
            if (!frame.empty) {
                const encoded = cv.imencode('.jpg', frame);
                ws.send(encoded, { binary: true });
            }
        }, 33); // ~30 FPS
    }
    
    detectIntruders(frame) {
        // Implement person detection using OpenCV or TensorFlow
        const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
        const detections = classifier.detectMultiScale(frame);
        return detections.objects.length > 0;
    }
}
```

## Command Mapping

### Standard Command Protocol

```json
{
  "id": "move_forward",
  "parameters": {
    "speed": 0.5,
    "duration": 2000,
    "direction": "forward"
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "priority": "normal"
}
```

### Robot Response Format

```json
{
  "commandId": "move_forward",
  "status": "completed",
  "executionTime": 2000,
  "robotState": {
    "position": [0, 0, 0],
    "orientation": [0, 0, 0],
    "battery": 85,
    "sensors": {
      "temperature": 35,
      "humidity": 60
    }
  },
  "timestamp": "2024-01-01T12:00:02Z"
}
```

## Security Considerations

### 1. Authentication
- Implement OAuth 2.0 or API key authentication
- Use HTTPS/WSS for all communications
- Rotate API keys regularly

### 2. Network Security
- Set up VPN for remote access
- Use firewall rules to restrict access
- Monitor network traffic

### 3. Command Validation
- Validate all incoming commands
- Implement rate limiting
- Log all command executions

## Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000 8080
CMD ["npm", "start"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  web-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ROBOT_HOST=robot-bridge
      - ROBOT_PORT=8080
  
  robot-bridge:
    build: ./bridge-server
    ports:
      - "8080:8080"
    volumes:
      - ./robot-config.json:/app/robot-config.json
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0  # for serial connections
```

## Testing

### Unit Tests

```javascript
// tests/robot-controller.test.js
const RobotController = require('../controllers/RobotController');

describe('RobotController', () => {
  test('should execute sit command', async () => {
    const controller = new RobotController(mockConfig);
    const result = await controller.executeCommand({ id: 'sit' });
    expect(result.status).toBe('completed');
  });
});
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Test robot connection
npm run test:connection

# Test camera feed
npm run test:camera
```

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check network connectivity
   - Verify robot IP address and port
   - Ensure firewall allows connections

2. **Command Not Executing**
   - Verify command format
   - Check robot capabilities
   - Review error logs

3. **Camera Feed Issues**
   - Check camera permissions
   - Verify video codec support
   - Test bandwidth requirements

### Debug Mode

```bash
# Enable debug logging
DEBUG=robot:* npm start

# View real-time logs
tail -f logs/robot-controller.log
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add robot-specific controllers
4. Write tests
5. Submit a pull request

## Support

- **Documentation**: [docs.robotic-dog-control.com](https://docs.robotic-dog-control.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/robotic-dog-control/issues)
- **Discord**: [Community Server](https://discord.gg/robotic-dogs)
- **Email**: support@robotic-dog-control.com

## License

MIT License - see LICENSE file for details.