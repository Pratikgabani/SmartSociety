// import React, { useEffect } from "react";
// import UserContext from "./UserContext.js";
// import axios from "axios";

// const UserContextProvider = ({children}) => {
//     const [rolee , setRolee ] = React.useState("");
//     useEffect(()=>{
//         const fetchUser = async()=>{
//             try {
//               const res = await axios.get("https://resihub.onrender.com/api/v1/users/currentUser", { withCredentials: true });
//             //   console.log( "res" , res.data.data.role)
//               setRolee(res.data.data.role.toString());  
//             } catch (error) {
//               console.log(error);
//             }
//         }
//         fetchUser();
//     },[])
//     return(
//         <UserContext.Provider value={{rolee , setRolee}}>
//         {children}
//         </UserContext.Provider>
//     )
// }

// export default UserContextProvider
import React, { useEffect, useState } from "react";
import UserContext from "./UserContext.js";
import axios from "axios";

const UserContextProvider = ({ children }) => {
  const [rolee, setRolee] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://resihub2.onrender.com/api/v1/users/currentUser", {
          withCredentials: true,
        });
        setRolee(res.data.data.role.toString());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ rolee, setRolee, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
