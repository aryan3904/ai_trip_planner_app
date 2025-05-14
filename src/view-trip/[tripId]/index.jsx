import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from "../components/Hotels";
import { doc, getDoc } from "firebase/firestore";
import { db } from "/src/firebase.js";
import PlacesToVisit from "../components/PlacesToVisit";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        setError('No trip found');
        toast.error('No trip found!');
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      setError('Failed to load trip data');
      toast.error('Failed to load trip data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AiOutlineLoading3Quarters className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 md:px-20 lg:px-44 xl:px-56">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <h2 className="font-bold text-xl">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-10 md:px-20 lg:px-44 xl:px-56">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          <h2 className="font-bold text-xl">No Trip Found</h2>
          <p>The requested trip could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section */}
      <InfoSection trip={trip} />
      
      {/* Recommended Hotels */}
      <Hotels trip={trip} />
      
      {/* Daily Plan */}
      <PlacesToVisit trip={trip} />
    </div>
  );
}

export default Viewtrip;
