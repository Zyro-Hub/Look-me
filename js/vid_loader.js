// Auto Video Loader - Automatically discovers and loads videos from videos folder
class VidLoader {
    constructor() {
        this.videoFolder = 'videos/';
        this.allVideos = [];
        this.unwatchedVideos = [];
        this.videoQueue = []; // Shuffled queue for better distribution
        this.recentlyWatched = []; // Track recent videos to avoid immediate repeats
        this.maxRecentlyWatched = 5; // Don't repeat last 5 videos
        this.currentVideoIndex = -1;
        this.initialized = false;
        this.supportedFormats = ['.mp4', '.webm', '.ogg', '.mov'];
    }

    // Auto-discover videos from the videos folder
    async init() {
        try {
            await this.autoDiscoverVideos();

            if (this.allVideos.length === 0) {
                console.log('No videos found, trying fallback...');
                this.initFallback();
            }

            this.updateUnwatchedList();
            this.refreshQueue(); // Initialize the queue
            this.initialized = true;
            return this.allVideos.length > 0;
        } catch (error) {
            console.error('Error initializing video loader:', error);
            return false;
        }
    }

    // Auto-discover videos using multiple methods
    async autoDiscoverVideos() {
        // Method 1: Try to use the manifest file if it exists
        if (typeof VIDEO_MANIFEST !== 'undefined' && VIDEO_MANIFEST.length > 0) {
            console.log('Using video manifest:', VIDEO_MANIFEST);
            this.allVideos = [...VIDEO_MANIFEST];
            return;
        }

        // Method 2: Try to fetch the videos folder index
        try {
            const response = await fetch(this.videoFolder);
            if (response.ok) {
                const text = await response.text();
                this.parseVideoFiles(text);
                if (this.allVideos.length > 0) {
                    console.log('Found videos from directory listing');
                    return;
                }
            }
        } catch (error) {
            console.log('Directory listing failed:', error);
        }

        // Method 3: Try common video file names
        console.log('Trying common filenames...');
        await this.tryCommonNames();
    }

    // Parse HTML directory listing for video files
    parseVideoFiles(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && this.isVideoFile(href)) {
                this.allVideos.push(this.videoFolder + href);
            }
        });
    }

    // Try common video file names
    async tryCommonNames() {
        const commonNames = [];

        // Try numbered videos (video1.mp4, video2.mp4, etc.)
        for (let i = 1; i <= 50; i++) {
            for (const ext of this.supportedFormats) {
                commonNames.push(`video${i}${ext}`);
                commonNames.push(`${i}${ext}`);
            }
        }

        // Try to check which files exist
        const existingVideos = await this.checkFilesExist(commonNames);
        this.allVideos = existingVideos.map(name => this.videoFolder + name);
    }

    // Check which files actually exist
    async checkFilesExist(fileNames) {
        const existing = [];

        for (const fileName of fileNames) {
            try {
                const response = await fetch(this.videoFolder + fileName, { method: 'HEAD' });
                if (response.ok) {
                    existing.push(fileName);
                }
            } catch (error) {
                // File doesn't exist, skip
            }
        }

        return existing;
    }

    // Check if a file is a video file
    isVideoFile(filename) {
        const lower = filename.toLowerCase();
        return this.supportedFormats.some(ext => lower.endsWith(ext));
    }

    // Fallback initialization with common filenames
    initFallback() {
        // Define common video file patterns
        this.allVideos = [
            'videos/video1.mp4',
            'videos/video2.mp4',
            'videos/video3.mp4',
            'videos/video4.mp4',
            'videos/video5.mp4',
            'videos/video6.mp4',
            'videos/video7.mp4',
            'videos/video8.mp4',
            'videos/video9.mp4',
            'videos/video10.mp4'
        ].filter(path => this.checkVideoExists(path));

        this.updateUnwatchedList();
        this.initialized = true;
        return this.allVideos.length > 0;
    }

    // Synchronously check if video exists (for fallback)
    checkVideoExists(path) {
        // We'll verify this when loading
        return true; // Optimistically include it
    }

    // Update the list of unwatched videos
    updateUnwatchedList() {
        this.unwatchedVideos = this.allVideos.filter(video =>
            !storageManager.isWatched(video)
        );

        // If all videos are watched, reset and start over
        if (this.unwatchedVideos.length === 0 && this.allVideos.length > 0) {
            console.log('🔄 All videos watched! Starting fresh cycle...');
            storageManager.resetWatchedVideos();
            this.unwatchedVideos = [...this.allVideos];
            this.recentlyWatched = []; // Clear recent history on reset
        }

        console.log(`📊 Unwatched: ${this.unwatchedVideos.length}/${this.allVideos.length} | Queue: ${this.videoQueue.length}`);
    }

    // Refresh the video queue with shuffled unwatched videos
    refreshQueue() {
        this.updateUnwatchedList();

        // Create a shuffled queue from unwatched videos
        // Exclude recently watched videos from the queue
        const availableVideos = this.unwatchedVideos.filter(
            video => !this.recentlyWatched.includes(video)
        );

        // If we've excluded too many, just use unwatched
        const videosToQueue = availableVideos.length > 0 ? availableVideos : this.unwatchedVideos;

        this.videoQueue = this.shuffleArray([...videosToQueue]);
        console.log(`🔀 Queue refreshed with ${this.videoQueue.length} videos (excluding ${this.recentlyWatched.length} recent)`);
    }

    // Shuffle array using Fisher-Yates algorithm (perfect shuffle)
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Get next video with improved algorithm
    getNextVideo() {
        // Refresh queue if empty
        if (this.videoQueue.length === 0) {
            this.refreshQueue();
        }

        // If still no videos, return null
        if (this.videoQueue.length === 0) {
            console.warn('⚠️ No videos available');
            return null;
        }

        // Pop the next video from the queue
        const nextVideo = this.videoQueue.shift();

        // Add to recently watched (limited size)
        this.recentlyWatched.unshift(nextVideo);
        if (this.recentlyWatched.length > this.maxRecentlyWatched) {
            this.recentlyWatched.pop();
        }

        console.log(`🎬 Next video from queue (${this.videoQueue.length} remaining):`, nextVideo);
        return nextVideo;
    }

    // Mark current video as watched
    markCurrentAsWatched(videoPath) {
        if (videoPath) {
            storageManager.markAsWatched(videoPath);
            this.updateUnwatchedList();

            // If queue is getting low, refresh it proactively
            if (this.videoQueue.length < 3 && this.unwatchedVideos.length > 0) {
                console.log('⚡ Queue running low, refreshing...');
                this.refreshQueue();
            }
        }
    }

    // Get total video count
    getTotalCount() {
        return this.allVideos.length;
    }

    // Get unwatched video count
    getUnwatchedCount() {
        return this.unwatchedVideos.length;
    }

    // Get queue size
    getQueueSize() {
        return this.videoQueue.length;
    }

    // Get all discovered videos
    getAllVideos() {
        return [...this.allVideos];
    }

    // Get statistics
    getStats() {
        return {
            total: this.allVideos.length,
            unwatched: this.unwatchedVideos.length,
            watched: this.allVideos.length - this.unwatchedVideos.length,
            queueSize: this.videoQueue.length,
            recentCount: this.recentlyWatched.length
        };
    }
}

// Create global instance
const videoLoader = new VidLoader();
