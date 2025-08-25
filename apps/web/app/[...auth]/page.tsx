"use client"
import { SignUp} from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const App = () => {

   const {isLoaded, isSignedIn} = useUser();
   const router = useRouter();

   if(!isLoaded) {
      return <div>loading...</div>
   }
   else if(isLoaded && isSignedIn){
      return router.push('/');
   }
   else {
      return <div className="flex bg-black w-screen h-screen justify-center items-center">
            <SignUp/>   
      </div>
   }

}

export default App;
