# Automated Daily Backup Script for Baher Silver ERP PostgreSQL Database
# Run as Cron Job / Windows Scheduled Task every midnight at 00:00

param (
    [string]$DbUrl = $env:DATABASE_URL,
    [string]$BackupDir = "d:\Ston\database\backup"
)

$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFile = Join-Path $BackupDir "baher_silver_erp_daily_$Timestamp.sql"

Write-Host "=====================================================" -ForegroundColor Gold
Write-Host "📦 Starting Daily Automatic Database Backup..." -ForegroundColor Cyan
Write-Host "Time: $(Get-Date)" -ForegroundColor Gray

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

try {
    # If PostgreSQL pg_dump is present
    if (Get-Command pg_dump -ErrorAction SilentlyContinue) {
        pg_dump $DbUrl -F c -b -v -f "$BackupFile"
        Write-Host "✅ Daily PostgreSQL Backup Created Successfully: $BackupFile" -ForegroundColor Green
    } else {
        # Backup SQLite / JSON fallback
        $DevDb = "d:\Ston\apps\api-backend\prisma\dev.db"
        if (Test-Path $DevDb) {
            Copy-Item -Path $DevDb -Destination "$BackupDir\baher_silver_erp_daily_$Timestamp.db"
            Write-Host "✅ Daily Database Copy Backup Created: baher_silver_erp_daily_$Timestamp.db" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "❌ Daily Backup Failed: $_" -ForegroundColor Red
    exit 1
}

# Keep only last 30 daily backups
Get-ChildItem –Path $BackupDir –Filter "baher_silver_erp_daily_*" | 
    Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-30) } | 
    Remove-Item -Force

Write-Host "🧹 Older backups cleaned up (Retained 30 days)." -ForegroundColor Gray
Write-Host "=====================================================" -ForegroundColor Gold
