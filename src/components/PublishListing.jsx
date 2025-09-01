import React, { useState } from 'react';
import './PublishListing.css';

export default function PublishListing() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agreed: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <section className="publish-listing">
      <h2>Publish Your Listing</h2>
      <form className="listing-form">
        <div className="image-upload">
          <div className="image-placeholder">
            <span role="img" aria-label="add-image" style={{fontSize: '4rem'}}>🖼️➕</span>
          </div>
        </div>
        <div className="form-fields">
          <label>Your info:</label>
          <div className="input-row">
            <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          </div>
          <div className="input-row">
            <input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
            <input name="phone" placeholder="Telephone Number" value={form.phone} onChange={handleChange} />
          </div>
          <div className="terms-row">
            <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} />
            <span>I agree to the terms and conditions</span>
          </div>
          <div className="form-actions">
            <button type="submit" className="publish-btn">✔ Publish</button>
            <button type="button" className="back-btn">← Go back</button>
          </div>
        </div>
      </form>
    </section>
  );
}
