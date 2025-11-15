import React, { useState, useEffect } from 'react';

const styles = {
    container: { padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    // Heading styling (matching the red line and magenta icon)
    headingContainer: { borderBottom: '2px solid #dc3545', paddingBottom: '10px', marginBottom: '30px', display: 'flex', alignItems: 'center' },
    headingText: { color: '#333', fontSize: '1.8em', fontWeight: 'bold', marginLeft: '10px' },
    headingIcon: { color: '#dc3545', fontSize: '1.5em', marginRight: '5px' },
    // Table styling (matching the light pink/red header background)
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' },
    th: { backgroundColor: '#f8d7da', padding: '12px', textAlign: 'left', borderBottom: '1px solid #f5c6cb', color: '#721c24', fontWeight: 'bold' }, // Light pink header
    td: { padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' },
    statusBadge: { padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9em', display: 'inline-block' },
    messageDefault: { padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9', color: '#555' },
    messageError: { padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px', marginTop: '20px' },
};


const getStatusStyle = (status) => {
    switch (status) {
        case 'New':
            return { backgroundColor: '#ffc107', color: '#333' }; // Yellow/Orange (Matches screenshot)
        case 'In Progress':
            return { backgroundColor: '#007bff', color: 'white' }; 
        case 'Resolved':
            return { backgroundColor: '#28a745', color: 'white' }; 
        default:
            return { backgroundColor: '#6c757d', color: 'white' }; 
    }
};

const Complaints = () => {
   
    const [complaints, setComplaints] = useState([]);
    const [students, setStudents] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Helper function to get the student's name from their ID
    const getStudentName = (studentID) => {
        const student = students.find(s => s.studentID === studentID);
        return student ? student.name : `ID: ${studentID} (Unknown)`;
    };

    
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. Fetch Students List
                const studentRes = await fetch('http://localhost:5000/api/students/list');
                if (!studentRes.ok) throw new Error("Failed to load students list.");
                const studentData = await studentRes.json();
                setStudents(studentData);
                
                // 2. Fetch Complaints List
                const response = await fetch('http://localhost:5000/api/complaints/list'); 
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setComplaints(data);
                setFetchError(null);
            } catch (err) {
                console.error("Fetch Error:", err);
                setFetchError("🚨 Error: Could not load data. Check API route and backend status.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

  
    if (loading) {
        return <div style={styles.container}>🔄 Loading complaints...</div>;
    }

    if (fetchError) {
        return <div style={{ ...styles.container, ...styles.messageError }}>{fetchError}</div>;
    }


    return (
        <div style={styles.container}>
            <div style={styles.headingContainer}>
                {/* Simplified Icon - Matching the magenta/red circle in screenshots */}
                <span style={styles.headingIcon}>&#128308;</span> 
                <h2 style={styles.headingText}>Student Complaints</h2>
            </div>
            
            {complaints.length === 0 ? (
                <div style={styles.messageDefault}>
                    <p>No active complaints at this time. Use the "Submit Complaint" form to log a new issue.</p>
                </div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            {/* ID Removed. Student ID column replaced with Student Name */}
                            <th style={styles.th}>Student Name</th> 
                            <th style={styles.th}>Room No.</th>
                            <th style={styles.th}>Issue Description</th>
                            <th style={styles.th}>Date Logged</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint) => (
                            <tr key={complaint.id} style={{ transition: 'background-color 0.15s' }}>
                                
                                {/* Display Student Name using lookup function */}
                                <td style={{ ...styles.td, fontWeight: '500' }}>
                                    {getStudentName(complaint.studentID)}
                                </td>
                                
                                <td style={styles.td}>{complaint.roomNumber}</td>
                                <td style={styles.td}>{complaint.issue}</td>
                                <td style={styles.td}>{complaint.date}</td>
                                <td style={styles.td}>
                                    <span style={{ ...styles.statusBadge, ...getStatusStyle(complaint.status) }}>
                                        {complaint.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Complaints;
