import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import PharmacyList from './pages/PharmacyList';
import PharmacyDetail from './pages/PharmacyDetail';
import { PharmacyProvider } from './context/PharmacyContext';

function App() {
  return (
    <PharmacyProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pharmacies" element={<PharmacyList />} />
              <Route path="/pharmacy/:id" element={<PharmacyDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PharmacyProvider>
  );
}

export default App;
