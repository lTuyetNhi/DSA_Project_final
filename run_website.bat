@echo off
setlocal
echo ===================================================
echo   KHOI DONG WEB VISUALIZER VA C++ BRIDGE ENGINE
echo ===================================================

:: Tu dong them cac duong dan Node.js pho bien vao PATH
if exist "C:\Program Files\nodejs" set "PATH=C:\Program Files\nodejs;%PATH%"
if exist "C:\Program Files (x86)\nodejs" set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
if exist "%APPDATA%\npm" set "PATH=%APPDATA%\npm;%PATH%"

taskkill /F /IM dsa_web_bridge.exe >nul 2>&1

echo [1/2] Kiem tra va bien dich C++ Native Web Bridge...
g++ -std=c++17 -O2 -DNDEBUG tools/dsa_web_bridge.cpp src/persistence/FileStore.cpp src/core/mc1/LinearSearch.cpp src/core/mc1/HashTable.cpp src/core/mc1/MC1.cpp src/core/mc2/LinearMaxScan.cpp src/core/mc2/MaxHeap.cpp src/core/mc2/MC2.cpp src/core/rq1/LinearCategoryScan.cpp src/core/rq1/CategoryHashTable.cpp src/core/rq1/RQ1.cpp src/core/rq2/LinearOverdueScan.cpp src/core/rq2/AVLTree.cpp src/core/rq2/RQ2.cpp src/core/rq3/LinearTitleScan.cpp src/core/rq3/CategoryTitleSearch.cpp src/core/rq3/RQ3.cpp -o tools/dsa_web_bridge.exe

if %errorlevel% neq 0 (
    echo [ERROR] Bien dich C++ Bridge that bai! Vui long kiem tra g++.
    pause
    exit /b %errorlevel%
)

echo [OK] Bien dich C++ Bridge thanh cong!
echo.
echo [2/2] Dang khoi dong Next.js Production Server tai http://localhost:3000...
cd website

:: Kiem tra neu chua build thi tu dong build production truoc
if not exist ".next" (
    echo [*] Dang dong goi Production Build lan dau...
    if exist "C:\Program Files\nodejs\npm.cmd" (
        call "C:\Program Files\nodejs\npm.cmd" run build
    ) else if exist "C:\Program Files (x86)\nodejs\npm.cmd" (
        call "C:\Program Files (x86)\nodejs\npm.cmd" run build
    ) else (
        call npm.cmd run build 2>nul || call npx next build 2>nul
    )
)

if exist "C:\Program Files\nodejs\npm.cmd" (
    call "C:\Program Files\nodejs\npm.cmd" run start
) else if exist "C:\Program Files (x86)\nodejs\npm.cmd" (
    call "C:\Program Files (x86)\nodejs\npm.cmd" run start
) else (
    call npm.cmd run start 2>nul || call npx next start 2>nul || (
        echo [ERROR] Khong tim thay Node.js / npm tren he thong!
        echo Vui long cai dat Node.js tai: https://nodejs.org/
        pause
    )
)
