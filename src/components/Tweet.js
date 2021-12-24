import { dbService } from "myBase";
import { storageService } from "myBase";
import { useState } from "react";
import React from "react";


const Tweet = ({ tweetObj, isOwner}) => {
    const [newTweet,setNewTweet] = useState(tweetObj.text)
    const [editing,setEditing] = useState(false)

    const onClickDelete = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        if(ok){
            await dbService.doc(`tweets/${tweetObj.id}`).delete()
            if(tweetObj.attachmentUrl){
                await storageService.refFromURL(tweetObj.attachmentUrl).delete();
            }
        }};
    
    const onChange = (event) => {
        const {target:{value}} = event
        setNewTweet(value)
    }
    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text: newTweet,
        })
        setEditing(false);
        }

    
    return (
    <div>
        <>
        <h4 style={{display:"inline"}}>{tweetObj.text} </h4>
        {Boolean(tweetObj.attachmentUrl) && <img src = {tweetObj.attachmentUrl} alt="pic" width="50px" height="50px"></img>}
        {editing? (
            <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Edit tweet" value={newTweet} />
                <input type="submit" value="Update" /> 
            </form>
            <button onClick={toggleEditing}>Cancel</button>
            </>
            ):(<>
                {isOwner ? (
                    <>
                    <button onClick={onClickDelete}>Delete</button>
                    <button onClick={toggleEditing}>Edit</button>
                    </>
                ):null}
                </>)
        }
        </>
    </div>)
}

export default Tweet