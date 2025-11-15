import React, { useState, useEffect } from 'react';

const styles = {
    clock: {
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#007bff', 
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        textAlign: 'center',
        margin: '20px 0',
        border: '1px solid #dee2e6',
    },
    date: {
        fontSize: '0.8em',
        fontWeight: 'normal',
        color: '#6c757d',
        display: 'block',
        marginTop: '5px',
    }
};

const RealTimeClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []); 

    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const formattedTime = currentTime.toLocaleTimeString(undefined, timeOptions);
    const formattedDate = currentTime.toLocaleDateString(undefined, dateOptions);

    return (
        <div style={styles.clock}>
            {formattedTime}
            <span style={styles.date}>{formattedDate}</span>
        </div>
    );
};

export default RealTimeClock;