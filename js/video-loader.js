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
'videos/DARKSIDE - Neoni (welcome to my darkside) Aesthetic Lyrics edit.mp4',
        'videos/Ego .....YOUTUBE-- FF EDITOR YTI #GamingReel #GameOn #GamerLife #ReelGaming #GameNight #fre.mp4',
        'videos/Kaise Hua Song ｜｜ by harsh chopda pranali rathod ｜｜ #song #op.mp4',
        'videos/Mujhe Peene Do - Darshan Raval.mp4',
        'videos/Talwinder stage concert in Mumbai ll Talwinder vibez ll.mp4',
        'videos/Tere Pyaar Ne Sare Aam Badnam Kar Diya ｜ Mujhe peene Do ｜ LoFl BADSHASH.mp4',
        'videos/The professor #daily #explore #insta #sad #viral.mp4',
        'videos/Understanding the World vs. Understanding the SelfWhen we begin to understand the world, its.mp4',
        'videos/Video by am.krisshna.mp4',
        'videos/Video by anime_lovers_t0.mp4',
        'videos/Video by bestofmusk.mp4',
        'videos/Video by bhratashreee.mp4',
        'videos/Video by brahmneeti.mp4',
        'videos/Video by brainhex_.mp4',
        'videos/Video by byimpactly.mp4',
        'videos/Video by darkmindfacts_.mp4',
        'videos/Video by destroywithpeaky.mp4',
        'videos/Video by divyaaaaansh_.mp4',
        'videos/Video by dusky_waffle.mp4',
        'videos/Video by entrepreneurialpath.s.mp4',
        'videos/Video by fantastic.cinemas.mp4',
        'videos/Video by findgreatestsongs.mp4',
        'videos/Video by grrowthon.mp4',
        'videos/Video by hindi_songs_reels.mp4',
        'videos/Video by i.m_darklife.mp4',
        'videos/Video by infinity_unveiled.mp4',
        'videos/Video by kishore_mondal_official.mp4',
        'videos/Video by lawofvibrationlife.mp4',
        'videos/Video by levi.__.sensei.mp4',
        'videos/Video by meta_current.mp4',
        'videos/Video by monolithicmotivation.mp4',
        'videos/Video by motivesensei.77.mp4',
        'videos/Video by powrwealth.mp4',
        'videos/Video by progeniusgroup.mp4',
        'videos/Video by psych_onyx.mp4',
        'videos/Video by psycrypt_.mp4',
        'videos/Video by pursuitsapp.mp4',
        'videos/Video by quantaflix.mp4',
        'videos/Video by quantumemerges.mp4',
        'videos/Video by quantumxparadoxx.mp4',
        'videos/Video by quotes_ayanokoji.mp4',
        'videos/Video by sanchit.gamedev.mp4',
        'videos/Video by sciencewithjahir.mp4',
        'videos/Video by scientific.historic.mp4',
        'videos/Video by shortmotivs1b.mp4',
        'videos/Video by siduncut.mp4',
        'videos/Video by sonnukumarr.mp4',
        'videos/Video by spygro.trends.mp4',
        'videos/Video by succe_ssstory143.mp4',
        'videos/Video by the.lucifer_logic.mp4',
        'videos/Video by theaiorbit.mp4',
        'videos/Video by tracingmind.mp4',
        'videos/Video by unfold.0.1.mp4',
        'videos/Video by unique_sayzz.mp4',
        'videos/Video by velocomic.mp4',
        'videos/Video by wiseon.24.mp4',
        'videos/Video by zemochessnutsseries.mp4',
        'videos/Video by zencademy_.mp4',
        'videos/Video by zorixfy.mp4',
        'videos/Video by _inspire_journey.mp4',
        'videos/Video by _kenji._.senpai.mp4',
        'videos/Video by _theblackchalk.mp4',
        'videos/Video by _theinspiry_.mp4'
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
