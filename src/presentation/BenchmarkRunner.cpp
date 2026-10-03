#include "../../include/utils/BenchmarkRunner.h"

// In bảng so sánh trực quan ra màn hình Console
void BenchmarkRunner::printComparisonTable(const vector<ModuleBenchmarkResult>& results) {
    cout << "\n========================================================================================================\n";
    cout << "                                  BANG SO SANH HIEU NANG THUC TE (BENCHMARK)                             \n";
    cout << "========================================================================================================\n";
    cout << left 
         << setw(8)  << "Module"
         << setw(16) << "Kich ban"
         << setw(8)  << "Size N"
         << setw(18) << "Baseline (us)"
         << setw(18) << "DSA (us)"
         << setw(14) << "Ops Baseline"
         << setw(12) << "Ops DSA"
         << setw(10) << "Speedup"
         << "\n";
    cout << "--------------------------------------------------------------------------------------------------------\n";

    for (const auto& r : results) {
        cout << left
             << setw(8)  << r.moduleName
             << setw(16) << r.testScenario
             << setw(8)  << r.dataSize
             << setw(18) << fixed << setprecision(3) << r.baseline.avgTimeUs
             << setw(18) << fixed << setprecision(3) << r.optimized.avgTimeUs
             << setw(14) << r.baseline.operationsCount
             << setw(12) << r.optimized.operationsCount
             << setw(10) << fixed << setprecision(1) << (to_string(r.speedupRatio).substr(0, 5) + "x")
             << "\n";
    }
    cout << "========================================================================================================\n\n";
}

// Xuất kết quả đo ra file CSV
void BenchmarkRunner::exportToCSV(const string& filePath, const vector<ModuleBenchmarkResult>& results) {
    ofstream file(filePath);
    if (!file.is_open()) {
        cout << "[Loi] Khong the mo file de xuat CSV: " << filePath << "\n";
        return;
    }

    file << "Module,Scenario,DataSize,BaselineName,BaselineAvgUs,BaselineMinUs,BaselineMaxUs,BaselineOps,OptimizedName,OptimizedAvgUs,OptimizedMinUs,OptimizedMaxUs,OptimizedOps,Speedup\n";

    for (const auto& r : results) {
        file << r.moduleName << ","
             << "\"" << r.testScenario << "\","
             << r.dataSize << ","
             << r.baseline.algorithmName << ","
             << r.baseline.avgTimeUs << ","
             << r.baseline.minTimeUs << ","
             << r.baseline.maxTimeUs << ","
             << r.baseline.operationsCount << ","
             << r.optimized.algorithmName << ","
             << r.optimized.avgTimeUs << ","
             << r.optimized.minTimeUs << ","
             << r.optimized.maxTimeUs << ","
             << r.optimized.operationsCount << ","
             << r.speedupRatio << "\n";
    }

    file.close();
    cout << "[Thanh cong] Da xuat ket qua Benchmark sang file CSV: " << filePath << "\n";
}

// Xuất kết quả ra file LaTeX để chèn vào báo cáo
void BenchmarkRunner::exportToLaTeX(const string& filePath, const vector<ModuleBenchmarkResult>& results) {
    ofstream file(filePath);
    if (!file.is_open()) {
        cout << "[Loi] Khong the mo file de xuat LaTeX: " << filePath << "\n";
        return;
    }

    file << "% Bang ket qua thuc nghiem benchmark duoc tao tu dong boi BenchmarkRunner\n";
    file << "\\begin{table}[H]\n";
    file << "\\centering\n";
    file << "\\small\n";
    file << "\\begin{tabular}{|l|l|r|r|r|r|r|r|}\n";
    file << "\\hline\n";
    file << "\\textbf{Module} & \\textbf{Kịch bản} & \\textbf{N} & \\textbf{T tuyến tính ($\\mu$s)} & \\textbf{T tối ưu ($\\mu$s)} & \\textbf{Ops Linear} & \\textbf{Ops DSA} & \\textbf{Speedup} \\\\\n";
    file << "\\hline\n";

    for (const auto& r : results) {
        file << r.moduleName << " & "
             << r.testScenario << " & "
             << r.dataSize << " & "
             << fixed << setprecision(2) << r.baseline.avgTimeUs << " & "
             << fixed << setprecision(2) << r.optimized.avgTimeUs << " & "
             << r.baseline.operationsCount << " & "
             << r.optimized.operationsCount << " & "
             << fixed << setprecision(1) << r.speedupRatio << "x \\\\\n";
        file << "\\hline\n";
    }

    file << "\\end{tabular}\n";
    file << "\\caption{Bảng so sánh hiệu năng thực tế giữa giải thuật Baseline và cấu trúc dữ liệu tối ưu}\n";
    file << "\\label{tab:benchmark_results}\n";
    file << "\\end{table}\n";

    file.close();
    cout << "[Thanh cong] Da xuat bang LaTeX sang file: " << filePath << "\n";
}
