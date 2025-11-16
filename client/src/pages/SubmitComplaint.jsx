import React, { useState } from 'react';

const styles = {
    container: { padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    heading: { color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '10px', marginBottom: '30px' },
    formSection: { backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' },
    input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' },
    button: { padding: '12px 25px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s', fontWeight: 'bold' },
    messageSuccess: { padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginTop: '20px', border: '1px solid #c3e6cb' },
    messageError: { padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginTop: '20px', border: '1px solid #f5c6cb' },
};

const SubmitComplaint = () => {
    const [complaintDetails, setComplaintDetails] = useState({
        studentID: '',
        roomNumber: '',
        issue: '',
    });
    const [submitStatus, setSubmitStatus] = useState({ state: 'idle', message: '' });

    const handleChange = (e) => {
        setComplaintDetails({
            ...complaintDetails,
            [e.target.name]: e.target.value
        });
        setSubmitStatus({ state: 'idle', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!complaintDetails.studentID.trim() || !complaintDetails.roomNumber.trim() || !complaintDetails.issue.trim()) {
            setSubmitStatus({ state: 'error', message: '❌ Please fill in all required fields.' });
            return;
        }

        setSubmitStatus({ state: 'submitting', message: 'Submitting complaint...' });

        try {
            // Sends data to the POST /api/complaints/submit route
            const response = await fetch('http://localhost:5000/api/complaints/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complaintDetails),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Complaint submission failed.');
            }

            setSubmitStatus({ state: 'success', message: `✅ Complaint ID ${result.id} submitted successfully for Room ${result.roomNumber}.` });
            
            // Clear the form after success
            setComplaintDetails({ studentID: '', roomNumber: '', issue: '' });

        } catch (err) {
            setSubmitStatus({ state: 'error', message: `❌ Submission failed: ${err.message}` });
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>🚨 Submit a New Complaint</h2>

            <div style={styles.formSection}>
                <form onSubmit={handleSubmit}>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="studentID">Student ID:</label>
                        <input 
                            style={styles.input}
                            type="text"
                            id="studentID"
                            name="studentID"
                            value={complaintDetails.studentID}
                            onChange={handleChange}
                            placeholder="Your Student ID (e.g., S12345)"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="roomNumber">Room Number:</label>
                        <input 
                            style={styles.input}
                            type="text"
                            id="roomNumber"
                            name="roomNumber"
                            value={complaintDetails.roomNumber}
                            onChange={handleChange}
                            placeholder="Your room number"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="issue">Describe the Issue:</label>
                        <textarea 
                            style={styles.textarea}
                            id="issue"
                            name="issue"
                            value={complaintDetails.issue}
                            onChange={handleChange}
                            placeholder="E.g., Broken AC, plumbing leak, noise complaint."
                            required
                        />
                    </div>
                    
                    {/* Submission Status Message */}
                    {submitStatus.state === 'success' && (<div style={styles.messageSuccess}>{submitStatus.message}</div>)}
                    {submitStatus.state === 'error' && (<div style={styles.messageError}>{submitStatus.message}</div>)}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={submitStatus.state === 'submitting'}
                    >
                        {submitStatus.state === 'submitting' ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmitComplaint;