@echo off
REM Electric Meter Portal Deployment Script for Windows
REM This script builds and deploys the static Next.js application

setlocal enabledelayedexpansion

echo 🚀 Starting deployment process...

REM Configuration
if "%NODE_ENV%"=="" set NODE_ENV=production
set BUILD_DIR=out
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set BACKUP_DIR=backup-%YYYY%%MM%%DD%-%HH%%Min%%Sec%

echo [INFO] Checking dependencies...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    exit /b 1
)

echo [SUCCESS] Dependencies check passed

REM Create backup of existing deployment
if exist 