# YouTube Shorts-Style Video Player

A full-screen video player inspired by YouTube Shorts with modular architecture.

## Features

✅ **Full-Screen Auto-Load** - Videos automatically play in full-screen mode  
✅ **Play/Pause Controls** - Click anywhere or use the center button  
✅ **Vertical Scroll Navigation** - Swipe/scroll up for next video, down for previous  
✅ **Smart Video Selection** - Random unwatched videos with localStorage tracking  
✅ **Auto-Reset** - Automatically restarts when all videos are watched  
✅ **No UI Clutter** - Clean interface without titles or extra headings  
✅ **Modular Code** - Separate JS and CSS files for each feature  

## Project Structure

```
GG/
├── index.html
├── css/
│   ├── base.css           # Global styles and reset
│   ├── video-player.css   # Video element styling
│   ├── controls.css       # Play/pause button styling
│   └── scroll.css         # Navigation indicators styling
├── js/
│   ├── storage-manager.js # localStorage for watched videos
│   ├── video-loader.js    # Video file loading and selection
│   ├── playback-controls.js # Play/pause functionality
│   ├── scroll-navigation.js # Vertical scroll handling
│   └── app.js             # Main app coordinator
└── videos/
    ├── video1.mp4
    ├── video2.mp4
    └── ... (add your videos here)
```

## Setup Instructions

### 1. Add Your Videos

1. Create a `videos` folder in the project root
2. Add your video files (MP4 format recommended)
3. Update the video list in `js/video-loader.js`:

```javascript
this.allVideos = [
    'videos/video1.mp4',
    'videos/video2.mp4',
    'videos/video3.mp4',
    // Add more videos here
];
```

### 2. Run the Application

Open `index.html` in a web browser. For best results:
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Allow fullscreen when prompted
- Click anywhere to start playback

### 3. Controls

- **Play/Pause**: Click anywhere on the video or tap the center button
- **Next Video**: Scroll down, swipe up, or press ↓/PageDown
- **Previous Video**: Scroll up, swipe down, or press ↑/PageUp
- **Spacebar**: Toggle play/pause

## Module Description

### storage-manager.js
Handles localStorage operations:
- Tracks which videos have been watched
- Saves/loads watch history
- Resets when all videos are watched

### video-loader.js
Manages video files:
- Loads video list
- Selects random unwatched videos
- Marks videos as watched

### playback-controls.js
Controls playback:
- Play/pause toggle
- Button state management
- Auto-hide controls

### scroll-navigation.js
Handles navigation:
- Touch/swipe gestures
- Mouse wheel scrolling
- Keyboard shortcuts
- Smooth transitions

### app.js
Main coordinator:
- Initializes all modules
- Manages video flow
- Handles fullscreen
- Coordinates between modules

## Customization

### Change Video Duration Limit
The app auto-loads videos under 2 minutes. To change this, modify the video selection logic in `video-loader.js`.

### Adjust Scroll Sensitivity
In `scroll-navigation.js`, change:
```javascript
this.scrollThreshold = 50; // Increase for less sensitive scrolling
```

### Modify Button Auto-Hide Time
In `playback-controls.js`, change:
```javascript
setTimeout(() => {
    if (!this.video.paused) {
        this.hideButton();
    }
}, 1000); // Change to desired milliseconds
```

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- Videos must be in a supported format (MP4, WebM)
- Autoplay may be blocked by browser policies - click to start
- Fullscreen may require user permission
- localStorage is used to track watched videos (persists across sessions)
