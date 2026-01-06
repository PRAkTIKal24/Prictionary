# 🚀 Prictionary Integration Plan
**Version:** 1.0  
**Date:** January 6, 2026  
**Target:** Web-Based Multiplayer Implementation

---

## 📋 Executive Summary

### Recommendation: Web-Based Solution ✅

For a private game among friends (not worldwide usage), a **web-based approach is strongly recommended** over native mobile apps.

> **⚠️ Important Constraint:** Your main website uses Weebly free plan, which has limited file upload capabilities. The solution below accounts for this and recommends hosting Prictionary separately (for free) while linking from your Weebly site.

#### Why Web-Based?

| Factor | Web-Based | Native App (iOS + Android) |
|--------|-----------|---------------------------|
| **Installation** | Zero - just click link | Requires app store downloads |
| **Updates** | Instant for all users | App store approval (1-7 days) |
| **Development Time** | 2-3 weeks | 6-12 weeks |
| **Cross-Platform** | Built-in (same code) | Requires React Native/Flutter |
| **Hosting Cost** | $0-5/month | $0-5/month + $99/year (Apple) |
| **Maintenance** | Single codebase | 2-3 codebases |
| **Security** | Link + password = sufficient | Same, but more complexity |
| **Friend Access** | Share link → play immediately | Download → install → play |

**Decision:** Proceed with web-based implementation hosted on your personal website.

---

## 🎯 Project Goals

### Primary Objectives
1. ✅ Enable real-time multiplayer gameplay for 2-8 players
2. ✅ Secure access via shareable link + room password
3. ✅ Cross-platform compatibility (iOS, Android, desktop browsers)
4. ✅ Easy hosting on personal website
5. ✅ Simple UX: share link → enter password → play

### Non-Goals (Out of Scope)
- ❌ Public matchmaking or worldwide access
- ❌ User accounts or persistent login
- ❌ Payment integration
- ❌ Native app development
- ❌ Offline gameplay
- ❌ Global leaderboards

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────┐
│   Your Website  │
│  (Static Host)  │
└────────┬────────┘
         │
         │ Links to:
         ▼
┌─────────────────────────────────────┐
│     Prictionary Web App             │
│  (Static HTML/CSS/JS + WebSocket)   │
└────────┬────────────────────────────┘
         │
         │ WebSocket
         ▼
┌─────────────────────────────────────┐
│    Backend Server (Node.js)         │
│  - Socket.IO for real-time comms    │
│  - Room management                  │
│  - Password validation              │
│  - Game state synchronization       │
└─────────────────────────────────────┘
```

### Technology Stack

#### Frontend (Client)
- **HTML5** - Structure with Canvas API for drawing
- **CSS3** - Responsive design, mobile-first
- **Vanilla JavaScript** - Game logic and UI
- **Socket.IO Client** - Real-time communication

#### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Socket.IO** - WebSocket communication
- **In-Memory Storage** - Room state (no database needed for small scale)

#### Hosting Options

**Given Weebly Free Plan Constraint:**

1. **GitHub Pages** (Frontend) + **Render** (Backend) - **RECOMMENDED** ✅
   - Cost: $0/month
   - **Zero ads, zero bloat** - completely clean
   - Fast and reliable (GitHub's CDN)
   - Easy deployment (git push)
   - Perfect for open-source projects
   - Your repo is already on GitHub!

2. **Netlify** (Frontend) + **Render** (Backend)
   - Cost: $0/month
   - Has Netlify branding/ads on free tier
   - Slightly easier initial setup

3. **Vercel** (Frontend) + **Render** (Backend)
   - Cost: $0/month
   - Has Vercel branding on free tier

4. **Single VPS** (DigitalOcean/Linode) - All-in-one
   - Cost: $5-6/month
   - Full control, but requires more setup

**Note:** Weebly free plan cannot host custom HTML/CSS/JS files with full control, so we'll host Prictionary separately and link to it from your main website.

---

## 📦 Implementation Phases

### Phase 1: Backend Infrastructure (Week 1)

#### 1.1 WebSocket Server Setup
**Goal:** Real-time communication between players

**Tasks:**
- [ ] Initialize Node.js project with Express + Socket.IO
- [ ] Set up WebSocket connection handling
- [ ] Implement basic connection/disconnection events
- [ ] Add heartbeat mechanism for connection health
- [ ] Configure CORS for your website domain

**Files to Create:**
```
backend/
├── package.json
├── server.js
├── config.js
├── src/
│   ├── roomManager.js      # Room creation/join/leave logic
│   ├── gameManager.js      # Game state and turn management
│   ├── socketHandlers.js   # Socket event handlers
│   └── utils/
│       ├── passwordHash.js # Password validation
│       └── roomCode.js     # Generate unique room codes
└── .env                    # Environment variables
```

**Deliverables:**
- Working WebSocket server
- Connection test page
- Health check endpoint

---

#### 1.2 Room Management System
**Goal:** Secure room creation and joining

**Features:**
- Generate unique 6-character room codes (e.g., `ABC123`)
- Room password hashing (bcrypt)
- Maximum players per room (default: 8)
- Room expiration (auto-close after 2 hours of inactivity)
- Kick inactive players (timeout: 2 minutes)

**Room Data Structure:**
```javascript
{
  roomCode: "ABC123",
  passwordHash: "...",
  createdAt: timestamp,
  lastActivity: timestamp,
  host: "playerId",
  players: [
    { id: "socket-id", name: "Player1", score: 0, connected: true },
    // ...
  ],
  gameState: {
    active: false,
    round: 1,
    maxRounds: 3,
    currentDrawer: null,
    currentWord: "",
    category: "all",
    timeLeft: 60,
    usedWords: []
  },
  drawingData: []  // Current canvas state
}
```

**API Events:**
```javascript
// Client → Server
socket.emit('create-room', { playerName, password, category })
socket.emit('join-room', { roomCode, playerName, password })
socket.emit('leave-room')
socket.emit('start-game')

// Server → Client
socket.emit('room-created', { roomCode })
socket.emit('room-joined', { players, scores })
socket.emit('room-error', { message })
socket.emit('player-joined', { player })
socket.emit('player-left', { playerId })
```

**Deliverables:**
- Room creation endpoint
- Room join with password validation
- Player list synchronization
- Room cleanup service

---

#### 1.3 Game State Management
**Goal:** Synchronize game state across all players

**Features:**
- Turn rotation logic
- Word selection from categories
- Timer synchronization
- Score calculation and updates
- Round progression
- Winner determination

**Game Flow Events:**
```javascript
// Server → Clients
socket.emit('game-started', { drawer, word, timeLeft })
socket.emit('turn-started', { drawer, wordHint, timeLeft })
socket.emit('drawing-update', { drawingData })
socket.emit('guess-submitted', { player, correct })
socket.emit('correct-guess', { player, score })
socket.emit('turn-ended', { word, scores })
socket.emit('round-ended', { scores })
socket.emit('game-ended', { winner, finalScores })
socket.emit('timer-tick', { timeLeft })

// Client → Server
socket.emit('submit-guess', { guess })
socket.emit('drawing-data', { points, color, size })
socket.emit('clear-canvas')
```

**Scoring Algorithm:**
```javascript
function calculateScore(timeLeft, maxTime = 60) {
  const baseScore = 100;
  const timeBonus = Math.floor((timeLeft / maxTime) * 50);
  return baseScore + timeBonus;  // 100-150 points
}
```

**Deliverables:**
- Game state machine
- Turn rotation system
- Timer with server-side validation
- Score calculation module

---

### Phase 2: Frontend Integration (Week 2)

#### 2.1 Socket.IO Client Integration
**Goal:** Connect frontend to backend

**Tasks:**
- [ ] Add Socket.IO client library
- [ ] Implement connection manager
- [ ] Add reconnection logic with exponential backoff
- [ ] Handle disconnection gracefully
- [ ] Show connection status indicator

**Files to Modify:**
- `index.html` - Add Socket.IO CDN or bundled script
- `app.js` - Replace local game state with server sync

**Example Connection Code:**
```javascript
const socket = io('https://your-backend.com', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('Connected to server');
  showConnectionStatus('online');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  showConnectionStatus('offline');
  showReconnectingMessage();
});
```

**Deliverables:**
- Connected client-server communication
- Connection status UI
- Automatic reconnection

---

#### 2.2 Real-Time Drawing Synchronization
**Goal:** Broadcast drawing to all players

**Implementation:**
- Capture canvas drawing events
- Throttle data transmission (every 50ms)
- Compress drawing data (delta compression)
- Replay drawing on receiver side

**Drawing Data Format:**
```javascript
{
  type: 'draw',  // 'draw' | 'clear' | 'undo'
  points: [{ x: 100, y: 200 }],  // Relative coordinates (0-1)
  color: '#000000',
  size: 5,
  tool: 'pen',  // 'pen' | 'eraser'
  timestamp: Date.now()
}
```

**Optimization Strategy:**
```javascript
// Throttle drawing updates
let drawingBuffer = [];
setInterval(() => {
  if (drawingBuffer.length > 0) {
    socket.emit('drawing-data', drawingBuffer);
    drawingBuffer = [];
  }
}, 50);  // Send at most 20 updates/second
```

**Deliverables:**
- Real-time drawing sync
- Smooth rendering for remote players
- Clear canvas broadcast

---

#### 2.3 Chat & Guessing System
**Goal:** Handle guesses and chat messages

**Features:**
- Real-time chat messages
- Guess validation (server-side)
- Partial word masking for hint system
- Chat history (last 50 messages)
- Emoji support
- Timestamp for each message

**Message Types:**
```javascript
{
  type: 'chat' | 'guess' | 'system' | 'correct',
  player: 'Player1',
  message: 'hello!',
  timestamp: Date.now(),
  isCorrect: false  // For guesses
}
```

**Word Hint System:**
```javascript
function generateHint(word, revealedCount = 0) {
  const chars = word.split('');
  const revealed = Math.floor(chars.length * revealedCount);
  return chars.map((c, i) => {
    if (c === ' ') return ' ';
    return i < revealed ? c : '_';
  }).join('');
}

// Example: "elephant" → "e_e_____ " (30% revealed)
```

**Deliverables:**
- Chat message display
- Guess submission and validation
- Correct guess celebration animation
- Hint progression system

---

#### 2.4 Security Implementation
**Goal:** Secure access and prevent cheating

**Security Measures:**

1. **Room Password Protection**
   - SHA-256 hashing on client before sending
   - bcrypt verification on server
   - Password not stored in plain text

2. **Rate Limiting**
   - Max 10 guesses per minute per player
   - Max 5 room creation attempts per IP per hour
   - Drawing data rate limit (20 updates/sec)

3. **Input Sanitization**
   - Sanitize player names (remove HTML/scripts)
   - Sanitize chat messages
   - Validate room codes (alphanumeric, 6 chars)

4. **Server-Side Validation**
   - All game logic validated on server
   - Scores calculated server-side only
   - Word selection on server (not exposed to drawer)
   - Timer managed server-side

5. **HTTPS/WSS Only**
   - Force HTTPS for frontend
   - Use WSS (WebSocket Secure) for backend
   - Set secure headers (CSP, HSTS)

**Files to Create:**
```
backend/src/security/
├── rateLimiter.js
├── sanitizer.js
└── validator.js
```

**Example Rate Limiter:**
```javascript
const guessingLimiter = new Map();

function checkGuessLimit(playerId) {
  const now = Date.now();
  const playerData = guessingLimiter.get(playerId) || { count: 0, resetAt: now + 60000 };
  
  if (now > playerData.resetAt) {
    playerData.count = 0;
    playerData.resetAt = now + 60000;
  }
  
  if (playerData.count >= 10) {
    return false;  // Rate limited
  }
  
  playerData.count++;
  guessingLimiter.set(playerId, playerData);
  return true;
}
```

**Deliverables:**
- Password hashing system
- Rate limiting middleware
- Input validation functions
- Security headers configuration

---

### Phase 3: Deployment & Hosting (Week 3)

#### 3.1 Backend Deployment

**Option A: Render (RECOMMENDED - Free Tier Available)**

**Steps:**
1. Create `render.yaml` configuration
2. Push backend code to GitHub
3. Connect Render to your repository
4. Deploy with environment variables
5. Get backend URL (e.g., `prictionary-api.onrender.com`)

**Cost:** $0/month (free tier) or $7/month (always-on)

**Pros:**
- Zero-config deployment
- Free HTTPS/WSS
- Auto-deploys on git push
- Easy environment variables

**Cons:**
- Free tier sleeps after inactivity (30s cold start)

---

**Option B: Railway**

**Steps:**
1. Install Railway CLI or use web dashboard
2. Run `railway init` and `railway up`
3. Configure environment variables
4. Get backend URL

**Cost:** $5/month (500 hours execution)

**Pros:**
- Very fast deployment
- Good free tier ($5 credit/month)
- Easy scaling

---

**Option C: Your Own VPS (Full Control)**

**Providers:** DigitalOcean, Linode, Vultr  
**Cost:** $5-6/month (1GB RAM droplet)

**Steps:**
1. Create Ubuntu 22.04 server
2. Install Node.js 18+
3. Set up nginx as reverse proxy
4. Configure SSL with Let's Encrypt
5. Set up PM2 for process management
6. Enable firewall (UFW)

**Pros:**
- Full control
- Always-on (no cold starts)
- Can host multiple projects

**Cons:**
- More setup required
- You manage security updates

---

#### 3.2 Frontend Deployment

**Option A: GitHub Pages (RECOMMENDED - Zero Ads/Bloat)** ✅

**Why GitHub Pages:**
- **Completely clean** - zero ads, zero bloatware
- **Already using GitHub** - repo is here already!
- **Fast & reliable** - GitHub's global CDN
- **Simple deployment** - just `git push`
- **Free HTTPS** - automatic SSL certificate
- **Custom domain support** - free
- **Multiple projects supported** - each repo gets its own path, completely independent

> **📝 Note:** If you already have a GitHub Pages site (e.g., for documentation), Prictionary will be at a **separate path**: `praktikaal24.github.io/Prictionary/`. Your existing docs at `praktikaal24.github.io/` remain completely untouched. Zero interference!

**Steps:**

1. **Enable GitHub Pages:**
   ```bash
   # In your repo on GitHub.com:
   # Settings → Pages → Source: "Deploy from a branch"
   # Branch: main
   # Folder: / (root)
   # Save
   ```

2. **Your game will be live at:**
   ```
   https://praktikaal24.github.io/Prictionary/
   ```
   
   **Important:** This is a **separate path** from your existing GitHub Pages site:
   - Your existing docs: `praktikaal24.github.io/` (untouched)
   - Prictionary game: `praktikaal24.github.io/Prictionary/` (new)
   - **Zero interference** - completely independent projects!

3. **Update backend URL in code:**
   ```javascript
   // app.js - Update socket connection
   const BACKEND_URL = 'https://your-backend.onrender.com';
   const socket = io(BACKEND_URL);
   ```

4. **Deploy updates:**
   ```bash
   git add .
   git commit -m "Update game"
   git push origin main
   # Live in ~1 minute!
   ```

5. **Link from Weebly Website:**
   - In Weebly editor, add a button/link
   - Text: "🎨 Play Prictionary with Friends"
   - Link to: `https://praktikaal24.github.io/Prictionary/`
   - Settings: Open in new tab ✓

6. **Custom Domain (Optional but Recommended):**
   
   **In GitHub repo:**
   - Settings → Pages → Custom domain
   - Enter: `play.yourdomain.com`
   - Save (creates CNAME file)
   
   **In your domain registrar:**
   - Add CNAME record:
     - Name: `play`
     - Value: `praktikaal24.github.io`
     - TTL: 3600
   - Wait 5-30 minutes
   
   **Result:** `https://play.yourdomain.com` (clean, no GitHub branding)

**Deliverables:**
- Prictionary live on GitHub Pages
- Link added to Weebly site
- Custom domain configured (optional)
- Zero ads, zero bloat ✓

**Cost:** $0/month forever

---

**Option B: Netlify (Has Branding)**

Netlify shows "Hosted by Netlify" banner on free tier:

1. **Deploy to Netlify:**
   ```bash
   # Drag & drop to https://app.netlify.com/drop
   # Get URL: prictionary.netlify.app
   ```

**Cost:** $0/month (but has Netlify branding)

---

**Option C: Vercel (Has Branding)**

Vercel shows "Powered by Vercel" banner on free tier:

1. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

**Cost:** $0/month (but has Vercel branding)

---

#### 3.3 Domain & SSL Configuration

**Weebly + GitHub Pages Setup:**

1. **Frontend URL Options:**
   - Default: `https://praktikaal24.github.io/Prictionary/` (free, works immediately, **zero ads**)
   - Custom subdomain: `https://play.yourdomain.com` (free, requires DNS setup, **completely clean**)
   - Custom subdomain: `https://prictionary.yourdomain.com` (free, requires DNS setup)

2. **SSL Certificate:**
   - Automatically provided by GitHub Pages (free HTTPS)
   - Automatically renews
   - No "Secured by XYZ" branding

3. **Link from Weebly:**
   - In Weebly editor: Add Element → Button or Link
   - Button text: "🎨 Play Prictionary with Friends"
   - Link: Your GitHub Pages URL
   - Settings: Open in new tab ✓
   
4. **Custom Domain Setup (Optional but Recommended):**
   
   **In GitHub Repo:**
   - Settings → Pages → Custom domain
   - Enter: `play.yourdomain.com`
   - Click "Save" (auto-creates CNAME file)
   - Check "Enforce HTTPS" (wait a few minutes first)
   
   **In Your Domain Registrar** (where you bought yourdomain.com):
   - DNS settings → Add CNAME record:
     - Name: `play` (or `prictionary`)
     - Value: `praktikaal24.github.io`
     - TTL: 3600
   - Save, wait 5-30 minutes for DNS propagation
   
   **Result:** Game accessible at `https://play.yourdomain.com`
   - **Completely clean** - no ads, no branding, looks like your own site!

**Deliverables:**
- HTTPS-enabled frontend
- WSS-enabled backend
- Shareable game URL

---

#### 3.4 Environment Configuration

**Backend Environment Variables (.env):**
```bash
# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourwebsite.com

# Security
SESSION_SECRET=<random-64-char-string>
ALLOWED_ORIGINS=https://yourwebsite.com,https://yourwebsite.com/prictionary

# Game Configuration
MAX_PLAYERS_PER_ROOM=8
ROOM_INACTIVITY_TIMEOUT=7200000  # 2 hours
PLAYER_TIMEOUT=120000  # 2 minutes
MAX_ROUNDS=5

# Rate Limiting
MAX_GUESSES_PER_MINUTE=10
MAX_ROOM_CREATIONS_PER_HOUR=5
```

**Frontend Configuration (app.js):**
```javascript
const CONFIG = {
  BACKEND_URL: 'https://your-backend.onrender.com',
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  DRAWING_THROTTLE: 50,  // ms
  HEARTBEAT_INTERVAL: 30000  // 30s
};
```

**Deliverables:**
- Environment variable setup
- Configuration documentation
- Secret generation script

---

### Phase 4: Polish & Optimization (Ongoing)

#### 4.1 Mobile Optimization

**Tasks:**
- [ ] Test on iOS Safari (iPhone)
- [ ] Test on Android Chrome
- [ ] Optimize touch controls
- [ ] Add viewport meta tags
- [ ] Test in portrait/landscape
- [ ] Add "Add to Home Screen" capability (PWA)

**PWA Features (Optional):**
- Create `manifest.json`
- Add service worker for offline assets
- Add app icon (192x192, 512x512)
- Enable "Add to Home Screen" prompt

---

#### 4.2 Performance Optimization

**Frontend:**
- Minify CSS/JS for production
- Use CDN for Socket.IO library
- Lazy load word lists
- Compress images/assets
- Add loading states

**Backend:**
- Enable gzip compression
- Set cache headers for static assets
- Optimize WebSocket payload size
- Add connection pooling
- Monitor memory usage

**Target Metrics:**
- Initial page load: < 2s
- Socket connection: < 500ms
- Drawing latency: < 100ms
- Guess response: < 200ms

---

#### 4.3 Error Handling & Recovery

**Client-Side:**
- Graceful WebSocket disconnection
- Automatic reconnection with room state restoration
- Offline mode indicator
- Error message user-friendly display
- Lost connection recovery

**Server-Side:**
- Uncaught exception handling
- Process restart on crash (PM2)
- Room state recovery
- Player reconnection handling
- Memory leak prevention

**Example Reconnection:**
```javascript
socket.on('disconnect', () => {
  const roomCode = localStorage.getItem('currentRoom');
  const playerName = localStorage.getItem('playerName');
  
  if (roomCode && playerName) {
    // Attempt to rejoin on reconnect
    socket.on('connect', () => {
      socket.emit('rejoin-room', { roomCode, playerName });
    });
  }
});
```

---

## 📊 Success Metrics

### Technical Metrics
- ✅ Page load time < 2 seconds
- ✅ Drawing latency < 100ms
- ✅ Server uptime > 99%
- ✅ Support 8 concurrent players per room
- ✅ Support 5-10 concurrent rooms

### User Experience Metrics
- ✅ Can create room in < 10 seconds
- ✅ Friends can join in < 20 seconds
- ✅ Zero installation required
- ✅ Works on all major browsers
- ✅ Mobile-friendly UI

### Security Metrics
- ✅ HTTPS/WSS encrypted connections
- ✅ Password-protected rooms
- ✅ No unauthorized room access
- ✅ Rate limiting prevents abuse
- ✅ No XSS or injection vulnerabilities

---

## 🛠️ Development Tools & Resources

### Required Tools
- **Node.js 18+** - Runtime
- **npm/yarn** - Package management
- **Git** - Version control
- **VS Code** - Editor (or any IDE)
- **Postman** - API testing (optional)

### Recommended Extensions (VS Code)
- Live Server - Local testing
- ESLint - Code quality
- Prettier - Code formatting
- Thunder Client - API testing

### Testing Tools
- Chrome DevTools - Network/performance
- BrowserStack - Cross-browser testing (optional)
- ngrok - Local backend testing from mobile

---

## 🔄 CI/CD Pipeline (Optional but Recommended)

### GitHub Actions Workflow

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy Prictionary

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Website
        run: |
          # Upload frontend files to your website
          # (via FTP, rsync, or your hosting provider's API)
  
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          # Render auto-deploys on git push
          echo "Backend deployed via Render"
```

---

## 📞 Support & Maintenance Plan

### Regular Maintenance
- **Weekly:** Check server logs for errors
- **Monthly:** Review and rotate secrets
- **Quarterly:** Update dependencies (npm audit)
- **Yearly:** Renew SSL certificates (if self-hosted)

### Monitoring
- Set up uptime monitoring (UptimeRobot - free)
- Configure error alerts (email/Discord webhook)
- Monitor backend memory/CPU usage
- Track WebSocket connection metrics

### Backup Strategy
- Not needed (stateless, no persistent data)
- Room codes regenerate on server restart
- No user data to backup

---

## 🎯 Launch Checklist

### Pre-Launch
- [ ] Backend deployed and accessible
- [ ] Frontend deployed on your website
- [ ] HTTPS/WSS working
- [ ] Room creation tested
- [ ] Multiplayer tested with 2+ devices
- [ ] Password protection working
- [ ] All security measures active
- [ ] Mobile tested (iOS + Android)
- [ ] Error handling verified
- [ ] Performance metrics met

### Launch Day
- [ ] Share link with friends
- [ ] Monitor server performance
- [ ] Be available for bug reports
- [ ] Collect feedback

### Post-Launch
- [ ] Fix critical bugs within 24h
- [ ] Implement feedback
- [ ] Monitor usage patterns
- [ ] Plan feature enhancements

---

## 🚀 Estimated Timeline

| Phase | Duration | Effort |
|-------|----------|--------|
| **Phase 1:** Backend Infrastructure | 5-7 days | ~20 hours |
| **Phase 2:** Frontend Integration | 5-7 days | ~15 hours |
| **Phase 3:** Deployment & Hosting | 2-3 days | ~8 hours |
| **Phase 4:** Testing & Polish | 2-3 days | ~7 hours |
| **Total** | **2-3 weeks** | **~50 hours** |

*Timeline assumes part-time development (2-3 hours/day)*

---

## 💰 Cost Estimate

### Hosting (Monthly)
| Service | Cost | Notes |
|---------|------|-------|
| **Frontend (GitHub Pages)** | **$0** | **Zero ads, zero bloat, free SSL** |
| **Backend (Render Free)** | **$0** | **Cold starts after inactivity** |
| Backend (Render Always-On) | $7 | No cold starts (optional upgrade) |
| Backend (Railway) | $5 | 500 hours/month (alternative) |
| Backend (VPS) | $5-6 | Full control (advanced) |
| Weebly Free Plan | $0 | Keep as-is for main website |
| Domain | $0 | Using existing domain |
| **Total (Recommended)** | **$0/month** | **GitHub Pages + Render free tiers** |
| **Total (No cold starts)** | **$7/month** | **GitHub Pages + Render paid** |

### One-Time Costs
- Development Time: Free (DIY)
- Testing Tools: Free
- Monitoring: Free (UptimeRobut free tier)

### Mobile App (For Comparison)
- Apple Developer Account: $99/year
- Google Play Developer: $25 one-time
- Development Time: 2-3x longer
- **Total:** $99-124/year + more dev time

---

## 📚 Next Steps

1. **Review this plan** and make edits as needed
2. **Review the Testing Plan** (see TESTING_PLAN.md)
3. **Choose hosting provider** (recommend Render for backend)
4. **Set up development environment**
5. **Start with Phase 1: Backend Infrastructure**
6. **Proceed sequentially through phases**
7. **Test thoroughly before launch**
8. **Share with friends and enjoy!**

---

## ❓ FAQs

**Q: Can I really host this for free with zero ads?**  
A: Yes! GitHub Pages (frontend) + Render (backend) = $0/month, completely clean with zero ads or bloatware. Trade-off is 30s cold start when backend wakes up.

**Q: Why not just upgrade Weebly to Pro?**  
A: Weebly Pro costs $10-25/month and still has limited code control. GitHub Pages is free and gives you full control. Better to keep Weebly free for your main site and host Prictionary separately.

**Q: Does GitHub Pages have ads or branding?**  
A: **Nope!** Zero ads, zero branding, completely clean. Your game, your domain, your look.

**Q: How do friends access the game from my Weebly site?**  
A: Add a button/link on your Weebly site that opens the GitHub Pages-hosted game in a new tab. Simple!

**Q: Can I use my domain like play.mydomain.com?**  
A: Yes! GitHub Pages supports custom domains for free. Just add a CNAME DNS record. Result is completely clean with no GitHub branding.

**Q: I already have a GitHub Pages site for my docs. Will Prictionary interfere?**  
A: **Nope!** Each repo gets its own path. Your docs stay at `praktikaal24.github.io/`, Prictionary goes to `praktikaal24.github.io/Prictionary/`. Completely separate, zero interference. You can even use a custom subdomain like `play.yourdomain.com` to make it totally independent.

**Q: What if my friend doesn't have the link?**  
A: They won't be able to access the game. Share the link via text/email/Discord.

**Q: How secure is the password system?**  
A: Very secure for small groups. Passwords are hashed with bcrypt, never stored in plain text.

**Q: Can I add more features later?**  
A: Absolutely! This architecture supports easy additions like custom word lists, voice chat, etc.

**Q: What if the server crashes?**  
A: With PM2/Render, it auto-restarts. Players may need to refresh and rejoin their rooms.

**Q: How many friends can play at once?**  
A: Default is 8 per room. Server can handle 5-10 concurrent rooms easily.

---

**Ready to build? Let's proceed to the Testing Plan!** 🎨✨
