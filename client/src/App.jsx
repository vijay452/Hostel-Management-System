import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Rooms from './pages/Rooms';
import Students from './pages/Students';
import BookRoom from './pages/BookRoom';
import Complaints from './pages/Complaints';
import SubmitComplaint from './pages/SubmitComplaint'; 
import EntryExit from './pages/EntryExit';

const App = () => {
    const navStyles = {
        nav: {
            backgroundColor: '#343a40',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
        },
        logo: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#dc3545',
            textDecoration: 'none',
        },
        navList: {
            listStyle: 'none',
            display: 'flex',
            margin: 0,
            padding: 0,
        },
        navItem: {
            marginLeft: '20px',
        },
        navLink: {
            color: 'white',
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.3s',
        },
        navLinkHover: {
            backgroundColor: '#495057',
        }
    };

    return (
        <Router>
            <nav style={navStyles.nav}>
                <Link to="/" style={navStyles.logo}>
                    <span role="img" aria-label="hostel">🏘️</span> Hostel Management
                </Link>
                <ul style={navStyles.navList}>
                    <li style={navStyles.navItem}>
                        <Link to="/rooms" style={navStyles.navLink}>Rooms</Link>
                    </li>
                    <li style={navStyles.navItem}>
                        <Link to="/students" style={navStyles.navLink}>Students</Link>
                    </li>
                    <li style={navStyles.navItem}>
                        <Link to="/book-room" style={navStyles.navLink}>Book Room</Link>
                    </li>
                    <li style={navStyles.navItem}>
                        <Link to="/complaints" style={navStyles.navLink}>Complaints List</Link>
                    </li>
                    <li style={navStyles.navItem}>
                        {/* Normalized link with full spelling */}
                        <Link to="/submit-complaint" style={navStyles.navLink}>Submit Complaint</Link>
                    </li>
                    <li style={navStyles.navItem}>
                        <Link to="/entry-exit" style={navStyles.navLink}>Entry/Exit</Link>
                    </li>
                </ul>
            </nav>

            <Routes>
                {/* Router definitions */}
                <Route path="/" element={<Rooms />} /> 
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/students" element={<Students />} />
                <Route path="/book-room" element={<BookRoom />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/submit-complaint" element={<SubmitComplaint />} /> 
                <Route path="/entry-exit" element={<EntryExit />} />
            </Routes>
        </Router>
    );
};

export default App;