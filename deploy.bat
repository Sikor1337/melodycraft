@echo off
REM ============================================================
REM  MelodyCraft - publish to Cloudflare (https://melodycraft.io/)
REM  Checks types and tests, builds into dist/, uploads with wrangler.
REM  Needs a wrangler login on this computer (npx wrangler whoami).
REM ============================================================

cd /d "%~dp0"

echo Checking...
call npm run lint
if errorlevel 1 goto failed
call npm test
if errorlevel 1 goto failed

echo Building...
call npm run build
if errorlevel 1 goto failed

call npx wrangler deploy
if errorlevel 1 goto failed

echo.
echo ============================================================
echo  Deployed: https://melodycraft.io/
echo ============================================================
pause
exit /b 0

:failed
echo.
echo Failed - fix the error above and try again.
pause
exit /b 1
