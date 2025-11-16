const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// NOTE: This assumes 'data.json' exists in the same directory as api_route.js 
const DATA_PATH = path.join(__dirname, 'data.json'); 

// --- Helper Functions for Data Persistence ---

const getJsonData = () => {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        // Safely parse data, initializing arrays if keys are missing
        const json = JSON.parse(data);
        return { 
            rooms: json.rooms || [], 
            students: json.students || [], 
            complaints: json.complaints || [], 
            logs: json.logs || [] 
        };
    } catch (error) {
        // If file doesn't exist or is invalid, initialize with empty arrays
        return { rooms: [], students: [], complaints: [], logs: [] }; 
    }
};

const writeJsonData = (data) => {
    try {
        // Use a 4-space indent for readable JSON
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 4));
        return true;
    } catch (error) {
        console.error("Error writing to data.json:", error);
        return false;
    }
};

// --- Initialization Check (MANDATORY) ---
// If the data file is missing or empty, create default data
if (!fs.existsSync(DATA_PATH) || fs.statSync(DATA_PATH).size === 0) {
    console.log("data.json not found or empty. Initializing data.");
    const initialData = {
        rooms: [
            // Added capacity for robust booking logic
            { roomNumber: "101", capacity: 2, isAvailable: true, occupants: 0 },
            { roomNumber: "102", capacity: 2, isAvailable: true, occupants: 0 },
            { roomNumber: "201", capacity: 1, isAvailable: true, occupants: 0 },
            { roomNumber: "202", capacity: 2, isAvailable: true, occupants: 0 },
            { roomNumber: "104", capacity: 3, isAvailable: true, occupants: 0 },
        ],
        students: [
            // Example pre-registered student
            { studentID: "24011317", name: "Vijay Kumar", roomNumber: "N/A", course: "B.Tech", status: "Active" },
        ],
        complaints: [],
        logs: []
    };
    writeJsonData(initialData);
}


// --- GET Routes ---

router.get('/students/list', (req, res) => {
    const data = getJsonData();
    res.json(data.students);
});

router.get('/complaints/list', (req, res) => {
    const data = getJsonData();
    res.json(data.complaints || []); 
});

router.get('/entry-exit/logs', (req, res) => {
    const data = getJsonData();
    const logs = data.logs || [];
    
    // Sort logs by timestamp in descending order (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(logs); 
});

router.get('/rooms/list', (req, res) => {
    const data = getJsonData();
    res.json(data.rooms);
});


// --- POST Routes ---

/**
 * Handles Room Booking.
 * Automatically registers the student if the ID is new (REQUIRES studentName).
 * Checks room capacity before booking.
 */
router.post('/rooms/book', (req, res) => {
    const { studentID, studentName, roomNumber } = req.body;
    let data = getJsonData();
    
    if (!studentID || !roomNumber || !studentName) {
        return res.status(400).json({ message: "Student ID, Name, and Room Number are required." });
    }

    // Find if the student already exists
    let student = data.students.find(s => s.studentID === studentID);
    
    // 1. Handle Room Existence and Capacity
    const room = data.rooms.find(r => r.roomNumber === roomNumber);
    if (!room) {
        return res.status(404).json({ message: `Room ${roomNumber} not found.` });
    }
    
    // Check if room is full
    if (room.occupants >= room.capacity) {
         return res.status(400).json({ message: `Room ${roomNumber} is fully occupied (Max: ${room.capacity}).` });
    }
    
    // 2. Handle Student Registration/Update (THE CRITICAL FIX)
    if (!student) {
        // Register new student if ID is not found 
        student = {
            studentID,
            name: studentName, 
            roomNumber: roomNumber,
            course: "Pending", // Default course status
            status: "Active"
        };
        data.students.push(student);
    } else {
        // If student exists, update their room and status
        student.roomNumber = roomNumber;
        student.status = "Active";
    }

    // 3. Update Room Occupancy
    room.occupants += 1;
    // Set isAvailable to false only if the room is now full
    room.isAvailable = room.occupants < room.capacity; 

    if (writeJsonData(data)) {
        res.status(200).json({ 
            message: `Room ${roomNumber} successfully booked for ${student.name}. Occupants: ${room.occupants}/${room.capacity}`, 
            studentID, 
            roomNumber 
        });
    } else {
        res.status(500).json({ message: "Failed to save data to file." });
    }
});



router.post('/complaints/submit', (req, res) => {
    const { studentID, roomNumber, issue } = req.body;
    let data = getJsonData();

    if (!studentID || !roomNumber || !issue) {
        return res.status(400).json({ message: "All fields are required." });
    }
    
    // Use full timestamp + small random string for a unique ID
    const newId = 'C' + Date.now().toString() + Math.random().toString(36).substring(2, 4); 
    const newComplaint = { 
        id: newId, 
        studentID, 
        roomNumber, 
        issue, 
        status: "New", 
        date: new Date().toLocaleDateString('en-GB')
    };
    
    if (!data.complaints) {
        data.complaints = [];
    }
    
    data.complaints.unshift(newComplaint); 

    if (writeJsonData(data)) {
        res.status(201).json({ message: "Complaint successfully submitted.", id: newId });
    } else {
        res.status(500).json({ message: "Failed to save complaint data to file." });
    }
});


router.post('/entry-exit/log', (req, res) => {
    const { studentID, type } = req.body; 
    let data = getJsonData();

    if (!studentID || !type) {
        return res.status(400).json({ message: "Student ID and Log Type are required." });
    }
    
    const student = data.students.find(s => s.studentID === studentID);
    
    if (!student) {
         // Student must be registered (via room booking) before logging movement
        return res.status(404).json({ message: `Student ID ${studentID} not found. Log not created.` });
    }

    const logType = type.toUpperCase();
    
    const newLog = {
        // Use the full millisecond timestamp string as a guaranteed unique ID
        id: Date.now().toString(), 
        studentID: studentID,
        studentName: student.name, 
        type: logType,
        timestamp: new Date().toISOString(), // Use ISO string for precise time/date sorting
    };

    if (!data.logs) {
        data.logs = [];
    }

    data.logs.push(newLog); 

    if (writeJsonData(data)) {
        const displayTime = new Date(newLog.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });

        res.status(201).json({ 
            message: `Log created for ${student.name}: ${logType} at ${displayTime}`,
            log: newLog
        });
    } else {
        res.status(500).json({ message: "Failed to save log data to file." });
    }
});


module.exports = router;
