import React, { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  FiShoppingCart,
  FiBarChart2,
  FiLogOut,
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiPackage,
  FiMenu,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { seller } = useSelector((state) => state.auth);

  const toggleProductDropdown = () => setProductDropdownOpen((p) => !p);
  const toggleSidebar = () => setCollapsed((c) => !c);

  const handleSignOut = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerData");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && <h2>{seller?.storeName || "STORE NAME"}</h2>}
        <button className="collapse-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          <FiMenu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/home" className="nav-item" title="Overview">
          <MdOutlineDashboard size={18} />
          {!collapsed && <span>Dashboard Overview</span>}
        </NavLink>

        <NavLink to="/statistics" className="nav-item" title="Statistics">
          <FiBarChart2 size={18} />
          {!collapsed && <span>Sales Statistics</span>}
        </NavLink>

        <NavLink to="/orders" className="nav-item" title="Orders">
          <FiShoppingCart size={18} />
          {!collapsed && <span>Order Management</span>}
        </NavLink>

        <div className="nav-item dropdown" onClick={toggleProductDropdown} title="Products">
          <div className="nav-item-label">
            <FiBox size={18} />
            {!collapsed && <span>Product Management</span>}
          </div>
          {!collapsed && (isProductDropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
        </div>

        {!collapsed && isProductDropdownOpen && (
          <div className="dropdown-menu">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `dropdown-item ${isActive ? "active-dropdown" : ""}`
              }
            >
              Product Listing
            </NavLink>
            <NavLink
              to="/addProduct"
              className={({ isActive }) =>
                `dropdown-item ${isActive ? "active-dropdown" : ""}`
              }
            >
              Add Product
            </NavLink>
            <NavLink
              to="/my-products"
              className={({ isActive }) =>
                `dropdown-item ${isActive ? "active-dropdown" : ""}`
              }
            >
              My-Products
            </NavLink>
          </div>
        )}

        <NavLink to="/inventory" className="nav-item" title="Inventory">
          <FiPackage size={18} />
          {!collapsed && <span>Inventory Management</span>}
        </NavLink>

        {/* <NavLink to="/customers" className="nav-item" title="Customers">
          <FiUsers size={18} />
          {!collapsed && <span>Customer Insights</span>}
        </NavLink> */}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className="user-info" title="Profile">
          <FaUserCircle size={28} />
          {!collapsed && (
            <div className="user-info-text">
              <strong>{seller?.storeName || "STORE NAME"}</strong>
              <br />
              <small>{seller?.email || "storename@example.com"}</small>
            </div>
          )}
        </NavLink>

        <div className="sign-out-btn" onClick={handleSignOut} title="Sign Out">
          <FiLogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;