import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login'; 
import Register from './components/register';  
import AddCycle from './components/addcycle';
import CyclesInfo from './components/cyclesInfo';
import RentalPage from './components/rentalPage';
import RentalDetailsPage from './components/rentalDetailsPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addCycle" element={<AddCycle />} />
        <Route path="/cyclesInfo" element={<CyclesInfo />} />
        <Route path="/cyclesInfo/:cycleId" element={<RentalPage />} />
        <Route path="/rental-details/:cycleId" element={<RentalDetailsPage />} /> 
      </Routes>
  );
}

export default App;
