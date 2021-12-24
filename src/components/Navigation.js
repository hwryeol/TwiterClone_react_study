import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({userObj}) => (
<nav>
    <ul>
        <li>
            <Link to="/">Home</Link>
        </li>
        <li>
            {console.log(userObj)}
            <Link to="/profile">{userObj.displayName}'s' Profile</Link>
        </li>
    </ul>
</nav>
)

export default Navigation