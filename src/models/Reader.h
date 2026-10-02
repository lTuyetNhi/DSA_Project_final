#ifndef READER_H
#define READER_H

#include <iostream>
#include <string>

using namespace std;

// Model Độc giả - tương ứng data/readers.json
struct Reader {
  string reader_id;
  string name;
  string email;
  string phone;

  void print() const {
    cout << "[" << reader_id << "] " << name << " | Email: " << email
         << " | SDT: " << phone << "\n";
  }
};

#endif // READER_H
