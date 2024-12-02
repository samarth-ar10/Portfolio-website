// StatusBar.js - Basic status bar implementation with menu toggle functionality

import React from 'react';
import './StatusBar.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import config from './config';

function StatusBar({ isMenuOpen, handleMenuToggle }) {
    return (
        <header className={`status-bar ${isMenuOpen ? 'menu-open' : ''}`}>
            <h1 className="app-name">Samarth</h1>
            <div className="social-icons">
                <a href="https://github.com/samarth-ar10" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={24} />
                </a>
                <a href="https://www.linkedin.com/in/samarth-nln/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={24} />
                </a>
            </div>

        </header>
    );
}

export default StatusBar;