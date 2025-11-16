#include "utils.h"
#include <stdio.h>
#include <string.h>



int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Welcome to Complaints Module!\n");
        printf("Usage:\n  complaints add <roll> <issue>\n  complaints list\n");
        return 1;
    }

    // Add a complaint
    if (strcmp(argv[1], "add") == 0) {
        if (argc != 4) {
            printf("Please provide student roll and issue description.\n");
            return 1;
        }

        char line[512];
        snprintf(line, sizeof(line), "%s,%s", argv[2], argv[3]);
        appendLine("complaints.txt", line);

        printf("⚠️ Complaint added successfully!\n");
        printf("Student Roll: %s, Issue: %s\n", argv[2], argv[3]);
    }

    // List complaints
    else if (strcmp(argv[1], "list") == 0) {
        printf("📋 List of all complaints:\n");
        printFile("complaints.txt");
    }

    // Unknown command
    else {
        printf("❌ Unknown command: %s\n", argv[1]);
        printf("Use 'add' or 'list'\n");
    }

    return 0;
}
