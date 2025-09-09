
import React, { useState } from 'react';
import './PublishListing.css';

export default function PublishListing() {
  const [form, setForm] = useState({
    title: '',
    address: '',
    agreed: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.agreed) {
      setError('You must agree to the terms.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://127.0.0.1:8000/listings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          title: form.title,
          address: form.address,
        })
      });
      if (!res.ok) throw new Error('Failed to publish listing');
      setSuccess('Listing published!');
      setForm({ title: '', address: '', agreed: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="publish-listing">
      <h2>Publish Your Listing</h2>
      <form className="listing-form" onSubmit={handleSubmit}>
        <div className="form-fields">
          <label>Listing info:</label>
          <div className="input-row">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="terms-row">
            <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} />
            <span>I agree to the terms and conditions</span>
          </div>
          <div className="form-actions">
            <button type="submit" className="publish-btn" disabled={loading}>{loading ? 'Publishing...' : '✔ Publish'}</button>
          </div>
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </form>
    </section>
  );
}
