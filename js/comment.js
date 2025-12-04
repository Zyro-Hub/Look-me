// Comment System - Instagram-style popup modal
class CommentSystem {
    constructor() {
        this.db = null;
        this.currentVideoId = null;
        this.commentButton = null;
        this.commentModal = null;
        this.commentsContainer = null;
        this.commentInput = null;
        this.commentCount = null;
        this.isInitialized = false;
        this.currentUser = this.generateUserId();
        this.init();
    }

    // Initialize Firebase and UI
    async init() {
        try {
            // Check if Firebase config is available
            if (!FIREBASE_CONFIG) {
                console.error('Firebase config not loaded');
                return;
            }

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
                console.log('🔥 Firebase initialized');
            }

            this.db = firebase.database();
            this.createCommentUI();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('💬 Comment system ready');
        } catch (error) {
            console.error('Failed to initialize comment system:', error);
        }
    }

    // Generate unique user ID
    generateUserId() {
        let userId = localStorage.getItem('shorts_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
            localStorage.setItem('shorts_user_id', userId);
        }
        return userId;
    }

    // Create comment UI - Instagram style
    createCommentUI() {
        // Create floating comment button
        this.commentButton = document.createElement('button');
        this.commentButton.id = 'comment-btn';
        this.commentButton.className = 'comment-btn';
        this.commentButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            <span class="comment-badge" id="comment-badge">0</span>
        `;
        document.body.appendChild(this.commentButton);

        // Create modal popup
        this.commentModal = document.createElement('div');
        this.commentModal.id = 'comment-modal';
        this.commentModal.className = 'comment-modal';
        this.commentModal.innerHTML = `
            <div class="comment-modal-content">
                <div class="comment-modal-header">
                    <h3>Comments</h3>
                    <button class="comment-modal-close" id="comment-modal-close">
                        <svg viewBox="0 0 24 24" fill="white">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="comment-modal-body">
                    <div class="comments-list" id="comments-list">
                        <div class="comments-loading">
                            <div class="spinner"></div>
                            <p>Loading comments...</p>
                        </div>
                    </div>
                </div>
                <div class="comment-modal-footer">
                    <input type="text" id="comment-input" class="comment-input" placeholder="Add a comment..." maxlength="200">
                    <button id="send-comment" class="send-comment-btn">
                        <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.commentModal);

        this.commentsContainer = document.getElementById('comments-list');
        this.commentInput = document.getElementById('comment-input');
        this.commentCount = document.getElementById('comment-badge');
    }

    // Setup event listeners
    setupEventListeners() {
        // Open modal on button click
        this.commentButton.addEventListener('click', () => this.openModal());

        // Close modal
        document.getElementById('comment-modal-close').addEventListener('click', () => this.closeModal());

        // Close modal when clicking outside
        this.commentModal.addEventListener('click', (e) => {
            if (e.target === this.commentModal) {
                this.closeModal();
            }
        });

        // Send comment on button click
        document.getElementById('send-comment').addEventListener('click', () => this.sendComment());

        // Send comment on Enter key
        this.commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendComment();
            }
        });

        // Prevent background scroll when modal is open
        this.commentModal.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        });
    }

    // Open modal
    openModal() {
        this.commentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.commentInput.focus(), 300);
    }

    // Close modal
    closeModal() {
        this.commentModal.classList.remove('active');
        document.body.style.overflow = '';
        this.commentInput.value = '';
    }

    // Set current video
    setCurrentVideo(videoPath) {
        if (!this.isInitialized) return;

        // Generate unique ID from video path
        this.currentVideoId = this.generateVideoId(videoPath);
        console.log('📝 Loading comments for video:', this.currentVideoId);

        // Load comments for this video
        this.loadComments();
    }

    // Generate unique video ID
    generateVideoId(videoPath) {
        let hash = 0;
        for (let i = 0; i < videoPath.length; i++) {
            const char = videoPath.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'video_' + Math.abs(hash).toString(36);
    }

    // Load comments from Firebase
    loadComments() {
        if (!this.currentVideoId || !this.db) return;

        const commentsRef = this.db.ref(`comments/${this.currentVideoId}`);

        // Listen for new comments
        commentsRef.on('value', (snapshot) => {
            const comments = snapshot.val() || {};
            this.renderComments(comments);
        });
    }

    // Render comments
    renderComments(comments) {
        const commentArray = Object.entries(comments).map(([id, comment]) => ({
            id,
            ...comment
        }));

        // Sort by timestamp (newest first)
        commentArray.sort((a, b) => b.timestamp - a.timestamp);

        // Update count
        this.commentCount.textContent = commentArray.length;
        this.commentCount.style.display = commentArray.length > 0 ? 'flex' : 'none';

        // Clear and render
        this.commentsContainer.innerHTML = '';

        if (commentArray.length === 0) {
            this.commentsContainer.innerHTML = `
                <div class="no-comments">
                    <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" width="64" height="64">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    </svg>
                    <p class="no-comments-title">No comments yet</p>
                    <p class="no-comments-subtitle">Be the first to comment!</p>
                </div>
            `;
            return;
        }

        commentArray.forEach(comment => {
            this.renderComment(comment);
        });
    }

    // Render single comment
    renderComment(comment) {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment-item';
        commentEl.dataset.commentId = comment.id;

        const isOwnComment = comment.userId === this.currentUser;
        const timeAgo = this.getTimeAgo(comment.timestamp);

        commentEl.innerHTML = `
            <div class="comment-avatar" style="background: ${this.getAvatarColor(comment.userId)}">
                ${comment.username.charAt(0).toUpperCase()}
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-username">${this.escapeHtml(comment.username)}</span>
                    <span class="comment-time">${timeAgo}</span>
                </div>
                <div class="comment-text">${this.escapeHtml(comment.text)}</div>
                ${isOwnComment ? `
                    <button class="comment-delete" data-comment-id="${comment.id}">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Delete
                    </button>
                ` : ''}
            </div>
        `;

        this.commentsContainer.appendChild(commentEl);

        // Add delete handler
        if (isOwnComment) {
            const deleteBtn = commentEl.querySelector('.comment-delete');
            deleteBtn.addEventListener('click', () => this.deleteComment(comment.id));
        }
    }

    // Send comment
    async sendComment() {
        const text = this.commentInput.value.trim();

        if (!text || !this.currentVideoId || !this.db) {
            return;
        }

        // Get username
        let username = localStorage.getItem('shorts_username');
        if (!username) {
            username = 'User' + Math.floor(Math.random() * 10000);
            localStorage.setItem('shorts_username', username);
        }

        const comment = {
            userId: this.currentUser,
            username: username,
            text: text,
            timestamp: Date.now()
        };

        try {
            await this.db.ref(`comments/${this.currentVideoId}`).push(comment);
            this.commentInput.value = '';
            this.showFeedback('Comment posted! 💬');
        } catch (error) {
            console.error('Failed to post comment:', error);
            this.showFeedback('Failed to post comment ❌');
        }
    }

    // Delete comment
    async deleteComment(commentId) {
        if (!confirm('Delete this comment?')) return;

        try {
            await this.db.ref(`comments/${this.currentVideoId}/${commentId}`).remove();
            this.showFeedback('Comment deleted');
        } catch (error) {
            console.error('Failed to delete comment:', error);
            this.showFeedback('Failed to delete ❌');
        }
    }

    // Get avatar color
    getAvatarColor(userId) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
        ];
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    // Get time ago
    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h';
        if (seconds < 604800) return Math.floor(seconds / 86400) + 'd';
        return new Date(timestamp).toLocaleDateString();
    }

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show feedback
    showFeedback(message) {
        const feedback = document.createElement('div');
        feedback.className = 'comment-feedback';
        feedback.textContent = message;
        document.body.appendChild(feedback);

        setTimeout(() => feedback.classList.add('show'), 10);
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    // Cleanup
    cleanup() {
        if (this.currentVideoId && this.db) {
            this.db.ref(`comments/${this.currentVideoId}`).off();
        }
    }
}

// Create global instance
let commentSystem = null;

// Initialize after Firebase loads
window.addEventListener('load', () => {
    if (typeof firebase !== 'undefined') {
        commentSystem = new CommentSystem();
    } else {
        console.error('Firebase SDK not loaded');
    }
});
