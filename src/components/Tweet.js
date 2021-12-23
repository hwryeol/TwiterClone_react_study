import { dbService } from "myBase";
import { useState } from "react";
import React from "react";


const Tweet = ({ tweetObj, isOwner}) => {
    const [newTweet,setNewTweet] = useState(tweetObj.text)
    const [editing,setEditing] = useState(false)

    const onClickDelete = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        console.log(ok)
        if(ok){
            await dbService.doc(`tweets/${tweetObj.id}`).delete()
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
        <h4>{tweetObj.text}</h4>
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