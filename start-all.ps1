# Start both backend and frontend with one command
# Run this from C:\Users\moham\DERMA-ai

# 1. Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev"

# 2. Wait a moment for backend to start
Start-Sleep 5

# 3. Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd scratch/mednexa-repo; if (-not (Test-Path .env.local)) { 'NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1' | Out-File .env.local }; npm run dev"

Write-Host "Backend: http://localhost:3001/api" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:3001/docs" -ForegroundColor Green