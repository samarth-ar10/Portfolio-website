// MenuBar.js - Holds a list of menu items

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import './MenuBar.css';
import config from './config';

const MenuBar = forwardRef(({ isOpen, toggleMenu }, ref) => {
    const [menuItems, setMenuItems] = useState([]);

    const handleMenuClick = () => {
        if (toggleMenu) {
            toggleMenu();
        }
    };

    // Function to add a new menu item
    const addMenuItem = (logo, name, extraInfo) => {
        setMenuItems((prevItems) => [...prevItems, { logo, name, extraInfo }]);
    };

    useImperativeHandle(ref, () => ({
        addMenuItem
    }));

    return (
        <aside className={`menu-bar ${isOpen ? 'open' : ''}`} onClick={handleMenuClick}>
            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li key={index} className="menu-item">
                        {item.logo && (
                            <img src={item.logo} alt="logo" className="menu-item-logo" />
                        )}
                        <div className="menu-item-text">
                            <span className="menu-item-name">{item.name}</span>
                            {item.extraInfo && (
                                <span className="menu-item-extra">{item.extraInfo}</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
});

export default MenuBar;

// Example usage:
// <MenuBar isOpen={true} />
// addMenuItem(null, 'Content Title', null);
// addMenuItem(null, 'User Name', 'User Info');
// addMenuItem('path/to/logo.png', 'User Name', 'User Info');