import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";



export default function App() {
  return (
    <div>
      <Header />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Account parent route */}
          <Route path="/account" element={<Account />}>
          
    
          </Route>
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
