# Manual Backup Script for Baher Silver ERP Database
# Trigger manually before deploying migrations or major system changes

param (
    [string]$DbUrl = $env:DATABASE_URL,
    [string]$BackupDir = "d:\Ston\database\backup",
    [string]$Label = "manual_pre_deployment"
)

$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFile = Join-Path $BackupDir "baher_silver_erp_${Label}_$Timestamp.sql"

Write-Host "=====================================================" -ForegroundColor Gold
Write-Host "⚡ Triggering Manual Database Backup ($Label)..." -ForegroundColor Yellow

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

try {
    if (Get-Command pg_dump -ErrorAction SilentlyContinue) {
        pg_dump $DbUrl -F c -b -v -f "$BackupFile"
        Write-Host "✅ Manual Backup Created: $BackupFile" -ForegroundColor Green
    } else {
        $DevDb = "d:\Ston\apps\api-backend\prisma\dev.db"
        if (Test-Path $DevDb) {
            Copy-Item -Path $DevDb -Destination "$BackupDir\baher_silver_erp_${Label}_$Timestamp.db"
            Write-Host "✅ Manual Database Backup Created: baher_silver_erp_${Label}_$Timestamp.db" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "❌ Manual Backup Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host "=====================================================" -ForegroundColor Gold
