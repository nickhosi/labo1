import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <img src="/Logo-ETS_EN.png" alt="Logo" className="logo" />
      <div className="header-text">
        <h1>Meteo</h1>
        <p>Bienvenue sur l'application météo</p>
      </div>
    </header>
  );
}

export default Header;
