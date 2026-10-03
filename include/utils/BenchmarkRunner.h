#pragma once

#include <string>
#include <vector>
#include <chrono>
#include <numeric>
#include <algorithm>
#include "BenchmarkResult.h"

// Bộ công cụ đo đạc hiệu năng và so sánh giải thuật
class BenchmarkRunner {
public:
    // Chạy benchmark đo thời gian thực thi của một thao tác qua nhiều lần lặp
    template <typename Func>
    static BenchmarkMetric run(const std::string& name, long long ops, bool found, Func&& func, int iterations = 100, int warmup = 5) {
        if (iterations <= 0) {
            iterations = 1;
        }
        if (warmup < 0) {
            warmup = 0;
        }

        // 1. Warm-up CPU cache
        for (int i = 0; i < warmup; ++i) {
            func();
        }

        std::vector<double> durations;
        durations.reserve(iterations);

        // 2. Chạy đo đạc thực tế
        for (int i = 0; i < iterations; ++i) {
            auto start = std::chrono::high_resolution_clock::now();
            func();
            auto end = std::chrono::high_resolution_clock::now();

            double duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end - start).count() / 1000.0;
            durations.push_back(duration);
        }

        // 3. Tính toán các chỉ số thống kê
        double sum = std::accumulate(durations.begin(), durations.end(), 0.0);
        double avg = sum / iterations;
        double minTime = *std::min_element(durations.begin(), durations.end());
        double maxTime = *std::max_element(durations.begin(), durations.end());

        BenchmarkMetric metric;
        metric.algorithmName = name;
        metric.avgTimeUs = avg;
        metric.minTimeUs = minTime;
        metric.maxTimeUs = maxTime;
        metric.operationsCount = ops;
        metric.isFound = found;

        return metric;
    }

    // In bảng so sánh trực quan ra màn hình Console
    static void printComparisonTable(const std::vector<ModuleBenchmarkResult>& results);

    // Xuất kết quả đo ra file CSV
    static void exportToCSV(const std::string& filePath, const std::vector<ModuleBenchmarkResult>& results);

    // Xuất kết quả ra file LaTeX để đưa vào báo cáo
    static void exportToLaTeX(const std::string& filePath, const std::vector<ModuleBenchmarkResult>& results);
};
