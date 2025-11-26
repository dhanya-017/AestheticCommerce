import react from 'react';
import './Newsletter.css';

function Newsletter() {
    return (
        <section className="newsletter-banner">
  <div className="newsletter-content">
    <p className="newsletter-text">
      Get info about <strong>exclusive deals, offers, gifts</strong> and many more...
    </p>
    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
      <div className="newsletter-input-wrapper">
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </div>
    </form>
  </div>
</section>

      
    );
}

export default Newsletter;