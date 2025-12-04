"""
Video Downloader for YouTube, Instagram, and Shorts
Reads links from link.txt and downloads videos to videos/ folder
"""

import os
import sys
from pathlib import Path

try:
    import yt_dlp
except ImportError:
    print("❌ yt-dlp not installed!")
    print("📦 Installing yt-dlp...")
    os.system(f"{sys.executable} -m pip install yt-dlp")
    import yt_dlp

# Configuration
LINKS_FILE = "link.txt"
OUTPUT_DIR = "videos"
MAX_FILENAME_LENGTH = 100

# Create videos directory if it doesn't exist
Path(OUTPUT_DIR).mkdir(exist_ok=True)


def sanitize_filename(filename):
    """Clean filename and limit length"""
    # Remove invalid characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '')
    
    # Limit length
    if len(filename) > MAX_FILENAME_LENGTH:
        name, ext = os.path.splitext(filename)
        filename = name[:MAX_FILENAME_LENGTH - len(ext)] + ext
    
    return filename


def download_video(url, index, total):
    """Download a single video from URL"""
    print(f"\n{'='*60}")
    print(f"📥 Downloading {index}/{total}")
    print(f"🔗 URL: {url}")
    print(f"{'='*60}")
    
    # yt-dlp options for best quality with audio
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': f'{OUTPUT_DIR}/%(title)s.%(ext)s',
        'merge_output_format': 'mp4',
        'quiet': False,
        'no_warnings': False,
        'progress_hooks': [progress_hook],
        # Fix YouTube 403 errors
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-us,en;q=0.5',
            'Sec-Fetch-Mode': 'navigate',
        },
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web'],
                'skip': ['hls', 'dash', 'translated_subs']
            }
        },
        'postprocessors': [{
            'key': 'FFmpegVideoConvertor',
            'preferedformat': 'mp4',
        }],
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Get video info
            info = ydl.extract_info(url, download=False)
            title = info.get('title', 'Unknown')
            duration = info.get('duration', 0)
            
            print(f"📹 Title: {title}")
            print(f"⏱️  Duration: {duration}s")
            
            # Download
            ydl.download([url])
            
            print(f"✅ Downloaded successfully!")
            return True
            
    except Exception as e:
        print(f"❌ Error downloading: {str(e)}")
        return False


def progress_hook(d):
    """Show download progress"""
    if d['status'] == 'downloading':
        percent = d.get('_percent_str', 'N/A')
        speed = d.get('_speed_str', 'N/A')
        eta = d.get('_eta_str', 'N/A')
        print(f"\r⏬ Progress: {percent} | Speed: {speed} | ETA: {eta}", end='', flush=True)
    elif d['status'] == 'finished':
        print(f"\n🔄 Processing video...")


def read_links():
    """Read links from link.txt file"""
    if not os.path.exists(LINKS_FILE):
        print(f"❌ {LINKS_FILE} not found!")
        print(f"📝 Creating example {LINKS_FILE}...")
        
        # Create example file
        with open(LINKS_FILE, 'w', encoding='utf-8') as f:
            f.write("# Add your video links here (one per line)\n")
            f.write("# Supports: YouTube, Instagram, YouTube Shorts, and more\n")
            f.write("# Example:\n")
            f.write("# https://www.youtube.com/watch?v=dQw4w9WgXcQ\n")
            f.write("# https://www.instagram.com/reel/xxxxx/\n")
            f.write("# https://youtube.com/shorts/xxxxx\n")
        
        print(f"✅ Created {LINKS_FILE}. Please add your links and run again.")
        return []
    
    # Read links
    links = []
    with open(LINKS_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            # Skip empty lines and comments
            if line and not line.startswith('#'):
                links.append(line)
    
    return links


def main():
    """Main function"""
    print("=" * 60)
    print("🎬 VIDEO DOWNLOADER")
    print("=" * 60)
    
    # Update yt-dlp to latest version
    print("🔄 Checking for yt-dlp updates...")
    try:
        os.system(f"{sys.executable} -m pip install --upgrade --quiet yt-dlp")
        print("✅ yt-dlp is up to date")
    except:
        print("⚠️  Could not update yt-dlp")
    
    print()
    print(f"📁 Output directory: {OUTPUT_DIR}/")
    print(f"📄 Reading links from: {LINKS_FILE}")
    print()
    
    # Read links
    links = read_links()
    
    if not links:
        print("⚠️  No links found in link.txt")
        return
    
    print(f"📋 Found {len(links)} link(s)")
    
    # Confirm before downloading
    response = input(f"\n⚡ Start downloading {len(links)} video(s)? (y/n): ")
    if response.lower() != 'y':
        print("❌ Download cancelled")
        return
    
    # Download all videos
    successful = 0
    failed = 0
    
    for i, url in enumerate(links, 1):
        if download_video(url, i, len(links)):
            successful += 1
        else:
            failed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 DOWNLOAD SUMMARY")
    print("=" * 60)
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"📁 Videos saved in: {OUTPUT_DIR}/")
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Download interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
