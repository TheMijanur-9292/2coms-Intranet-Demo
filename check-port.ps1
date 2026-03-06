# PowerShell script to check and find available ports

Write-Host "Checking port availability..." -ForegroundColor Cyan
Write-Host ""

# Function to check if port is available
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return -not $connection
}

# Check common ports
$portsToCheck = @(3000, 3001, 3002, 3003, 3004, 5000, 5001)

Write-Host "Port Status:" -ForegroundColor Yellow
foreach ($port in $portsToCheck) {
    $isAvailable = Test-Port -Port $port
    if ($isAvailable) {
        Write-Host "  Port $port : Available ✓" -ForegroundColor Green
    } else {
        Write-Host "  Port $port : In Use ✗" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Finding first available port starting from 3000..." -ForegroundColor Cyan

$startPort = 3000
$maxPort = 3100
$foundPort = $null

for ($port = $startPort; $port -le $maxPort; $port++) {
    if (Test-Port -Port $port) {
        $foundPort = $port
        break
    }
}

if ($foundPort) {
    Write-Host "✓ Available port found: $foundPort" -ForegroundColor Green
    Write-Host ""
    Write-Host "To use this port, update:" -ForegroundColor Yellow
    Write-Host "  1. frontend/package.json - Change 'next dev -p' to port $foundPort" -ForegroundColor White
    Write-Host "  2. frontend/.env.local - Change NEXT_PUBLIC_APP_URL to http://localhost:$foundPort" -ForegroundColor White
    Write-Host "  3. backend/.env - Change FRONTEND_URL to http://localhost:$foundPort" -ForegroundColor White
} else {
    Write-Host "✗ No available ports found in range $startPort-$maxPort" -ForegroundColor Red
}
