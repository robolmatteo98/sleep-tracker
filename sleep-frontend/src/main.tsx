import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AuthProvider } from "./pages/login/Auth";
import ProtectedRoute from "./pages/login/ProtectedRoute";

import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import SignUP from './pages/signUP/SignUP';

import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<SignUP />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  </StrictMode>,
)