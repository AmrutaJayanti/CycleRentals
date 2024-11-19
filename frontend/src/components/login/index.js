import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Login() {
    const [rollNum, setRollNum] = useState("");  
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");  
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const loginData = {
            roll_num: rollNum,
            password: password
        };

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Login successful!");

                // Store the token and role in localStorage
                localStorage.setItem("token", result.token);
                localStorage.setItem("role", result.role);

                // Navigate based on the user role
                if (result.role === "admin") {
                    navigate("/addCycle");
                } else if (result.role === "customer") {
                    navigate("/cyclesInfo");
                } else {
                    setMessage("Role not recognized.");
                }
            } else {
                setMessage(result.message || "Error logging in.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred during login.");
        }
    };

    return (
    <>
    <div id="overall">
        <form onSubmit={handleSubmit}>
            <label htmlFor="roll">Roll Number:</label>
            <input
                id="roll"
                placeholder="Enter your Roll Number"
                type="text"
                value={rollNum}  
                onChange={(e) => setRollNum(e.target.value)} 
            />

            <label htmlFor="passw">Enter Password:</label>
            <input
                id="passw"
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>

            {message && <p>{message}</p>} 
        </form>

        <div id="new">
            <p>New User?</p>
            <a href='/register'>Register</a>
        </div>
        </div>
    </>
    );
}
