import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";
// import { AiFillHeart } from "react-icons/ai";
// // import { FiShoppingCart, FiChevronDown } from "react-icons/fi";
// import { FiShoppingCart } from "react-icons/fi";
// import { CgProfile } from "react-icons/cg";
import {
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  Grid2X2,
  Store,
  BookOpen,
} from "lucide-react";
import { IoBagOutline } from "react-icons/io5";
import Notifications from '../Notifications/Notifications';

const shopMegaMenu = [
  {
    heading: "Wall Decor",
    items: ["Macrame", "Wooden Signs", "Canvas Art", "Dreamcatchers"],
  },
  {
    heading: "Handmade Gifts",
    items: ["Customized Frames", "Greeting Cards", "Gift Boxes", "Scrapbooks"],
  },
  {
    heading: "Art Supplies",
    items: ["Paints & Brushes", "DIY Kits", "Craft Papers", "Beads & Threads"],
  },
];

const productMegaMenu = [
  {
    heading: "Visual Arts",
    items: [
      "Drawing",
      "Painting",
      "Printmaking",
      "Illustration",
      "Calligraphy",
    ],
  },
  {
    heading: "Paper Crafts",
    items: [
      "Origami",
      "Scrapbooking",
      "Quilling",
      "Card Making",
      "Paper Mache",
    ],
  },
  {
    heading: "Cultural Crafts",
    items: ["India Folk Arts", "Sand Art", "Pottery", "Indigenous Beadwork"],
  },
];

const blogMegaMenu = [
  {
    heading: "Gift Guides",
    items: ["Valentine's Day", "Birthdays", "Festivals", "Anniversaries"],
  },
  {
    heading: "Home Vibes",
    items: [
      "Wall Decors",
      "Bedroom Furbish",
      "Daily Must-Haves",
      "Rennovations",
    ],
  },
  {
    heading: "Zero Waste",
    items: [
      "Eco-Gifts",
      "Recylable Paints",
      "Eco-Festivals",
      "Sustainable Customers",
    ],
  },
];

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  // Get cart and favorites count from Redux
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const favoritesCount = useSelector((state) => state.favorites.items.length);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Helper function to generate URL slugs
  const slugify = (str) => str.toLowerCase().replace(/[\s&]+/g, "-");

  // Function to handle link clicks and close dropdown
  const handleLinkClick = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="navbar">
      {/* Mobile top bar */}
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="navbar-logo">Aestheticommerce</div>
        <div className="mobile-topbar-right">
       
          {user ? (
            <div className="mobile-nav-group-items">


          <Link to="/favorites" className="mobile-profile-icon" aria-label="Favorites">
            <Heart />
            {favoritesCount > 0 && (
              <span className="badge">{favoritesCount}</span>
            )}
          </Link>
         
          <Link to="/profile" className="mobile-profile-icon" aria-label="Profile">
            <User />
          </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="mobile-login_button"
              aria-label="Sign in"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="navbar-logo desktop-only">Aestheticommerce</div>

      <div className="make-space">
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li
            className="navbar-dropdown"
            onMouseEnter={() => setActiveDropdown("products")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="nav-link-wrapper">
              <Link to="/products" className="nav-link nav-link-product">
                Products
              </Link>
              {/* <FiChevronDown className="dropdown-arrow" /> */}
              {activeDropdown === "products" && (
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    {productMegaMenu.map((col) => (
                      <div className="mega-dropdown-col" key={col.heading}>
                        <Link
                          to={`/${slugify(col.heading)}`}
                          className="mega-dropdown-heading-link"
                          onClick={handleLinkClick}
                        >
                          <div className="mega-dropdown-heading">
                            {col.heading}
                          </div>
                        </Link>

                        <ul>
                          {col.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/${slugify(col.heading)}/${slugify(item)}`}
                                onClick={handleLinkClick}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="mega-dropdown-img">
                      <img
                        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=250"
                        alt="Products"
                      />
                      <div className="mega-dropdown-img-caption">
                        Best Sellers
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
          <li
            className="navbar-dropdown"
            onMouseEnter={() => setActiveDropdown("shops")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="nav-link-wrapper">
              <Link to="/shops" className="nav-link">
                Shops
              </Link>
              {/* <FiChevronDown className="dropdown-arrow" /> */}
              {activeDropdown === "shops" && (
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    {shopMegaMenu.map((col) => (
                      <div
                        className="mega-dropdown-col mega-dropdown-col-shop"
                        key={col.heading}
                      >
                        <Link
                          to={`/shops/${slugify(col.heading)}`}
                          className="mega-dropdown-heading-link"
                        >
                          <div className="mega-dropdown-heading-shop">
                            {col.heading}
                          </div>
                        </Link>
                        <ul>
                          {col.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/shops/${item
                                  .toLowerCase()
                                  .replace(/[\s&]+/g, "-")}`}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="mega-dropdown-img">
                      <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=250"
                        alt="Crafts"
                      />
                      <div className="mega-dropdown-shop-img-caption">
                        Featured Crafts
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
          <li
            className="navbar-dropdown"
            onMouseEnter={() => setActiveDropdown("blogs")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="nav-link-wrapper">
              <Link to="/blog" className="nav-link">
                Blogs
              </Link>
              {/* <FiChevronDown className="dropdown-arrow" /> */}
              {activeDropdown === "blogs" && (
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    {blogMegaMenu.map((col) => (
                      <div
                        className="mega-dropdown-col mega-dropdown-col-blog"
                        key={col.heading}
                      >
                        <Link
                          to={`/blogs/${slugify(col.heading)}`}
                          className="mega-dropdown-heading-link"
                        >
                          <div className="mega-dropdown-heading-blog">
                            {col.heading}
                          </div>
                        </Link>
                        <ul>
                          {col.items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/blogs/${item
                                  .toLowerCase()
                                  .replace(/[\s&]+/g, "-")}`}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="mega-dropdown-img">
                      <img
                        src="https://images.unsplash.com/photo-1746812625962-24a25f68d633?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Blogs"
                      />
                      <div className="mega-dropdown-shop-img-caption">
                        <Link to="/blog" className="create-blog-button">
                          <button className="blog-create-btn">
                            Create Your Own Blog
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>

      {user ? (
        <div className="navbar-icons">
          <Link to="/favorites" className="nav-icon" aria-label="Favorites">
            <Heart />
            {favoritesCount > 0 && (
              <span className="badge">{favoritesCount}</span>
            )}
          </Link>
          <Link to="/cart" className="nav-icon" aria-label="Cart">
            <ShoppingCart />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          <div className="nav-icon">
            <Notifications />
          </div>
          <Link to="/profile" className="nav-icon" aria-label="Profile">
            <User />
          </Link>
        </div>
      ) : (
        <Link to="/login" className="login_button">
          Sign in
        </Link>
      )}

      {/* mobile bottom nav */}
      <div className="bottom-nav-spacer" />
      <nav className="mobile-bottom-nav" aria-label="Primary">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `mb-item ${isActive ? "active" : ""}`}
          aria-label="Home"
        >
          <Home size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => `mb-item ${isActive ? "active" : ""}`}
          aria-label="Products"
        >
          <Grid2X2 size={22} />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/shops"
          className={({ isActive }) => `mb-item ${isActive ? "active" : ""}`}
          aria-label="Shops"
        >
          <Store size={22} />
          <span>Shops</span>
        </NavLink>
        <NavLink
          to="/blog"
          className={({ isActive }) => `mb-item ${isActive ? "active" : ""}`}
          aria-label="Blogs"
        >
          <BookOpen size={22} />
          <span>Blogs</span>
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `mb-item relative ${isActive ? "active" : ""}`
          }
          aria-label="Cart"
        >
          <ShoppingCart size={22} />
          <span>Cart</span>
          {cartCount > 0 && <span className="mb-badge">{cartCount}</span>}
        </NavLink>
      </nav>
    </nav>
  );
};

export default Navbar;