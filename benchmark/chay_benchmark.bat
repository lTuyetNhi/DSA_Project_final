@echo off
chcp 65001 >nul
echo ======================================================================
echo   CHUONG TRINH DO KIEM BENCHMARK TOAN DIEN (DSA BENCHMARK ENGINE)
echo ======================================================================
echo.
echo [1/2] Dang bien dich chuong trinh benchmark...
cd ..
g++ -O3 -std=c++17 benchmark/run_benchmark.cpp src/persistence/FileStore.cpp src/core/mc1/*.cpp src/core/mc2/*.cpp src/core/rq1/*.cpp src/core/rq2/*.cpp src/core/rq3/*.cpp -o benchmark/run_benchmark.exe

if %errorlevel% equ 0 (
    echo [OK] Bien dich thanh cong!
    echo.
    echo [2/2] Dang thuc thi Benchmark qua 4 quy mo (10, 10.000, 100.000, 1.000.000 ban ghi)...
    echo.
    cd benchmark
    run_benchmark.exe
    echo.
    echo ======================================================================
    echo   HOAN TAT! Ket qua da duoc ghi vao benchmark/ket_qua_benchmark.txt
    echo ======================================================================
) else (
    echo [ERROR] Bien dich that bai! Vui long kiem tra lai trinh bien dich g++.
)
pause
