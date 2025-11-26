import React from 'react';
import Navbar from '../src/components/Navbar/Navbar.jsx';
import ContactUs from '../src/components/ContactUs/Contactus.jsx'
import NewsLetter from '../src/components/NewsletterSection/Newsletter.jsx';
import Footer from '../src/components/Footersection/Footersection.jsx';


function Contactpage() {
    
    return (
        <div>
            <Navbar noMarginBottom={true}></Navbar>
            <ContactUs></ContactUs>
            <Footer></Footer>
 
            
        </div>
    );
}

export default Contactpage;