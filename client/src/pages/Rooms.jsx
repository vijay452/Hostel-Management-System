import React, { useState, useEffect } from 'react';
import RealTimeClock from '../components/RealTimeClock'; // <-- IMPORT THE CLOCK COMPONENT

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Styling for a modern table interface
    const styles = {
        container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
        heading: { marginBottom: '20px', color: '#333' },
        table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
        th: { backgroundColor: '#f4f4f4', padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' },
        td: { padding: '12px', borderBottom: '1px solid #eee' },
        row: { transition: 'background-color 0.3s' },
        rowHover: { ':hover': { backgroundColor: '#f9f9f9' } },
        statusAvailable: { color: 'green', fontWeight: 'bold' },
        statusOccupied: { color: 'red', fontWeight: 'bold' },
        loading: { textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#007bff' },
        error: { textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#dc3545', border: '1px solid #dc3545', backgroundColor: '#f8d7da', borderRadius: '5px' }
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/rooms/list');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setRooms(data);
                setError(null); 

            } catch (err) {
                console.error("Failed to fetch rooms:", err);
                setError(`Could not fetch data. Check if the backend is running on ${'http://localhost:5000'}.`);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading) {
        return <div style={styles.loading}>🔄 Loading rooms data...</div>;
    }

    if (error) {
        return <div style={styles.error}>🚨 Error: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>🏠 Room List ({rooms.length} Total)</h2>
            
            {/* -------------------------------------- */}
            {/* 🔥 INTEGRATED REAL-TIME CLOCK HERE 🔥 */}
            {/* -------------------------------------- */}
            <RealTimeClock />

            {rooms.length === 0 ? (
                <p>No rooms found.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Room Number</th>
                            <th style={styles.th}>Capacity</th>
                            <th style={styles.th}>Occupants</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Room Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id || room.roomNumber} style={styles.row}>
                                <td style={styles.td}>{room.roomNumber}</td>
                                <td style={styles.td}>{room.capacity}</td>
                                <td style={styles.td}>{room.occupants || 0}</td>
                                <td style={styles.td}>
                                    <span style={room.isAvailable ? styles.statusAvailable : styles.statusOccupied}>
                                        {room.isAvailable ? 'Available' : 'Occupied'}
                                    </span>
                                </td>
                                <td style={styles.td}>{room.type || 'Standard'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Rooms;