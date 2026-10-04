#ifndef READER_H
#define READER_H

#include <string>

using namespace std;

// Model Độc giả - tương ứng data/readers.json
struct Reader {
    string reader_id;
    string name;
    string email;
    string phone;
};

#endif // READER_H
