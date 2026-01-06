# 🎨 Prictionary

A real-time multiplayer Pictionary game with WebSocket support. Draw and guess words with friends in this fun, cross-platform game!

## ✨ Features

- **🌐 True Multiplayer**: Real-time gameplay with WebSocket (Socket.IO)
- **🔒 Password Protected Rooms**: Secure rooms for you and your friends
- **📱 Mobile-Optimized**: Works seamlessly on iOS and Android with touch support
- **🎮 2-8 Players**: Support for 2-8 players per room
- **🎨 Rich Word Categories**: 
  - Movies (50+ words)
  - TV Shows (50+ words)
  - Songs (50+ words)
  - Animals (70+ words)
  - Everyday Objects (70+ words)
  - Food & Drinks (70+ words)
  - Places (60+ words)
  - Actions (70+ words)
  - **Total: 500+ unique words**
- **🖌️ Drawing Tools**: Multiple colors, adjustable brush sizes, eraser, and clear canvas
- **⏱️ Real-time Gameplay**: Turn-based drawing with server-synced timer and scoring
- **🏆 Scoring System**: Points based on speed of correct guesses
- **💬 Chat Integration**: Real-time chat for guessing
- **📱 Responsive Design**: Adapts to any screen size from mobile to desktop

## 🚀 Quick Start

### Play Online (Deployed Version)

**Game URL:** https://praktikaal24.github.io/Prictionary/

1. Visit the URL
2. Create a room with your name and a password
3. Share the room code and password with friends
4. Friends join using the same room code and password
5. Host starts the game when everyone's ready!

### Local Development

**Prerequisites:**
- Node.js 18+ (for backend)
- Python 3 or Node.js (for frontend server)

**1. Start the backend:**
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:3000
```

**2. Start the frontend:**
```bash
# In the root directory
python3 -m http.server 8000
# Or use Node.js:
npx http-server -p 8000
# Frontend runs on http://localhost:8000
```

**3. Open in browser:**
```
http://localhost:8000
```

## 🎮 How to Play

### Creating a Game

1. **Enter Your Name** and create a password (4+ characters)
2. **Click "Create Room"** to generate a unique room code
3. **Share the Room Code and Password** with friends
4. **Select a Category** (or choose "All Categories" for random words)
5. **Wait for Players** to join (minimum 2 players, maximum 8)
6. **Click "Start Game"** when ready

### Joining a Game

1. **Enter Your Name**
2. **Click "Join Room"**
3. **Enter the Room Code** (6 characters) shared by the host
4. **Enter the Password** for the room
5. **Wait in Lobby** until the host starts the game

### Gameplay

- **Drawing**: If it's your turn, use the drawing tools to illustrate the given word
  - Choose colors from the palette
  - Adjust brush size with the slider
  - Use eraser to correct mistakes
  - Clear the canvas to start over
  
- **Guessing**: If you're not drawing, type your guesses in the chat
  - Correct answers earn points based on time remaining
  - Faster guesses = more points (100-150 points)!

- **Scoring**:
  - Correct guess: 100-150 points (time bonus)
  - Game consists of multiple rounds (default: 3)
  - Each player gets a turn to draw
  - Winner is announced at the end!

## 🔒 Security Features

- **Password-protected rooms** - Only players with the password can join
- **Rate limiting** - Prevents guess/room creation spam
- **Input sanitization** - Protects against XSS attacks
- **Server-side validation** - All game logic validated on server
- **bcrypt password hashing** - Passwords never stored in plain text
- **HTTPS/WSS encryption** - Secure connections in production

## 🛠️ Technology Stack

### Frontend
- HTML5 Canvas API
- Vanilla JavaScript
- Socket.IO Client
- Responsive CSS

### Backend  
- Node.js + Express
- Socket.IO (WebSocket)
- bcrypt (password hashing)
- In-memory room management

### Hosting
- **Frontend**: GitHub Pages (zero cost, zero ads)
- **Backend**: Render (free tier or $7/month for always-on)

## 📁 Project Structure

```
Prictionary/
├── index.html              # Main HTML structure
├── styles.css              # Responsive styles and theming
├── app.js                  # Game logic with Socket.IO client
├── words.js                # Word lists organized by category
├── server.js               # Legacy static server
├── backend/                # Multiplayer backend
│   ├── server.js           # Express + Socket.IO server
│   ├── config.js           # Configuration
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   └── src/
│       ├── roomManager.js  # Room creation/management
│       ├── gameManager.js  # Game logic and scoring
│       ├── socketHandlers.js # WebSocket event handlers
│       ├── utils/
│       │   ├── roomCode.js # Room code generation
│       │   └── passwordHash.js # Password hashing
│       └── security/
│           ├── sanitizer.js # Input sanitization
│           └── rateLimiter.js # Rate limiting
├── INTEGRATION_PLAN.md     # Full integration roadmap
├── TESTING_PLAN.md         # Comprehensive testing strategy
├── DEPLOYMENT.md           # Step-by-step deployment guide
├── README.md               # This file
└── LICENSE                 # Apache 2.0 License
```

## 📖 Documentation

- **[INTEGRATION_PLAN.md](INTEGRATION_PLAN.md)** - Complete architecture and implementation plan
- **[TESTING_PLAN.md](TESTING_PLAN.md)** - Testing strategy and validation procedures
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for GitHub Pages + Render

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

**Quick summary:**
1. Deploy backend to Render (free tier available)
2. Update `BACKEND_URL` in app.js with your Render URL
3. Enable GitHub Pages on this repo
4. Share the game URL with friends!

**Total cost:** $0/month (with free tiers) or $7/month for always-on backend

## 🌐 Browser Compatibility

- ✅ Chrome/Chromium (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Firefox (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Samsung Internet
- ✅ Any modern browser with HTML5 Canvas and WebSocket support

## 📱 Mobile Features

- **Touch Drawing**: Native touch support for smooth drawing on phones and tablets
- **Responsive Layout**: UI adapts to portrait and landscape orientations
- **Optimized Controls**: Large, touch-friendly buttons and controls
- **Mobile Chat**: Easy typing on mobile keyboards
- **Cross-Platform**: iOS and Android players can play together

## 🎯 Future Enhancements

Potential features for future versions:

- Custom word lists
- Difficulty levels (word complexity)
- Team mode (2v2, 3v3)
- Voice chat integration
- Drawing replays
- Global leaderboards
- More drawing tools (shapes, fill, etc.)
- Persistent user accounts
- Room history

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👥 Credits

Created for fun multiplayer drawing and guessing gameplay with friends!

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Enjoy playing Prictionary! 🎨✨**
 
  - Movies (50+ words)
  - TV Shows (50+ words)
  - Songs (50+ words)
  - Animals (70+ words)
  - Everyday Objects (70+ words)
  - Food & Drinks (70+ words)
  - Places (60+ words)
  - Actions (70+ words)
  - **Total: 500+ unique words**
- **Drawing Tools**: Multiple colors, adjustable brush sizes, eraser, and clear canvas
- **Real-time Gameplay**: Turn-based drawing with timer and scoring system
- **Responsive Design**: Adapts to any screen size from mobile to desktop

## 🚀 Getting Started

### Quick Start (Local Play)

1. **Clone the repository**
   ```bash
   git clone https://github.com/PRAkTIKal24/Prictionary.git
   cd Prictionary
   ```

2. **Open in Browser**
   - Simply open `index.html` in any modern web browser
   - For mobile testing, use a local server (see below)

### Local Server (Recommended for Mobile Testing)

**Using the included Node.js server (Recommended):**
```bash
npm start
# or
node server.js
```

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js (npx):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Mobile Access

1. Find your computer's local IP address:
   - **Windows**: Run `ipconfig` in Command Prompt
   - **Mac/Linux**: Run `ifconfig` or `ip addr` in Terminal
   
2. On your mobile device, connect to the same WiFi network and navigate to:
   ```
   http://[YOUR_IP_ADDRESS]:8000
   ```

## 🎮 How to Play

### Creating a Game

1. **Enter Your Name** on the start screen
2. **Click "Create Room"** to generate a unique room code
3. **Share the Room Code** with friends
4. **Select a Category** (or choose "All Categories" for random words)
5. **Wait for Players** to join (minimum 2 players)
6. **Click "Start Game"** when ready

### Joining a Game

1. **Enter Your Name** on the start screen
2. **Click "Join Room"**
3. **Enter the Room Code** shared by the host
4. **Wait in Lobby** until the host starts the game

### Gameplay

- **Drawing**: If it's your turn, use the drawing tools to illustrate the given word
  - Choose colors from the palette
  - Adjust brush size with the slider
  - Use eraser to correct mistakes
  - Clear the canvas to start over
  
- **Guessing**: If you're not drawing, type your guesses in the chat
  - Correct answers earn points based on time remaining
  - Faster guesses = more points!

- **Scoring**:
  - Correct guess: 50+ points (more points for faster guesses)
  - Game consists of multiple rounds (default: 3)
  - Each player gets a turn to draw

## 📱 Mobile Features

- **Touch Drawing**: Native touch support for smooth drawing on phones and tablets
- **Responsive Layout**: UI adapts to portrait and landscape orientations
- **Optimized Controls**: Large, touch-friendly buttons and controls
- **Gesture Support**: Pinch and zoom disabled for better drawing experience
- **Fullscreen Capable**: Can be added to home screen for app-like experience

## 🔧 Technical Details

### Technologies Used

- **HTML5**: Semantic markup and Canvas API for drawing
- **CSS3**: Responsive design with flexbox and modern styling
- **Vanilla JavaScript**: No frameworks required, lightweight and fast
- **Canvas API**: Hardware-accelerated drawing with touch support

### Browser Compatibility

- ✅ Chrome/Chromium (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Firefox (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Samsung Internet
- ✅ Any modern browser with HTML5 Canvas support

### File Structure

```
Prictionary/
├── index.html          # Main HTML structure
├── styles.css          # Responsive styles and theming
├── app.js             # Game logic and UI management
├── words.js           # Word lists organized by category
├── server.js          # Optional Node.js server
├── package.json       # Node.js package configuration
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── LICENSE            # Apache 2.0 License
```

## 🎯 Future Enhancements

Current version is a local/demo implementation. For true multiplayer functionality, consider adding:

- **WebSocket Server**: Real-time communication between players
- **Backend Database**: Persistent rooms and user accounts
- **Advanced Features**:
  - Private rooms with passwords
  - Custom word lists
  - Difficulty levels
  - Team mode
  - Replay system
  - Leaderboards
  - Voice chat
  - More drawing tools (shapes, fill, etc.)

## 🔒 Security Considerations

The current implementation is client-side only. For production use:

- Implement server-side validation
- Use HTTPS for secure connections
- Add rate limiting for guesses
- Sanitize user inputs
- Implement proper authentication
- Use secure WebSocket connections (WSS)

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 👥 Credits

Created for fun multiplayer drawing and guessing gameplay.

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Enjoy playing Prictionary! 🎨✨**
