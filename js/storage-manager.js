// Storage Manager - Handles persistent storage of video states using localStorage
class StorageManager {
    constructor() {
        this.storageKey = 'shorts_watched_videos';
        this.watchedVideos = new Set();
        this.loadWatchedVideos();
    }

    // Load watched videos from localStorage
    loadWatchedVideos() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.watchedVideos = new Set(parsed);
                console.log(`Loaded ${this.watchedVideos.size} watched videos from storage`);
            }
        } catch (error) {
            console.error('Error loading watched videos:', error);
            this.watchedVideos = new Set();
        }
    }

    // Save watched videos to localStorage
    saveWatchedVideos() {
        try {
            const array = Array.from(this.watchedVideos);
            localStorage.setItem(this.storageKey, JSON.stringify(array));
            console.log(`Saved ${array.length} watched videos to localStorage`);
        } catch (error) {
            console.error('Error saving watched videos:', error);
        }
    }

    // Mark a video as watched
    markAsWatched(videoPath) {
        if (!videoPath) return;

        const wasWatched = this.watchedVideos.has(videoPath);
        this.watchedVideos.add(videoPath);

        if (!wasWatched) {
            this.saveWatchedVideos();
            console.log('Marked as watched:', videoPath);
        }
    }

    // Check if a video has been watched
    isWatched(videoPath) {
        return this.watchedVideos.has(videoPath);
    }

    // Reset all watched videos (start fresh)
    resetWatchedVideos() {
        this.watchedVideos.clear();
        this.saveWatchedVideos();
        console.log('All watched videos reset');
    }

    // Get count of watched videos
    getWatchedCount() {
        return this.watchedVideos.size;
    }

    // Get all watched videos
    getAllWatched() {
        return Array.from(this.watchedVideos);
    }
}

// Create global instance
const storageManager = new StorageManager();
