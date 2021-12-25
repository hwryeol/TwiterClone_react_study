import { authService, dbService } from "myBase";
import { useState } from "react";
import React,{useEffect} from "react";
import Tweet from "components/Tweet";
import {useNavigate} from "react-router-dom"

const Profile = ({userObj,refreshUser}) => {
    const navigate = useNavigate();
    const [tweets,setTweets] = useState([])
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut()
        navigate("/");
    };

    const onChange = (event) =>{
        const {
            target:{value},
        } = event;
        setNewDisplayName(value);
    }

    const getMyTweets = async () =>{
        await dbService.collection("tweets")
        .where("creatorId","==",userObj.uid)
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    ...doc.data()
                }
                ))
                setTweets(tweetArray)
        })
    }
    useEffect(() => {
        getMyTweets();
        return () => {
            setTweets([]);
        }
    },[])

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
           await userObj.updateProfile({
                displayName:newDisplayName,
            })
            refreshUser();
        }
    };


    return (
            <div>
                <form onSubmit={onSubmit}>
                    <input 
                    onChange={onChange}
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    />
                    <input type="submit" value="Update Profile" />
                </form>

                <button onClick={onLogOutClick}>Log Out</button>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
    )
}
export default Profile