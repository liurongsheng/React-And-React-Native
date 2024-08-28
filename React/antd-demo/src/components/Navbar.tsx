import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import './index.less'

const Navbar = () => {
  return (
    <div className="navbar">
      <ul>
        <li><RouterLink to='home' >Home</RouterLink></li>
        <li><RouterLink to='collections' >Collections</RouterLink></li>
        <li><RouterLink to='favorites' >Favorites</RouterLink></li>
        <li><RouterLink to='login' >Logout</RouterLink></li>
      </ul>
    </div>
  )
}

export default Navbar;