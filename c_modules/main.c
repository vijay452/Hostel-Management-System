#include <stdio.h>
#include <stdlib.h>

void display_menu();
void handle_choice(int choice);
void view_students();
void view_rooms();
void log_complaint();

int main() {
    int choice;

    printf("*****************************************\n");
    printf("* Hostel Management System (C Demo)   *\n");
    printf("*****************************************\n");

    while (1) {
        display_menu();
        
        if (scanf("%d", &choice) != 1) {
            printf("\n--- Invalid input. Please enter a number. ---\n");
            while(getchar() != '\n'); 
            continue;
        }

        handle_choice(choice);
    }
    
    return 0;
}

void display_menu() {
    printf("\n--- Main Menu ---\n");
    printf("1. View Student List\n");
    printf("2. View Room Status\n");
    printf("3. Log a New Complaint\n");
    printf("4. View Entry/Exit Logs\n");
    printf("5. Exit System\n");
    printf("Enter your choice: ");
}

void handle_choice(int choice) {
    switch (choice) {
        case 1:
            view_students();
            break;
        case 2:
            view_rooms();
            break;
        case 3:
            log_complaint();
            break;
        case 4:
            printf("\n[Feature 4] Displaying recent Entry/Exit logs...\n");
            break;
        case 5:
            printf("\nExiting Hostel Management System. Goodbye!\n");
            exit(0);
            break;
        default:
            printf("\n--- Invalid choice (%d). Please select a number between 1 and 5. ---\n", choice);
            break;
    }
}

void view_students() {
    printf("\n[Feature 1] Loading student data...\n");
    printf("--- Sample Data ---\n");
    printf("Name: Rahul Sharma, Room: A-201, Status: Present\n");
    printf("Name: Priya Singh, Room: B-310, Status: Absent\n");
    printf("-------------------\n");
}

void view_rooms() {
    printf("\n[Feature 2] Checking room occupancy...\n");
    printf("Total Rooms: 100 | Occupied: 85 | Available: 15\n");
    printf("Highest Occupancy Block: A\n");
}

void log_complaint() {
    printf("\n[Feature 3] Initiating complaint logging process...\n");
    printf("Complaint Form opened. Please fill in details (Room, Issue Type, Description).\n");
    printf("Complaint successfully logged and marked as 'New'.\n");
}