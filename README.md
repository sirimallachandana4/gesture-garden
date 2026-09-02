# 🌸 Gesture Garden

> **Bring your hands to life.**

Gesture Garden is an interactive browser-based creative experience that uses your webcam and real-time hand tracking to turn natural hand movements into digital art.

Move your index finger through the air to grow flowers, open your palm to release them into the scene, or switch to Write mode and draw letters and names using your finger.

No mouse is required for the creative interactions.

---

## ✨ Features

### 🌸 Flower Garden

Create a living digital garden using your hand.

- ☝️ Move your index finger to continuously grow flowers
- 🌸 Flowers appear naturally along your finger path
- ✋ Open your palm to release the flowers
- 🌬️ Released flowers float and fall with physics-inspired motion
- ✊ Make a fist to erase flowers
- ✨ Real-time hand skeleton and fingertip visualization

### ✍️ Writing Mode

Write directly in the air using your index finger.

- ☝️ Draw letters, names, and shapes with your finger
- 🎨 Select writing colors using hand gestures
- ✌️ Open the color palette
- ☝️ Point at a color and hold to select it
- ✊ Use your fist as an eraser
- 🖌️ Smooth continuous strokes
- 🌈 Multiple writing colors available

---

## 🖐️ Gesture Controls

| Gesture | Flower Mode | Write Mode |
|---|---|---|
| ☝️ Index Finger | Grow flowers | Write |
| ✋ Open Palm | Release flowers | Pause |
| ✊ Closed Fist | Erase flowers | Erase |
| ✌️ Victory | — | Open color palette |
| ☝️ Point + Hold | — | Select color |

---

## 🛠️ Tech Stack

### Frontend

- **React.js**
- **Vite**
- **JavaScript (ES6+)**
- **HTML5 Canvas**
- **CSS3**

### Computer Vision

- **MediaPipe Tasks Vision**
- **Gesture Recognizer**
- Real-time hand landmark detection
- Hand gesture classification

### Browser APIs

- WebRTC `getUserMedia()`
- Canvas 2D API
- `requestAnimationFrame()`

---

## 🧠 How It Works

Gesture Garden processes the webcam feed in real time.

```text
Webcam
   ↓
MediaPipe Gesture Recognition
   ↓
Hand Landmarks
   ↓
Gesture Classification
   ↓
Interaction Engine
   ↓
HTML5 Canvas
   ↓
Interactive Digital Art

The application tracks the user's hand landmarks and uses the index fingertip as the primary interaction point.

Different gestures are mapped to different creative actions such as growing flowers, writing, releasing flowers, changing colors, and erasing.

🎨 Interaction Design

Gesture Garden is designed around natural, hands-free interaction.

Instead of relying on traditional mouse-based controls, users can interact with the digital canvas through hand movements.

🌸 Flower Creation

The index fingertip acts as a virtual brush.

As the hand moves across the screen, flower objects are continuously generated along the fingertip path.

✋ Flower Release

Opening the palm triggers a release effect.

Previously created flowers are pushed upward and outward before falling naturally through the scene.

✍️ Air Writing

In Write mode, the index fingertip becomes a virtual pen.

The application tracks the fingertip path and renders it as a continuous writing stroke on the canvas.

✊ Gesture Erasing

A closed fist acts as an eraser.

Nearby flowers or writing strokes are removed based on the position of the detected hand.

🎨 Hand-Controlled Colors

In Write mode, users can open the color palette using the Victory gesture.

They can then point at a color and hold their finger over it to select the writing color.

📁 Project Structure
gesture-garden/
│
├── public/
│   └── mediapipe/
│       └── wasm/
│
├── src/
│   ├── components/
│   │   ├── FlowerCanvas.jsx
│   │   ├── GardenCanvas.jsx
│   │   ├── HandSkeleton.jsx
│   │   ├── HandTracker.jsx
│   │   └── WriteCanvas.jsx
│   │
│   ├── utils/
│   │   ├── drawFlower.js
│   │   ├── flower.js
│   │   └── gestureDetection.js
│   │
│   ├── assets/
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
🚀 Getting Started
Prerequisites

Make sure you have:

Node.js installed
A modern web browser
A working webcam
1. Clone the repository
git clone https://github.com/sirimallachandana4/gesture-garden.git
2. Navigate to the project
cd gesture-garden
3. Install dependencies
npm install
4. Start the development server
npm run dev
5. Open the application

Open the local URL displayed by Vite in your browser.

📷 Camera Permissions

Gesture Garden requires access to your device camera for real-time hand tracking.

When the browser asks for camera permission:

Allow camera access.

For production deployments, camera access requires a secure HTTPS connection.

🌐 Deployment

Gesture Garden can be deployed using platforms such as Vercel.

For a Vite project, the typical production settings are:

Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install

The deployed application requires HTTPS for browser camera access.

📱 Mobile Support

Gesture Garden is designed to provide a responsive experience across desktop and mobile browsers.

The interface supports:

💻 Desktop screens
📱 Mobile portrait orientation
📱 Mobile landscape orientation

For the best experience, use a device with:

A working camera
Good lighting
A modern browser
Enough space to move your hand comfortably
⚡ Performance

Gesture Garden uses real-time browser rendering and hand tracking.

The application uses:

requestAnimationFrame() for smooth animation
HTML5 Canvas for interactive graphics
MediaPipe hand landmark tracking
Position smoothing for natural movement
Local MediaPipe WASM assets for reliable loading
🎯 Project Goals

Gesture Garden explores how computer vision and creative web technologies can be combined to create a more natural way of interacting with digital content.

The project focuses on:

Human-computer interaction
Computer vision
Gesture recognition
Creative coding
Real-time browser experiences
Interactive visual design
🔮 Future Improvements

Potential future enhancements include:

🌺 More flower varieties
✨ Advanced particle effects
🖐️ Multi-hand interactions
🎨 Additional drawing tools
💾 Save and export artwork
🎥 Record creative sessions
🔊 Interactive sound effects
🤝 Multiplayer gesture experiences
🤖 Additional gesture-controlled interactions
🤝 Contributing

Contributions, ideas, and improvements are welcome.

To contribute:

Fork the repository
Create a feature branch
Make your changes
Commit your changes
Push the branch
Open a Pull Request
📄 License

This project is created for educational and creative purposes.

👩‍💻 Author

Sirimalla Chandana

Built with ❤️ using React, MediaPipe, HTML5 Canvas, and JavaScript.

⭐ Support

If you like Gesture Garden, consider giving the repository a ⭐ on GitHub.

<p align="center"> <strong>Gesture Garden — Move your hands. Create something beautiful. 🌸</strong> </p>
