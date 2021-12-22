import React from "react";

const onClickDelete = () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    console.log(ok)
    if(ok){

    } else {
        
    }

}

const Tweet = ({ tweetObj, isOwner}) => (
    <div>
        <>
        <h4>{tweetObj.text}</h4>
        {isOwner?<>
            <button onClick={onClickDelete}>Delete</button>
            <button>Edit</button>
            </>
        :null}
        </>
        
    </div>)

export default Tweet