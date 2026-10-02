#ifndef BOOK_H
#define BOOK_H

#include <string>

using namespace std;

// Model Sách / Tài liệu - tương ứng data/books.json
struct Book {
  string book_id;
  string title;
  string author;
  string category;
  int published_year = 0;
  int total_quantity = 0;
  int available_quantity = 0;
  int borrow_count = 0;
};

#endif // BOOK_H
