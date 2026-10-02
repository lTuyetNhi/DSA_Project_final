@echo off
echo ===================================================
echo   BIEN DICH HE THONG QUAN LY THU VIEN (DSA PROJECT)
echo ===================================================

g++ -std=c++17 main.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp src/presentation/AppMenu.cpp -o main.exe

if %errorlevel% equ 0 (
    echo [OK] Bien dich thanh cong! Dang chay main.exe...
    echo.
    main.exe
) else (
    echo [ERROR] Bien dich that bai!
)
