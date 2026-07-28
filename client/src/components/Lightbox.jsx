import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShareIcon, HeartIcon } from './Icons';
import './Lightbox.css';

export default function Lightbox({ images, currentIndex, onNext, onPrev, onClose }) {
  const currentImage = images[currentIndex] || {};
  const [animating, setAnimating] = useState(false);

  // Keypress and scroll lock handlers
  useEffect(() => {
    // Lock background scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrev, onClose]);

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onNext();
  };

  const handlePrev = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onPrev();
  };

  return (
    <div className="lightbox-overlay">
      {/* Top Header Controls */}
      <div className="lightbox-header">
        <button className="lightbox-close-btn" onClick={onClose}>
          <X size={16} strokeWidth={2} color="#222" />
          <span>Close</span>
        </button>

        <div className="lightbox-count font-semibold">
          {currentIndex + 1} / {images.length}
        </div>

        <div className="lightbox-actions">
          <button className="lightbox-action-btn"><ShareIcon /> Share</button>
          <button className="lightbox-action-btn"><HeartIcon /> Save</button>
        </div>
      </div>

      {/* Main Image View */}
      <div className="lightbox-content">
        {/* Previous Button */}
        <button
          className="nav-arrow prev-arrow"
          onClick={handlePrev}
          disabled={images.length <= 1}
        >
          <ChevronLeft size={24} color="#222" />
        </button>

        {/* Image Display */}
        <div className={`lightbox-img-wrapper ${animating ? 'fade-anim' : ''}`}>
          <img
            src={currentImage.src}
            alt={currentImage.alt || `Photo ${currentIndex + 1}`}
            className="lightbox-img"
          />
        </div>

        {/* Next Button */}
        <button
          className="nav-arrow next-arrow"
          onClick={handleNext}
          disabled={images.length <= 1}
        >
          <ChevronRight size={24} color="#222" />
        </button>
      </div>
    </div>
  );
}
