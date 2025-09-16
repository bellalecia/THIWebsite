<#
One-click deploy script for Windows PowerShell.

This script stages and commits any local changes (after prompting), then pushes to the `main` branch.
Pushing to `main` will trigger the GitHub Actions workflow to build and deploy the site to Azure Static Web Apps.

USAGE:
- Run from the repository root in PowerShell: `.	emplates\deploy.ps1` or `.\\ull\path\to\deploy.ps1`.
- The script will show the git status and ask for confirmation before committing and pushing.

NOTE: This script assumes Git is installed and you have permission to push to the repository.
#>

Param(
    [string] $CommitMessage = "Update site content",
    [switch] $Force
)

function Confirm-Action([string]$message) {
    if ($Force) { return $true }
    Write-Host $message -ForegroundColor Yellow
    $resp = Read-Host "Proceed? (y/n)"
    return $resp -match '^(y|Y)'
}

# Ensure we're in the repo root (script's directory)
Set-Location -Path $PSScriptRoot

# Show git status
Write-Host "Displaying git status..." -ForegroundColor Cyan
git status

if (-not (Confirm-Action "Stage all changes and create a commit with message: '$CommitMessage'?")) {
    Write-Host "Aborted by user." -ForegroundColor Red
    exit 1
}

# Stage changes
git add -A

# Commit
try {
    git commit -m $CommitMessage
} catch {
    Write-Host "No changes to commit or commit failed: $_" -ForegroundColor Yellow
}

# Push
if (-not (Confirm-Action "Push commits to origin/main to trigger deployment?")) {
    Write-Host "Push aborted by user." -ForegroundColor Red
    exit 1
}

try {
    git push origin main
    Write-Host "Push complete. GitHub Actions should start deploying shortly." -ForegroundColor Green
} catch {
    Write-Host "Push failed: $_" -ForegroundColor Red
    exit 1
}
