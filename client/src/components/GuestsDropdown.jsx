import React from 'react';
import { Plus, Minus } from 'lucide-react';
import './GuestsDropdown.css';

export default function GuestsDropdown({ guests, onGuestsChange, onClose }) {
  const handleIncrement = (type) => {
    const totalCurrent = guests.adults + guests.children;

    // Max 3 guests limit for this specific 1BHK listing
    if ((type === 'adults' || type === 'children') && totalCurrent >= 3) return;
    if (type === 'infants' && guests.infants >= 5) return;
    if (type === 'pets' && guests.pets >= 2) return;

    onGuestsChange({
      ...guests,
      [type]: guests[type] + 1
    });
  };

  const handleDecrement = (type) => {
    if (type === 'adults' && guests.adults <= 1) return;
    if (guests[type] <= 0) return;

    onGuestsChange({
      ...guests,
      [type]: guests[type] - 1
    });
  };


  return (
    <div className="guests-dropdown">
      {/* Adults Row */}
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-title font-semibold">Adults</span>
          <span className="guest-desc">Age 13 or above</span>
        </div>
        <div className="guest-controls">
          <button
            className="control-btn"
            onClick={() => handleDecrement('adults')}
            disabled={guests.adults <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="guest-count">{guests.adults}</span>
          <button
            className="control-btn"
            onClick={() => handleIncrement('adults')}
            disabled={(guests.adults + guests.children) >= 3}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Children Row */}
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-title font-semibold">Children</span>
          <span className="guest-desc">Ages 2-12</span>
        </div>
        <div className="guest-controls">
          <button
            className="control-btn"
            onClick={() => handleDecrement('children')}
            disabled={guests.children <= 0}
          >
            <Minus size={16} />
          </button>
          <span className="guest-count">{guests.children}</span>
          <button
            className="control-btn"
            onClick={() => handleIncrement('children')}
            disabled={(guests.adults + guests.children) >= 3}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Infants Row */}
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-title font-semibold">Infants</span>
          <span className="guest-desc">Under 2</span>
        </div>
        <div className="guest-controls">
          <button
            className="control-btn"
            onClick={() => handleDecrement('infants')}
            disabled={guests.infants <= 0}
          >
            <Minus size={16} />
          </button>
          <span className="guest-count">{guests.infants}</span>
          <button
            className="control-btn"
            onClick={() => handleIncrement('infants')}
            disabled={guests.infants >= 5}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Pets Row */}
      <div className="guest-row">
        <div className="guest-info">
          <span className="guest-title font-semibold">Pets</span>
          <span className="guest-desc">Bringing a service animal?</span>
        </div>
        <div className="guest-controls">
          <button
            className="control-btn"
            onClick={() => handleDecrement('pets')}
            disabled={guests.pets <= 0}
          >
            <Minus size={16} />
          </button>
          <span className="guest-count">{guests.pets}</span>
          <button
            className="control-btn"
            onClick={() => handleIncrement('pets')}
            disabled={guests.pets >= 2}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <p className="guests-note">
        This place has a maximum of 3 guests, not including infants. Pets are allowed.
      </p>

      <div className="guests-dropdown-footer">
        <button className="close-btn font-semibold" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
export { GuestsDropdown }; // Support both named and default exports for robustness
