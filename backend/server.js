const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// Multer configuration
const upload = multer({ dest: './uploads/' });

// Express Instance
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/CycleRentals", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Secret for JWT
const JWT_SECRET = "yourSecretKey";

// Schemas
const User = require('./models/userSchema');
const Transactions = require('./models/transactionSchema');
const Stations = require('./models/stationSchema');
const Cycles = require('./models/cycleSchema');
const Rentals = require('./models/rentalSchema');

// JWT Middleware to authenticate JWT and extract user information
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token not provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        // Add user information (e.g., roll_num and role) to the request object
        req.user = decoded;
        next();
    });
};

// Register API 
app.post('/register', async (req, res) => {
    const { name, roll_num, phone_num, role, password } = req.body;

    try {
        let rollnum = await User.findOne({ roll_num });
        if (rollnum) return res.status(400).json({ message: "User already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        let user = new User({
            name,
            roll_num,
            phone_num,
            role,
            password: hashedPassword
        });

        await user.save();
        res.status(200).json({ message: "User successfully registered" });
    } catch (e) {
        console.error('Registration error:', e);
        res.status(500).json({ message: "Error Occurred" });
    }
});

// Login API 
app.post('/login', async (req, res) => {
    const { roll_num, password } = req.body;

    try {
        if (!roll_num || !password) {
            return res.status(400).json({ message: "Roll number and password are required" });
        }

        let user = await User.findOne({ roll_num });
        if (!user) {
            console.error('User not found:', roll_num);
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Invalid password for user:', roll_num);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ roll_num: user.roll_num, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token , role: user.role });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: "Error Occurred during login" });
    }
});

// Rent Cycle API (protected route)
app.post('/rentCycle', authenticateJWT, async (req, res) => {
    const { user_name, time, roll_no, cycle_id, destination } = req.body;

    try {
        if (!user_name || !time || !roll_no || !cycle_id || !destination) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const rental = new Rentals({ user_name, time, roll_no, cycle_id, destination });
        await rental.save();

        res.status(200).json({ message: "Cycle rented Successfully" });
    } catch (err) {
        console.error('Error renting cycle:', err);
        res.status(500).json({ message: "Error Occurred" });
    }
});

// Transactions API (protected route)
app.post('/payment', authenticateJWT, async (req, res) => {
    const { rentalId, userId, transactionDate, paymentMethod } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const payment = new Transactions({
            rentalId,
            userId,
            transactionDate,
            paymentMethod
        });

        await payment.save();
        res.status(200).json({ message: "Payment Processed" });
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).json({ message: "Error Occurred" });
    }
});

// Cycles API (fetch available cycles)
app.get('/cyclesInfo', async (req, res) => {
    try {
        const availableCycles = await Cycles.find({ curr_avail: 'available' });

        // Check if there are cycles to return
        if (availableCycles.length === 0) {
            return res.status(404).json({ message: "No available cycles found" });
        }

        // Return the available cycles
        res.status(200).json({ cycles: availableCycles });
    } catch (err) {
        console.error('Error fetching cycles:', err);
        res.status(500).json({ message: "Error Occurred" });
    }
});

// API to fetch a cycle by ID
app.get('/cyclesInfo/:cycleId', async (req, res) => {
    const { cycleId } = req.params;

    try {
        const cycle = await Cycles.findById(cycleId);

        if (!cycle) {
            return res.status(404).json({ message: "Cycle not found" });
        }

        res.status(200).json({ cycle });
    } catch (err) {
        console.error('Error fetching cycle by ID:', err);
        res.status(500).json({ message: "Error Occurred" });
    }
});

// Rent Cycle API (protected route)
app.post('/rentCycle', authenticateJWT, async (req, res) => {
    const { cycleId, rentalTime, destination } = req.body;
    
    try {
        // Fetch the user roll number from the authenticated user info
        const { roll_num } = req.user;
        
        // Fetch the cycle to verify its availability
        const cycle = await Cycles.findById(cycleId);
        if (!cycle || cycle.curr_avail !== 'available') {
            return res.status(400).json({ message: "Cycle is not available for rent" });
        }

        // Create a new rental record
        const rental = new Rentals({
            user_roll_num: roll_num, 
            cycle_id: cycleId,
            rental_time: rentalTime,
            destination: destination,
        });
        
        // Save the rental record
        await rental.save();


        res.status(200).json({ message: "Cycle rented successfully", rentalId: rental._id });
    } catch (error) {
        console.error('Error renting cycle:', error);
        res.status(500).json({ message: "Error occurred while renting the cycle" });
    }
});


// Add Cycle API (only accessible by admin)
app.post('/addCycle', authenticateJWT, async (req, res) => {
    const { cycleModel, cph, curr_avail, image } = req.body; // Get the image URL from the body

    try {
        const { roll_num, role } = req.user;

        const user = await User.findOne({ roll_num });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (role !== 'admin') return res.status(403).json({ message: "Only admins can add cycles" });

        const cycleExists = await Cycles.findOne({ cycleModel });
        if (cycleExists) return res.status(400).json({ message: "Cycle model already exists" });

        // Update image URL validation to accept any valid HTTP URL
        if (!image || !/^https?:\/\/.+/.test(image)) {
            return res.status(400).json({ message: "Invalid image URL provided" });
        }

        const newCycle = new Cycles({ cycleModel, cph, curr_avail, image });
        await newCycle.save();

        res.status(201).json({ message: "Cycle added successfully", cycle: newCycle });
    } catch (err) {
        console.error('Error adding cycle:', err.message || err);
        res.status(500).json({ message: "Error occurred while adding the cycle", error: err.message || err });
    }
});



// Add Station API (only accessible by admin)
app.post('/addStation', authenticateJWT, async (req, res) => {
    const { name, nAvailable } = req.body;

    try {
        const { roll_num, role } = req.user;

        const user = await User.findOne({ roll_num });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (role !== 'admin') return res.status(403).json({ message: "Only admins can add stations" });

        const stationExists = await Stations.findOne({ name });
        if (stationExists) return res.status(400).json({ message: "Station already exists" });

        const station = new Stations({ name, nAvailable });
        await station.save();

        res.status(200).json({ message: "Station added successfully" });
    } catch (err) {
        console.error('Error adding station:', err);
        res.status(500).json({ message: "Error occurred while adding the station" });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
