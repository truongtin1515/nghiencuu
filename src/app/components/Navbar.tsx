"use client"; 


import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../components/Assets/logo.png'
import cart_icon from '../components/Assets/cart_icon.png'; 
import './Navbar.css'; 
import ThemeToggle from './toggleTheme';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [theme, setTheme] = useState(() => 
    typeof window !== "undefined" ? localStorage.getItem("theme") || "mylight" : "mydark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute("data-theme")?? "mylight";
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);
  
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
        <ThemeToggle/>
        <Link href="/login">
          <button>Login</button>
        </Link>
        <Link href="/shoppingcart/productlist">
          <Image 
            src={cart_icon} 
            alt="Cart" 
            width={30} 
            height={30} 
            className={theme === "mydark" ? "brightness-0 invert" : "brightness-0"}
          />
        </Link>
          <div className="nav-cart-count">0</div>
        </div>
      </div>
  );
};

export default Navbar;