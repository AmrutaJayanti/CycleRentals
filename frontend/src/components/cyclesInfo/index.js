import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'; 

const CyclesInfo = () => {
    const [cycles, setCycles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCycles = async () => {
            try {
                const response = await fetch('http://localhost:5000/cyclesInfo');
                const data = await response.json();
                setCycles(data.cycles || []);  // Fallback to an empty array if data.cycles is undefined
            } catch (error) {
                console.error('Error fetching cycles:', error);
            }
        };

        fetchCycles();
    }, []);

    const handleSeeMore = (cycleId) => {
        navigate(`/cyclesInfo/${cycleId}`);
    };

    return (
        <div>
            <h2 className="h2_color">Available Cycles</h2>
            <div className="cycle-container">
                {cycles.length > 0 ? (
                    cycles.map((cycle) => (
                        <div key={cycle._id} className="cycle-card">
                            <h3>{cycle.cycleModel}</h3>
                            <p>Cost per hour: {cycle.cph}</p>
                            <p>Availability: {cycle.curr_avail}</p>
                            <button onClick={() => handleSeeMore(cycle._id)}>See More</button>
                        </div>
                    ))
                ) : (
                    <p>No cycles available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default CyclesInfo;
