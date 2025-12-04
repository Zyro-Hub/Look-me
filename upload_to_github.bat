@echo off
echo =========================================
echo       AUTO GITHUB UPLOAD STARTED
echo =========================================

:: Ensure Git LFS is active
git lfs install >nul 2>&1

:: Track video formats (only first time needed, but safe to run always)
git lfs track "*.mp4"
git lfs track "*.webm"
git lfs track "*.mov"

:: Add gitattributes (in case LFS tracking updated)
git add .gitattributes

:: Add everything normally
git add .

:: FORCE add ignored 'videos/' folder
git add -f videos

:: Commit with current date/time
set commitMessage=Auto update %date% %time%
git commit -m "%commitMessage%"

:: Push to main branch
git push -u origin main

echo =========================================
echo       DONE! FILES UPLOADED SUCCESSFULLY
echo =========================================
pause
