import React from 'react';
import { GridIcon } from './Icons';
import './PhotoGrid.css';

// The 5 actual listing photos for Romantic Jacuzzi 1BHK Candolim | Mirashya UG10
// Order matches the official Airbnb listing grid exactly
const LISTING_IMAGES = [
  '/images/70325367-cbae-4993-b560-18cd3f6edd53 (7).jpg',  // MAIN: Grey tile wall, spotlights, rattan chairs + jacuzzi edge
  '/images/9be71047-fc52-438a-9270-75cb470f6752 (1).jpg',  // Top-mid: Jacuzzi tub close-up with wooden platform
  '/images/42befad7-fb29-473d-91db-b03e7a544d1d (1).jpg',  // Top-right: Aerial building view
  '/images/67c61c6f-6260-4809-9510-0360e58a345d.jpg',      // Bottom-mid: Bedroom
  '/images/f6de1663-4e9c-4414-b63b-29a154a92ee1 (1).jpg',  // Bottom-right: Open lounge/living space
];

export default function PhotoGrid({ onShowAllPhotos, onSelectPhoto }) {
  return (
    <div className="photo-grid-container">
      <div className="photo-grid">
        {/* Main large image — left side */}
        <div
          className="grid-item main-item"
          onClick={() => onSelectPhoto(0)}
        >
          <img src={LISTING_IMAGES[0]} alt="Lounge area with rattan chairs" className="grid-img" />
          <div className="image-overlay"></div>
        </div>

        {/* 2x2 grid of smaller images — right side */}
        <div className="grid-item-subgrid">
          {LISTING_IMAGES.slice(1, 5).map((imgUrl, index) => (
            <div
              key={index}
              className={`grid-item sub-item sub-item-${index}`}
              onClick={() => onSelectPhoto(index + 1)}
            >
              <img src={imgUrl} alt={`Room view ${index + 2}`} className="grid-img" />
              <div className="image-overlay"></div>
            </div>
          ))}
        </div>

        {/* Show all photos button — bottom-right corner */}
        <button className="show-all-photos-btn" onClick={onShowAllPhotos}>
          <GridIcon style={{ width: '16px', height: '16px', display: 'block', fill: 'currentColor' }} />
          Show all photos
        </button>
      </div>
    </div>
  );
}
