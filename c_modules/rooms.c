#include "utils.h"
#include <stdio.h>
#include <string.h>



int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Welcome to Rooms Module!\n");
        printf("Usage:\n  rooms add <roomNo> <capacity>\n  rooms list\n");
        return 1;
    }

    // Add a new room
    if (strcmp(argv[1], "add") == 0) {
        if (argc != 4) {
            printf("Please provide room number and capacity.\n");
            return 1;
        }

        char line[256];
        snprintf(line, sizeof(line), "%s,%s", argv[2], argv[3]);
        appendLine("rooms.txt", line);

        printf("🏠 Added room successfully!\n");
        printf("Room No: %s, Capacity: %s\n", argv[2], argv[3]);
    }

    // List all rooms
    else if (strcmp(argv[1], "list") == 0) {
        printf("📋 List of all rooms:\n");
        printFile("rooms.txt");
    }

    // Unknown command
    else {
        printf("❌ Unknown command: %s\n", argv[1]);
        printf("Use 'add' or 'list'\n");
    }

    return 0;
}
