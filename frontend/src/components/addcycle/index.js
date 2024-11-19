import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './index.css';

const AddCycle = () => {
    const [cycleModel, setCycleModel] = useState("");
    const [cph, setCph] = useState("");
    const [curr_avail, setCurr_avail] = useState("available");
    const [image, setImage] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cycleModel || !cph || !image) {
            setMessage("Please fill in all fields.");
            setTimeout(() => {
                navigate("/cyclesInfo"); 
            }, 2000);
            return;
        }

        const cycleData = {
            cycleModel: cycleModel,
            cph: Number(cph),
            curr_avail: curr_avail,
            image: image
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/addCycle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(cycleData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Cycle added successfully!");
                setCycleModel("");
                setCph("");
                setCurr_avail("available");
                setImage("");

                setTimeout(() => {
                    navigate("/cyclesInfo"); // Redirect to available cycles page after 2 seconds
                }, 2000);
            } else {
                setMessage(result.message || "Failed to add cycle");
                setTimeout(() => {
                    navigate("/cyclesInfo"); // Redirect to available cycles page after 2 seconds
                }, 2000);
            }
        } catch (e) {
            console.error("Error:", e);
            setMessage("An error occurred while adding the cycle");
            setTimeout(() => {
                navigate("/cyclesInfo"); // Redirect to available cycles page after 2 seconds
            }, 2000);
        }
    };

    // New function to handle navigation to cycles info page
    const handleAvailableCyclesClick = () => {
        navigate("/cyclesInfo");
    };

    return (
        <div className="add-cycle-container">
            <h2>Add a new Cycle</h2>
            <form onSubmit={handleSubmit} className="add-cycle-form">
                <div className="form-group">
                    <label htmlFor="cycleModel">Cycle Model:</label>
                    <input
                        id="cycleModel"
                        type="text"
                        placeholder="Enter cycle model"
                        value={cycleModel}
                        onChange={(e) => setCycleModel(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cph">Cost Per Hour (CPH):</label>
                    <input
                        id="cph"
                        type="number"
                        placeholder="Enter cost per hour"
                        value={cph}
                        onChange={(e) => setCph(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="currAvail">Current Availability:</label>
                    <select id="currAvail" value={curr_avail} onChange={(e) => setCurr_avail(e.target.value)}>
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        id="image"
                        type="text"
                        placeholder="Enter image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <div className="buttonalign">
                    <button type="submit" className="submit-button">Add Cycle</button>
                </div>
                <div className="buttonalign">
                    <button type="button" className="submit-button" onClick={handleAvailableCyclesClick}>
                        Available Cycles
                    </button>
                </div>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default AddCycle;
