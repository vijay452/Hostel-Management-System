# 🏨 Hostel Management System (Simple & Human-Friendly)

This project is a *Hostel Management System* made using *C, Node.js, and React*.
The idea is very simple:

* *C programs* do all the main work (students, rooms, complaints, entry/exit).
* *Node.js* works like a *bridge* between C and the frontend.
* *React* shows everything to the user through a clean interface.

---

## ⭐ What the System Can Do

### *1. Students Section*

* Add new students
* Manage their details
* Handle fees

### *2. Rooms Section*

* Check which rooms are available
* Allocate rooms
* Update room status

### *3. Complaints Section*

* Students can submit complaints
* Complaints are arranged by priority

### *4. Entry/Exit Logs*

* Keeps track of students entering or leaving the hostel

### *5. Backend (Node.js)*

* Talks to the C programs
* Reads and updates a JSON file
* Sends data to frontend

### *6. Frontend (React)*

* Simple pages for each section
* Easy-to-use interface

---

## 📁 Folder Structure (Explained Simply)


hostel/
│
├─ server/            # Node.js backend
│   ├─ index.js       # Starts the backend server
│   ├─ data.json      # Stores all hostel data
│   └─ modules/
│       ├─ c_bridge.js    # Connects Node.js with C programs
│       └─ api_routes.js  # API routes for frontend
│
├─ c_modules/         # All C programs
│   ├─ students.c     # Student handling
│   ├─ rooms.c        # Room handling
│   ├─ complaints.c   # Complaint system
│   ├─ entry_exit.c   # Entry/Exit log system
│   └─ utils.c/h      # Shared helper code
│
├─ client/            # React app
│   └─ src/pages      # Rooms, Students, Complaints, Entry/Exit
│
└─ README.md


---

## 🔄 How It Works (Very Simple Explanation)

1. User clicks something in the *React frontend*.
2. React sends a request to *Node.js backend*.
3. Node.js runs the required *C program*.
4. C program updates data.json if needed.
5. Node.js sends results back to React.
6. React shows updated data to the user.

---

## ▶ How to Run the Project

### *1. Compile the C Files*


gcc students.c utils.c -o students
gcc rooms.c utils.c -o rooms
gcc complaints.c utils.c -o complaints
gcc entry_exit.c utils.c -o entry_exit


### *2. Start the Backend*


cd server
npm install
node index.js


Backend runs on: *[http://localhost:5000](http://localhost:5000)*

### *3. Start the Frontend*


cd client
npm install
npm run dev


Frontend runs on: *[http://localhost:5173](http://localhost:5173)*

---

## 📚 Technology Used

* *C* → Core logic
* *Node.js* → Backend bridge
* *React* → Frontend UI
* *JSON* → For storing data

---
