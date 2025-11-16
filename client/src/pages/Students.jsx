import React, { useState, useEffect } from 'react';

const Students = () => {
    // --- STATE MANAGEMENT ---
    // 👇 THIS SECTION MUST BE PRESENT to define 'loading' and 'fetchError'
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true); // <--- FIX: Defines 'loading'
    const [fetchError, setFetchError] = useState(null); // <--- Also defines 'fetchError'

    // --- STYLING ---
    const styles = {
        container: { 
            padding: '30px', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            fontFamily: 'Arial, sans-serif' 
        },
        heading: { 
            color: '#ffc107', 
            borderBottom: '2px solid #ffc107', 
            paddingBottom: '10px', 
            marginBottom: '30px' 
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white'
        },
        th: {
            backgroundColor: '#fff3cd', 
            padding: '12px',
            textAlign: 'left',
            borderBottom: '1px solid #ffeeba',
            color: '#856404'
        },
        td: {
            padding: '12px',
            borderBottom: '1px solid #dee2e6',
            textAlign: 'left'
        },
        badge: {
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '0.9em',
            backgroundColor: '#007bff',
            color: 'white'
        },
        messageError: { 
            padding: '15px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            border: '1px solid #f5c6cb', 
            borderRadius: '5px', 
            marginTop: '20px' 
        }
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/students/list');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setStudents(data);
            } catch (err) {
                console.error("Failed to fetch students:", err);
                setFetchError("Error: Could not fetch data. Check if the backend is running on http://localhost:5000.");
            } finally {
                setLoading(false); // <--- Uses setLoading
            }
        };

        fetchStudents();
    }, []);

    // --- RENDER LOGIC ---
    if (loading) { // <--- Checks the 'loading' state
        return <div style={styles.container}>🔄 Loading student data...</div>;
    }

    if (fetchError) { // <--- Checks the 'fetchError' state
        return <div style={{ ...styles.container, ...styles.messageError }}>🚨 {fetchError}</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>🧑‍🎓 Hostel Students List</h2>

            {students.length === 0 ? (
                <p>No student records found. Students are added automatically when they book a room.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Student ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Room No.</th>
                            <th style={styles.th}>Course</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id || student.studentID}>
                                <td style={styles.td}>{student.studentID}</td>
                                <td style={styles.td}>{student.name || 'N/A'}</td>
                                <td style={styles.td}>
                                    <span style={styles.badge}>{student.roomNumber || 'None'}</span>
                                </td>
                                <td style={styles.td}>{student.course || 'Pending'}</td>
                                <td style={styles.td}>Active</td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Students;