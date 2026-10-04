@echo off
chcp 65001 >nul
echo ======================================================================
echo   CHUONG TRINH KIEM THU TU DONG TOAN BO MODULE (DSA TEST RUNNER)
echo ======================================================================
echo.
echo [1/2] Dang bien dich bo kiem thu unit tests...
cd ..
g++ -O3 -std=c++17 test/run_all_tests.cpp src/persistence/FileStore.cpp src/core/mc1/*.cpp src/core/mc2/*.cpp src/core/rq1/*.cpp src/core/rq2/*.cpp src/core/rq3/*.cpp -o test/run_all_tests.exe

if %errorlevel% equ 0 (
    echo [OK] Bien dich thanh cong!
    echo.
    echo [2/2] Dang thuc thi toan bo 7 Test Suites kiem thu...
    echo.
    cd test
    run_all_tests.exe
    echo.
    echo ======================================================================
    echo   HOAN TAT! Ket qua da duoc ghi vao test/ket_qua_test.txt
    echo ======================================================================
) else (
    echo [ERROR] Bien dich that bai! Vui long kiem tra trinh bien dich g++.
)
pause
