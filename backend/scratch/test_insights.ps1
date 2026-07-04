# PowerShell REST Testing Script for Financial Insights Engine Endpoints
$apiBase = "http://localhost:5000/api"

# 1. Login user to capture session Bearer token
Write-Host "Logging in..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "$apiBase/auth/login" -Method Post -Body (@{
    email = "auditor6@example.com"
    password = "StrongPassword123!"
} | ConvertTo-Json) -ContentType "application/json"

if (-not $loginResponse.accessToken) {
    Write-Host "Login failed! Response was: $($loginResponse | ConvertTo-Json)" -ForegroundColor Red
    exit 1
}

$token = $loginResponse.accessToken
$headers = @{
    Authorization = "Bearer $token"
}

# 2. Define endpoints
$endpoints = @(
    "insights/overview",
    "insights/monthly",
    "insights/weekly",
    "insights/category-breakdown",
    "insights/recent",
    "insights/statistics",
    "insights/cashflow"
)

# 3. Request each endpoint and verify structure
foreach ($path in $endpoints) {
    Write-Host "Testing GET $apiBase/$path ..." -ForegroundColor Cyan
    try {
        $res = Invoke-RestMethod -Uri "$apiBase/$path" -Method Get -Headers $headers
        if ($res.success -eq $true) {
            Write-Host "  [OK] success: $($res.success)" -ForegroundColor Green
            $json = $res.data | ConvertTo-Json -Depth 2
            if ($json.Length -gt 150) {
                Write-Host "  [OK] Data payload sample: $($json.Substring(0, 150))..." -ForegroundColor Gray
            } else {
                Write-Host "  [OK] Data payload: $json" -ForegroundColor Gray
            }
        } else {
            Write-Host "  [FAIL] Endpoint returned false success: $($res.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  [ERROR] Request failed: $_" -ForegroundColor Red
    }
}
