import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../src/components/LoginForm/LoginForm";
import { loginSeller, resetAuthState } from "../../src/Redux/authSlice";
// import "./LoginPage.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { seller, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (data) => {
    dispatch(loginSeller(data));
  };

  useEffect(() => {
    if (isSuccess && seller) {
      navigate("/home"); // redirect to homepage or dashboard
    }

    // Cleanup when component unmounts or after an action
    return () => {
      dispatch(resetAuthState());
    };
  }, [isSuccess, seller, navigate, dispatch]);

return (
  <div className="login-page">
    <div className="login-box">
      {isLoading && <p className="login-message loading">Loading...</p>}
      {isError && <p className="login-message error">{message}</p>}

      <LoginForm onSubmit={handleLogin} />
    </div>
  </div>
);
};

export default LoginPage;
