# Database Restore Utility Script for Baher Silver ERP
# Restores PostgreSQL database from a specified backup SQL file

param (
    [Parameter(Mandatory=$true)]
    [string]$BackupFilePath,
    [string]$TargetDbUrl = $env:DATABASE_URL
)

Write-Host "=====================================================" -ForegroundColor Gold
Write-Host "⚠️ WARNING: RESTORING DATABASE FROM BACKUP FILE!" -ForegroundColor Red
Write-Host "File: $BackupFilePath" -ForegroundColor Yellow
Write-Host "Target: $TargetDbUrl" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Gold

if (-not (Test-Path $BackupFilePath)) {
    Write-Host "❌ Error: Backup file not found at '$BackupFilePath'" -ForegroundColor Red
    exit 1
}

$Confirmation = Read-Host "Are you sure you want to restore the database? Type 'RESTORE' to proceed"
if ($Confirmation -ne "RESTORE") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

try {
    if (Get-Command pg_restore -ErrorAction SilentlyContinue) {
        pg_restore --clean --if-exists --no-owner --dbname=$TargetDbUrl "$BackupFilePath"
        Write-Host "✅ Database Restored Successfully from $BackupFilePath!" -ForegroundColor Green
    } else {
        if ($BackupFilePath.EndsWith(".db")) {
            Copy-Item -Path $BackupFilePath -Destination "d:\Ston\apps\api-backend\prisma\dev.db" -Force
            Write-Host "✅ Local DB File Restored Successfully!" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "❌ Database Restore Failed: $_" -ForegroundColor Red
    exit 1
}
