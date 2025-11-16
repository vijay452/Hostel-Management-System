import React, { useState, useEffect } from 'react';

const styles = {
    container: { padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    heading: { color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '30px' },
    formSection: { backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    formGroup: { marginBottom: '20px', position: 'relative' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' },
    input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', backgroundColor: 'white' },
    button: { padding: '12px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s', fontWeight: 'bold' },
    messageSuccess: { padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginTop: '20px', border: '1px solid #c3e6cb' },
    messageError: { padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginTop: '20px', border: '1px solid #f5c6cb' },
    roomCard: { backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px', margin: '10px', width: '280px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    roomGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' },
    roomAvailable: { backgroundColor: '#e9f7ef', borderLeft: '5px solid #28a745' },
    roomFull: { backgroundColor: '#fdeae8', borderLeft: '5px solid #dc3545' },
    roomOccupants: { fontSize: '0.9em', color: '#6c757d' },
};


const BookRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [bookingDetails, setBookingDetails] = useState({
        studentID: '',
        studentName: '',
        roomNumber: '',
        durationDays: 30,
    });
    const [submitStatus, setSubmitStatus] = useState({ state: 'idle', message: '' });

    // --- FETCH ROOMS ---
    const fetchRooms = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/rooms/list');
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            const data = await response.json();
            setRooms(data);
            setLoading(false);
            setFetchError(null);
        } catch (err) {
            console.error("Fetch Rooms Error:", err);
            setFetchError("Error: Could not fetch data. Check if the backend is running on http://localhost:5000.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // --- HANDLERS ---
    const handleBookingChange = (e) => {
        setBookingDetails({
            ...bookingDetails,
            [e.target.name]: e.target.value
        });
        setSubmitStatus({ state: 'idle', message: '' });
    };

    const handleRoomSelect = (roomNumber) => {
        setBookingDetails({
            ...bookingDetails,
            roomNumber: roomNumber
        });
    };
    
    // --- SUBMISSION LOGIC ---
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        if (!bookingDetails.studentID.trim() || !bookingDetails.studentName.trim() || !bookingDetails.roomNumber) {
            setSubmitStatus({ state: 'error', message: '❌ Please fill in Student ID, Name, and select a Room.' });
            return;
        }

        setSubmitStatus({ state: 'submitting', message: 'Processing booking...' });

        try {
            const response = await fetch('http://localhost:5000/api/rooms/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingDetails),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Room booking failed.');
            }

            setSubmitStatus({ state: 'success', message: `✅ Success! ${result.studentID} booked Room ${result.roomNumber}.` });
            
            fetchRooms(); 
            setBookingDetails({ studentID: '', studentName: '', roomNumber: '', durationDays: 30 });

        } catch (err) {
            setSubmitStatus({ state: 'error', message: `❌ Booking failed: ${err.message}` });
        }
    };

    // Filter and prepare room data for rendering
    const availableRooms = rooms.filter(room => room.occupants < room.capacity);

    // --- RENDER LOGIC ---
    // Note: All JSX uses the defined 'styles' object now
    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>🔑 Book a Room</h2>

            {/* --- BOOKING FORM --- */}
            <div style={styles.formSection}>
                <form onSubmit={handleBookingSubmit}>
                    
                    {/* 1. Student ID Input */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="studentID">Student ID:</label>
                        <input 
                            style={styles.input}
                            type="text"
                            id="studentID"
                            name="studentID"
                            value={bookingDetails.studentID}
                            onChange={handleBookingChange}
                            placeholder="Enter Student ID (e.g., S12345)"
                        />
                    </div>

                    {/* 2. Student Name Input (Fixes generic name issue) */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="studentName">Student Name (*Required):</label>
                        <input 
                            style={styles.input}
                            type="text"
                            id="studentName"
                            name="studentName"
                            value={bookingDetails.studentName}
                            onChange={handleBookingChange}
                            placeholder="Enter Full Name"
                        />
                    </div>
                    
                    {/* 3. Room Selection Info */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Selected Room:</label>
                        <p style={{ color: bookingDetails.roomNumber ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                            {bookingDetails.roomNumber ? `Room ${bookingDetails.roomNumber}` : 'Please select a room below'}
                        </p>
                    </div>

                    {/* 4. Booking Duration */}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="durationDays">Booking Duration (Days):</label>
                        <input 
                            style={styles.input}
                            type="number"
                            id="durationDays"
                            name="durationDays"
                            value={bookingDetails.durationDays}
                            onChange={handleBookingChange}
                            min="1"
                        />
                    </div>

                    {/* Submission Status Message */}
                    {submitStatus.state === 'success' && (<div style={styles.messageSuccess} dangerouslySetInnerHTML={{ __html: submitStatus.message }}></div>)}
                    {submitStatus.state === 'error' && (<div style={styles.messageError}>{submitStatus.message}</div>)}

                    {/* 5. Confirmation Button */}
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={submitStatus.state === 'submitting'}
                    >
                        {submitStatus.state === 'submitting' ? 'Booking...' : 'Confirm Room Booking'}
                    </button>
                </form>
            </div>

            {/* --- AVAILABLE ROOMS LIST --- */}
            <h3 style={{ marginTop: '40px', color: '#333' }}>Currently Available Rooms:</h3>
            
            {loading && <p>Loading rooms...</p>}
            {fetchError && <div style={styles.messageError}>{fetchError}</div>}
            
            <div style={styles.roomGrid}>
                {availableRooms.length > 0 ? (
                    availableRooms.map(room => {
                        const isSelected = room.roomNumber === bookingDetails.roomNumber;
                        return (
                            <div 
                                key={room.roomNumber} 
                                onClick={() => handleRoomSelect(room.roomNumber)}
                                style={{
                                    ...styles.roomCard, 
                                    ...styles.roomAvailable,
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#a8dadc' : styles.roomAvailable.backgroundColor,
                                    border: isSelected ? '2px solid #1d3557' : '1px solid #e9ecef'
                                }}
                            >
                                <h4>Room {room.roomNumber} ({room.type})</h4>
                                <p style={styles.roomOccupants}>Capacity: {room.occupants}/{room.capacity}</p>
                                <p style={{fontWeight: 'bold', color: '#28a745'}}>Select to Book</p>
                            </div>
                        );
                    })
                ) : (
                    !loading && !fetchError && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>No available rooms right now!</p>
                )}
            </div>
        </div>
    );
};

export default BookRoom;