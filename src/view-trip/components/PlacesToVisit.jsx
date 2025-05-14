import React from 'react'
import PlaceCardItem from '../components/PlaceCardItem'

function PlacesToVisit({ trip }) {
  if (!trip || !trip.tripData) {
    return <div>Loading trip data...</div>
  }

  const itineraryEntries = Object.entries(trip.tripData.itinerary || {})

  return (
    <div className='font-bold text-lg'>
      <h2>Places To Visit</h2>
      <div>
        {itineraryEntries.map(([dayKey, places], index) => (
          <div key={dayKey} className='mt-5'>
            <h2 className='font-bold text-lg capitalize'>{dayKey}</h2>
            <div className='grid md:grid-cols-2 gap-5'>
              {places.map((place, i) => (
                <div key={i}>
                  <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit
