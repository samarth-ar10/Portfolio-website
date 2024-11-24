// EventLogger.js - Dynamic Event Logging System
import config from './config';

class EventLogger {
    constructor() {
      this.events = [];
      this.listeners = {};
    }
  
    // Method to log an event
    logEvent(eventName, dataType, data) {
      const event = {
        timestamp: new Date(),
        eventName,
        dataType,
        data,
      };
      this.events.push(event);
      this.notifyListeners(eventName, event);
      this.sendEventToServer(event);
    }
  
    // Method to add a listener for a specific event
    addListener(eventName, callback) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(callback);
    }
  
    // Method to remove a listener for a specific event
    removeListener(eventName, callback) {
      if (this.listeners[eventName]) {
        this.listeners[eventName] = this.listeners[eventName].filter(
          (listener) => listener !== callback
        );
      }
    }
  
    // Notify all listeners about an event
    notifyListeners(eventName, event) {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach((callback) => callback(event));
      }
    }
  
    // Method to retrieve all logged events (optionally filter by event name)
    getEvents(eventName = null) {
      if (eventName) {
        return this.events.filter((event) => event.eventName === eventName);
      }
      return this.events;
    }
  
    // Method to send event to server for logging in a database
    async sendEventToServer(event) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/logEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to send event to server:', error);
      }
    }
  }
  
  // Create a singleton instance of EventLogger
  const eventLogger = new EventLogger();
  
  export default eventLogger;
  
  // Usage example:
  // Import eventLogger and log events from any component or function
  // import eventLogger from './EventLogger';
  
  // Log an event
  // eventLogger.logEvent('buttonClicked', 'interaction', { buttonId: 'submitBtn' });
  
  // Add a listener
  // eventLogger.addListener('buttonClicked', (event) => {
  //   console.log('Button clicked event received:', event);
  // });
  