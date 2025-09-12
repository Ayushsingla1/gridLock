"use client"
import { SignUp} from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const App = () => {

   const {isLoaded, isSignedIn} = useUser();
   const router = useRouter();

   useEffect(() => {
      if(isLoaded && isSignedIn){
         return router.push('/');
      }
   }, [])

   if(!isLoaded) {
      return <div>loading...</div>
   }
   
   return <div className="flex bg-black w-screen h-screen justify-center items-center">
         <SignUp/>   
   </div>
}

export default App;
