@echo off
setlocal
echo ===================================================
echo   KHOI DONG WEB VISUALIZER VA C++ BRIDGE ENGINE
echo ===================================================

:: Tu dong them Node.js vao PATH neu chua co
set "PATH=C:\Program Files\nodejs;%PATH%"

echo [1/2] Kiem tra va bien dich C++ Native Web Bridge...
g++ -std=c++17 tools/dsa_web_bridge.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp -o tools/dsa_web_bridge.exe

if %errorlevel% neq 0 (
    echo [ERROR] Bien dich C++ Bridge that bai! Vui long kiem tra g++.
    pause
    exit /b %errorlevel%
)

echo [OK] Bien dich C++ Bridge thanh cong!
echo.
echo [2/2] Dang khoi dong Next.js Server tai http://localhost:3000...
cd website
call npm run dev
