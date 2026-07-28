import React, { useState, useEffect } from 'react';
import { AirbnbLogo, SearchIcon, GlobeIcon, MenuIcon } from './Icons';
import './Header.css';

export default function Header({ price, rating, reviewsCount, onReserve, isLoading }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const [showReserveWidget, setShowReserveWidget] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 520);

      // Check if we reached reviews section to show the header reserve widget
      const reviewsEl = document.getElementById('reviews');
      if (reviewsEl) {
        setShowReserveWidget(window.scrollY >= reviewsEl.offsetTop - 180);
      }

      // Update active tab based on scroll position
      const sections = ['photos', 'amenities', 'reviews', 'location'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveTab(sections[i]);
          break;
        }
      }
      if (window.scrollY < 200) setActiveTab('photos');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    if (id === 'photos') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 75;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return (
      <header className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <AirbnbLogo />
          </div>
          <div className="skeleton rounded-full" style={{ width: '300px', height: '48px', margin: '0 auto' }}></div>
          <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="skeleton rounded-full" style={{ width: '20px', height: '20px' }}></div>
            <div className="skeleton rounded-full" style={{ width: '77px', height: '42px', border: '1px solid #DDDDDD' }}></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo">
          <AirbnbLogo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>

        {/* Dynamic Center Section */}
        {isScrolled ? (
          <nav className="header-tabs">
            {['photos', 'amenities', 'reviews', 'location'].map(tab => (
              <button
                key={tab}
                className={`header-tab font-semibold ${activeTab === tab ? 'active' : ''}`}
                onClick={() => scrollToSection(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        ) : (
          <div className="header-search">
            <button className="search-btn font-semibold search-btn-with-icon">
              <img 
                src="/images/4aae4ed7-5939-4e76-b100-e69440ebeae4.png" 
                alt="House" 
                className="search-house-icon"
              />
              <span>Anywhere</span>
            </button>
            <span className="search-divider"></span>
            <button className="search-btn font-semibold">Anytime</button>
            <span className="search-divider"></span>
            <button className="search-btn text-gray">Add guests</button>
            <button className="search-icon-container" aria-label="Search">
              <SearchIcon style={{ width: '12px', height: '12px', fill: 'none', stroke: 'white', strokeWidth: '5.33333px', display: 'block' }} />
            </button>
          </div>
        )}

        {/* Dynamic User Actions */}
        {isScrolled ? (
          <div className={`header-reserve-scrolled ${showReserveWidget ? 'visible' : 'hidden'}`}>
            <div className="reserve-meta">
              <span className="reserve-add-dates font-semibold">Add dates for prices</span>
              <div className="reserve-rating">
                <span className="reserve-star">★</span>
                <span className="rating-val font-semibold">{rating}</span>
                <span className="rating-dot"> · </span>
                <span className="rating-count underline">{reviewsCount} reviews</span>
              </div>
            </div>
            <button className="reserve-btn-primary font-semibold" onClick={onReserve}>
              Check availability
            </button>
          </div>
        ) : (
          <div className="header-user-actions">
            <button className="become-host-btn font-semibold">Become a host</button>
            <button className="header-circle-btn globe-btn" aria-label="Choose a language and currency">
              <GlobeIcon style={{ width: '16px', height: '16px', fill: 'currentColor', display: 'block' }} />
            </button>
            <button className="header-circle-btn menu-btn" aria-label="Main navigation menu">
              <MenuIcon style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '3px', display: 'block' }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}



