# Builds .env.local from the Vercel Preview configuration, so local review runs against the same settings (and the Preview database branch) as stage.
# Run from the repo root:  powershell -File scripts\local-env.ps1
# Vercel never returns Secret values, so those six are kept from your existing .env.local (backed up to .env.local.bak) or typed here, hidden.
$ErrorActionPreference = "Continue"
$file = ".env.local"
$secretKeys = "AUTH_MICROSOFT_ENTRA_ID_ID", "AUTH_MICROSOFT_ENTRA_ID_TENANT_ID", "AUTH_MICROSOFT_ENTRA_ID_SECRET", "AUTH_SECRET", "FACILITATOR_EMAILS", "PREVIEW_DATABASE_URL"
$hidden = "AUTH_MICROSOFT_ENTRA_ID_SECRET", "AUTH_SECRET", "PREVIEW_DATABASE_URL"
# Vercel build/system variables that mean nothing locally. VERCEL_ENV=preview is kept on purpose: it makes src/lib/db.ts use PREVIEW_DATABASE_URL.
$noise = "^(VERCEL_GIT_|TURBO_|NX_|VERCEL_URL=|VERCEL_TARGET_ENV=|VERCEL=|VERCEL_OIDC_TOKEN=)"

function Read-Env($path) {
  $h = [ordered]@{}
  if (Test-Path $path) { foreach ($l in Get-Content $path) { if ($l -match '^([A-Z0-9_]+)=(.*)$') { $h[$Matches[1]] = $Matches[2].Trim('"') } } }
  $h
}

$old = Read-Env $file
if (Test-Path $file) { Copy-Item $file "$file.bak" -Force; Write-Host "Backed up the current file to $file.bak" }

npx vercel env pull $file --environment preview --yes 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) { if (Test-Path "$file.bak") { Copy-Item "$file.bak" $file -Force }; throw "vercel env pull failed; your old .env.local was restored." }

$new = Read-Env $file
$out = foreach ($k in $new.Keys) {
  if ("$k=" -match $noise) { continue }
  $v = $new[$k]
  if ($secretKeys -contains $k) { $v = $old[$k]; if (-not $v) { $v = $null } }
  "${k}=$v"
}

# Fill the secrets that Vercel could not return.
$have = @{}
foreach ($l in $out) { $have[($l -split "=", 2)[0]] = ($l -split "=", 2)[1] }
$extra = foreach ($k in $secretKeys) {
  if (-not $have[$k]) {
    $val = if ($hidden -contains $k) { [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR((Read-Host "$k (hidden)" -AsSecureString))) } else { Read-Host $k }
    "${k}=$($val.Trim())"
  }
}
$final = @($out | Where-Object { ($_ -split "=", 2)[0] -notin $secretKeys -or ($_ -split "=", 2)[1] }) + @($extra)
Set-Content $file $final
Write-Host "`n$file now holds the Preview configuration (VERCEL_ENV=preview, database = the Preview Neon branch)."
Write-Host "Start the app with: npm run dev"
