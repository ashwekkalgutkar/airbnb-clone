import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';
import './DatePicker.css';

export default function DatePicker({ startDate, endDate, onDateChange, onClearDates }) {
  const [hoveredDate, setHoveredDate] = useState(null);

  // Constants for October 2026
  const octYear = 2026;
  const octMonth = 9; // 0-indexed (October)
  const octDays = 31;
  const octStartDay = 4; // October 1, 2026 is Thursday (0: Sun, 1: Mon... 4: Thu)

  // Constants for November 2026
  const novYear = 2026;
  const novMonth = 10; // 0-indexed (November)
  const novDays = 30;
  const novStartDay = 0; // November 1, 2026 is Sunday

  // Helper to check if a date is selected, inside range, or endpoint
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
  };

  const isBefore = (d1, d2) => {
    if (d1.year !== d2.year) return d1.year < d2.year;
    if (d1.month !== d2.month) return d1.month < d2.month;
    return d1.day < d2.day;
  };

  const isBetween = (day, start, end) => {
    if (!start || !end) return false;
    return isBefore(start, day) && isBefore(day, end);
  };

  const handleDateClick = (dayObj) => {
    if (!startDate || (startDate && endDate)) {
      onDateChange(dayObj, null);
    } else if (startDate && !endDate) {
      if (isBefore(dayObj, startDate)) {
        onDateChange(dayObj, null);
      } else {
        onDateChange(startDate, dayObj);
      }
    }
  };

  const handleDateHover = (dayObj) => {
    if (startDate && !endDate) {
      setHoveredDate(dayObj);
    } else {
      setHoveredDate(null);
    }
  };

  const getDayClass = (dayObj) => {
    if (!dayObj) return 'empty-day';

    const classes = ['day-cell'];

    const isStart = isSameDay(dayObj, startDate);
    const isEnd = isSameDay(dayObj, endDate);

    if (isStart) classes.push('day-start-endpoint');
    if (isEnd) classes.push('day-end-endpoint');

    if (startDate && endDate) {
      if (isBetween(dayObj, startDate, endDate)) {
        classes.push('day-in-range');
      }
    } else if (startDate && hoveredDate) {
      if (isBetween(dayObj, startDate, hoveredDate)) {
        classes.push('day-in-range-preview');
      }
      if (isSameDay(dayObj, hoveredDate)) {
        classes.push('day-hovered-endpoint');
      }
    }

    return classes.join(' ');
  };

  const renderMonth = (monthName, startDayOffset, totalDays, monthIdx, year) => {
    const days = [];
    // Render empty slots for weekday offsets
    for (let i = 0; i < startDayOffset; i++) {
      days.push(null);
    }
    // Render day numbers
    for (let d = 1; d <= totalDays; d++) {
      days.push({ year, month: monthIdx, day: d });
    }

    // Weekdays header
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
      <div className="calendar-month">
        <h3 className="month-header font-semibold">{monthName}</h3>
        <div className="weekdays-grid">
          {weekdays.map((w, idx) => (
            <div key={idx} className="weekday">{w}</div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((dayObj, idx) => {
            const isClickable = dayObj !== null;
            return (
              <div
                key={idx}
                className={getDayClass(dayObj)}
                onClick={() => isClickable && handleDateClick(dayObj)}
                onMouseEnter={() => isClickable && handleDateHover(dayObj)}
                onMouseLeave={() => isClickable && setHoveredDate(null)}
              >
                {dayObj ? dayObj.day : ''}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="datepicker-container">
      {/* Calendar Navigation and Grids */}
      <div className="calendar-header-nav">
        <button className="nav-arrow-btn"><ChevronLeft size={16} /></button>
        <button className="nav-arrow-btn"><ChevronRight size={16} /></button>
      </div>

      <div className="calendars-row">
        {renderMonth('October 2026', octStartDay, octDays, octMonth, octYear)}
        {renderMonth('November 2026', novStartDay, novDays, novMonth, novYear)}
      </div>

      {/* DatePicker Footer */}
      <div className="datepicker-footer">
        <button className="keyboard-btn">
          <Keyboard size={18} />
        </button>
        <button className="clear-dates-btn font-semibold" onClick={onClearDates}>
          Clear dates
        </button>
      </div>
    </div>
  );
}
