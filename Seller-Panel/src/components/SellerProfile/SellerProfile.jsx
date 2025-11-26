// src/components/SellerProfile/SellerProfile.js
// code by eth - Updated with Edit functionality
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Trash2, 
  Pencil,
  Menu,
  Package,        
  ClipboardList,  
  Star,
  Save,
  X
} from "lucide-react";
import styles from "./SellerProfile.module.css";

// Import actions
import { fetchSellerStats } from "../../Redux/dashboardSlice";
import { updateSellerProfile } from "../../Redux/sellerSlice"; // You'll need to create this action

// Sidebar Component
const Sidebar = ({ isSidebarOpen }) => (
  <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
    <div className={styles.sidebarNav}>
      <a href="#" className={`${styles.navLink} ${styles.activeLink}`}>
        My Profile
      </a>
      <a href="#" className={styles.navLink}>Security</a>
      <a href="#" className={styles.navLink}>Notifications</a>
      <a href="#" className={styles.navLink}>Billing</a>
      <a href="#" className={styles.navLink}>Data Export</a>
    </div>
    <div className={styles.sidebarFooter}>
      <a href="#" className={styles.deleteLink}>
        <Trash2 size={16} /> Delete Account
      </a>
    </div>
  </nav>
);

const SellerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { profile, loading, error } = useSelector((state) => state.seller);
  const { stats: dashboardStats } = useSelector((state) => state.dashboard);
  const auth = useSelector((state) => state.auth);
  const authSeller = auth?.seller ?? null;
  const authToken = auth?.token ?? null;

  // Local state
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState({
    personal: false,
    address: false,
    banking: false
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
    gstNumber: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: ""
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Fetch dashboard stats
  useEffect(() => {
    const id = authSeller?._id || authSeller?.sellerId || authSeller?.id || profile?._id;
    const token = authToken;
    if (!id || !token) return;
    if (!dashboardStats) {
      dispatch(fetchSellerStats({ sellerId: id, token }));
    }
  }, [dispatch, authSeller, authToken, dashboardStats, profile]);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      const fullName = profile.sellerName || "";
      const [firstName, ...lastName] = fullName.split(" ");
      const address = profile.businessAddress || {};
      const bankDetails = profile.bankDetails || {};

      setFormData({
        firstName: firstName || "",
        lastName: lastName.join(" ") || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        country: address.country || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        gstNumber: profile.gstNumber || "",
        accountHolderName: bankDetails.accountHolderName || "",
        accountNumber: bankDetails.accountNumber || "",
        ifscCode: bankDetails.ifscCode || "",
        upiId: bankDetails.upiId || ""
      });
    }
  }, [profile]);

  // Toggle edit mode for a section
  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes
  const handleSave = async (section) => {
    setSaveLoading(true);

    try {
      // Prepare update payload based on section
      let updateData = {};

      if (section === 'personal') {
        updateData = {
          sellerName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
        };
      } else if (section === 'address') {
        updateData = {
          businessAddress: {
            country: formData.country,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
          },
          gstNumber: formData.gstNumber,
        };
      } else if (section === 'banking') {
        updateData = {
          bankDetails: {
            accountHolderName: formData.accountHolderName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            upiId: formData.upiId,
          },
        };
      }

      console.log('Updating seller profile with data:', updateData);

      // Dispatch the update action. Token is taken from Redux auth state or localStorage in the thunk.
      await dispatch(updateSellerProfile(updateData)).unwrap();

      // Exit edit mode on success
      toggleEditMode(section);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      const message = typeof err === 'string' ? err : err?.message || 'Failed to update profile. Please try again.';
      alert(message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Cancel editing and revert changes
  const handleCancel = (section) => {
    // Reload original data
    if (profile) {
      const fullName = profile.sellerName || "";
      const [firstName, ...lastName] = fullName.split(" ");
      const address = profile.businessAddress || {};
      const bankDetails = profile.bankDetails || {};

      setFormData({
        firstName: firstName || "",
        lastName: lastName.join(" ") || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        country: address.country || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        gstNumber: profile.gstNumber || "",
        accountHolderName: bankDetails.accountHolderName || "",
        accountNumber: bankDetails.accountNumber || "",
        ifscCode: bankDetails.ifscCode || "",
        upiId: bankDetails.upiId || ""
      });
    }
    toggleEditMode(section);
  };

  // Render field (read-only or editable)
  const renderInfoField = (label, value, name, isEditing) => {
    if (!isEditing) {
      if (value === undefined || value === null || value === "") return null;
      return (
        <div className={styles.infoField}>
          <label>{label}</label>
          <span>{value}</span>
        </div>
      );
    }

    return (
      <div className={styles.infoField}>
        <label>{label}</label>
        <input
          type="text"
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={styles.editInput}
        />
      </div>
    );
  };

  // Only show global loading while the initial profile is being fetched
  if (loading && !profile) {
    return <div className={styles.centeredMessage}>Loading seller data...</div>;
  }

  if (error) {
    return <div className={`${styles.centeredMessage} ${styles.errorMessage}`}>{error}</div>;
  }

  if (!profile) {
    return <div className={styles.centeredMessage}>No seller profile found.</div>;
  }

  const seller = profile;

  return (
    <div className={styles.pageContainer}>
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <main className={styles.contentArea}>
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <button className={styles.menuButton} onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              {seller?.sellerName?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className={styles.profileInfo}>
              <h2>{seller.sellerName || "Seller Name"}</h2>
              <p className={styles.storeName}>{seller.storeName || "Team Manager"}</p>
            </div>
          </div>
            <button 
              className={styles.backButton} 
              onClick={() => navigate("/home")} 
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
              <span className={styles.backButtonText}>Back to Home</span>
            </button>
          </div>

         

          {/* Stats Section */}
          <div className={styles.profileStats}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconProducts}`}>
                <Package size={22} />
              </div>
              <div className={styles.statInfo}>
                <p>Products</p>
                <h4>{dashboardStats?.totalProducts ?? seller?.totalProducts ?? 0}</h4>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconOrders}`}>
                <ClipboardList size={22} />
              </div>
              <div className={styles.statInfo}>
                <p>Orders</p>
                <h4>{dashboardStats?.totalOrders ?? seller?.totalOrders ?? 0}</h4>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconRating}`}>
                <Star size={22} />
              </div>
              <div className={styles.statInfo}>
                <p>Customers</p>
                <h4>{dashboardStats?.totalCustomers ?? seller?.ratings ?? 0}</h4>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h3>Personal Information</h3>
              <div className={styles.buttonGroup}>
                {editMode.personal ? (
                  <>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => handleCancel('personal')}
                      disabled={saveLoading}
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleSave('personal')}
                      disabled={saveLoading}
                    >
                      <Save size={14} /> {saveLoading ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button 
                    className={styles.editButton}
                    onClick={() => toggleEditMode('personal')}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>
            </div>
            <div className={styles.infoGrid}>
              {renderInfoField("First Name", formData.firstName, "firstName", editMode.personal)}
              {renderInfoField("Last Name", formData.lastName, "lastName", editMode.personal)}
              {renderInfoField("Email address", formData.email, "email", editMode.personal)}
              {renderInfoField("Phone", formData.phone, "phone", editMode.personal)}
              {renderInfoField("Bio", formData.bio || "A brief bio about the seller can go here.", "bio", editMode.personal)}
            </div>
          </div>

          {/* Address Section */}
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h3>Address</h3>
              <div className={styles.buttonGroup}>
                {editMode.address ? (
                  <>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => handleCancel('address')}
                      disabled={saveLoading}
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleSave('address')}
                      disabled={saveLoading}
                    >
                      <Save size={14} /> {saveLoading ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button 
                    className={styles.editButton}
                    onClick={() => toggleEditMode('address')}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>
            </div>
            <div className={styles.infoGrid}>
              {renderInfoField("Country", formData.country, "country", editMode.address)}
              {renderInfoField("City", formData.city, "city", editMode.address)}
              {renderInfoField("State", formData.state, "state", editMode.address)}
              {renderInfoField("Postal Code", formData.postalCode, "postalCode", editMode.address)}
              {renderInfoField("TAX ID", formData.gstNumber, "gstNumber", editMode.address)}
            </div>
          </div>

          {/* Banking Details Section */}
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h3>Banking Details</h3>
              <div className={styles.buttonGroup}>
                {editMode.banking ? (
                  <>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => handleCancel('banking')}
                      disabled={saveLoading}
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleSave('banking')}
                      disabled={saveLoading}
                    >
                      <Save size={14} /> {saveLoading ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button 
                    className={styles.editButton}
                    onClick={() => toggleEditMode('banking')}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>
            </div>
            {seller.bankDetails || editMode.banking ? (
              <div className={styles.infoGrid}>
                {renderInfoField("Account Holder", formData.accountHolderName, "accountHolderName", editMode.banking)}
                {renderInfoField("Account Number", formData.accountNumber, "accountNumber", editMode.banking)}
                {renderInfoField("IFSC Code", formData.ifscCode, "ifscCode", editMode.banking)}
                {renderInfoField("UPI ID", formData.upiId, "upiId", editMode.banking)}
              </div>
            ) : (
              <p className={styles.noDetails}>No bank details available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerProfile;