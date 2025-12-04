// Playback Controls - Handles play/pause functionality
class PlaybackControls {
    constructor(videoElement) {
        this.video = videoElement;
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.playIcon = document.getElementById('play-icon');
        this.pauseIcon = document.getElementById('pause-icon');
        this.hideTimeout = null;
        this.init();
    }

    init() {
        // Click on video to play/pause
        this.video.addEventListener('click', () => this.togglePlayPause());

        // Click on button to play/pause
        this.playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlayPause();
        });

        // Show button on video state change
        this.video.addEventListener('play', () => this.updateButtonState());
        this.video.addEventListener('pause', () => this.updateButtonState());

        // Show button on tap/click
        this.video.addEventListener('click', () => this.showButton());
    }

    togglePlayPause() {
        if (this.video.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.video.play().catch(error => {
            console.error('Error playing video:', error);
        });
        this.updateButtonState();
    }

    pause() {
        this.video.pause();
        this.updateButtonState();
    }

    updateButtonState() {
        if (this.video.paused) {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
            this.showButton();
        } else {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
            this.showButton();
            this.autoHideButton();
        }
    }

    showButton() {
        this.playPauseBtn.classList.add('show');
        clearTimeout(this.hideTimeout);
    }

    hideButton() {
        this.playPauseBtn.classList.remove('show');
    }

    autoHideButton() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
            if (!this.video.paused) {
                this.hideButton();
            }
        }, 1000);
    }

    reset() {
        this.hideButton();
        clearTimeout(this.hideTimeout);
    }
}

// Will be initialized in app.js
let playbackControls = null;
