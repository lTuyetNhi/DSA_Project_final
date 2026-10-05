#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdio>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    const int TOTAL_BOOKS = 500000;
    const int TOTAL_READERS = 10000;
    const int TOTAL_RECORDS = 500000;
    const int TOTAL_WAITLIST = 10000;

    cout << "Dang tao bo du lieu 500.000 ban ghi...\n";

    vector<string> categories = {
        "Computer Science", "Software Engineering", "Data Science", 
        "Artificial Intelligence", "Database", "Networking", 
        "Cybersecurity", "Operating Systems", "Mathematics", "Literature"
    };

    vector<string> titles_prefix = {
        "Introduction to", "Advanced", "Principles of", "Mastering",
        "Foundations of", "Handbook of", "Modern", "Practical",
        "Essential", "The Art of", "Applied", "Guide to"
    };

    vector<string> titles_core = {
        "Algorithms", "Data Structures", "Clean Code", "Design Patterns",
        "Machine Learning", "Deep Learning", "Database Systems", "Computer Networks",
        "Operating Systems", "Cloud Computing", "Information Security", "Software Architecture"
    };

    vector<string> authors = {
        "Thomas H. Cormen", "Robert C. Martin", "Erich Gamma", "Stuart Russell",
        "Abraham Silberschatz", "Andrew S. Tanenbaum", "Ian Goodfellow", "Martin Fowler",
        "Donald Knuth", "Jon Bentley", "Michael Sipser", "Bjarne Stroustrup"
    };

    // 1. Generate books.json (500,000 books)
    {
        cout << "1/4. Dang ghi data/books.json (500,000 cuon sach)..." << endl;
        ofstream f("data/books.json", ios::out | ios::binary);
        if (!f.is_open()) { cerr << "Loi mo data/books.json\n"; return 1; }
        f << "[\n";
        for (int i = 1; i <= TOTAL_BOOKS; ++i) {
            string id = "B" + to_string(1000000 + i);
            string title = titles_prefix[i % titles_prefix.size()] + " " + titles_core[(i / 3) % titles_core.size()] + " Vol " + to_string(i);
            string author = authors[i % authors.size()];
            string cat = categories[(i / 5) % categories.size()];
            int year = 1990 + (i % 36);
            int total = 5 + (i % 25);
            int avail = (i % 4 == 0) ? 0 : total - (i % 4);
            int borrow = (i * 17) % 10000;

            f << "  {\n"
              << "    \"book_id\": \"" << id << "\",\n"
              << "    \"title\": \"" << title << "\",\n"
              << "    \"author\": \"" << author << "\",\n"
              << "    \"category\": \"" << cat << "\",\n"
              << "    \"published_year\": " << year << ",\n"
              << "    \"total_quantity\": " << total << ",\n"
              << "    \"available_quantity\": " << avail << ",\n"
              << "    \"borrow_count\": " << borrow << "\n"
              << "  }" << (i == TOTAL_BOOKS ? "\n" : ",\n");
            
            if (i % 100000 == 0) cout << "  -> Da ghi " << i << " / " << TOTAL_BOOKS << " sach\n";
        }
        f << "]\n";
        f.close();
    }

    // 2. Generate readers.json (10,000 readers)
    {
        cout << "2/4. Dang ghi data/readers.json (10,000 doc gia)..." << endl;
        ofstream f("data/readers.json", ios::out | ios::binary);
        f << "[\n";
        for (int i = 1; i <= TOTAL_READERS; ++i) {
            string id = "R" + to_string(10000 + i);
            string name = "Doc Gia " + to_string(i);
            string email = "reader" + to_string(i) + "@library.edu.vn";
            string phone = "09" + to_string(10000000 + i);

            f << "  {\n"
              << "    \"reader_id\": \"" << id << "\",\n"
              << "    \"name\": \"" << name << "\",\n"
              << "    \"email\": \"" << email << "\",\n"
              << "    \"phone\": \"" << phone << "\"\n"
              << "  }" << (i == TOTAL_READERS ? "\n" : ",\n");
        }
        f << "]\n";
        f.close();
    }

    // 3. Generate borrow_records.json (500,000 borrow records)
    {
        cout << "3/4. Dang ghi data/borrow_records.json (500,000 phieu muon)..." << endl;
        ofstream f("data/borrow_records.json", ios::out | ios::binary);
        f << "[\n";
        for (int i = 1; i <= TOTAL_RECORDS; ++i) {
            string b_id = "BR" + to_string(1000000 + i);
            string r_id = "R" + to_string(10000 + (i % TOTAL_READERS + 1));
            string bk_id = "B" + to_string(1000000 + ((i * 3) % TOTAL_BOOKS + 1));
            
            int dayOffset = i % 120;
            int m_borrow = 6 + (dayOffset / 30);
            int d_borrow = 1 + (dayOffset % 28);
            
            int m_due = m_borrow + 1;
            int d_due = d_borrow;
            if (m_due > 12) { m_due = 12; d_due = 28; }

            char b_buf[32], d_buf[32], r_buf[32];
            snprintf(b_buf, sizeof(b_buf), "2026-%02d-%02d", m_borrow, d_borrow);
            snprintf(d_buf, sizeof(d_buf), "2026-%02d-%02d", m_due, d_due);
            
            bool returned = (i % 3 == 0);
            string ret_val = "null";
            string status = "BORROWING";
            if (returned) {
                snprintf(r_buf, sizeof(r_buf), "\"2026-%02d-%02d\"", m_borrow, (d_borrow + 10) % 28 + 1);
                ret_val = string(r_buf);
                status = "RETURNED";
            }

            f << "  {\n"
              << "    \"borrow_id\": \"" << b_id << "\",\n"
              << "    \"reader_id\": \"" << r_id << "\",\n"
              << "    \"book_id\": \"" << bk_id << "\",\n"
              << "    \"borrow_date\": \"" << b_buf << "\",\n"
              << "    \"due_date\": \"" << d_buf << "\",\n"
              << "    \"return_date\": " << ret_val << ",\n"
              << "    \"status\": \"" << status << "\"\n"
              << "  }" << (i == TOTAL_RECORDS ? "\n" : ",\n");

            if (i % 100000 == 0) cout << "  -> Da ghi " << i << " / " << TOTAL_RECORDS << " phieu muon\n";
        }
        f << "]\n";
        f.close();
    }

    cout << "\n========================================================\n";
    cout << "HOAN TAT SINH DU LIEU 500.000 BAN GHI THANH CONG!\n";
    cout << "========================================================\n";
    return 0;
}
