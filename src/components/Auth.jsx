import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMicrosoftLogin = async () => {
    setError("");
    const provider = new OAuthProvider("microsoft.com");
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFacebookLogin = async () => {
    setError("");
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        maxWidth: 320,
        margin: "2rem auto",
        padding: 16,
        border: "1px solid #ccc",
      }}
    >
      <h3>Sign in to continue</h3>
      {user ? (
        <>
          <p>Signed in as: {user.email}</p>
          <button onClick={handleLogout}>Sign Out</button>
        </>
      ) : (
        <>
          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              background: "#4285F4",
              color: "white",
              padding: 8,
              border: "none",
              marginBottom: 4,
              borderRadius: 4,
            }}
          >
            Sign in with Google
          </button>
          <button
            onClick={handleMicrosoftLogin}
            style={{
              width: "100%",
              background: "#4285F4",
              color: "white",
              padding: 8,
              border: "none",
              marginBottom: 4,
              borderRadius: 4,
            }}
          >
            Sign in with Microsoft
          </button>
          <button
            onClick={handleFacebookLogin}
            style={{
              width: "100%",
              background: "#4285F4",
              color: "white",
              padding: 8,
              border: "none",
              marginBottom: 4,
              borderRadius: 4,
            }}
          >
            Sign in with Facebook
          </button>
          <hr style={{ margin: "16px 0" }} />
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: "block", marginBottom: 8, width: "100%" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", marginBottom: 8, width: "100%" }}
            />
            <button type="submit">Sign In</button>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </form>
        </>
      )}
    </div>
  );
}
