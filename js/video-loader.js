// Video Loader - Handles loading and managing video files
class VideoLoader {
    constructor() {
        this.videoFolder = 'videos/';
        this.allVideos = [];
        this.unwatchedVideos = [];
        this.currentVideoIndex = -1;
        this.initialized = false;
    }

    // Initialize video list
    async init() {
        // Define all available videos manually
        // You need to add your video files to the videos folder
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
        ];

        this.updateUnwatchedList();
        this.initialized = true;
        return this.allVideos.length > 0;
    }

    // Update the list of unwatched videos
    updateUnwatchedList() {
        this.unwatchedVideos = this.allVideos.filter(video =>
            !storageManager.isWatched(video)
        );

        // If all videos are watched, reset and start over
        if (this.unwatchedVideos.length === 0 && this.allVideos.length > 0) {
            storageManager.resetWatchedVideos();
            this.unwatchedVideos = [...this.allVideos];
        }
    }

    // Get a random unwatched video
    getRandomUnwatchedVideo() {
        this.updateUnwatchedList();

        if (this.unwatchedVideos.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * this.unwatchedVideos.length);
        return this.unwatchedVideos[randomIndex];
    }

    // Get next video
    getNextVideo() {
        return this.getRandomUnwatchedVideo();
    }

    // Mark current video as watched
    markCurrentAsWatched(videoPath) {
        if (videoPath) {
            storageManager.markAsWatched(videoPath);
            this.updateUnwatchedList();
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
}

// Create global instance
const videoLoader = new VideoLoader();
