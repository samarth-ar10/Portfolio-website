// StatusBar.js - Basic status bar implementation with menu toggle functionality

import React from 'react';
import './StatusBar.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import config from './config';

const logEventToServer = async (eventType, data) => {
    try {
        const response = await fetch(config.URL + '/api/frontend_log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event_type: eventType, data }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error logging event to server:', error);
    }
};

function StatusBar({ isMenuOpen, handleMenuToggle }) {
    const handleLinkClick = (platform) => {
        logEventToServer('social_link_click', { platform });
    };

    return (
        <header className={`status-bar ${isMenuOpen ? 'menu-open' : ''}`}>
            <h1 className="app-name">Samarth</h1>
            <div className="social-icons">
                <a
                    href="https://github.com/samarth-ar10"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick('GitHub')}
                >
                    <FaGithub size={24} />
                </a>
                <a
                    href="https://www.linkedin.com/in/samarth-nln/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick('LinkedIn')}
                >
                    <FaLinkedin size={24} />
                </a>
            </div>
        </header>
    );
}

export default StatusBar;