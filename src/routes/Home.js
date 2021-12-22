import React,{useEffect, useState} from "react";
import Tweet from "components/Tweet";
import { dbService } from "myBase";


const Home = ({userObj}) => {
    const [tweet,setTweet] = useState("");
    const [tweets,setTweets] = useState([]);

    // const getTweets = async() => {
    //     const dbTweets = await dbService.collection("tweets").get();
    //     dbTweets.forEach(document => {
    //         const tweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //             creatorId: userObj.uid
    //         }
    //         setTweets(prev => [tweetObject, ...prev])
    //     })};

    useEffect(() => {
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(tweetArray)

        })

        // getTweets()
    },[])

    const onSubmit = (event) => {
        event.preventDefault();
        dbService.collection("tweets").add({
            text: tweet,
            creatorId: userObj.uid,
            createdAt: Date.now(),
        })
        
        setTweet("");
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setTweet(value)
    }
    

    return (
        <div>
            {console.log(userObj.uid)}
            <form onSubmit={onSubmit}>
                <input 
                type="text"
                value={tweet}
                placeholder="what's on your mind?" 
                maxLength={120}
                onChange={onChange} 
                />
                <input type="submit" value="Tweet" />
            </form>
            {tweets.map( (tweet) => (
                <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
            ))}
        </div>
    )
}
export default Home