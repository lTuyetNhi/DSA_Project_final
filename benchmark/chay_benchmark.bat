@echo off
chcp 65001 >nul
echo ======================================================================
echo   CHUONG TRINH DO KIEM BENCHMARK TOAN DIEN (DSA BENCHMARK ENGINE)
echo ======================================================================
echo.
echo [1/2] Dang bien dich chuong trinh benchmark...
cd /d "%~dp0\.."

g++ -O3 -std=c++17 benchmark/run_benchmark.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp src/presentation/AppMenu.cpp src/presentation/BenchmarkRunner.cpp -o benchmark/run_benchmark.exe

if %errorlevel% equ 0 (
    echo [OK] Bien dich thanh cong!
    echo.
    echo [2/2] Dang thuc thi Benchmark qua 4 quy mo (10, 10.000, 100.000, 1.000.000 ban ghi)...
    echo.
    benchmark\run_benchmark.exe
    echo.
    echo ======================================================================
    echo   HOAN TAT! Ket qua da duoc ghi vao benchmark/ket_qua_benchmark.txt
    echo ======================================================================
) else (
    echo [ERROR] Bien dich that bai! Vui long kiem tra lai trinh bien dich g++.
)
pause
