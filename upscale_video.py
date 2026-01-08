import subprocess
import sys
import os

def find_ffmpeg():
    """
    Attempts to locate the ffmpeg binary in common locations.
    """
    # Check default path first
    if subprocess.call(["which", "ffmpeg"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) == 0:
        return "ffmpeg"
        
    common_paths = [
        "/usr/local/bin/ffmpeg",
        "/opt/homebrew/bin/ffmpeg",
        "/usr/bin/ffmpeg",
        "/bin/ffmpeg",
        os.path.expanduser("~/bin/ffmpeg"),
        os.path.expanduser("~/.local/bin/ffmpeg")
    ]
    
    for path in common_paths:
        if os.path.exists(path) and os.access(path, os.X_OK):
            return path
            
    return None

def upscale_video(input_file="Jarvis3.mp4", output_file="hero_3x_hq.mp4"):
    """
    Upscales the input video by 3x with HIGH QUALITY settings.
    Uses lanczos scaler for sharp upscaling and high bitrate for quality preservation.
    Outputs as MP4 (H.264) for maximum compatibility and quality.
    """
    
    ffmpeg_bin = find_ffmpeg()
    
    if not ffmpeg_bin:
        print("Error: 'ffmpeg' could not be found in PATH or common locations.")
        print("Please ensure it is installed and accessible.")
        return

    print(f"Using ffmpeg at: {ffmpeg_bin}")

    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        return

    print(f"Processing '{input_file}' -> '{output_file}'...")
    print("Applying 3x HIGH-QUALITY Upscale. This WILL take a while...")
    print("Using: lanczos scaler, CRF 18 (near-lossless), high preset")

    # FFmpeg command construction for HIGH QUALITY
    # -vf scale=iw*3:ih*3:flags=lanczos : Triple resolution with Lanczos scaling (sharpest)
    # -c:v libx264                       : Use H.264 codec for quality and compatibility
    # -crf 18                            : Constant Rate Factor (lower = better, 18 is near-lossless)
    # -preset slow                       : Slower encoding for better compression/quality
    # -an                                : Remove audio
    command = [
        ffmpeg_bin,
        "-i", input_file,
        "-vf", "scale=iw*3:ih*3:flags=lanczos",
        "-c:v", "libx264",
        "-crf", "18",
        "-preset", "slow",
        "-an",
        "-y",  # Overwrite output without asking
        output_file
    ]

    try:
        subprocess.run(command, check=True)
        print(f"\n✓ Success! High-quality output saved to '{output_file}'.")
        
        # Get file sizes for comparison
        input_size = os.path.getsize(input_file) / (1024 * 1024)
        output_size = os.path.getsize(output_file) / (1024 * 1024)
        print(f"  Input:  {input_size:.2f} MB")
        print(f"  Output: {output_size:.2f} MB")
        
    except subprocess.CalledProcessError as e:
        print(f"Error occurred during ffmpeg processing: {e}")

if __name__ == "__main__":
    upscale_video()
