// Scroll Navigation - Handles vertical scrolling like YouTube Shorts
class ScrollNavigation {
    constructor(videoElement, onNextVideo, onPrevVideo) {
        this.video = videoElement;
        this.onNextVideo = onNextVideo;
        this.onPrevVideo = onPrevVideo;
        this.container = document.getElementById('video-container');
        this.indicators = document.getElementById('scroll-indicators');
        this.scrollUpBtn = document.querySelector('.scroll-up');
        this.scrollDownBtn = document.querySelector('.scroll-down');

        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isScrolling = false;
        this.scrollThreshold = 50;

        // Improved scroll control
        this.wheelTimeout = null;
        this.wheelDelta = 0;
        this.wheelDebounceTime = 150; // Smoother debounce

        this.init();
    }

    init() {
        // Touch events for mobile
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Wheel event for desktop - improved
        this.container.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Button clicks
        this.scrollUpBtn.addEventListener('click', () => this.navigatePrev());
        this.scrollDownBtn.addEventListener('click', () => this.navigateNext());

        // Show indicators on hover/touch
        this.container.addEventListener('mouseenter', () => this.showIndicators());
        this.container.addEventListener('mouseleave', () => this.hideIndicators());
        this.container.addEventListener('touchstart', () => this.showIndicators());
        setTimeout(() => this.hideIndicators(), 3000);
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        this.touchEndY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        if (this.isScrolling) return;

        const difference = this.touchStartY - this.touchEndY;

        if (Math.abs(difference) > this.scrollThreshold) {
            if (difference > 0) {
                // Swiped up - next video
                this.navigateNext();
            } else {
                // Swiped down - previous video
                this.navigatePrev();
            }
        }
    }

    handleWheel(e) {
        if (this.isScrolling) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        // Accumulate wheel delta for smoother control
        this.wheelDelta += e.deltaY;

        // Clear existing timeout
        clearTimeout(this.wheelTimeout);

        // Debounce wheel events
        this.wheelTimeout = setTimeout(() => {
            if (Math.abs(this.wheelDelta) > 50) {
                if (this.wheelDelta > 0) {
                    this.navigateNext();
                } else {
                    this.navigatePrev();
                }
            }
            this.wheelDelta = 0;
        }, this.wheelDebounceTime);
    }

    handleKeyboard(e) {
        if (this.isScrolling) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                this.navigateNext();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.navigatePrev();
                break;
            case ' ':
                e.preventDefault();
                if (playbackControls) {
                    playbackControls.togglePlayPause();
                }
                break;
        }
    }

    navigateNext() {
        if (this.isScrolling) return;

        this.isScrolling = true;
        this.animateTransition('up');

        setTimeout(() => {
            if (this.onNextVideo) {
                this.onNextVideo();
            }
            this.isScrolling = false;
        }, 400); // Smoother timing
    }

    navigatePrev() {
        if (this.isScrolling) return;

        this.isScrolling = true;
        this.animateTransition('down');

        setTimeout(() => {
            if (this.onPrevVideo) {
                this.onPrevVideo();
            }
            this.isScrolling = false;
        }, 400); // Smoother timing
    }

    animateTransition(direction) {
        const translateY = direction === 'up' ? '-100%' : '100%';

        // Smooth slide out
        this.video.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
        this.video.style.transform = `translateY(${translateY})`;
        this.video.style.opacity = '0';

        // Reset position after a short delay
        setTimeout(() => {
            this.video.style.transition = 'none';
            this.video.style.transform = 'translateY(0)';
            this.video.style.opacity = '1';

            // Re-enable transitions
            setTimeout(() => {
                this.video.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 50);
        }, 400);
    }

    showIndicators() {
        this.indicators.classList.add('show');
    }

    hideIndicators() {
        this.indicators.classList.remove('show');
    }
}

// Will be initialized in app.js
let scrollNavigation = null;
