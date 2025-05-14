import React, { useEffect, useState } from 'react'
import { Button } from "./../components/ui/button"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigation } from 'react-router';
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/components/ui/dialog";
function Header() {

  const user =JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(()=>{
    console.log(user)
  },[])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      GetUserProfile(codeResp); // Fetch user profile after login
    },
    onError: (error) => {
      console.log("An error occurred", error);
    },
    scope: "openid email profile",  // Ensure we request the 'email' scope
  });

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
            setOpenDialog(false);  // Close the sign-in dialog
            toast("Signed in successfully!");
            window.location.reload();
        } else {
            toast("Failed to fetch user data.");
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        toast("Error signing in. Try again.");
    }
};

  return (
    <div className='p-3  shadow-sm flex justify-between items-center px-5'>
      <img src='/mainlogo.jpg' className='h-20 w-15 object-cover'/>
      <div>
        {user ?
         <div classname='flex items-center gap-3'>
           <a href='/create-trip'>
            <Button variant="outline"className="rounded-full" >+ Create Trip</Button>
            </a>
          <a href='/my-trips'>
            <Button variant="outline"className="rounded-full" >My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger><img src={user?.picture} className='h-[35px] w-[35px] rounded-full'/></PopoverTrigger>
              <PopoverContent>
                <h2  classname='cursor-pointer' onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                 window.location.reload();
                }}>Logout.</h2>
              </PopoverContent>
            </Popover>


        </div>
        :
        <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
        }
       
      </div>
       <Dialog open={openDialog}>
              <DialogContent>
                <DialogHeader>
                  <img src="/logo.svg" />
                  <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
                  <p>Sign In to the App with Google authentication securely</p>
                  <Button
                   
                    onClick={login}
                    className="w-full mt-5 flex gap-4 items-center">
                    
                    <FcGoogle className="h-7 w-7" />
                    Sign In with Google
                   
                   </Button>
                   
                </DialogHeader>
              </DialogContent>
            </Dialog>
    </div>
  )
}

export default Header
