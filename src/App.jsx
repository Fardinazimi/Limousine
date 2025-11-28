import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import SignIn from "./pages/SignIn";
import { isAuthorized } from "./config/auth";

function RequireAuth({ children }) {
  const location = useLocation();
  if (!isAuthorized()) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
