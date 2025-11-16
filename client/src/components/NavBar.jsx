import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {

    const styles = {
        nav: {
            backgroundColor: '#343a40',
            padding: '15px 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        logo: {
            color: '#ffffff',
            fontSize: '1.5em',
            fontWeight: 'bold',
            textDecoration: 'none',
        },
        links: {
            display: 'flex',
        },
        link: {
            color: '#adb5bd', 
            textDecoration: 'none',
            marginLeft: '25px',
            fontSize: '1em',
            transition: 'color 0.3s',
        },
       
        linkHover: {
            color: '#ffffff', 
        }
    };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>
               🏢 Hostel Managemen
            </Link>
            <div style={styles.links}>
                <Link to="/rooms" style={styles.link}>Rooms</Link>
                <Link to="/students" style={styles.link}>Students</Link>
                <Link to="/book" style={styles.link}>Book Room</Link>
                <Link to="/complaints" style={styles.link}>Complaints</Link>
                <Link to="/logs" style={styles.link}>Entry/Exit</Link>
            </div>
        </nav>
    );
};

export default NavBar;