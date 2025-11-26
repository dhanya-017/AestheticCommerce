import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './TopBar.css';
import Notifications from '../Notifications/Notifications';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const adminName = localStorage.getItem('adminName') || 'Admin';

  // Update search query when on search page
  useEffect(() => {
    if (location.pathname === '/search') {
      const query = searchParams.get('q') || '';
      setSearchQuery(query);
    } else {
      setSearchQuery('');
    }
  }, [location.pathname, searchParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If user clears the search and we're on search page, navigate back to dashboard
    if (value.trim() === '' && location.pathname === '/search') {
      navigate('/');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      } else if (location.pathname === '/search') {
        navigate('/');
      }
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/search') {
      navigate('/');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="topbar">
      <button onClick={handleHomeClick} className="home-btn" title="Go to Dashboard">
        Dashboard
      </button>
      
      <div className="topbar-search">
        <input
          type="text"
          placeholder="Search globally (products, sellers)..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
          className="topbar-search-input"
        />
        {searchQuery && (
          <span className="clear-icon" onClick={handleClearSearch} style={{ cursor: 'pointer' }}>✕</span>
        )}
        <span className="search-icon" onClick={handleSearchClick} style={{ cursor: 'pointer' }}>🔍</span>
      </div>
      
      <div className="topbar-admin" ref={dropdownRef}>
        <Notifications />
        <div className="admin-info">
          <span className="admin-name">{adminName}</span>
          <span className="admin-role">Administrator</span>
        </div>
        <div className="admin-avatar" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
          {adminName.charAt(0).toUpperCase()}
        </div>
        
        {showDropdown && (
          <div className="admin-dropdown">
            <div className="dropdown-header">
              <div className="dropdown-avatar">{adminName.charAt(0).toUpperCase()}</div>
              <div>
                <div className="dropdown-name">{adminName}</div>
                <div className="dropdown-role">Administrator</div>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <button onClick={handleLogout} className="dropdown-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;