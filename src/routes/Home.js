import React,{useEffect, useState} from "react";
import Tweet from "components/Tweet";
import { dbService } from "myBase";
import TweetFactory from "components/TweetFactory";



const Home = ({userObj}) => {
    const [tweets,setTweets] = useState([]);

    useEffect(() => {
            dbService.collection("tweets").orderBy("createdAt","desc").onSnapshot((snapshot) => {
                const tweetArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTweets(tweetArray)
            })
        return () => {
            setTweets([]);
        }
        },[])


    return (
        <div className="container">
            <TweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
            {tweets.map( (tweet) => (
                <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
            ))}
            </div>
        </div>
    )
}
export default Home