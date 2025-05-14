import React, { useState } from 'react';
import { Link } from "react-router-dom";
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  const [error, setError] = useState(null);

  // Parse tripData if it's a string
  let tripData;
  try {
    tripData = typeof trip?.tripData === 'string'
      ? JSON.parse(trip.tripData)
      : trip?.tripData;
  } catch (err) {
    setError('Failed to parse trip data');
    console.error('Error parsing trip data:', err);
  }

  const hotels = Array.isArray(tripData?.hotels) ? tripData.hotels : [];

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <h2 className="font-bold text-xl">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!hotels.length) {
    return (
      <div className="text-gray-500 p-4">
        <h2 className="font-bold text-xl">No Hotels Found</h2>
        <p>No hotel recommendations available for this trip.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
        {hotels.map((hotel, index) => (
          <HotelCardItem 
            key={`${hotel.hotelName}-${index}`}
            hotel={hotel}
          />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
