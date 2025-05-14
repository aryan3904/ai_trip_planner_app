import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/GlobalApi";

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const GetPlacePhoto = useCallback(async () => {
    if (!hotel?.hotelName) {
      setError('Hotel name is missing');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        textQuery: hotel.hotelName
      };
      const resp = await GetPlaceDetails(data);
      const photoName = resp?.data?.places?.[0]?.photos?.[3]?.name;
      
      if (photoName) {
        const url = PHOTO_REF_URL.replace('{NAME}', photoName);
        setPhotoUrl(url);
      } else {
        setPhotoUrl('/placeholder.jpg');
      }
    } catch (error) {
      console.error("Failed to fetch hotel photo:", error);
      setError('Failed to load hotel image');
      setPhotoUrl('/placeholder.jpg');
    } finally {
      setIsLoading(false);
    }
  }, [hotel?.hotelName]);

  useEffect(() => {
    GetPlacePhoto();
  }, [GetPlacePhoto]);

  if (!hotel) {
    return null;
  }

  return (
    <Link 
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName)},${encodeURIComponent(hotel?.hotelAddress || '')}`} 
      target='_blank'
      className="block"
    >
      <div className='hover:scale-105 transition-all cursor-pointer'>
        <div className="relative h-[180px] w-full">
          {isLoading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
          ) : (
            <img 
              src={photoUrl || '/placeholder.jpg'} 
              className='rounded-xl h-[180px] w-full object-cover' 
              alt={hotel.hotelName}
              onError={() => setPhotoUrl('/placeholder.jpg')}
            />
          )}
        </div>
        <div className='my-2 flex flex-col gap-2'>
          <h2 className='font-medium truncate'>{hotel?.hotelName || 'Unnamed Hotel'}</h2>
          <h2 className='text-xs text-gray-500 truncate'>📍 {hotel?.hotelAddress || 'Address not available'}</h2>
          <h2 className='text-sm'>💰 {hotel?.price || 'Price not available'}</h2>
          <h2 className='text-sm'>⭐ {hotel?.rating || 'No rating'}</h2>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
