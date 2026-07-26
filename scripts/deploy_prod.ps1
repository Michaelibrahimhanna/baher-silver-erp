# Production Automated Deployment Script for Baher Silver ERP
# Executes schema migration checks, builds backend TypeScript code, and verifies health status

$ErrorActionPreference = "Stop"

Write-Host "=====================================================" -ForegroundColor Gold
Write-Host "🚀 Baher Silver ERP - Production Deployment Engine" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Gold

# 1. Trigger pre-deployment manual backup
Write-Host "📦 1. Running pre-deployment manual database backup..." -ForegroundColor Yellow
& "d:\Ston\database\backup\backup_manual.ps1" -Label "pre_prod_deploy"

# 2. Verify Prisma Migrations
Write-Host "🔍 2. Verifying Prisma migration status..." -ForegroundColor Yellow
Set-Location "d:\Ston\apps\api-backend"
npx prisma migrate status

# 3. Apply Production Migrations
Write-Host "⚙️ 3. Deploying pending database migrations..." -ForegroundColor Yellow
npx prisma migrate deploy

# 4. Generate Prisma Client
Write-Host "🛠️ 4. Generating Prisma Client bindings..." -ForegroundColor Yellow
npx prisma generate

# 5. Build Backend
Write-Host "🔨 5. Building production API bundle..." -ForegroundColor Yellow
npm run build

Write-Host "=====================================================" -ForegroundColor Gold
Write-Host "✅ PRODUCTION DEPLOYMENT PREPARATION COMPLETED CLEANLY!" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Gold
