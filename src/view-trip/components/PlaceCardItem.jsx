import React, { useEffect, useState } from 'react';
import { Button } from "@/components/components/ui/button";  
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';

function PlaceCardItem({place}) {
  
  const [photoUrl,setPhotoUrl]=useState();
    useEffect(()=>{
      place&&GetPlacePhoto();
    },[place])
  
    const GetPlacePhoto=async()=>{
      const data={
        textQuery:place.placeName
      }
      const result=await GetPlaceDetails(data).then(resp=>{
        
  
        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
        setPhotoUrl(PhotoUrl);
      })
    }

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place.placeName} target='_blank'>

      <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
      <img src={photoUrl?photoUrl:'/placeholder.jpg'}
        className='w-[130px] h-[130px] rounded-xl object-cover' />

        <div className="flex flex-col justify-between">
          <h2 className="font-bold text-lg">{place.placeName}</h2>
          <p className="text-sm text-gray-500">{place.placeDetails}</p>
          {place.timeToTravel && (
            <p className="mt-2 text-sm">🕙 {place.timeToTravel}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
