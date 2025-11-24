import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WelcomePage from './pages/WelcomePage';
import AdminTalleresPage from './pages/AdminTalleresPage';
import InstructorPage from './pages/InstructorPage';
import Header from './components/Header';
import Layout from './components/Layout';


function App() {
  return (
    <Router>
      <Header />
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/talleres" element={<AdminTalleresPage />} />
          <Route path="/instructor/asistencia" element={<InstructorPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;