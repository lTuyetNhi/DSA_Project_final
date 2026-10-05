Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  KHOI DONG WEB VISUALIZER VA C++ BRIDGE ENGINE" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Tu dong them cac duong dan Node.js pho bien vao PATH
if (Test-Path "C:\Program Files\nodejs") { $env:Path = "C:\Program Files\nodejs;" + $env:Path }
if (Test-Path "C:\Program Files (x86)\nodejs") { $env:Path = "C:\Program Files (x86)\nodejs;" + $env:Path }
if (Test-Path "$env:APPDATA\npm") { $env:Path = "$env:APPDATA\npm;" + $env:Path }

Stop-Process -Name "dsa_web_bridge" -Force -ErrorAction SilentlyContinue

Write-Host "[1/2] Kiem tra va bien dich C++ Native Web Bridge..." -ForegroundColor Yellow
g++ -std=c++17 -O2 -DNDEBUG tools/dsa_web_bridge.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp -o tools/dsa_web_bridge.exe

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Bien dich C++ Bridge that bai! Vui long kiem tra g++." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "[OK] Bien dich C++ Bridge thanh cong!" -ForegroundColor Green
Write-Host ""
Write-Host "[2/2] Dang khoi dong Next.js Production Server tai http://localhost:3000..." -ForegroundColor Cyan

Set-Location website

if (-not (Test-Path ".next")) {
    Write-Host "[*] Dang dong goi Production Build lan dau..." -ForegroundColor Yellow
    if (Test-Path "C:\Program Files\nodejs\npm.cmd") {
        & "C:\Program Files\nodejs\npm.cmd" run build
    } elseif (Test-Path "C:\Program Files (x86)\nodejs\npm.cmd") {
        & "C:\Program Files (x86)\nodejs\npm.cmd" run build
    } else {
        npm.cmd run build
    }
}

if (Test-Path "C:\Program Files\nodejs\npm.cmd") {
    & "C:\Program Files\nodejs\npm.cmd" run start
} elseif (Test-Path "C:\Program Files (x86)\nodejs\npm.cmd") {
    & "C:\Program Files (x86)\nodejs\npm.cmd" run start
} else {
    npm.cmd run start
}
