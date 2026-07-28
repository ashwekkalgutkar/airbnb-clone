import React, { useEffect, useRef, useState } from 'react';
import { ShareIcon, HeartIcon } from './Icons';
import './PhotoTour.css';

const ROOM_SECTIONS = [
  {
    id: 'living-room-1',
    name: 'Living room 1',
    subtext: 'Sofa · Air conditioning · Ceiling fan · TV',
    thumbSrc: '/images/090d8b0b-b539-42c0-84f8-e1fb0cdf9a93.jpg',
    images: [
      { src: '/images/090d8b0b-b539-42c0-84f8-e1fb0cdf9a93.jpg', alt: 'Living room 1 main view', globalIndex: 0 },
      { src: '/images/a45feaa2-b607-4092-83ac-5fd4b2894959.jpg', alt: 'TV console view', globalIndex: 1 },
      { src: '/images/f1da1c3d-0d10-481e-9b63-c71f9073f30b.jpg', alt: 'Dining and living room angle', globalIndex: 2 },
      { src: '/images/1c827136-4a85-4fe0-8e69-3fd8ea19bb17.jpg', alt: 'Living room seating detail', globalIndex: 3 }
    ]
  },
  {
    id: 'living-room-2',
    name: 'Living room 2',
    subtext: 'Ceiling fan · Hot tub',
    thumbSrc: '/images/a9831aeb-f441-44f5-a38f-4cf54e3f0fcf.jpg',
    images: [
      { src: '/images/a9831aeb-f441-44f5-a38f-4cf54e3f0fcf.jpg', alt: 'Private jacuzzi area', globalIndex: 4 },
      { src: '/images/9be71047-fc52-438a-9270-75cb470f6752.jpg', alt: 'Jacuzzi lounge seating', globalIndex: 5 },
      { src: '/images/8eb65a8b-e795-4870-b141-6f63b1be24ae.jpg', alt: 'Living area lighting', globalIndex: 6 }
    ]
  },
  {
    id: 'full-kitchen',
    name: 'Full kitchen',
    subtext: 'Refrigerator · Microwave · Stove · Electric kettle',
    thumbSrc: '/images/56c44812-52c0-4481-90d8-101ec1f34c7a.jpg',
    images: [
      { src: '/images/56c44812-52c0-4481-90d8-101ec1f34c7a.jpg', alt: 'Full kitchen counter', globalIndex: 7 },
      { src: '/images/42befad7-fb29-473d-91db-b03e7a544d1d.jpg', alt: 'Dining area and kitchen', globalIndex: 8 },
      { src: '/images/0622ab42-b851-4d55-9d9f-df3143bc5909.jpg', alt: 'Kitchen appliances', globalIndex: 9 }
    ]
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    subtext: '1 double bed · Air conditioning · Wardrobe',
    thumbSrc: '/images/67c61c6f-6260-4809-9510-0360e58a345d.jpg',
    images: [
      { src: '/images/67c61c6f-6260-4809-9510-0360e58a345d.jpg', alt: 'Plush double bed', globalIndex: 10 },
      { src: '/images/c904e1ab-a39d-4ef0-bdea-8c0bd16b9e3d.jpg', alt: 'Bedroom window view', globalIndex: 11 },
      { src: '/images/5b856fde-a393-41bf-b373-c9d02e64221f.jpg', alt: 'Nightstand and wardrobe', globalIndex: 12 },
      { src: '/images/2367476f-11c4-4a14-a7c6-267be62c1d59.jpg', alt: 'Bedroom side view', globalIndex: 13 }
    ]
  },
  {
    id: 'full-bathroom',
    name: 'Full bathroom',
    subtext: 'Hot water · Shower · Mirror',
    thumbSrc: '/images/97c78f8a-5090-4663-aebc-ba4e13b47092.jpg',
    images: [
      { src: '/images/97c78f8a-5090-4663-aebc-ba4e13b47092.jpg', alt: 'Vanity mirror and counter', globalIndex: 14 },
      { src: '/images/608748cd-6ee7-4a71-88a2-ba79d3ddba5a.jpg', alt: 'Glass shower enclosure', globalIndex: 15 },
      { src: '/images/48a8ffbc-fbf7-4f84-bc29-ee400da3f08b.jpg', alt: 'Bathroom overview', globalIndex: 16 }
    ]
  },
  {
    id: 'gym',
    name: 'Gym',
    subtext: 'Shared fitness center in building',
    thumbSrc: '/images/9aa8e65f-94ac-4ba0-9a10-9ec91e536d22.jpg',
    images: [
      { src: '/images/9aa8e65f-94ac-4ba0-9a10-9ec91e536d22.jpg', alt: 'Fitness equipment', globalIndex: 17 },
      { src: '/images/3c90338e-86b4-423f-aae1-279e0ccc3a18.jpg', alt: 'Gym treadmill and weights', globalIndex: 18 }
    ]
  },
  {
    id: 'exterior',
    name: 'Exterior',
    subtext: 'Building facade & surroundings',
    thumbSrc: '/images/23ea6621-6f74-4baa-acea-2fd03e312b41.jpg',
    images: [
      { src: '/images/23ea6621-6f74-4baa-acea-2fd03e312b41.jpg', alt: 'Building exterior facade', globalIndex: 19 },
      { src: '/images/9642a60d-e9de-4e1a-89c2-9ebd230f4a74.jpg', alt: 'Entrance and courtyard', globalIndex: 20 }
    ]
  },
  {
    id: 'pool',
    name: 'Pool',
    subtext: 'Shared outdoor swimming pool',
    thumbSrc: '/images/fc02f48f-a937-42c5-895d-f9cc3113d6ca.jpg',
    images: [
      { src: '/images/fc02f48f-a937-42c5-895d-f9cc3113d6ca.jpg', alt: 'Swimming pool view', globalIndex: 21 },
      { src: '/images/3c6e6809-1bb1-47a6-8e24-aff593e1c28f.jpg', alt: 'Pool deck loungers', globalIndex: 22 },
      { src: '/images/79addceb-8c2d-419b-80ff-e29af426a94c.jpg', alt: 'Pool reflection', globalIndex: 23 }
    ]
  },
  {
    id: 'additional-photos',
    name: 'Additional photos',
    subtext: 'Balcony & surrounding views',
    thumbSrc: '/images/70325367-cbae-4993-b560-18cd3f6edd53.jpg',
    images: [
      { src: '/images/70325367-cbae-4993-b560-18cd3f6edd53.jpg', alt: 'Balcony view', globalIndex: 24 },
      { src: '/images/34529829-a971-44d3-ac2f-90ea3678a34d.jpg', alt: 'Garden view', globalIndex: 25 },
      { src: '/images/153aa732-4935-48b8-a6fe-b469b6af5efc.jpg', alt: 'Decor detail', globalIndex: 26 }
    ]
  }
];

export default function PhotoTour({ onClose, onSelectPhoto }) {
  const [activeSectionId, setActiveSectionId] = useState('living-room-1');
  const contentRef = useRef(null);

  useEffect(() => {
    // Lock background scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const scrollToSection = (id) => {
    setActiveSectionId(id);
    const element = document.getElementById(`tour-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderSectionImages = (images) => {
    const elements = [];
    let idx = 0;
    let isFull = true;

    while (idx < images.length) {
      if (isFull || idx === images.length - 1) {
        const img = images[idx];
        elements.push(
          <div 
            key={`full-${idx}`}
            className="pt-photo-full-wrapper"
            onClick={() => onSelectPhoto(img.globalIndex)}
          >
            <img src={img.src} alt={img.alt} className="pt-photo-full-img" />
          </div>
        );
        idx += 1;
      } else {
        const img1 = images[idx];
        const img2 = images[idx + 1];
        elements.push(
          <div key={`pair-${idx}`} className="pt-photo-pair-grid">
            <div 
              className="pt-photo-pair-wrapper"
              onClick={() => onSelectPhoto(img1.globalIndex)}
            >
              <img src={img1.src} alt={img1.alt} className="pt-photo-pair-img" />
            </div>
            <div 
              className="pt-photo-pair-wrapper"
              onClick={() => onSelectPhoto(img2.globalIndex)}
            >
              <img src={img2.src} alt={img2.alt} className="pt-photo-pair-img" />
            </div>
          </div>
        );
        idx += 2;
      }
      isFull = !isFull;
    }
    return elements;
  };

  return (
    <div className="photo-tour-overlay">
      {/* Top Fixed Navigation Bar */}
      <div className="pt-top-nav">
        <div className="pt-top-bar">
          <button className="pt-back-btn" onClick={onClose} aria-label="Close photo tour">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 28L8 16 20 4" />
            </svg>
          </button>

          <div className="pt-actions">
            <button className="pt-action-btn">
              <ShareIcon style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2px', marginRight: '6px' }} />
              <span className="underline font-semibold">Share</span>
            </button>
            <button className="pt-action-btn">
              <HeartIcon style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2px', marginRight: '6px' }} />
              <span className="underline font-semibold">Save</span>
            </button>
          </div>
        </div>

        <div className="pt-top-centered-content">
          {/* Title */}
          <h1 className="pt-main-title font-semibold">Photo tour</h1>

          {/* Category Cards Bar */}
          <div className="pt-category-scroll-container">
            <div className="pt-category-cards-wrapper">
              {ROOM_SECTIONS.map((sec) => (
                <div 
                  key={sec.id}
                  className={`pt-category-card ${activeSectionId === sec.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(sec.id)}
                >
                  <div className="pt-card-thumb-frame">
                    <img src={sec.thumbSrc} alt={sec.name} className="pt-card-thumb-img" />
                  </div>
                  <span className="pt-card-label font-semibold">{sec.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="pt-content-scroll" ref={contentRef}>
        <div className="pt-content-container">
          {ROOM_SECTIONS.map((sec) => (
            <div key={sec.id} id={`tour-section-${sec.id}`} className="pt-room-section">
              {/* Left Column: Room info */}
              <div className="pt-room-info-col">
                <h2 className="pt-room-name font-semibold">{sec.name}</h2>
                <p className="pt-room-subtext">{sec.subtext}</p>
              </div>

              {/* Right Column: Room photos layout */}
              <div className="pt-room-photos-col">
                {renderSectionImages(sec.images, onSelectPhoto)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

