import React from "react";
import { useState } from "react";
import { authService, firebaseInstance } from "myBase";
const Auth = () => {
        const [email,setEmail] = useState("");
        const [password,setPassword] = useState("")
        const [newAccount,setNewAccount] = useState(true)
        const [error,setError] = useState("")


        const onChange = (event) => {
            const {target: {name,value}} = event;
            if(name === "email"){
                setEmail(value)
            }else if(name==="password")
                setPassword(value)
        }
        const onSubmit = async (event) => {
            event.preventDefault();
            let data;
            try{
            if(newAccount){
                // create account
                data = await authService.createUserWithEmailAndPassword(email,password)
            } else {
                // login
                data = await authService.signInWithEmailAndPassword(email,password)
            }
            console.log(data)
        }catch(error){
            if(error.code == "auth/weak-password"){
                setError("The password is too weak.")
            } else if(error.code === "auth/email-already-in-use") {
                setError("The Email is already in use")
            } else if(error.code === "auth/invalid-email"){
                setError("The Email is invalid")
            } else if(error.code === "auth/operation-not-allowed"){
                setError("operation not allowed")
            }
        }
        }
        const toggleAccount = () => setNewAccount((prev) => !prev)
        const onSocialClick = async (event) => {
            const {
                target: {name},
            } = event;
            let provider;
            if(name === "google"){
                provider = new firebaseInstance.auth.GoogleAuthProvider();
            } else if(name === "github") {
                provider = new firebaseInstance.auth.GithubAuthProvider();
            }
            const data = await authService.signInWithPopup(provider);
        }
    return (
    <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" onChange={onChange} value={email} required></input>
                <input name="password" type="password" placeholder="Password" onChange={onChange} value={password} required></input>
                <input type="submit" value={newAccount?"create Account": "Login"}></input>
            </form>
            <div>{error}</div>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Account"}
            </span>
            <div>
                <button name="google" onClick={onSocialClick}>Goggle</button>
                <button name="github"  onClick={onSocialClick}>github</button>
            </div>
        </div>
        )
}
export default Auth