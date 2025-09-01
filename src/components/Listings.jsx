import React from 'react';
import './Listings.css';

const dummyListings = [
  { id: 1, title: 'Modern Apartment', address: '123 Main St', rating: 4.5, image: '/src/assets/house1.jpg' },
  { id: 2, title: 'Cozy Cottage', address: '456 Oak Ave', rating: 4.8, image: '/src/assets/house2.jpg' },
];

export default function Listings() {
  return (
    <section className="listings">
      <h2>Listings</h2>
      <div className="listings-grid">
        {dummyListings.map(listing => (
          <div key={listing.id} className="listing-card">
            <img src={listing.image} alt={listing.title} className="listing-img" />
            <div className="listing-info">
              <h3>{listing.title}</h3>
              <p>{listing.address}</p>
              <span>⭐ {listing.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
