import React, { useState, useRef, useEffect } from "react";
import "./Orders.css";
import OrderTable from "../OrderTable/OrderTable";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaShippingFast,
  FaChevronDown,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderStatusStats } from "../../Redux/statsSlice";
import { fetchSellerOrders } from "../../Redux/dashboardSlice";

const Orders = () => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [activeTab, setActiveTab] = useState("orders");
  const [openDropdown, setOpenDropdown] = useState(null);

  const dispatch = useDispatch();

  // 🟢 Get order status stats from stats slice
  const {
    orderStatus,
    isLoading: statsLoading,
    isError: statsError,
    message: statsMessage,
  } = useSelector((state) => state.stats);

  // 🟣 Get total orders from dashboard slice
  const {
    orders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useSelector((state) => state.dashboard);

  // Get seller info from auth/user state
  const { user } = useSelector((state) => state.auth || state.user || {});
  const sellerId = user?.sellerId || user?._id;
  const token = localStorage.getItem("sellerToken");

  // 🧭 Log Redux slice data for debugging
  useEffect(() => {
    console.log("🔍 [Orders.jsx] Current Redux Stats Slice:", {
      orderStatus,
      statsLoading,
      statsError,
      statsMessage,
    });
  }, [orderStatus, statsLoading, statsError, statsMessage]);

  // 🔹 Fetch orders and stats when component mounts or filter changes
  useEffect(() => {
    if (sellerId && token) {
      console.log("🚀 Fetching seller orders and order status stats...", {
        sellerId,
        timeFilter,
      });

      // Fetch total orders from dashboard
      dispatch(fetchSellerOrders({ sellerId, token }));

      // Fetch order status distribution from stats
      if (activeTab === "orders") {
        dispatch(fetchOrderStatusStats(timeFilter));
      }
    } else {
      console.warn("⚠️ Missing sellerId or token, skipping fetch");
    }
  }, [dispatch, timeFilter, activeTab, sellerId, token]);

  // 🔹 Dropdown setup
  const timeOptions = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
  ];

  const dropdownRefs = {
    time: useRef(),
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefs.time.current &&
        !dropdownRefs.time.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Render order stats cards
  const renderStatsCards = () => {
    const isLoading = statsLoading || ordersLoading;
    const isError = statsError || ordersError;

    if (isLoading) {
      return (
        <div className="order-stats-cards">
          <div className="loading-placeholder">Loading order statistics...</div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="order-stats-cards">
          <p style={{ color: "red" }}>
            Error: {statsMessage || "Failed to load stats"}
          </p>
        </div>
      );
    }

    // 🧩 Extract stats data
    const totalOrders = orders?.length || 0;

    // 🔹 Order status counts
    let delivered = 0;
    let processing = 0;
    let shipped = 0;
    let outForDelivery = 0;
    let cancelled = 0;

    console.group("📊 Order Status Debug Log");
    console.log("Raw orderStatus from Redux:", orderStatus);

    if (Array.isArray(orderStatus)) {
      orderStatus.forEach((item) => {
        const status = item.status || "";
        const count = item.count || 0;
        console.log(`Status: "${status}" | Count: ${count}`);

        if (status === "Delivered") delivered += count;
        else if (status === "Processing") processing += count;
        else if (status === "Shipped") shipped += count;
        else if (status === "Out for Delivery") outForDelivery += count;
        else if (status === "Cancelled") cancelled += count;
      });
    } else {
      console.warn("⚠️ orderStatus is not an array:", orderStatus);
    }

    console.log("📈 Computed:", {
      totalOrders,
      delivered,
      processing,
      shipped,
      outForDelivery,
      cancelled,
    });
    console.groupEnd();

    const cards = [
      { title: "Total Orders", value: totalOrders, icon: <FaBox /> },
      { title: "Delivered Orders", value: delivered, icon: <FaCheckCircle /> },
      { title: "Processing Orders", value: processing, icon: <FaClock /> },
      { title: "Shipped Orders", value: shipped, icon: <FaShippingFast /> },
    ];

    return (
      <div className="order-stats-cards">
        {cards.map((stat, i) => (
          <div className="order-stat-card" key={i}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h2>{stat.value.toLocaleString()}</h2>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header + Time Dropdown */}
        <div className="orders-header-section">
          <h1 className="orders-header">
            {activeTab === "orders" ? "Orders Overview" : "Returns & Refunds"}
          </h1>

          <div className="dropdown-container" ref={dropdownRefs.time}>
            <div
              className="time-filter"
              onClick={() =>
                setOpenDropdown(openDropdown === "time" ? null : "time")
              }
            >
              {timeOptions.find((t) => t.value === timeFilter)?.label}
              <FaChevronDown style={{ marginLeft: "8px" }} />
            </div>
            {openDropdown === "time" && (
              <ul className="dropdown-list">
                {timeOptions.map((option) => (
                  <li
                    key={option.value}
                    className={
                      option.value === timeFilter ? "active-category" : ""
                    }
                    onClick={() => {
                      setTimeFilter(option.value);
                      setOpenDropdown(null);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ✅ Stats Cards */}
        {activeTab === "orders" && renderStatsCards()}

        {/* Tabs */}
        <div className="orders-filter-section">
          <div className="orders-tabs">
            <button
              className={`tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
            <button
              className={`tab ${activeTab === "refunds" ? "active" : ""}`}
              onClick={() => setActiveTab("refunds")}
            >
              Returns & Refunds
            </button>
          </div>
        </div>

        {/* Conditional Content */}
        <div className="table-wrap">
          {activeTab === "orders" ? (
            <OrderTable timeFilter={timeFilter} />
          ) : (
            <div className="development-message">
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#6b7280",
                  fontSize: "18px",
                }}
              >
                <FaClock
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    color: "#9ca3af",
                  }}
                />
                <h3 style={{ marginBottom: "8px", color: "#374151" }}>
                  Still in Development
                </h3>
                <p>Returns & Refunds feature is coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
