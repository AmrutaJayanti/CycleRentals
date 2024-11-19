import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

// Utility function to generate a rental code
const generateRentalCode = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const RentalConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [rentalCode, setRentalCode] = useState('');
    const rentalDetails = location.state;

    useEffect(() => {
        // If rentalDetails is undefined, navigate back to the home page
        if (!rentalDetails) {
            navigate('/');
            return;
        }

        // Set the rental code from state if available, or generate a new one
        setRentalCode(rentalDetails.rentalCode || generateRentalCode());
    }, [rentalDetails, navigate]);

    // Early return after the hook to avoid conditional hook calls
    if (!rentalDetails) {
        return null;
    }

    return (
        <div className="confirmation-form-container">
            <h2>Rental Details</h2>
            <div className="confirmation-details">
                <p>
                    <span className="label">Name:</span>
                    <span className="value">{rentalDetails.userName}</span>
                </p>
                <p>
                    <span className="label">Roll Number:</span>
                    <span className="value">{rentalDetails.rollNo}</span>
                </p>
                <p>
                    <span className="label">Destination:</span>
                    <span className="value">{rentalDetails.destination}</span>
                </p>
                <p>
                    <span className="label">Hours Required:</span>
                    <span className="value">{rentalDetails.hoursRequired}</span>
                </p>
                <p>
                    <span className="label">Total Amount:</span>
                    <span className="value">${rentalDetails.totalAmount}</span>
                </p>
                <p>
                    <span className="label">Cycle Model:</span>
                    <span className="value">{rentalDetails.cycle.cycleModel}</span>
                </p>
                <div className="rental-code">Rental Code: {rentalCode}</div>
            </div>
            <a href="/" className="return-home-button">Return Home</a>
        </div>
    );
};

export default RentalConfirmation;
