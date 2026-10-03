#ifndef WAITLIST_ENTRY_H
#define WAITLIST_ENTRY_H

#include <string>

// Model Hàng đợi chờ mượn - tương ứng data/waitlist.json
struct WaitlistEntry {
    std::string wait_id;
    std::string book_id;
    std::string reader_id;
    std::string registered_at;
};

#endif // WAITLIST_ENTRY_H
