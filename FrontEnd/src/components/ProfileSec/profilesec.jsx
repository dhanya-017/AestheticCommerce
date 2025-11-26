import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../Redux/userSlice'; // Adjust the import path
import { logoutUser } from '../../Redux/authSlice';
import './profilesec.css';

const Profilesec = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user data from Redux store
 const { profile, status , error } = useSelector((state) => state.profile);

  // Handle sign out
  const handleSignOut = () => {
    // Clear auth state and localStorage via redux action
    dispatch(logoutUser());
    // Optionally clear any legacy keys if present
    localStorage.removeItem('token');
    navigate('/');
  };

  // Fetch profile when this page loads
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  if (token) {
    dispatch(fetchUserProfile(token));
  }
}, [dispatch]);

  // Handle loading or error state
  if (status == 'loading') return <p>Loading profile...</p>;
  if (status == 'failed') return <p>Error loading profile: {error}</p>;

  return (
    <div className="profile-layout">
      <aside className="sidebar">
        <nav className="sidebar-nav" aria-label="Sidebar Navigation">
          <ul>
            <li className="active"><span>My Profile</span></li>
            <li><span>Orders</span></li>
            <li><span>Wishlist</span></li>
            <li><span>Addresses</span></li>
            <li><span>Payment Methods</span></li>
            <li><span>Reviews</span></li>   
            <li><span>Coupons</span></li>
            <li><span>Settings</span></li>
             {/* <Link to="/Seller"><li><span>Become a Seller</span></li></Link> */}
             <Link to="http://localhost:5173/register"><li><span>Become a Seller</span></li></Link>
             <li className="sign-out-btn" onClick={handleSignOut}><span>Sign Out</span></li>
          </ul>
        </nav>
        <footer className="sidebar-footer">
          <div className="user-mini">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" />
            <div>
              <span className="user-name">{profile?.fullname?.firstname} {profile?.fullname?.lastname}</span>
              <span className="user-email">{profile?.email}</span>
            </div>
          </div>
        </footer>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <div>
            <h2>My Profile</h2>
            <span className="profile-role">Customer</span>
          </div>
          <div className="profile-meta">
            <span>Last login: 21 May 2025</span>
          </div>
        </header>

        <section className="profile-section profile-user">
          <img className="profile-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
          <div>
            <h3>{profile?.fullname?.firstname} {profile?.fullname?.lastname}</h3>
            <span>New York, USA</span>
            <span className="profile-email">{profile?.email}</span>
          </div>
        </section>

        <section className="profile-section profile-info">
          <div className="profile-info-header">
            <h4>Personal Information</h4>
            <button className="edit-btn">Edit</button>
          </div>
          <div className="profile-info-grid">
            <div>
              <label>Full Name</label>
              <span>{profile?.fullname?.firstname} {profile?.fullname?.lastname}</span>
            </div>
            <div>
              <label>Email</label>
              <span>{profile?.email}</span>
            </div>
            <div>
              <label>Phone</label>
              <span>+1 555 123 4567</span>
            </div>
            <div>
              <label>Joined</label>
              <span>March 2023</span>
            </div>
          </div>
        </section>

        <section className="profile-section profile-address">
          <div className="profile-info-header">
            <h4>Default Address</h4>
            <button className="edit-btn">Edit</button>
          </div>
          <div className="profile-info-grid">
            <div>
              <label>Country</label>
              <span>USA</span>
            </div>
            <div>
              <label>City</label>
              <span>New York</span>
            </div>
            <div>
              <label>Postal Code</label>
              <span>10001</span>
            </div>
          </div>
        </section>

        <section className="profile-section profile-stats">
          <div className="stat">
            <span className="stat-value">15</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat">
            <span className="stat-value">8</span>
            <span className="stat-label">Wishlist</span>
          </div>
          <div className="stat">
            <span className="stat-value">3</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="stat">
            <span className="stat-value">2</span>
            <span className="stat-label">Coupons</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profilesec;