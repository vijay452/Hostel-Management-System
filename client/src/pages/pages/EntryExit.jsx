import React, { useState, useEffect } from 'react';

const styles = {
    container: { padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    heading: { color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '30px' },
    messageError: { padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px', marginBottom: '20px' },
    messageSuccess: { padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px', border: '1px solid #c3e6cb' },
    formSection: { backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '40px' },
    formGroup: { marginBottom: '15px', display: 'flex', gap: '20px', alignItems: 'center' },
    label: { fontWeight: 'bold', color: '#333' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flexGrow: 1, minWidth: '150px' },
    button: (color) => ({
        padding: '10px 20px',
        backgroundColor: color,
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    }),
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' },
    th: { backgroundColor: '#e9ecef', padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', color: '#495057' },
    td: { padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' },
};

const EntryExit = () => {
    const [logs, setLogs] = useState([]);
    const [studentID, setStudentID] = useState('');
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [logStatus, setLogStatus] = useState({ state: 'idle', message: '' });

    const API_URL = 'http://localhost:5000/api';

    // Function to fetch logs (Fixes the initial error)
    const fetchLogs = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const response = await fetch(`${API_URL}/entry-exit/logs`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Sort logs by timestamp (newest first)
            const sortedLogs = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setLogs(sortedLogs);
        } catch (err) {
            console.error("Fetch Logs Error:", err);
            setFetchError("🚨 Error: Could not load logs. Check the backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleLogSubmit = async (type) => {
        if (!studentID.trim()) {
            setLogStatus({ state: 'error', message: 'Please enter a Student ID.' });
            return;
        }

        setLogStatus({ state: 'submitting', message: `Logging ${type}...` });

        try {
            const response = await fetch(`${API_URL}/entry-exit/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentID, type }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Failed to log ${type}.`);
            }

            setLogStatus({ state: 'success', message: `✅ Log successful: ${result.message}` });
            setStudentID(''); // Clear input
            fetchLogs(); // Reload logs to show the new entry

        } catch (err) {
            setLogStatus({ state: 'error', message: `❌ Submission failed: ${err.message}` });
        }
        
        // Clear status message after a few seconds
        setTimeout(() => setLogStatus({ state: 'idle', message: '' }), 5000);
    };
    
    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>🚪 Entry / Exit Management</h2>
            
            {/* Log Submission Form */}
            <div style={styles.formSection}>
                <h3>Log Movement</h3>
                {logStatus.state === 'success' && (<div style={styles.messageSuccess}>{logStatus.message}</div>)}
                {logStatus.state === 'error' && (<div style={styles.messageError}>{logStatus.message}</div>)}

                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="studentID">Student ID:</label>
                    <input 
                        style={styles.input}
                        type="text"
                        id="studentID"
                        value={studentID}
                        onChange={(e) => {
                            setStudentID(e.target.value);
                            setLogStatus({ state: 'idle', message: '' }); // Clear status on change
                        }}
                        placeholder="Enter Student ID"
                    />
                    
                    <button 
                        style={styles.button('#28a745')}
                        onClick={() => handleLogSubmit('entry')}
                        disabled={logStatus.state === 'submitting'}
                    >
                        Log Entry
                    </button>
                    
                    <button 
                        style={styles.button('#dc3545')}
                        onClick={() => handleLogSubmit('exit')}
                        disabled={logStatus.state === 'submitting'}
                    >
                        Log Exit
                    </button>
                </div>
            </div>

            {/* Log List */}
            <h3>Recent Movement Logs</h3>
            
            {fetchError && (<div style={styles.messageError}>{fetchError}</div>)}

            {loading ? (
                <p>Loading logs...</p>
            ) : logs.length === 0 ? (
                <p>No entry or exit logs found.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            {/* REMOVED: ID Header */}
                            <th style={styles.th}>Student ID</th>
                            <th style={styles.th}>Student Name</th> {/* KEPT: Student Name Header */}
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                {/* REMOVED: Log ID Cell (log.id.slice(-6)) */}
                                <td style={styles.td}>{log.studentID}</td>
                                <td style={styles.td}>{log.studentName || 'N/A'}</td> {/* KEPT: Student Name Cell */}
                                <td style={styles.td}>
                                    <span style={{ fontWeight: 'bold', color: log.type === 'entry' ? '#28a745' : '#dc3545' }}>
                                        {log.type.toUpperCase()}
                                    </span>
                                </td>
                                <td style={styles.td}>{formatTimestamp(log.timestamp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EntryExit;