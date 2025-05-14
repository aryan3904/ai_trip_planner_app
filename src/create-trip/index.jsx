import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from "../components/components/ui/input";
import { selectedBudgetOptions, SelectTravelesList } from "/src/constants/options";
import { Button } from "../components/components/ui/button";    
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AI_PROMPT } from "/src/service/AIModal";
import { chatSession } from "/src/service/AIModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "/src/firebase.js"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";


function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem('formData');
    return savedFormData ? JSON.parse(savedFormData) : {};
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => {
      console.error("Login error:", error);
      toast.error("Failed to login with Google");
    },
    scope: "openid email profile",
  });

  const OnGenerateTrip = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setOpenDialog(true);
        return;
      }

      // Validate input
      if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays) {
        toast.error("Please fill all the required details.");
        return;
      }

      setLoading(true);
      setError(null);

      const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', formData?.location?.label)
        .replace('{totalDays}', formData?.noOfDays)
        .replace('{traveler}', formData?.traveler)
        .replace('{budget}', formData?.budget);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      
      if (!result?.response?.text) {
        throw new Error("AI response is empty or undefined.");
      }

      const responseText = await result.response.text();
      await SaveAiTrip(responseText);
      
    } catch (error) {
      console.error("Error generating trip:", error);
      setError(error.message);
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString()
      });

      toast.success("Trip generated successfully!");
      navigate('/view-trip/' + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = async (tokenInfo) => {
    try {
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: 'Application/json',
          },
        }
      );

      if (resp.data) {
        localStorage.setItem('user', JSON.stringify(resp.data));
        setUser(resp.data);
        setOpenDialog(false);
        toast.success("Signed in successfully!");
        OnGenerateTrip();
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Error signing in. Please try again.");
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      {/* Display User's Email After Login */}
      {user ? (
        <div className="my-5">
          <h3 className="text-lg">Welcome, {user.name}!</h3>
          <p className="text-md">Your Email: {user.email}</p>
        </div>
      ) : (
        <div>
          <p>Please sign in to access your profile.</p>
        </div>
      )}

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange('location', v);
              },
            }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning for your trip?</h2>
          <Input 
            placeholder={'Ex. 3'} 
            type="number"
            min="1"
            max="30"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {selectedBudgetOptions.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all
                ${formData?.budget === item.title ? 'shadow-lg border-black' : ''}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelesList.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow transition-all
                ${formData?.traveler === item.people ? 'shadow-lg border-black' : ''}`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="my-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="my-10 justify-end flex">
        <Button
          disabled={loading}
          onClick={OnGenerateTrip}
          className="min-w-[150px]"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            'Generate Trip'
          )}
        </Button>
      </div>

      {/* Google Authentication Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <img src="/logo.svg" alt="Logo" />
            <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
            <p>Sign In to the App with Google authentication securely</p>
            <Button
              onClick={login}
              className="w-full mt-5 flex gap-4 items-center"
            >
              <FcGoogle className="h-7 w-7" />
              Sign In with Google
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
