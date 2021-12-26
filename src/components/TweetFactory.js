import React from "react";
import { useState } from "react";
import {storageService,dbService} from "myBase"
import {v4 as uuidv4} from "uuid"

const TweetFactory = ({userObj}) => {
    const [tweet,setTweet] = useState("");
    const [attachment,setAttachment] = useState("")

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
    )
}
export default TweetFactory;