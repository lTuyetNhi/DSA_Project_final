#ifndef WAITLIST_ENTRY_H
#define WAITLIST_ENTRY_H

#include <string>

using namespace std;

// Model Hàng đợi chờ mượn - tương ứng data/waitlist.json
struct WaitlistEntry {
    string wait_id;
    string book_id;
    string reader_id;
    string registered_at;
};

#endif // WAITLIST_ENTRY_H
