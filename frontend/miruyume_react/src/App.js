import React, { useState, useRef } from 'react';
import StatusBar from './components/StatusBar';
import MenuBar from './components/MenuBar';
import ContentWindow from './components/ContentWindow';
import MessageBar from './components/MessageBar';
import './App.css';
import config from './components/config';

function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  // const menuBarRef = useRef();

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="App">
      <StatusBar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      {/* <MenuBar ref={menuBarRef} isOpen={isMenuOpen} toggleMenu={handleMenuToggle} /> */}
      <ContentWindow />
      <MessageBar />
    </div>
  );
}

export default App;
