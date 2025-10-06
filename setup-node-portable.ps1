$nodeVersion = "v20.11.0"
$nodeDir = "$HOME\node-portable"
$nodeZip = "$HOME\node-portable.zip"
$nodeUrl = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-win-x64.zip"

Write-Host "Node.js Portable Setup" -ForegroundColor Cyan
Write-Host ""

if (-Not (Test-Path $nodeDir)) {
    Write-Host "[1/5] Creating directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $nodeDir -Force | Out-Null
} else {
    Write-Host "[1/5] Directory exists" -ForegroundColor Green
}

Write-Host "[2/5] Downloading Node.js..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeZip -UseBasicParsing
    Write-Host "      Download complete" -ForegroundColor Green
} catch {
    Write-Host "      Error downloading: $_" -ForegroundColor Red
    exit 1
}

Write-Host "[3/5] Extracting files..." -ForegroundColor Yellow
try {
    Expand-Archive -Path $nodeZip -DestinationPath $nodeDir -Force
    $extractedDir = Get-ChildItem -Path $nodeDir -Directory | Select-Object -First 1
    Get-ChildItem -Path $extractedDir.FullName | Move-Item -Destination $nodeDir -Force
    Remove-Item -Path $extractedDir.FullName -Recurse -Force
    Write-Host "      Extraction complete" -ForegroundColor Green
} catch {
    Write-Host "      Error extracting: $_" -ForegroundColor Red
    exit 1
}

Write-Host "[4/5] Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path $nodeZip -Force
Write-Host "      Cleanup complete" -ForegroundColor Green

Write-Host "[5/5] Configuring PATH..." -ForegroundColor Yellow
$env:Path += ";$nodeDir"
Write-Host "      PATH configured" -ForegroundColor Green

Write-Host ""
Write-Host "Adding to PowerShell profile..." -ForegroundColor Yellow
$profilePath = $PROFILE
$pathCommand = '$env:Path += "' + ";$nodeDir" + '"'

if (-Not (Test-Path $profilePath)) {
    New-Item -ItemType File -Path $profilePath -Force | Out-Null
}

if (-Not (Select-String -Path $profilePath -Pattern "node-portable" -Quiet)) {
    Add-Content -Path $profilePath -Value "`n# Node.js Portable"
    Add-Content -Path $profilePath -Value $pathCommand
    Write-Host "Profile updated" -ForegroundColor Green
} else {
    Write-Host "Profile already configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Cyan
$nodeExe = Join-Path $nodeDir "node.exe"
$npmCmd = Join-Path $nodeDir "npm.cmd"

if (Test-Path $nodeExe) {
    $nodeVer = & $nodeExe --version
    Write-Host "Node.js: $nodeVer" -ForegroundColor Green
}

if (Test-Path $npmCmd) {
    $npmVer = & $npmCmd --version
    Write-Host "npm: $npmVer" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. CLOSE and REOPEN PowerShell terminal" -ForegroundColor White
Write-Host "2. Run: npm install" -ForegroundColor White
Write-Host ""
