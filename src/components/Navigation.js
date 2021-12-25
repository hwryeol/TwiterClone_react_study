import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({userObj}) => (
<nav>
    <ul>
        <li>
            <Link to="/">Home</Link>
        </li>
        <li>
            {userObj.displayName?<Link to="/profile">{userObj.displayName}'s' Profile</Link>:"Profile"}
        </li>
    </ul>
</nav>
)

export default Navigation