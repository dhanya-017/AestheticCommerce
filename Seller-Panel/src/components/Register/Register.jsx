// src/components/Register/Register.js
import React, { useState, useEffect } from "react";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller, resetAuthState } from "../../Redux/authSlice";
import { useNavigate, Link } from "react-router-dom"; // ✅ Added Link
import logo from "../../Images/Logo.png";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sellerName: "",
    email: "",
    password: "",
    phone: "",
    storeName: "",
    gstNumber: "",
    registrationNumber: "",
    businessAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: ""
    },
    businessType: "individual",
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      upiId: "",
      paymentCycle: "monthly"
    },
    governmentIdProof: "",
    addressProof: ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { seller, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerSeller(formData));
  };

  useEffect(() => {
    if (isSuccess && seller) {
      navigate("/");
      dispatch(resetAuthState());
    }
  }, [isSuccess, seller, navigate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  return (
    <div className="registration-container">
    <div className="form-card">
       <div className="logo-container">
          <img src={logo} alt="App Logo" className="logo" />
      </div>
      <h2>Become a Seller</h2>
        {isError && <p className="error-text">{message}</p>}
        {isSuccess && <p className="success-text">Registration Successful!</p>}

        
        <form onSubmit={handleSubmit}>
          {/* Step 1 - Account Info */}
          {step === 1 && (
            <>
              <input
                type="text"
                name="sellerName"
                placeholder="Full Name"
                value={formData.sellerName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* Step 2 - Business Details */}
          {step === 2 && (
            <>
              <input
                type="text"
                name="storeName"
                placeholder="Store Name"
                value={formData.storeName}
                onChange={handleChange}
                required
              />
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
              >
                <option value="individual">Individual</option>
                <option value="partnership">Partnership</option>
                <option value="private_limited">Private Limited</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number (optional)"
                value={formData.gstNumber}
                onChange={handleChange}
              />
              <input
                type="text"
                name="registrationNumber"
                placeholder="Business Registration Number (optional)"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
              <input
                type="text"
                name="businessAddress.street"
                placeholder="Street"
                value={formData.businessAddress.street}
                onChange={handleChange}
              />
              <input
                type="text"
                name="businessAddress.city"
                placeholder="City"
                value={formData.businessAddress.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="businessAddress.state"
                placeholder="State"
                value={formData.businessAddress.state}
                onChange={handleChange}
              />
              <input
                type="text"
                name="businessAddress.country"
                placeholder="Country"
                value={formData.businessAddress.country}
                onChange={handleChange}
              />
              <input
                type="text"
                name="businessAddress.postalCode"
                placeholder="Postal Code"
                value={formData.businessAddress.postalCode}
                onChange={handleChange}
              />
            </>
          )}

          {/* Step 3 - Banking & Payment */}
          {step === 3 && (
            <>
              <input
                type="text"
                name="bankDetails.accountNumber"
                placeholder="Bank Account Number"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="bankDetails.ifscCode"
                placeholder="IFSC / SWIFT Code"
                value={formData.bankDetails.ifscCode}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="bankDetails.accountHolderName"
                placeholder="Account Holder Name"
                value={formData.bankDetails.accountHolderName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="bankDetails.upiId"
                placeholder="UPI ID (optional)"
                value={formData.bankDetails.upiId}
                onChange={handleChange}
              />
              <select
                name="bankDetails.paymentCycle"
                value={formData.bankDetails.paymentCycle}
                onChange={handleChange}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </>
          )}

          {/* Step 4 - Verification & Compliance */}
          {step === 4 && (
            <>
              <input
                className="seller_product-input"
                type="text"
                name="governmentIdProof"
                placeholder="Government ID Proof (URL)"
                value={formData.governmentIdProof}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="addressProof"
                placeholder="Address Proof (URL)"
                value={formData.addressProof}
                onChange={handleChange}
                required
              />
              <p className="review-text">
                ✅ Review all details before submitting.
              </p>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {step > 1 && (
              <button type="button" onClick={prevStep} disabled={isLoading}>
                Back
              </button>
            )}
            {step < 4 && (
              <button type="button" onClick={nextStep} disabled={isLoading}>
                Next
              </button>
            )}
            {step === 4 && (
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>

        {/* ✅ Added Login Link */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already a seller? <Link to="/login">Login here</Link>
        </p>

        <div className="step-indicator">Step {step} of 4</div>
      </div>
    </div>
  );
};

export default Register;