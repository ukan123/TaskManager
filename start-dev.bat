@echo off
echo Starting Task Manager Full-Stack Application...

REM 获取当前脚本所在目录
set SCRIPT_DIR=%~dp0

echo Launching backend server...
start cmd /k "cd /d "%SCRIPT_DIR%backend\TaskManager.Api" && dotnet run"

timeout /t 3 /nobreak >nul

echo Launching frontend server...
start cmd /k "cd /d "%SCRIPT_DIR%frontend\task-manager" && npm run dev"

echo Both servers should be starting now!
pause