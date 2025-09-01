import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <span role="img" aria-label="logo">🏠</span>
        <span className="brand">Elevate & Relocate</span>
      </div>
      <nav className="nav">
        <a href="/buy">Buy</a>
        <a href="/rent">Rent</a>
        <a href="/wishlist">Wishlist</a>
        <a href="/checkout">Checkout</a>
      </nav>
      <button className="sign-in"> <span role="img" aria-label="sign-in">👤</span> Sign In</button>
    </header>
  );
}
