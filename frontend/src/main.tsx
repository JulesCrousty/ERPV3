import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import TestItemsPage from './pages/TestItemsPage';
import ProtectedRoute from './components/ProtectedRoute';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={<ProtectedRoute><App /></ProtectedRoute>}
        >
          <Route path="" element={<Navigate to="/users" />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="test-items" element={<TestItemsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
