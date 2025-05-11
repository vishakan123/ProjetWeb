import React from 'react';
import { NavLink } from 'react-router-dom'; 
import './NavigationBar.css';


function NavigationBar({ wishlistCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="nav-logo">
          Ma Biblio Moderne 📖
        </NavLink>
        <ul className="nav-menu">
          <li className="nav-item">
            {}
            <NavLink
              to="/"
              className={({ isActive }) => "nav-links" + (isActive ? " active-link" : "")}
              end 
            >
              Accueil
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/wishlist"
              className={({ isActive }) => "nav-links" + (isActive ? " active-link" : "")}
            >
              Wishlist
              {}
              {wishlistCount > 0 && (
                <span className="wishlist-badge">{wishlistCount}</span>
              )}
            </NavLink>
          </li>
          {}
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;