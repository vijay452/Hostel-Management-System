#include "utils.h"

void appendLine(const char *filename, const char *line) {
    char path[256];
    snprintf(path, sizeof(path), "%s%s", DATA_DIR, filename);
    FILE *fp = fopen(path, "a");
    if (fp == NULL) {
        perror("Error opening file");
        return;
    }
    fprintf(fp, "%s\n", line);
    fclose(fp);
}

void printFile(const char *filename) {
    char path[256];
    snprintf(path, sizeof(path), "%s%s", DATA_DIR, filename);
    FILE *fp = fopen(path, "r");
    if (fp == NULL) {
        perror("Error opening file");
        return;
    }
    char buffer[512];
    while (fgets(buffer, sizeof(buffer), fp)) {
        printf("%s", buffer);
    }
    fclose(fp);
}
