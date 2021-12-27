import { dbService } from "myBase";
import { storageService } from "myBase";
import { useState } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


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
        <div className="nweet">
        <>
        <h4 style={{display:"inline"}}>{tweetObj.text} </h4>
        {Boolean(tweetObj.attachmentUrl) && <img src = {tweetObj.attachmentUrl} alt="pic" width="50px" height="50px"></img>}
        {editing? (
            <>
             <form onSubmit={onSubmit} className="container nweetEdit">
                <input onChange={onChange} type="text" placeholder="Edit tweet" value={newTweet} required autoFocus className="formInput" />
                <input type="submit" value="Update tweet" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
            </>
            ):(<>
                {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} />}
                {isOwner ? (
                    <>
                    <div class="nweet__actions">
                        <span onClick={onClickDelete}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                    </>
                ):null}
                </>)
        }
        </>
    </div>)
}

export default Tweet