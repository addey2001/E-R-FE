import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

export default function Header() {
  const [signedIn, setSignedIn] = React.useState(!!localStorage.getItem('access'));

  React.useEffect(() => {
    const onStorage = () => setSignedIn(!!localStorage.getItem('access'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setSignedIn(false);
    window.dispatchEvent(new Event('storage'));
  };

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
      {!signedIn ? (
        <Link to="/auth" className="sign-in"> <span role="img" aria-label="sign-in">👤</span> Sign In</Link>
      ) : (
        <button className="sign-in" onClick={handleSignOut} style={{marginLeft: 16}}>
          <span role="img" aria-label="sign-out">🚪</span> Sign Out
        </button>
      )}
    </header>
  );
}
