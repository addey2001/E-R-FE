import React, { useEffect, useState } from 'react';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`http://127.0.0.1:8000/listings/${id}/favorites/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load favorites');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      setError(e.message);
    }
  };

  const removeFromFavorites = async (id) => {
    setError(null);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`http://127.0.0.1:8000/listings/${id}/favorites/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove from favorites');
      fetchFavorites();
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
    const handler = () => fetchFavorites();
    window.addEventListener('auth:changed', handler);
    return () => window.removeEventListener('auth:changed', handler);
  }, []);

  return (
    <section>
      <h2>Wishlist</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {items.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <strong>{item.description}</strong> ({item.status}, {item.location})
              <button onClick={() => removeFromFavorites(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}