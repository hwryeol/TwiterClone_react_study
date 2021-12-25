
import React,{useEffect, useState} from "react";
import AppRouter from "components/Router"
import {authService} from "myBase"
function App() {
  const [init,setInit] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [userObj,setUserObj] = useState(null);


  useEffect(() => {
    authService.onAuthStateChanged((user)=> {
      if(user){
        setUserObj(
          {
          displayName:user.displayName,
          uid:user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
        setIsLoggedIn(true);
      } else {
        setUserObj(null);
        setIsLoggedIn(false);
      }
      setInit(true);
  });
},[])
const refreshUser = () => {
  const user = authService.currentUser
  setUserObj({
    displayName:user.displayName,
    uid:user.uid,
    updateProfile: (args) => user.updateProfile(args),
  });
};
  return (
  <>
  {init ? <AppRouter
    isLoggedIn={isLoggedIn}
    userObj={userObj}
    refreshUser={refreshUser}
  /> :"init..."}
  <footer> &copy; twiter {new Date().getFullYear()}</footer>
  </>
  )
}

export default App;
