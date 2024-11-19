import { useState } from "react";
import "./index.css";

export default function Register() {
    const [username, setName] = useState("");
    const [rollNum, setRoll] = useState("");
    const [phoneNum, setPhone] = useState("");
    const [user_role, setRole] = useState("");
    const [password,setPassword] = useState("");
    const [passwordc,setPasswordc] = useState("");
    const [message, setMessage] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !rollNum || !phoneNum ||!user_role|| !password || !passwordc) {
            setMessage("All fields are required!");
            return;
        }

        // Check if passwords match
        if (password !== passwordc) {
            setMessage("Passwords do not match");
            return;
        }
        //Sending to backend
        const userData = {
            name: username,
            roll_num: rollNum,
            phone_num: phoneNum,
            role:user_role,
            password: password   
        };

        try {
            const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("User registered successfully!");
                // Reset form after successful registration
                setName("");
                setRoll("");
                setPhone("");
                setRole("");
                setPassword("");
                setPasswordc("");
            } else {
                setMessage(result.message || "Error registering user.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurr      ed while registering.");
        }
    }

    return (
        <div className="overall">
        <h1>Cycle Rentals 🚲</h1>
        <form onSubmit={handleSubmit} className="form">
      <div>
        <label htmlFor="name">Name:</label>
        <input 
            id="name" 
            placeholder="Enter your name" 
            type="text" 
            value={username} 
            onChange={(e) => setName(e.target.value)} 
        />
    </div>

    <div>
        <label htmlFor="roll">Roll Number:</label>
        <input 
            id="roll" 
            placeholder="Enter your Roll Number" 
            type="text" 
            value={rollNum} 
            onChange={(e) => setRoll(e.target.value)} 
        />
    </div>

    <div>
        <label htmlFor="phone">Phone Number:</label>
        <input 
            id="phone" 
            placeholder="Enter your Phone Number" 
            type="text" 
            value={phoneNum} 
            onChange={(e) => setPhone(e.target.value)} 
        />
    </div>

    <div>
        <label htmlFor="role">Role:</label>
        <input 
            id="role" 
            placeholder="Enter the role" 
            type="text" 
            value={user_role} 
            onChange={(e) => setRole(e.target.value)} 
        />
    </div>

    <div>
        <label htmlFor="passw">Enter Password:</label>
        <input 
            id="passw" 
            placeholder="Enter Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
        />
    </div>

    <div>
        <label htmlFor="passwc">Confirm Password:</label>
        <input 
            id="passwc" 
            placeholder="Confirm Password" 
            type="password" 
            value={passwordc} 
            onChange={(e) => setPasswordc(e.target.value)} 
        />
    </div>

    <button type="submit">Register</button>

    {message && <p>{message}</p>} 
</form>
</div>
    );
}