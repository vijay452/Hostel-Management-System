#include "utils.h"
#include <stdio.h>
#include <string.h>

/*
 * Students Module
 * Commands:
 *   add <name> <roll> <room>  → Add a new student
 *   list                       → List all students
 */

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Welcome to Students Module!\n");
        printf("Usage:\n  students add <name> <roll> <room>\n  students list\n");
        return 1;
    }

    // Add a new student
    if (strcmp(argv[1], "add") == 0) {
        if (argc != 5) {
            printf("Please provide all details: name, roll, room\n");
            return 1;
        }

        char line[256];
        snprintf(line, sizeof(line), "%s,%s,%s", argv[2], argv[3], argv[4]);
        appendLine("students.txt", line);

        printf("🎓 Added student successfully!\n");
        printf("Name: %s, Roll: %s, Room: %s\n", argv[2], argv[3], argv[4]);
    }

    // List all students
    else if (strcmp(argv[1], "list") == 0) {
        printf("📋 List of all students:\n");
        printFile("students.txt");
    }

    // Unknown command
    else {
        printf("❌ Unknown command: %s\n", argv[1]);
        printf("Use 'add' or 'list'\n");
    }

    return 0;
}
