// Main App - Coordinates all modules
class ShortsApp {
    constructor() {
        this.video = document.getElementById('video-player');
        this.currentVideoPath = null;
        this.videoHistory = [];
        this.historyIndex = -1;
        this.videoIdMap = new Map(); // Map video IDs to paths
        window.shortsApp = this; // Make accessible to share system
        this.init();
    }

    async init() {
        console.log('Initializing Shorts App...');

        // Initialize video loader
        const hasVideos = await videoLoader.init();

        if (!hasVideos) {
            this.showError('No videos found. Please add videos to the videos folder.');
            return;
        }

        console.log(`Found ${videoLoader.getTotalCount()} videos`);

        // Initialize scroll navigation
        scrollNavigation = new ScrollNavigation(
            this.video,
            () => this.loadNextVideo(),
            () => this.loadPrevVideo()
        );

        // Initialize playback controls
        playbackControls = new PlaybackControls(this.video);

        // Check if there's a video ID in URL
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');

        if (videoId && window.pendingVideoId) {
            // Load video from shared link
            this.loadVideoById(videoId);
        } else {
            // Load first random video
            this.loadNextVideo();
        }

        // Enable user interaction
        this.setupInteractionHandlers();
    }

    setupInteractionHandlers() {
        // Auto-play on user interaction
        document.addEventListener('click', () => this.enableAutoplay(), { once: true });
        document.addEventListener('touchstart', () => this.enableAutoplay(), { once: true });

        // Auto-load next video when current ends
        this.video.addEventListener('ended', () => {
            this.loadNextVideo();
        });

        // Handle video errors
        this.video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            this.loadNextVideo(); // Skip to next video on error
        });
    }

    loadNextVideo() {
        const nextVideo = videoLoader.getNextVideo();

        if (!nextVideo) {
            console.log('No more unwatched videos available');
            return;
        }

        // Add to history
        if (this.historyIndex < this.videoHistory.length - 1) {
            this.videoHistory = this.videoHistory.slice(0, this.historyIndex + 1);
        }
        this.videoHistory.push(nextVideo);
        this.historyIndex++;

        // Load new video
        this.loadVideo(nextVideo);
    }

    loadPrevVideo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const prevVideo = this.videoHistory[this.historyIndex];
            this.loadVideo(prevVideo, false);
        }
    }

    loadVideo(videoPath, autoplay = true) {
        console.log('Loading video:', videoPath);
        this.currentVideoPath = videoPath;
        this.video.src = videoPath;

        // Mark as watched IMMEDIATELY when video loads
        if (videoPath) {
            videoLoader.markCurrentAsWatched(videoPath);
        }

        // Update share system with current video
        if (typeof shareSystem !== 'undefined') {
            shareSystem.setCurrentVideo(videoPath);
            const videoId = shareSystem.generateVideoId(videoPath);
            this.videoIdMap.set(videoId, videoPath);

            // Update URL with video ID
            this.updateURL(videoId);
        }

        // Update comment system with current video
        if (typeof commentSystem !== 'undefined' && commentSystem) {
            commentSystem.cleanup();
            commentSystem.setCurrentVideo(videoPath);
        }

        if (autoplay) {
            this.video.load();
            this.video.play().catch(error => {
                console.log('Autoplay prevented:', error);
            });
        } else {
            this.video.load();
        }

        // Update controls
        if (playbackControls) {
            playbackControls.reset();
        }
    }

    // Update URL with video ID
    updateURL(videoId) {
        const newURL = `${window.location.pathname}?v=${videoId}`;
        window.history.replaceState({ videoId }, '', newURL);
    }

    // Load video by ID (for share system)
    loadVideoById(videoId) {
        const videoPath = this.videoIdMap.get(videoId);
        if (videoPath) {
            this.loadVideo(videoPath);
        } else {
            // Search through all videos to find matching ID
            const allVideos = videoLoader.getAllVideos();
            for (const path of allVideos) {
                if (shareSystem.generateVideoId(path) === videoId) {
                    this.loadVideo(path);
                    return;
                }
            }
        }
    }

    enableAutoplay() {
        if (this.video.paused) {
            this.video.play().catch(error => {
                console.log('Autoplay error:', error);
            });
        }
    }

    showError(message) {
        console.error(message);
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(220, 38, 38, 0.95);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            font-size: 18px;
            z-index: 1000;
            max-width: 400px;
            text-align: center;
            backdrop-filter: blur(10px);
            font-family: 'Inter', sans-serif;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
            <div style="font-weight: 600; margin-bottom: 10px;">Oops!</div>
            <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ShortsApp());
} else {
    new ShortsApp();
}
