import React, { useState } from 'react';
import './MessageBar.css';
import config from './config';

function MessageBar() {
    const [message, setMessage] = useState('');

    const logMessageToServer = async (message) => {
        try {
            const response = await fetch('http://51.24.2.92:8000/api/frontend_log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event_type: 'user_message', message }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error logging message to server:', error);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            console.log('Message sent:', message);
            logMessageToServer(message);
            setMessage('');
        }
    };

    return (
        <footer className="message-bar">
            <textarea
                type="text"
                id="user-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
            />
            <button id="send-button" onClick={handleSendMessage}>Send</button>
        </footer>
    );
}

export default MessageBar;
