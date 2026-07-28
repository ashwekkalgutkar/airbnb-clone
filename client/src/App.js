import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import PhotoTour from './components/PhotoTour';
import Lightbox from './components/Lightbox';
import DatePicker from './components/DatePicker';
import GuestsDropdown from './components/GuestsDropdown';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  StarIcon, ShareIcon, HeartIcon,
  CheckInIcon, KeyIcon, PoolHighlightIcon, KitchenIcon, WifiIcon,
  WorkspaceIcon, ParkingIcon, PoolIcon, HotTubIcon, PetsIcon,
  SecurityCamerasIcon, CarbonMonoxideIcon, SmokeAlarmIcon, GlobeIcon,
  FacebookIcon, TwitterIcon, InstagramIcon, FlagIcon
} from './components/Icons';
import './App.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LISTING_IMAGES = [
  { src: '/images/70325367-cbae-4993-b560-18cd3f6edd53 (7).jpg', alt: 'Lounge area' },
  { src: '/images/9be71047-fc52-438a-9270-75cb470f6752 (1).jpg', alt: 'Jacuzzi' },
  { src: '/images/42befad7-fb29-473d-91db-b03e7a544d1d (1).jpg', alt: 'Aerial view' },
  { src: '/images/67c61c6f-6260-4809-9510-0360e58a345d.jpg', alt: 'Bedroom' },
  { src: '/images/f6de1663-4e9c-4414-b63b-29a154a92ee1 (1).jpg', alt: 'Living space' }
];

export default function App() {
  // Modal states
  const [showPhotoTour, setShowPhotoTour] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Booking dates state
  const [startDate, setStartDate] = useState({ year: 2026, month: 6, day: 15 });
  const [endDate, setEndDate] = useState({ year: 2026, month: 6, day: 19 });

  // Guests state
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });

  // Simulated Loading State
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate nights
  const calculateNights = () => {
    if (!startDate || !endDate) return 4;
    const d1 = new Date(startDate.year, startDate.month, startDate.day);
    const d2 = new Date(endDate.year, endDate.month, endDate.day);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const pricePerNight = 4800;
  const basePrice = nights * pricePerNight;
  const cleaningFee = 1200;
  const serviceFee = 850;
  const totalPrice = basePrice + cleaningFee + serviceFee;

  const totalGuestCount = guests.adults + guests.children;
  const guestSummaryText = `${totalGuestCount} guest${totalGuestCount > 1 ? 's' : ''}${guests.infants > 0 ? `, ${guests.infants} infant` : ''}${guests.pets > 0 ? `, ${guests.pets} pet` : ''}`;

  const formattedDateRange = () => {
    if (startDate && endDate) {
      const m1 = new Date(startDate.year, startDate.month).toLocaleString('en', { month: 'short' });
      const m2 = new Date(endDate.year, endDate.month).toLocaleString('en', { month: 'short' });
      return `${m1} ${startDate.day} – ${m2} ${endDate.day}`;
    }
    if (startDate) {
      const m1 = new Date(startDate.year, startDate.month).toLocaleString('en', { month: 'short' });
      return `${m1} ${startDate.day} – Select checkout`;
    }
    return "Add dates";
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showGuestsDropdown && !e.target.closest('.guests-selector-wrapper')) {
        setShowGuestsDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showGuestsDropdown]);

  if (isLoading) {
    return (
      <div className="airbnb-app">
        <Header isLoading={true} />
        <main className="container main-content-container">
          {/* Skeleton Title Section */}
          <div className="listing-title-section mb-6">
            <div style={{ flex: 1 }}>
              <div className="skeleton mb-2" style={{ width: '60%', height: '32px' }}></div>
              <div className="flex gap-4">
                <div className="skeleton" style={{ width: '200px', height: '20px' }}></div>
                <div className="skeleton" style={{ width: '120px', height: '20px' }}></div>
              </div>
            </div>
            <div className="title-actions flex gap-2">
              <div className="skeleton" style={{ width: '90px', height: '36px', borderRadius: '8px' }}></div>
              <div className="skeleton" style={{ width: '90px', height: '36px', borderRadius: '8px' }}></div>
            </div>
          </div>
          
          {/* Skeleton Photo Grid */}
          <div className="skel-photo-grid mb-12">
            <div className="skeleton skel-photo-left"></div>
            <div className="skel-photo-right">
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
            </div>
          </div>

          <div className="listing-body-grid mt-12">
            <div className="left-column">
              <div className="flex justify-between items-center pb-6" style={{ borderBottom: '1px solid #EBEBEB', marginBottom: '32px' }}>
                <div style={{ flex: 1 }}>
                  <div className="skeleton mb-2" style={{ width: '250px', height: '28px' }}></div>
                  <div className="skeleton" style={{ width: '180px', height: '20px' }}></div>
                </div>
                <div className="skeleton skel-avatar rounded-full" style={{ flexShrink: 0, marginLeft: '24px' }}></div>
              </div>
              <div className="skeleton mb-6" style={{ width: '100%', height: '100px' }}></div>
              <div className="skeleton mb-6" style={{ width: '100%', height: '80px' }}></div>
              <div className="skeleton mb-6" style={{ width: '100%', height: '120px' }}></div>
            </div>
            
            <div className="right-column">
              <div className="skeleton skel-widget" style={{ height: '460px' }}></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="airbnb-app">
      {/* Main Top Header */}
      <Header 
        price={`₹${pricePerNight.toLocaleString('en-IN')}`}
        rating="4.96"
        reviewsCount="24"
        onReserve={() => alert("Reservation request initiated!")}
      />

      {/* Main Page Container */}
      <main className="main-content-container container">
        {/* Listing Title & Action Header */}
        <section className="listing-title-section">
          <h1 className="listing-title">Romantic Jacuzzi 1BHK Candolim | Mirashya UG10</h1>

          <div className="title-actions">
            <button className="action-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              <ShareIcon style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }} />
              <span className="underline font-semibold">Share</span>
            </button>

            <button className="action-btn" onClick={() => setIsSaved(!isSaved)}>
              <HeartIcon style={{ width: '16px', height: '16px', fill: isSaved ? '#FF385C' : 'none', stroke: isSaved ? '#FF385C' : 'currentColor', strokeWidth: '2' }} />
              <span className="underline font-semibold">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </section>

        {/* 5-Photo Hero Grid */}
        <PhotoGrid
          onShowAllPhotos={() => setShowPhotoTour(true)}
          onSelectPhoto={(idx) => setLightboxIndex(idx)}
        />

        {/* 2-Column Main Section */}
        <div className="listing-body-grid">
          {/* Left Column (66.6%) */}
          <div className="left-column">
            {/* Host & Property Overview */}
            <div className="host-header-block">
              <div>
                <h2 className="listing-subtitle font-semibold">
                  Entire serviced apartment in Candolim, India
                </h2>
                <ol className="property-specs font-normal">
                  <li>3 guests</li>
                  <li>1 bedroom</li>
                  <li>1 bed</li>
                  <li>1 bathroom</li>
                </ol>
              </div>

              <img
                src="/images/6b72f8b5-0e66-4bf1-8ba3-ff0f87ff3687.jpg"
                alt="Mirashya Homes Avatar"
                className="host-avatar-lg"
              />
            </div>

            <hr className="section-divider" />

            {/* Guest Favorite Badge Banner */}
            <div className="guest-favorite-banner">
              {/* Left: laurels wrapping only the badge text */}
              <div className="gf-badge-group">
                <img src="/images/b4005b30-79ff-4287-860c-67829ecd7412.png" alt="" className="gf-laurel-img gf-laurel-left" />
                <div className="gf-text-col">
                  <div className="gf-title font-semibold">Guest<br />favourite</div>
                </div>
                <img src="/images/b4005b30-79ff-4287-860c-67829ecd7412.png" alt="" className="gf-laurel-img gf-laurel-right" />
              </div>

              {/* Divider */}
              <div className="gf-divider"></div>

              {/* Middle: description */}
              <div className="gf-subtitle-col">
                <div className="gf-subtitle">One of the most loved homes on<br />Airbnb, according to guests</div>
              </div>

              {/* Divider */}
              <div className="gf-divider"></div>

              {/* Right scores */}
              <div className="gf-score-box">
                <div className="gf-score-number font-semibold">4.96</div>
                <div className="gf-stars">★★★★★</div>
              </div>

              {/* Divider */}
              <div className="gf-divider"></div>

              <div className="gf-score-box">
                <div className="gf-score-number font-semibold">24</div>
                <div className="gf-review-label underline font-semibold">Reviews</div>
              </div>
            </div>

            <hr className="section-divider" />

            {/* Host Details */}
            <div className="host-info-row">
              <img src="/images/6b72f8b5-0e66-4bf1-8ba3-ff0f87ff3687.jpg" alt="Mirashya Homes" className="host-avatar-md" />
              <div>
                <div className="host-name font-semibold">Hosted by Mirashya Homes</div>
                <div className="host-badge-sub">2 years hosting</div>
              </div>
            </div>

            <hr className="section-divider" />

            {/* Listing Highlights */}
            <div className="highlights-list">
              <div className="highlight-item">
                <CheckInIcon style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                <div>
                  <div className="highlight-title font-semibold">Great check-in experience</div>
                  <div className="highlight-desc">Recent guests loved the smooth start to this stay.</div>
                </div>
              </div>

              <div className="highlight-item">
                <KeyIcon style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                <div>
                  <div className="highlight-title font-semibold">Self check-in</div>
                  <div className="highlight-desc">You can check in with the building staff.</div>
                </div>
              </div>

              <div className="highlight-item">
                <PoolHighlightIcon style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                <div>
                  <div className="highlight-title font-semibold">Dive right in</div>
                  <div className="highlight-desc">This is one of the few places in the area with a pool.</div>
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            {/* Translation Note & Listing Description */}
            <div className="description-section">
              <div className="translation-note">
                <GlobeIcon style={{ width: '16px', height: '16px' }} />
                <span>Some info has been automatically translated. <button className="underline font-semibold">Show original</button></span>
              </div>

              <div className="description-text">
                <p>🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it’s ideal for couples seeking romance, relaxation, and a touch of luxury in North Goa. ❤️🌴</p>
              </div>

              <button className="show-more-btn font-semibold" onClick={() => setShowDescriptionModal(true)}>
                Show more &gt;
              </button>
            </div>

            <hr className="section-divider" />

            {/* Where You'll Sleep */}
            <div className="sleep-section">
              <h2 className="section-heading font-semibold">Where you'll sleep</h2>

              <div className="sleep-cards-grid">
                <div className="sleep-card">
                  <img src="/images/67c61c6f-6260-4809-9510-0360e58a345d.jpg" alt="Bedroom" className="sleep-card-img" />
                  <div className="sleep-card-title font-semibold">Bedroom</div>
                  <div className="sleep-card-desc">1 double bed</div>
                </div>

                <div className="sleep-card">
                  <img src="/images/f6de1663-4e9c-4414-b63b-29a154a92ee1.jpg" alt="Living room sofa" className="sleep-card-img" />
                  <div className="sleep-card-title font-semibold">Living room</div>
                  <div className="sleep-card-desc">1 sofa</div>
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            {/* What This Place Offers (Amenities Grid) */}
            <div className="amenities-section" id="amenities">
              <h2 className="section-heading font-semibold">What this place offers</h2>

              <div className="amenities-grid">
                <div className="amenity-item">
                  <KitchenIcon style={{ width: '24px', height: '24px' }} />
                  <span>Kitchen</span>
                </div>
                <div className="amenity-item">
                  <WifiIcon style={{ width: '24px', height: '24px' }} />
                  <span>Wifi</span>
                </div>
                <div className="amenity-item">
                  <WorkspaceIcon style={{ width: '24px', height: '24px' }} />
                  <span>Dedicated workspace</span>
                </div>
                <div className="amenity-item">
                  <ParkingIcon style={{ width: '24px', height: '24px' }} />
                  <span>Free parking on premises</span>
                </div>
                <div className="amenity-item">
                  <PoolIcon style={{ width: '24px', height: '24px' }} />
                  <span>Shared swimming pool</span>
                </div>
                <div className="amenity-item">
                  <HotTubIcon style={{ width: '24px', height: '24px' }} />
                  <span>Private Hot tub & Jacuzzi</span>
                </div>
                <div className="amenity-item">
                  <PetsIcon style={{ width: '24px', height: '24px' }} />
                  <span>Pets allowed</span>
                </div>
                <div className="amenity-item">
                  <SecurityCamerasIcon style={{ width: '24px', height: '24px' }} />
                  <span>Exterior security cameras on property</span>
                </div>
                <div className="amenity-item strikethrough">
                  <CarbonMonoxideIcon style={{ width: '24px', height: '24px' }} />
                  <span>Carbon monoxide alarm</span>
                </div>
                <div className="amenity-item strikethrough">
                  <SmokeAlarmIcon style={{ width: '24px', height: '24px' }} />
                  <span>Smoke alarm</span>
                </div>
              </div>

              <button className="outline-btn font-semibold" onClick={() => setShowAllAmenities(true)}>
                Show all 50 amenities
              </button>
            </div>

            <hr className="section-divider" />

            {/* Select Check-in Date (Interactive Calendar) */}
            <div className="calendar-section">
              <h2 className="section-heading font-semibold">Select check-in date</h2>
              <p className="section-subtext">Add your travel dates for exact pricing</p>

              <DatePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onClearDates={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              />
            </div>
            {/* End of content */}
          </div> {/* End Left Column */}

          {/* Right Column Sticky Booking Widget (33.3%) */}
          <div className="right-column">
            <div className="booking-widget-card sticky-widget">

              {/* Booking Inputs Container */}
              <div className="booking-inputs-box">
                <div className="dates-input-row">
                  <div className="date-field left-field">
                    <div className="field-label">CHECK-IN</div>
                    <div className="field-val" style={{ color: startDate ? 'var(--color-text)' : '#717171' }}>
                      {startDate ? `${startDate.month + 1}/${startDate.day}/${startDate.year}` : 'Add date'}
                    </div>
                  </div>
                  <div className="date-field">
                    <div className="field-label">CHECKOUT</div>
                    <div className="field-val" style={{ color: endDate ? 'var(--color-text)' : '#717171' }}>
                      {endDate ? `${endDate.month + 1}/${endDate.day}/${endDate.year}` : 'Add date'}
                    </div>
                  </div>
                </div>

                <div className="guests-input-field" onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}>
                  <div>
                    <div className="field-label">GUESTS</div>
                    <div className="field-val">{guestSummaryText}</div>
                  </div>
                  <ChevronDown className="dropdown-arrow-icon" size={20} color="#222222" />
                </div>

                {showGuestsDropdown && (
                  <GuestsDropdown
                    guests={guests}
                    onGuestsChange={(g) => setGuests(g)}
                    onClose={() => setShowGuestsDropdown(false)}
                  />
                )}
              </div>

              {/* Reserve Button */}
              <button
                className="widget-reserve-btn font-semibold"
                onClick={() => {
                  if (!startDate || !endDate) {
                    const el = document.querySelector('.calendar-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } else {
                    alert(`Reserved! Dates: ${formattedDateRange()}, Guests: ${guestSummaryText}, Total: ₹${totalPrice.toLocaleString('en-IN')}`);
                  }
                }}
              >
                Check availability
              </button>
            </div>

            <div className="report-listing-link">
              <button className="underline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '14px', margin: '24px auto 0', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <FlagIcon style={{ display: 'block', height: '16px', width: '16px', fill: 'currentColor' }} />
                Report this listing
              </button>
            </div>
          </div>
        </div> {/* End listing-body-grid */}

        <hr className="section-divider full-width-divider" />
        <div className="reviews-section" id="reviews">

          {/* Hero Rating Header */}
          <div className="reviews-hero-header">
            <div className="reviews-hero-rating">
              <img src="/images/b4005b30-79ff-4287-860c-67829ecd7412.png" alt="" className="reviews-hero-laurel reviews-hero-laurel-left" />
              <span className="reviews-hero-number font-semibold">4.96</span>
              <img src="/images/b4005b30-79ff-4287-860c-67829ecd7412.png" alt="" className="reviews-hero-laurel reviews-hero-laurel-right" />
            </div>
            <div className="reviews-hero-label font-semibold">Guest favourite</div>
            <div className="reviews-hero-desc">This home is a guest favourite based on ratings, reviews and reliability</div>
            <button className="reviews-how-link underline">How reviews work</button>
          </div>

          {/* Ratings Grid: Overall bar chart + 6 category scores */}
          <div className="ratings-full-grid">
            {/* Left: Overall rating bar chart */}
            <div className="overall-rating-col">
              <div className="overall-rating-title">Overall rating</div>
              {[5, 4, 3, 2, 1].map((star) => (
                <div className="overall-bar-row" key={star}>
                  <span className="overall-bar-num">{star}</span>
                  <div className="overall-bar-track">
                    <div className="overall-bar-fill" style={{ width: star === 5 ? '88%' : star === 4 ? '8%' : star === 3 ? '2%' : '1%' }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: 6 category scores in 3x2 grid, each with label + number + bar */}
            <div className="category-scores-grid">
              {[
                { label: 'Cleanliness', val: '5.0' },
                { label: 'Accuracy', val: '5.0' },
                { label: 'Check-in', val: '5.0' },
                { label: 'Communication', val: '5.0' },
                { label: 'Location', val: '4.8' },
                { label: 'Value', val: '4.8' },
              ].map(cat => (
                <div className="category-score-item" key={cat.label}>
                  <div className="cat-label">{cat.label}</div>
                  <div className="cat-val font-semibold">{cat.val}</div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: parseFloat(cat.val) / 5 * 100 + '%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Filter Chips */}
          <div className="review-tags-scroll">
            {[
              { label: 'Hot tub', count: 8, emoji: '🛁' },
              { label: 'Accuracy', count: 7, emoji: '✅' },
              { label: 'Condition', count: 5, emoji: '📅' },
              { label: 'Hospitality', count: 10, emoji: '🤝' },
              { label: 'Comfort', count: 6, emoji: '🛋️' },
              { label: 'Amenities', count: 3, emoji: '🍽️' },
              { label: 'Decor', count: 3, emoji: '🎨' },
              { label: 'Getting around', count: 2, emoji: '🚗' },
            ].map(tag => (
              <button className="review-tag font-semibold" key={tag.label}>
                <span className="tag-emoji">{tag.emoji}</span>
                {tag.label} {tag.count}
              </button>
            ))}
          </div>

          {/* Review Cards Grid */}
          <div className="reviews-cards-grid">
            {[
              {
                photo: '/images/e1b97f1b-8702-4abf-896e-957ec8c9687a.jpg',
                initial: null, bg: null,
                name: 'Aniket', years: '7 years on Airbnb',
                stars: 5, date: '1 week ago',
                text: 'We stayed for 4 days and it was awesome experience. Everything was perfect and as described. The host niraj was so helpful and proactive, always supporting be it getting scooty or cab for airport, making our stay even more comfortable. I will recommend this place to everyone!'
              },
              {
                photo: null, initial: 'V', bg: '#4CAF82',
                name: 'Vinay', years: '3 years on Airbnb',
                stars: 4, date: 'June 2026',
                text: 'The property is very amazing. The rooms were clean equipped with all the necessary appliances and well maintained. Warm lights & aesthetic furniture make this place feel just like 2nd home. The host(Niraj) is also very helpful always a call away.'
              },
              {
                photo: '/images/62280d0a-ec2a-465a-a16a-17f011d0e813.jpg',
                initial: null, bg: null,
                name: 'Prajyot', years: '4 years on Airbnb',
                stars: 5, date: '2 weeks ago',
                text: 'The stay was a great weekend escape with great service and all basic and necessary amenities at hand. The best experience was the jacuzzi room, it was truly relaxing and soothing ambiance!'
              },
              {
                photo: '/images/fc1006cc-0221-42d2-862e-987c817c5156.jpg',
                initial: null, bg: null,
                name: 'Aheesh', years: '2 years on Airbnb',
                stars: 5, date: 'May 2026',
                text: 'This place truly made our Goa trip memorable! We absolutely loved the property, everything was exactly as shown in the pictures. The jacuzzi was amazing, and the house itself was beautifully maintained.'
              },
            ].map((r, i) => (
              <div className="user-review-card" key={i}>
                <div className="reviewer-header">
                  {r.photo
                    ? <img src={r.photo} alt={r.name} className="avatar-photo" />
                    : <div className="avatar-placeholder font-semibold" style={{ backgroundColor: r.bg }}>{r.initial}</div>
                  }
                  <div>
                    <div className="reviewer-name font-semibold">{r.name}</div>
                    <div className="reviewer-sub">{r.years}</div>
                  </div>
                </div>
                <div className="review-meta">
                  <span className="review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  <span className="review-dot"> · </span>
                  <span>{r.date}</span>
                </div>
                <p className="review-text">{r.text}</p>
                <button className="show-more-link underline font-semibold">Show more</button>
              </div>
            ))}
          </div>

          <button className="outline-btn font-semibold" onClick={() => setShowAllReviews(true)}>
            Show all 24 reviews
          </button>
        </div>

        <hr className="section-divider" />


        {/* Where You'll Be (Location) */}
        <div className="location-section" id="location">
          <h2 className="section-heading font-semibold">Where you'll be</h2>

          <div className="map-container">
            <MapContainer
              center={[15.5180, 73.7650]}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[15.5180, 73.7650]} />
              <Circle
                center={[15.5180, 73.7650]}
                radius={800}
                pathOptions={{ color: '#E00B41', fillColor: '#E00B41', fillOpacity: 0.1, weight: 1 }}
              />
            </MapContainer>
          </div>

          <div className="location-title font-semibold" style={{ marginTop: '24px' }}>Candolim, Goa, India</div>
          <p className="location-desc">Located in the heart of Candolim, North Goa. Just 10 minutes away from Candolim Beach, fine dining, popular shacks, and supermarkets, while remaining in a peaceful, secure gated community.</p>
        </div>

        <hr className="section-divider" />

        {/* Meet Your Host */}
        <div className="host-profile-section">
          <h2 className="section-heading font-semibold mb-6">Meet your host</h2>

          <div className="host-content-grid">
            {/* Left Column */}
            <div className="host-left-col">
              <div className="host-card-large">
                <div className="host-card-left">
                  <div className="host-avatar-container">
                    <img src="/images/6b72f8b5-0e66-4bf1-8ba3-ff0f87ff3687.jpg" alt="Mirashya Homes Profile" className="host-card-avatar" />
                    <div className="host-badge">
                      <svg viewBox="0 0 32 32" width="24" height="24"><path d="M16 32a16 16 0 1 0 0-32 16 16 0 0 0 0 32z" fill="#E61E4D"/><path d="M14.3 22.8a1 1 0 0 1-.7-.3l-5.3-5.3a1 1 0 1 1 1.4-1.4l4.6 4.6 10.4-10.4a1 1 0 0 1 1.4 1.4L15 22.5a1 1 0 0 1-.7.3z" fill="#fff"/></svg>
                    </div>
                  </div>
                  <h3 className="host-card-name font-semibold mt-4">Mirashya Homes</h3>
                  <div className="host-card-role text-sm mt-1" style={{ color: '#717171' }}>Host</div>
                </div>

                <div className="host-card-right">
                  <div className="host-stat-row border-b">
                    <div className="stat-val font-semibold">1499</div>
                    <div className="stat-lbl text-xs">Reviews</div>
                  </div>
                  <div className="host-stat-row border-b">
                    <div className="stat-val font-semibold flex items-center">4.68<span style={{ fontSize: '14px', marginLeft: '2px' }}>★</span></div>
                    <div className="stat-lbl text-xs">Rating</div>
                  </div>
                  <div className="host-stat-row">
                    <div className="stat-val font-semibold">2</div>
                    <div className="stat-lbl text-xs">Years hosting</div>
                  </div>
                </div>
              </div>

              <div className="host-personal-info mt-8">
                <div className="flex items-center gap-4 mb-4">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24z M16 28v4 M12 32h8" /></svg>
                  <span className="text-sm">Born in the 80s</span>
                </div>
                <div className="flex items-center gap-4">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14l12-6 12 6-12 6-12-6z" /><path d="M8 16v6l8 4 8-4v-6" /></svg>
                  <span className="text-sm">Where I went to school: NICMAR GOA</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="host-right-col">
              <h3 className="text-lg font-semibold mb-4">Co-Hosts</h3>
              <div className="co-hosts-grid mb-8">
                <div className="co-host-item">
                  <img src="/images/090d8b0b-b539-42c0-84f8-e1fb0cdf9a93.jpg" className="co-host-avatar" alt="Sharath" />
                  <span className="text-sm">Sharath</span>
                </div>
                <div className="co-host-item">
                  <img src="/images/a45feaa2-b607-4092-83ac-5fd4b2894959.jpg" className="co-host-avatar" alt="Aman Dev Pahwa" />
                  <span className="text-sm">Aman Dev Pahwa</span>
                </div>
                <div className="co-host-item">
                  <img src="/images/f1da1c3d-0d10-481e-9b63-c71f9073f30b.jpg" className="co-host-avatar" alt="Maria Karen Priyanka" />
                  <span className="text-sm">Maria Karen Priyanka</span>
                </div>
                <div className="co-host-item">
                  <img src="/images/1c827136-4a85-4fe0-8e69-3fd8ea19bb17.jpg" className="co-host-avatar" alt="Simran" />
                  <span className="text-sm">Simran</span>
                </div>
                <div className="co-host-item">
                  <img src="/images/a9831aeb-f441-44f5-a38f-4cf54e3f0fcf.jpg" className="co-host-avatar" alt="Pallavi" />
                  <span className="text-sm">Pallavi</span>
                </div>
                <div className="co-host-item">
                  <img src="/images/9be71047-fc52-438a-9270-75cb470f6752.jpg" className="co-host-avatar" alt="Sanyukta" />
                  <span className="text-sm">Sanyukta</span>
                </div>
                <div className="co-host-item">
                  <div className="co-host-initial bg-pink">S</div>
                  <span className="text-sm">Shruti</span>
                </div>
                <div className="co-host-item">
                  <div className="co-host-initial bg-blue">A</div>
                  <span className="text-sm">Amisha</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Host details</h3>
              <div className="mb-1 text-md">Response rate: 100%</div>
              <div className="mb-6 text-md">Responds within an hour</div>
              
              <button className="message-host-btn font-semibold mb-8">
                Message host
              </button>

              <hr className="mb-6" />

              <div className="flex gap-4">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 2L4 8v10c0 8 12 12 12 12s12-4 12-12V8L16 2z" /></svg>
                <div className="text-xs" style={{ fontSize: '12px', lineHeight: '16px', color: '#717171' }}>
                  To help protect your payment, always use Airbnb to send money and communicate with hosts.
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        {/* Things to Know */}
        <div className="things-to-know-section mb-12">
          <h2 className="section-heading font-semibold mb-6">Things to know</h2>

          <div className="ttk-grid">
            <div className="ttk-col">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4"><path d="M10 2v4M22 2v4M2 10h28M6 4h20a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /></svg>
              <div className="font-semibold mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>Cancellation policy</div>
              <div className="ttk-text mb-2">Add your trip dates to get the cancellation details for this stay.</div>
              <a href="#" className="ttk-link font-semibold underline">Add dates</a>
            </div>

            <div className="ttk-col">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4"><path d="M12 2v6 M20 2v6 M6 8h20v22H6z M16 16v6 M12 22h8" /></svg>
              <div className="font-semibold mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>House rules</div>
              <div className="ttk-text">Check-in after 2:00pm</div>
              <div className="ttk-text">Checkout before 11:00 am</div>
              <div className="ttk-text mb-2">3 guests maximum</div>
              <a href="#" className="ttk-link font-semibold underline">Learn more</a>
            </div>

            <div className="ttk-col">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4"><path d="M16 2L4 8v10c0 8 12 12 12 12s12-4 12-12V8L16 2z" /></svg>
              <div className="font-semibold mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>Safety & property</div>
              <div className="ttk-text">Carbon monoxide alarm not reported</div>
              <div className="ttk-text">Smoke alarm not reported</div>
              <div className="ttk-text mb-2">Exterior security cameras on property</div>
              <a href="#" className="ttk-link font-semibold underline">Learn more</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content container">
          <div className="footer-columns-grid">
            <div className="footer-col">
              <h4 className="footer-heading font-semibold">Support</h4>
              <ul className="footer-links">
                <li>Help Centre</li>
                <li>Get help with a safety issue</li>
                <li>AirCover</li>
                <li>Anti-discrimination</li>
                <li>Disability support</li>
                <li>Cancellation options</li>
                <li>Report neighbourhood concern</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading font-semibold">Hosting</h4>
              <ul className="footer-links">
                <li>Airbnb your home</li>
                <li>AirCover for Hosts</li>
                <li>Hosting resources</li>
                <li>Community forum</li>
                <li>Hosting responsibly</li>
                <li>Join a free hosting class</li>
                <li>Find a co-host</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading font-semibold">Airbnb</h4>
              <ul className="footer-links">
                <li>Newsroom</li>
                <li>New features</li>
                <li>Careers</li>
                <li>Investors</li>
                <li>Airbnb.org emergency stays</li>
              </ul>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom-bar">
            <div className="footer-bottom-left">
              <span>© 2026 Airbnb, Inc.</span>
              <span className="dot font-semibold">·</span>
              <span className="footer-link">Privacy</span>
              <span className="dot font-semibold">·</span>
              <span className="footer-link">Terms</span>
              <span className="dot font-semibold">·</span>
              <span className="footer-link">Sitemap</span>
              <span className="dot font-semibold">·</span>
              <span className="footer-link">Company details</span>
            </div>

            <div className="footer-bottom-right">
              <button className="footer-locale-btn font-semibold">
                <GlobeIcon style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                <span>English (IN)</span>
              </button>
              <button className="footer-locale-btn font-semibold">
                <span>₹ INR</span>
              </button>
              <div className="footer-social-icons">
                <a href="#facebook" aria-label="Facebook"><FacebookIcon /></a>
                <a href="#twitter" aria-label="Twitter"><TwitterIcon /></a>
                <a href="#instagram" aria-label="Instagram"><InstagramIcon /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Photo Tour Modal */}
      {showPhotoTour && (
        <PhotoTour
          onClose={() => setShowPhotoTour(false)}
          onSelectPhoto={(idx) => {
            setShowPhotoTour(false);
            setLightboxIndex(idx);
          }}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={LISTING_IMAGES}
          currentIndex={lightboxIndex}
          onNext={() => setLightboxIndex((prev) => (prev + 1) % LISTING_IMAGES.length)}
          onPrev={() => setLightboxIndex((prev) => (prev - 1 + LISTING_IMAGES.length) % LISTING_IMAGES.length)}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* About this space Modal */}
      {showDescriptionModal && (
        <div className="modal-overlay" onClick={() => setShowDescriptionModal(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowDescriptionModal(false)}>✕</button>
            <h2 className="modal-title font-semibold">About this space</h2>
            <div className="modal-body-scroll">
              <p className="mb-4">🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it’s ideal for couples seeking romance, relaxation, and a touch of luxury in North Goa. ❤️🌴</p>
              <h3 className="font-semibold text-lg mb-2">The Space</h3>
              <p className="mb-4">Welcome to your ultimate Goa getaway! Designed for comfort and luxury, this 1BHK apartment combines modern amenities with a serene coastal vibe. Enjoy a sparkling swimming pool, lush outdoor garden, and 24/7 power backup.</p>
              <h3 className="font-semibold text-lg mb-2">Guest Access</h3>
              <p className="mb-4">Guests have full private access to the entire apartment including the balcony, private jacuzzi, and shared access to the main pool and elevator.</p>
            </div>
          </div>
        </div>
      )}

      {/* All Amenities Modal */}
      {showAllAmenities && (
        <div className="modal-overlay" onClick={() => setShowAllAmenities(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAllAmenities(false)}>✕</button>
            <h2 className="modal-title font-semibold">What this place offers</h2>
            <div className="modal-body-scroll">
              <h3 className="font-semibold text-lg mb-3">Scenic views</h3>
              <p className="mb-2">Pool view · Garden view · Tropical greenery</p>
              <h3 className="font-semibold text-lg mb-3 mt-4">Bathroom & Spa</h3>
              <p className="mb-2">Private Jacuzzi & Hot tub · Hot water · Hair dryer · Cleaning products</p>
              <h3 className="font-semibold text-lg mb-3 mt-4">Bedroom & Laundry</h3>
              <p className="mb-2">Essentials · Hangers · Bed linen · Extra pillows and blankets · Iron</p>
              <h3 className="font-semibold text-lg mb-3 mt-4">Entertainment & Internet</h3>
              <p className="mb-2">Fast WiFi (500 Mbps) · Smart TV with Netflix, Prime & Disney+</p>
            </div>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {showAllReviews && (
        <div className="modal-overlay" onClick={() => setShowAllReviews(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAllReviews(false)}>✕</button>
            <div className="flex items-center gap-2 mb-4">
              <StarIcon style={{ width: '24px', height: '24px', fill: '#FF385C' }} />
              <h2 className="modal-title font-semibold">5.0 · 29 reviews</h2>
            </div>
            <div className="modal-body-scroll">
              <div className="reviews-modal-grid">
                <div className="user-review-card">
                  <div className="reviewer-name font-semibold">Aniket</div>
                  <p className="review-text">Awesome experience! Niraj was super responsive and helped us with everything.</p>
                </div>
                <div className="user-review-card mt-3">
                  <div className="reviewer-name font-semibold">Vinay</div>
                  <p className="review-text">Clean rooms, warm lights & aesthetic furniture. Feels like 2nd home.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
