@echo off
chcp 65001 >nul
echo ======================================================================
echo   CHUONG TRINH KIEM THU TU DONG TOAN BO MODULE (DSA TEST RUNNER)
echo ======================================================================
echo.
echo [1/2] Dang bien dich bo kiem thu unit tests...
cd /d "%~dp0\.."

g++ -std=c++17 test/run_all_tests.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp src/presentation/AppMenu.cpp src/presentation/BenchmarkRunner.cpp -o test/run_all_tests.exe

if %errorlevel% equ 0 (
    echo [OK] Bien dich thanh cong!
    echo.
    echo [2/2] Dang thuc thi toan bo Test Suites kiem thu...
    echo.
    test\run_all_tests.exe
    echo.
    echo ======================================================================
    echo   HOAN TAT! Ket qua da duoc ghi vao test/ket_qua_test.txt
    echo ======================================================================
) else (
    echo [ERROR] Bien dich that bai! Vui long kiem tra trinh bien dich g++.
)
pause
