import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppListPage from './pages/AppListPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/common/PrivateRoute';
import Header from './components/layout/Header';
import './styles/App.css';

// A new component to handle navigation after authentication state changes.
const AppContent = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the user is authenticated and on a public page (login/register),
    // redirect them to the main app page.
    if (auth.isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
      navigate('/');
    }
  }, [auth.isAuthenticated, location.pathname, navigate]);

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/*' element={<PrivateRoute />}>
            <Route path="" element={<AppListPage />} />
            {/* The combined chat page now handles both new and existing chats */}
            <Route path="apps/:appCode/chat" element={<ChatPage />} />
            <Route path="apps/:appCode/chat/:conversationId" element={<ChatPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
