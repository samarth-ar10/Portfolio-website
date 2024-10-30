// StatusBar.js - Basic status bar implementation with menu toggle functionality

import React, { useState } from 'react';
import './StatusBar.css';

function StatusBar({ isMenuOpen, handleMenuToggle }) {

    // const handleMenuButtonPress = () => {
    //     handleMenuToggle();
    // };

    return (
        <header className={`status-bar ${isMenuOpen ? 'menu-open' : ''}`}>
            {/* <button className="menu-button" onClick={handleMenuButtonPress}>&#9776;</button> */}
            <h1 className="app-name">Miruyume</h1>
        </header>
    );
}

export default StatusBar;