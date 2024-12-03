import React, { useState, useEffect } from 'react';
import './AiTile.css';
import config from './config';

function AiTile() {
    const [responseText, setResponseText] = useState('');

    useEffect(() => {
        // Fetch AI response from the server on component mount
        const fetchAiResponse = async () => {
            try {
                const response = await fetch('http://34.179.127.114:8000/api/ai_response');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setResponseText(data.response);
            } catch (error) {
                console.error('Error fetching AI response:', error);
                setResponseText("The chatbot is sleeping at the moment, we'll try to wake it up as soon as possible.");
            }
        };

        fetchAiResponse();
    }, []);

    return (
        <div className="ai-tile" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100%' }}>
            <p>{responseText}</p>
        </div>
    );
}

export default AiTile;
