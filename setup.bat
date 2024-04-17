@echo off

REM Check Node.js version
node -v | findstr /i "v16.16.0" > nul
if %errorlevel% neq 0 (
    echo WARNING: not running with recommended Node version (v16)
)

REM Install packages defined in package.json
call npm install

REM Check if .dev.vars exists
if not exist ".dev.vars" (
    echo ERROR: .dev.vars not found.
    exit /b 1
)

REM Check if ngrok is installed
ngrok --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: ngrok is not installed.
    exit /b 1
)

REM Open new terminal and run ngrok
start cmd /k ngrok http 8787

REM Start project
call wrangler dev
