import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { EditLayoutPage } from './pages/EditLayoutPage';
import { ReadOnlyLayoutPage } from './pages/ReadOnlyLayoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <RequireAuth>
              <Layout>
                <DashboardPage />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/layout" 
          element={
            <RequireAuth>
              <Layout>
                <EditLayoutPage />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/layout/read-only/:id" 
          element={<ReadOnlyLayoutPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App; 