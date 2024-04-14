@echo off

REM Check Node.js version
node -v | findstr /i "v16.16.0" > nul
if %errorlevel% neq 0 (
    echo Node.js version must be v16.16.0 or higher.
    exit /b 1
)

REM Install packages defined in package.json
npm install

REM Check if .dev.vars exists
if not exist ".dev.vars" (
    echo .dev.vars file not found.
    exit /b 1
)

REM Check if ngrok is installed
ngrok --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ngrok is not installed.
    exit /b 1
)

REM Build project
node src/build.js

REM Start project
wrangler dev

REM Open new terminal and run ngrok
start cmd /k ngrok http 8787
