# Replaces the Microsoft Entra app registration values in a Vercel environment (and .env.local for production).
# Run from the repo root:
#   powershell -File scripts\set-entra.ps1                 # production
#   powershell -File scripts\set-entra.ps1 -Environment preview
# The secret is typed hidden and is never printed or written anywhere except Vercel and .env.local.
param([ValidateSet("production", "preview")][string]$Environment = "production")

# Continue, not Stop: the Vercel CLI writes its version banner to stderr, which Stop would treat as a failure. Exit codes are checked instead.
$ErrorActionPreference = "Continue"

$clientId = (Read-Host "Application (client) ID").Trim()
$tenantId = (Read-Host "Directory (tenant) ID").Trim()
$secret = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR((Read-Host "Client secret VALUE (not the Secret ID)" -AsSecureString))).Trim()

$vars = [ordered]@{
  AUTH_MICROSOFT_ENTRA_ID_ID        = $clientId
  AUTH_MICROSOFT_ENTRA_ID_TENANT_ID = $tenantId
  AUTH_MICROSOFT_ENTRA_ID_SECRET    = $secret
}
foreach ($v in $vars.Values) { if (-not $v) { throw "A value was empty; nothing was changed." } }

# --force overwrites the existing value; --sensitive hides it in the dashboard. Preview without a branch applies to every preview branch.
foreach ($name in $vars.Keys) {
  Write-Host "Vercel ${Environment}: $name"
  $vars[$name] | npx vercel env add $name -e $Environment --force --sensitive 2>&1 | Out-Host
  if ($LASTEXITCODE -ne 0) { throw "Could not set $name" }
}

if ($Environment -eq "production") {
  # Local .env.local: replace the three lines, keep everything else.
  $file = ".env.local"
  $lines = if (Test-Path $file) { Get-Content $file | Where-Object { $_ -notmatch "^AUTH_MICROSOFT_ENTRA_ID_(ID|TENANT_ID|SECRET)=" } } else { @() }
  $lines += $vars.Keys | ForEach-Object { "$_=$($vars[$_])" }
  Set-Content $file $lines
  Write-Host ".env.local updated."
}

Write-Host "`nDone. New values apply to the next deployment of that environment (redeploy, or push a commit)."
