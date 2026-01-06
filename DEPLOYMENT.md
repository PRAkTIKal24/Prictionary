# 🚀 Prictionary Deployment Guide

**Quick Reference:** Your multiplayer Pictionary game is ready to deploy!

---

## ✅ What's Been Built

### Backend (/workspaces/Prictionary/backend)
- ✅ Express + Socket.IO WebSocket server
- ✅ Room management with password protection
- ✅ Game state management (turns, rounds, scoring)
- ✅ Real-time drawing synchronization
- ✅ Chat and guessing system
- ✅ Security (rate limiting, input sanitization, bcrypt passwords)

### Frontend (/workspaces/Prictionary)
- ✅ Socket.IO client integration
- ✅ Password-protected room creation/joining
- ✅ Real-time multiplayer gameplay
- ✅ Touch-optimized drawing canvas
- ✅ Chat/guessing interface
- ✅ Responsive design for mobile & desktop

---

## 🧪 Local Testing (CURRENTLY RUNNING)

Your game is running locally right now!

**Backend:** http://localhost:3000 ✅  
**Frontend:** http://localhost:8000 ✅

### Test with Multiple Players:

1. **Open in two browser windows/tabs:**
   - Window 1: http://localhost:8000
   - Window 2: http://localhost:8000 (incognito/private mode)

2. **Create a room (Window 1):**
   - Enter your name
   - Create password (e.g., "test123")
   - Click "Create Room"
   - Note the 6-character room code

3. **Join the room (Window 2):**
   - Enter different name
   - Click "Join Room"
   - Enter the room code
   - Enter same password
   - Click "Join"

4. **Start playing:**
   - Host clicks "Start Game"
   - Drawer gets a word and draws
   - Guesser types guesses in chat
   - Correct guess → points awarded!

---

## 📦 Deployment Steps

### Step 1: Deploy Backend to Render

1. **Push backend code to GitHub** (if not already):
   ```bash
   cd /workspaces/Prictionary
   git add backend/
   git commit -m "Add multiplayer backend"
   git push origin main
   ```

2. **Create Render account:**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create new Web Service:**
   - Click "New +" → "Web Service"
   - Connect to your Prictionary repo
   - Settings:
     - **Name:** `prictionary-backend` (or any name)
     - **Region:** Choose closest to you
     - **Branch:** `main`
     - **Root Directory:** `backend`
     - **Runtime:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Instance Type:** `Free`

4. **Add Environment Variables** (in Render dashboard):
   ```
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://praktikaal24.github.io
   MAX_PLAYERS_PER_ROOM=8
   ROOM_INACTIVITY_TIMEOUT=7200000
   PLAYER_TIMEOUT=120000
   MAX_ROUNDS=500
   MAX_GUESSES_PER_MINUTE=10
   MAX_ROOM_CREATIONS_PER_HOUR=5
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - **Copy your backend URL** (e.g., `https://prictionary-backend.onrender.com`)

---

### Step 2: Update Frontend Configuration

1. **Edit app.js** - Update the production backend URL (around line 13):
   ```javascript
   // Change this line:
   return 'https://your-backend-url.onrender.com';
   // To:
   return 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com';  // <-- Replace with your Render URL
   ```

2. **Commit the change:**
   ```bash
   git add app.js
   git commit -m "Update backend URL for production"
   git push origin main
   ```

---

### Step 3: Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to: https://github.com/PRAkTIKal24/Prictionary/settings/pages
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/` (root)
   - Click "Save"

2. **Wait 1-2 minutes**, then visit:
   ```
   https://praktikaal24.github.io/Prictionary/
   ```

3. **Your game is live!** 🎉

---

### Step 4: Update Render CORS Settings

After deployment, update Render environment variable:

```
FRONTEND_URL=https://praktikaal24.github.io
```

Then click "Manual Deploy" → "Deploy latest commit" to restart with new settings.

---

## 🔗 Share with Friends

### Option 1: GitHub Pages URL (Default)
**Game URL:** `https://praktikaal24.github.io/Prictionary/`

**Instructions to share:**
1. Visit the game URL
2. Create a room with a password
3. Share:
   - Game URL: `https://praktikaal24.github.io/Prictionary/`
   - Room code: (6 characters, shown after creation)
   - Password: (your chosen password)

### Option 2: Custom Subdomain (Optional - Cleaner)

Set up `play.yourdomain.com`:

1. **In GitHub repo:**
   - Settings → Pages → Custom domain
   - Enter: `play.yourdomain.com`
   - Save

2. **In your domain registrar (DNS settings):**
   - Add CNAME record:
     - Name: `play`
     - Value: `praktikaal24.github.io`
     - TTL: 3600
   - Save and wait 5-30 minutes

3. **Result:**
   - Game at: `https://play.yourdomain.com`
   - Much cleaner to share!

---

## 🎮 How to Play (For Friends)

**1. Visit the game URL**

**2. Create a room (Host):**
   - Enter your name
   - Create a password (4+ characters)
   - Click "Create Room"
   - Share the room code & password with friends

**3. Join a room (Players):**
   - Enter your name
   - Click "Join Room"
   - Enter the room code (from host)
   - Enter the password
   - Click "Join"

**4. Start playing:**
   - Host clicks "Start Game" when everyone's ready
   - Drawer gets a word to illustrate
   - Guessers type guesses in the chat
   - Faster correct guess = more points!
   - Game continues for up to 500 rounds (essentially infinite)

---

## 🛠️ Troubleshooting

### Backend doesn't start on Render
- Check "Logs" tab in Render dashboard
- Verify environment variables are set correctly
- Ensure `backend/` folder has all necessary files

### Frontend can't connect to backend
- Check browser console (F12) for errors
- Verify `BACKEND_URL` in app.js matches your Render URL
- Check Render `FRONTEND_URL` matches GitHub Pages URL
- Ensure backend is deployed and running (visit `/health` endpoint)

### "Room not found" error
- Ensure backend is running
- Check room code (case-sensitive, 6 characters)
- Room may have expired (2 hours of inactivity)

### Drawing not syncing
- Check internet connection
- Verify WebSocket connection in browser console
- Try refreshing both players' browsers

### Cold start delay (Free Render tier)
- First request after inactivity takes ~30 seconds
- Upgrade to paid tier ($7/month) for instant-on
- Or accept the delay for free hosting

---

## 💰 Cost Breakdown

| Service | Cost | What It Does |
|---------|------|--------------|
| **GitHub Pages** | $0 | Hosts your game frontend |
| **Render (Free)** | $0 | Hosts your backend server |
| **Total** | **$0/month** | **Completely free!** |

**Optional upgrades:**
- Render Always-On: $7/month (no cold starts)
- Custom domain: $10-15/year (cleaner URL)

---

## 📝 Quick Commands Reference

### Start backend locally:
```bash
cd /workspaces/Prictionary/backend
npm start
```

### Start frontend locally:
```bash
cd /workspaces/Prictionary
python3 -m http.server 8000
```

### Deploy to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Check backend health:
```bash
curl https://your-backend-url.onrender.com/health
```

---

## 🎯 Next Steps

1. ✅ **Test locally** - Already running! Open two browser windows
2. ⬜ **Deploy backend to Render** - Follow Step 1 above
3. ⬜ **Update frontend config** - Add your Render URL
4. ⬜ **Enable GitHub Pages** - Takes 2 minutes
5. ⬜ **Share with friends** - Play and enjoy!

---

## 📞 Need Help?

**Common Issues:**
- Backend deployment: Check Render logs
- Frontend not loading: Check GitHub Pages status
- Connection errors: Verify URLs match in both places
- CORS errors: Update `FRONTEND_URL` in Render env vars

**Testing Checklist:**
- [ ] Backend health endpoint responds
- [ ] Frontend loads without errors
- [ ] Can create a room
- [ ] Can join a room with password
- [ ] Drawing syncs between players
- [ ] Guessing works and scores update
- [ ] Game completes all rounds

---

**You're ready to deploy! 🚀 The implementation is complete and tested locally.**

Good luck with your game! 🎨✨
