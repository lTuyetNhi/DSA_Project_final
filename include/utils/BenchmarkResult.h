#pragma once

#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Kết quả đo đạc của một giải thuật qua K lần chạy
struct BenchmarkMetric {
    string algorithmName;      // Tên giải thuật (vd: "Linear Search", "Hash Table")
    double avgTimeUs;          // Thời gian trung bình (micro giây)
    double minTimeUs;          // Thời gian nhanh nhất (micro giây)
    double maxTimeUs;          // Thời gian chậm nhất (micro giây)
    long long operationsCount; // Số bước thực hiện (so sánh / duyệt)
    bool isFound;              // Trạng thái tìm thấy
};

// Kết quả so sánh hiệu năng giữa giải thuật cơ bản và cấu trúc nâng cao
struct ModuleBenchmarkResult {
    string moduleName;         // Tên module (MC1, MC2, RQ1, RQ2, RQ3)
    string testScenario;       // Kịch bản kiểm thử (vd: Tìm mã ở giữa, Tìm theo từ khóa...)
    int dataSize;              // Quy mô tập dữ liệu N
    BenchmarkMetric baseline;  // Giải thuật cơ bản (Linear)
    BenchmarkMetric optimized; // Cấu trúc dữ liệu nâng cao (DSA)
    double speedupRatio;       // Tốc độ tăng tốc (Baseline / Optimized)

    ModuleBenchmarkResult(const string& mod, const string& scn, int size,
                          const BenchmarkMetric& base, const BenchmarkMetric& opt, double speedup)
        : moduleName(mod), testScenario(scn), dataSize(size), baseline(base), optimized(opt), speedupRatio(speedup) {}
};
