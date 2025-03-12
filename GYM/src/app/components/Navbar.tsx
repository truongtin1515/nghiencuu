"use client"; 

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../components/Assets/logo.png'
import cart_icon from '../components/Assets/cart_icon.png'; 
import './Navbar.css'; 

const Navbar = () => {
  const [menu, setMenu] = useState("home");

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <Image src={logo} alt="Logo" width={50} height={50} />
        <p>GYM FITNESS</p>
      </div>
      <ul className='nav-menu'>
        <li onClick={() => setMenu("home")}>
          <Link href="/">Home</Link>
          {menu === "home" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("trainingplans")}>
          <Link href="/trainingplans">Training Plans</Link>
          {menu === "trainingplans" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("health")}>
          <Link href="/healthconsultation">Health Consultation</Link>
          {menu === "health" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("schedule")}>
          <Link href="/schedule">Schedule</Link>
          {menu === "schedule" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("aboutus")}>
          <Link href="/checkout">Checkout</Link>
          {menu === "checkout" ? <hr /> : <></>}
        </li>
      </ul>
      <div className='nav-login-cart'>
        <Link href="/login">
          <button>Login</button>
        </Link>
        <Link href="/shop">
          <Image src={cart_icon} alt="Cart" width={30} height={30} className="brightness-0 invert" />
        </Link>
        <div className="nav-cart-count">0</div>
      </div>
    </div>
  );
};

export default Navbar;