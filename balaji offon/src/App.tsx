import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import FaceReg from './Face';
import Navbar from './components/Navbar';
import { register } from './serviceWorkerRegistration';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register service worker for offline functionality
    register();

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {!isOnline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Offline Mode</p>
          <p>You are currently offline. Some features may be limited.</p>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<FaceReg />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;