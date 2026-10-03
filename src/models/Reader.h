#ifndef READER_H
#define READER_H

#include <string>

// Model Độc giả - tương ứng data/readers.json
struct Reader {
    std::string reader_id;
    std::string name;
    std::string email;
    std::string phone;
};

#endif // READER_H
