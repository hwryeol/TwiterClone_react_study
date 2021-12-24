import React,{useEffect, useState} from "react";
import Tweet from "components/Tweet";
import { dbService, storageService } from "myBase";
import {v4 as uuidv4} from "uuid"


const Home = ({userObj}) => {
    const [tweet,setTweet] = useState("");
    const [tweets,setTweets] = useState([]);
    const [attachment,setAttachment] = useState("")

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
            console.log("effect")
        return () => {
            setTweets([]);
            console.log("delete effect")
        }
        },[])

    const onSubmit = async (event) => {
        event.preventDefault();
        const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
        let attachmentUrl = ""
        if(attachment){
            const response = await fileRef.putString(attachment,"data_url")
            attachmentUrl = await response.ref.getDownloadURL()
        }
        
        await dbService.collection("tweets").add({
            text: tweet,
            creatorId: userObj.uid,
            createdAt: Date.now(),
            attachmentUrl: attachmentUrl
        })
        event.target[1].value = ""
        setAttachment("");
        setTweet("");
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setTweet(value)
    }
    const onFileChange = (event) => {
        const {target:{files}} = event
        const theFile = files[0];
        const reader = new FileReader()
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget:{result}
            } = finishedEvent;
            console.log(finishedEvent)
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
    }

    const onClearPhotClick = () => setAttachment(null)
    

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                type="text"
                value={tweet}
                placeholder="what's on your mind?" 
                maxLength={120}
                onChange={onChange} 
                />
                <input name="fileInput" type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Tweet" />
                {attachment && (
                    <div>
                        <img src={attachment} alt="pic" width="50px" height="50px"/>
                        <button onClick={onClearPhotClick}>clear</button>

                    </div>
                    )}
            </form>
            {tweets.map( (tweet) => (
                <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
            ))}
        </div>
    )
}
export default Home