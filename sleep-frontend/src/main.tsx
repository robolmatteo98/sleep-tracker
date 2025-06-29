import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import Dashboard from './pages/dashboard/Dashboard';
import Details from './pages/details/Details';

import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path='/details' element={<Details />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)