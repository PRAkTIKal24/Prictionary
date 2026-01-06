# 🎨 Prictionary

A 2/multi-player Pictionary game optimized for mobile devices. Draw and guess words with friends in this fun, browser-based game!

## ✨ Features

- **Mobile-Optimized**: Works seamlessly on iOS and Android browsers with touch support
- **Multiplayer Ready**: Support for 2+ players with room-based gameplay
- **Rich Word Categories**: 
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
