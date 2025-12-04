// Video Manifest - Auto-generated list of videos
// This file is automatically created by scanning the videos folder

// List of actual filenames in the videos folder
const VIDEO_FILENAMES = [
    "Ego ☠️.....🛑YOUTUBE-- FF EDITOR YTI  ✅#GamingReel #GameOn #GamerLife #ReelGaming #GameNight #fre.mp4",
    "Talwinder stage concert in Mumbai ll Talwinder vibez ll.mp4",
    "The professor #daily #explore #insta #sad #viral.mp4",
    "Understanding the World vs. Understanding the SelfWhen we begin to understand the world, its.mp4"
];

// Auto-encode the filenames for proper URL handling
const VIDEO_MANIFEST = VIDEO_FILENAMES.map(filename =>
    'videos/' + encodeURIComponent(filename)
);

console.log('Video manifest loaded with', VIDEO_MANIFEST.length, 'videos');
