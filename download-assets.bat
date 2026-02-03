@echo off
REM Crystal Rush - Asset Download Script
REM Downloads all graphics to local assets folder

echo ========================================
echo Crystal Rush - Asset Downloader
echo ========================================
echo.

REM Create assets directory structure
if not exist "assets" mkdir assets
if not exist "assets\sprites" mkdir assets\sprites
if not exist "assets\backgrounds" mkdir assets\backgrounds

echo Creating directories...
echo [OK] assets\
echo [OK] assets\sprites\
echo [OK] assets\backgrounds\
echo.

echo Downloading sprite sheets...
echo.

REM Download Character Sprite
echo [1/8] Downloading character.png...
curl -L -o "assets\sprites\character.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/fa44d568-0299-47bd-ae9a-df62953fcc7d.png"
if %errorlevel% equ 0 (echo [OK] character.png) else (echo [FEHLER] character.png)

REM Download Enemy Sprite
echo [2/8] Downloading enemies.png...
curl -L -o "assets\sprites\enemies.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/bf3bf5c5-b432-4cf5-98a0-3ec2177ddc58.png"
if %errorlevel% equ 0 (echo [OK] enemies.png) else (echo [FEHLER] enemies.png)

REM Download Items
echo [3/8] Downloading items.png...
curl -L -o "assets\sprites\items.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/1523642d-8b01-4138-b6f1-4d6a67778974.png"
if %errorlevel% equ 0 (echo [OK] items.png) else (echo [FEHLER] items.png)

REM Download Tileset
echo [4/8] Downloading tileset.png...
curl -L -o "assets\sprites\tileset.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/f0b5fa87-097c-4351-af8b-f8ce910af243.png"
if %errorlevel% equ 0 (echo [OK] tileset.png) else (echo [FEHLER] tileset.png)

echo.
echo Downloading parallax backgrounds...
echo.

REM Download Mountains
echo [5/8] Downloading bg_mountains.png...
curl -L -o "assets\backgrounds\mountains.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/772c6f02-d4ed-4230-9ce5-d0a0170acd7c.png"
if %errorlevel% equ 0 (echo [OK] mountains.png) else (echo [FEHLER] mountains.png)

REM Download Hills
echo [6/8] Downloading bg_hills.png...
curl -L -o "assets\backgrounds\hills.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4559f7a6-be83-4e06-93c3-fe20966985b9.png"
if %errorlevel% equ 0 (echo [OK] hills.png) else (echo [FEHLER] hills.png)

REM Download Clouds
echo [7/8] Downloading bg_clouds.png...
curl -L -o "assets\backgrounds\clouds.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/5d729062-9767-4c3f-9084-3b09f7c55d8b.png"
if %errorlevel% equ 0 (echo [OK] clouds.png) else (echo [FEHLER] clouds.png)

REM Download Trees
echo [8/8] Downloading bg_trees.png...
curl -L -o "assets\backgrounds\trees.png" "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/59e53348-3c06-4a27-b894-627d7cee7863.png"
if %errorlevel% equ 0 (echo [OK] trees.png) else (echo [FEHLER] trees.png)

echo.
echo ========================================
echo Download abgeschlossen!
echo ========================================
echo.
echo Grafiken gespeichert in:
echo - assets\sprites\
echo - assets\backgrounds\
echo.
echo Naechster Schritt:
echo 1. Pruefe die Dateien im assets Ordner
echo 2. Starte das Spiel: http://localhost/game
echo.
pause
