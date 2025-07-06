import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Pegawai from './components/pages/Pegawai';
import PegawaiForm from './components/pages/PegawaiForm';
import Login from './components/pages/Login';
import FloatingLogout from './components/pages/FloatingLogout';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // misal token disimpan di sini
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <FloatingLogout />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/pegawai"
          element={
            <ProtectedRoute>
              <Pegawai />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pegawai/form"
          element={
            <ProtectedRoute>
              <PegawaiForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pegawai/form/:id"
          element={
            <ProtectedRoute>
              <PegawaiForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
