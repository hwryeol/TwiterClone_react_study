import { authService, dbService } from "myBase";
import { useState } from "react";
import React,{useEffect} from "react";
import Tweet from "components/Tweet";
import {useNavigate} from "react-router-dom"

const Profile = ({userObj}) => {
    const navigate = useNavigate();
    const [tweets,setTweets] = useState([])

    const onLogOutClick = () => {
        authService.signOut()
        navigate("/");
    };
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
        console.log("effect")
        return () => {
            setTweets([]);
            console.log("delete effect")
        }
    },[])

    return (
            <div>
                <button onClick={onLogOutClick}>Log Out</button>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
                ))}
            </div>
    )
}
export default Profile