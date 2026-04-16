# === 直接使用绝对路径进行测试 ===
$backendDir = "C:\Users\user\MyProject\TaskManager\backend\TaskManager.Api"
$frontendDir = "C:\Users\user\MyProject\TaskManager\frontend\task-manager"

Write-Host "Starting Task Manager Full-Stack Application..." -ForegroundColor Green
Write-Host "Backend Directory: $backendDir"
Write-Host "Frontend Directory: $frontendDir"

# 检查目录是否存在 (现在用绝对路径检查)
if (-Not (Test-Path $backendDir -PathType Container)) {
    Write-Error "Backend directory not found: $backendDir"
    exit 1
}

if (-Not (Test-Path $frontendDir -PathType Container)) {
    Write-Error "Frontend directory not found: $frontendDir"
    exit 1
}

# 启动后端服务器
Write-Host "Launching backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run" -WorkingDirectory $backendDir

# 启动前端服务器
Write-Host "Launching frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WorkingDirectory $frontendDir

Write-Host "Both servers should be starting now." -ForegroundColor Green