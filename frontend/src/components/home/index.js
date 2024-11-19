import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Home = () => {
    return (
    <div className="main">
        <nav className="nav-bar">
            <div className="logoh1">
                <img className="image1" src="https://i.imgur.com/4BXoJdk.jpeg" alt="logo"/>
                <h1 id='title'>Cycle Rentals</h1>
            </div>
            <ul className = "nav-bar-ul">
                <li className="nav-bar-li"><Link to="/" className="nav-bar-a">Home</Link></li>
                <li className="nav-bar-li"><Link to="/register" className="nav-bar-a">Register</Link></li>
                <li className="nav-bar-li"><Link to="/login" className="nav-bar-a">Login</Link></li>
            </ul>
        </nav>
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <h1 className="home-header-h1">Find the Best Cycle Rental</h1>
                    <p className="home-header-p">Welcome to Cycle Rentals, your convenient solution for commuting from home to college. Our service is designed specifically for students who need an affordable and eco-friendly mode of transport.</p>
                    <p className="home-header-p">Whether you’re looking for a quick ride to class or a leisurely trip around campus, we’ve got you covered. Enjoy the freedom of cycling while saving time and money!</p>
                </div>
            </div>

            <div className="home-image">
                <img className="home-image-img" src="https://st2.depositphotos.com/5647624/11403/i/450/depositphotos_114036510-stock-photo-sporty-company-friends-on-bicycles.jpg" alt="" />
            </div>
        </div>
    </div>
    );
};

export default Home;