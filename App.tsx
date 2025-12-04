import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LabProvider } from './context/LabContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import MyReports from './pages/MyReports';
import Success from './pages/Success';
import Login from './pages/Login';
import ReportPage from './pages/ReportPage';

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <LabProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <div className="print:hidden">
            <Navbar />
          </div>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book/:testId" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/reports" element={<MyReports />} />
              <Route path="/report/:id" element={<ReportPage />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </main>
          
          <footer className="bg-gray-900 text-gray-400 py-12 px-4 print:hidden">
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">Ravi Diagnostic Lab</h3>
                  <p className="text-sm">Trusted by 10,000+ families for accurate pathology reports and home sample collection.</p>
                </div>
                <div>
                   <h4 className="text-white font-semibold mb-3">Services</h4>
                   <ul className="space-y-2 text-sm">
                     <li>Blood Tests</li>
                     <li>Full Body Checkups</li>
                     <li>Diabetes Screening</li>
                     <li>Thyroid Profiles</li>
                   </ul>
                </div>
                <div>
                   <h4 className="text-white font-semibold mb-3">Support</h4>
                   <ul className="space-y-2 text-sm">
                     <li>Help Center</li>
                     <li>My Reports</li>
                     <li>Contact Us</li>
                     <li>Terms of Service</li>
                   </ul>
                </div>
                <div>
                   <h4 className="text-white font-semibold mb-3">Contact</h4>
                   <p className="text-sm">support@ravidiagnostic.com</p>
                   <p className="text-sm">+91 98765 43210</p>
                </div>
             </div>
             <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
               © 2024 Ravi Diagnostic Lab. All rights reserved.
             </div>
          </footer>
        </div>
      </HashRouter>
    </LabProvider>
  );
};

export default App;