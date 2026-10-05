[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  BIEN DICH HE THONG QUAN LY THU VIEN (DSA PROJECT)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Stop-Process -Name "main" -Force -ErrorAction SilentlyContinue

$srcFiles = @(
    "main.cpp",
    "src/persistence/FileStore.cpp",
    "src/core/mc1/LinearSearch.cpp",
    "src/core/mc1/HashTable.cpp",
    "src/core/mc1/MC1.cpp",
    "src/core/mc2/LinearMaxScan.cpp",
    "src/core/mc2/MaxHeap.cpp",
    "src/core/mc2/MC2.cpp",
    "src/core/rq1/LinearCategoryScan.cpp",
    "src/core/rq1/CategoryHashTable.cpp",
    "src/core/rq1/RQ1.cpp",
    "src/core/rq2/LinearOverdueScan.cpp",
    "src/core/rq2/AVLTree.cpp",
    "src/core/rq2/RQ2.cpp",
    "src/core/rq3/LinearTitleScan.cpp",
    "src/core/rq3/CategoryTitleSearch.cpp",
    "src/core/rq3/RQ3.cpp",
    "src/presentation/AppMenu.cpp",
    "src/presentation/BenchmarkRunner.cpp"
)

g++ -std=c++17 $srcFiles -o main.exe

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Bien dich thanh cong! Dang chay main.exe...`n" -ForegroundColor Green
    .\main.exe
} else {
    Write-Host "[ERROR] Bien dich that bai!" -ForegroundColor Red
}
