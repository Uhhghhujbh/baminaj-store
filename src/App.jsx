import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Receipt from './pages/Receipt';
import Tracking from './pages/Tracking';
import Orders from './pages/Orders'; 

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} /> 
          
          {/* Protected / Dynamic Routes */}
          <Route path="/me" element={<Admin />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/track" element={<Tracking />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
