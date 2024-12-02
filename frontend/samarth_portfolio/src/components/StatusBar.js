// StatusBar.js - Basic status bar implementation with menu toggle functionality

import React from 'react';
import './StatusBar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import config from './config';

function StatusBar({ isMenuOpen, handleMenuToggle }) {
    return (
        <header className={`status-bar ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className="social-icons">
                <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/your-username/" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i>
                </a>
            </div>
            <h1 className="app-name">Samarth</h1>
        </header>
    );
}

export default StatusBar;