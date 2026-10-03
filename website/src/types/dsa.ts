export interface Book {
  book_id: string;
  title: string;
  author: string;
  category: string;
  published_year: number;
  total_quantity: number;
  available_quantity: number;
  borrow_count: number;
}

export interface BorrowRecord {
  borrow_id: string;
  reader_id: string;
  book_id: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
}

export interface HashInfo {
  raw_hash: number;
  table_size: number;
  bucket_index: number;
}

export interface AlgorithmMetrics {
  found?: boolean;
  count?: number;
  comparisons?: number;
  checks?: number;
  execution_time_ns: number;
  workload_1000_ns?: number;
  memory_label?: string;
  result_label?: string;
  complexity: string;
}

export interface ModuleResponse {
  status: string;
  module: string;
  module_name: string;
  target_id?: string;
  category?: string;
  current_date?: string;
  keyword?: string;
  top_k?: number;
  hash_info?: HashInfo;
  baseline: AlgorithmMetrics;
  optimized: AlgorithmMetrics;
  book?: Book | null;
  books?: Book[];
  top_books?: Book[];
  overdue_records?: BorrowRecord[];
  matched_books?: Book[];
}

export interface MC1Response {
  status: string;
  module: 'MC1';
  module_name: string;
  target_id: string;
  hash_info: HashInfo;
  baseline: AlgorithmMetrics;
  optimized: AlgorithmMetrics;
  book: Book | null;
}

export interface MC2Response {
  status: string;
  module: 'MC2';
  module_name: string;
  top_k: number;
  baseline: AlgorithmMetrics;
  optimized: AlgorithmMetrics;
  top_books: Book[];
}

export interface RQ1Response {
  status: string;
  module: 'RQ1';
  module_name: string;
  category: string;
  baseline: AlgorithmMetrics;
  optimized: AlgorithmMetrics;
  books: Book[];
}

export interface RQ2Response {
  status: string;
  module: 'RQ2';
  module_name: string;
  current_date: string;
  baseline: AlgorithmMetrics;
  optimized: AlgorithmMetrics;
  overdue_records: BorrowRecord[];
}

export interface RQ3Response {
  status: string;
  module: 'RQ3';
  module_name: string;
  keyword: string;
  baseline: AlgorithmMetrics;
  optimized: AlgorithmMetrics;
  matched_books: Book[];
}

export interface BenchmarkItem {
  module: string;
  name: string;
  baseline_time_ns: number;
  optimized_time_ns: number;
  baseline_steps: number;
  optimized_steps: number;
  speedup: number;
}

export interface BenchmarkResponse {
  status: string;
  dataset_size: number;
  results: BenchmarkItem[];
}
