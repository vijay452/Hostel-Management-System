#include "utils.h"
#include <stdio.h>
#include <string.h>
#include <time.h>



void logEntryExit(const char *type, const char *roll) {
    char line[512];
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);

    snprintf(line, sizeof(line), "%s,%s,%02d-%02d-%04d %02d:%02d:%02d",
             roll, type,
             tm.tm_mday, tm.tm_mon + 1, tm.tm_year + 1900,
             tm.tm_hour, tm.tm_min, tm.tm_sec);

    appendLine("entry_exit.txt", line);

    printf("🕒 Logged %s for Roll %s at %02d:%02d:%02d\n",
           type, roll, tm.tm_hour, tm.tm_min, tm.tm_sec);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Welcome to Entry/Exit Module!\n");
        printf("Usage:\n  entry_exit entry <roll>\n  entry_exit exit <roll>\n  entry_exit list\n");
        return 1;
    }

    if (strcmp(argv[1], "entry") == 0 || strcmp(argv[1], "exit") == 0) {
        if (argc != 3) {
            printf("Please provide student roll number.\n");
            return 1;
        }
        logEntryExit(argv[1], argv[2]);
    }
    else if (strcmp(argv[1], "list") == 0) {
        printf("📋 Entry/Exit Logs:\n");
        printFile("entry_exit.txt");
    }
    else {
        printf("❌ Unknown command: %s\n", argv[1]);
        printf("Use 'entry', 'exit', or 'list'\n");
    }

    return 0;
}
