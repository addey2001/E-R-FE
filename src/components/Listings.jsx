import React, { useEffect, useState } from 'react';
import './Listings.css';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', status: '', location: '' });
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [addForm, setAddForm] = useState({ description: '', status: '', location: '' });
  const [addImage, setAddImage] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);

  // Add listing
  const handleAddChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setAddImage(file);
      setAddImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setAddForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    setAddError(null);
    setAddLoading(true);
    const token = localStorage.getItem('access');
    try {
      let body;
      let headers = { 'Authorization': token ? `Bearer ${token}` : undefined };
      if (addImage) {
        body = new FormData();
        body.append('description', addForm.description);
        body.append('status', addForm.status);
        body.append('location', addForm.location);
        body.append('image', addImage);
        // Content-Type will be set automatically by browser for FormData
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(addForm);
      }
      const res = await fetch('http://127.0.0.1:8000/listings/', {
        method: 'POST',
        headers,
        body
      });
      if (!res.ok) throw new Error('Failed to add listing');
      setAddForm({ description: '', status: '', location: '' });
      setAddImage(null);
      setAddImagePreview(null);
      fetchListings();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  // Fetch listings from backend
  const fetchListings = () => {
    setLoading(true);
    setError(null);
    fetch('http://127.0.0.1:8000/listings/', {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listings');
        return res.json();
      })
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Fetch user's favorite listing IDs
  const fetchFavorites = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setFavoriteIds([]);
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/listings/favorites/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch favorites');
      const data = await res.json();
      // data is an array of favorite listings
      setFavoriteIds(Array.isArray(data) ? data.map(l => l.id) : []);
    } catch {
      setFavoriteIds([]);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchFavorites();
    // Optionally, refresh favorites on login/logout
    const handler = () => fetchFavorites();
    window.addEventListener('auth:changed', handler);
    return () => window.removeEventListener('auth:changed', handler);
  }, []);

  // Edit listing
  const handleEdit = (listing) => {
    setEditId(listing.id);
    setEditForm({
      description: listing.description || '',
      status: listing.status || '',
      location: listing.location || '',
    });
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`http://127.0.0.1:8000/listings/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed to update listing');
      setEditId(null);
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete listing
  const handleDelete = async (id) => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`http://127.0.0.1:8000/listings/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
      });
      if (!res.ok) throw new Error('Failed to delete listing');
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  // Favorite listing (toggle)
  const handleFavorite = async (id) => {
    const token = localStorage.getItem('access');
    const isFav = favoriteIds.includes(id);
    try {
      const res = await fetch(`http://127.0.0.1:8000/listings/${id}/favorites/`, {
        method: isFav ? 'DELETE' : 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
        }
      });
      if (!res.ok) throw new Error('Failed to update favorites');
      // Refresh favorites after change
      fetchFavorites();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="listings">
      <h2>Listings</h2>
      <form className="add-listing-form" onSubmit={handleAddSubmit}>
        <h3>Add Listing</h3>
        <div className="add-listing-fields">
          <textarea
            name="description"
            placeholder="Description"
            value={addForm.description}
            onChange={handleAddChange}
            required
            rows={2}
          ></textarea>
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={addForm.status}
            onChange={handleAddChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={addForm.location}
            onChange={handleAddChange}
            required
          />
        </div>
        <div className="add-image-upload">
          <div className="picture-box">
            <input
              type="file"
              accept="image/*"
              onChange={handleAddChange}
              title="Choose image"
            />
            {addImagePreview ? (
              <img src={addImagePreview} alt="Preview" className="add-image-preview" />
            ) : (
              <span className="placeholder" title="Add image">📷</span>
            )}
          </div>
          <span style={{ fontWeight: 500, color: '#555', marginLeft: 8 }}>Image</span>
        </div>
        <button type="submit" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add'}</button>
        {addError && <span className="add-error">{addError}</span>}
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {!loading && !error && listings.length === 0 && (
        <p style={{color: '#667'}}>No listings found.</p>
      )}
      <div className="listings-grid">
        {listings.map(listing => (
          <div key={listing.id} className="listing-card">
            <img src={listing.image || '/src/assets/house1.jpg'} alt={listing.description} className="listing-img" />
            <div className="listing-info">
              {editId === listing.id ? (
                <>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    style={{marginBottom: 8, minWidth: 200, minHeight: 40}}
                  ></textarea>
                  <input name="status" value={editForm.status} onChange={handleEditChange} placeholder="Status" style={{marginBottom: 8}} />
                  <input name="location" value={editForm.location} onChange={handleEditChange} placeholder="Location" style={{marginBottom: 8}} />
                  <button onClick={() => handleEditSave(listing.id)}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{listing.description}</h3>
                  <div className="listing-details">
                    <span className="listing-status">{listing.status}</span>
                    <span className="listing-location">{listing.location}</span>
                  </div>
                  <div style={{marginTop: 8}}>
                    <button onClick={() => handleEdit(listing)}>Edit</button>
                    <button onClick={() => handleDelete(listing.id)} style={{marginLeft: 8}}>Delete</button>
                    <button onClick={() => handleFavorite(listing.id)} style={{marginLeft: 8}}>
                      {favoriteIds.includes(listing.id) ? '★' : '☆'} Favorite
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
