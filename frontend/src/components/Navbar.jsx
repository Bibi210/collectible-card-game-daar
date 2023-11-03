
import React, { useEffect } from 'react';
import './navbar.css';

const Navbar = () => {
  useEffect(() => {
    // Get the current page's URL
    const currentPage = window.location.pathname;
    
    // Get all the links in the navbar
    const links = document.querySelectorAll('.nav-item a');
    
    // Loop through the links and check if the link's href matches the current page's URL
    links.forEach((link) => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active-link'); // Add a class to the matching link
      } else {
        link.classList.remove('active-link'); // Remove the class from other links
      }
    });
  }, []);

  return (
    <div className="nav-wrapper">
      <div className="grad-bar"></div>
      <nav className="navbar">
        <a href="/home"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png" alt="Company Logo" /></a>
        <ul className="nav no-search">
          <li className="nav-item"><a href="/">Home</a></li>
          <li className="nav-item"><a href="/marketPlace">MarketPlace</a></li>
          <li className="nav-item"><a href="/profile">Profile</a></li>
          <li className="nav-item"><a href="/booster">Open booster</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
