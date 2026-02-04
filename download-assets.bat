@echo off
REM Download high-resolution game assets from S3
REM Crystal Rush - Asset Download Script (Windows)
REM Updated: February 4, 2026

echo ========================================
echo Crystal Rush - Asset Downloader
echo ========================================
echo.

REM Create directories
if not exist "assets\sprites" mkdir "assets\sprites"
if not exist "assets\backgrounds" mkdir "assets\backgrounds"

echo Directories created
echo.

REM Download character sprite sheet
echo Downloading character.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/a80a9e2f-93d3-4f1d-a699-2e00423be846.png" -o "assets\sprites\character.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

REM Download enemy sprite sheet  
echo Downloading enemies.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/6cba49c1-cc0a-4e61-9fee-70defc7ce5e9.png" -o "assets\sprites\enemies.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

REM Download items sprite sheet
echo Downloading items.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/e1c336e9-fd97-4478-9ff6-f559348d6598.png" -o "assets\sprites\items.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

REM Download tileset
echo Downloading tileset.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/38320c76-644b-40a7-b447-205df89e4fd2.png" -o "assets\sprites\tileset.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

REM Download backgrounds
echo Downloading mountains.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/6a10110f-e5db-4030-a3e1-f2679fb8e9db.png" -o "assets\backgrounds\mountains.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

echo Downloading hills.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/de65c130-14cd-474e-a48b-c786c7bdf767.png" -o "assets\backgrounds\hills.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

echo Downloading clouds.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/98c66ab9-d96a-4121-96e9-d9f25d345e14.png" -o "assets\backgrounds\clouds.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

echo Downloading trees.png...
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/b5446f38-d28b-4988-b0f1-e8a87a1bf589.png" -o "assets\backgrounds\trees.png"
if %errorlevel% equ 0 ( echo Downloaded ) else ( echo Failed )
echo.

echo ========================================
echo Complete! Ready to play.
echo ========================================
pause
