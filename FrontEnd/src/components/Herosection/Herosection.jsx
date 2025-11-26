import React from "react";
import {useState, useEffect} from "react";
import banner1 from '../../Images/IMG_1.jpeg'
import banner2 from '../../Images/IMG_2.png'
import banner3 from '../../Images/IMG_3.jpg'
import banner4 from '../../Images/IMG_4.jpg'
import banner5 from '../../Images/IMG_5.jpg'
import banner6 from '../../Images/IMG_6.jpg'
import "./Herosection.css";


const HeroSection = () => {

  const largeBannerImages=[banner2, banner4, banner6];

  const smallBannerImages=[banner1, banner3, banner5];

  const [currentLargeImage, setCurrentLargeImage] = useState(0);
  const [currentSmallImage, setCurrentSmallImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLargeImage((prev) => (prev + 1) % largeBannerImages.length);
      setCurrentSmallImage((prev) => (prev + 1) % smallBannerImages.length);
    }, 4500); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  },[]);
  return (
    <div className="hero-container">
      <div className="banner large-banner"
       style={{
        backgroundImage: `url(${largeBannerImages[currentLargeImage]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // transition: "background-image 0.5s ",
      }}>

        <h2>Explore Unique Gifts</h2>
        <p>Find the perfect present for every occasion.</p>
      </div>
      <div className="banner small-banner"
      style={{
        backgroundImage: `url(${smallBannerImages[currentSmallImage]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // transition: "background-image 0.5s ease-in-out",
      }}>
        <h3>New Arrivals</h3>
        <p>Fresh decor pieces just for you!</p>
      </div>
    </div>
  );
};

export default HeroSection;