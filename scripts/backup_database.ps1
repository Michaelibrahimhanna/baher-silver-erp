# Database Backup Dispatcher Script for Baher Silver ERP
# Proxy script for running daily or manual database backups

param (
    [string]$Mode = "daily"
)

if ($Mode -eq "manual") {
    & "d:\Ston\database\backup\backup_manual.ps1" -Label "user_triggered"
} else {
    & "d:\Ston\database\backup\backup_daily.ps1"
}
