import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';

const RentalPage = () => {
    const { cycleId } = useParams();
    const navigate = useNavigate();
    const [cycle, setCycle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [renting, setRenting] = useState(false);
    const [rentMessage, setRentMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [destination, setDestination] = useState('');
    const [hoursRequired, setHoursRequired] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [rentalCode, setRentalCode] = useState('');

    useEffect(() => {
        const fetchCycle = async () => {
            try {
                const response = await fetch(`http://localhost:5000/cyclesInfo/${cycleId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch cycle data: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (data && data.cycle) {
                    setCycle(data.cycle);
                } else {
                    throw new Error('Cycle data not found');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCycle();
    }, [cycleId]);

    useEffect(() => {
        setTotalAmount(hoursRequired * (cycle ? cycle.cph : 0));
    }, [hoursRequired, cycle]);

    const handleRentCycle = async () => {
        setRenting(true);
        setRentMessage('');

        const rentData = {
            user_name: userName,
            time: new Date().toISOString(),
            roll_no: rollNo,
            cycle_id: cycleId,
            destination: destination,
            hours_required: hoursRequired,
            total_amount: totalAmount
        };

        try {
            const response = await fetch('http://localhost:5000/rentCycle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(rentData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to rent cycle');
            }

            setRentMessage(result.message);
            setRentalCode(result.rental_code); // Assuming API returns a rental code
        } catch (error) {
            setRentMessage(error.message);
        } finally {
            setRenting(false);
        }
    };

    const handleViewDetails = () => {
        navigate(`/rental-details/${cycleId}`, { 
            state: { 
                userName, 
                rollNo, 
                destination, 
                hoursRequired, 
                totalAmount, 
                cycle, 
                rentalCode 
            } 
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cycle) return <p>Cycle not found</p>;

    return (
        <div className="rental-page-container">
            <h2 className="rental-page-heading">Rental Details for {cycle.cycleModel}</h2>
            <div className="rental-content">
                <div className="cycle-details">
                    <p>Cost per hour: {cycle.cph}</p>
                    <p>Availability: {cycle.curr_avail}</p>
                    {cycle.image && <img src={cycle.image} alt={cycle.cycleModel} />}
                </div>
                
                <div className="rental-form">
                    <label>
                        Your Name:
                        <input 
                            type="text" 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)} 
                            required 
                        />
                    </label>
                    <label>
                        Roll Number:
                        <input 
                            type="text" 
                            value={rollNo} 
                            onChange={(e) => setRollNo(e.target.value)} 
                            required 
                        />
                    </label>
                    <label>
                        Destination:
                        <input 
                            type="text" 
                            value={destination} 
                            onChange={(e) => setDestination(e.target.value)} 
                            required 
                        />
                    </label>
                    <label>
                        Number of Hours:
                        <input 
                            type="number" 
                            value={hoursRequired} 
                            onChange={(e) => setHoursRequired(e.target.value)} 
                            required 
                        />
                    </label>
                </div>
            </div>

            <button 
                className="rent-button" 
                onClick={handleRentCycle} 
                disabled={renting || !userName || !rollNo || !destination || !hoursRequired}
            >
                {renting ? 'Renting...' : 'Rent this Cycle'}
            </button>
            
            {rentMessage && (
                <>
                    <p className="rent-message">{rentMessage}</p>
                    <button className="view-details-button" onClick={handleViewDetails}>
                        View Rental Details
                    </button>
                </>
            )}
        </div>
    );
};

export default RentalPage;
